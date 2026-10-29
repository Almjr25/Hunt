export const BIOMES = [
 {name:'BOSQUE SOMBRIO',bg:'#202c21',grid:'#2b3929',wall:'#45563b',accent:'#b5d581',detail:'árvores'},
 {name:'PÂNTANO TÓXICO',bg:'#222c2b',grid:'#2c3937',wall:'#40544e',accent:'#9ed8b6'},
 {name:'DESERTO VERMELHO',bg:'#352b23',grid:'#42372a',wall:'#68533e',accent:'#e9c388'},
 {name:'TUNDRA SILENCIOSA',bg:'#263139',grid:'#303e47',wall:'#4c6472',accent:'#b5e4ea'},
 {name:'CALDEIRA VULCÂNICA',bg:'#302326',grid:'#403034',wall:'#624248',accent:'#efad82'},
 {name:'RUÍNAS ESQUECIDAS',bg:'#2c2b32',grid:'#38363f',wall:'#555160',accent:'#cfb5e8'}
];
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export function trapHits(trap, enemy){return trap.armed&&!trap.used&&distance(trap,enemy)<trap.r+12;}
export function blocked(x,y,r,walls){return x<r||y<r||x>1000-r||y>620-r||walls.some(w=>x+r>w.x&&x-r<w.x+w.w&&y+r>w.y&&y-r<w.y+w.h);}
export function lineClear(a,b,walls){const n=Math.ceil(distance(a,b)/8);for(let i=1;i<n;i++){const x=a.x+(b.x-a.x)*i/n,y=a.y+(b.y-a.y)*i/n;if(walls.some(w=>x>w.x&&x<w.x+w.w&&y>w.y&&y<w.y+w.h))return false;}return true;}
if(typeof document!=='undefined') startGame();
function startGame(){
 const canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d');
 const ui=id=>document.getElementById(id),keys=new Set();
 let state='intro',player,enemies,traps,walls,biome,particles=[],noise=0,kills=0,clock=0,last=0,nearest=null,spaceLatch=false,triggerLatch=false,lastBiome=-1;
 function map(){
  let index=Math.floor(Math.random()*6);if(index===lastBiome)index=(index+1)%6;lastBiome=index;biome=BIOMES[index];
  player={x:500,y:535,r:11,stamina:100,angle:-Math.PI/2,exhausted:false};
  enemies=[{x:150,y:100},{x:500,y:80},{x:850,y:100}].map((e,i)=>({...e,r:13,alive:true,alert:0,angle:0,homeX:e.x,homeY:e.y,phase:i*2}));
  walls=[{x:290,y:160,w:65,h:100},{x:640,y:160,w:65,h:100},{x:120,y:400,w:95,h:45},{x:785,y:400,w:95,h:45}];
  // Small offsets vary the routes while retaining clear paths through every trap.
  walls.forEach(w=>{w.x+=Math.random()*24-12;w.y+=Math.random()*20-10;});
  traps=[{x:190,y:290,type:'pit'},{x:500,y:245,type:'fire'},{x:810,y:290,type:'rock'},{x:345,y:435,type:'fire'},{x:655,y:435,type:'pit'},{x:500,y:365,type:'rock'}].map(t=>({...t,r:27,armed:false,used:false,progress:0,flash:0}));
  particles=[];noise=0;kills=0;clock=0;keys.clear();spaceLatch=false;triggerLatch=false;
  ui('biome').textContent=biome.name;ui('dot').style.background=biome.accent;
 }
 function overlay(title,description,label,eyebrow){ui('title').textContent=title;ui('description').innerHTML=description;ui('play').textContent=label;ui('overline').textContent=eyebrow;ui('overlay').classList.remove('hidden');}
 function begin(){map();state='playing';ui('overlay').classList.add('hidden');canvas.focus();}
 ui('play').onclick=()=>{if(state==='paused'){state='playing';ui('overlay').classList.add('hidden');canvas.focus();}else begin();};
 ui('new').onclick=begin;
 function pause(){if(state==='playing'){state='paused';keys.clear();overlay('Respire. Refaça o plano.','A caçada está pausada.','Continuar →','PAUSA');}else if(state==='paused'){state='playing';ui('overlay').classList.add('hidden');}}
 window.addEventListener('keydown',e=>{if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(e.code==='KeyP'&&!e.repeat)pause();if(e.code==='KeyR'&&!e.repeat)begin();keys.add(e.code);});
 window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>{keys.clear();if(state==='playing')pause();});
 function move(entity,dx,dy,r){if(!blocked(entity.x+dx,entity.y,r,walls))entity.x+=dx;if(!blocked(entity.x,entity.y+dy,r,walls))entity.y+=dy;}
 function kill(enemy,trap){enemy.alive=false;kills++;trap.used=true;trap.armed=false;trap.flash=.7;for(let i=0;i<18;i++)particles.push({x:enemy.x,y:enemy.y,vx:(Math.random()-.5)*150,vy:(Math.random()-.5)*150,life:.8,color:'#e89171'});}
 function update(dt){
  clock+=dt;noise=Math.max(0,noise-dt);let dx=Number(keys.has('KeyD')||keys.has('ArrowRight'))-Number(keys.has('KeyA')||keys.has('ArrowLeft')),dy=Number(keys.has('KeyS')||keys.has('ArrowDown'))-Number(keys.has('KeyW')||keys.has('ArrowUp'));let moving=dx!==0||dy!==0;
  nearest=traps.filter(t=>!t.used&&distance(player,t)<65).sort((a,b)=>distance(a,player)-distance(b,player))[0];
  const preparing=keys.has('KeyE')&&nearest&&!nearest.armed;
  const sprint=moving&&!preparing&&(keys.has('ShiftLeft')||keys.has('ShiftRight'))&&!player.exhausted&&player.stamina>0;
  if(sprint){player.stamina=Math.max(0,player.stamina-30*dt);if(player.stamina===0)player.exhausted=true;}else{player.stamina=Math.min(100,player.stamina+19*dt);if(player.stamina>25)player.exhausted=false;}
  if(moving&&!preparing){let n=Math.hypot(dx,dy);player.angle=Math.atan2(dy,dx);move(player,dx/n*(sprint?240:140)*dt,dy/n*(sprint?240:140)*dt,11);}
  if(keys.has('Space')&&!spaceLatch){noise=1.5;enemies.filter(e=>e.alive&&distance(e,player)<460).forEach(e=>e.alert=5);}spaceLatch=keys.has('Space');
  traps.forEach(t=>{t.flash=Math.max(0,t.flash-dt);if(t===nearest&&preparing){t.progress+=dt;if(t.progress>=1){t.armed=true;t.progress=0;triggerLatch=true;}}else t.progress=0;});
  if(nearest?.armed&&nearest.type==='rock'&&keys.has('KeyE')&&!triggerLatch){nearest.flash=.7;enemies.filter(e=>e.alive&&trapHits(nearest,e)).forEach(e=>kill(e,nearest));nearest.used=true;nearest.armed=false;triggerLatch=true;}
  if(!keys.has('KeyE'))triggerLatch=false;
  for(const enemy of enemies){if(!enemy.alive)continue;
   let sees=distance(player,enemy)<(sprint?275:215)&&lineClear(enemy,player,walls);
   if(sees)enemy.alert=4;else enemy.alert=Math.max(0,enemy.alert-dt);
   let target=enemy.alert>0?player:{x:enemy.homeX+Math.sin(clock*.45+enemy.phase)*45,y:enemy.homeY+Math.cos(clock*.5+enemy.phase)*26};
   let vx=target.x-enemy.x,vy=target.y-enemy.y,n=Math.hypot(vx,vy);enemy.angle=Math.atan2(vy,vx);
   if(n>3)move(enemy,vx/n*(enemy.alert>0?116:33)*dt,vy/n*(enemy.alert>0?116:33)*dt,13);
   for(const trap of traps){if(trap.type!=='rock'&&trapHits(trap,enemy)){kill(enemy,trap);break;}}
   if(enemy.alive&&distance(enemy,player)<23){state='lost';overlay('O plano veio tarde.','Você foi alcançado. Prepare as armadilhas antes de chamar atenção.<br><b>Dica:</b> caminhar já é mais rápido que um monstro; guarde a corrida para escapar.','Tentar outro mapa →','A CAÇADA TERMINOU');break;}
  }
  if(kills===3&&state==='playing'){state='won';overlay('Você virou o jogo.','Três predadores. Nenhuma arma.<br>O terreno fez o trabalho — o plano foi seu.','Caçar em outro bioma →','ÁREA SEGURA / 3 DE 3');}
  particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;});particles=particles.filter(p=>p.life>0);
 }
 function text(s,x,y,color='#c6d2bc',size=10){ctx.font=`${size}px monospace`;ctx.fillStyle=color;ctx.textAlign='center';ctx.fillText(s,x,y);}
 function draw(){
  ctx.fillStyle=biome.bg;ctx.fillRect(0,0,1000,620);ctx.strokeStyle=biome.grid;ctx.lineWidth=.6;
  for(let x=20;x<1000;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,620);ctx.stroke();}for(let y=20;y<620;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(1000,y);ctx.stroke();}
  // Deterministic decorative flecks do not affect collisions.
  for(let i=0;i<85;i++){let x=(i*137+53)%980+10,y=(i*79+21)%600+10;ctx.fillStyle=biome.wall;ctx.globalAlpha=.35;ctx.fillRect(x,y,2,2);}ctx.globalAlpha=1;
  walls.forEach(w=>{ctx.fillStyle='#0003';ctx.fillRect(w.x+5,w.y+6,w.w,w.h);ctx.fillStyle=biome.wall;ctx.fillRect(w.x,w.y,w.w,w.h);ctx.strokeStyle=biome.accent+'44';ctx.strokeRect(w.x+.5,w.y+.5,w.w-1,w.h-1);for(let i=8;i<w.w;i+=14){ctx.strokeStyle='#ffffff0d';ctx.beginPath();ctx.moveTo(w.x+i,w.y+5);ctx.lineTo(w.x+i,w.y+w.h-5);ctx.stroke();}});
  traps.forEach(t=>{
   ctx.save();ctx.translate(t.x,t.y);let color=t.used?'#66725d':t.armed?(t.type==='fire'?'#f1a36a':'#cde58e'):'#8d9d7c';ctx.strokeStyle=color;ctx.lineWidth=1.5;ctx.setLineDash(t.armed?[]:[4,5]);ctx.beginPath();ctx.arc(0,0,t.r,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
   ctx.fillStyle=t.used?'#141a16':t.type==='fire'?(t.armed?'#a8542c':'#555d37'):'#121a16';ctx.beginPath();ctx.ellipse(0,0,19,12,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle=color;
   if(t.type==='pit'){ctx.beginPath();ctx.moveTo(-12,-5);ctx.lineTo(0,9);ctx.lineTo(12,-5);ctx.stroke();}else if(t.type==='fire'){for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(i*9-4,5);ctx.lineTo(i*9,-12-(t.armed?Math.sin(clock*9+i)*4:0));ctx.lineTo(i*9+5,5);ctx.stroke();}}else{ctx.strokeRect(-10,-13,20,20);ctx.beginPath();ctx.moveTo(-17,-19);ctx.lineTo(17,-19);ctx.moveTo(0,-19);ctx.lineTo(0,-13);ctx.stroke();}
   if(t.progress){ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,31,-Math.PI/2,-Math.PI/2+t.progress*Math.PI*2);ctx.stroke();}
   if(t.flash){ctx.fillStyle=`rgba(230,199,121,${t.flash})`;ctx.beginPath();ctx.arc(0,0,38*(1-t.flash/2),0,Math.PI*2);ctx.fill();}
   text(t.used?'USADA':t.type==='pit'?'BURACO':t.type==='fire'?'FOGO':'PEDRA',0,43,color,9);if(t.armed&&!t.used)text(t.type==='rock'?'E · SOLTAR':'PRONTA',0,-37,color,8);ctx.restore();
  });
  enemies.forEach(e=>{if(!e.alive)return;ctx.save();ctx.translate(e.x,e.y);if(e.alert>0){ctx.strokeStyle='#e9927140';ctx.beginPath();ctx.arc(0,0,23+Math.sin(clock*6)*3,0,Math.PI*2);ctx.stroke();text('!',0,-29,'#f3aa87',16);}ctx.rotate(e.angle);ctx.fillStyle=e.alert>0?'#ef916d':'#b97c67';ctx.fillRect(-12,-12,24,24);ctx.fillStyle='#37271f';ctx.fillRect(5,-6,4,4);ctx.fillRect(5,3,4,4);ctx.restore();});
  if(noise>0){ctx.strokeStyle=`rgba(211,236,155,${noise/2})`;ctx.beginPath();ctx.arc(player.x,player.y,30+(1.5-noise)*190,0,Math.PI*2);ctx.stroke();}
  ctx.save();ctx.translate(player.x,player.y);ctx.rotate(player.angle);ctx.shadowColor='#dcf6a0';ctx.shadowBlur=14;ctx.fillStyle='#dcf6a0';ctx.beginPath();ctx.moveTo(16,0);ctx.lineTo(-10,-10);ctx.lineTo(-6,0);ctx.lineTo(-10,10);ctx.closePath();ctx.fill();ctx.restore();
  particles.forEach(p=>{ctx.globalAlpha=p.life;ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,4,4);});ctx.globalAlpha=1;
  ui('kills').textContent=`${kills} / 3 ELIMINADOS`;ui('stamina').value=player.stamina;
  const chasing=enemies.some(e=>e.alive&&e.alert>0);ui('status').textContent=state==='paused'?'PAUSADO':chasing?'! VOCÊ FOI VISTO':'PREPARE O TERRENO';ui('status').style.color=chasing?'#efa47f':'#a1ae97';
  ui('hint').textContent=nearest?(nearest.armed?(nearest.type==='rock'?'E · Soltar pedra agora. Só acerte quando o monstro estiver no círculo.':'Armadilha pronta. Atraia um monstro até o círculo.'):'Segure E · '+(nearest.type==='pit'?'Descobrir buraco':nearest.type==='fire'?'Acender poça':'Preparar pedra')):'Espaço · Fazer barulho e atrair monstros próximos. Você pode atravessar suas armadilhas.';
 }
 map();function frame(now){let dt=Math.min((now-last)/1000,.035);last=now;if(state==='playing')update(dt);draw();requestAnimationFrame(frame);}requestAnimationFrame(frame);
}
