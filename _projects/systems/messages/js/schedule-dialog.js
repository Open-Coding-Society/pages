// "Add to calendar": a dialog opened from a message's toolbar. It starts from what the
// message says (see schedule-model.js), lets the person correct the title, day and time,
// and saves one event to their own calendar.
import { createDialog } from './dialogs.js';
import {
  buildCalendarEvent, dateKey, dateLabel, guessEventDate, guessEventTime, MAX_TITLE_LENGTH, plainText, suggestTitle,
} from './schedule-model.js';

// `stripMarkers` takes the markers chat adds to a body (a reply's `[[reply:...]]`) out of
// it. The page passes richText.stripChatMarkers, which knows every kind there is; a host
// whose richText has none shows bodies as stored.
export function initScheduleDialog({
  elements, api, chatUrl = () => '', stripMarkers = text => text, onScheduled = () => {}, now = () => new Date(),
}) {
  let message = null;
  let saving = false;
  const dialog = createDialog(elements.dialog, { onClose: () => { message = null; } });

  function show(text) {
    elements.status.textContent = text;
  }

  function open(source, opener) {
    // The message's body as stored. suggestTitle and buildCalendarEvent turn it into text
    // themselves, once, so it is handed to them as it is and not as `text`: converting it
    // here as well would decode it twice, and "&amp;lt;" would come out as a real "<".
    // A reply's marker is not part of what the person wrote, so it is left out first.
    const body = stripMarkers(String(source.body ?? ''));
    const text = plainText(body); // only for finding a day and a time in it
    message = { ...source, body };
    saving = false;
    elements.title.maxLength = MAX_TITLE_LENGTH;
    elements.title.value = suggestTitle(body, MAX_TITLE_LENGTH);
    // No date mentioned: today, so the form is never empty and Save works after a title tweak.
    elements.date.value = guessEventDate(text, now()) || dateKey(now());
    elements.time.value = guessEventTime(text) || '';
    elements.save.disabled = false;
    show('');
    dialog.open(opener);
  }

  elements.form.addEventListener('submit', async event => {
    event.preventDefault();
    if (saving || !message) return;
    let request;
    try {
      request = buildCalendarEvent({
        title: elements.title.value,
        date: elements.date.value,
        time: elements.time.value,
        text: message.body,
        chatUrl: chatUrl(),
      });
    } catch (error) {
      show(error.message);
      return;
    }
    saving = true;
    elements.save.disabled = true;
    show('Saving…');
    try {
      await api.addCalendarEvent(request);
    } catch (error) {
      console.warn('Messages: could not add the calendar event', error);
      saving = false;
      elements.save.disabled = false;
      show(error.status === 401 || error.status === 403
        ? 'You are signed out. Sign in again, then try again.'
        : 'Could not save the event. Try again.');
      return;
    }
    dialog.close();
    onScheduled(`Added “${request.title}” to your calendar for ${dateLabel(request.date)}.`);
  });

  return { open };
}
