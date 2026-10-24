import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
// Resolve next to this test so it runs on any machine, including the GitHub Pages build.
const code=readFileSync(new URL('./stationVerifiers.js', import.meta.url),'utf8');
const { verifyStationOutput, PASTE_PROMPTS }=await import(`data:text/javascript,${encodeURIComponent(code)}`);
const examples={
 'terminal-town-gate':'/home/student\ndrwxr-xr-x 2 student student 4096 Oct 4 10:00 toolchain-trail',
 'compiler-canyon-forge':'Python 3.12.3\npip 24.0 from /usr/lib/python3 (python 3.12)\nruby 3.2.1\nBundler version 2.5.4\n3.5.10',
 'editor-isle-tower':'1.96.2\nabcdef\nx64',
 'git-village-hall':'git version 2.45.2\nMeryl Chen\nmeryl@school.edu',
 'github-gateway-arch':'origin https://github.com/class/project.git (fetch)\n0123456789abcdef0123456789abcdef01234567 refs/heads/main',
 'build-bridge':'BUILD SUCCESSFUL in 4s',
 'integration-summit':'abcdef1 Add project setup\nEverything up-to-date',
};
for(const [id,output] of Object.entries(examples)){
 assert.ok(PASTE_PROMPTS[id]);
 assert.equal(verifyStationOutput(id,output).ok,true,id);
 assert.equal(verifyStationOutput(id,'something installed').ok,false,id);
 assert.equal(verifyStationOutput(id,output+'\nfatal: authentication failed').ok,false,id+' error');
}
assert.equal(verifyStationOutput('unknown','ok').ok,false);
console.log('7 stations: valid, invalid, and command-error paths pass');
