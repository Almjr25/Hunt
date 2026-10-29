import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root = fileURLToPath(new URL('.', import.meta.url));
http.createServer(async(req,res)=>{
 const path = new URL(req.url,'http://localhost').pathname;
 const files={'/':'index.html','/game.js':'game.js','/style.css':'style.css'};
 if(!files[path]) {res.writeHead(404); return res.end('Not found');}
 try { const data=await readFile(root+files[path]);res.writeHead(200,{'Content-Type':path.endsWith('.js')?'text/javascript':path.endsWith('.css')?'text/css':'text/html; charset=utf-8'});res.end(data); }
 catch {res.writeHead(500);res.end('Unable to load game');}
}).listen(Number(process.env.PORT)||3000,'0.0.0.0',()=>console.log('HUNT running on port '+(process.env.PORT||3000)));
