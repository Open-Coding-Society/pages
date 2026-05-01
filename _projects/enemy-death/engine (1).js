const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 640; canvas.height = 360;

let currentProjectName = "";

const Engine = {
    objects: [], keys: {}, assets: {}, folders: [], running: false, state: 'MENU',
    init() {
        window.addEventListener('keydown', e => this.keys[e.code] = true);
        window.addEventListener('keyup', e => this.keys[e.code] = false);
        this.loop();
        updateProjectList();
    },
    loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (this.state === 'MENU') {
            this.drawMenu();
        } else if (this.state === 'PLAYING' && this.running) {
            this.objects.forEach(obj => { obj.update?.(); obj.draw(); });
            this.updateInspector();
        }
        requestAnimationFrame(() => this.loop());
    },
    drawMenu() {
        ctx.fillStyle = "rgba(13, 17, 23, 0.9)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white"; ctx.font = "bold 24px Segoe UI"; ctx.textAlign = "center";
        ctx.fillText(currentProjectName.toUpperCase(), canvas.width/2, 160);
        ctx.font = "14px Segoe UI"; ctx.fillStyle = "#58a6ff";
        ctx.fillText("Press [ENTER] to Run Project", canvas.width/2, 210);
        if (this.keys.Enter) this.state = 'PLAYING';
    },
    updateInspector() {
        document.getElementById('live-status').innerText = "Running";
        document.getElementById('live-count').innerText = this.objects.length;
        if (this.objects.length > 0) {
            const p = this.objects[0];
            document.getElementById('live-x').innerText = Math.round(p.x);
            document.getElementById('live-y').innerText = Math.round(p.y);
        }
    }
};

class Actor {
    constructor(x, y, assetName = null) {
        this.x = x; this.y = y; this.width = 50; this.height = 50;
        this.assetName = assetName; this.color = '#58a6ff';
    }
    draw() {
        if (this.assetName && Engine.assets[this.assetName]) {
            ctx.drawImage(Engine.assets[this.assetName], this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = this.color; ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

// --- FILE SYSTEM & SPRITES ----
document.getElementById('spriteInput').addEventListener('change', function(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image(); img.src = event.target.result;
        img.onload = () => {
            Engine.assets[file.name] = img;
            let sprFolder = Engine.folders.find(f => f.name === "Sprites");
            if (!sprFolder) { sprFolder = {name: "Sprites", files: []}; Engine.folders.push(sprFolder); }
            sprFolder.files.push(file.name);
            renderTree();
        };
    };
    reader.readAsDataURL(file);
});

function createNewFolder() {
    const n = prompt("Folder Name:"); 
    if(n) { Engine.folders.push({name: n, files: []}); renderTree(); }
}

function renderTree() {
    const t = document.getElementById('file-tree'); t.innerHTML = "";
    Engine.folders.forEach(f => {
        t.innerHTML += `<div class="folder">📁 ${f.name}</div>`;
        f.files.forEach(file => t.innerHTML += `<div class="file-item">🖼️ ${file}</div>`);
    });
}

// --- PROJECT HUB LOGIC ---
function updateProjectList() {
    const list = document.getElementById('project-list');
    const projects = JSON.parse(localStorage.getItem('ocs_hub') || "{}");
    list.innerHTML = "";
    Object.keys(projects).forEach(name => {
        const card = document.createElement('div');
        card.className = "project-card";
        card.style = "background:var(--bg-med); padding:10px; margin-bottom:5px; border-radius:5px; cursor:pointer; display:flex; justify-content:space-between;";
        card.innerHTML = `<span>${name}</span> <button onclick="deleteProject('${name}')" style="background:#e74c3c; color:white; padding:2px 5px; font-size:10px;">Delete</button>`;
        card.onclick = (e) => { if(e.target.tagName !== 'BUTTON') openProject(name); };
        list.appendChild(card);
    });
}

function createNewProject() {
    const n = prompt("Project Name:"); if(!n) return;
    const p = JSON.parse(localStorage.getItem('ocs_hub') || "{}");
    p[n] = { code: "// Start Coding", date: new Date().toLocaleDateString() };
    localStorage.setItem('ocs_hub', JSON.stringify(p)); updateProjectList();
}

function openProject(n) {
    const p = JSON.parse(localStorage.getItem('ocs_hub') || "{}");
    currentProjectName = n; document.getElementById('codeEditor').value = p[n].code;
    document.getElementById('project-launcher').style.display = "none";
}

function saveProject() {
    const p = JSON.parse(localStorage.getItem('ocs_hub') || "{}");
    p[currentProjectName].code = document.getElementById('codeEditor').value;
    localStorage.setItem('ocs_hub', JSON.stringify(p));
    document.getElementById('save-status').innerText = "(Saved)";
    setTimeout(() => document.getElementById('save-status').innerText = "", 1500);
}

function runGame() {
    Engine.objects = []; Engine.state = 'MENU';
    try { eval(document.getElementById('codeEditor').value); Engine.running = true; canvas.focus(); updateHierarchyUI(); }
    catch(e) { alert("Error: " + e.message); }
}

function updateHierarchyUI() {
    const list = document.getElementById('hierarchy-list'); list.innerHTML = "";
    Engine.objects.forEach((o, i) => {
        list.innerHTML += `<div class="obj-item">Object_${i} [Actor]</div>`;
    });
}

Engine.init();