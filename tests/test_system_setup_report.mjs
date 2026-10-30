import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const source = await readFile(new URL('../_projects/games/cs-pathway/model/systemSetupReport.js', import.meta.url), 'utf8');
const { getReportUploadCommand, getSystemSetupConfig, parseSystemSetupReport } = await import(
  `data:text/javascript;charset=utf-8,${encodeURIComponent(source)}`
);

const scriptsDir = fileURLToPath(new URL('../scripts/', import.meta.url));
const linuxReport = execFileSync('python3', ['-c', `
import sys
sys.path.insert(0, ${JSON.stringify(scriptsDir)})
from linux_setup_agent import format_setup_report
print(format_setup_report([
    {'id': 'git', 'label': 'Git', 'passed': True, 'fix': ''},
    {'id': 'vscode', 'label': 'VS Code code command', 'passed': False, 'fix': 'Install VS Code.'},
], 'LINUX', '2026-10-15 09:30:00 PDT', 3))
`], { encoding: 'utf8' });

test('parses a Linux report produced by the real agent formatter', () => {
  const report = parseSystemSetupReport(linuxReport, 'linux');
  assert.equal(report.error, null);
  assert.equal(report.passedCount, 1);
  assert.equal(report.totalCount, 2);
  assert.equal(report.checks[1].fix, 'Install VS Code.');
  assert.equal(report.startedAt, '2026-10-15 09:30:00 PDT');
  assert.equal(report.durationSeconds, 3);
});

test('reports without a timestamp (older agent copies) still parse', () => {
  const oldReport = linuxReport.split('\n').filter((line) => !/^(Started|Duration):/.test(line)).join('\n');
  const report = parseSystemSetupReport(oldReport, 'linux');
  assert.equal(report.error, null);
  assert.equal(report.startedAt, null);
  assert.equal(report.durationSeconds, null);
});

test('the real agent report has the Summary and Overall lines Spring requires on upload', () => {
  assert.match(linuxReport, /^Summary: 1 passed, 0 warned, 1 failed$/m);
  assert.match(linuxReport, /^Overall: FAIL$/m);
});

test('builds the upload command for each system', () => {
  const url = 'https://spring.example/api/cs-pathway/setup-report/ABC123';
  assert.equal(getReportUploadCommand('linux', url), `python3 scripts/linux_setup_agent.py --check --report ${url}`);
  assert.equal(getReportUploadCommand('windows', url), `python3 scripts/windows_setup_agent.py --check --report ${url}`);
  assert.equal(getReportUploadCommand('macos', url), null);
});

test('accepts Linux reports for Kasm', () => {
  assert.equal(parseSystemSetupReport(linuxReport, 'kasm').totalCount, 2);
});

test('accepts a Windows report only for the Windows selection', () => {
  const windowsReport = linuxReport.replaceAll('LINUX', 'WINDOWS');
  assert.equal(parseSystemSetupReport(windowsReport, 'windows').error, null);
  assert.match(parseSystemSetupReport(linuxReport, 'windows').error, /No Windows\/WSL setup report/);
});

test('provides the correct agent command for each supported system', () => {
  assert.match(getSystemSetupConfig('linux').command, /linux_setup_agent\.py --check$/);
  assert.match(getSystemSetupConfig('windows').command, /windows_setup_agent\.py --check/);
  assert.match(getSystemSetupConfig('windows').command, /clip\.exe$/);
  assert.equal(getSystemSetupConfig('macos'), null);
});

test('rejects empty, incomplete, and unsupported reports', () => {
  assert.match(parseSystemSetupReport('', 'linux').error, /No Linux setup report/);
  assert.match(parseSystemSetupReport('=== LINUX SETUP CHECK v1 ===', 'linux').error, /No Linux setup report/);
  assert.match(parseSystemSetupReport('', 'macos').error, /Choose Linux/);
});
