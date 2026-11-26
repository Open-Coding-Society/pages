// livekit-client's browser build, loaded once and only by the call page, the way the Messages
// chat loads SockJS and STOMP from cdnjs. Pinned to an exact version with its Subresource
// Integrity hash (cdnjs's own), so a changed file is refused instead of run.

/** LiveKitScript.load() gives the window.LivekitClient namespace. */
export class LiveKitScript {
  static VERSION = '2.23.0';

  static SRC = `https://cdnjs.cloudflare.com/ajax/libs/livekit-client/${LiveKitScript.VERSION}/livekit-client.umd.min.js`;

  static INTEGRITY = 'sha512-S1NfmnhPFgfaM2kf1lkvt69rYKiLo3fhLzYt+BEZXHHcSImKWqT8JA9+JBqKMpOwkn2uLP+57RWMB7W6nIdIjg==';

  static load() {
    if (window.LivekitClient) return Promise.resolve(window.LivekitClient);
    window.__ocsCallScripts = window.__ocsCallScripts || {};
    if (!window.__ocsCallScripts[LiveKitScript.SRC]) {
      window.__ocsCallScripts[LiveKitScript.SRC] = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = LiveKitScript.SRC;
        script.integrity = LiveKitScript.INTEGRITY;
        script.crossOrigin = 'anonymous';
        script.referrerPolicy = 'no-referrer';
        script.onload = () => (window.LivekitClient ? resolve(window.LivekitClient) : reject(new Error('livekit-client loaded without LivekitClient')));
        script.onerror = () => {
          delete window.__ocsCallScripts[LiveKitScript.SRC];
          reject(new Error(`Could not load ${LiveKitScript.SRC}`));
        };
        document.head.appendChild(script);
      });
    }
    return window.__ocsCallScripts[LiveKitScript.SRC];
  }
}
