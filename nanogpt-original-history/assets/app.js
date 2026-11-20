import {OriginalHistory} from './history.js';

const $=id=>document.getElementById(id);
let manifest=null,history=null;
const state={n:1,mode:'changes',file:''};
let renderVersion=0,queue=Promise.resolve();
const sourceBase='https://github.com/karpathy/nanoGPT/commit/';
const safeDate=value=>new Date(value).toLocaleString('en-US',{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'UTC'})+' UTC';
const chunkFile=(start,end)=>'./data/diffs/'+String(start).padStart(3,'0')+'-'+String(end).padStart(3,'0')+'.json';
async function readJSON(url){
  const response=await fetch(url,{cache:'no-cache'});
  if(!response.ok)throw new Error('Could not load '+url+' (HTTP '+response.status+')');
  return response.json();
}
function notice(text,kind=''){
  const el=$('notice');
  el.hidden=!text;
  el.className='notice'+(kind?' '+kind:'');
  if(text)el.textContent=text;
}
function element(tag,className,text){
  const n=document.createElement(tag);
  if(className)n.className=className;
  if(text!==undefined)n.textContent=String(text);
  return n;
}
function lineRow(entry,mode){
  const {path,item,kind}=entry;
  const row=element('div','code-row '+(kind==='del'?'deleted':kind==='add'?'added':'context'));
  row.dataset.stmId=item.id;
  row.dataset.originalFile=path;
  row.dataset.originCommit=String(item.origin);
  const labels=element('div','labels');
  const file=element('div','filename-chip',path);
  file.setAttribute('aria-label','Original file '+path);
  const stm=element('div','stm-chip',item.id);
  stm.setAttribute('aria-label',item.id+' · introduced at original commit '+item.origin);
  labels.append(file,stm);
  const cell=element('div','source-cell');
  const sign=element('span','change-sign',mode==='snapshot'?'':kind==='del'?'−':'+');
  sign.setAttribute('aria-hidden','true');
  const code=element('span','source');
  // textContent protects the original source exactly: no HTML substitution.
  code.textContent=item.text===''?'\u00a0':item.text;
  cell.append(sign,code);
  row.append(labels,cell);
  return row;
}
function fileSection(path,entries,caption,mode){
  const block=element('section','file-section');
  const head=element('div','file-head');
  head.append(element('span','file-head-name',path),element('span','file-head-count',caption));
  block.appendChild(head);
  for(const entry of entries)block.appendChild(lineRow(entry,mode));
  return block;
}
function renderRows(snapshot){
  const panel=$('rows');
  const fragment=document.createDocumentFragment();
  let shown=0,filesShown=0;
  if(state.mode==='changes'){
    // GitHub returns files in each real commit; show ALL changed files, not one
    // artificially selected file repeated for a series of commits.
    for(const f of snapshot.fileStats){
      if(state.file&&f.path!==state.file)continue;
      const entries=snapshot.changes.filter(x=>x.path===f.path);
      if(entries.length){
        shown+=entries.length;filesShown++;
        fragment.appendChild(fileSection(f.path,entries,'+'+f.added+' / −'+f.deleted+' original lines',state.mode));
      }else{
        const block=element('section','file-section');
        const head=element('div','file-head');
        head.append(element('span','file-head-name',f.path),element('span','file-head-count',f.status+' · no text patch'));
        block.appendChild(head);
        fragment.appendChild(block);
        filesShown++;
      }
    }
  }else{
    for(const [path,source] of [...snapshot.files.entries()].sort((a,b)=>a[0].localeCompare(b[0]))){
      if(state.file&&path!==state.file)continue;
      if(!source.length)continue;
      shown+=source.length;filesShown++;
      const entries=source.map(item=>({path,item,kind:'context'}));
      fragment.appendChild(fileSection(path,entries,source.length+' surviving lines',state.mode));
    }
  }
  if(!filesShown)fragment.appendChild(element('div','empty',
    state.file?'No text lines for this file in the chosen commit/view.':
    'No text source lines in this historical commit. See the file changes and coverage notices.'));
  panel.replaceChildren(fragment);
  return {shown,filesShown};
}
function updateFiles(snapshot){
  const paths=new Set([...snapshot.files.keys(),...snapshot.fileStats.map(x=>x.path)]);
  const chooser=$('file-filter');
  const existing=chooser.value;
  chooser.replaceChildren(new Option('All files',''));
  for(const path of [...paths].sort((a,b)=>a.localeCompare(b)))chooser.appendChild(new Option(path,path));
  if(state.file&&paths.has(state.file)){chooser.value=state.file;}
  else{state.file='';chooser.value='';}
}
function updateButtons(){
  $('commit-counter').textContent=state.n+' / '+manifest.commitCount;
  $('previous').disabled=state.n===1;
  $('next').disabled=state.n>=manifest.dataAvailableThrough;
  $('jump').max=String(manifest.dataAvailableThrough);
  $('changes-mode').setAttribute('aria-pressed',String(state.mode==='changes'));
  $('snapshot-mode').setAttribute('aria-pressed',String(state.mode==='snapshot'));
}
async function render(){
  const current=++renderVersion;
  updateButtons();
  const meta=manifest.commits[state.n-1];
  if(!meta)return;
  $('commit-title').textContent=meta.message;
  $('commit-date').dateTime=meta.date;
  $('commit-date').textContent=safeDate(meta.date);
  $('author').textContent=meta.author+(meta.merge?' · merged changes':'');
  $('commit-sha').textContent=meta.sha.slice(0,12);
  $('commit-link').href=sourceBase+meta.sha;
  notice('Loading genuine nanoGPT source changes…');
  // Serialize replay calls. Fast clicks must not corrupt mutable history state.
  queue=queue.catch(()=>{}).then(()=>history.get(state.n));
  try{
    const snapshot=await queue;
    if(current!==renderVersion)return;
    updateFiles(snapshot);
    const {shown,filesShown}=renderRows(snapshot);
    const adds=snapshot.fileStats.reduce((n,x)=>n+x.added,0);
    const dels=snapshot.fileStats.reduce((n,x)=>n+x.deleted,0);
    $('add-count').textContent='+'+adds+' lines';
    $('delete-count').textContent='−'+dels+' lines';
    $('file-count').textContent=snapshot.fileStats.length+' files changed';
    $('view-hint').textContent=state.mode==='changes'
      ? 'Changed lines only: additions are regular source; deletions are struck through, with the original green STM chip unchanged. The filename on each row is the real Git file.'
      : 'Exact surviving source from this commit, reconstructed from original Git patches. Deleted lines are not retained in this snapshot.';
    const info='Showing '+shown+' source rows in '+filesShown+' file'+(filesShown===1?'':'s')+
      '. Authentic first-parent commit '+state.n+'/'+manifest.commitCount+'.';
    notice(snapshot.warnings.length?info+' '+snapshot.warnings.join(' '):info,
      snapshot.warnings.length?'warning':'');
  }catch(error){
    if(current!==renderVersion)return;
    notice('Unable to reconstruct this commit: '+error.message,'error');
    $('rows').replaceChildren(element('div','empty','The original data could not be verified; no source lines were fabricated.'));
  }
}
function choose(n){
  if(!Number.isInteger(n)||n<1||n>manifest.dataAvailableThrough){
    notice('Currently indexed: original commits 1–'+manifest.dataAvailableThrough+
      ' out of '+manifest.commitCount+'. Additional history needs verified diff chunks.','warning');
    return;
  }
  state.n=n;
  render();
}
function attach(){
  $('previous').addEventListener('click',()=>choose(state.n-1));
  $('next').addEventListener('click',()=>choose(state.n+1));
  $('jump-form').addEventListener('submit',event=>{
    event.preventDefault();
    const n=Number($('jump').value);
    choose(n);
  });
  $('changes-mode').addEventListener('click',()=>{if(state.mode==='changes')return;state.mode='changes';render();});
  $('snapshot-mode').addEventListener('click',()=>{if(state.mode==='snapshot')return;state.mode='snapshot';render();});
  $('file-filter').addEventListener('change',event=>{state.file=event.target.value;render();});
  document.addEventListener('keydown',event=>{
    if(event.altKey||event.ctrlKey||event.metaKey||/INPUT|SELECT|TEXTAREA/.test(event.target.tagName))return;
    if(event.key==='ArrowLeft')choose(state.n-1);
    if(event.key==='ArrowRight')choose(state.n+1);
  });
}
async function start(){
  try{
    manifest=await readJSON('./data/manifest.json');
    if(manifest.sourceRepository!=='karpathy/nanoGPT'||manifest.historyKind!=='first-parent Git chronology')
      throw new Error('Unknown historical source manifest');
    if(manifest.dataAvailableThrough<1)throw new Error('Source diff batches have not been published yet');
    history=new OriginalHistory(manifest,async(start,end)=>readJSON(chunkFile(start,end)));
    $('coverage').textContent='Verified diff data currently indexed through original commit '+manifest.dataAvailableThrough+
      ' of '+manifest.commitCount+' first-parent commits.';
    attach();
    await render();
  }catch(error){
    notice('Viewer could not initialize: '+error.message+
      (location.protocol==='file:'?' Serve this folder over HTTP(S), not as a local file.':''),'error');
  }
}
void start();
