// Authentic nanoGPT first-parent commit replay. No fabricated source lines.
// This ID space is separate from the 235-commit teaching reconstruction.
export function parseHunks(patch) {
  const hunks=[];
  let h=null;
  for(const line of String(patch||'').split('\n')) {
    const m=line.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
    if(m){h={oldStart:+m[1],oldCount:m[2]===undefined?1:+m[2],
      newStart:+m[3],newCount:m[4]===undefined?1:+m[4],ops:[]};hunks.push(h);continue;}
    if(!h||!line||line[0]==='\\')continue;
    if(line[0]===' '||line[0]==='+'||line[0]==='-')h.ops.push({kind:line[0],text:line.slice(1)});
  }
  return hunks;
}
const pad=n=>'STM-'+String(n).padStart(5,'0');
const own=(obj,key)=>Object.prototype.hasOwnProperty.call(obj,key);
export class OriginalHistory {
  constructor(manifest,loader) {
    this.manifest=manifest;
    this.loader=loader;
    this.chunks=new Map();
    this.snapshots=new Map([[0,{files:new Map(),changes:[],warnings:[],fileStats:[]}]]);
    this.built=0;this.nextIdentity=1;
  }
  async chunkFor(n) {
    const size=this.manifest.chunkSize;
    const start=Math.floor((n-1)/size)*size+1;
    if(this.chunks.has(start))return this.chunks.get(start);
    const end=Math.min(start+size-1,this.manifest.dataAvailableThrough);
    const data=await this.loader(start,end);
    if(data.range?.[0]!==start || data.range?.[1]!==end)
      throw new Error('Unexpected historical data batch '+start+'–'+end);
    const commits=new Map(data.commits.map(x=>[x.n,x]));
    this.chunks.set(start,commits);
    return commits;
  }
  async to(n) {
    if(n<1||n>this.manifest.dataAvailableThrough)throw new Error('Commit '+n+' is not indexed yet');
    for(let step=this.built+1;step<=n;step++){
      const entries=await this.chunkFor(step);
      const commit=entries.get(step);
      if(!commit||commit.sha!==this.manifest.commits[step-1].sha)
        throw new Error('Original commit SHA validation failed at '+step);
      this.apply(step,commit);
    }
    return this.snapshots.get(n);
  }
  apply(step,commit){
    const before=this.snapshots.get(step-1);
    const files=new Map(before.files);
    const changes=[],warnings=[],fileStats=[];
    for(const entry of commit.files){
      const path=entry.path;
      const previousPath=entry.previousPath||path;
      const oldLines=files.get(previousPath)||[];
      const counted={added:0,deleted:0};
      const stats={path,status:entry.status,added:entry.added||0,deleted:entry.deleted||0};
      fileStats.push(stats);
      // Binary files and any diff GitHub did not provide are explicitly flagged.
      if(entry.patch===null){
        warnings.push(path+': GitHub omitted its patch (binary or oversized). Source lines unavailable for this file change.');
        // Reserve missing introductions, so subsequent visible identities are not silently reused.
        this.nextIdentity+=entry.added||0;
        if(entry.status==='removed')files.delete(previousPath);
        continue;
      }
      const hunks=parseHunks(entry.patch);
      if(!hunks.length&&(entry.added||entry.deleted)){
        warnings.push(path+': no machine-readable hunk for a nonempty change.');
        this.nextIdentity+=entry.added||0;
        continue;
      }
      const updated=[];
      let cursor=0,invalid=false;
      for(const h of hunks){
        const start=Math.max(0,h.oldStart-1);
        if(start<cursor||start>oldLines.length){invalid=true;break;}
        updated.push(...oldLines.slice(cursor,start));
        cursor=start;
        for(const op of h.ops){
          if(op.kind==='+'){
            const item={id:pad(this.nextIdentity++),text:op.text,origin:step};
            updated.push(item);
            changes.push({path,kind:'add',item});
            counted.added++;
          }else{
            const original=oldLines[cursor];
            if(!original||original.text!==op.text){invalid=true;break;}
            if(op.kind===' '){updated.push(original);}
            else{changes.push({path,kind:'del',item:original});counted.deleted++;}
            cursor++;
          }
        }
        if(invalid)break;
      }
      if(invalid){
        // Do not invent a patch application when existing line positions mismatch.
        warnings.push(path+': original diff did not align with previous recorded snapshot; this file change was not applied.');
        this.nextIdentity+=Math.max(0,(entry.added||0)-counted.added);
        // Roll back any invalid file-specific diff records.
        for(let i=changes.length-1;i>=0;i--)if(changes[i].path===path)changes.splice(i,1);
        continue;
      }
      updated.push(...oldLines.slice(cursor));
      if(counted.added!==entry.added||counted.deleted!==entry.deleted){
        warnings.push(path+': GitHub hunk line count does not match its change totals (+'+counted.added+'/-'+counted.deleted+
          ' vs +'+entry.added+'/-'+entry.deleted+'). Source view may be incomplete.');
      }
      if(entry.status==='removed')files.delete(previousPath);
      else{
        if(previousPath!==path)files.delete(previousPath);
        files.set(path,updated);
      }
    }
    this.snapshots.set(step,{files,changes,warnings,fileStats});
    this.built=step;
  }
  async get(n){return this.to(n);}
}
