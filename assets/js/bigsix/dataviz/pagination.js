// ============================================================
//  pagination.js — Single Responsibility: Pagination demo
//  Path: assets/js/bigsix/dataviz/pagination.js
//
//  Owns everything related to Step 4 (Pagination & Sorting):
//    - Sorting the sample dataset
//    - Slicing into pages
//    - Rendering the result text
//    - Rendering Prev/Next navigation buttons
//
//  EXPORTS:
//    Pagination
// ============================================================

export class Pagination {
  #paginationSample;

  constructor(paginationSample) {
    this.#paginationSample = paginationSample;
  }

  // ============================================================
  //  PRIVATE WORKER 1 — #sortData
  //  Single responsibility: return a sorted copy of the dataset.
  //  Pure function — no DOM access.
  // ============================================================
  #sortData(data, field, dir) {
    return [...data].sort((a, b) => {
      const av = a[field], bv = b[field];
      const cmp = typeof av === 'string' ? av.localeCompare(bv) : av - bv;
      return dir === 'desc' ? -cmp : cmp;
    });
  }

  // ============================================================
  //  PRIVATE WORKER 2 — #renderPageResult
  //  Single responsibility: build the result text and inject it.
  // ============================================================
  #renderPageResult(rows, page, totalPages, total, size, start, field, dir) {
    const el = document.getElementById('pageOut');
    if (!el) return;
    el.textContent =
      `Page ${page} of ${totalPages - 1}  |  Size: ${size}  |  Sort: ${field} ${dir}\n` +
      `Total: ${total} records  |  Showing ${start + 1}–${Math.min(start + size, total)}\n\n` +
      rows.map(r => `  [${r.id}] ${r.name.padEnd(22)} ${r.size} employees`).join('\n');
  }

  // ============================================================
  //  PRIVATE WORKER 3 — #renderPageNav
  //  Single responsibility: build Prev/Next buttons.
  // ============================================================
  #renderPageNav(page, totalPages) {
    const nav = document.getElementById('pageNav');
    if (!nav) return;
    nav.innerHTML = '';

    if (page > 0) {
      const b = document.createElement('button');
      b.className   = 'secondary';
      b.textContent = '← Prev';
      b.addEventListener('click', () => {
        document.getElementById('pg').value = page - 1;
        this.#runPaging();
      });
      nav.appendChild(b);
    }
    if (page < totalPages - 1) {
      const b = document.createElement('button');
      b.textContent = 'Next →';
      b.addEventListener('click', () => {
        document.getElementById('pg').value = page + 1;
        this.#runPaging();
      });
      nav.appendChild(b);
    }
  }

  // ============================================================
  //  PRIVATE WORKER 4 — #runPaging
  //  Single responsibility: read DOM inputs, compute page slice,
  //  and render results + nav.
  // ============================================================
  #runPaging() {
    const field      = document.getElementById('sortField')?.value || 'id';
    const dir        = document.getElementById('sortDir')?.value   || 'asc';
    const size       = Math.max(1, parseInt(document.getElementById('sz')?.value) || 4);
    const data       = this.#sortData(this.#paginationSample, field, dir);
    const total      = data.length;
    const totalPages = Math.ceil(total / size);
    let   page       = Math.max(0, Math.min(parseInt(document.getElementById('pg')?.value) || 0, totalPages - 1));

    document.getElementById('pg').value = page;

    const start = page * size;
    const rows  = data.slice(start, start + size);

    this.#renderPageResult(rows, page, totalPages, total, size, start, field, dir);
    this.#renderPageNav(page, totalPages);
  }

  // ============================================================
  //  init — Wires the Apply button.
  // ============================================================
  init() {
    document.getElementById('pagingBtn')?.addEventListener('click', () => this.#runPaging());
  }
}
