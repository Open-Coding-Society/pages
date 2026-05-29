import GameEnvBackground from './essentials/GameEnvBackground.js';

class GameLevelGraphHeuristics {
  constructor(gameEnv) {
    this.gameEnv = gameEnv;
    this.classes = [
      { class: GameEnvBackground, data: { fillStyle: '#1a1a2e' } }
    ];
  }

  initialize() {
    const W = this.gameEnv.innerWidth  || 620;
    const H = this.gameEnv.innerHeight || 400;

    const CTRL = 44;
    this.ROWS = 12; this.COLS = 20;
    this.CELL = Math.min(Math.floor((H - CTRL - 8) / this.ROWS), Math.floor(W / this.COLS));
    this.OX = Math.floor((W - this.COLS * this.CELL) / 2);
    this.OY = CTRL + 4;
    this.WALL = 1; this.WEIGHT = 2; this.START = 3; this.END = 4;
    this.COLORS = { 0:'#222244',1:'#e94560',2:'#a29bfe',3:'#00b894',4:'#fdcb6e',v:'#1a3a6a',p:'#53d8fb' };

    this.grid = []; this.cellState = {};
    this.sR = 1; this.sC = 1; this.eR = this.ROWS - 2; this.eC = this.COLS - 2;
    this.algoState = 'astar'; this.drawMode = 'wall';
    this.isDrawing = false; this.liveMode = false;
    this.lastPathKeys = []; this.rerouteCount = 0;
    this.statsText = 'Pick an algorithm and click Run.';
    this.frameCount = 0;

    this.open = null; this.vis = {}; this.par = {}; this.g = {};
    this.startKey = null;

    this.npcsVisible = true;
    this.SPRITES = [
      { src:'/images/gamify/chillguy.png', fw:128,fh:128,frames:3,rows:{right:1,left:2,up:0,down:0} },
      { src:'/images/gamify/r2_idle.png',  fw:168,fh:223,frames:3,rows:{right:0,left:0,up:0,down:0} }
    ];
    this.spriteImgs = this.SPRITES.map(d=>{ const i=new Image(); i.src=d.src; return i; });
    this.npcs = [];

    this._bar = document.createElement('div');
    this._bar.style.cssText = `position:absolute;top:0;left:0;width:${W}px;height:${CTRL}px;display:flex;align-items:center;gap:4px;padding:4px 6px;background:#12122a;z-index:10;flex-wrap:wrap;`;
    this.gameEnv.gameContainer.appendChild(this._bar);

    const mkBtn = (label, fn, col) => {
      const b = document.createElement('button');
      b.textContent = label;
      b.style.cssText = `padding:2px 8px;border:1.5px solid ${col};background:#16213e;color:${col};border-radius:4px;cursor:pointer;font-size:0.72em;font-weight:600;`;
      b.onmouseover = () => { b.style.background=col; b.style.color='#111'; };
      b.onmouseout  = () => { b.style.background='#16213e'; b.style.color=col; };
      b.onclick = fn; this._bar.appendChild(b); return b;
    };
    const sep = () => { const s=document.createElement('span'); s.style.cssText='width:1px;height:18px;background:#333;margin:0 2px;'; this._bar.appendChild(s); };

    const algoBtn = (label, a, col) => {
      const b = mkBtn(label, () => {
        this.algoState = a;
        allAlgoBtns.forEach(x=>{ x.style.background='#16213e'; x.style.color=x._col; });
        b.style.background=col; b.style.color='#111';
        if(this.liveMode) this.liveRepath();
      }, col);
      b._col = col; return b;
    };
    const allAlgoBtns = [
      algoBtn('A*','astar','#53d8fb'),
      algoBtn('Dijkstra','dijkstra','#00b894'),
      algoBtn('Greedy','greedy','#e94560')
    ];
    allAlgoBtns[0].style.background='#53d8fb'; allAlgoBtns[0].style.color='#111';
    sep();
    mkBtn('Run',    ()=>this.startSearch(this.algoState), '#fff');
    mkBtn('Race',   ()=>this.raceAll(),   '#fff');
    mkBtn('Clear',  ()=>this.clearPath(), '#aaa');
    mkBtn('Reset',  ()=>this.resetGrid(), '#aaa');
    mkBtn('Maze',   ()=>this.genMaze(),   '#aaa');
    sep();
    mkBtn('Draw Walls',()=>{ this.drawMode='wall'; },   '#f5a623');
    mkBtn('Weights',   ()=>{ this.drawMode='weight'; }, '#a29bfe');
    sep();
    mkBtn('Wanderers', ()=>this.toggleNpcs(), '#55efc4');
    mkBtn('Live Path', ()=>this.toggleLive(), '#fd79a8');

    const cv = this.gameEnv.canvas;
    this._onMouseDown = e=>{ e.preventDefault(); this.isDrawing=true; this.paintCell(e); };
    this._onMouseMove = e=>{ if(this.isDrawing) this.paintCell(e); };
    this._onMouseUp   = ()=>{ this.isDrawing=false; };
    cv.addEventListener('mousedown', this._onMouseDown);
    cv.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('mouseup', this._onMouseUp);

    this.initGrid();
  }

  key(r,c) { return r*this.COLS+c; }
  heur(r,c){ return Math.abs(r-this.eR)+Math.abs(c-this.eC); }
  wt(r,c)  { return this.grid[r][c]===this.WEIGHT?5:1; }
  cx(c)    { return this.OX+c*this.CELL; }
  cy(r)    { return this.OY+r*this.CELL; }

  nbrs(r,c,blockNpcs=false) {
    return [[-1,0],[1,0],[0,-1],[0,1]].reduce((a,[dr,dc])=>{
      const nr=r+dr,nc=c+dc;
      if(nr>=0&&nr<this.ROWS&&nc>=0&&nc<this.COLS&&this.grid[nr][nc]!==this.WALL)
        if(!blockNpcs||!this.npcs.some(n=>n.r===nr&&n.c===nc&&this.liveMode&&this.npcsVisible)) a.push([nr,nc]);
      return a;
    },[]);
  }

  initGrid() {
    this.grid = Array.from({length:this.ROWS},()=>Array(this.COLS).fill(0));
    this.grid[this.sR][this.sC]=this.START; this.grid[this.eR][this.eC]=this.END;
    this.cellState={}; this.open=null;
    this.npcs=[
      {r:2,c:Math.floor(this.COLS/2),dir:'right',frame:0,fc:0,si:0},
      {r:this.ROWS-3,c:Math.floor(this.COLS/3),dir:'right',frame:0,fc:0,si:0},
      {r:Math.floor(this.ROWS/2),c:this.COLS-3,dir:'right',frame:0,fc:0,si:1}
    ];
  }

  genMaze() {
    this.open=null; this.cellState={};
    this.grid=Array.from({length:this.ROWS},()=>Array(this.COLS).fill(0));
    this.grid[this.sR][this.sC]=this.START; this.grid[this.eR][this.eC]=this.END;
    for(let r=0;r<this.ROWS;r++) for(let c=0;c<this.COLS;c++) {
      if(this.grid[r][c])continue; const x=Math.random();
      if(x<0.27) this.grid[r][c]=this.WALL; else if(x<0.34) this.grid[r][c]=this.WEIGHT;
    }
    if(this.liveMode) this.liveRepath();
  }

  resetGrid() { this.liveMode=false; this.rerouteCount=0; this.lastPathKeys=[]; this.statsText=''; this.initGrid(); }
  clearPath() { if(this.open)return; this.cellState={}; if(this.liveMode){this.liveMode=false;} this.statsText=''; }

  paintCell(e) {
    const cv=this.gameEnv.canvas, rect=cv.getBoundingClientRect();
    const r=Math.floor((e.clientY-rect.top-this.OY)/this.CELL), c=Math.floor((e.clientX-rect.left-this.OX)/this.CELL);
    if(r<0||r>=this.ROWS||c<0||c>=this.COLS||this.grid[r][c]===this.START||this.grid[r][c]===this.END||this.open) return;
    const val=this.drawMode==='wall'?this.WALL:this.WEIGHT;
    this.grid[r][c]=this.grid[r][c]===val?0:val;
    delete this.cellState[this.key(r,c)];
    if(this.liveMode) this.liveRepath();
  }

  startSearch(a) {
    if(this.open)return; if(this.liveMode){this.liveMode=false;}
    this.algoState=a; this.cellState={}; this.vis={}; this.par={}; this.g={};
    const sk=this.key(this.sR,this.sC); this.startKey=sk; this.g[sk]=0;
    this.open=[{r:this.sR,c:this.sC,f:a==='dijkstra'?0:this.heur(this.sR,this.sC)}];
    this.statsText='Running...';
  }

  searchStep() {
    if(!this.open||this.open.length===0){this.open=null;this.statsText='No path found!';return;}
    this.open.sort((a,b)=>a.f-b.f);
    const cur=this.open.shift(), ck=this.key(cur.r,cur.c);
    if(this.vis[ck])return;
    this.vis[ck]=true;
    if(this.grid[cur.r][cur.c]!==this.START&&this.grid[cur.r][cur.c]!==this.END) this.cellState[ck]='v';
    if(cur.r===this.eR&&cur.c===this.eC){
      const pk=[]; let p=ck;
      while(p!==undefined&&p!==this.startKey){pk.push(p);p=this.par[p];}
      pk.push(this.startKey); pk.reverse();
      pk.forEach(k=>{const r=Math.floor(k/this.COLS),c=k%this.COLS; if(this.grid[r][c]!==this.START&&this.grid[r][c]!==this.END)this.cellState[k]='p';});
      const names={astar:'A*',dijkstra:"Dijkstra's",greedy:'Greedy BFS'};
      this.statsText=`${names[this.algoState]} — visited ${Object.keys(this.vis).length} | path ${pk.length} | cost ${this.g[ck]}`;
      this.open=null; return;
    }
    for(const[nr,nc] of this.nbrs(cur.r,cur.c)){
      const nk=this.key(nr,nc); if(this.vis[nk])continue;
      const tg=(this.g[ck]||0)+this.wt(nr,nc);
      if(tg<(this.g[nk]??Infinity)){
        this.g[nk]=tg; this.par[nk]=ck;
        const h=this.algoState==='dijkstra'?0:this.heur(nr,nc);
        this.open.push({r:nr,c:nc,f:this.algoState==='greedy'?h:tg+h});
      }
    }
  }

  toggleLive() {
    this.liveMode=!this.liveMode; this.open=null;
    if(this.liveMode) this.liveRepath();
    else{this.rerouteCount=0;this.cellState={};this.statsText='';}
  }

  liveRepath() {
    this.cellState={};
    const open=[],vis={},par={},g={},sk=this.key(this.sR,this.sC);
    g[sk]=0; open.push({r:this.sR,c:this.sC,f:this.algoState==='dijkstra'?0:this.heur(this.sR,this.sC)});
    let vn=0;
    while(open.length){
      open.sort((a,b)=>a.f-b.f); const cur=open.shift(),ck=this.key(cur.r,cur.c);
      if(vis[ck])continue; vis[ck]=true; vn++;
      if(cur.r===this.eR&&cur.c===this.eC){
        const pk=[]; let p=ck; while(p!==undefined&&p!==sk){pk.push(p);p=par[p];} pk.push(sk); pk.reverse();
        const blocked=this.lastPathKeys.length>0&&this.npcs.some(n=>this.lastPathKeys.includes(this.key(n.r,n.c)));
        if(blocked) this.rerouteCount++;
        pk.forEach(k=>{const r=Math.floor(k/this.COLS),c=k%this.COLS;if(this.grid[r][c]!==this.START&&this.grid[r][c]!==this.END)this.cellState[k]='p';});
        this.lastPathKeys=pk;
        const names={astar:'A*',dijkstra:"Dijkstra's",greedy:'Greedy'};
        this.statsText=`Live ${names[this.algoState]} — explored ${vn} | cost ${g[ck]}${blocked?' ↺ rerouted ('+this.rerouteCount+')':''}`;
        return;
      }
      for(const[nr,nc]of this.nbrs(cur.r,cur.c,true)){
        const nk=this.key(nr,nc); if(vis[nk])continue;
        const tg=(g[ck]||0)+this.wt(nr,nc);
        if(tg<(g[nk]??Infinity)){g[nk]=tg;par[nk]=ck;const h=this.algoState==='dijkstra'?0:this.heur(nr,nc);open.push({r:nr,c:nc,f:this.algoState==='greedy'?h:tg+h});}
      }
    }
    this.lastPathKeys=[]; this.statsText='Path blocked!';
  }

  raceAll() {
    if(this.open)return; this.liveMode=false; this.cellState={}; this.statsText='';
    const run=a=>{
      const open=[],vis={},par={},g={},sk=this.key(this.sR,this.sC); g[sk]=0;
      open.push({r:this.sR,c:this.sC,f:a==='dijkstra'?0:this.heur(this.sR,this.sC)});
      while(open.length){
        open.sort((x,y)=>x.f-y.f); const cur=open.shift(),ck=this.key(cur.r,cur.c);
        if(vis[ck])continue; vis[ck]=true;
        if(cur.r===this.eR&&cur.c===this.eC) return{found:true,vn:Object.keys(vis).length,cost:g[ck],ck,par,sk};
        for(const[nr,nc]of this.nbrs(cur.r,cur.c)){
          const nk=this.key(nr,nc); if(vis[nk])continue;
          const tg=(g[ck]||0)+this.wt(nr,nc);
          if(tg<(g[nk]??Infinity)){g[nk]=tg;par[nk]=ck;const h=a==='dijkstra'?0:this.heur(nr,nc);open.push({r:nr,c:nc,f:a==='greedy'?h:tg+h});}
        }
      }
      return{found:false};
    };
    const algos=['greedy','dijkstra','astar'], names={astar:'A*',dijkstra:"Dijkstra's",greedy:'Greedy'};
    const res={}; algos.forEach(a=>res[a]=run(a));
    const winner=algos.filter(a=>res[a].found).sort((a,b)=>res[a].vn-res[b].vn)[0];
    this.statsText=algos.map(a=>res[a].found?`${names[a]}:${res[a].vn}n c${res[a].cost}`:'no path').join(' | ')+(winner?` → ${names[winner]} wins`:'');
    if(winner){const{par,ck,sk}=res[winner];const pk=[];let p=ck;while(p!==undefined&&p!==sk){pk.push(p);p=par[p];}pk.push(sk);pk.reverse();pk.forEach(k=>{const r=Math.floor(k/this.COLS),c=k%this.COLS;if(this.grid[r][c]!==this.START&&this.grid[r][c]!==this.END)this.cellState[k]='p';});}
  }

  toggleNpcs() { this.npcsVisible=!this.npcsVisible; if(!this.npcsVisible&&this.liveMode){this.liveMode=false;} }

  stepNpcs() {
    if(!this.npcsVisible)return;
    this.npcs.forEach((npc,i)=>{
      const dirs=[[-1,0,'up'],[1,0,'down'],[0,-1,'left'],[0,1,'right']].sort(()=>Math.random()-0.5);
      for(const[dr,dc,d]of dirs){
        const nr=npc.r+dr,nc=npc.c+dc;
        if(nr<0||nr>=this.ROWS||nc<0||nc>=this.COLS||this.grid[nr][nc]===this.WALL)continue;
        if(this.npcs.some((o,j)=>j!==i&&o.r===nr&&o.c===nc))continue;
        npc.r=nr;npc.c=nc;npc.dir=d;break;
      }
    });
    if(this.liveMode) this.liveRepath();
  }

  update() {
    if (!this.grid) return;
    this.frameCount++;
    if(this.open) this.searchStep();
    if(this.frameCount%36===0) this.stepNpcs();
    if(this.frameCount%7===0) this.npcs.forEach(n=>{ n.fc=(n.fc+1)%4; if(n.fc===0) n.frame=(n.frame+1)%this.SPRITES[n.si].frames; });

    const ctx = this.gameEnv.ctx;
    const {ROWS,COLS,CELL,COLORS,grid,cellState} = this;

    ctx.fillStyle='#1a1a2e'; ctx.fillRect(0,0,this.gameEnv.innerWidth,this.gameEnv.innerHeight);

    ctx.textAlign='center'; ctx.textBaseline='middle';
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
      const k=this.key(r,c);
      ctx.fillStyle=cellState[k]==='p'?COLORS.p:cellState[k]==='v'?COLORS.v:COLORS[grid[r][c]];
      ctx.fillRect(this.cx(c)+1,this.cy(r)+1,CELL-2,CELL-2);
      if(grid[r][c]===this.START||grid[r][c]===this.END||grid[r][c]===this.WEIGHT){
        ctx.fillStyle='#111'; ctx.font=`bold ${Math.floor(CELL*0.38)}px sans-serif`;
        ctx.fillText(grid[r][c]===this.START?'S':grid[r][c]===this.END?'G':'5',this.cx(c)+CELL/2,this.cy(r)+CELL/2);
      }
    }

    if(this.npcsVisible) this.npcs.forEach(npc=>{
      const def=this.SPRITES[npc.si],img=this.spriteImgs[npc.si];
      const dx=this.cx(npc.c)+1,dy=this.cy(npc.r)+1,sz=CELL-2;
      if(this.liveMode){ctx.save();ctx.shadowColor='#fd79a8';ctx.shadowBlur=6;ctx.strokeStyle='#fd79a8';ctx.lineWidth=2;ctx.strokeRect(dx,dy,sz,sz);ctx.restore();}
      if(img.complete&&img.naturalWidth){
        ctx.save();
        if(npc.dir==='left'){ctx.translate(dx+sz,dy);ctx.scale(-1,1);ctx.drawImage(img,npc.frame*def.fw,(def.rows[npc.dir]||0)*def.fh,def.fw,def.fh,0,0,sz,sz);}
        else ctx.drawImage(img,npc.frame*def.fw,(def.rows[npc.dir]||0)*def.fh,def.fw,def.fh,dx,dy,sz,sz);
        ctx.restore();
      } else {ctx.fillStyle=this.liveMode?'#fd79a8':'#55efc4';ctx.fillRect(dx,dy,sz,sz);}
    });

    if(this.statsText){
      ctx.fillStyle='rgba(0,0,0,0.55)'; ctx.fillRect(0,this.gameEnv.innerHeight-26,this.gameEnv.innerWidth,26);
      ctx.fillStyle='#ccc'; ctx.font='11px sans-serif'; ctx.textAlign='left'; ctx.textBaseline='middle';
      ctx.fillText(this.statsText,8,this.gameEnv.innerHeight-13);
    }
  }

  destroy() {
    this.isDrawing = false;
    const cv = this.gameEnv && this.gameEnv.canvas;
    if(cv){
      if(this._onMouseDown) cv.removeEventListener('mousedown', this._onMouseDown);
      if(this._onMouseMove) cv.removeEventListener('mousemove', this._onMouseMove);
    }
    if(this._onMouseUp) document.removeEventListener('mouseup', this._onMouseUp);
    if(this._bar && this._bar.parentNode) this._bar.parentNode.removeChild(this._bar);
  }
}

export default GameLevelGraphHeuristics;
