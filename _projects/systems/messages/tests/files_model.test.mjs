import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  FILE_LIMIT_BYTES, MAX_LOOSE_FILES, MAX_SHARE_FILES, addFilesMarker, buildTree, cleanPath, encodeFilesMarker,
  extractFilesMarker, fileKind, filesUnder, formatBytes, isSkipped, planShare, shareSummary, topNames, uniqueName,
} from '../js/files-model.js';

const entry = (path, size = 10) => ({ path, file: { size } });

test('cleanPath keeps safe paths as typed and refuses the ones Spring refuses', () => {
  ['a.txt', 'Team Turing/notes (2).md', 'résumé.pdf', 'src/main/java/App.java', '.gitignore'].forEach(path => {
    assert.equal(cleanPath(path), path);
  });
  ['', ' ', '../x', 'a/../b', '/etc/passwd', 'a//b', 'a\\b', './a', 'a/.', 'tab\tname', 'x'.repeat(513), `d/${'y'.repeat(256)}`]
    .forEach(path => assert.equal(cleanPath(path), null, JSON.stringify(path)));
});

test('fileKind picks an icon and says what can be previewed', () => {
  assert.deepEqual(fileKind('photo.JPG'), { kind: 'image', icon: 'fa-file-image', preview: 'image' });
  assert.equal(fileKind('demo.mp4').preview, 'video');
  assert.equal(fileKind('voice.m4a').preview, 'audio');
  assert.deepEqual(fileKind('report.pdf'), { kind: 'pdf', icon: 'fa-file-pdf', preview: 'pdf' });
  assert.deepEqual(fileKind('Main.java'), { kind: 'code', icon: 'fa-file-code', preview: 'text' });
  assert.equal(fileKind('notes.md').preview, 'text');
  assert.equal(fileKind('grades.csv').icon, 'fa-file-csv');
  assert.equal(fileKind('site.zip').icon, 'fa-file-zipper');
  assert.equal(fileKind('essay.docx').icon, 'fa-file-word');
  assert.equal(fileKind('budget.xlsx').icon, 'fa-file-excel');
  assert.equal(fileKind('pitch.pptx').icon, 'fa-file-powerpoint');
  assert.deepEqual(fileKind('Makefile'), { kind: 'file', icon: 'fa-file', preview: null });
  assert.equal(fileKind('README').preview, null);
});

test('formatBytes reads like a file manager', () => {
  assert.equal(formatBytes(0), '0 B');
  assert.equal(formatBytes(999), '999 B');
  assert.equal(formatBytes(1536), '1.5 KB');
  assert.equal(formatBytes(20 * 1024), '20 KB');
  assert.equal(formatBytes(3.4 * 1024 * 1024), '3.4 MB');
  assert.equal(formatBytes(FILE_LIMIT_BYTES), '35 MB');
  assert.equal(formatBytes(1.25 * 1024 ** 3), '1.3 GB');
  assert.equal(formatBytes(-4), '0 B');
});

test('isSkipped finds tool folders and OS clutter anywhere in a path', () => {
  assert.equal(isSkipped('app/node_modules/react/index.js'), true);
  assert.equal(isSkipped('.git/HEAD'), true);
  assert.equal(isSkipped('src/__pycache__/x.pyc'), true);
  assert.equal(isSkipped('photos/.DS_Store'), true);
  assert.equal(isSkipped('src/gitlab/notes.md'), false);
});

test('uniqueName adds (2), (3)… before the extension, the way a file manager does', () => {
  assert.equal(uniqueName('report.pdf', new Set()), 'report.pdf');
  assert.equal(uniqueName('report.pdf', new Set(['report.pdf'])), 'report (2).pdf');
  assert.equal(uniqueName('report.pdf', new Set(['report.pdf', 'report (2).pdf'])), 'report (3).pdf');
  assert.equal(uniqueName('project', new Set(['project'])), 'project (2)');
  assert.equal(uniqueName('.gitignore', new Set(['.gitignore'])), '.gitignore (2)');
});

test('topNames lists the first part of every shared path', () => {
  assert.deepEqual([...topNames([{ path: 'a.txt' }, { path: 'proj/x.js' }, { path: 'proj/y.js' }])].sort(), ['a.txt', 'proj']);
});

test('planShare uploads loose files and folders, renaming what is already shared', () => {
  const plan = planShare([
    entry('report.pdf', 100), entry('project/src/Main.java', 40), entry('project/README.md', 20),
  ], new Set(['report.pdf']));
  assert.deepEqual(plan.uploads.map(upload => upload.path), ['report (2).pdf', 'project/src/Main.java', 'project/README.md']);
  assert.deepEqual(plan.items, [
    { type: 'file', path: 'report (2).pdf', size: 100 },
    { type: 'folder', path: 'project', count: 2, size: 60 },
  ]);
  assert.equal(plan.problem, null);
});

test('planShare renames a whole folder when its name is taken, keeping the files inside it', () => {
  const plan = planShare([entry('project/a.js'), entry('project/lib/b.js')], new Set(['project']));
  assert.deepEqual(plan.uploads.map(upload => upload.path), ['project (2)/a.js', 'project (2)/lib/b.js']);
  assert.deepEqual(plan.items, [{ type: 'folder', path: 'project (2)', count: 2, size: 20 }]);
});

test('planShare skips clutter, sets aside files over the limit, and says so', () => {
  const plan = planShare([
    entry('site/index.html', 5), entry('site/node_modules/x/index.js', 5), entry('site/.git/HEAD', 5),
    entry('site/video.mov', FILE_LIMIT_BYTES + 1), entry('site/../escape.txt', 5),
  ], new Set());
  assert.deepEqual(plan.uploads.map(upload => upload.path), ['site/index.html']);
  assert.equal(plan.skipped, 2);
  assert.deepEqual(plan.tooBig, ['site/video.mov']);
  assert.deepEqual(plan.invalid, ['site/../escape.txt']);
  assert.equal(plan.problem, null);
});

test('planShare refuses a share with too many files or too many loose files', () => {
  const many = Array.from({ length: MAX_SHARE_FILES + 1 }, (_, i) => entry(`big/f${i}.txt`));
  assert.equal(planShare(many, new Set()).problem, 'tooMany');
  assert.equal(planShare(many, new Set()).uploads.length, 0);
  const loose = Array.from({ length: MAX_LOOSE_FILES + 1 }, (_, i) => entry(`f${i}.txt`));
  assert.equal(planShare(loose, new Set()).problem, 'tooManyLoose');
  assert.equal(planShare([], new Set()).problem, 'empty');
  assert.equal(planShare([entry('x/node_modules/a.js')], new Set()).problem, 'empty');
});

test('the files marker survives names with every character that could break it', () => {
  const items = [
    { type: 'file', path: 'notes [draft]|v2; a~b 100% <b>&.md', size: 12 },
    { type: 'folder', path: 'Team Turing', count: 3, size: 4096 },
  ];
  const body = addFilesMarker('<b>here</b> you go', items);
  assert.match(body, /^\[\[files:[^\]]*\]\] <b>here<\/b> you go$/);
  assert.deepEqual(extractFilesMarker(body), { items, html: '<b>here</b> you go' });
  assert.equal(encodeFilesMarker(items).includes('<'), false);
});

test('extractFilesMarker leaves other bodies alone and drops entries it cannot trust', () => {
  assert.deepEqual(extractFilesMarker('plain text'), { items: [], html: 'plain text' });
  assert.deepEqual(extractFilesMarker('[[files:f~..%2Fx~3;f~ok.txt~-1;f~good.txt~7;z~what~1]] hi'), {
    items: [{ type: 'file', path: 'good.txt', size: 7 }],
    html: 'hi',
  });
  assert.equal(addFilesMarker('hi', []), 'hi');
});

test('buildTree nests the index into folders with counts and sizes', () => {
  const tree = buildTree([
    { path: 'a.txt', size: 1 }, { path: 'proj/src/Main.java', size: 10 }, { path: 'proj/README.md', size: 5 },
  ]);
  assert.deepEqual(tree.files.map(file => file.path), ['a.txt']);
  const proj = tree.folders[0];
  assert.equal(proj.name, 'proj');
  assert.equal(proj.path, 'proj');
  assert.equal(proj.count, 2);
  assert.equal(proj.size, 15);
  assert.deepEqual(proj.folders.map(folder => folder.path), ['proj/src']);
  assert.equal(tree.count, 3);
});

test('filesUnder lists every file inside a folder, at any depth', () => {
  const index = [{ path: 'proj/a' }, { path: 'proj/b/c' }, { path: 'project/d' }, { path: 'x' }];
  assert.deepEqual(filesUnder(index, 'proj').map(file => file.path), ['proj/a', 'proj/b/c']);
});

test('shareSummary says what a share holds in a few words', () => {
  assert.equal(shareSummary([{ type: 'file', path: 'a.pdf', size: 2048 }]), 'a.pdf · 2 KB');
  assert.equal(shareSummary([{ type: 'folder', path: 'proj', count: 3, size: 3 * 1024 * 1024 }]), 'proj · 3 files · 3 MB');
  assert.equal(shareSummary([{ type: 'file', path: 'a', size: 1 }, { type: 'file', path: 'b', size: 1 }]), '2 files · 2 B');
});
