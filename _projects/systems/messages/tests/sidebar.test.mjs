// sidebar.js builds DOM, so it gets a stub rather than a real document: these tests
// are about the order rows come out in, not about the elements themselves.
import assert from 'node:assert/strict';
import test from 'node:test';

globalThis.document = {
  createElement(tag) {
    return {
      tag,
      className: '',
      dataset: {},
      children: [],
      classList: { add() {}, contains: () => false },
      setAttribute() {},
      appendChild(child) { this.children.push(child); },
      addEventListener() {},
      set textContent(value) { this._text = value; },
      get textContent() { return this._text; },
    };
  },
};

const { createSidebar } = await import('../js/sidebar.js');

const collector = () => ({ rows: [], replaceChildren(...kids) { this.rows = kids; } });
const titles = list => list.rows.map(row => row.children.find(c => c.className === 'ocs__nav-card-title')?.textContent);
const dm = (id, name, unreadCount) => ({ id, participants: [{ name }], unreadCount });

test('unread conversations sort above read ones', () => {
  const dmList = collector();
  const sidebar = createSidebar({ groupList: collector(), dmList, onOpen() {} });

  sidebar.render({
    groups: [],
    conversations: [dm(1, 'Ada', 0), dm(2, 'Blaise', 3), dm(3, 'Curie', 0), dm(4, 'Dijkstra', 1)],
    active: null,
  });

  assert.deepEqual(titles(dmList), ['Blaise', 'Dijkstra', 'Ada', 'Curie']);
});

test('the order the server sent is kept within the unread and the read halves', () => {
  const dmList = collector();
  const sidebar = createSidebar({ groupList: collector(), dmList, onOpen() {} });

  sidebar.render({
    groups: [],
    conversations: [dm(1, 'Ada', 0), dm(2, 'Blaise', 0), dm(3, 'Curie', 0)],
    active: null,
  });

  assert.deepEqual(titles(dmList), ['Ada', 'Blaise', 'Curie']);
});

// Sorting on the flag, not the count: a conversation you are reading should not jump
// around as messages arrive, and a louder conversation should not outrank an older one.
test('two unread conversations keep their order whatever their counts', () => {
  const dmList = collector();
  const sidebar = createSidebar({ groupList: collector(), dmList, onOpen() {} });

  sidebar.render({
    groups: [],
    conversations: [dm(1, 'Ada', 1), dm(2, 'Blaise', 99)],
    active: null,
  });

  assert.deepEqual(titles(dmList), ['Ada', 'Blaise']);
});

test('render does not reorder the array it was handed', () => {
  const dmList = collector();
  const sidebar = createSidebar({ groupList: collector(), dmList, onOpen() {} });

  const conversations = [dm(1, 'Ada', 0), dm(2, 'Blaise', 2)];
  const before = conversations.map(conversation => conversation.id);
  sidebar.render({ groups: [], conversations, active: null });

  assert.deepEqual(conversations.map(conversation => conversation.id), before);
});
