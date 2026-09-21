// Run against a built, served site: CSP_LESSON_URL=http://localhost:4504 node scripts/tests/lesson-runners.browser.cjs
// Requires Playwright and Chrome; tests execute the real browser Python/AP engines.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const origin = process.env.CSP_LESSON_URL || 'http://localhost:4504';
const authors = 'Adhvay Iyer, Ishan Shrivastava, and Rohan Chandra';
const lessons = [
  { route: '/python/variables', slug: '3-1',
    python: ['Nova 45\nStored total: 45\nUpdated total: 50', '12 8'],
    pseudocode: ['Nova 45\nStored total: 45\nUpdated total: 50', '12 8'] },
  { route: '/python/data-abstractions', slug: '3-2',
    python: ['Rounds: 3\nTotal: 45', '[6, 12, 12, 5]\n4'],
    pseudocode: ['Rounds: 3\nTotal: 45', '[6, 12, 12, 5]\n4'] },
];
async function setCode(runner, source) {
  await runner.locator('.CodeMirror').evaluate((element, code) => element.CodeMirror.setValue(code), source);
}
async function getCode(runner) {
  return runner.locator('.CodeMirror').evaluate(element => element.CodeMirror.getValue());
}
async function run(runner, expected) {
  await runner.locator('[data-hook="run"]').click();
  try {
    await runner.page().waitForFunction(id => !document.getElementById(id).querySelector('[data-hook="run"]').disabled,
      await runner.getAttribute('id'), { timeout: 90000 });
  } catch (error) {
    console.error('Runner state:', await runner.locator('.output-content').innerText());
    throw error;
  }
  const output = (await runner.locator('.output-content').innerText()).trim();
  if (expected instanceof RegExp) assert.match(output, expected);
  else assert.equal(output, expected);
  assert.equal(await runner.locator('.languageSelect').isEnabled(), true);
  return output;
}
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ['clipboard-read', 'clipboard-write'] });
    // No login or assignment mutations; the runner must work without either backend.
    await context.route(/https?:\/\/(localhost|127\.0\.0\.1):858[5789]\/.*|https:\/\/(flask|spring)\.[^/]+\/.*/, route => route.fulfill({ status: 401, contentType: 'application/json', body: '{}' }));
    let remoteRuns = 0;
    context.on('request', request => { if (/\/run\/(python|javascript|java)/.test(request.url())) remoteRuns++; });
    const page = await context.newPage();
    const pageErrors = [];
    page.on('pageerror', error => { pageErrors.push(error.message); console.log('page error:', error.message); });
    page.on('requestfailed', request => console.log('request failed:', request.url(), request.failure()?.errorText));
    page.on('response', response => { if (response.url().includes('pyodide')) console.log('Python download:', response.status(), response.url()); });
    for (const lesson of lessons) {
      await page.goto(origin + lesson.route, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => document.querySelectorAll('.CodeMirror').length === 2);
      assert.equal(await page.locator('.p-author').innerText(), authors);
      assert.equal(await page.locator('.code-runner-container').count(), 2);
      for (const heading of ['1. LxD Cycle Process', '2. Lesson Plan', '3. Hacks & Practice Tasks', '4. Grading Plan (1 Point Total)', '5. Lesson Revisions & Feedback Evidence']) {
        assert.equal(await page.getByRole('heading', { name: heading, exact: true }).count(), 1);
      }
      const setup = page.locator('#create-your-homework-page + ol');
      assert.equal(await setup.locator(':scope > li').count(), 5);
      assert.equal(await setup.locator('pre code').count(), 2);
      assert((await setup.innerText()).includes('full published URL'));
      const runners = page.locator('.code-runner-container');
      for (let index = 0; index < 2; index++) {
        const runner = runners.nth(index);
        const language = runner.locator('.languageSelect');
        assert.deepEqual(await language.locator('option').evaluateAll(options => options.map(option => option.value)), ['python', 'pseudocode']);
        const pythonStarter = await getCode(runner);
        await run(runner, lesson.python[index]);
        await language.selectOption('pseudocode');
        const pseudoStarter = await getCode(runner);
        assert(pseudoStarter.includes('←') && !pseudoStarter.includes('print('));
        assert(pseudoStarter.split('\n').filter(line => line.trim()).every(line => line.includes('//')), 'Explain each pseudocode line');
        await run(runner, lesson.pseudocode[index]);
        await setCode(runner, 'value ← 7\nDISPLAY(value + 2)');
        await run(runner, '9');
        await language.selectOption('python');
        assert.equal(await getCode(runner), pythonStarter);
        await setCode(runner, 'value = 7\nprint(value + 4)');
        await run(runner, '11');
        await language.selectOption('pseudocode');
        assert.equal(await getCode(runner), 'value ← 7\nDISPLAY(value + 2)');
        await runner.locator('[data-hook="clear"]').click();
        assert.equal(await getCode(runner), pseudoStarter);
        await language.selectOption('python');
        assert.equal(await getCode(runner), pythonStarter);
      }
      const runner = runners.first();
      const language = runner.locator('.languageSelect');
      const original = await getCode(runner);
      if (lesson.slug === '3-1') {
        await setCode(runner, original.replace('round_two + 5', 'round_two + 0'));
        await run(runner, 'Nova 45\nStored total: 45\nUpdated total: 45');
        await language.selectOption('pseudocode');
        const pseudo = await getCode(runner);
        await setCode(runner, pseudo.replace('round_two + 5', 'round_two + 0'));
        await run(runner, 'Nova 45\nStored total: 45\nUpdated total: 45');
      } else {
        for (const [list, rounds, total] of [['[]', 0, 0], ['[10, 20, 15, 12]', 4, 57]]) {
          await language.selectOption('python');
          await setCode(runner, original.replace('[10, 20, 15]', list));
          await run(runner, `Rounds: ${rounds}\nTotal: ${total}`);
          await language.selectOption('pseudocode');
          await runner.locator('[data-hook="clear"]').click();
          await setCode(runner, (await getCode(runner)).replace('[10, 20, 15]', list));
          await run(runner, `Rounds: ${rounds}\nTotal: ${total}`);
        }
      }
      // Error recovery and fresh namespaces: another run cannot reuse prior variables.
      await language.selectOption('python');
      await setCode(runner, 'print(unknown_name)');
      await run(runner, /NameError/);
      await setCode(runner, 'print("recovered")');
      await run(runner, 'recovered');
      await setCode(runner, 'print(value)');
      await run(runner, /NameError/);
      await language.selectOption('pseudocode');
      await setCode(runner, 'DISPLAY(unknown_name)');
      await run(runner, /Error/);
      await setCode(runner, 'DISPLAY("recovered")');
      await run(runner, 'recovered');
      // Save both drafts, reload, and confirm isolation between languages and widgets.
      await setCode(runner, 'DISPLAY(101)');
      await runner.locator('[data-hook="save"]').click();
      await language.selectOption('python');
      await setCode(runner, 'print(202)');
      await runner.locator('[data-hook="save"]').click();
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => document.querySelectorAll('.CodeMirror').length === 2);
      assert.equal((await getCode(runner)).trim(), 'print(202)');
      await run(runner, '202');
      await language.selectOption('pseudocode');
      assert.equal(await getCode(runner), 'DISPLAY(101)');
      await run(runner, '101');
      await runner.locator('[data-hook="clear"]').click();
      await language.selectOption('python');
      await run(runner, lesson.python[0]);
      await language.selectOption('pseudocode');
      await run(runner, lesson.pseudocode[0]);
      await runner.locator('[data-hook="copy"]').click();
      assert.equal(await page.evaluate(() => navigator.clipboard.readText()), await getCode(runner));
      await runner.locator('[data-hook="copy-output"]').click();
      assert.equal((await page.evaluate(() => navigator.clipboard.readText())).trim(), lesson.pseudocode[0]);
      for (const link of await page.locator('nav[aria-label="Variables and data abstraction lessons"] a').all()) {
        const href = await link.getAttribute('href');
        if (href.startsWith('#')) assert.equal(await page.locator(`[id="${href.slice(1)}"]`).count(), 1);
        else assert.equal((await context.request.get(new URL(href, origin).href)).status(), 200);
      }
      await runner.scrollIntoViewIfNeeded();
      await page.screenshot({ path: `/tmp/csp-runner-${lesson.slug}-desktop.png` });
      await page.setViewportSize({ width: 390, height: 844 });
      await runner.scrollIntoViewIfNeeded();
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'No page overflow');
      await run(runner, lesson.pseudocode[0]);
      await language.selectOption('python');
      await run(runner, lesson.python[0]);
      await page.screenshot({ path: `/tmp/csp-runner-${lesson.slug}-mobile.png` });
      await page.setViewportSize({ width: 1440, height: 1000 });
      console.log(`${lesson.slug}: both engines, changed inputs, drafts, reset, error recovery, clipboard, mobile passed`);
    }
    // A failed first download must leave the controls usable and allow a retry.
    const retryPage = await context.newPage();
    await retryPage.route('**/pyodide.js', route => route.abort('failed'));
    await retryPage.goto(origin + lessons[0].route, { waitUntil: 'domcontentloaded' });
    await retryPage.waitForFunction(() => document.querySelectorAll('.CodeMirror').length === 2);
    const retryRunner = retryPage.locator('.code-runner-container').first();
    await run(retryRunner, /could not be downloaded/);
    await retryRunner.locator('.languageSelect').selectOption('pseudocode');
    await run(retryRunner, lessons[0].pseudocode[0]);
    await retryPage.unroute('**/pyodide.js');
    await retryRunner.locator('.languageSelect').selectOption('python');
    await run(retryRunner, lessons[0].python[0]);
    await setCode(retryRunner, '');
    await retryRunner.locator('[data-hook="save"]').click();
    await retryPage.reload({ waitUntil: 'domcontentloaded' });
    await retryPage.waitForFunction(() => document.querySelectorAll('.CodeMirror').length === 2);
    assert.equal(await getCode(retryRunner), '', 'An intentionally empty saved draft is preserved');
    await retryRunner.locator('[data-hook="clear"]').click();
    await retryPage.close();
    // The shared include remains compatible with existing lessons without variants.
    await page.goto(origin + '/code/javascript', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelectorAll('.CodeMirror').length > 0);
    const legacyRunner = page.locator('.code-runner-container').first();
    assert.deepEqual(await legacyRunner.locator('.languageSelect option').evaluateAll(options => options.map(option => option.value)),
      ['python', 'java', 'javascript', 'pseudocode']);
    await legacyRunner.locator('.languageSelect').selectOption('pseudocode');
    await setCode(legacyRunner, 'DISPLAY(7)');
    await run(legacyRunner, '7');
    console.log('Download failure/retry, empty saved draft, and legacy runner compatibility passed');
    assert.equal(remoteRuns, 0, 'These lessons must not call a remote execution server');
    // Upstream analytics currently has this independent parse error; any new error fails.
    const unexpected = pageErrors.filter(message => message !== "Unexpected identifier 'editor'");
    assert.deepEqual(unexpected, [], 'No new page errors');
    console.log(JSON.stringify({ remoteRuns, baselinePageErrors: [...new Set(pageErrors)] }));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
