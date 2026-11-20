import {SourceStore} from './store.js';
import {WindowedRows} from './virtual.js';

const $ = id => document.getElementById(id);
const store = new SourceStore();
const state={commit:1,category:'line',mode:'full',selection:null,fileId:null};
let viewport=null;

function message(text,error=false){
  $('status').textContent=text;
  $('status').dataset.error=String(Boolean(error));
}

function parseSelection(input,max) {
  const match=String(input).trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
  if(!match)return null;
  const start=Number(match[1]),end=match[2]===undefined?start:Number(match[2]);
  if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)
    ||start<1||end>max||start>end)return null;
  return {start,end};
}

function display() {
  const data=store.manifest;
  const commit=store.getCommit(state.commit);
  const file=store.getFile(state.fileId);
  const bounds=viewport.configure(state);
  const title=state.mode==='selected' && state.selection?.start!==state.selection?.end
    ? 'Commits '+state.selection.start+'–'+state.selection.end+' · '+(state.selection.end-state.selection.start+1)+' verified steps'
    : commit.message;
  $('commit-title').textContent=title;
  $('commit-link').href=commit.url;
  $('commit-link').textContent=commit.sha.slice(0,10)+' · Original nanoGPT commit';
  $('commit-indicator').textContent=state.mode==='selected'&&state.selection
    &&state.selection.start!==state.selection.end
    ? state.selection.start+'–'+state.selection.end : String(state.commit);
  $('previous').disabled=state.commit===1;
  $('next').disabled=state.commit===data.commits.length;
  $('file-name').textContent=file.path+' · '+file.id;
  const batches=Math.ceil(data.history.totalNanoGPTCommits/data.history.plannedBatchSize);
  const batchText='Batch '+String(data.history.batchNumber).padStart(2,'0');
  $('batch-indicator').textContent='Original nanoGPT history · '+batchText+' / '+batches;
  $('file-meta').textContent=batchText+' · '+data.history.completedThrough+' / '+data.history.totalNanoGPTCommits+
    ' source commits indexed · '+file.lineCount+' lines at batch end';
  const allIndexed=state.mode==='full'&&state.commit===data.commits.length&&!state.selection;
  $('mode-group').querySelectorAll('button').forEach(b=>{
    const on=b.dataset.action==='all'?allIndexed:
      (b.dataset.mode===state.mode&&!(b.dataset.mode==='full'&&allIndexed));
    b.setAttribute('aria-pressed',String(on));
  });
  $('categories').querySelectorAll('button').forEach(b=>
    b.setAttribute('aria-pressed',String(b.dataset.kind===state.category)));
  message(bounds.description+' · '+bounds.length+' source lines in '+file.path+'.',false);
  const notes={
    line:'Every original line is green by default, including comments and source blanks.',
    comment:'Only standalone # comments and Python docstrings are pink; other chips are neutral.',
    class:'Class chips are red, including source blanks/comments/docstrings within classes.',
    method:'Method chips are blue, including source blanks/comments/docstrings within methods.',
    block:'Code Block chips are orange for all lines within each block.',
    nested:'Nested Block chips are yellow for all member lines.',
    file:'File chips are saturated sky blue, alternating between files.',
    module:'Module chips alternate Burgundy/Graphite across modules.',
    package:'Directory chips alternate Brown/Silver across directories.'
  };
  $('hint').textContent=(notes[state.category]||'')+
    ' A thin green code-area line only separates adjacent sibling groups.';
}

// One click always leaves a single/range filter and restores the cumulative
// source through the LAST currently indexed nanoGPT commit.
function showAllIndexedCommits() {
  state.commit=store.manifest.commits.length;
  state.mode='full';state.selection=null;
  $('jump-input').value='';
  $('jump-input').removeAttribute('aria-invalid');
  display();
}

function selectCommit(number) {
  if(number<1||number>store.manifest.commits.length)return;
  state.commit=number;
  if(state.mode==='selected')state.selection={start:number,end:number};
  display();
}

function attachControls() {
  $('previous').addEventListener('click',()=>selectCommit(state.commit-1));
  $('next').addEventListener('click',()=>selectCommit(state.commit+1));
  $('mode-group').addEventListener('click',event=>{
    const button=event.target.closest('button');
    if(!button)return;
    if(button.dataset.action==='all'){showAllIndexedCommits();return;}
    if(!button.dataset.mode)return;
    state.mode=button.dataset.mode;
    if(state.mode==='selected'&&!state.selection)state.selection={start:state.commit,end:state.commit};
    if(state.mode==='full')state.selection=null;
    display();
  });
  $('categories').addEventListener('click',event=>{
    const selected=event.target.closest('button[data-kind]');
    if(!selected)return;
    if(state.category===selected.dataset.kind)return;
    state.category=selected.dataset.kind;
    // Same source range: virtualizer recolors mounted rows IN PLACE, preserving
    // row measurements, DOM identity and current page scroll position.
    display();
  });
  $('jump-form').addEventListener('submit',event=>{
    event.preventDefault();
    const input=$('jump-input');
    const selected=parseSelection(input.value,store.manifest.commits.length);
    if(!selected){
      input.setAttribute('aria-invalid','true');
      message('Enter a valid commit (e.g. 5) or inclusive range (e.g. 5-10) from 1 to '
        +store.manifest.commits.length+'.',true);
      return;
    }
    input.removeAttribute('aria-invalid');
    state.selection=selected;state.commit=selected.end;state.mode='selected';
    display();
  });
  $('jump-input').addEventListener('input',()=> $('jump-input').removeAttribute('aria-invalid'));
  $('file-select').addEventListener('change',event=>{
    state.fileId=event.target.value;
    display();
  });
}

async function start(){
  try{
    const data=await store.initialize();
    state.commit=data.history.completedThrough;
    state.fileId=data.files[0].id;
    const selector=$('file-select');
    data.files.forEach(file=>{
      const option=document.createElement('option');
      option.value=file.id;option.textContent=file.path;selector.appendChild(option);
    });
    selector.value=state.fileId;
    viewport=new WindowedRows({
      store,host:$('line-area'),windowElement:$('line-window'),
      topSpacer:$('top-spacer'),bottomSpacer:$('bottom-spacer'),
      onError:error=>message('Could not load source chunk: '+error.message,true),
      onReady:()=>{}
    });
    attachControls();
    display();
  }catch(error){
    const guidance=location.protocol==='file:' ?
      ' This modular viewer needs HTTP(S). Open the GitHub Pages URL, not a downloaded index.html alone.' : '';
    message('Viewer could not initialize: '+error.message+'.'+guidance,true);
  }
}
void start();
