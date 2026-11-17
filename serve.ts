import {createServer} from 'node:http';
import {readFileSync,statSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('./game',import.meta.url));
const mime:Record<string,string>={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json'};
createServer((req,res)=>{
 try{
 const pathname=decodeURIComponent(new URL(req.url??'/','http://localhost').pathname);
 const file=resolve(root,'.'+(pathname.endsWith('/')?pathname+'index.html':pathname));
 if(!file.startsWith(root+sep)){res.writeHead(403).end();return;}
 if(!statSync(file).isFile())throw Error('not a file');
 res.writeHead(200,{'Content-Type':mime[extname(file)]??'application/octet-stream','Cache-Control':'no-store'});res.end(readFileSync(file));
 }catch{res.writeHead(404).end('Not found');}
}).listen(8080,'127.0.0.1',()=>console.log('Star Slinger listening on port 8080'));
