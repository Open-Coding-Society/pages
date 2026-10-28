import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import {
    BoardError, boardConfig, cacheState, columnCards, filterCards, normalizeBoard, parseBoardUrl, pickFields, readEntry,
    refreshBoard, repoStatusOf, repoToProject, stageOf, writeEntry,
} from '../assets/js/kanban-board.js';

// The board's defaults, read from _data/kanban.yml with Ruby's YAML, the parser
// Jekyll uses. A missing or broken file fails here; only a machine without Ruby
// skips the tests that need it.
let hasRuby = true;
try { execFileSync('ruby', ['-v']); } catch (_) { hasRuby = false; }
const KANBAN_YML = fileURLToPath(new URL('../_data/kanban.yml', import.meta.url));
const DEFAULTS = hasRuby
    ? JSON.parse(execFileSync('ruby', ['-ryaml', '-rjson', '-e', 'puts JSON.generate(YAML.load_file(ARGV[0]))', KANBAN_YML], { encoding: 'utf8' }))
    : null;
const yaml = { skip: hasRuby ? false : 'needs Ruby to read _data/kanban.yml' };
const CONFIG = DEFAULTS && boardConfig(DEFAULTS);
// Our capstone's own columns list (_data/communication_system_infograph.yml):
// UGRC-CSA's two note columns stay off its board.
const OURS = DEFAULTS && boardConfig(DEFAULTS, [{ status: '📌 Team Map', hidden: true }, { status: '🪞 Reflections', hidden: true }]);
// The defaults with one stage changed, to show the board follows the data.
const withStage = (key, change) => boardConfig({ ...DEFAULTS, stages: DEFAULTS.stages.map((stage) => (stage.key === key ? { ...stage, ...change(stage) } : stage)) });

// Shaped like GitHub's REST projectsV2 responses (fields, items), trimmed to
// one small board: UGRC-CSA's columns and its Team / People / Shipped fields.
const BOARD_URL = 'https://github.com/orgs/UGRC-CSA/projects/1';
const API = 'https://api.github.com/orgs/UGRC-CSA/projectsV2/1';
const MINUTE = 60 * 1000;

const option = (name) => ({ id: name.length.toString(16), name: { raw: name, html: name }, description: { raw: '', html: '' }, color: 'GRAY' });

const PROJECT = { id: 25546066, number: 1, title: 'UGRC-CSA — Team Kanban', public: true, updated_at: '2026-10-15T16:49:43Z' };
const FIELDS = [
    { id: 1, name: 'Title', data_type: 'title' },
    { id: 2, name: 'Assignees', data_type: 'assignees' },
    { id: 3, name: 'Status', data_type: 'single_select', options: ['📌 Team Map', '💡 Backlog', '📋 To Do', '🚧 In Progress', '👀 In Review', '✅ Done', '🪞 Reflections'].map(option) },
    { id: 4, name: 'Team', data_type: 'single_select', options: ['Chat + Calendar', 'SASS', 'DMs', 'Everyone'].map(option) },
    { id: 5, name: 'People', data_type: 'multi_select', options: ['Sathwik', 'Samarth', 'Tarun'].map(option) },
    { id: 6, name: 'Shipped', data_type: 'date' },
    { id: 7, name: 'Linked pull requests', data_type: 'linked_pull_requests' },
];

const statusValue = (name) => ({ id: 3, name: 'Status', data_type: 'single_select', value: name ? option(name) : null });
const teamValue = (name) => ({ id: 4, name: 'Team', data_type: 'single_select', value: option(name) });
const peopleValue = (...names) => ({ id: 5, name: 'People', data_type: 'multi_select', value: { options: names.map(option) } });

function item(id, contentType, content, fields, updatedAt) {
    return {
        id, node_id: `PVTI_${id}`, project_url: API, content_type: contentType, content,
        creator: { login: 'Wick2009' }, created_at: '2026-10-14T02:00:00Z', updated_at: updatedAt,
        archived_at: null, item_url: `${API}/items/${id}`, fields,
    };
}

const draft = (title) => ({ id: 1, title, body: 'Draft body', created_at: '2026-10-13T19:20:54.000-07:00', updated_at: '2026-10-14T00:35:03.000-07:00', user: { login: 'Wick2009' } });

const ISSUE = item(101, 'Issue', {
    number: 25, title: 'Class-wide + per-week chat', html_url: 'https://github.com/UGRC-CSA/Pages/issues/25',
    state: 'closed', closed_at: '2026-10-10T18:00:00Z', assignees: [],
}, [statusValue('✅ Done'), teamValue('Chat + Calendar'), peopleValue('Sathwik'),
    { id: 6, name: 'Shipped', data_type: 'date', value: '2026-10-09T00:00:00+00:00' }], '2026-10-14T02:20:00Z');
const SASS_DRAFT = item(102, 'DraftIssue', draft('Lesson sidebar on ocs__tree'),
    [statusValue('🚧 In Progress'), teamValue('SASS'), peopleValue('Samarth', 'Tarun')], '2026-10-15T16:49:43Z');
const TEAM_MAP = item(103, 'DraftIssue', draft('Start here: who is working on what'),
    [statusValue('📌 Team Map'), teamValue('Everyone')], '2026-10-16T00:00:00Z');
const SHARED_DRAFT = item(104, 'DraftIssue', draft('Sprint 3 team plan issue'),
    [statusValue('📋 To Do'), teamValue('Everyone')], '2026-10-14T03:00:00Z');
const PULL = item(105, 'PullRequest', {
    number: 1800, title: 'Calendar owner check', html_url: 'https://github.com/Open-Coding-Society/pages/pull/1800',
    state: 'open', closed_at: null, merged_at: null, assignees: [{ login: 'Wick2009' }],
}, [statusValue('👀 In Review'), teamValue('Chat + Calendar')], '2026-10-14T04:00:00Z');
const ITEMS = [ISSUE, SASS_DRAFT, TEAM_MAP, SHARED_DRAFT, PULL];

/* ── Stages, URLs, fields ────────────────────────────────────────────── */

test('statuses from different boards land on the shared stages; a status with no stage words has none', yaml, () => {
    const cases = {
        '📋 To Do': 'todo', '🚧 In Progress': 'doing', '👀 In Review': 'review', '✅ Done': 'done',
        '💡 Backlog': 'backlog', Todo: 'todo', Planning: 'backlog', '': null,
        '📌 Team Map': null, '🪞 Reflections': null, 'Ground 0': null,
    };
    for (const [status, stage] of Object.entries(cases)) assert.equal(stageOf(status, CONFIG), stage, status);
});

test('the column names in OCS\'s issue lifecycle land on their stages', yaml, () => {
    const cases = { 'Parking Lot': 'backlog', 'Parking lot': 'backlog', 'Backlog (parking lot)': 'backlog', ToDo: 'todo', 'In Progress': 'doing', 'In Review': 'review', Done: 'done' };
    for (const [status, stage] of Object.entries(cases)) assert.equal(stageOf(status, CONFIG), stage, status);
});

test('blocked or waiting work stays in progress, released work is done, and a status naming two stages takes the later one', yaml, () => {
    const cases = {
        '🚫 Blocked': 'doing', 'On hold': 'doing', 'Waiting on mentor': 'doing', Stuck: 'doing', 'In progress (blocked)': 'doing',
        'Waiting for review': 'review', 'Ready for review': 'review', Released: 'done', Deployed: 'done', Finished: 'done', Resolved: 'done',
    };
    for (const [status, stage] of Object.entries(cases)) assert.equal(stageOf(status, CONFIG), stage, status);
});

test('a stage\'s words, its name and whether it starts collapsed all come from _data/kanban.yml', yaml, () => {
    const config = withStage('todo', (stage) => ({ label: 'Up next', words: [...stage.words, 'define'], collapsed: true }));
    assert.equal(stageOf('Define', config), 'todo');
    const fields = [{ id: 3, name: 'Status', data_type: 'single_select', options: ['Define', 'Done'].map(option) }];
    const board = normalizeBoard({ project: PROJECT, fields, items: [] }, { url: BOARD_URL, config });
    assert.deepEqual(board.columns.map((c) => [c.label, c.collapsed]), [['Up next', true], ['Done', false]]);
});

test('board addresses become API paths; anything that is not a GitHub project is refused', () => {
    const org = { apiPath: 'orgs/UGRC-CSA/projectsV2/1', url: BOARD_URL, personal: false };
    assert.deepEqual(parseBoardUrl(BOARD_URL), org);
    assert.deepEqual(parseBoardUrl('https://github.com/orgs/UGRC-CSA/projects/1/views/2?pane=x'), org);
    assert.deepEqual(parseBoardUrl('https://github.com/orgs/UGRC-CSA/projects/1/'), org);
    // GitHub answers 401 for a personal board's items without a token, so the
    // embed has to know a board is personal before it asks.
    assert.deepEqual(parseBoardUrl('https://github.com/users/Ahaanv19/projects/1'),
        { apiPath: 'users/Ahaanv19/projectsV2/1', url: 'https://github.com/users/Ahaanv19/projects/1', personal: true });
    assert.equal(parseBoardUrl('https://github.com/UGRC-CSA/Pages'), null);
    assert.equal(parseBoardUrl('https://example.com/orgs/UGRC-CSA/projects/1'), null);
    assert.equal(parseBoardUrl('not a url'), null);
});

test('fields are found by the names in the data, in any case, and a filter the board lacks is left out', yaml, () => {
    const picked = pickFields(FIELDS, 'team', CONFIG);
    assert.deepEqual(picked.status, { id: 3, name: 'Status', options: ['📌 Team Map', '💡 Backlog', '📋 To Do', '🚧 In Progress', '👀 In Review', '✅ Done', '🪞 Reflections'] });
    assert.deepEqual(picked.group, { id: 4, name: 'Team', options: ['Chat + Calendar', 'SASS', 'DMs', 'Everyone'] });
    assert.equal(picked.people.id, 5);
    assert.equal(picked.shipped.id, 6);
    // Linked pull requests is found by its type: GitHub names it, not the board.
    assert.equal(picked.prs.id, 7);
    assert.deepEqual(picked.details, []);
    assert.equal(pickFields(FIELDS, 'Squad', CONFIG).group, null);
    // A board whose status field has another name still gets columns.
    const stage = { id: 9, name: 'Stage', data_type: 'single_select', options: [option('Todo')] };
    assert.equal(pickFields([FIELDS[0], stage], '', CONFIG).status.id, 9);
    // The names themselves are data.
    const members = { id: 8, name: 'Members', data_type: 'multi_select', options: [option('Sathwik')] };
    const config = boardConfig({ ...DEFAULTS, fields: { ...DEFAULTS.fields, people: 'Members' } });
    assert.equal(pickFields([...FIELDS, members], '', config).people.id, 8);
});

/* ── Normalizing ─────────────────────────────────────────────────────── */

test('a board keeps its work cards with links, groups, people and shipped dates', yaml, () => {
    const board = normalizeBoard({ project: PROJECT, fields: FIELDS, items: ITEMS }, { filterName: 'Team', url: BOARD_URL, config: OURS });
    assert.equal(board.title, 'UGRC-CSA — Team Kanban');
    assert.equal(board.url, BOARD_URL);
    assert.deepEqual(board.cards.map((c) => c.title),
        ['Class-wide + per-week chat', 'Lesson sidebar on ocs__tree', 'Sprint 3 team plan issue', 'Calendar owner check']);
    assert.deepEqual(board.cards.map((c) => c.stage), ['done', 'doing', 'todo', 'review']);

    const [issue, sass, shared, pull] = board.cards;
    assert.equal(issue.url, 'https://github.com/UGRC-CSA/Pages/issues/25');
    assert.equal(issue.number, 25);
    assert.equal(issue.shipped, '2026-10-09');
    assert.equal(issue.group, 'Chat + Calendar');
    assert.equal(sass.url, `${BOARD_URL}?pane=issue&itemId=102`);
    assert.equal(sass.number, null);
    assert.deepEqual(sass.people, ['Samarth', 'Tarun']);
    assert.equal(shared.group, 'Everyone');
    assert.deepEqual(pull.people, ['Wick2009']);
    assert.equal(pull.shipped, null);

    // Columns follow the board's Status options in order; our page hides Team
    // Map and Reflections, and the backlog keeps the board's own name for it.
    assert.deepEqual(board.columns.map((c) => c.label), ['💡 Backlog', 'To do', 'In progress', 'In review', 'Done']);
    assert.deepEqual(board.columns.map((c) => c.collapsed), [true, false, false, false, false]);
    assert.equal(issue.column, 'done');

    // DMs has no card on this board, so it gets no filter button.
    assert.deepEqual(board.groups, ['Chat + Calendar', 'SASS']);
    assert.deepEqual(board.shared, ['Everyone']);
    // The hidden Team Map card changed last, but it isn't on the embed.
    assert.equal(board.updated, '2026-10-15T16:49:43Z');
});

test('nothing about one team\'s board is in the code: without our page\'s list, Team Map and Reflections are columns', yaml, () => {
    const board = normalizeBoard({ project: PROJECT, fields: FIELDS, items: ITEMS }, { url: BOARD_URL, config: CONFIG });
    assert.deepEqual(board.columns.map((c) => c.label), ['📌 Team Map', '💡 Backlog', 'To do', 'In progress', 'In review', 'Done', '🪞 Reflections']);
    assert.ok(board.cards.some((c) => c.title === 'Start here: who is working on what'));
});

test('a capstone renames, merges, collapses or hides a column from its own columns list', yaml, () => {
    const fields = [{ id: 3, name: 'Status', data_type: 'single_select', options: ['Todo', 'In progress', 'Done', 'Ground 0', 'Notes'].map(option) }];
    const config = boardConfig(DEFAULTS, [
        { status: 'Todo', label: 'ToDo' },          // its own column, by this name
        { status: 'Ground 0', stage: 'backlog' },   // into the backlog
        { status: 'Notes', hidden: true },          // off the board
        { status: 'done', collapsed: true },        // matched in any case; starts collapsed
        { label: 'no status named' },               // ignored
    ]);
    const items = [
        item(701, 'DraftIssue', draft('Anvay - Ground 0'), [statusValue('Ground 0')], '2026-10-22T00:00:00Z'),
        item(702, 'DraftIssue', draft('Meeting notes'), [statusValue('Notes')], '2026-10-22T00:00:00Z'),
    ];
    const board = normalizeBoard({ project: PROJECT, fields, items }, { url: BOARD_URL, config });
    assert.deepEqual(board.columns.map((c) => [c.label, c.collapsed]),
        [['ToDo', false], ['In progress', false], ['Done', true], ['Ground 0', true]]);
    assert.deepEqual(board.cards.map((c) => [c.title, c.column]), [['Anvay - Ground 0', 'backlog']]);
});

test('a done card without a Shipped date uses the day its issue closed', yaml, () => {
    const closed = item(106, 'Issue', { ...ISSUE.content, closed_at: '2026-10-12T03:00:00Z' }, [statusValue('✅ Done')], '2026-10-12T03:00:00Z');
    const [card] = normalizeBoard({ project: PROJECT, fields: FIELDS, items: [closed] }, { url: BOARD_URL, config: CONFIG }).cards;
    assert.equal(card.shipped, '2026-10-12');
});

test('a card links only to github.com; any other address opens it on the board instead', yaml, () => {
    const odd = item(108, 'Issue', { ...ISSUE.content, html_url: 'javascript:alert(1)' }, [statusValue('📋 To Do')], '2026-10-14T06:00:00Z');
    const [card] = normalizeBoard({ project: PROJECT, fields: FIELDS, items: [odd] }, { url: BOARD_URL, config: CONFIG }).cards;
    assert.equal(card.url, `${BOARD_URL}?pane=issue&itemId=108`);
});

// GitHub's default board: Todo / In Progress / Done and nothing else.
const MINIMAL_FIELDS = [
    { id: 1, name: 'Title', data_type: 'title' },
    { id: 3, name: 'Status', data_type: 'single_select', options: ['Todo', 'In Progress', 'Done'].map(option) },
];

test('cards with no status get a No status column, open unless the board has a collapsed column of its own', yaml, () => {
    const noStatus = item(107, 'DraftIssue', draft('Idea'), [statusValue(null)], '2026-10-14T05:00:00Z');

    // A minimal board has nowhere else to put them, so they show first, like GitHub's "No Status".
    const minimal = normalizeBoard({ project: PROJECT, fields: MINIMAL_FIELDS, items: [noStatus] }, { url: BOARD_URL, config: CONFIG });
    assert.deepEqual(minimal.columns.map((c) => c.label), ['No status', 'To do', 'In progress', 'Done']);
    assert.equal(minimal.columns[0].collapsed, false);
    assert.equal(minimal.cards[0].column, 'none');

    // A board with a collapsed Backlog keeps them collapsed with it.
    const withBacklog = normalizeBoard({ project: PROJECT, fields: FIELDS, items: [noStatus] }, { url: BOARD_URL, config: OURS });
    assert.equal(withBacklog.columns[0].label, 'No status');
    assert.equal(withBacklog.columns[0].collapsed, true);

    const empty = normalizeBoard({ project: PROJECT, fields: FIELDS, items: [] }, { filterName: 'Team', url: BOARD_URL, config: OURS });
    assert.deepEqual(empty.cards, []);
    assert.equal(empty.updated, null);
    assert.equal(empty.columns.some((c) => c.key === 'none'), false);
});

test('what the board says comes from the data too', yaml, () => {
    const config = boardConfig({ ...DEFAULTS, text: { ...DEFAULTS.text, no_status: 'Unsorted', untitled: 'A card' } });
    const nameless = item(108, 'DraftIssue', { ...draft(''), title: '' }, [statusValue(null)], '2026-10-14T05:00:00Z');
    const board = normalizeBoard({ project: { title: '' }, fields: MINIMAL_FIELDS, items: [nameless] }, { url: BOARD_URL, config });
    assert.equal(board.columns[0].label, 'Unsorted');
    assert.equal(board.cards[0].title, 'A card');
    assert.equal(board.title, DEFAULTS.text.title);
});

test('a status the stages don\'t know keeps a column of its own name, in the board\'s order', yaml, () => {
    const fields = [{ id: 3, name: 'Status', data_type: 'single_select', options: ['Todo', 'In progress', 'Done', 'Ground 0'].map(option) }];
    const items = [
        item(301, 'DraftIssue', draft('Set up the rig'), [statusValue('Todo')], '2026-10-14T00:00:00Z'),
        item(302, 'DraftIssue', draft('Anvay - Ground 0'), [statusValue('Ground 0')], '2026-10-14T00:00:00Z'),
        // A status the board no longer lists (its option was deleted) still shows, at the end.
        item(303, 'DraftIssue', draft('Old idea'), [statusValue('Someday maybe')], '2026-10-14T00:00:00Z'),
    ];
    const board = normalizeBoard({ project: PROJECT, fields, items }, { url: BOARD_URL, config: CONFIG });
    // No In review column: this board doesn't have one.
    assert.deepEqual(board.columns.map((c) => c.label), ['To do', 'In progress', 'Done', 'Ground 0', 'Someday maybe']);
    assert.equal(board.cards.length, 3);
    const ground = board.cards.find((c) => c.title === 'Anvay - Ground 0');
    assert.equal(ground.column, 'status:Ground 0');
    assert.equal(ground.stage, null);
});

test('only filter options that have cards become buttons', yaml, () => {
    const squads = { id: 4, name: 'Team', data_type: 'single_select', options: ['Squad 1', 'Squad 2', 'Squad 3'].map(option) };
    const fields = [...MINIMAL_FIELDS, squads];
    const unassigned = [item(401, 'DraftIssue', draft('Sprint 1 review'), [statusValue('Done')], '2026-10-14T00:00:00Z')];
    assert.deepEqual(normalizeBoard({ project: PROJECT, fields, items: unassigned }, { filterName: 'Team', url: BOARD_URL, config: CONFIG }).groups, []);

    const one = [...unassigned, item(402, 'DraftIssue', draft('Showcase'), [statusValue('Todo'), { id: 4, name: 'Team', data_type: 'single_select', value: option('Squad 2') }], '2026-10-14T00:00:00Z')];
    assert.deepEqual(normalizeBoard({ project: PROJECT, fields, items: one }, { filterName: 'Team', url: BOARD_URL, config: CONFIG }).groups, ['Squad 2']);
});

test('a board that follows OCS\'s lifecycle keeps its own name for the Parking Lot, collapsed', yaml, () => {
    const fields = [{ id: 3, name: 'Status', data_type: 'single_select', options: ['Parking Lot', 'ToDo', 'In Progress', 'In Review', 'Done'].map(option) }];
    const board = normalizeBoard({ project: PROJECT, fields, items: [] }, { url: BOARD_URL, config: CONFIG });
    assert.deepEqual(board.columns.map((c) => c.label), ['Parking Lot', 'To do', 'In progress', 'In review', 'Done']);
    assert.deepEqual(board.columns.map((c) => c.collapsed), [true, false, false, false, false]);
});

test('when two of a board\'s columns are both backlog, the shared column takes the stage\'s name', yaml, () => {
    const fields = [{ id: 3, name: 'Status', data_type: 'single_select', options: ['Icebox', 'Backlog', 'Todo', 'Done'].map(option) }];
    assert.equal(normalizeBoard({ project: PROJECT, fields, items: [] }, { url: BOARD_URL, config: CONFIG }).columns[0].label, 'Backlog');
});

const withBody = (id, body) => item(id, 'Issue', { ...ISSUE.content, number: id, body }, [statusValue('📋 To Do')], '2026-10-14T00:00:00Z');

test('a card counts the boxes in its checklist; a card without one has none', yaml, () => {
    const body = [
        '## In Progress', '- [x] Prototyped', '* [X] Unit tested', '   - [ ] PR created and linked',
        '```md', '- [ ] an example inside a code block', '```', 'Notes, not a box: [ ] here',
    ].join('\n');
    const board = normalizeBoard({ project: PROJECT, fields: FIELDS, items: [withBody(501, body), withBody(502, 'Just prose.'), withBody(503, null)] }, { url: BOARD_URL, config: CONFIG });
    assert.deepEqual(board.cards.map((c) => c.checklist), [{ done: 2, total: 3 }, null, null]);
});

// Shaped like a value of GitHub's "Linked pull requests" field (trimmed).
const pr = (number, extra = {}) => ({ number, title: `PR ${number}`, html_url: `https://github.com/Open-Coding-Society/pages/pull/${number}`, state: 'open', merged_at: null, draft: false, ...extra });
const prsValue = (...prs) => ({ id: 7, name: 'Linked pull requests', data_type: 'linked_pull_requests', value: prs });

test('a card lists its linked pull requests as merged, open, draft or closed', yaml, () => {
    const issue = item(601, 'Issue', { ...ISSUE.content, number: 60, body: '' }, [statusValue('👀 In Review'), prsValue(
        pr(1823, { state: 'closed', merged_at: '2026-10-21T12:52:17Z' }), pr(1830), pr(1831, { draft: true }), pr(1799, { state: 'closed' }),
        { ...pr(9), html_url: 'javascript:alert(1)' },
    )], '2026-10-21T13:00:00Z');
    const [card] = normalizeBoard({ project: PROJECT, fields: FIELDS, items: [issue] }, { url: BOARD_URL, config: CONFIG }).cards;
    assert.deepEqual(card.prs, [
        { number: 1823, url: 'https://github.com/Open-Coding-Society/pages/pull/1823', title: 'PR 1823', state: 'merged' },
        { number: 1830, url: 'https://github.com/Open-Coding-Society/pages/pull/1830', title: 'PR 1830', state: 'open' },
        { number: 1831, url: 'https://github.com/Open-Coding-Society/pages/pull/1831', title: 'PR 1831', state: 'draft' },
        { number: 1799, url: 'https://github.com/Open-Coding-Society/pages/pull/1799', title: 'PR 1799', state: 'closed' },
    ]);
    assert.deepEqual(normalizeBoard({ project: PROJECT, fields: FIELDS, items: [ISSUE] }, { url: BOARD_URL, config: CONFIG }).cards[0].prs, []);
});

test('without a filter there are no groups to choose from', yaml, () => {
    const board = normalizeBoard({ project: PROJECT, fields: FIELDS, items: ITEMS }, { url: BOARD_URL, config: OURS });
    assert.deepEqual(board.groups, []);
    assert.deepEqual(board.shared, []);
    assert.equal(board.cards[0].group, '');
});

/* ── Columns ─────────────────────────────────────────────────────────── */

test('a team filter shows that team\'s cards plus the cards the whole team shares', yaml, () => {
    const board = normalizeBoard({ project: PROJECT, fields: FIELDS, items: ITEMS }, { filterName: 'Team', url: BOARD_URL, config: OURS });
    assert.deepEqual(filterCards(board, 'SASS').map((c) => c.title), ['Lesson sidebar on ocs__tree', 'Sprint 3 team plan issue']);
    assert.deepEqual(filterCards(board, 'DMs').map((c) => c.title), ['Sprint 3 team plan issue']);
    assert.equal(filterCards(board, 'all').length, 4);
});

test('a done column lists the most recently shipped work first; other columns keep the board\'s order', () => {
    const cards = [
        { title: 'Old', column: 'done', shipped: '2026-09-30' },
        { title: 'Undated', column: 'done', shipped: null },
        { title: 'Next', column: 'todo', shipped: null },
        { title: 'New', column: 'done', shipped: '2026-10-12' },
        { title: 'Later', column: 'todo', shipped: null },
    ];
    assert.deepEqual(columnCards(cards, { key: 'done', done: true }).map((c) => c.title), ['New', 'Old', 'Undated']);
    assert.deepEqual(columnCards(cards, { key: 'todo', done: false }).map((c) => c.title), ['Next', 'Later']);
});

/* ── Fetching ────────────────────────────────────────────────────────── */

const json = (body, init = {}) => new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' }, ...init });
const NEXT = 'https://api.github.com/organizations/321096333/projectsV2/1/items?per_page=100&fields=3%2C4%2C5%2C6%2C7&after=abc';

// Answers like GitHub for the one board above. Every URL it was asked for is
// kept, and anything it doesn't know is a 404, so a wrong URL fails the test.
function fakeGitHub() {
    const seen = [];
    const fetchImpl = async (url, init) => {
        seen.push(url);
        assert.equal(init.headers.Accept, 'application/vnd.github+json');
        const { pathname, searchParams } = new URL(url);
        if (url === `${API}`) return json(PROJECT);
        if (url === `${API}/fields`) return json(FIELDS);
        if (pathname.endsWith('/projectsV2/1/items')) {
            assert.equal(searchParams.get('per_page'), '100');
            assert.deepEqual(searchParams.get('fields').split(',').sort(), ['3', '4', '5', '6', '7']);
            if (searchParams.get('after') === 'abc') return json(ITEMS.slice(3));
            return json(ITEMS.slice(0, 3), { headers: { link: `<${NEXT}>; rel="next"` } });
        }
        return json({ message: 'Not Found' }, { status: 404 });
    };
    return { seen, fetchImpl };
}

test('a refresh reads the project, its fields and every page of items', yaml, async () => {
    const { seen, fetchImpl } = fakeGitHub();
    const now = Date.UTC(2026, 9, 20, 23, 0);
    const entry = await refreshBoard(parseBoardUrl(BOARD_URL), { filterName: 'Team', config: OURS, fetchImpl, now });
    assert.equal(seen.length, 4);
    assert.equal(seen[3], NEXT);
    assert.equal(entry.board.cards.length, 4);
    assert.equal(entry.board.title, 'UGRC-CSA — Team Kanban');
    assert.equal(entry.fetchedAt, now);
    assert.equal(entry.metaAt, now);
});

test('a refresh within a day reuses the project and fields and reads only the items', yaml, async () => {
    const { seen, fetchImpl } = fakeGitHub();
    const now = Date.UTC(2026, 9, 20, 23, 0);
    const first = await refreshBoard(parseBoardUrl(BOARD_URL), { filterName: 'Team', config: OURS, fetchImpl, now });
    seen.length = 0;
    const later = now + 30 * MINUTE;
    const second = await refreshBoard(parseBoardUrl(BOARD_URL), { filterName: 'Team', config: OURS, meta: first.meta, metaAt: first.metaAt, fetchImpl, now: later });
    assert.equal(seen.length, 2);
    assert.ok(seen.every((url) => url.includes('/items')));
    assert.equal(second.metaAt, now);
    assert.equal(second.fetchedAt, later);
    assert.equal(second.board.title, 'UGRC-CSA — Team Kanban');
});

test('item pages stop after five', yaml, async () => {
    let itemCalls = 0;
    const fetchImpl = async (url) => {
        if (url === `${API}`) return json(PROJECT);
        if (url === `${API}/fields`) return json(FIELDS);
        itemCalls += 1;
        const page = [item(200 + itemCalls, 'DraftIssue', draft(`Card ${itemCalls}`), [statusValue('📋 To Do')], '2026-10-14T00:00:00Z')];
        return json(page, { headers: { link: `<${API}/items?per_page=100&fields=3&after=p${itemCalls}>; rel="next"` } });
    };
    const entry = await refreshBoard(parseBoardUrl(BOARD_URL), { config: CONFIG, fetchImpl, now: 0 });
    assert.equal(itemCalls, 5);
    assert.equal(entry.board.cards.length, 5);
});

test('GitHub errors are told apart: private or missing, rate limited, no answer', yaml, async () => {
    const ref = parseBoardUrl(BOARD_URL);
    const missing = async () => json({ message: 'Not Found' }, { status: 404 });
    await assert.rejects(refreshBoard(ref, { config: CONFIG, fetchImpl: missing, now: 0 }), (err) => err instanceof BoardError && err.kind === 'missing');

    const limited = async () => json({ message: 'API rate limit exceeded' }, {
        status: 403, headers: { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': '1800000000' },
    });
    await assert.rejects(refreshBoard(ref, { config: CONFIG, fetchImpl: limited, now: 0 }),
        (err) => err instanceof BoardError && err.kind === 'limit' && err.resetAt === 1800000000000);

    const offline = async () => { throw new TypeError('Failed to fetch'); };
    await assert.rejects(refreshBoard(ref, { config: CONFIG, fetchImpl: offline, now: 0 }), (err) => err instanceof BoardError && err.kind === 'network');

    const signInOnly = async () => json({ message: 'Requires authentication' }, { status: 401 });
    await assert.rejects(refreshBoard(ref, { config: CONFIG, fetchImpl: signInOnly, now: 0 }), (err) => err instanceof BoardError && err.kind === 'auth');
});

/* ── Saved copies ────────────────────────────────────────────────────── */

test('a saved board is fresh for ten minutes, then stale, and blocked until a rate limit resets', () => {
    const now = Date.UTC(2026, 9, 20, 23, 0);
    const board = { cards: [] };
    assert.equal(cacheState(null, now), 'empty');
    assert.equal(cacheState({ board, fetchedAt: now - MINUTE }, now), 'fresh');
    assert.equal(cacheState({ board, fetchedAt: now - 11 * MINUTE }, now), 'stale');
    assert.equal(cacheState({ board, fetchedAt: now - 11 * MINUTE, retryAt: now + MINUTE }, now), 'blocked');
    assert.equal(cacheState({ board: null, retryAt: now + MINUTE }, now), 'blocked');
    assert.equal(cacheState({ board: null, retryAt: now - MINUTE }, now), 'empty');
});

test('saved copies survive a round trip, and blocked or broken storage reads as nothing', () => {
    const values = new Map();
    const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
    writeEntry('ocs-kanban:v1:test', { fetchedAt: 5, board: { title: 'B' } }, storage);
    assert.deepEqual(readEntry('ocs-kanban:v1:test', storage), { fetchedAt: 5, board: { title: 'B' } });

    values.set('broken', '{not json');
    assert.equal(readEntry('broken', storage), null);

    const blocked = { getItem() { throw new Error('SecurityError'); }, setItem() { throw new Error('QuotaExceededError'); } };
    assert.equal(readEntry('ocs-kanban:v1:test', blocked), null);
    assert.doesNotThrow(() => writeEntry('ocs-kanban:v1:test', { fetchedAt: 5 }, blocked));
});

test('Area filters and Priority and Topic values survive normalization and fetching', yaml, async () => {
    const priority = { id: 20, name: 'Priority', data_type: 'single_select', options: [option('High')] };
    const topic = { id: 21, name: 'Topic', data_type: 'single_select', options: [option('Chatbot')] };
    const area = { id: 22, name: 'Area', data_type: 'single_select', options: [option('Frontend'), option('Backend')] };
    const fields = [...MINIMAL_FIELDS, priority, topic, area];
    const items = ['Frontend', 'Backend'].map((name, index) => item(900 + index, 'DraftIssue', draft(name + ' task'), [
        statusValue('Todo'),
        { id: 20, value: option('High') },
        { id: 21, value: option('Chatbot') },
        { id: 22, value: option(name) },
    ], '2026-10-22T00:00:00Z'));
    const fetched = [];
    const fetchImpl = async (url) => {
        fetched.push(url);
        if (url.endsWith('/fields')) return json(fields);
        if (url.includes('/items?')) return json(items);
        return json(PROJECT);
    };
    const entry = await refreshBoard(parseBoardUrl(BOARD_URL), { filterName: 'Area', config: CONFIG, fetchImpl, now: 0 });
    assert.deepEqual(entry.board.groups, ['Frontend', 'Backend']);
    assert.equal(filterCards(entry.board, 'Backend')[0].title, 'Backend task');
    // Priority and Topic are the card_fields in _data/kanban.yml.
    assert.deepEqual(entry.board.cards[0].details, [{ name: 'Priority', value: 'High' }, { name: 'Topic', value: 'Chatbot' }]);
    const requested = new URL(fetched.find(url => url.includes('/items?'))).searchParams.get('fields').split(',');
    assert.ok(requested.includes('20'));
    assert.ok(requested.includes('21'));
    const empty = normalizeBoard({ project: PROJECT, fields, items: [item(999, 'DraftIssue', draft('Unassigned'), [statusValue('Todo')], '2026-10-22T00:00:00Z')] }, { url: BOARD_URL, config: CONFIG });
    assert.deepEqual(empty.cards[0].details, []);
});

// A repository's issues as a board: for personal boards GitHub won't show
// signed out, a team can point the embed at its repository's issues instead.
test('a repository issues address is a board; a plain repository address is not', () => {
    assert.deepEqual(parseBoardUrl('https://github.com/rex0dex/fops-pages/issues'), {
        apiPath: 'repos/rex0dex/fops-pages', url: 'https://github.com/rex0dex/fops-pages/issues', repo: 'rex0dex/fops-pages', personal: false,
    });
    assert.equal(parseBoardUrl('https://github.com/rex0dex/fops-pages'), null);
    assert.equal(parseBoardUrl('https://github.com/users/rex0dex/projects/3').personal, true);
});

test('an issue goes to a column by its stage label, else closed, assigned or open', yaml, () => {
    const person = { login: 'rex0dex' };
    assert.equal(repoStatusOf({ state: 'open', labels: [{ name: 'In review' }], assignees: [person] }, CONFIG), 'In review');
    assert.equal(repoStatusOf({ state: 'open', labels: [{ name: 'bug' }, { name: 'backlog' }], assignees: [] }, CONFIG), 'Backlog');
    assert.equal(repoStatusOf({ state: 'closed', labels: [], assignees: [person] }, CONFIG), 'Done');
    assert.equal(repoStatusOf({ state: 'open', labels: [], assignees: [person] }, CONFIG), 'In progress');
    assert.equal(repoStatusOf({ state: 'open', labels: [{ name: 'bug' }], assignees: [] }, CONFIG), 'To do');
});

test('where a repository\'s issues go, and its board\'s title, come from the data too', yaml, () => {
    const config = boardConfig({
        ...DEFAULTS,
        stages: DEFAULTS.stages.map((stage) => (stage.key === 'doing' ? { ...stage, label: 'Underway' } : stage)),
        issues: { ...DEFAULTS.issues, assigned: 'review' },
        text: { ...DEFAULTS.text, issues_title: 'Issues in {repo}' },
    });
    const assigned = { id: 1, number: 1, title: 'Assigned', state: 'open', labels: [], assignees: [{ login: 'rex0dex' }], updated_at: '2026-10-22T00:00:00Z' };
    const working = { ...assigned, id: 2, number: 2, labels: [{ name: 'underway' }] };
    assert.equal(repoStatusOf(assigned, config), 'In review');
    const board = normalizeBoard(repoToProject('rex0dex/fops-pages', [assigned, working], '', config), { url: 'https://github.com/rex0dex/fops-pages/issues', config });
    assert.equal(board.title, 'Issues in rex0dex/fops-pages');
    // A status named for a stage's label joins that stage, words or not.
    assert.deepEqual(board.cards.map((c) => [c.number, c.stage]), [[1, 'review'], [2, 'doing']]);
    assert.equal(board.columns.find((c) => c.key === 'doing').label, 'Underway');
});

test('a repository board leaves out pull requests and issues closed as not planned, and filters by assignee', yaml, async () => {
    const issue = (number, extra) => ({
        id: 7000 + number, number, title: `Issue ${number}`, html_url: `https://github.com/rex0dex/fops-pages/issues/${number}`,
        state: 'open', labels: [], assignees: [], body: '', updated_at: `2026-10-2${number % 10}T00:00:00Z`, ...extra,
    });
    const issues = [
        issue(1, { assignees: [{ login: 'rex0dex' }] }),
        issue(2, { state: 'closed', state_reason: 'not_planned' }),
        issue(3, { pull_request: { url: 'https://api.github.com/repos/rex0dex/fops-pages/pulls/3' } }),
        issue(4, { state: 'closed', state_reason: 'completed', assignees: [{ login: 'Kash484' }] }),
        issue(5),
    ];
    const fetched = [];
    const fetchImpl = async (url) => { fetched.push(url); return json(issues); };
    const entry = await refreshBoard(parseBoardUrl('https://github.com/rex0dex/fops-pages/issues'), { filterName: 'Assignee', config: CONFIG, fetchImpl, now: 0 });
    assert.deepEqual(fetched, ['https://api.github.com/repos/rex0dex/fops-pages/issues?state=all&per_page=100']);
    assert.deepEqual(entry.board.cards.map(card => [card.number, card.stage]), [[1, 'doing'], [4, 'done'], [5, 'todo']]);
    assert.deepEqual(entry.board.groups, ['rex0dex', 'Kash484']);
    assert.equal(filterCards(entry.board, 'Kash484')[0].number, 4);
});
