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


// Prompt 083: statement TYPE is a separate axis from structural membership.
// Classify the exact historical Python snapshot, never just a diff fragment.
// Only Python source is classified. Every returned key is the original STM ID.
//
// This conservative, display-only scanner skips comments/docstrings, strings,
// comparisons, definition/control headers, and keyword arguments inside calls.
// It follows physical lines of (), [], {}, explicit backslashes, and string
// continuations so multiline imports/assignments/calls retain their type.
// It is not a complete Python AST and deliberately leaves ambiguous lines gray.
export function classifyStatementTypes(path, lines, kinds=classifyFileLines(path,lines)) {
  const result=new Map();
  if(!path.endsWith('.py')){
    for(const line of lines)result.set(line.id,null);
    return result;
  }

  const state={brackets:[],quote:null,continued:false,kind:null};

  // Remove strings and comments without treating their contents as Python
  // operators. Keep only characters outside brackets for assignment checks.
  function scan(raw) {
    let outside='',trailing='',escaped=false,comment=false;
    for(let i=0;i<raw.length;i++){
      const char=raw[i];
      if(state.quote){
        const quote=state.quote;
        if(quote.length===3&&raw.slice(i,i+3)===quote){
          state.quote=null;i+=2;outside+='   ';trailing+='   ';continue;
        }
        if(quote.length===1&&char===quote&&!escaped)state.quote=null;
        escaped=char==='\\'&&!escaped;
        if(char!=='\\')escaped=false;
        outside+=' ';trailing+=' ';continue;
      }
      if(char==='#'){comment=true;break;}
      if(char==='"'||char==="'"){
        const triple=raw.slice(i,i+3)===char.repeat(3);
        state.quote=triple?char.repeat(3):char;
        if(triple){i+=2;outside+='   ';trailing+='   ';}
        else{outside+=' ';trailing+=' ';}
        escaped=false;continue;
      }
      if(char==='('||char==='['||char==='{'){
        outside+=' ';trailing+=char;state.brackets.push(char);continue;
      }
      if(char===')'||char===']'||char==='}'){
        outside+=' ';trailing+=char;
        const paired={')':'(',']':'[','}':'{'};
        if(state.brackets.at(-1)===paired[char])state.brackets.pop();
        continue;
      }
      outside+=state.brackets.length===0?char:' ';
      trailing+=char;
    }
    const explicitContinuation=/\\\s*$/.test(trailing);
    return {outside:outside.trim(),continues:state.brackets.length>0||!!state.quote||explicitContinuation,comment};
  }

  function classifyRoot(root,raw) {
    if(/^(?:from\b[\s\S]*?\bimport\b|import\b)/.test(root))return 'import';
    if(/^\s*(?:@|(?:async\s+)?def\b|class\b|(?:async\s+)?for\b|if\b|elif\b|else\b|while\b|try\b|except\b|finally\b|(?:async\s+)?with\b|match\b|case\b|return\b|raise\b|yield\b|assert\b|pass\b|break\b|continue\b|global\b|nonlocal\b|del\b)/.test(root))
      return null;
    // Simple/augmented/annotated assignments only. Exclude ==, !=, <=, >=,
    // := and the keyword-argument '=' inside parenthesized function calls.
    const assignment=/(?:^|[^!=<>:])=(?!=)|(?:\*\*|\/\/|<<|>>|[+*/%@&|^-])=/.test(root);
    if(assignment||/^[a-zA-Z_]\w*\s*:\s*[a-zA-Z_][\w.\[\], ]*$/.test(root))
      return 'assignment';
    // A statement consisting of an expression or call (not every nested
    // expression inside a different statement). Keep the match cautious.
    if(/^(?:[a-zA-Z_]\w*|[([]|[-+]?\d)/.test(root))return 'expression';
    return null;
  }

  for(const line of lines){
    const raw=line.text||'',trim=raw.trim();
    const kind=kinds.get(line.id);
    const continuing=state.continued;
    let category=continuing?state.kind:null;

    // Standalone docs and whitespace do not create new statements.
    if(kind==='docstring'||kind==='comment'||!trim){
      if(continuing&&kind==='comment')category=state.kind;
      result.set(line.id,category);
      continue;
    }

    const scanned=scan(raw);
    if(!continuing)category=classifyRoot(scanned.outside,raw);
    result.set(line.id,category);
    state.continued=scanned.continues;
    state.kind=scanned.continues?category:null;
    if(!state.continued){
      state.brackets=[];state.quote=null;
    }
  }
  return result;
}
