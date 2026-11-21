import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html = await readFile(new URL('../_projects/systems/microblog/navigation/microblog_foundation.html', import.meta.url), 'utf8');

test('Microblog is registered for development builds', async () => {
    const registry = await readFile(new URL('../_projects/.makeprojects', import.meta.url), 'utf8');
    assert.match(registry, /^systems\/microblog:dev$/m);
});

test('reader Microblog button toggles the panel and keeps its expanded state in sync', () => {
    const start = html.indexOf('function openMicroblogPanel()');
    const end = html.indexOf('// Guest & Mentor quick access:', start);
    const classes = new Set();
    const panel = { classList: {
        add: value => classes.add(value),
        remove: value => classes.delete(value),
        contains: value => classes.has(value)
    } };
    const attributes = {};
    const button = {
        style: {},
        hasAttribute: name => name === 'data-reader-microblog',
        setAttribute: (name, value) => { attributes[name] = value; }
    };
    const close = {};
    vm.runInNewContext(html.slice(start, end), { microblogPanel: panel, microblogFab: button, microblogCloseBtn: close });
    button.onclick();
    assert.equal(classes.has('open'), true);
    assert.equal(attributes['aria-expanded'], 'true');
    assert.notEqual(button.style.display, 'none');
    button.onclick();
    assert.equal(classes.has('open'), false);
    assert.equal(attributes['aria-expanded'], 'false');
    button.onclick();
    close.onclick();
    assert.equal(classes.has('open'), false);
    assert.equal(attributes['aria-expanded'], 'false');
});

for (const formId of ['microblog-form', 'reply-form']) {
    test(`${formId}: disables during save, rejects repeat submits, preserves rejected draft`, async () => {
        const start = html.indexOf(`document.getElementById('${formId}').onsubmit`);
        const handler = html.slice(start, html.indexOf('\n};', start) + 3);
        const button = { disabled: false, textContent: formId === 'reply-form' ? 'Reply' : 'Save' };
        const elements = Object.fromEntries([
            formId, 'post-id', 'topic-id', 'content', 'reply-post-id', 'reply-content'
        ].map(id => [id, { value: id.includes('content') ? 'Keep my draft' : '', querySelector: () => button }]));
        let calls = 0;
        let finish;
        let fail = false;
        const alerts = [];
        let closed = 0;
        const saved = [];
        const write = async payload => {
            calls++;
            saved.push(payload);
            if (fail) throw new Error('Please wait 30 seconds before saving another microblog post, edit, or reply.');
            await new Promise(resolve => { finish = resolve; });
        };
        vm.runInNewContext(handler, {
            document: { getElementById: id => elements[id] },
            pagePermalink: '/microblog',
            createPost: write, updatePost: write, createReply: write,
            // A new post saves the open channel and the page's author uids with it
            activeChannel: 'suggestions', pageAuthors: [],
            // No survey open in the builder
            readSurveyOptions: () => null,
            closeModal: () => closed++, closeReplyModal: () => closed++,
            renderMicroblogTable: () => {}, alert: message => alerts.push(message)
        });
        const form = elements[formId];
        const event = { preventDefault() {} };
        const saving = form.onsubmit(event);
        assert.equal(button.disabled, true);
        assert.equal(button.textContent, 'Saving...');
        await form.onsubmit(event);
        assert.equal(calls, 1);
        if (formId === 'microblog-form') assert.equal(saved[0].data.channel, 'suggestions');
        finish();
        await saving;
        assert.equal(closed, 1);
        assert.equal(button.disabled, false);
        assert.equal(button.textContent, formId === 'reply-form' ? 'Reply' : 'Save');
        fail = true;
        await form.onsubmit(event);
        assert.equal(alerts.length, 1);
        assert.match(alerts[0], /Please wait 30 seconds/);
        assert.equal(elements[formId === 'reply-form' ? 'reply-content' : 'content'].value, 'Keep my draft');
        assert.equal(closed, 1);
        assert.equal(button.disabled, false);
    });
}

test('renderMicroblogTable escapes every post field before it joins the markup', () => {
    const start = html.indexOf('const analyticsCell = analytics.map');
    const end = html.indexOf('.join(\'\') +', html.indexOf('const messageCell = message.map'));
    const render = html.slice(start, end);
    // Both cells pass the (formatted) value through escapeHtml; a raw `${value}` would be a stored XSS
    assert.match(render, /`<div class='\$\{f\.className\}'>\$\{escapeHtml\(String\(value\)\)\}<\/div>`;/);
    assert.match(render, /value = escapeHtml\(String\(value\)\);\s*if \(f\.key === 'topicPath'\)/);
    assert.doesNotMatch(render, /<span>\$\{post\./);
});

test('microblog-form: saves an open survey\'s choices with a new post, and keeps the draft when they are unusable', async () => {
    const start = html.indexOf("document.getElementById('microblog-form').onsubmit");
    const handler = html.slice(start, html.indexOf('\n};', start) + 3);
    const button = { disabled: false, textContent: 'Save' };
    const elements = Object.fromEntries(['microblog-form', 'post-id', 'topic-id', 'content']
        .map(id => [id, { value: id === 'content' ? 'Best day?' : '', querySelector: () => button }]));
    const saved = [];
    const alerts = [];
    let surveyOptions = () => ['Monday', 'Friday'];
    vm.runInNewContext(handler, {
        document: { getElementById: id => elements[id] },
        createPost: async payload => { saved.push(payload); }, updatePost: async () => {},
        activeChannel: 'chat', pageAuthors: [],
        readSurveyOptions: () => surveyOptions(),
        closeModal() {}, renderMicroblogTable() {}, alert: message => alerts.push(message)
    });
    const event = { preventDefault() {} };
    await elements['microblog-form'].onsubmit(event);
    assert.deepEqual(JSON.parse(JSON.stringify(saved[0].data.survey)), { options: ['Monday', 'Friday'] });
    assert.equal(saved[0].content, 'Best day?');

    surveyOptions = () => { throw new Error('A survey needs at least 2 choices.'); };
    await elements['microblog-form'].onsubmit(event);
    assert.equal(saved.length, 1, 'nothing is posted');
    assert.match(alerts[0], /at least 2 choices/);
    assert.equal(elements.content.value, 'Best day?');
    assert.equal(button.disabled, false);
});

test('surveyHtml escapes survey choices and the post id before they join the markup', () => {
    const start = html.indexOf('function surveyHtml(post, user)');
    const body = html.slice(start, html.indexOf('\n}\n', start));
    assert.match(body, /\$\{escapeHtml\(option\.label\)\}/);
    assert.match(body, /data-post-id='\$\{escapeHtml\(String\(post\.id\)\)\}'/);
});
