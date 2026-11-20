// Same Python source highlighting palette and rules used by nanogpt-modular-viewer.
// This is display-only; the original text and STM identity are never rewritten.
const escapeHTML=value=>String(value).replace(/&/g,'&amp;')
  .replace(/</g,'&lt;').replace(/>/g,'&gt;')
  .replace(/"/g,'&quot;').replace(/'/g,'&#39;');

function commentStart(s) {
  let quote=null,escape=false;
  for(let i=0;i<s.length;i++){
    const c=s[i];
    if(escape){escape=false;continue;}
    if(quote){
      if(c==='\\'){escape=true;continue;}
      if(c===quote){quote=null;}
      continue;
    }
    if(c==='#')return i;
    if(c==='"'||c==="'")quote=c;
  }
  return -1;
}

export function syntaxHTML(s,kind='code') {
  if(!s.trim())return '&nbsp;';
  if(kind==='text')return escapeHTML(s);
  if(kind==='comment'||kind==='docstring')
    return '<span class="comment-syntax">'+escapeHTML(s)+'</span>';
  const split=commentStart(s),expression=split<0?s:s.slice(0,split);
  const parts=expression.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g);
  const marked=parts.map((p,i)=>{
    if(i%2===1)return '<span class="string">'+escapeHTML(p)+'</span>';
    return escapeHTML(p).replace(/\b(class|def|if|else|elif|not|import|from|as|assert|return|None|True|False|pass|for|while|in|with)\b/g,
      '<span class="keyword">$1</span>')
      .replace(/\b(super|print|hasattr|isinstance|int|bool|float)\b/g,
        '<span class="builtin">$1</span>');
  }).join('');
  return marked+(split>=0?'<span class="comment-syntax">'+escapeHTML(s.slice(split))+'</span>':'');
}

export function sourceKind(path,text) {
  if(!path.endsWith('.py'))return 'text';
  const s=text.trimStart();
  if(s.startsWith('#'))return 'comment';
  if(s.startsWith('"""')||s.startsWith("'''"))return 'docstring';
  return 'code';
}


// Classify source *at the actual historical snapshot*, not from a line's
// final state. A removed line therefore retains its pre-edit comment identity.
// Standalone Python # comments and standalone triple-quoted documentation are
// eligible for the independent Comments overlay; trailing inline # is not.
export function classifyFileLines(path,lines) {
  const kinds=new Map();
  if(!path.endsWith('.py')) {
    for(const item of lines)kinds.set(item.id,'text');
    return kinds;
  }
  let quote=null;
  for(const item of lines) {
    const raw=item.text,trim=raw.trimStart();
    if(quote) {
      kinds.set(item.id,'docstring');
      let cursor=0;
      while(true) {
        const end=raw.indexOf(quote,cursor);
        if(end<0)break;
        let backslashes=0;
        for(let j=end-1;j>=0&&raw[j]==='\\';j--)backslashes++;
        if(backslashes%2===0){quote=null;break;}
        cursor=end+quote.length;
      }
      continue;
    }
    if(trim.startsWith('#')){
      kinds.set(item.id,'comment');
      continue;
    }
    const candidate=trim.startsWith('"""')?'"""':
      trim.startsWith("'''")?"'''":null;
    if(candidate) {
      kinds.set(item.id,'docstring');
      // Triple quotes on the same line are not a continuing block.
      // The closing delimiter must not be backslash-escaped.
      let closed=false,cursor=candidate.length;
      while(true) {
        const end=trim.indexOf(candidate,cursor);
        if(end<0)break;
        let backslashes=0;
        for(let j=end-1;j>=0&&trim[j]==='\\';j--)backslashes++;
        if(backslashes%2===0){closed=true;break;}
        cursor=end+candidate.length;
      }
      if(!closed)quote=candidate;
      continue;
    }
    kinds.set(item.id,'code');
  }
  return kinds;
}
