// The records: every message, every edit and every moderator action, kept and exportable by
// person and date. An export is a CSV that opens in a spreadsheet, so a
// cell that starts like a formula is written as text: a member who types "=HYPERLINK(...)"
// can't make the file run it when staff open it.

/**
 * Record filters and the CSV export, used like Java's Math: Records.toCsv(rows).
 */
export class Records {
  static COLUMNS = Object.freeze(['at', 'channel', 'person', 'kind', 'text', 'note']);

  /**
   * The local day of a time, as YYYY-MM-DD.
   * @param {string} iso
   * @returns {string}
   */
  static dayOf(iso) {
    const date = new Date(iso);
    const pad = value => String(value).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  /**
   * The entries for one person (personId) between two days, both included. An empty
   * personId, from or to leaves that side open.
   * @param {{at: string, personId: number}[]} entries
   * @param {{personId?: number|string, from?: string, to?: string}} options days as YYYY-MM-DD
   * @returns {object[]} in time order
   */
  static filter(entries, { personId = '', from = '', to = '' } = {}) {
    return entries
      .filter(entry => personId === '' || personId === null || String(entry.personId) === String(personId))
      .filter(entry => !from || Records.dayOf(entry.at) >= from)
      .filter(entry => !to || Records.dayOf(entry.at) <= to)
      .sort((a, b) => new Date(a.at) - new Date(b.at));
  }

  /**
   * A cell's text, made safe for a spreadsheet: a value that starts with =, +, -, @, a tab
   * or a carriage return gets a leading apostrophe, so it's read as text, not a formula.
   * @param {*} value
   * @returns {string}
   */
  static safeCell(value) {
    const text = value === null || value === undefined ? '' : String(value);
    return /^[=+\-@\t\r\n]/.test(text) ? `'${text}` : text;
  }

  /**
   * The export's file name: the organization's name in plain lowercase, then "-records.csv".
   * @param {string} [org] the setup's short name
   * @returns {string}
   */
  static fileName(org) {
    const slug = String(org ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return `${slug || 'community'}-records.csv`;
  }

  /**
   * Rows as CSV (RFC 4180): a header, then one line per row, each ending in CRLF. A cell
   * with a comma, a quote or a line break is quoted, with its quotes doubled.
   * @param {object[]} rows objects keyed by column
   * @param {string[]} columns
   * @returns {string}
   */
  static toCsv(rows, columns = Records.COLUMNS) {
    const cell = (value) => {
      const text = Records.safeCell(value);
      return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
    };
    const lines = [columns.join(','), ...rows.map(row => columns.map(column => cell(row[column])).join(','))];
    return `${lines.join('\r\n')}\r\n`;
  }
}
