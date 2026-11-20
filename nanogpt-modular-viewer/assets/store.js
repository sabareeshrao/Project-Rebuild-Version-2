// nanoGPT modular source explorer: file/chunk fetching stays separate from the UI.
// Chunks are fetched only when their source line numbers enter the visible window.
const MANIFEST_URL = new URL('../data/manifest.json', import.meta.url);

export class SourceStore {
  constructor() {
    this.manifest = null;
    this.cache = new Map();        // Small LRU of decoded source chunks.
    this.cacheLimit = 10;
  }

  async initialize() {
    const response = await fetch(MANIFEST_URL, {cache:'no-store'});
    if (!response.ok) throw new Error('Manifest HTTP ' + response.status);
    const document = await response.json();
    if (document.schemaVersion !== 1 || !Array.isArray(document.commits)
        || !Array.isArray(document.files) || !Array.isArray(document.scopes)) {
      throw new Error('Unsupported or incomplete source manifest');
    }
    if (!document.commits.length || !document.files.length) {
      throw new Error('Manifest does not contain any indexed commits or files');
    }
    for (let i = 0; i < document.commits.length; i++) {
      if (document.commits[i].n !== i + 1) throw new Error('Commit ordering is not contiguous');
    }
    this.manifest = document;
    return document;
  }

  getCommit(n) {
    const result = this.manifest?.commits[n - 1];
    if (!result || result.n !== n) throw new Error('Commit ' + n + ' is not indexed');
    return result;
  }

  getFile(fileId) {
    const result = this.manifest?.files.find(f => f.id === fileId);
    if (!result) throw new Error('Unindexed file ' + fileId);
    return result;
  }

  // All current nanoGPT source commits append original lines. The contract must
  // be extended for edits, deletions or moves before any such batch is added.
  fileTotalAt(fileId, n) {
    if (n <= 0) return 0;
    return Number(this.getCommit(n).fileTotals?.[fileId] || 0);
  }

  visibleRange(fileId, mode, commitNumber, selection) {
    const c = this.getCommit(commitNumber);
    this.getFile(fileId);
    let start = 1;
    let end = this.fileTotalAt(fileId, c.n);
    let text = 'Full file through commit ' + c.n;
    if (mode === 'added') {
      start = this.fileTotalAt(fileId, c.n - 1) + 1;
      text = 'Added in commit ' + c.n;
    } else if (mode === 'selected') {
      const s = selection || {start:commitNumber, end:commitNumber};
      if (s.start < 1 || s.end < s.start || s.end > this.manifest.commits.length) {
        throw new Error('Invalid selection range');
      }
      start = this.fileTotalAt(fileId, s.start - 1) + 1;
      end = this.fileTotalAt(fileId, s.end);
      text = s.start === s.end ? 'Commit ' + s.start + ' only'
        : 'Commits ' + s.start + '–' + s.end + ' only';
    } else if (mode !== 'full') {
      throw new Error('Unsupported view ' + mode);
    }
    return {first:start, last:end, length:Math.max(0, end - start + 1), description:text};
  }

  async loadChunk(file, descriptor) {
    const key = file.id + '|' + descriptor.path;
    if (this.cache.has(key)) {
      const reused = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, reused);
      return reused;
    }
    const url = new URL(descriptor.path, MANIFEST_URL);
    const pending = (async () => {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Source chunk HTTP ' + response.status + ': ' + descriptor.path);
      const chunk = await response.json();
      if (chunk.schemaVersion !== 1 || chunk.fileId !== file.id || !Array.isArray(chunk.lines)
          || chunk.fromLine !== descriptor.startLine || chunk.toLine !== descriptor.endLine
          || chunk.lines.length !== descriptor.endLine - descriptor.startLine + 1) {
        throw new Error('Chunk metadata mismatch: ' + descriptor.path);
      }
      chunk.lines.forEach((line, i) => {
        if (line.n !== descriptor.startLine + i || typeof line.text !== 'string'
            || typeof line.id !== 'string' || !line.id.startsWith('STM-')
            || !line.id.includes('-' + file.id + '-')
            || !Number.isInteger(line.firstCommit)) {
          throw new Error('Corrupt source/STM record at ' + descriptor.path + ':' + (i + 1));
        }
      });
      return chunk;
    })().catch(error => {
      this.cache.delete(key); // Let a later retry recover from intermittent errors.
      throw error;
    });
    this.cache.set(key, pending);
    while (this.cache.size > this.cacheLimit) this.cache.delete(this.cache.keys().next().value);
    return pending;
  }

  async readLines(fileId, first, last) {
    if (last < first) return [];
    const file = this.getFile(fileId);
    if (first < 1 || last > file.lineCount) throw new Error('Source window outside indexed file');
    const matching = file.chunks.filter(c => c.startLine <= last && c.endLine >= first);
    if (!matching.length) throw new Error('No source chunk covers requested lines');
    const chunks = await Promise.all(matching.map(c => this.loadChunk(file, c)));
    const lines = chunks.flatMap(c => c.lines)
      .filter(line => line.n >= first && line.n <= last)
      .sort((a, b) => a.n - b.n);
    if (lines.length !== last - first + 1 ||
        lines.some((line, i) => line.n !== first + i)) {
      throw new Error('Missing, duplicated or unordered source lines in ' + file.path);
    }
    return lines;
  }
}
