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


// Exact-snapshot structural classifier. All scope IDs derive from permanent
// original-history STM identities; the parser never changes original source.
// Control-flow headers (if/elif/else/for/while/try/except/finally/with/
// match/case and async variants) define Code Block groups. A control-flow
// group nested within another is a Nested Block. Class and Method are
// separate scopes and do not themselves count as Code Block headers.
// Every source row is retained, including standalone comments, docstrings,
// blank lines, declarations, and rows outside any structural scope.
export function classifyFileScopes(path,lines,kinds=classifyFileLines(path,lines)) {
  const memberships=new Map();
  const empty=()=>({
    inClass:false,inMethod:false,inBlock:false,inNested:false,
    className:null,methodName:null,blockName:null,nestedName:null,
    classId:null,methodId:null,blockId:null,nestedId:null,
    classParentId:null,methodParentId:null,blockParentId:null,nestedParentId:null
  });
  if(!path.endsWith('.py')){
    for(const item of lines)memberships.set(item.id,empty());
    return memberships;
  }
  const indentation=text=>{
    const start=(text.match(/^[ \t]*/)||[''])[0];
    let n=0;
    for(const character of start)
      n=character==='\t'?n+(8-n%8):n+1;
    return n;
  };
  const structure=[];
  const blocks=[];
  // Decorators are part of their immediately following declaration,
  // including when a blank physical line separates two decorators.
  const decorated=new Map();
  for(let i=0;i<lines.length;i++){
    const item=lines[i],trim=item.text.trimStart();
    if(!trim.startsWith('@')||kinds.get(item.id)==='docstring')continue;
    const level=indentation(item.text);
    let j=i;
    while(j<lines.length){
      const next=lines[j].text.trimStart();
      if(!next||(next.startsWith('@')&&indentation(lines[j].text)===level)){
        j++;continue;
      }
      break;
    }
    if(j>=lines.length||indentation(lines[j].text)!==level)continue;
    const decl=lines[j].text.trimStart().match(/^(class|(?:async\s+)?def)\s+([a-zA-Z_]\w*)\b/);
    if(!decl)continue;
    for(let k=i;k<j;k++){
      if(lines[k].text.trimStart().startsWith('@')&&indentation(lines[k].text)===level){
        decorated.set(lines[k].id,{
          id:lines[j].id,kind:decl[1]==='class'?'class':'method',name:decl[2]
        });
      }
    }
  }

  for(const item of lines){
    const trim=item.text.trimStart(),level=indentation(item.text);
    const kind=kinds.get(item.id);
    const blank=trim.length===0;
    const significant=!blank&&(kind==='code'||kind==='comment');
    // Blank rows inherit the preceding real scope. A dedented source row,
    // including a top-level comment, genuinely closes the old scope.
    if(significant){
      while(structure.length&&level<=structure[structure.length-1].indent)
        structure.pop();
      while(blocks.length&&level<=blocks[blocks.length-1].indent)
        blocks.pop();
    }

    const declaration=kind==='code'&&!trim.startsWith('@')
      ?trim.match(/^(class|(?:async\s+)?def)\s+([a-zA-Z_]\w*)\b/):null;
    const decorator=decorated.get(item.id);
    if(declaration||decorator){
      const candidate=declaration
        ?{id:item.id,kind:declaration[1]==='class'?'class':'method',name:declaration[2]}
        :decorator;
      structure.push({
        ...candidate,indent:level,parentId:structure.at(-1)?.id||'root'
      });
    }

    const currentClass=[...structure].reverse().find(s=>s.kind==='class');
    const currentMethod=[...structure].reverse().find(s=>s.kind==='method');
    // Parse actual compound-statement headers rather than using indentation
    // alone: ordinary statements do not manufacture a new block.
    const head=kind==='code'&&trim.match(
      /^(?:async\s+)?(if|elif|else|for|while|try|except|finally|with|match|case)\b/
    );
    if(head){
      const parent=blocks.at(-1);
      const marker={
        id:item.id,
        name:head[1],indent:level,
        parentId:parent?.id||currentMethod?.id||currentClass?.id||'root'
      };
      blocks.push(marker);
    }

    const firstBlock=blocks[0]||null;
    const nearestNested=blocks.length>1?blocks[blocks.length-1]:null;
    memberships.set(item.id,{
      inClass:!!currentClass,
      inMethod:!!currentMethod,
      inBlock:!!firstBlock,
      inNested:!!nearestNested,
      className:currentClass?.name||null,
      methodName:currentMethod?.name||null,
      blockName:firstBlock?.name||null,
      nestedName:nearestNested?.name||null,
      classId:currentClass?.id||null,
      methodId:currentMethod?.id||null,
      blockId:firstBlock?.id||null,
      nestedId:nearestNested?.id||null,
      classParentId:currentClass?.parentId||null,
      methodParentId:currentMethod?.parentId||null,
      blockParentId:firstBlock?.parentId||null,
      nestedParentId:nearestNested?.parentId||null
    });
  }
  return memberships;
}
