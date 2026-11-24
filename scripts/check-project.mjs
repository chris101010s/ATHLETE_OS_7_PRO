import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const ts=require('typescript');
import {readdirSync,readFileSync} from 'node:fs';
import path from 'node:path';
const base=process.cwd(),files=[];
function visit(dir){for(const e of readdirSync(dir,{withFileTypes:true})){if(e.isDirectory()){if(!['node_modules','.git','artifacts','ios','android'].includes(e.name))visit(path.join(dir,e.name));}else if(/\.tsx?$/.test(e.name))files.push(path.join(dir,e.name));}}
visit(path.join(base,'src'));visit(path.join(base,'modules'));files.push(path.join(base,'App.tsx'));
let errs=0;
for(const file of files){const code=readFileSync(file,'utf8');const result=ts.transpileModule(code,{fileName:file,compilerOptions:{jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022},reportDiagnostics:true});const messages=(result.diagnostics||[]).filter(x=>x.category===ts.DiagnosticCategory.Error);if(messages.length){console.error(file,messages.map(m=>m.messageText));errs+=messages.length;}}
console.log(`${files.length} TypeScript-/TSX-Quelldateien syntaktisch geprüft: ${errs} Fehler`);if(errs)process.exitCode=1;
