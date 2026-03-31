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
//    initPagination(paginationSample)
// ============================================================

// ============================================================
//  WORKER 1 — sortData
//  Single responsibility: return a sorted copy of the dataset.
//  Pure function — no DOM access.
// ============================================================
function sortData(data, field, dir) {
    return [...data].sort((a, b) => {
      const av = a[field], bv = b[field];
      const cmp = typeof av === 'string' ? av.localeCompare(bv) : av - bv;
      return dir === 'desc' ? -cmp : cmp;
    });
  }
  
  // ============================================================
  //  WORKER 2 — renderPageResult
  //  Single responsibility: build the result text and inject it.
  // ============================================================
  function renderPageResult(rows, page, totalPages, total, size, start, field, dir) {
    const el = document.getElementById('pageOut');
    if (!el) return;
    el.textContent =
      `Page ${page} of ${totalPages - 1}  |  Size: ${size}  |  Sort: ${field} ${dir}\n` +
      `Total: ${total} records  |  Showing ${start + 1}–${Math.min(start + size, total)}\n\n` +
      rows.map(r => `  [${r.id}] ${r.name.padEnd(22)} ${r.size} employees`).join('\n');
  }
  
  // ============================================================
  //  WORKER 3 — renderPageNav
  //  Single responsibility: build Prev/Next buttons.
  // ============================================================
  function renderPageNav(page, totalPages, runPagingFn) {
    const nav = document.getElementById('pageNav');
    if (!nav) return;
    nav.innerHTML = '';
  
    if (page > 0) {
      const b = document.createElement('button');
      b.className   = 'secondary';
      b.textContent = '← Prev';
      b.addEventListener('click', () => {
        document.getElementById('pg').value = page - 1;
        runPagingFn();
      });
      nav.appendChild(b);
    }
    if (page < totalPages - 1) {
      const b = document.createElement('button');
      b.textContent = 'Next →';
      b.addEventListener('click', () => {
        document.getElementById('pg').value = page + 1;
        runPagingFn();
      });
      nav.appendChild(b);
    }
  }
  
  // ============================================================
  //  ORCHESTRATOR — initPagination
  //  Wires the Apply button and defines the runPaging function.
  // ============================================================
  export function initPagination(paginationSample) {
    function runPaging() {
      const field      = document.getElementById('sortField')?.value || 'id';
      const dir        = document.getElementById('sortDir')?.value   || 'asc';
      const size       = Math.max(1, parseInt(document.getElementById('sz')?.value) || 4);
      const data       = sortData(paginationSample, field, dir);
      const total      = data.length;
      const totalPages = Math.ceil(total / size);
      let   page       = Math.max(0, Math.min(parseInt(document.getElementById('pg')?.value) || 0, totalPages - 1));
  
      document.getElementById('pg').value = page;
  
      const start = page * size;
      const rows  = data.slice(start, start + size);
  
      renderPageResult(rows, page, totalPages, total, size, start, field, dir);
      renderPageNav(page, totalPages, runPaging);
    }
  
    document.getElementById('pagingBtn')?.addEventListener('click', runPaging);
  }