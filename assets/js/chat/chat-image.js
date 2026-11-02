// Reading an image a person pastes or attaches in a course chat
// (_projects/systems/courses/_includes/announcement_chat.html). rich-text.js re-exports it.
//
// The same rule as /dm's readImageFile (_projects/systems/messages/js/dialogs.js), which
// keeps its own copy because the Messages modules only import each other with ./ paths;
// change both together. Returns a data URL, downscaled so the long edge is at most
// MAX_IMAGE_EDGE: a group's messages are one file that Spring reads and rewrites on every
// send, so a full-size phone photo would slow every later read of the chat. PNGs stay
// PNG so screenshots of text keep crisp edges; anything else is re-encoded as JPEG.
const MAX_IMAGE_EDGE = 1280;
const MAX_UNSCALED_LENGTH = 600000;

export function readImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file || !String(file.type).startsWith('image/')) {
      reject(new Error('That file is not an image.'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('That file is not an image.'));
      image.onload = () => {
        const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(image.width, image.height));
        if (scale === 1 && reader.result.length < MAX_UNSCALED_LENGTH) {
          resolve(reader.result);
          return;
        }
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        const isPng = /^data:image\/png/.test(reader.result);
        resolve(canvas.toDataURL(isPng ? 'image/png' : 'image/jpeg', 0.82));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
