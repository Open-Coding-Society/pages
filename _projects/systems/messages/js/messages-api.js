// Every request the Messages page makes to Spring and Flask, in one place. Each call
// resolves to the response's JSON (null for an empty body) and rejects with an Error
// that names the request and carries its HTTP status, so callers can say what failed.

export function createMessagesApi({ javaURI, pythonURI, fetchOptions }) {
  async function request(base, path, method = 'GET', body) {
    const options = { ...fetchOptions, method };
    if (body !== undefined) options.body = JSON.stringify(body);
    const response = await fetch(`${base}${path}`, options);
    if (!response.ok) {
      const error = new Error(`${method} ${path} answered HTTP ${response.status}`);
      error.status = response.status;
      throw error;
    }
    const text = await response.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
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
    sendDm: (id, body) => spring(`/api/dm/conversations/${part(id)}/messages`, 'POST', { body }),
    editDm: (id, messageId, body) => spring(`/api/dm/conversations/${part(id)}/messages/${part(messageId)}`, 'PATCH', { body }),
    deleteDm: (id, messageId) => spring(`/api/dm/conversations/${part(id)}/messages/${part(messageId)}`, 'DELETE'),
    markDmRead: id => spring(`/api/dm/conversations/${part(id)}/read`, 'POST'),

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
    sendGroupMessage: (groupId, name, message) => spring(`/api/groups/chat/${part(groupId)}/messages`, 'POST', { name, message }),
    editGroupMessage: (groupId, messageId, message) => spring(`/api/groups/chat/${part(groupId)}/messages/${part(messageId)}`, 'PATCH', { message }),
    deleteGroupMessage: (groupId, messageId) => spring(`/api/groups/chat/${part(groupId)}/messages/${part(messageId)}`, 'DELETE'),
    groupFiles: groupId => spring(`/api/groups/chat/${part(groupId)}/files`),
    uploadGroupFile: (groupId, filename, base64Data) => spring(`/api/groups/chat/${part(groupId)}/files`, 'POST', { filename, base64Data }),

    personaCoverage: userUids => flask('/api/persona/evaluate-group', 'POST', { user_uids: userUids }),
    formGroups: (userUids, groupSize, feedbackRows = []) => flask('/api/persona/form-groups', 'POST', {
      user_uids: userUids,
      group_size: groupSize,
      incorporate_prior_experiences: feedbackRows.length > 0,
      feedback_rows: feedbackRows,
    }),
  };
}
