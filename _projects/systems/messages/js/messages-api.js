// Every request the Messages page makes to Spring and Flask, in one place. Each call
// resolves to the response's JSON (null for an empty body) and rejects with an Error
// that names the request and carries its HTTP status, so callers can say what failed.

// `createRequest` makes the XMLHttpRequest an upload uses (fetch can't report upload
// progress); tests pass a stand-in.
export function createMessagesApi({
  javaURI, pythonURI, fetchOptions, createRequest = () => new XMLHttpRequest(),
}) {
  const failure = (method, path, status) => Object.assign(new Error(`${method} ${path} answered HTTP ${status}`), { status });

  async function send(base, path, method = 'GET', body) {
    const options = { ...fetchOptions, method };
    if (body !== undefined) options.body = JSON.stringify(body);
    const response = await fetch(`${base}${path}`, options);
    if (!response.ok) throw failure(method, path, response.status);
    return response;
  }

  async function request(base, path, method = 'GET', body) {
    const response = await send(base, path, method, body);
    const text = await response.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  // A JSON POST through XMLHttpRequest, with the same credentials and headers as fetch, so
  // a big upload can report how far it has got. Rejects with the status like request(),
  // and with an AbortError when `signal` aborts it.
  function postWithProgress(path, body, { onProgress = null, signal = null } = {}) {
    return new Promise((resolve, reject) => {
      const xhr = createRequest();
      xhr.open('POST', `${javaURI}${path}`);
      xhr.withCredentials = fetchOptions.credentials === 'include';
      Object.entries(fetchOptions.headers || {}).forEach(([name, value]) => xhr.setRequestHeader(name, value));
      xhr.upload.onprogress = event => {
        if (event.lengthComputable && onProgress) onProgress(event.loaded, event.total);
      };
      xhr.onload = () => {
        if (xhr.status < 200 || xhr.status >= 300) {
          reject(failure('POST', path, xhr.status));
          return;
        }
        try {
          resolve(xhr.responseText ? JSON.parse(xhr.responseText) : null);
        } catch {
          resolve(xhr.responseText);
        }
      };
      xhr.onerror = () => reject(failure('POST', path, 0));
      xhr.onabort = () => reject(Object.assign(new Error(`POST ${path} was cancelled`), { name: 'AbortError' }));
      if (signal) {
        if (signal.aborted) {
          reject(Object.assign(new Error(`POST ${path} was cancelled`), { name: 'AbortError' }));
          return;
        }
        signal.addEventListener('abort', () => xhr.abort(), { once: true });
      }
      xhr.send(JSON.stringify(body));
    });
  }

  const spring = (path, method, body) => request(javaURI, path, method, body);
  const flask = (path, method, body) => request(pythonURI, path, method, body);
  const part = value => encodeURIComponent(value);

  return {
    currentPerson: () => spring('/api/person/get'),
    searchPeople: query => spring(`/api/people/search?query=${part(query)}`),

    conversations: () => spring('/api/dm/conversations'),
    startConversation: otherPersonIds => spring('/api/dm/conversations', 'POST', { otherPersonIds }),
    dmMessages: id => spring(`/api/dm/conversations/${part(id)}/messages`),
    sendDm: (id, body, image = null) => spring(`/api/dm/conversations/${part(id)}/messages`, 'POST', { body, image }),
    editDm: (id, messageId, body) => spring(`/api/dm/conversations/${part(id)}/messages/${part(messageId)}`, 'PATCH', { body }),
    deleteDm: (id, messageId) => spring(`/api/dm/conversations/${part(id)}/messages/${part(messageId)}`, 'DELETE'),
    markDmRead: id => spring(`/api/dm/conversations/${part(id)}/read`, 'POST'),
    // Messages in your own conversations whose text contains the query, newest first.
    // With a conversation id, only that conversation is searched.
    searchDms: (query, conversationId) => spring(
      `/api/dm/search?q=${part(query)}${conversationId ? `&conversationId=${part(conversationId)}` : ''}`,
    ),

    // Adds one event to the signed-in person's calendar (Spring files it under them when no
    // `individual` is sent).
    addCalendarEvent: event => spring('/api/calendar/add_event', 'POST', event),
    // A gist, read through Spring for its GitHub card: it doesn't count against GitHub's
    // hourly limit for the network.
    readGist: id => spring(`/api/grades/read-gist/${part(id)}`),
    // A secret gist made with the signed-in student's GitHub token, which Spring keeps
    // (Profile's Gist card): files is { name: { content } }. Resolves { success, url }; 409
    // when no token is connected.
    createGist: (files, description) => spring('/api/grades/create-gist', 'POST', { files, description }),
    // Runs a code block on the routes the lesson code runners use: Flask runs Python and
    // JavaScript, Spring runs Java. Resolves the program's output.
    runCode: async (language, code) => {
      const [base, path] = language === 'java' ? [javaURI, '/run/java'] : [pythonURI, `/run/${part(language)}`];
      const result = await request(base, path, 'POST', { code });
      return String(result?.output ?? '');
    },

    myGroups: personId => spring(`/api/groups/person/${part(personId)}`),
    allGroups: () => spring('/api/groups'),
    searchGroups: name => spring(`/api/groups/search?name=${part(name)}`),
    createGroup: group => spring('/api/groups', 'POST', group),
    deleteGroup: groupId => spring(`/api/groups/${part(groupId)}`, 'DELETE'),
    addMember: (groupId, personId) => spring(`/api/groups/${part(groupId)}/members/${part(personId)}`, 'POST'),
    removeMember: (groupId, personId) => spring(`/api/groups/${part(groupId)}/members/${part(personId)}`, 'DELETE'),

    // A saved group message stores only its sender's name, and Spring checks that name
    // before an edit or delete, so `name` must be the account's name.
    groupMessages: groupId => spring(`/api/groups/chat/${part(groupId)}/messages`),
    // No sender is sent: Spring resolves the author from the session and ignores
    // anything the client claims. `image` is a data URL, stored on the message itself;
    // null when the message is text only.
    sendGroupMessage: (groupId, message, image = null) => spring(`/api/groups/chat/${part(groupId)}/messages`, 'POST', { message, image }),
    editGroupMessage: (groupId, messageId, message) => spring(`/api/groups/chat/${part(groupId)}/messages/${part(messageId)}`, 'PATCH', { message }),
    deleteGroupMessage: (groupId, messageId) => spring(`/api/groups/chat/${part(groupId)}/messages/${part(messageId)}`, 'DELETE'),
    // Unread counts for group chat, the group-side twin of /api/dm/unread. Groups with
    // nothing unread are absent from unreadByGroup rather than present as zero.
    groupUnread: () => spring('/api/groups/chat/unread'),
    markGroupRead: groupId => spring(`/api/groups/chat/${part(groupId)}/read`, 'POST'),

    // A group's shared files by path, with each one's size and who shared it, but no bytes.
    groupFileIndex: groupId => spring(`/api/groups/chat/${part(groupId)}/files/index`),
    // One shared file's bytes, as a Blob.
    groupFileContent: async (groupId, path) => (await send(javaURI, `/api/groups/chat/${part(groupId)}/files/content?path=${part(path)}`)).blob(),
    // Shares one file. A file from a folder keeps its folders in `filename` ("project/src/Main.java").
    uploadGroupFileWithProgress: (groupId, filename, base64Data, options) => postWithProgress(
      `/api/groups/chat/${part(groupId)}/files`, { filename, base64Data }, options,
    ),

    personaCoverage: userUids => flask('/api/persona/evaluate-group', 'POST', { user_uids: userUids }),
    formGroups: (userUids, groupSize, feedbackRows = []) => flask('/api/persona/form-groups', 'POST', {
      user_uids: userUids,
      group_size: groupSize,
      incorporate_prior_experiences: feedbackRows.length > 0,
      feedback_rows: feedbackRows,
    }),
  };
}
