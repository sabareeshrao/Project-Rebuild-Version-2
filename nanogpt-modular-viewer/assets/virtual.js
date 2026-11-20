import {makeRow,applyRowCategory} from './view.js';

// Window-based virtual list: the browser scrolls the PAGE, never a fixed-height
// code box. Only rows near the viewport enter the DOM. Source chunks load lazily.
export class WindowedRows {
  constructor({store,host,windowElement,topSpacer,bottomSpacer,onError,onReady}) {
    this.store=store;this.host=host;this.rows=windowElement;
    this.top=topSpacer;this.bottom=bottomSpacer;
    this.onError=onError;this.onReady=onReady;
    this.estimate=47;this.count=0;this.bit=new Float64Array(1);
    this.measured=new Map();
    this.context=null;this.range=null;this.rendered=null;
    this.visibleSource=null;this.visibleSourceFirstIndex=0;
    this.requestId=0;this.frame=0;this.version=0;
    this.lastViewportWidth=window.innerWidth;
    this.observer=new ResizeObserver(entries=>{
      let changed=false;
      for(const entry of entries){
        const node=entry.target;
        const index=Number(node.dataset.rowIndex);
        if(!Number.isInteger(index))continue;
        const height=node.getBoundingClientRect().height;
        if(height>0&&this.setHeight(index,height))changed=true;
      }
      if(changed){this.positionSpacers();this.schedule();}
    });
    window.addEventListener('scroll',()=>this.schedule(),{passive:true});
    window.addEventListener('resize',()=>{
      // Mobile browser URL bars frequently change viewport HEIGHT during scrolling.
      // Rebuilding measurements on height-only changes causes visible page shaking.
      const newWidth=window.innerWidth;
      if(Math.abs(newWidth-this.lastViewportWidth)>1){
        this.lastViewportWidth=newWidth;
        this.measured.clear();this.bit=new Float64Array(this.count+1);
        this.rendered=null;this.visibleSource=null;
        this.schedule(true);
      }else this.schedule();
    },{passive:true});
  }

  configure(context) {
    // Use a snapshot, not the shared mutable app-state object.
    const next={...context,selection:context.selection?{...context.selection}:null};
    const previous=this.context;
    const sameSourceRange=!!previous&&previous.fileId===next.fileId
      &&previous.mode===next.mode&&previous.commit===next.commit
      &&(previous.selection?.start??null)===(next.selection?.start??null)
      &&(previous.selection?.end??null)===(next.selection?.end??null);
    if(sameSourceRange){
      // Category-only update: keep scroll position, DOM nodes, row heights,
      // source-chunk cache, virtual spacers and source-line anchors unchanged.
      this.context=next;
      if(previous.category!==next.category&&this.rendered&&this.visibleSource){
        for(let index=this.rendered.start;index<this.rendered.end;index++){
          const line=this.visibleSource[index-this.visibleSourceFirstIndex];
          const preceding=index>0?this.visibleSource[index-this.visibleSourceFirstIndex-1]:null;
          const row=this.rows.children[index-this.rendered.start];
          if(row&&line)applyRowCategory(row,line,preceding,
            {...this.context,manifest:this.store.manifest});
        }
      }
      return this.range;
    }
    this.version++;this.requestId++;
    this.context=next;
    this.range=this.store.visibleRange(next.fileId,next.mode,next.commit,next.selection);
    this.count=this.range.length;
    this.bit=new Float64Array(this.count+1);
    this.measured.clear();this.rendered=null;
    this.visibleSource=null;this.visibleSourceFirstIndex=0;
    this.observer.disconnect();this.rows.replaceChildren();
    this.positionSpacers();
    if(this.count===0){this.onReady?.(this.range);return this.range;}
    this.schedule(true);
    return this.range;
  }

  deltaPrefix(index) {
    let sum=0;
    for(let x=index;x>0;x-=x&-x)sum+=this.bit[x];
    return sum;
  }

  position(index) {
    return index*this.estimate+this.deltaPrefix(index);
  }

  fullHeight() {
    return this.position(this.count);
  }

  setHeight(index,value) {
    if(index<0||index>=this.count)return false;
    const old=this.measured.get(index)??this.estimate;
    if(Math.abs(old-value)<1)return false;
    this.measured.set(index,value);
    const change=value-old;
    for(let x=index+1;x<=this.count;x+=x&-x)this.bit[x]+=change;
    return true;
  }

  findIndex(y) {
    // Binary search in cumulative, measured row heights.
    let lo=0,hi=this.count;
    while(lo<hi){
      const middle=Math.floor((lo+hi)/2);
      if(this.position(middle+1)<=y)lo=middle+1;
      else hi=middle;
    }
    return Math.max(0,Math.min(this.count-1,lo));
  }

  windowRange() {
    if(this.count===0)return {start:0,end:0};
    const rect=this.host.getBoundingClientRect();
    const above=Math.max(0,-rect.top);
    const start=Math.max(0,this.findIndex(Math.max(0,above-650))-2);
    const end=Math.min(this.count,this.findIndex(Math.max(0,above+window.innerHeight+700))+3);
    return {start,end:Math.max(start+1,end)};
  }

  positionSpacers() {
    if(!this.rendered){
      this.top.style.height='0px';
      this.bottom.style.height=Math.max(0,this.fullHeight())+'px';
      return;
    }
    this.top.style.height=Math.max(0,this.position(this.rendered.start))+'px';
    this.bottom.style.height=Math.max(0,this.fullHeight()-this.position(this.rendered.end))+'px';
  }

  schedule(force=false) {
    if(force)this.rendered=null;
    if(this.frame)return;
    this.frame=requestAnimationFrame(()=>{
      this.frame=0;
      void this.update();
    });
  }

  async update() {
    if(!this.context||this.count===0)return;
    const wanted=this.windowRange();
    const version=this.version;
    if(this.rendered&&this.rendered.start===wanted.start&&this.rendered.end===wanted.end){
      this.positionSpacers();return;
    }
    const request=++this.requestId;
    const firstIndex=Math.max(0,wanted.start-1); // previous source line for divider check
    const firstLine=this.range.first+firstIndex;
    const lastLine=this.range.first+wanted.end-1;
    try{
      const source=await this.store.readLines(this.context.fileId,firstLine,lastLine);
      if(this.version!==version||request!==this.requestId)return;
      const fragment=document.createDocumentFragment();
      for(let index=wanted.start;index<wanted.end;index++){
        const line=source[index-firstIndex];
        const previous=index>0?source[index-firstIndex-1]:null;
        fragment.appendChild(makeRow(line,previous,index,{...this.context,manifest:this.store.manifest}));
      }
      this.observer.disconnect();
      this.rows.replaceChildren(fragment);
      this.visibleSource=source;this.visibleSourceFirstIndex=firstIndex;
      this.rendered=wanted;
      this.positionSpacers();
      for(const row of this.rows.children)this.observer.observe(row);
      this.onReady?.(this.range);
    }catch(error){
      if(this.version===version&&request===this.requestId)this.onError?.(error);
    }
  }
}
