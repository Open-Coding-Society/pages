// AP CSP Pseudocode interpreter — same engine as the standalone pseudocode runner notebook.
// Runs entirely client-side: tokenize → parse → generate JS → execute in a sandboxed Function.

const KW = new Set([
  'IF','ELSE','REPEAT','TIMES','UNTIL','FOR','EACH','IN',
  'PROCEDURE','RETURN','AND','OR','NOT','MOD','TRUE','FALSE',
  'DISPLAY','INPUT','APPEND','INSERT','REMOVE','LENGTH'
]);

function tokenize(src) {
  const out = []; let i = 0; const n = src.length;
  while (i < n) {
    const c = src[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === '/' && src[i+1] === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '"' || c === '“' || c === '”') {
      let s = ''; i++;
      while (i < n && src[i] !== '"' && src[i] !== '”') s += src[i++];
      i++; out.push({t:'S',v:s}); continue;
    }
    if (c === "'") {
      let s = ''; i++; while (i < n && src[i] !== "'") s += src[i++]; i++;
      out.push({t:'S',v:s}); continue;
    }
    if (/[0-9]/.test(c)) {
      let s = ''; while (i < n && /[0-9.]/.test(src[i])) s += src[i++];
      out.push({t:'N',v:+s}); continue;
    }
    if (/[a-zA-Z_]/.test(c)) {
      let s = ''; while (i < n && /[a-zA-Z0-9_]/.test(src[i])) s += src[i++];
      const u = s.toUpperCase();
      out.push({t: KW.has(u) ? 'K' : 'I', v: KW.has(u) ? u : s}); continue;
    }
    const sl = src.slice(i);
    if (sl.slice(0,3) === '<--') { out.push({t:'O',v:'←'}); i+=3; continue; }
    if (sl.slice(0,2) === '!=')  { out.push({t:'O',v:'≠'}); i+=2; continue; }
    if (sl.slice(0,2) === '>=')  { out.push({t:'O',v:'≥'}); i+=2; continue; }
    if (sl.slice(0,2) === '<=')  { out.push({t:'O',v:'≤'}); i+=2; continue; }
    if ('←≠≥≤'.indexOf(c) >= 0) { out.push({t:'O',v:c}); i++; continue; }
    if ('+-*/=<>(){}[],'.indexOf(c) >= 0) { out.push({t:'O',v:c}); i++; continue; }
    i++;
  }
  out.push({t:'E',v:''}); return out;
}

function Parser(toks) { this.t = toks; this.i = 0; }
Parser.prototype = {
  c:    function()    { return this.t[this.i]; },
  next: function()    { return this.t[this.i++]; },
  is:   function(t,v) { const c=this.c(); return c.t===t && (v==null||c.v===v); },
  eat:  function(t,v) {
    if (!this.is(t,v)) throw new Error('Expected '+(v||t)+", got '"+this.c().v+"'");
    return this.next();
  },
  try_: function(t,v) { if (this.is(t,v)) { this.next(); return true; } return false; },
  parse: function() { const s=[]; while(!this.is('E')) s.push(this.stmt()); return s; },
  stmt: function() {
    const c = this.c();
    if (c.t === 'K') {
      if (c.v==='IF')        return this.sIf();
      if (c.v==='REPEAT')    return this.sRep();
      if (c.v==='FOR')       return this.sFE();
      if (c.v==='PROCEDURE') return this.sProc();
      if (c.v==='RETURN')    return this.sRet();
      if (c.v==='DISPLAY')   return this.sDsp();
    }
    if (c.t === 'I') {
      const sv=this.i, name=this.next().v;
      if (this.try_('O','[')) {
        const idx=this.expr(); this.eat('O',']');
        if (this.try_('O','←')) return {k:'LA',name,idx,val:this.expr()};
        this.i = sv;
      } else if (this.try_('O','←')) {
        return {k:'A',name,val:this.expr()};
      } else { this.i = sv; }
    }
    return {k:'X',e:this.expr()};
  },
  sDsp:  function() { this.eat('K','DISPLAY'); this.eat('O','('); const e=this.expr(); this.eat('O',')'); return {k:'D',e}; },
  sIf:   function() {
    this.eat('K','IF'); this.eat('O','('); const cond=this.expr(); this.eat('O',')');
    this.eat('O','{'); const then=this.block(); this.eat('O','}');
    let els=null;
    if (this.try_('K','ELSE')) { this.eat('O','{'); els=this.block(); this.eat('O','}'); }
    return {k:'IF',cond,then,els};
  },
  sRep:  function() {
    this.eat('K','REPEAT');
    if (this.try_('K','UNTIL')) {
      this.eat('O','('); const cond=this.expr(); this.eat('O',')');
      this.eat('O','{'); const body=this.block(); this.eat('O','}');
      return {k:'RU',cond,body};
    }
    const cnt=this.expr(); this.eat('K','TIMES');
    this.eat('O','{'); const body=this.block(); this.eat('O','}');
    return {k:'RT',cnt,body};
  },
  sFE:   function() {
    this.eat('K','FOR'); this.eat('K','EACH');
    const item=this.eat('I').v; this.eat('K','IN');
    const lst=this.expr(); this.eat('O','{'); const body=this.block(); this.eat('O','}');
    return {k:'FE',item,lst,body};
  },
  sProc: function() {
    this.eat('K','PROCEDURE'); const name=this.eat('I').v; this.eat('O','(');
    const params=[];
    while (!this.is('O',')')) { params.push(this.eat('I').v); this.try_('O',','); }
    this.eat('O',')'); this.eat('O','{'); const body=this.block(); this.eat('O','}');
    return {k:'P',name,params,body};
  },
  sRet:  function() {
    this.eat('K','RETURN');
    const e = (this.is('O','}')||this.is('E')) ? null : this.expr();
    return {k:'R',e};
  },
  block: function() { const s=[]; while(!this.is('O','}')&&!this.is('E')) s.push(this.stmt()); return s; },
  expr:  function() { return this.eOr(); },
  eOr:   function() { let l=this.eAnd(); while(this.try_('K','OR'))  l={k:'B',op:'OR', l,r:this.eAnd()}; return l; },
  eAnd:  function() { let l=this.eNot(); while(this.try_('K','AND')) l={k:'B',op:'AND',l,r:this.eNot()}; return l; },
  eNot:  function() { if(this.try_('K','NOT')) return {k:'U',op:'NOT',o:this.eNot()}; return this.eCmp(); },
  eCmp:  function() {
    let l=this.eAdd();
    const C=['≠','≥','≤','=','>','<'];
    while(this.is('O') && C.indexOf(this.c().v)>=0) { const op=this.next().v; l={k:'B',op,l,r:this.eAdd()}; }
    return l;
  },
  eAdd:  function() {
    let l=this.eMul();
    while(this.is('O')&&(this.c().v==='+'||this.c().v==='-')) { const op=this.next().v; l={k:'B',op,l,r:this.eMul()}; }
    return l;
  },
  eMul:  function() {
    let l=this.eUn();
    while((this.is('O')&&(this.c().v==='*'||this.c().v==='/')) || this.is('K','MOD')) {
      const op=this.next().v; l={k:'B',op,l,r:this.eUn()};
    }
    return l;
  },
  eUn:   function() { if(this.is('O','-')){this.next();return{k:'U',op:'-',o:this.ePri()};} return this.ePri(); },
  ePri:  function() {
    const c=this.c();
    if(c.t==='N'){this.next();return{k:'N',v:c.v};}
    if(c.t==='S'){this.next();return{k:'S',v:c.v};}
    if(c.t==='K'&&c.v==='TRUE') {this.next();return{k:'N',v:true};}
    if(c.t==='K'&&c.v==='FALSE'){this.next();return{k:'N',v:false};}
    const BI=['APPEND','INSERT','REMOVE','LENGTH','INPUT','DISPLAY'];
    if(c.t==='K'&&BI.indexOf(c.v)>=0){
      const name=this.next().v; this.eat('O','(');
      const args=[]; while(!this.is('O',')')){args.push(this.expr());this.try_('O',',');}
      this.eat('O',')'); return {k:'BI',name,args};
    }
    if(this.try_('O','(')){const e=this.expr();this.eat('O',')');return e;}
    if(this.try_('O','[')){
      const els=[]; while(!this.is('O',']')){els.push(this.expr());this.try_('O',',');}
      this.eat('O',']'); return {k:'L',els};
    }
    if(c.t==='I'){
      const name=this.next().v;
      if(this.try_('O','(')){
        const args=[]; while(!this.is('O',')')){args.push(this.expr());this.try_('O',',');}
        this.eat('O',')'); return {k:'C',name,args};
      }
      if(this.try_('O','[')){const idx=this.expr();this.eat('O',']');return{k:'LG',name,idx};}
      return {k:'V',name};
    }
    throw new Error("Unexpected token: '"+c.v+"'");
  }
};

function gen(ast) {
  const scopes=[new Set()]; let depth=0, lid=0;
  const push = (pre) => { scopes.push(new Set(pre||[])); depth++; };
  const pop  = ()    => { scopes.pop(); depth--; };
  const decl = (n)   => scopes[scopes.length-1].add(n);
  const has  = (n)   => scopes.some(s => s.has(n));
  const ind  = ()    => '  '.repeat(depth);
  // + and comparisons delegate to __add/__cmp to eliminate JS implicit coercion
  const OPS  = {'AND':'&&','OR':'||','-':'-','*':'*','/':'/','MOD':'%'};
  const CMPS = new Set(['=','≠','>','<','≥','≤']);

  const stmts = (ss) => ss.map(stmt).join('\n');

  function stmt(n) {
    const p = ind();
    if (n.k==='A') {
      const v = expr(n.val);
      if (!has(n.name)) { decl(n.name); return p+'let '+n.name+' = '+v+';'; }
      return p+n.name+' = '+v+';';
    }
    if (n.k==='LA') return p+n.name+'[('+ expr(n.idx)+')-1] = '+expr(n.val)+';';
    if (n.k==='D')  return p+'__out('+expr(n.e)+');';
    if (n.k==='IF') {
      push(); const th=stmts(n.then); pop();
      let code = p+'if ('+expr(n.cond)+') {\n'+th+'\n'+p+'}';
      if (n.els) { push(); const el=stmts(n.els); pop(); code+=' else {\n'+el+'\n'+p+'}'; }
      return code;
    }
    if (n.k==='RT') {
      const id='_i'+depth+(lid++), cnt=expr(n.cnt);
      push(); const step=ind()+'__step();\n'; const body=step+stmts(n.body); pop();
      return p+'for (let '+id+'=0; '+id+'<('+cnt+'); '+id+'++) {\n'+body+'\n'+p+'}';
    }
    if (n.k==='RU') {
      push(); const step=ind()+'__step();\n'; const body=step+stmts(n.body); pop();
      return p+'while (!('+expr(n.cond)+')) {\n'+body+'\n'+p+'}';
    }
    if (n.k==='FE') {
      const lst=expr(n.lst); push([n.item]);
      const step=ind()+'__step();\n'; const body=step+stmts(n.body); pop();
      return p+'for (let '+n.item+' of '+lst+') {\n'+body+'\n'+p+'}';
    }
    if (n.k==='P') {
      push(n.params);
      // __step() at entry catches runaway recursion
      const step=ind()+'__step();\n';
      const body=step+stmts(n.body);
      pop();
      return p+'function '+n.name+'('+n.params.join(',')+') {\n'+body+'\n'+p+'}';
    }
    if (n.k==='R') return p+'return'+(n.e?' '+expr(n.e):'')+';';
    if (n.k==='X') return p+expr(n.e)+';';
    return p+'/* ? '+n.k+' */';
  }

  function expr(n) {
    if (n.k==='N') return JSON.stringify(n.v);
    if (n.k==='S') return JSON.stringify(n.v);
    if (n.k==='V') return n.name;
    if (n.k==='L') return '['+n.els.map(expr).join(',')+']';
    if (n.k==='LG') return n.name+'[('+ expr(n.idx)+')-1]';
    if (n.k==='C') return n.name+'('+n.args.map(expr).join(',')+')';
    if (n.k==='B') {
      if (n.op==='+') return '__add('+expr(n.l)+','+expr(n.r)+')';
      if (CMPS.has(n.op)) return '__cmp('+expr(n.l)+','+JSON.stringify(n.op)+','+expr(n.r)+')';
      return '('+expr(n.l)+' '+OPS[n.op]+' '+expr(n.r)+')';
    }
    if (n.k==='U') return n.op==='NOT' ? '!('+expr(n.o)+')' : '-('+expr(n.o)+')';
    if (n.k==='BI') {
      const a = n.args.map(expr);
      if (n.name==='APPEND')  return '('+a[0]+'.push('+a[1]+'),'+a[0]+')';
      if (n.name==='INSERT')  return '('+a[0]+'.splice(('+ a[1]+')-1,0,'+a[2]+'),'+a[0]+')';
      if (n.name==='REMOVE')  return '('+a[0]+'.splice(('+ a[1]+')-1,1),'+a[0]+')';
      if (n.name==='LENGTH')  return a[0]+'.length';
      if (n.name==='INPUT')   return '__inp('+(a[0]||'"Enter a value:"')+')';
      if (n.name==='DISPLAY') return '(__out('+a[0]+'),undefined)';
    }
    return '/* ? */';
  }

  return stmts(ast);
}

export function compile(src) {
  return gen(new Parser(tokenize(src)).parse());
}

function interpret(src) {
  const lines = [];
  const __out = (v) => {
    if (Array.isArray(v)) lines.push('['+v.map(x => JSON.stringify(x)).join(', ')+']');
    else lines.push(String(v));
  };
  const __add = (a, b) => {
    if (typeof a === 'number' && typeof b === 'number') return a + b;
    return String(a) + String(b);
  };
  const __cmp = (a, op, b) => {
    if (op === '=') return a === b;
    if (op === '≠') return a !== b;
    if (typeof a !== 'number' || typeof b !== 'number')
      throw new Error('AP CSP Runtime Error: Cannot use "'+op+'" to compare non-numeric values');
    if (op === '>') return a > b;
    if (op === '<') return a < b;
    if (op === '≥') return a >= b;
    return a <= b;
  };
  const __inp = (msg) => {
    try {
      const v = (window.prompt(msg) || '').trim();
      if (/^-?\d+$/.test(v)) return parseInt(v, 10);
      if (/^-?(\d+\.\d*|\d*\.\d+)$/.test(v)) return parseFloat(v);
      if (v.toUpperCase() === 'TRUE') return true;
      if (v.toUpperCase() === 'FALSE') return false;
      return v;
    } catch(e) { return ''; }
  };
  let steps = 0;
  const __step = () => {
    if (++steps > 100000)
      throw new Error('AP CSP Runtime Error: Possible infinite loop (exceeded 100k steps)');
  };

  const code = compile(src);
  try {
    new Function('__out','__inp','__step','__add','__cmp', code)(__out, __inp, __step, __add, __cmp);
  } catch(e) {
    const msg = e.message || String(e);
    if (msg.indexOf('AP CSP Runtime Error:') === 0) throw e;
    throw new Error('AP CSP Runtime Error: ' + msg);
  }
  return lines;
}

export class PseudocodeExecutor {
  constructor({ outputElement, execTimeElement } = {}) {
    this.outputElement = outputElement;
    this.execTimeElement = execTimeElement;
  }

  run(src) {
    const outputDiv = this.outputElement;
    const execTimeSpan = this.execTimeElement;
    if (!outputDiv) return;

    outputDiv.textContent = '⏳ Running...';
    if (execTimeSpan) execTimeSpan.textContent = '';

    const start = Date.now();
    try {
      const lines = interpret(src.trim());
      outputDiv.textContent = lines.length ? lines.join('\n') : '[no output]';
      if (execTimeSpan)
        execTimeSpan.textContent = `⏱ Execution time: ${Date.now() - start}ms (local)`;
    } catch(e) {
      outputDiv.textContent = e.message;
      if (execTimeSpan) execTimeSpan.textContent = '';
    }
  }
}

export default PseudocodeExecutor;
