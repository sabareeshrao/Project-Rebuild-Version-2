// Pure display rules: neither the project source text nor the STM registry is edited.
const NEUTRAL = {background:'#232323', ink:'#a3a3a3'};
const COLORS = {
  line:'#15803d', comment:'#db2777', class:'#dc2626',
  method:'#2563eb', block:'#ea580c', nested:'#facc15'
};
const GROUP_COLORS = {
  file:[{background:'#00bfff',ink:'#071c2b'},{background:'#008cff',ink:'#06192d'}],
  package:[{background:'#78350f',ink:'#fff'},{background:'#94a3b8',ink:'#111827'}],
  module:[{background:'#881337',ink:'#fff'},{background:'#52525b',ink:'#fff'}]
};

const escapeHTML = value => String(value).replace(/&/g,'&amp;')
  .replace(/</g,'&lt;').replace(/>/g,'&gt;')
  .replace(/"/g,'&quot;').replace(/'/g,'&#39;');

export function getScope(lineNumber, category, fileId, manifest) {
  if (!['class','method','block','nested'].includes(category)) return null;
  const choices = manifest.scopes.filter(s => s.fileId === fileId
    && s.kind === category && s.from <= lineNumber && lineNumber <= s.to);
  choices.sort((a,b) => (a.to - a.from) - (b.to - b.from));
  return choices[0] || null;
}

function identity(line, category, manifest, fileId) {
  const file = manifest.files.find(f => f.id === fileId);
  if (!file || !line) return null;
  if (category === 'file') return file.id;
  if (category === 'module') return file.moduleId;
  if (category === 'package') return file.directoryId;
  return getScope(line.n,category,fileId,manifest)?.id || null;
}

export function needsDivider(previous, current, category, manifest, fileId) {
  if (!previous || !current || current.n !== previous.n + 1) return false;
  if (['line','comment'].includes(category)) return false;
  const before = identity(previous,category,manifest,fileId);
  const after = identity(current,category,manifest,fileId);
  if (!before || !after || before === after) return false;
  if (['file','package','module'].includes(category)) return true;
  const a = getScope(previous.n,category,fileId,manifest);
  const b = getScope(current.n,category,fileId,manifest);
  return Boolean(a && b && a.to < b.from);
}

function groupPalette(category, file, manifest) {
  const get = category === 'file' ? f => f.id
    : category === 'module' ? f => f.moduleId : f => f.directoryId;
  const unique = [...new Set(manifest.files.map(get))];
  const index = unique.indexOf(get(file));
  return GROUP_COLORS[category][Math.max(0,index) % 2];
}

export function chipColor(line, category, manifest, fileId) {
  if (category === 'line') return {background:COLORS.line,ink:'#fff',label:''};
  if (category === 'comment') {
    const selected = line.kind === 'comment' || line.kind === 'docstring';
    return selected ? {background:COLORS.comment,ink:'#fff',
      label:line.kind === 'docstring'?'DOCSTRING':'COMMENT'} : {...NEUTRAL,label:''};
  }
  const file = manifest.files.find(f => f.id === fileId);
  if (GROUP_COLORS[category]) {
    const p = groupPalette(category,file,manifest);
    const id = category === 'file' ? file.id : category === 'module' ? file.moduleId : file.directoryId;
    const name = category === 'file' ? file.path : category === 'module' ? file.module : file.directory;
    return {...p,label:line.n === 1 ? category.toUpperCase() + ' · ' + id + ' · ' + name : ''};
  }
  const scope = getScope(line.n,category,fileId,manifest);
  if (!scope) return {...NEUTRAL,label:''};
  return {background:COLORS[category],ink:category==='nested'?'#302400':'#fff',
    label:line.n===scope.from ? category.toUpperCase()+' · '+scope.id+' · '+scope.name : ''};
}

// Find the first true Python # outside quoted strings. Inline trailing comments
// are syntax highlighted; executable lines do NOT become COMMENT chips.
function commentStart(s) {
  let quote=null, escape=false;
  for(let i=0;i<s.length;i++){
    const c=s[i];
    if(escape){escape=false;continue;}
    if(quote){
      if(c==='\\'){escape=true;continue;}
      if(c===quote){quote=null;continue;}
      continue;
    }
    if(c==='#')return i;
    if(c==='"'||c==="'")quote=c;
  }
  return -1;
}

function syntaxHTML(s, sourceKind) {
  if(!s.trim())return '&nbsp;';
  if(sourceKind==='comment'||sourceKind==='docstring')return '<span class="comment-syntax">'+escapeHTML(s)+'</span>';
  const split=commentStart(s),expression=split<0?s:s.slice(0,split);
  const parts=expression.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g);
  const marked=parts.map((p,i)=>{
    if(i%2===1)return '<span class="string">'+escapeHTML(p)+'</span>';
    return escapeHTML(p).replace(/\b(class|def|if|else|elif|not|import|from|as|assert|return|None|True|False|pass|for|while|in|with)\b/g,
      '<span class="keyword">$1</span>')
      .replace(/\b(super|print|hasattr|isinstance|int|bool|float)\b/g,'<span class="builtin">$1</span>');
  }).join('');
  return marked+(split>=0?'<span class="comment-syntax">'+escapeHTML(s.slice(split))+'</span>':'');
}

// Group labels and commit markers occupy one fixed-size metadata slot.
// Recoloring a row changes text/colors only; it never appends or removes nodes.
function metadataFor(line,color,context) {
  const notes=[];
  if(context.mode==='selected') {
    const previousCommit=context.manifest.commits[line.firstCommit-2];
    const previousTotal=previousCommit?.fileTotals?.[context.fileId] || 0;
    if(line.n===previousTotal+1) {
      const added=context.manifest.commits[line.firstCommit-1]?.fileAdded?.[context.fileId] || 0;
      notes.push('COMMIT '+line.firstCommit+' · +'+added);
    }
  }
  if(color.label)notes.push(color.label);
  return notes.join(' · ');
}

// Used by both freshly mounted virtual rows and IN-PLACE category changes.
// Never reset heights or replace source/code DOM simply to switch categories.
export function applyRowCategory(row,line,previous,context) {
  const color=chipColor(line,context.category,context.manifest,context.fileId);
  const chip=row.querySelector('.line-chip');
  const info=row.querySelector('.chip-meta');
  const code=row.querySelector('.code-cell');
  if(!chip||!info||!code)throw new Error('Missing source row elements');
  chip.style.setProperty('--chip-bg',color.background);
  chip.style.setProperty('--chip-ink',color.ink);
  const text=metadataFor(line,color,context);
  info.textContent=text;
  info.setAttribute('aria-label',text || 'No new source group at this line');
  chip.setAttribute('aria-label','Original source '+line.id+(text?' · '+text:''));
  code.classList.toggle('category-divider',
    needsDivider(previous,line,context.category,context.manifest,context.fileId));
}

export function makeRow(line,previous,index,context) {
  const file=context.manifest.files.find(f=>f.id===context.fileId);
  if(!file)throw new Error('Missing file metadata for '+context.fileId);
  const row=document.createElement('div');
  row.className='code-row';
  row.dataset.rowIndex=String(index);
  row.dataset.sourceLine=String(line.n);
  row.dataset.stmId=line.id; // Full ORIGINAL ID, unchanged.
  row.setAttribute('aria-label',line.id+' · '+file.path);

  const left=document.createElement('div');left.className='chip-cell';
  const chip=document.createElement('div');chip.className='line-chip';
  const meta=document.createElement('div');meta.className='chip-meta'; // fixed reserved slot
  const id=document.createElement('div');id.className='line-id';
  id.textContent=(line.id.match(/^STM-\d+/)||[line.id])[0];
  chip.appendChild(meta);chip.appendChild(id);

  const filename=document.createElement('div');
  filename.className='filename-chip';
  filename.textContent=file.path.split('/').pop() || file.path;
  filename.setAttribute('aria-label','File '+file.path);
  // Filename first, category-colored STM chip second, original code on the right.
  left.appendChild(filename);
  left.appendChild(chip);

  const code=document.createElement('div');code.className='code-cell';
  const leading=(line.text.match(/^[ \t]*/)||[''])[0];
  const indent=document.createElement('span');indent.className='code-indent';
  indent.style.width='min('+leading.replace(/\t/g,'    ').length+'ch, 38%)';
  indent.setAttribute('aria-hidden','true');
  const content=document.createElement('span');content.className='code-content';
  content.innerHTML=syntaxHTML(line.text.slice(leading.length),line.kind);
  code.appendChild(indent);code.appendChild(content);

  row.appendChild(left);row.appendChild(code);
  applyRowCategory(row,line,previous,context);
  return row;
}
