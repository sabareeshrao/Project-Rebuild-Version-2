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


// Class and Method scopes must be computed from each exact historical file
// snapshot. No future/final source shape is imposed on earlier Git commits.
// Method covers Python def / async def including top-level functions, so users
// can follow both class methods and standalone functions in one blue view.
// Lines not belonging to the chosen scope remain neutral; blank and comment
// source rows inside a scope inherit its membership until dedent.
export function classifyFileScopes(path,lines,kinds=classifyFileLines(path,lines)) {
  const memberships=new Map();
  if(!path.endsWith('.py')) {
    for(const item of lines)memberships.set(item.id,{inClass:false,inMethod:false});
    return memberships;
  }
  const stack=[];
  const leadingWidth=text=>{
    const chars=(text.match(/^[ \t]*/)||[''])[0];
    // Match conventional Python tab stops; avoids arbitrary 1-tab=1-space.
    let width=0;
    for(const c of chars)width=c==='\t'?width+(8-width%8):width+1;
    return width;
  };
  // Treat decorator lines as part of the following class/function scope only
  // when the next significant code line is a matching-indent declaration.
  const decorated=new Map();
  for(let i=0;i<lines.length;i++){
    const current=lines[i];
    const value=current.text.trimStart();
    if(!value.startsWith('@')||kinds.get(current.id)==='docstring')continue;
    const indent=leadingWidth(current.text);
    let j=i;
    while(j<lines.length){
      const text=lines[j].text;
      const clean=text.trimStart();
      if(clean===''){j++;continue;}
      if(clean.startsWith('@')&&leadingWidth(text)===indent){j++;continue;}
      break;
    }
    if(j>=lines.length)continue;
    const next=lines[j].text.trimStart();
    const match=next.match(/^(async\s+def|def|class)\s+([a-zA-Z_]\w*)\b/);
    if(!match||leadingWidth(lines[j].text)!==indent)continue;
    for(let k=i;k<j;k++){
      if(lines[k].text.trimStart().startsWith('@')&&leadingWidth(lines[k].text)===indent)
        decorated.set(lines[k].id,{kind:match[1]==='class'?'class':'method',name:match[2]});
    }
  }
  for(const item of lines){
    const raw=item.text,trim=raw.trimStart(),kind=kinds.get(item.id);
    const indentation=leadingWidth(raw);
    const isEmpty=trim.length===0;
    const isCode=!isEmpty&&kind!=='comment'&&kind!=='docstring';
    // Comments at a smaller indentation clearly exited an inner scope,
    // whereas a physically blank row belongs to the previous scope.
    if(!isEmpty&&(isCode||kind==='comment')){
      while(stack.length&&indentation<=stack[stack.length-1].indent)stack.pop();
    }
    const decl=(isCode&&!trim.startsWith('@'))
      ?trim.match(/^(async\s+def|def|class)\s+([a-zA-Z_]\w*)\b/):null;
    const decoration=decorated.get(item.id);
    let marker=null;
    if(decl){
      marker={kind:decl[1]==='class'?'class':'method',name:decl[2],indent:indentation};
      stack.push(marker);
    }else if(decoration){
      marker={...decoration,indent:indentation};
      stack.push(marker);
    }
    const activeClass=[...stack].reverse().find(scope=>scope.kind==='class');
    const activeMethod=[...stack].reverse().find(scope=>scope.kind==='method');
    memberships.set(item.id,{
      inClass:!!activeClass,inMethod:!!activeMethod,
      className:activeClass?.name||null,methodName:activeMethod?.name||null
    });
    // A decorated declaration's own line reuses the same scope after
    // same-indent dedent; the earlier decorator annotations are still correct.
    if(marker&&decoration&&!decl){
      // Decorators remain a group until the matching declaration; subsequent
      // decorator rows pop the marker then add their own equivalent marker.
    }
  }
  return memberships;
}
