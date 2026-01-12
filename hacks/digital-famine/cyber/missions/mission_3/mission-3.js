/* mission-3.js
   Externalized JS for Mission 3 - Hashing Lab
   Keeps interactive behavior in a separate file so HTML stays clean.
*/

let quizScore = 0;
let answeredQuestions = new Set();
let mockDB = [];

function switchTab(tabName, evt) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    const tab = document.getElementById(tabName + '-tab');
    if (tab) tab.classList.add('active');
    if (evt && evt.target) evt.target.classList.add('active');
}

async function sha256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function liveHash() {
    const input = document.getElementById('learnHashInput').value;
    if (!input) {
        document.getElementById('liveHashOutput').style.display = 'none';
        return;
    }
    const hash = await sha256(input);
    document.getElementById('liveInput').textContent = input;
    document.getElementById('liveHash').textContent = hash;
    document.getElementById('liveLength').textContent = hash.length;
    document.getElementById('liveHashOutput').style.display = 'block';
}

async function demoAvalanche() {
    const texts = ['LAUNCH-CODE-001','LAUNCH-CODE-002','LAUNCH-CODE-00','launch-code-001'];
    let html = '<div class="code-block" style="margin-top: 15px;"><pre>';
    html += 'Input                -> Hash (first 40 chars)\n';
    html += '-'.repeat(60) + '\n';
    for (const text of texts) {
        const hash = await sha256(text);
        html += `${text.padEnd(20)} -> ${hash.substring(0, 40)}...\n`;
    }
    html += '</pre></div>';
    html += '<p style="margin-top: 15px; color: #00ff88;">Notice how changing even one character creates a completely different hash.</p>';
    document.getElementById('avalancheDemo').innerHTML = html;
}

async function exercise1() {
    const input = document.getElementById('ex1Input').value;
    if (!input) { alert('Please enter a launch code!'); return; }
    const hash1 = await sha256(input);
    await new Promise(r => setTimeout(r, 300));
    const hash2 = await sha256(input);
    let html = '<div class="result-display">';
    html += `<strong>Input:</strong> ${input}<br>`;
    html += `<strong>First Hash:</strong> ${hash1}<br>`;
    html += `<strong>Second Hash:</strong> ${hash2}<br>`;
    html += `<strong>Match:</strong> ${hash1 === hash2 ? 'YES' : 'NO'}<br>`;
    html += '</div>';
    document.getElementById('ex1Result').innerHTML = html;
    document.getElementById('ex1Hint').style.display = 'block';
}

async function exercise2() {
    const input1 = document.getElementById('ex2Input1').value;
    const input2 = document.getElementById('ex2Input2').value;
    if (!input1 || !input2) { alert('Please enter both codes!'); return; }
    const hash1 = await sha256(input1);
    const hash2 = await sha256(input2);
    let differences = 0;
    for (let i = 0; i < hash1.length; i++) if (hash1[i] !== hash2[i]) differences++;
    let html = '<div class="result-display">';
    html += `<strong>Input 1:</strong> ${input1}<br>`;
    html += `<strong>Hash 1:</strong> ${hash1}<br><br>`;
    html += `<strong>Input 2:</strong> ${input2}<br>`;
    html += `<strong>Hash 2:</strong> ${hash2}<br><br>`;
    html += `<strong>Different Characters:</strong> ${differences} out of 64 (${(differences/64*100).toFixed(1)}%)<br>`;
    html += `<strong>Inputs Match:</strong> ${input1 === input2 ? 'YES' : 'NO'}<br>`;
    html += `<strong>Hashes Match:</strong> ${hash1 === hash2 ? 'YES' : 'NO'}<br>`;
    html += '</div>';
    document.getElementById('ex2Result').innerHTML = html;
}

async function exercise3() {
    const passwords = document.getElementById('ex3Passwords').value.split('\n').filter(p => p.trim());
    if (passwords.length === 0) { alert('Please enter at least one password!'); return; }
    let html = '<div class="code-block"><pre>';
    html += 'Password Storage Simulation\n';
    html += '-'.repeat(80) + '\n\n';
    html += 'PLAINTEXT:\n';
    html += '-'.repeat(80) + '\n';
    for (const pwd of passwords) html += `${pwd}\n`;
    html += '\nHASHED:\n';
    html += '-'.repeat(80) + '\n';
    for (const pwd of passwords) { const hash = await sha256(pwd); html += `${hash}\n`; }
    html += '</pre></div>';
    html += '<p style="color: #ff6b6b; margin-top: 10px;">Do not store passwords in plaintext.</p>';
    document.getElementById('ex3Result').innerHTML = html;
}

async function exercise4() {
    const input1 = document.getElementById('ex4Input1').value;
    const input2 = document.getElementById('ex4Input2').value;
    if (!input1 || !input2) { alert('Please enter both inputs!'); return; }
    const hash1 = await sha256(input1);
    const hash2 = await sha256(input2);
    let html = '<div class="result-display">';
    html += `<strong>Input 1:</strong> ${input1}<br>`;
    html += `<strong>Hash 1:</strong> ${hash1}<br><br>`;
    html += `<strong>Input 2:</strong> ${input2}<br>`;
    html += `<strong>Hash 2:</strong> ${hash2}<br><br>`;
    if (input1 === input2) html += '<span style="color: #ffd93d;">Inputs are identical - try different inputs!</span>'
    else if (hash1 === hash2) html += '<span style="color: #ff4757;">Collision found (unexpected)</span>'
    else html += '<span style="color: #00ff88;">No collision - as expected</span>';
    html += '</div>';
    document.getElementById('ex4Result').innerHTML = html;
}

async function exercise5() {
    const content = document.getElementById('ex5FileContent').value;
    const expected = document.getElementById('expectedHash').textContent.trim();
    const actual = await sha256(content);
    let html = '<div class="result-display">';
    html += `<strong>Expected Hash:</strong> ${expected}<br>`;
    html += `<strong>Actual Hash:</strong> ${actual}<br><br>`;
    if (actual === expected) html += '<span style="color: #00ff88; font-size: 1.1em;">FILE VERIFIED - matches expected hash</span>';
    else html += '<span style="color: #ff4757; font-size: 1.1em;">WARNING - file does not match expected hash</span>';
    html += '</div>';
    document.getElementById('ex5Result').innerHTML = html;
}

async function challenge1() {
    const input = document.getElementById('ch1TestInput').value;
    if (!input) { alert('Enter a test input!'); return; }
    const hash = await sha256(input);
    const empty = await sha256('');
    let html = '<div class="result-display">';
    html += '<strong>Test Results:</strong><br><br>';
    html += `Input: "${input}"<br>`;
    html += `Hash: ${hash}<br><br>`;
    html += `Empty string hash: ${empty}<br>`;
    html += '</div>';
    html += '<p style="color: #00ff88; margin-top: 10px;">Function OK</p>';
    document.getElementById('ch1Result').innerHTML = html;
}

async function challenge2() {
    const codes = document.getElementById('ch2Codes').value.split(',').map(c => c.trim()).filter(c => c);
    if (codes.length === 0) { alert('Enter at least one code!'); return; }
    const progress = document.getElementById('ch2Progress');
    const progressFill = document.getElementById('ch2ProgressFill');
    progress.style.display = 'block';
    let results = [];
    for (let i = 0; i < codes.length; i++) {
        const code = codes[i];
        const hash = await sha256(code);
        results.push({code, hash});
        const percent = ((i + 1) / codes.length * 100).toFixed(0);
        progressFill.style.width = percent + '%';
        progressFill.textContent = percent + '%';
        await new Promise(r => setTimeout(r, 150));
    }
    let html = '<div class="code-block"><pre>';
    html += 'Batch Processing Complete\n';
    html += '-'.repeat(80) + '\n\n';
    results.forEach((r, idx) => { html += `${idx + 1}. ${r.code}\n   ${r.hash}\n\n`; });
    html += `Total Processed: ${results.length} codes\n`;
    html += '</pre></div>';
    document.getElementById('ch2Result').innerHTML = html;
}

function generateMockDB() {
    mockDB = [
        {id: 1, username: 'admin', password: 'admin123'},
        {id: 2, username: 'commander', password: 'spaceDefense2024'},
        {id: 3, username: 'pilot_alpha', password: 'flyHigh!'},
        {id: 4, username: 'engineer', password: 'fixThings'},
        {id: 5, username: 'scientist', password: 'quantum42'}
    ];
    let html = '<div class="code-block"><pre>';
    html += 'Mock Database (UNSECURED)\n';
    html += '-'.repeat(60) + '\n';
    html += 'ID | Username      | Password (PLAINTEXT)\n';
    html += '-'.repeat(60) + '\n';
    mockDB.forEach(user => { html += `${user.id}  | ${user.username.padEnd(13)} | ${user.password}\n`; });
    html += '</pre></div>';
    html += '<p style="color: #ff4757;">DANGER: Passwords are visible! Click button to secure them.</p>';
    document.getElementById('mockDBDisplay').innerHTML = html;
    document.getElementById('ch3Btn').style.display = 'inline-block';
}

async function challenge3() {
    if (mockDB.length === 0) { alert('Generate the mock database first!'); return; }
    let html = '<div class="code-block"><pre>';
    html += 'Secured Database\n';
    html += '-'.repeat(80) + '\n';
    html += 'ID | Username      | Password Hash\n';
    html += '-'.repeat(80) + '\n';
    for (const user of mockDB) { const hash = await sha256(user.password); html += `${user.id}  | ${user.username.padEnd(13)} | ${hash}\n`; }
    html += '</pre></div>';
    html += '<p style="color: #00ff88;">SUCCESS: All passwords are now hashed and secure.</p>';
    document.getElementById('ch3Result').innerHTML = html;
}

async function challenge4() {
    const input = document.getElementById('ch4Password').value;
    const stored = document.getElementById('storedHash').textContent;
    const inputHash = await sha256(input);
    let html = '<div class="result-display">';
    html += `<strong>Entered Password:</strong> ${input ? '●'.repeat(input.length) : '(empty)'}<br>`;
    html += `<strong>Hash of Input:</strong> ${inputHash}<br>`;
    html += `<strong>Stored Hash:</strong> ${stored}<br><br>`;
    if (inputHash === stored) html += '<span style="color: #00ff88; font-size: 1.1em;">ACCESS GRANTED - Password correct</span>';
    else html += '<span style="color: #ff4757; font-size: 1.1em;">ACCESS DENIED - Password incorrect</span>';
    html += '</div>';
    document.getElementById('ch4Result').innerHTML = html;
}

async function challenge5() {
    const password = document.getElementById('ch5Password').value;
    if (!password) { alert('Enter a password!'); return; }
    const plainHash = await sha256(password);
    const salt1 = Math.random().toString(36).substring(7);
    const salt2 = Math.random().toString(36).substring(7);
    const saltedHash1 = await sha256(password + salt1);
    const saltedHash2 = await sha256(password + salt2);
    let html = '<div class="result-display">';
    html += `<strong>Password:</strong> ${password}<br><br>`;
    html += '<strong>WITHOUT Salt (vulnerable):</strong><br>';
    html += `${plainHash}<br><br>`;
    html += '<strong>WITH Salt (protected):</strong><br>';
    html += `Salt 1: ${salt1}<br>`;
    html += `Hash 1: ${saltedHash1}<br><br>`;
    html += `Salt 2: ${salt2}<br>`;
    html += `Hash 2: ${saltedHash2}<br>`;
    html += '</div>';
    html += '<p style="color: #00ff88; margin-top: 15px;">Same password + different salts = different hashes. Salt defends against precomputed tables.</p>';
    document.getElementById('ch5Result').innerHTML = html;
}

function checkAnswer(questionNum, answer, isCorrect) {
    const feedback = document.getElementById(`q${questionNum}Feedback`);
    const options = document.querySelectorAll(`#quiz-tab .exercise-card:nth-child(${questionNum + 1}) .quiz-option`);
    options.forEach(opt => { opt.style.pointerEvents = 'none'; if (opt.textContent.trim().startsWith(answer)) opt.classList.add(isCorrect ? 'correct' : 'incorrect'); });
    if (!answeredQuestions.has(questionNum)) {
        answeredQuestions.add(questionNum);
        if (isCorrect) { quizScore++; feedback.innerHTML = '<p style="color: #00ff88; margin-top: 10px;">Correct</p>'; }
        else { feedback.innerHTML = '<p style="color: #ff4757; margin-top: 10px;">Incorrect</p>'; }
        document.getElementById('quizScore').textContent = quizScore;
    }
}

function resetQuiz() {
    quizScore = 0; answeredQuestions.clear(); document.getElementById('quizScore').textContent = '0';
    document.querySelectorAll('.quiz-option').forEach(opt => { opt.classList.remove('correct', 'incorrect'); opt.style.pointerEvents = 'auto'; });
    document.querySelectorAll('[id$="Feedback"]').forEach(fb => { fb.innerHTML = ''; });
}

function downloadFile(fileType) {
    let content = '';
    let filename = '';
    if (fileType === 'hashing_lab') {
        filename = 'mission3_hashing_lab.py';
        content = `import hashlib\nimport time\n\nprint("=" * 60)\nprint("CRYPTOGRAPHIC HASHING LABORATORY")\nprint("=" * 60)\n\ndef demo_basic_hashing():\n    plaintext = "LAUNCH-CODE-ALPHA"\n    hash_object = hashlib.sha256(plaintext.encode())\n    hash_hex = hash_object.hexdigest()\n    print(f"Plaintext:  {plaintext}")\n    print(f"Hash:       {hash_hex}")\n    print(f"Length:     {len(hash_hex)} characters")\n\ndef demo_avalanche_effect():\n    texts = ["LAUNCH-CODE-001","LAUNCH-CODE-002","LAUNCH-CODE-00","launch-code-001"]\n    for text in texts:\n        hash_val = hashlib.sha256(text.encode()).hexdigest()\n        print(f"{text:20} -> {hash_val[:32]}...")\n\ndef demo_speed_test():\n    test_sizes = [("10 bytes", "Short text"),("100 bytes", "A" * 100),("1000 bytes", "B" * 1000),("10000 bytes", "C" * 10000)]\n    for size_name, data in test_sizes:\n        start = time.time()\n        hash_result = hashlib.sha256(data.encode()).hexdigest()\n        elapsed = (time.time() - start) * 1000\n        print(f"{size_name:15} -> {elapsed:.4f} ms -> {hash_result[:32]}...")\n\ndef demo_collision_resistance():\n    print("SHA-256 produces 2^256 possible hashes. Finding a collision by chance is practically impossible.")\n\ndemo_basic_hashing()\ndemo_avalanche_effect()\ndemo_speed_test()\ndemo_collision_resistance()\ninput('Press ENTER to exit...')`;
    } else if (fileType === 'launch_codes') {
        filename = 'mission3_launch_codes.py';
        content = `import hashlib\nimport sqlite3\nimport time\nfrom datetime import datetime\nimport os\n\nif not os.path.exists('earth_base.db'):\n    print('Error: earth_base.db not found. Complete Mission 1 first.')\n    exit()\n\nconn = sqlite3.connect('earth_base.db')\ncursor = conn.cursor()\n\ndef setup_launch_codes_table():\n    cursor.execute("""CREATE TABLE IF NOT EXISTS LaunchCodes (code_id INTEGER PRIMARY KEY AUTOINCREMENT, code_identifier TEXT UNIQUE NOT NULL, plaintext_code TEXT, hash_value TEXT NOT NULL, timestamp TEXT NOT NULL, status TEXT DEFAULT 'pending')""")\n    conn.commit()\n\ndef hash_launch_code(plaintext_code):\n    return hashlib.sha256(plaintext_code.encode('utf-8')).hexdigest()\n\ndef generate_launch_codes(count=20):\n    sectors = ['ALPHA','BRAVO','CHARLIE','DELTA','ECHO']\n    types = ['DEFENSE','STRIKE','RECON','SHIELD']\n    codes = []\n    for i in range(1, count+1):\n        sector = sectors[(i-1) % len(sectors)]\n        code_type = types[(i-1) % len(types)]\n        codes.append(f"{sector}-{i:03d}-{code_type}")\n    return codes\n\ndef process_code_queue(codes):\n    for code in codes:\n        code_hash = hash_launch_code(code)\n        timestamp = datetime.now().isoformat()\n        cursor.execute("INSERT OR REPLACE INTO LaunchCodes (code_identifier, plaintext_code, hash_value, timestamp, status) VALUES (?, ?, ?, ?, ?)", (code, code, code_hash, timestamp, 'encrypted'))\n    conn.commit()\n\nsetup_launch_codes_table()\nlaunch_codes = generate_launch_codes(20)\nprocess_code_queue(launch_codes)\nconn.close()\nprint('Mission complete: Launch codes secured')\ninput('Press ENTER to exit...')`;
    } else if (fileType === 'secure_database') {
        filename = 'mission3_secure_database.py';
        content = `import hashlib\nimport sqlite3\nimport os\n\nif not os.path.exists('earth_base.db'):\n    print('Error: earth_base.db not found')\n    exit()\n\nconn = sqlite3.connect('earth_base.db')\ncursor = conn.cursor()\n\ndef hash_password(password):\n    return hashlib.sha256(password.encode()).hexdigest()\n\ndef scan_database():\n    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")\n    tables = [t[0] for t in cursor.fetchall()]\n    print('Found tables:', tables)\n    return tables\n\ndef secure_personnel_passwords():\n    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='Personnel'")\n    if not cursor.fetchone():\n        print('Personnel table not found')\n        return\n    try:\n        cursor.execute('ALTER TABLE Personnel ADD COLUMN password_hash TEXT')\n    except Exception:\n        pass\n    cursor.execute('SELECT personnel_id, name FROM Personnel')\n    for person_id, name in cursor.fetchall():\n        temp_password = f"{name.lower().replace(' ', '')}_temp123"\n        password_hash = hash_password(temp_password)\n        cursor.execute('UPDATE Personnel SET password_hash = ? WHERE personnel_id = ?', (password_hash, person_id))\n    conn.commit()\n\nscan_database()\nsecure_personnel_passwords()\nconn.close()\nprint('Database secured')\ninput('Press ENTER to exit...')`;
    }
    if (!content) return;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

// expose some functions for inline onclick attributes
window.switchTab = switchTab;
window.liveHash = liveHash;
window.demoAvalanche = demoAvalanche;
window.exercise1 = exercise1;
window.exercise2 = exercise2;
window.exercise3 = exercise3;
window.exercise4 = exercise4;
window.exercise5 = exercise5;
window.challenge1 = challenge1;
window.challenge2 = challenge2;
window.generateMockDB = generateMockDB;
window.challenge3 = challenge3;
window.challenge4 = challenge4;
window.challenge5 = challenge5;
window.checkAnswer = checkAnswer;
window.resetQuiz = resetQuiz;
window.downloadFile = downloadFile;

document.addEventListener('DOMContentLoaded', () => {
    // nothing to init for now
});
