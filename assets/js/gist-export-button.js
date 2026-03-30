(function () {

  /* ─────────────────────────────────────────────────────
     STATE
  ───────────────────────────────────────────────────── */
  const widget     = document.getElementById('pixel-submit-widget');
  const exportBtn  = document.getElementById('psw-export-btn');
  const commitBtn  = document.getElementById('psw-commit-btn');
  let gistUrl = '';
  const dlgIcon    = document.getElementById('psw-dialog-icon');
  const dlgText    = document.getElementById('psw-dialog-text');
  const scrollCvs  = document.getElementById('psw-scroll-canvas');
  const carrierCvs = document.getElementById('psw-carrier-canvas');
  const sCtx       = scrollCvs.getContext('2d');
  const cCtx       = carrierCvs.getContext('2d');
  sCtx.imageSmoothingEnabled = false;
  cCtx.imageSmoothingEnabled = false;

  let scrollPhase  = 'idle';   // idle | writing | done
  let carrierPhase = 'idle';   // idle | pickingUp | running | delivered
  let exported     = false;

  const gistToken = widget.dataset.gistToken?.trim() || '';

  /* ─────────────────────────────────────────────────────
     PIXEL HELPER
  ───────────────────────────────────────────────────── */
  const SS = 3; // 1 grid unit = 3px
  function px(ctx, x, y, w, h, color) {
    if (!color) return;
    ctx.fillStyle = color;
    ctx.fillRect(x * SS, y * SS, w * SS, h * SS);
  }

  /* ─────────────────────────────────────────────────────
     DIALOG TYPEWRITER
  ───────────────────────────────────────────────────── */
  let typeInterval = null;
  function typeDialog(text, success) {
    clearInterval(typeInterval);
    dlgText.className = 'psw-dialog-text' + (success ? ' psw-dialog-success' : '');
    dlgText.textContent = '';
    let i = 0;
    typeInterval = setInterval(() => {
      dlgText.innerHTML = text.slice(0, ++i) + '<span class="psw-cursor">▌</span>';
      if (i >= text.length) clearInterval(typeInterval);
    }, 38);
  }

  /* ─────────────────────────────────────────────────────
     SCROLL CANVAS ANIMATION
  ───────────────────────────────────────────────────── */
  const P = {
    scrollLight: '#F5E6C8', scrollMid: '#E8D0A0', scrollDark: '#C4A860',
    scrollShadow: '#9A7840', rollEnd: '#D4B870', inkLine: '#2A1A08',
    inkFade: '#6A4A28', quillShaft: '#F0E0A0', quillTip: '#C8A830',
    quillNib: '#1A1A1A', quillBarb1: '#FFFFFF', quillBarb2: '#E8D890',
    sparkA: '#FFFFFF', sparkB: '#FFD700',
  };

  let scrollTick = 0, scrollRaf = null;

  function drawScroll(progress) {
    sCtx.clearRect(0, 0, scrollCvs.width, scrollCvs.height);
    const ox = 8, oy = 8;
    sCtx.fillStyle = 'rgba(0,0,0,0.18)';
    sCtx.beginPath();
    sCtx.ellipse((ox + 13) * SS, (oy + 20) * SS, 13 * SS, 2 * SS, 0, 0, Math.PI * 2);
    sCtx.fill();

    const bodyH = Math.floor(2 + progress * 14);
    px(sCtx, ox + 2, oy + 4, 22, bodyH, P.scrollLight);
    px(sCtx, ox + 2, oy + 4, 1, bodyH, P.scrollDark);
    px(sCtx, ox + 23, oy + 4, 1, bodyH, P.scrollDark);
    for (let i = 0; i < bodyH; i += 2) px(sCtx, ox + 3, oy + 4 + i, 20, 1, P.scrollMid);

    px(sCtx, ox + 1, oy + 2, 24, 3, P.rollEnd);
    px(sCtx, ox + 2, oy + 2, 22, 1, P.scrollLight);
    px(sCtx, ox + 1, oy + 2, 1, 3, P.scrollShadow);
    px(sCtx, ox + 24, oy + 2, 1, 3, P.scrollShadow);
    px(sCtx, ox + 3, oy + 2, 18, 1, '#FFF8E0');

    const by = oy + 4 + bodyH;
    px(sCtx, ox + 1, by, 24, 3, P.rollEnd);
    px(sCtx, ox + 2, by, 22, 1, P.scrollLight);
    px(sCtx, ox + 1, by, 1, 3, P.scrollShadow);
    px(sCtx, ox + 24, by, 1, 3, P.scrollShadow);
    px(sCtx, ox + 3, by, 18, 1, '#FFF8E0');

    const lines = [
      { y: oy + 6,  w: 16, x: ox + 4 }, { y: oy + 8,  w: 12, x: ox + 4 },
      { y: oy + 10, w: 18, x: ox + 4 }, { y: oy + 12, w: 10, x: ox + 4 },
      { y: oy + 14, w: 14, x: ox + 4 }, { y: oy + 16, w:  8, x: ox + 4 },
    ];
    lines.forEach((line, i) => {
      const lp = Math.max(0, Math.min(1, progress * 7 - i));
      if (lp <= 0) return;
      const w = Math.floor(line.w * lp);
      if (w <= 0) return;
      px(sCtx, line.x, line.y, w, 1, P.inkLine);
      if (w > 2) px(sCtx, line.x, line.y, 1, 1, P.inkFade);
    });
  }

  function drawQuill(cx, cy, frame) {
    const bob = (Math.sin(frame * 0.3) * 0.7) | 0;
    [
      [cx + 8, cy - 8 + bob, 1, 1, P.quillShaft], [cx + 7, cy - 7 + bob, 1, 1, P.quillShaft],
      [cx + 6, cy - 6 + bob, 1, 1, P.quillShaft], [cx + 5, cy - 5 + bob, 1, 1, P.quillShaft],
      [cx + 4, cy - 4 + bob, 1, 1, P.quillTip],   [cx + 3, cy - 3 + bob, 1, 1, P.quillTip],
      [cx + 2, cy - 2 + bob, 1, 1, P.quillTip],   [cx + 1, cy - 1 + bob, 1, 1, P.quillNib],
      [cx,     cy + bob,     1, 1, P.quillNib],
    ].forEach(([x, y, w, h, c]) => px(sCtx, x, y, w, h, c));
    [
      [cx + 5, cy - 6 + bob, P.quillBarb1], [cx + 4, cy - 6 + bob, P.quillBarb2],
      [cx + 6, cy - 7 + bob, P.quillBarb1], [cx + 5, cy - 8 + bob, P.quillBarb2],
      [cx + 7, cy - 8 + bob, P.quillBarb1], [cx + 8, cy - 9 + bob, P.quillBarb1],
    ].forEach(([x, y, c]) => px(sCtx, x, y, 2, 1, c));
    if (frame % 8 < 4) px(sCtx, cx, cy + 1 + bob, 1, 1, P.inkLine);
  }

  function drawScrollGlow(t) {
    const sparks = [{ x: 8, y: 6 }, { x: 30, y: 8 }, { x: 16, y: 4 }, { x: 26, y: 18 }, { x: 10, y: 20 }];
    sparks.forEach((s, i) => {
      const phase = t * 0.08 + i * 1.2;
      if (Math.sin(phase) <= 0.3) return;
      const size = Math.sin(phase) > 0.7 ? 2 : 1;
      px(sCtx, s.x, s.y, size, size, i % 2 === 0 ? P.sparkA : P.sparkB);
      if (size === 2) {
        px(sCtx, s.x + 1, s.y - 1, 1, 1, P.sparkA);
        px(sCtx, s.x - 1, s.y + 1, 1, 1, P.sparkA);
      }
    });
    const gp = (Math.sin(t * 0.06) + 1) / 2;
    sCtx.strokeStyle = `rgba(255,${180 + Math.floor(gp * 50)},0,${0.3 + gp * 0.4})`;
    sCtx.lineWidth = 2;
    sCtx.strokeRect(8 * SS + 1, 12 * SS + 1, 22 * SS - 2, 18 * SS - 2);
  }

  function runScrollLoop() {
    cancelAnimationFrame(scrollRaf);
    scrollTick = 0;
    function loop() {
      scrollTick++;
      const t = scrollTick;
      if (scrollPhase === 'idle') {
        drawScroll(0);
        drawQuill(18, 19, t);
      } else if (scrollPhase === 'writing') {
        const progress = Math.min(1, t / 160);
        drawScroll(progress);
        const lineIdx = Math.min(5, Math.floor(progress * 6));
        const tipXs = [18, 14, 20, 12, 16, 10];
        const tipX = (tipXs[lineIdx] || 10) - 4 + Math.floor((progress * 7 - lineIdx) * 16);
        drawQuill(tipX, 19 - lineIdx * 2, t);
        if (progress >= 1 && scrollPhase === 'writing') {
          scrollPhase = 'done';
          onScrollDone();
        }
      } else if (scrollPhase === 'done') {
        drawScroll(1);
        drawScrollGlow(t);
      }
      scrollRaf = requestAnimationFrame(loop);
    }
    loop();
  }

  /* ─────────────────────────────────────────────────────
     CARRIER CANVAS ANIMATION
  ───────────────────────────────────────────────────── */
  const WF = [
    { rL: 2,  lL: -1, rLy: -1, lLy: 0,  rA: -2, lA: 2,  bob: 0  },
    { rL: 1,  lL: 0,  rLy: 0,  lLy: 0,  rA: -1, lA: 1,  bob: -1 },
    { rL: 0,  lL: 1,  rLy: 0,  lLy: -1, rA: 0,  lA: 0,  bob: -1 },
    { rL: -1, lL: 2,  rLy: 0,  lLy: -1, rA: 1,  lA: -1, bob: 0  },
    { rL: -2, lL: 1,  rLy: 0,  lLy: 0,  rA: 2,  lA: -2, bob: 0  },
    { rL: -1, lL: 0,  rLy: 0,  lLy: 0,  rA: 1,  lA: -1, bob: -1 },
    { rL: 0,  lL: -1, rLy: -1, lLy: 0,  rA: 0,  lA: 0,  bob: -1 },
    { rL: 1,  lL: -2, rLy: -1, lLy: 0,  rA: -1, lA: 1,  bob: 0  },
  ];
  const MC = {
    skin: '#F5C4A1', sknD: '#D4956A', hat: '#1A3A6B', hatB: '#0D2347',
    uniB: '#1E4D8C', uniD: '#153870', pants: '#2B5BA8', panD: '#1E3F7A',
    shoe: '#2C1A0E', shoeH: '#3D2510', bag: '#C8880A', bagL: '#E8A820',
    white: '#FFFFFF', gold: '#FFD700', eye: '#1A1A1A', mouth: '#B06040', cheek: '#F0A080',
  };
  const SC2 = { body: '#F5E6C8', mid: '#E8D0A0', dark: '#C4A860', shadow: '#9A7840', ink: '#2A1A08' };

  function drawCarrier(ox, oy, frame, hasScroll, t) {
    const w = WF[frame % 8];
    const b = w.bob;
    cCtx.fillStyle = 'rgba(0,0,0,0.18)';
    cCtx.beginPath();
    cCtx.ellipse((ox + 1) * SS, (oy + 1) * SS, 8 * SS, 1.5 * SS, 0, 0, Math.PI * 2);
    cCtx.fill();
    px(cCtx, ox - 4, oy - 24 + b + w.lA, 2, 7, MC.uniD);
    px(cCtx, ox - 4, oy - 17 + b + w.lA, 2, 2, MC.skin);
    const rlx = ox + 1 + w.rL;
    px(cCtx, rlx, oy - 9 + b, 2, 5, MC.pants); px(cCtx, rlx, oy - 4 + b, 2, 4, MC.panD);
    px(cCtx, rlx - 1, oy + b + w.rLy, 4, 2, MC.shoe); px(cCtx, rlx + 1, oy + b + w.rLy, 2, 1, MC.shoeH);
    const llx = ox - 3 + w.lL;
    px(cCtx, llx, oy - 9 + b, 2, 5, MC.pants); px(cCtx, llx, oy - 4 + b, 2, 4, MC.panD);
    px(cCtx, llx - 1, oy + b + w.lLy, 4, 2, MC.shoe); px(cCtx, llx + 1, oy + b + w.lLy, 2, 1, MC.shoeH);
    px(cCtx, ox - 4, oy - 21 + b, 8, 12, MC.uniB);
    px(cCtx, ox - 3, oy - 20 + b, 1, 1, MC.white); px(cCtx, ox - 3, oy - 18 + b, 1, 1, MC.white); px(cCtx, ox - 3, oy - 16 + b, 1, 1, MC.white);
    px(cCtx, ox - 4, oy - 21 + b, 8, 2, MC.uniD);
    if (!hasScroll) {
      px(cCtx, ox + 3, oy - 20 + b, 4, 6, MC.bag); px(cCtx, ox + 3, oy - 20 + b, 4, 1, MC.bagL);
      px(cCtx, ox + 4, oy - 20 + b, 2, 1, MC.gold);
    }
    const armY = hasScroll ? w.rA - 4 : w.rA;
    px(cCtx, ox + 2, oy - 24 + b + armY, 2, 7, MC.uniB);
    px(cCtx, ox + 2, oy - 17 + b + armY, 2, 2, MC.skin);
    if (hasScroll) {
      const sx = ox + 3, sy = oy - 22 + b + armY;
      px(cCtx, sx, sy, 6, 8, SC2.body); px(cCtx, sx, sy, 6, 1, SC2.dark); px(cCtx, sx, sy + 7, 6, 1, SC2.dark);
      px(cCtx, sx, sy + 1, 1, 6, SC2.shadow); px(cCtx, sx + 5, sy + 1, 1, 6, SC2.shadow);
      px(cCtx, sx + 1, sy + 2, 4, 1, SC2.ink); px(cCtx, sx + 1, sy + 4, 3, 1, SC2.ink); px(cCtx, sx + 1, sy + 6, 4, 1, SC2.ink);
      if (carrierPhase === 'running') {
        cCtx.strokeStyle = `rgba(255,200,0,${0.4 + Math.sin(t * 0.15) * 0.3})`;
        cCtx.lineWidth = 1;
        cCtx.strokeRect(sx * SS - 1, sy * SS - 1, 7 * SS, 10 * SS);
      }
    }
    px(cCtx, ox - 4, oy - 10 + b, 8, 1, MC.gold); px(cCtx, ox - 1, oy - 10 + b, 2, 1, MC.bagL);
    px(cCtx, ox - 1, oy - 22 + b, 2, 1, MC.skin);
    px(cCtx, ox - 3, oy - 30 + b, 6, 8, MC.skin);
    px(cCtx, ox - 3, oy - 25 + b, 1, 1, MC.cheek); px(cCtx, ox + 2, oy - 25 + b, 1, 1, MC.cheek);
    px(cCtx, ox - 4, oy - 27 + b, 1, 2, MC.sknD);
    px(cCtx, ox - 2, oy - 28 + b, 2, 1, MC.hat); px(cCtx, ox + 1, oy - 28 + b, 2, 1, MC.hat);
    px(cCtx, ox - 2, oy - 27 + b, 2, 2, MC.white); px(cCtx, ox + 1, oy - 27 + b, 2, 2, MC.white);
    px(cCtx, ox - 1, oy - 27 + b, 1, 2, MC.eye); px(cCtx, ox + 1, oy - 27 + b, 1, 2, MC.eye);
    px(cCtx, ox,     oy - 25 + b, 1, 1, MC.sknD);
    px(cCtx, ox - 1, oy - 23 + b, 3, 1, MC.mouth);
    px(cCtx, ox - 4, oy - 33 + b, 8, 1, MC.hatB); px(cCtx, ox - 3, oy - 36 + b, 6, 3, MC.hat);
    px(cCtx, ox - 3, oy - 34 + b, 6, 1, MC.gold); px(cCtx, ox - 1, oy - 35 + b, 2, 2, MC.gold);
    px(cCtx, ox,     oy - 35 + b, 1, 1, MC.white);
  }

  let carrierTick = 0, carrierRaf = null, carrierX = 10, walkFrame = 0, groundScroll = 0;
  const dust = [];
  const cOY = 43;

  function runCarrierLoop() {
    cancelAnimationFrame(carrierRaf);
    carrierTick = 0; carrierX = 10; walkFrame = 0; groundScroll = 0;
    function loop() {
      carrierTick++;
      const t = carrierTick;
      cCtx.clearRect(0, 0, carrierCvs.width, carrierCvs.height);

      if (carrierPhase === 'idle') {
        drawGround(false);
        drawCarrier(10, cOY, 0, false, t);
      } else if (carrierPhase === 'pickingUp') {
        const lean = Math.min(1, t / 30);
        drawGround(false);
        if (lean < 0.8) {
          const sy = Math.floor(cOY - lean * 12);
          px(cCtx, 8, sy, 6, 8, SC2.body); px(cCtx, 8, sy, 6, 1, SC2.dark); px(cCtx, 8, sy + 7, 6, 1, SC2.dark);
          px(cCtx, 9, sy + 2, 4, 1, SC2.ink); px(cCtx, 9, sy + 4, 3, 1, SC2.ink);
        }
        drawCarrier(10, cOY, 1, lean > 0.6, t);
      } else if (carrierPhase === 'running') {
        groundScroll += 1.2;
        drawSpeedLines(t);
        drawGround(true);
        updateDust(t);
        carrierX = Math.min(carrierX + 0.8, 52);
        walkFrame += 0.4;
        drawCarrier(Math.floor(carrierX), cOY, Math.floor(walkFrame), true, t);
      } else if (carrierPhase === 'delivered') {
        drawStars(t);
        drawGround(false);
        if (t > 10) {
          cCtx.fillStyle = '#00FF88';
          [[18, 22], [19, 23], [20, 24], [21, 25], [22, 24], [23, 23], [24, 22], [25, 21], [26, 20]].forEach(([x, y]) => {
            const bob = (Math.sin(t * 0.08) * 1) | 0;
            cCtx.fillRect(x * SS, (y + bob) * SS, SS * 2, SS * 2);
          });
          if (t < 60) {
            cCtx.strokeStyle = `rgba(0,255,136,${1 - t / 80})`;
            cCtx.lineWidth = 2;
            cCtx.beginPath();
            cCtx.arc(23 * SS, 22 * SS, (t / 3) * SS, 0, Math.PI * 2);
            cCtx.stroke();
          }
        }
        drawCarrier(38, cOY, 0, false, t);
      }
      carrierRaf = requestAnimationFrame(loop);
    }
    loop();
  }

  function drawGround(running) {
    const W = carrierCvs.width / SS;
    const gy = cOY;
    px(cCtx, 0, gy, W, 1, '#2A1A08');
    if (running) {
      cCtx.fillStyle = '#4A3A18';
      for (let i = 0; i < 6; i++) {
        const dx = ((i * 14 - groundScroll) % (W + 14));
        cCtx.fillRect(dx * SS, gy * SS - 2, 8, 2);
      }
    }
  }

  function drawSpeedLines(t) {
    for (let i = 0; i < 4; i++) {
      const y = 10 + i * 6;
      const x = ((60 - t * 3 + i * 17) % 60);
      const len = 8 + i * 2;
      cCtx.fillStyle = `rgba(255,220,100,${0.14 - i * 0.03})`;
      cCtx.fillRect(x * SS, y * SS, len * SS, SS);
    }
  }

  function updateDust(t) {
    if (t % 4 === 0) dust.push({ x: carrierX - 6, y: cOY, vx: -0.5 - Math.random(), vy: -0.3, life: 1 });
    for (let i = dust.length - 1; i >= 0; i--) {
      dust[i].x += dust[i].vx; dust[i].y += dust[i].vy; dust[i].vy += 0.1; dust[i].life -= 0.06;
      if (dust[i].life <= 0) { dust.splice(i, 1); continue; }
      cCtx.fillStyle = `rgba(200,170,100,${dust[i].life * 0.5})`;
      cCtx.fillRect(dust[i].x * SS, dust[i].y * SS, SS, SS);
    }
  }

  function drawStars(t) {
    const stars = [{ x: 8, y: 8 }, { x: 48, y: 10 }, { x: 28, y: 5 }, { x: 14, y: 16 }, { x: 43, y: 6 }];
    stars.forEach((s, i) => {
      if (Math.sin(t * 0.1 + i * 1.3) <= 0) return;
      cCtx.fillStyle = i % 2 === 0 ? '#FFD700' : '#FFFFFF';
      cCtx.fillRect(s.x * SS, s.y * SS, SS, SS);
      cCtx.fillRect((s.x - 1) * SS, (s.y + 1) * SS, SS, SS);
      cCtx.fillRect((s.x + 1) * SS, (s.y + 1) * SS, SS, SS);
    });
  }

  /* ─────────────────────────────────────────────────────
     PHASE TRANSITIONS
  ───────────────────────────────────────────────────── */
  function onScrollDone() {
    exported = true;
    exportBtn.textContent = '✓ EXPORTED';
    exportBtn.classList.add('done');
    exportBtn.disabled = true;
    commitBtn.disabled = false;
    typeDialog('✦ Scroll complete and URL copied! Commit to deliver the quest.');
  }

  function startExport() {
    if (scrollPhase !== 'idle') return;

    const containers = document.querySelectorAll('.code-runner-container');
    const unsaved = [...containers].filter(c => {
      const key = c.dataset.storageKey;
      return !key || localStorage.getItem(key) === null;
    });

    if (unsaved.length) {
      typeDialog(`⚠ Please save your code first using the 💾 button in each runner.`);
      return;
    }

    scrollPhase = 'writing';
    exportBtn.disabled = true;
    exportBtn.textContent = 'Writing...';
    typeDialog('Inscribing your solutions onto the scroll...');

    if (gistToken) {
      (async () => {
        await new Promise(r => setTimeout(r, 5500));
        const containers = document.querySelectorAll('.code-runner-container');
        if (!containers.length) return;
        const files = {};
        containers.forEach((container, index) => {
          const runnerId = container.dataset.runnerId || `runner_${index + 1}`;
          const challengeBox = container.querySelector('.challenge-box');
          const challengeTitle = challengeBox?.querySelector('h3')?.textContent.trim() || `Part ${index + 1}`;
          const challengeDesc  = challengeBox?.querySelector('p')?.textContent.trim() || '';
          const langSelect = container.querySelector('.languageSelect');
          const lang = langSelect?.value || 'java';
          const ext = { python: 'py', java: 'java', javascript: 'js' }[lang] || 'txt';
          const storageKey = container.dataset.storageKey;
          const code = (storageKey ? localStorage.getItem(storageKey) : null)?.trim();
          if (!code) return;
          const content = `Question: ${challengeTitle}\n${challengeDesc}\n\nAnswer (runner: ${runnerId}):\n\n${code}`;
          const safeId = runnerId.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
          files[`${safeId}.${ext}`] = { content };
        });
        if (!Object.keys(files).length) return;
        try {
          const res = await fetch('https://api.github.com/gists', {
            method: 'POST',
            headers: {
              'Accept': 'application/vnd.github+json',
              'Authorization': `Bearer ${gistToken}`,
              'X-GitHub-Api-Version': '2022-11-28',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              description: widget.dataset.gistDescription || 'Exported from Open Coding Society',
              public: true,
              files,
            }),
          });
          if (!res.ok) throw new Error(`API ${res.status}`);
          const data = await res.json();
          const url = data.html_url;
        gistUrl = url;
        await navigator.clipboard.writeText(url);
        } catch (e) {
          console.error('Gist export failed:', e);
        }
      })();
    }
  }

  async function startCommit() {
    if (!exported || carrierPhase !== 'idle') return;
    carrierPhase = 'pickingUp';
    commitBtn.disabled = true;
    commitBtn.textContent = 'Picking up...';
    typeDialog('Mail Carrier picks up the scroll...');

    setTimeout(() => {
      carrierPhase = 'running';
      commitBtn.textContent = 'Delivering...';
      typeDialog('Delivering at full speed! ▶▶▶');

      setTimeout(async () => {
        carrierPhase = 'delivered';
        dlgIcon.textContent = '🏆';
        commitBtn.textContent = '✓ DELIVERED';

        const pathname = window.location.pathname;
        const filename = pathname.split('/').pop() || pathname;
        const submissionUrl = gistUrl.trim() || window.location.href;
        const uid = (window.currentUser || window.App?.user || window.user || {}).uid || '';

        const payload = {
          uid, assignment: filename, score: 0.0,
          teacherComments: 'Submitted from student page',
          submission: submissionUrl,
          submittedAt: new Date().toISOString(),
        };

        try {
          const res = await fetch('http://localhost:8585/api/grades', {
            method: 'POST', credentials: 'include',
            headers: { 'Content-Type': 'application/json', 'X-Origin': 'client' },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error(`API ${res.status}`);
          typeDialog('✔ Quest delivered! Awaiting grade...', true);
        } catch (err) {
          const manualModal = document.getElementById('grade-manual-modal');
          if (manualModal) {
            document.getElementById('manual-uid').value = uid;
            document.getElementById('manual-assignment').value = filename;
            document.getElementById('manual-submission').value = submissionUrl;
            manualModal.classList.add('show');
          }
          typeDialog('⚠ Backend offline — manual form opened.');
        }
      }, 2200);
    }, 900);
  }

  /* ─────────────────────────────────────────────────────
     BOOT
  ───────────────────────────────────────────────────── */
  exportBtn.addEventListener('click', startExport);
  commitBtn.addEventListener('click', startCommit);

  if (!gistToken) {
    exportBtn.textContent = 'TOKEN MISSING';
    exportBtn.disabled = true;
  }

  runScrollLoop();
  runCarrierLoop();

})();