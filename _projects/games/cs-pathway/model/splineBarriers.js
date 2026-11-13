// Pure barrier math: no DOM or engine imports, so it is easy to test.
export function sampleSpline(points, segments = 20) {
  if (!Array.isArray(points) || points.length < 2) return [];
  const cr = (a, b, c, d, t) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t);
  const out = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i], p1 = points[i], p2 = points[i + 1], p3 = points[i + 2] || points[i + 1];
    for (let j = 0; j < segments; j++) {
      const t = j / segments;
      out.push({ x: cr(p0.x, p1.x, p2.x, p3.x, t), y: cr(p0.y, p1.y, p2.y, p3.y, t) });
    }
  }
  out.push({ ...points[points.length - 1] });
  return out;
}

export function closestPointOnSegment(p, a, b) {
  const abx = b.x - a.x, aby = b.y - a.y;
  const len2 = abx * abx + aby * aby || 1;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * abx + (p.y - a.y) * aby) / len2));
  return { x: a.x + t * abx, y: a.y + t * aby };
}

// Pushes a circle out of every polyline it overlaps and returns the corrected center.
export function resolveCircle(pos, radius, polylines) {
  let { x, y } = pos;
  for (let pass = 0; pass < 2; pass++) {
    for (const pts of polylines) {
      for (let i = 0; i < pts.length - 1; i++) {
        const c = closestPointOnSegment({ x, y }, pts[i], pts[i + 1]);
        const dx = x - c.x, dy = y - c.y;
        const d = Math.hypot(dx, dy);
        if (d < radius && d > 0) { x = c.x + (dx / d) * radius; y = c.y + (dy / d) * radius; }
      }
    }
  }
  return { x, y };
}

// Keeps a circle inside the union of "road" corridors (each road is a segment
// with a half-width). Inside any corridor: unchanged. Outside all: snapped to
// the nearest corridor edge, so the player slides along walls instead of sticking.
export function clampToCorridor(pos, radius, segments, halfWidth) {
  const limit = halfWidth - radius;
  if (!segments.length || limit <= 0) return { x: pos.x, y: pos.y };
  let best = null;
  for (const [a, b] of segments) {
    const c = closestPointOnSegment(pos, a, b);
    const d = Math.hypot(pos.x - c.x, pos.y - c.y);
    if (d <= limit) return { x: pos.x, y: pos.y };
    if (!best || d - limit < best.excess) best = { c, d, excess: d - limit };
  }
  const dx = pos.x - best.c.x, dy = pos.y - best.c.y;
  return { x: best.c.x + (dx / best.d) * limit, y: best.c.y + (dy / best.d) * limit };
}

// Closed loop through `points` with rounded corners (quadratic spline per corner).
// Returns { points, mids }: dense points (first repeated at the end) and, per input
// vertex, the index of the sample at the middle of its corner.
export function roundedLoop(points, radius, steps = 8) {
  const n = points.length;
  const out = [];
  const mids = [];
  for (let i = 0; i < n; i++) {
    const prev = points[(i - 1 + n) % n], cur = points[i], next = points[(i + 1) % n];
    const d1 = Math.hypot(prev.x - cur.x, prev.y - cur.y);
    const d2 = Math.hypot(next.x - cur.x, next.y - cur.y);
    if (!d1 || !d2) { mids.push(out.length); out.push({ x: cur.x, y: cur.y }); continue; }
    const r = Math.min(radius, d1 / 2, d2 / 2);
    const a = { x: cur.x + ((prev.x - cur.x) / d1) * r, y: cur.y + ((prev.y - cur.y) / d1) * r };
    const b = { x: cur.x + ((next.x - cur.x) / d2) * r, y: cur.y + ((next.y - cur.y) / d2) * r };
    mids.push(out.length + Math.floor(steps / 2));
    for (let s = 0; s <= steps; s++) {
      const t = s / steps, u = 1 - t;
      out.push({
        x: u * u * a.x + 2 * u * t * cur.x + t * t * b.x,
        y: u * u * a.y + 2 * u * t * cur.y + t * t * b.y,
      });
    }
  }
  if (out.length) out.push({ ...out[0] });
  return { points: out, mids };
}
