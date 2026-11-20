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
