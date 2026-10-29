import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const html = await readFile(new URL('../_includes/microblog_foundation.html', import.meta.url), 'utf8');

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
