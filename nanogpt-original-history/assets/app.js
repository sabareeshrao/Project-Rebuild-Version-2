import {OriginalHistory} from './history.js';
import {syntaxHTML,sourceKind,classifyFileLines,classifyFileScopes} from './syntax.js';

const $=id=>document.getElementById(id);
const state={commit:1,mode:'all',selection:null,file:'',category:'line',fileOverlay:false,commentsOverlay:false};
let manifest=null,history=null,windowRows=null,allEvents=[];
let filePalette=new Map();
const classified=new WeakMap();
const structuralScopes=new WeakMap();
const storageKey='nanogpt-original-history-viewer-preferences-v1';

function saveState(){
  try{
    localStorage.setItem(storageKey,JSON.stringify({
      commit:state.commit,mode:state.mode,selection:state.selection,file:state.file,
      category:state.category,fileOverlay:state.fileOverlay,commentsOverlay:state.commentsOverlay
    }));
  }catch(_){/* Storage may be disabled; normal navigation still works. */}
}
function restoreState(){
  try{
    const saved=JSON.parse(localStorage.getItem(storageKey)||'null');
    if(!saved||typeof saved!=='object')return;
    if(['all','full','added','selected'].includes(saved.mode))state.mode=saved.mode;
    // Migrate older state: File used to color STM chips. It is now an
    // independent filename-column toggle, so preserve the user's preference.
    if(saved.category==='file'){state.category='line';state.fileOverlay=true;}
    else if(['line','class','method'].includes(saved.category))state.category=saved.category;
    if(typeof saved.fileOverlay==='boolean')state.fileOverlay=saved.fileOverlay;
    state.commentsOverlay=saved.commentsOverlay===true;
    if(Number.isInteger(saved.commit)&&saved.commit>=1&&saved.commit<=manifest.dataAvailableThrough)
      state.commit=saved.commit;
    if(saved.selection&&Number.isInteger(saved.selection.start)&&
      Number.isInteger(saved.selection.end)&&saved.selection.start>=1&&
      saved.selection.end<=manifest.dataAvailableThrough&&
      saved.selection.start<=saved.selection.end){
      state.selection={start:saved.selection.start,end:saved.selection.end};
    }
    const allowed=[...$('file-select').options].some(o=>o.value===saved.file);
    if(allowed&&typeof saved.file==='string'){state.file=saved.file;$('file-select').value=saved.file;}
    if(state.mode==='selected'&&!state.selection)
      state.selection={start:state.commit,end:state.commit};
  }catch(_){/* Invalid/blocked storage cannot prevent viewing original source. */}
}
function classifications(path,lines){
  let paths=classified.get(lines);
  if(!paths){paths=new Map();classified.set(lines,paths);}
  if(!paths.has(path))paths.set(path,classifyFileLines(path,lines));
  return paths.get(path);
}
function scopeClassifications(path,lines){
  let paths=structuralScopes.get(lines);
  if(!paths){paths=new Map();structuralScopes.set(lines,paths);}
  if(!paths.has(path))
    paths.set(path,classifyFileScopes(path,lines,classifications(path,lines)));
  return paths.get(path);
}
function chipPaint(entry){
  const scopes=entry.scope||{inClass:false,inMethod:false};
  const member=state.category==='line'||
    (state.category==='class'&&scopes.inClass)||
    (state.category==='method'&&scopes.inMethod);
  const documentation=entry.lineKind==='comment'||entry.lineKind==='docstring';
  // Comments overlay only within the active selected hierarchy.
  const pink=state.commentsOverlay&&documentation&&member;
  const base=state.category==='class'?'#dc2626':
    state.category==='method'?'#2563eb':'#15803d';
  const color=pink?'#db2777':member?base:'#232323';
  const index=filePalette.get(entry.path)??0;
  const fileColor=index%2===0?'#00bfff':'#008cff';
  return {
    color,ink:member?'#fff':'#a3a3a3',
    fileColor:state.fileOverlay?fileColor:'#292929',
    fileInk:state.fileOverlay?'#071b27':'#e2e8f0',
    fileBorder:state.fileOverlay?fileColor:'#494949',
    label:pink?'Comments overlay':member?
      (state.category==='class'?'Class · '+(scopes.className||'scope'):
       state.category==='method'?'Method · '+(scopes.methodName||'scope'):
       'Lines category'):'Outside '+state.category+' scope'
  };
}
function paintRow(row,entry){
  const chip=row.querySelector('.line-chip');
  const filename=row.querySelector('.filename-chip');
  if(!chip||!filename)throw new Error('Source row is missing a filename or STM chip');
  const paint=chipPaint(entry);
  chip.style.setProperty('--chip-bg',paint.color);
  chip.style.setProperty('--chip-ink',paint.ink);
  filename.style.setProperty('--file-bg',paint.fileColor);
  filename.style.setProperty('--file-ink',paint.fileInk);
  filename.style.setProperty('--file-edge',paint.fileBorder);
  chip.setAttribute('aria-label',entry.item.id+' · '+paint.label+
    ' · original file '+entry.path);
  filename.setAttribute('aria-label','Original source file '+entry.path+
    (state.fileOverlay?' · File colors ON':' · File colors OFF'));
}
const sourceBase='https://github.com/karpathy/nanoGPT/commit/';
const pad=n=>String(n).padStart(3,'0');

async function readJSON(path) {
  const response=await fetch(path,{cache:'no-cache'});
  if(!response.ok)throw new Error(path+': HTTP '+response.status);
  return response.json();
}
function message(text,error=false,warning=false) {
  const node=$('status');
  node.textContent=text;
  node.dataset.error=String(error);
  node.dataset.warning=String(warning);
}
function parseSelection(value,max){
  const match=String(value).trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
  if(!match)return null;
  const start=Number(match[1]),end=match[2]===undefined?start:Number(match[2]);
  if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<1||start>end||end>max)return null;
  return {start,end};
}
function htmlRow(entry,index) {
  const {path,item,kind,commit}=entry;
  const deleted=kind==='del';
  const row=document.createElement('div');
  row.className='code-row'+(deleted?' deleted':'');
  row.dataset.rowIndex=String(index);
  row.dataset.stmId=item.id;
  row.dataset.originalFile=path;
  row.dataset.originCommit=String(item.origin);
  if(commit)row.dataset.eventCommit=String(commit);
  row.setAttribute('aria-label',item.id+' · '+path+' · original commit '+item.origin+
    (deleted?' · removed in original commit '+commit:''));

  const chips=document.createElement('div');
  chips.className='chip-cell';
  const file=document.createElement('div');
  file.className='filename-chip';
  file.textContent=path.split('/').pop()||path;
  file.setAttribute('aria-label','Original source file '+path);
  const chip=document.createElement('div');
  chip.className='line-chip';
  const number=document.createElement('div');
  number.className='line-id';
  number.textContent=item.id;
  chip.appendChild(number);
  chips.append(file,chip);

  const cell=document.createElement('div');
  cell.className='code-cell';
  const source=item.text;
  const leading=(source.match(/^[ \t]*/)||[''])[0];
  const indent=document.createElement('span');
  indent.className='code-indent';
  indent.style.width='min('+leading.replace(/\t/g,'    ').length+'ch, 38%)';
  indent.setAttribute('aria-hidden','true');
  const code=document.createElement('span');
  code.className='code-content';
  // Faithful original code side: punctuation, spacing, Python colors, no diff signs.
  // Escaping is performed in syntaxHTML before assigning innerHTML.
  code.innerHTML=syntaxHTML(source.slice(leading.length),entry.lineKind||sourceKind(path,source));
  cell.append(indent,code);
  row.append(chips,cell);
  paintRow(row,entry);
  return row;
}

// Natural document scrolling, all source rows accessible. Reuse original
// row/spacer architecture so thousands of code lines do not overload Android DOM.
class HistoryWindow {
  constructor(host,windowElement,top,bottom){
    this.host=host;this.rows=windowElement;this.top=top;this.bottom=bottom;
    this.estimate=43;this.items=[];this.count=0;this.bit=new Float64Array(1);
    this.measured=new Map();this.rendered=null;this.frame=0;this.version=0;this.sourceKey=null;
    this.lastViewportWidth=window.innerWidth;
    this.observer=new ResizeObserver(entries=>{
      let changed=false;
      for(const entry of entries){
        const index=Number(entry.target.dataset.rowIndex);
        if(!Number.isInteger(index))continue;
        const height=entry.target.getBoundingClientRect().height;
        if(height>0&&this.setHeight(index,height))changed=true;
      }
      if(changed){this.positionSpacers();this.schedule();}
    });
    window.addEventListener('scroll',()=>this.schedule(),{passive:true});
    window.addEventListener('resize',()=>{
      if(Math.abs(window.innerWidth-this.lastViewportWidth)>1){
        this.lastViewportWidth=window.innerWidth;
        this.measured.clear();
        this.bit=new Float64Array(this.count+1);
        this.rendered=null;
        this.rows.replaceChildren();
        this.positionSpacers();
      }
      this.schedule();
    },{passive:true});
  }
  set(items,key){
    // Category toggles and All-commits navigation recolor EXISTING mounted
    // source rows. Don't rebuild the DOM, measurements or scroll position.
    if(key===this.sourceKey){this.recolor();return false;}
    this.sourceKey=key;
    this.items=items;this.count=items.length;this.version++;
    this.measured.clear();this.bit=new Float64Array(this.count+1);
    this.rendered=null;
    this.observer.disconnect();this.rows.replaceChildren();
    this.positionSpacers();this.schedule();return true;
  }
  recolor(){
    for(const row of this.rows.children){
      const index=Number(row.dataset.rowIndex);
      const entry=this.items[index];
      if(entry)paintRow(row,entry);
    }
  }
  scrollToCommit(commit){
    const index=this.items.findIndex(entry=>entry.commit>=commit);
    if(index<0)return;
    const sticky=$('sticky-tools').getBoundingClientRect().height;
    const top=window.scrollY+this.host.getBoundingClientRect().top+
      this.position(index)-sticky-10;
    window.scrollTo({top:Math.max(0,top),behavior:'auto'});
  }
  deltaPrefix(n){let s=0;for(let i=n;i>0;i-=i&-i)s+=this.bit[i];return s;}
  position(n){return n*this.estimate+this.deltaPrefix(n);}
  setHeight(n,h){
    if(n<0||n>=this.count)return false;
    const before=this.measured.get(n)??this.estimate;
    if(Math.abs(before-h)<1)return false;
    this.measured.set(n,h);
    for(let i=n+1;i<=this.count;i+=i&-i)this.bit[i]+=h-before;
    return true;
  }
  findIndex(y){
    let lo=0,hi=this.count;
    while(lo<hi){
      const mid=(lo+hi)>>1;
      if(this.position(mid+1)<=y)lo=mid+1;
      else hi=mid;
    }
    return Math.max(0,Math.min(this.count-1,lo));
  }
  visible(){
    if(!this.count)return {start:0,end:0};
    const r=this.host.getBoundingClientRect();
    const top=Math.max(0,-r.top);
    const start=Math.max(0,this.findIndex(Math.max(0,top-650))-2);
    const end=Math.min(this.count,this.findIndex(top+window.innerHeight+750)+3);
    return {start,end:Math.max(start+1,end)};
  }
  positionSpacers(){
    if(!this.rendered){
      this.top.style.height='0px';
      this.bottom.style.height=Math.max(0,this.position(this.count))+'px';
    }else{
      this.top.style.height=Math.max(0,this.position(this.rendered.start))+'px';
      this.bottom.style.height=Math.max(0,this.position(this.count)-this.position(this.rendered.end))+'px';
    }
  }
  schedule(){
    if(this.frame)return;
    this.frame=requestAnimationFrame(()=>{this.frame=0;this.update();});
  }
  update(){
    if(!this.count){this.rows.replaceChildren();return;}
    const wanted=this.visible();
    if(this.rendered&&this.rendered.start===wanted.start&&this.rendered.end===wanted.end){
      this.positionSpacers();return;
    }
    const frag=document.createDocumentFragment();
    for(let n=wanted.start;n<wanted.end;n++)frag.appendChild(htmlRow(this.items[n],n));
    this.observer.disconnect();
    this.rows.replaceChildren(frag);
    this.rendered=wanted;
    this.positionSpacers();
    for(const row of this.rows.children)this.observer.observe(row);
  }
}
function collectAllEvents(){
  const rows=[];
  for(let commit=1;commit<=manifest.dataAvailableThrough;commit++){
    const snapshot=history.snapshots.get(commit);
    if(!snapshot)throw new Error('Unverified source snapshot at '+commit);
    // Use the prior snapshot for removed lines and the new snapshot for additions:
    // a deleted comment retains its true historical comment/docstring identity.
    const before=history.snapshots.get(commit-1);
    for(const file of snapshot.fileStats){
      const newLines=snapshot.files.get(file.path)||[];
      const oldLines=before.files.get(file.path)||[];
      const newKinds=classifications(file.path,newLines);
      const oldKinds=classifications(file.path,oldLines);
      const newScopes=scopeClassifications(file.path,newLines);
      const oldScopes=scopeClassifications(file.path,oldLines);
      for(const record of snapshot.changes){
        if(record.path!==file.path)continue;
        const deleted=record.kind==='del';
        const lineKind=(deleted?oldKinds:newKinds).get(record.item.id)
          ||sourceKind(file.path,record.item.text);
        const scope=(deleted?oldScopes:newScopes).get(record.item.id)||
          {inClass:false,inMethod:false};
        rows.push({path:record.path,item:record.item,kind:record.kind,commit,lineKind,scope});
      }
    }
  }
  return rows;
}
function getRows(){
  let rows;
  if(state.mode==='full'){
    const snapshot=history.snapshots.get(state.commit);
    rows=[];
    for(const [path,lines] of snapshot.files){
      const kinds=classifications(path,lines);
      const scopes=scopeClassifications(path,lines);
      for(const item of lines)
        rows.push({path,item,kind:'context',commit:state.commit,
          lineKind:kinds.get(item.id)||sourceKind(path,item.text),
          scope:scopes.get(item.id)||{inClass:false,inMethod:false}});

    }
  }else if(state.mode==='all')rows=allEvents;
  else{
    const selection=(state.mode==='selected'||state.mode==='added')?state.selection:null;
    const first=selection?selection.start:state.commit;
    const last=selection?selection.end:state.commit;
    rows=allEvents.filter(r=>r.commit>=first&&r.commit<=last &&
      (state.mode!=='added'||r.kind==='add'));
  }
  if(state.file)rows=rows.filter(r=>r.path===state.file);
  return rows;
}
function setFileOptions(){
  const select=$('file-select');
  const files=new Set(allEvents.map(r=>r.path));
  for(const snapshot of history.snapshots.values())
    for(const path of snapshot.unavailableTextFiles||[])files.add(path);
  const previously=state.file;
  select.replaceChildren(new Option('All files',''));
  for(const path of [...files].sort())select.appendChild(new Option(path,path));
  if(previously&&files.has(previously))select.value=previously;
  else{select.value='';state.file='';}
}
function display(){
  const meta=manifest.commits[state.commit-1];
  const isAll=state.mode==='all';
  const bounds=state.selection;
  $('commit-title').textContent=isAll
    ? 'All original Git commits · full source evolution'
    :state.mode==='selected'&&bounds&&bounds.start!==bounds.end
      ? 'Commits '+bounds.start+'–'+bounds.end+' · original Git changes'
      :meta.message;
  const sha=isAll?manifest.commits[manifest.dataAvailableThrough-1]:meta;
  $('commit-link').href=sourceBase+sha.sha;
  $('commit-link').textContent=sha.sha.slice(0,12)+' · Original nanoGPT commit';
  $('commit-indicator').textContent=isAll?state.commit+' / '+manifest.commitCount:
    state.mode==='selected'&&bounds&&bounds.start!==bounds.end
    ? bounds.start+'–'+bounds.end : String(state.commit);
  $('previous').disabled=state.commit<=1;
  $('next').disabled=state.commit>=manifest.dataAvailableThrough;
  $('file-name').textContent=state.file||'All files';
  $('batch-indicator').textContent='Original nanoGPT Git history · '+manifest.commitCount+' real first-parent commits';
  $('mode-group').querySelectorAll('button').forEach(b=>{
    const pressed=b.dataset.action==='all'?isAll:b.dataset.mode===state.mode;
    b.setAttribute('aria-pressed',String(pressed));
  });
  $('categories').querySelectorAll('button[data-kind]').forEach(button=>{
    button.setAttribute('aria-pressed',String(button.dataset.kind==='comment'
      ?state.commentsOverlay:button.dataset.kind==='file'
        ?state.fileOverlay:button.dataset.kind===state.category));
  });
  const rows=getRows();
  const deleted=rows.filter(r=>r.kind==='del').length;
  const added=rows.filter(r=>r.kind==='add').length;
  const fileCount=new Set(rows.map(r=>r.path)).size;
  $('file-meta').textContent=rows.length+' source rows · '+fileCount+' files';
  const scope=state.category==='class'?'Class red':state.category==='method'
    ?'Method blue':'Lines green';
  const overlay=' · File '+(state.fileOverlay?'ON (filename chips)':'OFF')+
    ' · Comments '+(state.commentsOverlay?'ON (pink)':'OFF');
  $('hint').textContent=(isAll
    ? 'All commits: chronological source additions and struck-through deletions across real files.'
    :state.mode==='full'
      ? 'Full file: all source lines surviving original commit '+state.commit+'.'
      :state.mode==='added'
        ? 'Added only: actual new source lines from selected original commit(s).'
        : 'Selected: genuine source additions and struck-through deletions.')+
      ' '+scope+overlay+'.';
  const incomplete=history.snapshots.get(manifest.dataAvailableThrough).unavailableTextFiles;
  const warning=incomplete&&incomplete.size>0;
  message('Showing '+rows.length+(state.mode==='full'?' surviving source lines':' original line events')+
    ' ('+added+' added, '+deleted+' deleted) across '+fileCount+
    ' files. '+(warning?'One oversized historical notebook patch is unavailable; all Python source is verified.':''),false,warning);
  const scopeKey=state.mode==='all'?'all':state.mode==='full'
    ?'full:'+state.commit
    :state.mode+':'+(state.selection?.start??state.commit)+'-'+
      (state.selection?.end??state.commit);
  windowRows.set(rows,scopeKey+'|'+state.file);
}
function selectCommit(n){
  if(!Number.isInteger(n)||n<1||n>manifest.dataAvailableThrough)return;
  state.commit=n;
  // A step changes the focused commit in *every* mode. Keep the chosen mode,
  // category, overlay, and file filter; synchronize the saved range to this
  // single step so switching modes later doesn't resurrect an unrelated range.
  state.selection={start:n,end:n};
  $('jump-input').value=String(n);
  saveState();display();
  if(state.mode==='all')windowRows.scrollToCommit(n);
}
function allCommits(){
  // Mode is the only dimension changed. Keep file, category, comments,
  // commit and saved selection ready for the next mode switch.
  state.mode='all';
  $('jump-input').removeAttribute('aria-invalid');
  saveState();display();
}
function attach(){
  $('previous').addEventListener('click',()=>selectCommit(state.commit-1));
  $('next').addEventListener('click',()=>selectCommit(state.commit+1));
  $('mode-group').addEventListener('click',e=>{
    const button=e.target.closest('button');
    if(!button)return;
    if(button.dataset.action==='all'){allCommits();return;}
    if(!button.dataset.mode)return;
    state.mode=button.dataset.mode;
    if((state.mode==='selected'||state.mode==='added')&&!state.selection)
      state.selection={start:state.commit,end:state.commit};
    saveState();display();
  });
  $('categories').addEventListener('click',e=>{
    const button=e.target.closest('button[data-kind]');
    if(!button||button.disabled)return;
    if(button.dataset.kind==='comment')state.commentsOverlay=!state.commentsOverlay;
    else if(button.dataset.kind==='file')state.fileOverlay=!state.fileOverlay;
    else if(['line','class','method'].includes(button.dataset.kind))
      state.category=button.dataset.kind;
    else return;
    saveState();display();
  });
  $('jump-form').addEventListener('submit',e=>{
    e.preventDefault();
    const input=$('jump-input');
    const selected=parseSelection(input.value,manifest.dataAvailableThrough);
    if(!selected){
      input.setAttribute('aria-invalid','true');
      message('Enter a valid real commit from 1 to '+manifest.dataAvailableThrough+
        ' or a range (for example 5-10).',true);
      return;
    }
    input.removeAttribute('aria-invalid');
    state.commit=selected.end;state.selection=selected;
    // Jump changes the numbered commit/range ONLY. Preserve view mode,
    // filename filter, File/Lines category and independent Comments overlay.
    saveState();display();
    if(state.mode==='all')windowRows.scrollToCommit(selected.start);
  });
  $('jump-input').addEventListener('input',()=>$('jump-input').removeAttribute('aria-invalid'));
  $('file-select').addEventListener('change',e=>{state.file=e.target.value;saveState();display();});
  document.addEventListener('keydown',e=>{
    if(e.altKey||e.ctrlKey||e.metaKey||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;
    if(e.key==='ArrowLeft')selectCommit(state.commit-1);
    if(e.key==='ArrowRight')selectCommit(state.commit+1);
  });
}
async function start(){
  try{
    manifest=await readJSON('./data/manifest.json');
    if(manifest.sourceRepository!=='karpathy/nanoGPT'||
       manifest.historyKind!=='first-parent Git chronology'||
       manifest.dataAvailableThrough!==manifest.commitCount)
      throw new Error('Original commit manifest or historical diff coverage is incomplete');
    history=new OriginalHistory(manifest,async(start,end)=>{
      const path='./data/diffs/'+pad(start)+'-'+pad(end)+'.json';
      return readJSON(path);
    });
    message('Reconstructing '+manifest.dataAvailableThrough+' genuine Git commits and their source lines…');
    await history.get(manifest.dataAvailableThrough);
    allEvents=collectAllEvents();
    filePalette=new Map();
    for(const entry of allEvents)
      if(!filePalette.has(entry.path))filePalette.set(entry.path,filePalette.size);
    state.commit=manifest.dataAvailableThrough;
    windowRows=new HistoryWindow($('line-area'),$('line-window'),$('top-spacer'),$('bottom-spacer'));
    setFileOptions();restoreState();attach();display();
  }catch(error){
    message('Historical viewer could not initialize: '+error.message+
      (location.protocol==='file:'?' Open the GitHub Pages URL over HTTP(S).':''),true);
  }
}
void start();
