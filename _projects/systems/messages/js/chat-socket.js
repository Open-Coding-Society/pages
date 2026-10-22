// One STOMP-over-SockJS connection to Spring's /ws-chat for the whole page. It follows
// one topic at a time, /topic/dm/{id} or /topic/group/{id}, for the conversation that
// is open. Sending goes over REST; the socket only receives.

// The same cdnjs builds the course chats load, fetched once per page.
const SOCKJS_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.5.1/sockjs.min.js';
const STOMP_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js';

function loadScriptOnce(src) {
  window.__ocsChatScripts = window.__ocsChatScripts || {};
  if (!window.__ocsChatScripts[src]) {
    window.__ocsChatScripts[src] = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Could not load ${src}`));
      document.head.appendChild(script);
    });
  }
  return window.__ocsChatScripts[src];
}

export function createChatSocket(socketBaseUri, { onClose }) {
  let client = null;
  let subscription = null;
  let connected = false;

  async function connect() {
    if (connected) return true;
    try {
      await loadScriptOnce(SOCKJS_SRC);
      await loadScriptOnce(STOMP_SRC);
    } catch (error) {
      console.warn('Messages: the chat libraries did not load', error);
      return false;
    }
    return new Promise(resolve => {
      const socket = new window.SockJS(`${new URL(socketBaseUri).origin}/ws-chat`);
      client = window.Stomp.over(socket);
      client.debug = null;
      // stomp.js calls the error callback from its own ws.onclose, before and after
      // CONNECTED, so a close is handled here and ws.onclose is left alone.
      // disconnect() clears that handler, so leaving the page reports nothing.
      client.connect({}, () => {
        connected = true;
        resolve(true);
      }, error => {
        if (!connected) {
          console.warn('Messages: the chat connection failed', error);
          resolve(false);
          return;
        }
        connected = false;
        subscription = null;
        onClose();
      });
    });
  }

  function unfollow() {
    if (!subscription) return;
    subscription.unsubscribe();
    subscription = null;
  }

  // Replaces the topic being followed. Does nothing while offline.
  function follow(topic, onEvent) {
    unfollow();
    if (!connected) return;
    subscription = client.subscribe(topic, frame => {
      let event;
      try {
        event = JSON.parse(frame.body);
      } catch (error) {
        console.warn('Messages: unreadable chat frame', error);
        return;
      }
      onEvent(event);
    });
  }

  function disconnect() {
    unfollow();
    if (client && connected) client.disconnect();
    connected = false;
  }

  return { connect, follow, unfollow, disconnect, isConnected: () => connected };
}
