import {makeRow} from './view.js';

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
    this.requestId=0;this.frame=0;this.version=0;
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
      this.measured.clear();this.bit=new Float64Array(this.count+1);
      this.rendered=null;this.schedule(true);
    },{passive:true});
  }

  configure(context) {
    this.version++;this.requestId++;
    this.context=context;
    this.range=this.store.visibleRange(context.fileId,context.mode,context.commit,context.selection);
    this.count=this.range.length;
    this.bit=new Float64Array(this.count+1);
    this.measured.clear();this.rendered=null;
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
      this.rendered=wanted;
      this.positionSpacers();
      for(const row of this.rows.children)this.observer.observe(row);
      this.onReady?.(this.range);
    }catch(error){
      if(this.version===version&&request===this.requestId)this.onError?.(error);
    }
  }
}
