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
export const SPEED = {walk:140, run:240, monster:175};
export const ENEMY_TYPES = ['stria','dot','cross'];
const weaknesses = {stria:'pit', dot:'rock', cross:'fire'};
export function vulnerable(enemy,trap){return weaknesses[enemy.kind]===trap.type;}
export function perception(enemy,player,walls,sprinting=false,moving=true){
 const range=sprinting?275:215;
 const angle=Math.atan2(player.y-enemy.y,player.x-enemy.x);
 const delta=Math.atan2(Math.sin(angle-enemy.angle),Math.cos(angle-enemy.angle));
 return {hears:moving&&distance(enemy,player)<range/2,
  sees:distance(enemy,player)<range&&Math.abs(delta)<=Math.PI/6&&lineClear(enemy,player,walls)};
}
export function resolveTrap(trap,targets){
 if(!trap.armed||trap.used)return [];
 const hits=targets.filter(e=>e.alive&&trapHits(trap,e));
 if(hits.length||trap.type==='rock'){trap.used=true;trap.armed=false;trap.flash=.7;}
 return hits.map(enemy=>({enemy,killed:vulnerable(enemy,trap)}));
}
export function playerInDanger(trap,player,dropping=false){
 return trap.armed&&!trap.used&&(trap.type!=='rock'||dropping)&&distance(trap,player)<trap.r+player.r;
}
const clueDescriptions = {
 stria:'Marca de traço (|): a criatura resiste a fogo e impacto, mas cai em buracos.',
 dot:'Marca de círculo (○): só uma pedra suspensa consegue esmagar essa criatura.',
 cross:'Marca de cruz (×): a criatura evita a morte por queda ou impacto, mas não resiste ao fogo.'
};
export function clueText(kind){return clueDescriptions[kind];}
export function generateClues(walls,traps,random=Math.random){
 const clues=[];
 const valid=p=>!blocked(p.x,p.y,22,walls)&&traps.every(t=>distance(p,t)>t.r+30)&&clues.every(c=>distance(p,c)>45);
 for(const kind of ENEMY_TYPES){
  let spot;
  for(let attempt=0;attempt<1000;attempt++){const p={x:24+random()*952,y:24+random()*572};if(valid(p)){spot=p;break;}}
  // Bounded fallback also handles a random source repeatedly returning one position.
  if(!spot){for(let y=30;y<600&&!spot;y+=30)for(let x=30;x<980;x+=30){const p={x,y};if(valid(p)){spot=p;break;}}}
  if(!spot)throw new Error('No reachable space for clue');
  clues.push({...spot,kind,collected:false});
 }
 return clues;
}
export function collectClues(clues,player){
 const found=clues.filter(c=>!c.collected&&distance(c,player)<24);
 found.forEach(c=>c.collected=true);
 return found.map(c=>clueText(c.kind));
}
export const SHOP = {
 stamina:{name:'Reserva de fôlego',price:75,max:3,description:'+20 de fôlego máximo por nível. Permanente.'},
 walk:{name:'Passos leves',price:100,max:3,description:'+8 de velocidade de caminhada por nível. Permanente; ainda abaixo dos monstros.'},
 lure:{name:'Isca sonora',price:40,max:3,description:'Consumível. B coloca uma isca no chão por 6 segundos. Atraia os monstros e saia de perto.'},
 repair:{name:'Kit de reposição',price:60,max:3,description:'Consumível. T restaura uma armadilha usada próxima. Prepare-a novamente com E.'}
};
export function normalizeProfile(value){
 const result={coins:0,stamina:0,walk:0,lure:0,repair:0};
 if(!value||typeof value!=='object')return result;
 for(const key of Object.keys(result)){const n=value[key];if(Number.isSafeInteger(n)&&n>=0)result[key]=Math.min(n,key==='coins'?1000000000:SHOP[key].max);}
 return result;
}
export function buyItem(profile,item){
 const spec=SHOP[item];if(!spec||profile.coins<spec.price||profile[item]>=spec.max)return null;
 return {...profile,coins:profile.coins-spec.price,[item]:profile[item]+1};
}
export function playerStats(profile){return {stamina:100+profile.stamina*20,walk:SPEED.walk+profile.walk*8};}
export function spendConsumable(profile,item){
 if(!['lure','repair'].includes(item)||profile[item]<1)return null;
 return {...profile,[item]:profile[item]-1};
}
export function restoreTrap(profile,traps,player){
 const trap=traps.filter(t=>t.used&&distance(t,player)<65).sort((a,b)=>distance(a,player)-distance(b,player))[0];
 const spent=trap&&spendConsumable(profile,'repair');if(!spent)return null;
 trap.used=false;trap.armed=false;trap.progress=0;trap.flash=0;
 return spent;
}
export function rewardKill(profile){return {...profile,coins:Math.min(1000000000,profile.coins+50)};}
export function audibleLure(enemy,lures){return lures.filter(l=>l.life>0&&distance(l,enemy)<230).sort((a,b)=>distance(a,enemy)-distance(b,enemy))[0];}
if(typeof document!=='undefined') startGame();
function startGame(){
 const canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d');
 const ui=id=>document.getElementById(id),keys=new Set();
 let state='intro',player,enemies,traps,walls,biome,particles=[],noise=0,kills=0,clock=0,last=0,nearest=null,spaceLatch=false,triggerLatch=false,lastBiome=-1,feedback='',feedbackTime=0,currentSprint=false,clues=[],lures=[],lureLatch=false,repairLatch=false;
 const storageKey='hunt-profile-v1';
 let profile=normalizeProfile(null),persistent=true;
 try{profile=normalizeProfile(JSON.parse(localStorage.getItem(storageKey)));}catch{persistent=false;}
 function saveProfile(){try{localStorage.setItem(storageKey,JSON.stringify(profile));}catch{persistent=false;}}
 let shopSignature='';
 function shopView(){
  const signature=JSON.stringify([state,profile,persistent]);if(signature===shopSignature)return;shopSignature=signature;
  ui('wallet').textContent=`${profile.coins} moedas`;
  ui('inventory').textContent=`B · ISCAS ${profile.lure} / T · KITS ${profile.repair}`;
  ui('shop-status').textContent=(state==='playing'||state==='paused'?'Compras disponíveis entre rodadas.':'Cada monstro eliminado rende 50 moedas, mesmo se você perder a rodada.')+(persistent?' Progresso salvo neste navegador.':' Armazenamento indisponível: progresso apenas nesta sessão.');
  for(const [item,spec] of Object.entries(SHOP)){const button=ui('buy-'+item);button.textContent=`${spec.name} · ${spec.price} moedas (${profile[item]}/${spec.max})`;button.disabled=state==='playing'||state==='paused'||profile.coins<spec.price||profile[item]>=spec.max;}
 }
 for(const item of Object.keys(SHOP)){ui('buy-'+item).onclick=()=>{if(state==='playing'||state==='paused')return;const purchase=buyItem(profile,item);if(purchase){profile=purchase;saveProfile();shopView();}};}

 function map(){
  let index=Math.floor(Math.random()*6);if(index===lastBiome)index=(index+1)%6;lastBiome=index;biome=BIOMES[index];
  player={x:500,y:535,r:11,stamina:playerStats(profile).stamina,angle:-Math.PI/2,exhausted:false};
  enemies=[{x:150,y:100},{x:500,y:80},{x:850,y:100}].map((e,i)=>({...e,r:13,alive:true,alert:0,angle:0,homeX:e.x,homeY:e.y,phase:i*2,kind:ENEMY_TYPES[(i+index)%3],reaction:0}));
  walls=[{x:290,y:160,w:65,h:100},{x:640,y:160,w:65,h:100},{x:120,y:400,w:95,h:45},{x:785,y:400,w:95,h:45}];
  // Small offsets vary the routes while retaining clear paths through every trap.
  walls.forEach(w=>{w.x+=Math.random()*24-12;w.y+=Math.random()*20-10;});
  traps=[{x:190,y:290,type:'pit'},{x:500,y:245,type:'fire'},{x:810,y:290,type:'rock'},{x:345,y:435,type:'fire'},{x:655,y:435,type:'pit'},{x:500,y:365,type:'rock'}].map(t=>({...t,r:27,armed:false,used:false,progress:0,flash:0}));
  clues=generateClues(walls,traps);lures=[];lureLatch=false;repairLatch=false;
  ui('clue-count').textContent='0 / 3';ui('clue-list').replaceChildren();
  ui('clue-empty').hidden=false;
  particles=[];noise=0;kills=0;clock=0;feedbackTime=0;currentSprint=false;keys.clear();spaceLatch=false;triggerLatch=false;
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
 function kill(enemy,trap){if(!enemy.alive)return;enemy.alive=false;kills++;profile=rewardKill(profile);saveProfile();for(let i=0;i<18;i++)particles.push({x:enemy.x,y:enemy.y,vx:(Math.random()-.5)*150,vy:(Math.random()-.5)*150,life:.8,color:'#e89171'});}
 function lose(message){if(state!=='playing')return;state='lost';overlay('O plano veio tarde.',message,'Tentar outro mapa →','A CAÇADA TERMINOU');}
 function activate(trap){
  const caught=playerInDanger(trap,player,true);
  const results=resolveTrap(trap,enemies);
  for(const {enemy,killed} of results){if(killed)kill(enemy,trap);else{enemy.reaction=1.5;feedback='A armadilha foi consumida. Essa criatura resistiu.';feedbackTime=3;}}
  if(caught)lose('Sua própria armadilha foi fatal. Contorne os círculos ativos e solte pedras de fora da área de impacto.');
 }
 function update(dt){
  clock+=dt;lures.forEach(l=>l.life-=dt);lures=lures.filter(l=>l.life>0);feedbackTime=Math.max(0,feedbackTime-dt);noise=Math.max(0,noise-dt);let dx=Number(keys.has('KeyD')||keys.has('ArrowRight'))-Number(keys.has('KeyA')||keys.has('ArrowLeft')),dy=Number(keys.has('KeyS')||keys.has('ArrowDown'))-Number(keys.has('KeyW')||keys.has('ArrowUp'));let moving=dx!==0||dy!==0;
  nearest=traps.filter(t=>!t.used&&distance(player,t)<65).sort((a,b)=>distance(a,player)-distance(b,player))[0];
  const preparing=keys.has('KeyE')&&nearest&&!nearest.armed&&distance(player,nearest)>=nearest.r+player.r+2;
  const sprint=moving&&!preparing&&(keys.has('ShiftLeft')||keys.has('ShiftRight'))&&!player.exhausted&&player.stamina>0;
  currentSprint=sprint;
  if(sprint){player.stamina=Math.max(0,player.stamina-30*dt);if(player.stamina===0)player.exhausted=true;}else{player.stamina=Math.min(playerStats(profile).stamina,player.stamina+19*dt);if(player.stamina>25)player.exhausted=false;}
  if(moving&&!preparing){let n=Math.hypot(dx,dy);player.angle=Math.atan2(dy,dx);move(player,dx/n*(sprint?SPEED.run:playerStats(profile).walk)*dt,dy/n*(sprint?SPEED.run:playerStats(profile).walk)*dt,11);}
  if(keys.has('KeyB')&&!lureLatch){const spent=spendConsumable(profile,'lure');if(spent){profile=spent;saveProfile();lures.push({x:player.x,y:player.y,life:6});feedback='Isca colocada. Afaste-se para que os monstros sigam o som.';feedbackTime=4;}else{feedback='Sem iscas. Compre entre rodadas.';feedbackTime=2;}}lureLatch=keys.has('KeyB');
  if(keys.has('KeyT')&&!repairLatch){const spent=restoreTrap(profile,traps,player);if(spent){profile=spent;saveProfile();feedback='Armadilha restaurada. Prepare novamente com E.';feedbackTime=4;}else{feedback='Precisa de um kit e de uma armadilha usada próxima.';feedbackTime=2;}}repairLatch=keys.has('KeyT');
  if(keys.has('Space')&&!spaceLatch){noise=1.5;enemies.filter(e=>e.alive&&distance(e,player)<230).forEach(e=>e.alert=5);}spaceLatch=keys.has('Space');
  traps.forEach(t=>{t.flash=Math.max(0,t.flash-dt);if(t===nearest&&preparing){t.progress+=dt;if(t.progress>=1){t.armed=true;t.progress=0;triggerLatch=true;}}else t.progress=0;});
  if(nearest?.armed&&nearest.type==='rock'&&keys.has('KeyE')&&!triggerLatch){activate(nearest);triggerLatch=true;}
  if(state!=='playing')return;
  for(const trap of traps){if(playerInDanger(trap,player)){lose('Você entrou em uma armadilha ativa. Prepare de fora do círculo e contorne o perigo.');return;}}
  if(!keys.has('KeyE'))triggerLatch=false;
  for(const enemy of enemies){if(!enemy.alive)continue;
   enemy.reaction=Math.max(0,enemy.reaction-dt);
   const senses=perception(enemy,player,walls,sprint,moving&&!preparing);
   if(senses.sees||senses.hears)enemy.alert=4;else enemy.alert=Math.max(0,enemy.alert-dt);
   const lure=!(senses.sees||senses.hears)&&audibleLure(enemy,lures);
   let target=lure|| (enemy.alert>0?player:{x:enemy.homeX+Math.sin(clock*.45+enemy.phase)*45,y:enemy.homeY+Math.cos(clock*.5+enemy.phase)*26});
   let vx=target.x-enemy.x,vy=target.y-enemy.y,n=Math.hypot(vx,vy);enemy.angle=Math.atan2(vy,vx);
   if(n>3)move(enemy,vx/n*(enemy.alert>0||lure?SPEED.monster:33)*dt,vy/n*(enemy.alert>0||lure?SPEED.monster:33)*dt,13);
   for(const trap of traps){if(trap.type!=='rock'&&trapHits(trap,enemy)){activate(trap);break;}}
   if(enemy.alive&&distance(enemy,player)<23){lose('Você foi alcançado. Monstros correm mais que sua caminhada.<br>Reserve fôlego para fugir e contorne suas armadilhas.');break;}
  }
  if(state==='playing'){
   for(const message of collectClues(clues,player)){
    const li=document.createElement('li');li.textContent=message;ui('clue-list').append(li);
    ui('clue-empty').hidden=true;ui('clue-count').textContent=`${clues.filter(c=>c.collected).length} / 3`;
    feedback='Anotação recolhida. Vulnerabilidade registrada no caderno abaixo do mapa.';feedbackTime=5;
   }
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
  clues.forEach(c=>{if(c.collected)return;ctx.save();ctx.translate(c.x,c.y);ctx.shadowColor='#e6d69a';ctx.shadowBlur=8+Math.sin(clock*3)*3;ctx.fillStyle='#e6d69a';ctx.fillRect(-8,-10,16,20);ctx.shadowBlur=0;text('?',0,5,'#303225',14);ctx.restore();text('ANOTAÇÃO',c.x,c.y+25,'#d7cf9d',8);});
  traps.forEach(t=>{
   ctx.save();ctx.translate(t.x,t.y);let color=t.used?'#66725d':t.armed?(t.type==='fire'?'#f1a36a':'#cde58e'):'#8d9d7c';ctx.strokeStyle=color;ctx.lineWidth=1.5;ctx.setLineDash(t.armed?[]:[4,5]);ctx.beginPath();ctx.arc(0,0,t.r,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
   ctx.fillStyle=t.used?'#141a16':t.type==='fire'?(t.armed?'#a8542c':'#555d37'):'#121a16';ctx.beginPath();ctx.ellipse(0,0,19,12,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle=color;
   if(t.type==='pit'){ctx.beginPath();ctx.moveTo(-12,-5);ctx.lineTo(0,9);ctx.lineTo(12,-5);ctx.stroke();}else if(t.type==='fire'){for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(i*9-4,5);ctx.lineTo(i*9,-12-(t.armed?Math.sin(clock*9+i)*4:0));ctx.lineTo(i*9+5,5);ctx.stroke();}}else{ctx.strokeRect(-10,-13,20,20);ctx.beginPath();ctx.moveTo(-17,-19);ctx.lineTo(17,-19);ctx.moveTo(0,-19);ctx.lineTo(0,-13);ctx.stroke();}
   if(t.progress){ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,31,-Math.PI/2,-Math.PI/2+t.progress*Math.PI*2);ctx.stroke();}
   if(t.flash){ctx.fillStyle=`rgba(230,199,121,${t.flash})`;ctx.beginPath();ctx.arc(0,0,38*(1-t.flash/2),0,Math.PI*2);ctx.fill();}
   text(t.used?'USADA':t.type==='pit'?'BURACO':t.type==='fire'?'FOGO':'PEDRA',0,43,color,9);if(t.armed&&!t.used)text(t.type==='rock'?'E · SOLTAR':'PRONTA',0,-37,color,8);ctx.restore();
  });
  enemies.forEach(e=>{if(!e.alive)return;ctx.save();ctx.translate(e.x,e.y);ctx.rotate(e.angle);ctx.fillStyle='#ed9c7020';ctx.strokeStyle='#ed9c7044';ctx.beginPath();ctx.moveTo(0,0);
   const range=currentSprint?275:215;
   for(let a=-Math.PI/6;a<=Math.PI/6+.001;a+=Math.PI/120){let r=0;while(r<range){const x=e.x+Math.cos(e.angle+a)*(r+5),y=e.y+Math.sin(e.angle+a)*(r+5);if(walls.some(w=>x>w.x&&x<w.x+w.w&&y>w.y&&y<w.y+w.h))break;r+=5;}ctx.lineTo(Math.cos(a)*Math.min(r,range),Math.sin(a)*Math.min(r,range));}ctx.closePath();ctx.fill();ctx.stroke();ctx.setLineDash([2,7]);ctx.beginPath();ctx.arc(0,0,range/2,0,Math.PI*2);ctx.stroke();ctx.restore();});
  enemies.forEach(e=>{if(!e.alive)return;ctx.save();ctx.translate(e.x,e.y);if(e.alert>0){ctx.strokeStyle='#e9927140';ctx.beginPath();ctx.arc(0,0,23+Math.sin(clock*6)*3,0,Math.PI*2);ctx.stroke();text('!',0,-29,'#f3aa87',16);}if(e.reaction>0)text('RESISTIU',0,-42,'#ffd0a1',9);ctx.rotate(e.angle);ctx.fillStyle=e.alert>0?'#ef916d':'#b97c67';ctx.fillRect(-12,-12,24,24);ctx.strokeStyle='#eed5bd';ctx.lineWidth=2;ctx.beginPath();if(e.kind==='stria'){ctx.moveTo(-7,-7);ctx.lineTo(-7,7);}else if(e.kind==='dot'){ctx.arc(-5,0,3,0,Math.PI*2);}else{ctx.moveTo(-8,-4);ctx.lineTo(-1,4);ctx.moveTo(-8,4);ctx.lineTo(-1,-4);}ctx.stroke();ctx.fillStyle='#37271f';ctx.fillRect(5,-6,4,4);ctx.fillRect(5,3,4,4);ctx.restore();});
  lures.forEach(l=>{ctx.strokeStyle='#9adfe3';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(l.x,l.y,10+(clock*35)%45,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#9adfe3';ctx.fillRect(l.x-5,l.y-5,10,10);text(`ISCA ${Math.ceil(l.life)}s`,l.x,l.y+25,'#9adfe3',9);});
  if(noise>0){ctx.strokeStyle=`rgba(211,236,155,${noise/2})`;ctx.beginPath();ctx.arc(player.x,player.y,30+(1.5-noise)*190,0,Math.PI*2);ctx.stroke();}
  ctx.save();ctx.translate(player.x,player.y);ctx.rotate(player.angle);ctx.shadowColor='#dcf6a0';ctx.shadowBlur=14;ctx.fillStyle='#dcf6a0';ctx.beginPath();ctx.moveTo(16,0);ctx.lineTo(-10,-10);ctx.lineTo(-6,0);ctx.lineTo(-10,10);ctx.closePath();ctx.fill();ctx.restore();
  particles.forEach(p=>{ctx.globalAlpha=p.life;ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,4,4);});ctx.globalAlpha=1;
  ui('kills').textContent=`${kills} / 3 ELIMINADOS`;ui('stamina').max=playerStats(profile).stamina;ui('stamina').value=player.stamina;shopView();
  const chasing=enemies.some(e=>e.alive&&e.alert>0);ui('status').textContent=state==='paused'?'PAUSADO':chasing?'! EM PERSEGUIÇÃO':'PREPARE O TERRENO';ui('status').style.color=chasing?'#efa47f':'#a1ae97';
  ui('hint').textContent=feedbackTime>0?feedback:nearest?(nearest.armed?(nearest.type==='rock'?'E · Soltar pedra agora. Só acerte quando o monstro estiver no círculo.':'Armadilha pronta. Atraia um monstro até o círculo.'):(distance(player,nearest)<nearest.r+player.r+2?'Afaste-se do círculo para preparar · ':'Segure E · ')+(nearest.type==='pit'?'Descobrir buraco':nearest.type==='fire'?'Acender poça':'Preparar pedra')):'Espaço · Fazer barulho e atrair monstros próximos. Contorne armadilhas ativas. Recolha anotações (?) para descobrir vulnerabilidades.';
 }
 map();function frame(now){let dt=Math.min((now-last)/1000,.035);last=now;if(state==='playing')update(dt);draw();requestAnimationFrame(frame);}requestAnimationFrame(frame);
}
