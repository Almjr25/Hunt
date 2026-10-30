export const BIOMES = [
 {name:'BOSQUE SOMBRIO',bg:'#202c21',grid:'#2b3929',wall:'#45563b',accent:'#b5d581',detail:'árvores'},
 {name:'PÂNTANO TÓXICO',bg:'#222c2b',grid:'#2c3937',wall:'#40544e',accent:'#9ed8b6'},
 {name:'DESERTO VERMELHO',bg:'#352b23',grid:'#42372a',wall:'#68533e',accent:'#e9c388'},
 {name:'TUNDRA SILENCIOSA',bg:'#263139',grid:'#303e47',wall:'#4c6472',accent:'#b5e4ea'},
 {name:'CALDEIRA VULCÂNICA',bg:'#302326',grid:'#403034',wall:'#624248',accent:'#efad82'},
 {name:'RUÍNAS ESQUECIDAS',bg:'#2c2b32',grid:'#38363f',wall:'#555160',accent:'#cfb5e8'}
];
const ICON_PATHS={
 fangs:'M5 3h5l-1 9-4 8V3Zm9 0h5v17l-4-8-1-9Z',
 wings:'M12 12C7 3 2 4 2 7l2 10 5-3 3 7 3-7 5 3 2-10c0-3-5-4-10 5Z',
 hide:'m8 2 4 2 4-2 5 5-3 5 3 6-6 4-3-2-3 2-6-4 3-6-3-5 5-5Z',
 bones:'M6 3a3 3 0 0 0-4 4l4 2 9 10 2 3a3 3 0 0 0 4-4l-3-1-9-10-1-3Z',
 arrows:'M3 21 20 4M13 4h7v7M3 14l7 7M4 9l11 11',
 cloak:'M9 3h6l7 18-10-3-10 3L9 3Zm0 0 3 7 3-7',
 snare:'M3 6h18v13H3zM3 6l18 13M21 6 3 19M8 3v3m8-3v3',
 stamina:'M12 21 3 12C-2 5 8 0 12 7c4-7 14-2 9 5l-9 9Z',
 walk:'M8 3h6v10l7 3v5H3v-6l5-3V3Zm0 4h6M3 17h18',
 lure:'M4 8v8l7 3V5L4 8Zm11-3c5 4 5 10 0 14m0-10c2 2 2 4 0 6',
 repair:'M15 3a6 6 0 0 0-7 7L2 17l5 5 7-7a6 6 0 0 0 7-7l-5 4-4-4 3-5Z',
 pit:'M2 10c0-8 20-8 20 0s-20 8-20 0Zm3 0 7 10 7-10',
 fire:'M12 2c1 6 9 8 9 14a9 9 0 0 1-18 0c0-4 3-7 4-8 0 5 3 4 3 2l2-8Zm0 13c-5 5-2 8 1 6 3-1 1-4-1-6Z',
 rock:'m7 6 11-3 4 12-7 6-12-5L7 6Zm0 0 8 7 7 2M15 13v8'
};
export function iconSVG(kind){return `<svg class="item-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${ICON_PATHS[kind]??ICON_PATHS.repair}"/></svg>`;}
function itemBadge(kind,count,showName=false){const badge=document.createElement('span'),name=RESOURCE_NAMES[kind]??SHOP[kind]?.name.replace(/ \[.*?\]/,'')??kind;badge.className='item-badge item-'+kind;badge.innerHTML=iconSVG(kind);badge.title=`${count} ${name}`;badge.setAttribute('aria-label',`${count} ${name}`);const text=document.createElement('span');text.textContent=showName?`${name} · ${count}`:String(count);badge.append(text);return badge;}
export const ACTIONS={up:'Mover para cima',down:'Mover para baixo',left:'Mover para esquerda',right:'Mover para direita',run:'Correr',prepare:'Preparar / soltar pedra',noise:'Fazer barulho',aim:'Mirar / soltar flecha',flight:'Ativar capa',pit:'Colocar buraco',fire:'Colocar fogo',rock:'Colocar pedra',snare:'Colocar imobilização',lure:'Colocar isca',repair:'Usar kit',craft:'Abrir fabricação',pause:'Pausar',next:'Próxima rodada',controls:'Configurar controles'};
export const DEFAULT_BINDINGS={up:'KeyW',down:'KeyS',left:'KeyA',right:'KeyD',run:'ShiftLeft',prepare:'KeyE',noise:'Space',aim:'KeyQ',flight:'KeyF',pit:'Digit1',fire:'Digit2',rock:'Digit3',snare:'Digit4',lure:'KeyB',repair:'KeyT',craft:'KeyC',pause:'KeyP',next:'KeyR',controls:'KeyO'};
export function validBinding(code){return typeof code==='string'&&/^(Key[A-Z]|Digit[0-9]|Arrow(Up|Down|Left|Right)|Shift(Left|Right)|Control(Left|Right)|Alt(Left|Right)|Space|Enter|Tab|Backspace|CapsLock|Backquote|Minus|Equal|BracketLeft|BracketRight|Backslash|IntlBackslash|Semicolon|Quote|Comma|Period|Slash|Home|End|PageUp|PageDown|Insert|Delete|Numpad[0-9]|NumpadAdd|NumpadSubtract|NumpadMultiply|NumpadDivide|NumpadDecimal|NumpadEnter|F([1-9]|1[0-2])|Mouse[0-4])$/.test(code);}
export function normalizeBindings(value){const result={...DEFAULT_BINDINGS};if(value&&typeof value==='object')for(const action of Object.keys(ACTIONS))if(validBinding(value[action]))result[action]=value[action];const used=new Set();for(const action of Object.keys(ACTIONS)){if(used.has(result[action]))result[action]=[DEFAULT_BINDINGS[action],...Array.from({length:26},(_,i)=>'Key'+String.fromCharCode(65+i))].find(k=>!used.has(k));used.add(result[action]);}return result;}
export function rebind(bindings,action,code){if(!Object.hasOwn(ACTIONS,action)||!validBinding(code))return null;const next={...bindings},other=Object.keys(next).find(k=>k!==action&&next[k]===code);if(other)next[other]=next[action];next[action]=code;return next;}
export function keyName(code){return {Space:'Espaço',ShiftLeft:'Shift E',ShiftRight:'Shift D',ControlLeft:'Ctrl E',ControlRight:'Ctrl D',AltLeft:'Alt E',AltRight:'Alt D',ArrowUp:'↑',ArrowDown:'↓',ArrowLeft:'←',ArrowRight:'→',Mouse0:'Mouse esq.',Mouse1:'Mouse meio',Mouse2:'Mouse dir.',Mouse3:'Mouse 4',Mouse4:'Mouse 5',Backquote:'`',Minus:'-',Equal:'=',BracketLeft:'[',BracketRight:']',Backslash:'\\',IntlBackslash:'\\',Semicolon:';',Quote:"'",Comma:',',Period:'.',Slash:'/'}[code]??code.replace(/^Key|^Digit/,'');}
export const MUD_SECONDS=12;
export function generateMud(walls,traps,clues,spawns,random=Math.random){
 const pools=[];const valid=p=>!blocked(p.x,p.y,75,walls)&&traps.every(t=>distance(t,p)>t.r+p.r+35)&&clues.every(c=>distance(c,p)>p.r+30)&&spawns.every(e=>distance(e,p)>p.r+90)&&pools.every(m=>distance(m,p)>200);
 for(let i=0;i<8;i++){let pool;for(let n=0;n<800;n++){const p={x:90+random()*(WORLD.width-180),y:90+random()*(WORLD.height-180),r:50};if(valid(p)){pool=p;break;}}
  if(!pool)for(let y=90;y<WORLD.height-90&&!pool;y+=70)for(let x=90;x<WORLD.width-90;x+=70){const p={x,y,r:50};if(valid(p)){pool=p;break;}}
  if(pool)pools.push(pool);
 }return pools;
}
export function updateMud(player,pools,dt){player.mud=Math.max(0,(player.mud??0)-dt);if(!player.flying&&pools.some(p=>Math.hypot(player.x-p.x,(player.y-p.y)/.83)<p.r))player.mud=MUD_SECONDS;}
export function updatePursuit(enemy,player,senses){if(senses.sees||senses.hears){enemy.chasing=true;}else if(enemy.chasing&&player.mud>0){enemy.chasing=false;enemy.homeX=enemy.x;enemy.homeY=enemy.y;}enemy.alert=enemy.chasing?1:0;}
export const WORLD={width:2500,height:1500};
export function cameraFor(player){return {x:Math.max(0,Math.min(WORLD.width-1000,player.x-500)),y:Math.max(0,Math.min(WORLD.height-620,player.y-310))};}
export function generateWalls(spawns,random=Math.random){
 const walls=[];
 const valid=w=>!spawns.some(p=>p.x>w.x-180&&p.x<w.x+w.w+180&&p.y>w.y-180&&p.y<w.y+w.h+180)&&!walls.some(o=>w.x<o.x+o.w+100&&w.x+w.w>o.x-100&&w.y<o.y+o.h+100&&w.y+w.h>o.y-100);
 for(let i=0;i<28;i++){
  let wall;
  for(let attempt=0;attempt<500;attempt++){const w={x:70+random()*(WORLD.width-300),y:70+random()*(WORLD.height-300),w:55+random()*90,h:45+random()*100};if(valid(w)){wall=w;break;}}
  if(!wall)for(let y=70;y<WORLD.height-150&&!wall;y+=40)for(let x=70;x<WORLD.width-150;x+=40){const w={x,y,w:55,h:45};if(valid(w)){wall=w;break;}}
  if(wall)walls.push(wall);
 }
 return walls;
}
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export function trapHits(trap, enemy){return trap.armed&&!trap.used&&distance(trap,enemy)<trap.r+(enemy.r??13);}
export function blocked(x,y,r,walls){return x<r||y<r||x>WORLD.width-r||y>WORLD.height-r||walls.some(w=>x+r>w.x&&x-r<w.x+w.w&&y+r>w.y&&y-r<w.y+w.h);}
export function lineClear(a,b,walls){const n=Math.ceil(distance(a,b)/8);for(let i=1;i<n;i++){const x=a.x+(b.x-a.x)*i/n,y=a.y+(b.y-a.y)*i/n;if(walls.some(w=>x>w.x&&x<w.x+w.w&&y>w.y&&y<w.y+w.h))return false;}return true;}
export const SPEED = {walk:140, run:240, monster:175};
export const LURE_RANGE=900;
export function generateTraps(walls,player,enemies,random=Math.random){
 const traps=[];
 const valid=p=>!blocked(p.x,p.y,65,walls)&&distance(p,player)>100&&enemies.every(e=>distance(p,e)>85)&&traps.every(t=>distance(p,t)>125);
 for(const type of Array.from({length:12},(_,i)=>['pit','fire','rock'][i%3])){
  let spot;
  for(let attempt=0;attempt<500;attempt++){const p={x:70+random()*(WORLD.width-140),y:70+random()*(WORLD.height-140)};if(valid(p)){spot=p;break;}}
  if(!spot)for(let y=70;y<=WORLD.height-70&&!spot;y+=25)for(let x=70;x<=WORLD.width-70;x+=25){const p={x,y};if(valid(p)){spot=p;break;}}
  if(!spot)throw new Error('No safe space for traps');
  traps.push({...spot,type,r:27,armed:false,used:false,progress:0,flash:0});
 }
 return traps;
}
export const ENEMY_TYPES=['snake','bat','wolf','boar'];
export const ENEMY_COLORS={snake:{name:'cobra',fill:'#79ce86'},bat:{name:'morcego',fill:'#bd8cf0'},wolf:{name:'lobo',fill:'#a9c8df'},boar:{name:'javali',fill:'#e3af73'},bear:{name:'urso',fill:'#cf815b'}};
export function createEnemies(round=1){
 const spawns=[{x:375,y:250},{x:1250,y:200},{x:2125,y:250},{x:425,y:800},{x:1250,y:700},{x:2075,y:800},{x:780,y:1050},{x:1770,y:1050}];
 if(round%2===0)spawns.push({x:1250,y:420});
 return spawns.map((e,i)=>({...e,r:i===8?24:13,alive:true,alert:0,angle:0,homeX:e.x,homeY:e.y,phase:i*2,kind:i===8?'bear':ENEMY_TYPES[i%4],reaction:0,immobilized:0,poison:null,poisonHits:0,chasing:false}));
}
export function roundComplete(enemies){return enemies.length>0&&enemies.every(e=>!e.alive);}
const weaknesses={snake:'pit',bat:'rock',wolf:'fire',boar:'pit'};
export function vulnerable(enemy,trap){return enemy.kind!=='bear'&&weaknesses[enemy.kind]===trap.type;}
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
 return hits.map(enemy=>{if(trap.type==='snare'){enemy.immobilized=5;return {enemy,killed:false,immobilized:true};}return {enemy,killed:vulnerable(enemy,trap)};});
}
export function playerInDanger(trap,player,dropping=false){
 return trap.type!=='snare'&&!(trap.type==='pit'&&player.flying)&&trap.armed&&!trap.used&&(trap.type!=='rock'||dropping)&&distance(trap,player)<trap.r+player.r;
}
const clueDescriptions={snake:'Cobra → buraco. Presas → flechas venenosas.',bat:'Morcego → pedra. Asas → capa para voar sobre buracos.',wolf:'Lobo → fogo. Couro + ossos → armadilha de imobilização.',boar:'Javali → buraco. Ossos + couro → imobilizar por 5s.',bear:'Urso: precisa de duas flechas venenosas. Mire parado por 2 segundos; o veneno mata 10 segundos após a segunda flecha.'};
export function clueText(kind){return clueDescriptions[kind];}
export function generateClues(walls,traps,random=Math.random){
 const clues=[];
 const valid=p=>!blocked(p.x,p.y,22,walls)&&traps.every(t=>distance(p,t)>t.r+30)&&clues.every(c=>distance(p,c)>45);
 for(const kind of ENEMY_TYPES){
  let spot;
  for(let attempt=0;attempt<1000;attempt++){const p={x:24+random()*(WORLD.width-48),y:24+random()*(WORLD.height-48)};if(valid(p)){spot=p;break;}}
  // Bounded fallback also handles a random source repeatedly returning one position.
  if(!spot){for(let y=30;y<WORLD.height-24&&!spot;y+=30)for(let x=30;x<WORLD.width-24;x+=30){const p={x,y};if(valid(p)){spot=p;break;}}}
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
export const RESOURCE_NAMES={fangs:'presas',wings:'asas',hide:'couro',bones:'ossos'};
export const SHOP={
 arrows:{name:'3 flechas venenosas',max:99,amount:3,cost:{fangs:1}},
 cloak:{name:'Capa de voo [F]',max:1,cost:{wings:2}},
 snare:{name:'Armadilha de imobilização [4]',max:6,cost:{hide:1,bones:1}},
 stamina:{name:'Reserva de fôlego',max:3,cost:{hide:2}},walk:{name:'Passos leves',max:3,cost:{bones:2}},
 lure:{name:'Isca sonora [B]',max:3,cost:{wings:1}},repair:{name:'Kit de reposição [T]',max:3,cost:{bones:1}},
 pit:{name:'Buraco portátil [1]',max:3,cost:{hide:2,bones:2}},fire:{name:'Poça inflamável [2]',max:3,cost:{hide:2,bones:2}},rock:{name:'Pedra suspensa [3]',max:3,cost:{hide:2,bones:2}}
};
export function normalizeProfile(value){
 const result={round:1,stamina:0,walk:0,lure:0,repair:0,pit:0,fire:0,rock:0,arrows:0,cloak:0,snare:0,fangs:0,wings:0,hide:0,bones:0};
 if(!value||typeof value!=='object')return result;
 for(const key of Object.keys(result)){const n=value[key];if(Number.isSafeInteger(n)&&n>=0)result[key]=Math.min(n,SHOP[key]?.max??1000000);}
 result.round=Math.max(1,result.round);return result;
}
export function canCraft(profile,item){const spec=SHOP[item];return Boolean(spec&&profile[item]+(spec.amount??1)<=spec.max&&Object.entries(spec.cost).every(([key,n])=>profile[key]>=n));}
export function buyItem(profile,item){
 if(!canCraft(profile,item))return null;const spec=SHOP[item],next={...profile,[item]:profile[item]+(spec.amount??1)};
 for(const [key,n] of Object.entries(spec.cost))next[key]-=n;return next;
}
export function playerStats(profile){return {stamina:100+profile.stamina*20,walk:SPEED.walk+profile.walk*13};}
export function spendConsumable(profile,item){
 if(!['lure','repair','pit','fire','rock','snare','arrows'].includes(item)||profile[item]<1)return null;
 return {...profile,[item]:profile[item]-1};
}
export function placeTrap(profile,type,player,walls,traps,enemies=[],clues=[]){
 if(!['pit','fire','rock','snare'].includes(type))return null;
 const p={x:player.x+Math.cos(player.angle)*85,y:player.y+Math.sin(player.angle)*85};
 if(blocked(p.x,p.y,65,walls)||traps.some(t=>distance(t,p)<100)||enemies.some(e=>e.alive&&distance(e,p)<45)||clues.some(c=>!c.collected&&distance(c,p)<50))return null;
 const spent=spendConsumable(profile,type);if(!spent)return null;
 traps.push({...p,type,r:27,armed:false,used:false,progress:0,flash:0});return spent;
}
export function restoreTrap(profile,traps,player){
 const trap=traps.filter(t=>t.used&&distance(t,player)<65).sort((a,b)=>distance(a,player)-distance(b,player))[0];
 const spent=trap&&spendConsumable(profile,'repair');if(!spent)return null;
 trap.used=false;trap.armed=false;trap.progress=0;trap.flash=0;
 return spent;
}
export function lootFor(kind){return {snake:{fangs:2},bat:{wings:2},wolf:{hide:2},boar:{bones:2},bear:{hide:2,bones:2}}[kind]??{};}
export function collectLoot(profile,loot,player){
 let next=profile;for(const bag of loot){if(bag.collected||distance(bag,player)>28)continue;bag.collected=true;next={...next};for(const [key,n] of Object.entries(bag.resources))next[key]=Math.min(1000000,next[key]+n);}return next;
}
export const AIM_SECONDS=2,POISON_SECONDS=10,NORMAL_POISON_SECONDS=5;
export function applyPoison(enemy){enemy.poisonHits=(enemy.poisonHits??0)+1;if(enemy.poison===null&&(enemy.kind!=='bear'||enemy.poisonHits>=2))enemy.poison=enemy.kind==='bear'?POISON_SECONDS:NORMAL_POISON_SECONDS;enemy.chasing=true;enemy.alert=1;}

export function updateAim(progress,held,moving,wasHeld,dt){return {progress:held&&!moving?Math.min(AIM_SECONDS,progress+dt):0,fire:!held&&wasHeld&&!moving&&progress>=AIM_SECONDS};}
export function tickEnemy(enemy,dt){enemy.immobilized=Math.max(0,enemy.immobilized-dt);if(enemy.immobilized<1e-9)enemy.immobilized=0;if(enemy.poison!==null){enemy.poison=Math.max(0,enemy.poison-dt);if(enemy.poison<1e-9)enemy.poison=0;return enemy.poison===0;}return false;}
export function advanceArrow(arrow,dt,enemies,walls){
 const length=Math.min(600*dt,arrow.remaining),steps=Math.max(1,Math.ceil(length/2)),dx=Math.cos(arrow.angle)*length/steps,dy=Math.sin(arrow.angle)*length/steps;
 for(let i=0;i<steps;i++){arrow.x+=dx;arrow.y+=dy;if(blocked(arrow.x,arrow.y,2,walls))return true;
  const target=enemies.find(e=>e.alive&&distance(e,arrow)<e.r+3);if(target){applyPoison(target);return true;}}
 arrow.remaining-=length;return arrow.remaining<=0;
}
export function audibleLure(enemy,lures){return lures.filter(l=>l.life>0&&distance(l,enemy)<LURE_RANGE).sort((a,b)=>distance(a,enemy)-distance(b,enemy))[0];}
if(typeof document!=='undefined') startGame();
function startGame(){
 const canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d');
 const ui=id=>document.getElementById(id),keys=new Set();
 let state='intro',player,enemies,traps,walls,biome,particles=[],noise=0,kills=0,clock=0,last=0,nearest=null,spaceLatch=false,triggerLatch=false,lastBiome=-1,feedback='',feedbackTime=0,currentSprint=false,clues=[],lures=[],lureLatch=false,repairLatch=false,placementLatch=false,loot=[],arrows=[],aim=0,aimHeld=false,flightLatch=false,pointer=null,mudPools=[];
 const controlsKey='hunt-controls-v1';let bindings=normalizeBindings(null),capture=null,controlReturn='intro';
 try{bindings=normalizeBindings(JSON.parse(localStorage.getItem(controlsKey)));}catch{}
 const down=action=>keys.has(bindings[action]);
 const label=action=>keyName(bindings[action]);
 const storageKey='hunt-profile-v1';
 let profile=normalizeProfile(null),persistent=true;
 try{profile=normalizeProfile(JSON.parse(localStorage.getItem(storageKey)));}catch{persistent=false;}
 function saveProfile(){try{localStorage.setItem(storageKey,JSON.stringify(profile));}catch{persistent=false;}}
 let shopSignature='';
 function shopView(){
  const signature=JSON.stringify([state,profile,persistent,bindings]);if(signature===shopSignature)return;shopSignature=signature;
  ui('wallet').textContent=`RODADA ${profile.round}${profile.round%2===0?' · URSO':''}`;
  ui('shop').hidden=!['intro','won','lost','between','craft'].includes(state);
  for(const id of ['field-inventory','inventory']){const row=ui(id);row.replaceChildren();for(const item of ['arrows','snare','cloak','lure','repair','pit','fire','rock']){const badge=itemBadge(item,profile[item]);const action={arrows:'aim',cloak:'flight'}[item]??item;if(bindings[action]){const key=document.createElement('kbd');key.textContent=label(action);badge.prepend(key);}row.append(badge);}}
  for(const id of ['resources','craft-resources']){const resources=ui(id);resources.replaceChildren();for(const key of Object.keys(RESOURCE_NAMES))resources.append(itemBadge(key,profile[key]));}
  ui('shop-status').textContent=persistent?'Recursos e itens salvos neste navegador.':'Progresso apenas nesta sessão.';
  for(const [item,spec] of Object.entries(SHOP)){const button=ui('buy-'+item);button.replaceChildren(itemBadge(item,profile[item],true));button.setAttribute('aria-label',`Fabricar ${spec.name.replace(/ \[.*?\]/,'')} (${profile[item]}/${spec.max})`);button.disabled=!['intro','won','lost','between','craft'].includes(state)||!canCraft(profile,item);}

 }
 const recipes=ui('recipe-list');
 for(const [item,spec] of Object.entries(SHOP)){
  const card=document.createElement('article'),cost=document.createElement('p'),button=document.createElement('button');
  cost.className='recipe-cost';for(const [key,n] of Object.entries(spec.cost))cost.append(itemBadge(key,n));button.id='buy-'+item;card.append(cost,button);recipes.append(card);
 }
 for(const item of Object.keys(SHOP)){ui('buy-'+item).onclick=()=>{if(!['intro','won','lost','between','craft'].includes(state))return;const purchase=buyItem(profile,item);if(purchase){profile=purchase;saveProfile();shopView();}};}

 function resetProgress(){
  const previous=state;if(state==='playing')state='paused';keys.clear();aim=0;aimHeld=false;
  if(!window.confirm('Apagar recursos, rodada, melhorias, itens e controles salvos e reiniciar do zero?')){state=previous;return;}
  profile=normalizeProfile(null);bindings=normalizeBindings(null);refreshBindings();
  try{localStorage.removeItem(storageKey);localStorage.removeItem(controlsKey);}catch{persistent=false;window.alert('O progresso desta sessão foi zerado, mas o navegador não permitiu apagar os dados salvos.');}
  state='intro';lastBiome=-1;map();shopSignature='';shopView();
  overlay('Uma nova caçada.','Progresso zerado. Explore o mapa e prepare seu plano.','Entrar na caçada →','RECOMEÇAR DO ZERO');
 }
 ui('reset').onclick=resetProgress;ui('reset-field').onclick=resetProgress;
 function map(){
  let index=Math.floor(Math.random()*6);if(index===lastBiome)index=(index+1)%6;lastBiome=index;biome=BIOMES[index];
  player={x:1250,y:1350,r:11,stamina:playerStats(profile).stamina,angle:-Math.PI/2,exhausted:false,flying:false,mud:0};
  enemies=createEnemies(profile.round);
  walls=generateWalls([player,...enemies]);
  traps=generateTraps(walls,player,enemies);
  clues=generateClues(walls,traps);mudPools=generateMud(walls,traps,clues,[player,...enemies]);loot=[];arrows=[];aim=0;aimHeld=false;flightLatch=false;pointer=null;lures=[];lureLatch=false;repairLatch=false;placementLatch=false;nearest=null;
  ui('clue-count').textContent=`0 / ${ENEMY_TYPES.length}`;ui('clue-list').replaceChildren();
  ui('clue-empty').hidden=false;
  particles=[];noise=0;kills=0;clock=0;feedbackTime=0;currentSprint=false;keys.clear();spaceLatch=false;triggerLatch=false;
  ui('biome').textContent=biome.name;ui('dot').style.background=biome.accent;
 }
 function overlay(title,description,label,eyebrow){ui('title').textContent=title;ui('description').innerHTML=description;ui('play').textContent=label;ui('overline').textContent=eyebrow;ui('overlay').classList.remove('hidden');document.querySelector('.transition').scrollTop=0;}
 function begin(){if(state!=='intro')profile={...profile,round:Math.min(1000000,profile.round+1)};saveProfile();map();state='playing';ui('overlay').classList.add('hidden');shopView();canvas.focus({preventScroll:true});}
 ui('play').onclick=()=>{if(state==='paused'||state==='craft'){state='playing';ui('overlay').classList.add('hidden');canvas.focus({preventScroll:true});}else begin();};
 function between(){if(state==='intro'||state==='won'||state==='lost'||state==='between')return;state='between';keys.clear();aim=0;aimHeld=false;overlay('Prepare a próxima caçada.','Abasteça seus suprimentos antes de entrar em outro mapa.','Ir para o próximo mapa →','ENTRE RODADAS');shopView();}
 ui('new').onclick=between;
 function pause(){if(state==='playing'){state='paused';keys.clear();aim=0;aimHeld=false;overlay('Respire. Refaça o plano.','A caçada está pausada.','Continuar →','PAUSA');}else if(state==='paused'||state==='craft'){state='playing';ui('overlay').classList.add('hidden');}}
 function crafting(){if(state==='playing'){state='craft';keys.clear();aim=0;aimHeld=false;overlay('Bancada de campo.','Fabrique com os recursos recolhidos. A caçada está pausada.','Voltar à caçada →','FABRICAÇÃO');shopView();}else if(state==='craft'){state='playing';ui('overlay').classList.add('hidden');canvas.focus({preventScroll:true});}}
 ui('craft-field').onclick=crafting;
 canvas.addEventListener('mousemove',e=>{const rect=canvas.getBoundingClientRect();pointer={x:(e.clientX-rect.left)*1000/rect.width,y:(e.clientY-rect.top)*620/rect.height};});
 function refreshBindings(){canvas.setAttribute('aria-label',`Mapa. Mover: ${label('up')}, ${label('left')}, ${label('down')}, ${label('right')}. Preparar: ${label('prepare')}. Mirar: ${label('aim')}. Fabricar: ${label('craft')}.`);for(const node of document.querySelectorAll('[data-bind]'))node.textContent=label(node.dataset.bind);for(const action of Object.keys(ACTIONS)){const button=ui('bind-'+action);if(button)button.textContent=capture===action?'Pressione…':label(action);}shopSignature='';}
 function controls(){if(ui('controls-dialog').open)return;controlReturn=state;state='controls';keys.clear();aim=0;aimHeld=false;capture=null;refreshBindings();ui('controls-dialog').showModal();}
 function closeControls(){capture=null;ui('controls-dialog').close();state=controlReturn;keys.clear();refreshBindings();shopView();if(state==='playing')canvas.focus({preventScroll:true});}
 ui('controls-open').onclick=controls;ui('controls-menu').onclick=controls;ui('controls-close').onclick=closeControls;
 ui('controls-dialog').addEventListener('cancel',e=>{e.preventDefault();if(capture){capture=null;refreshBindings();}else closeControls();});
 for(const [action,name] of Object.entries(ACTIONS)){const row=document.createElement('div'),text=document.createElement('span'),button=document.createElement('button');text.textContent=name;button.id='bind-'+action;button.onclick=()=>{capture=action;ui('controls-message').textContent='Pressione uma tecla ou botão de mouse. Esc cancela.';refreshBindings();};row.append(text,button);ui('bindings-list').append(row);}
 function captureBinding(code){const next=rebind(bindings,capture,code);if(!next){ui('controls-message').textContent='Tecla não aceita. Escolha letra, número, seta ou botão de mouse.';return;}bindings=next;capture=null;let saved=true;try{localStorage.setItem(controlsKey,JSON.stringify(bindings));}catch{saved=false;}ui('controls-message').textContent=saved?'Controle salvo. Em caso de conflito, as duas teclas são trocadas.':'Controle alterado nesta sessão; o navegador não permitiu salvar.';refreshBindings();}
 ui('controls-defaults').onclick=()=>{bindings=normalizeBindings(null);capture=null;try{localStorage.removeItem(controlsKey);}catch{}ui('controls-message').textContent='Controles padrão restaurados.';refreshBindings();};
 function press(code,repeat=false){if(ui('controls-dialog').open){if(capture){if(code==='Escape'){capture=null;refreshBindings();}else captureBinding(code);}else if(code==='Escape')closeControls();return;}
  keys.add(code);if(repeat)return;if(code===bindings.controls){controls();return;}if(code===bindings.pause)pause();if(code===bindings.craft)crafting();if(code===bindings.next)between();
 }
 window.addEventListener('keydown',e=>{if(ui('controls-dialog').open){if(capture||e.code==='Escape')e.preventDefault();press(e.code,e.repeat);return;}if(state==='playing'&&Object.values(bindings).includes(e.code)||['controls','pause','craft','next'].some(a=>bindings[a]===e.code))e.preventDefault();press(e.code,e.repeat);});
 window.addEventListener('keyup',e=>keys.delete(e.code));
 window.addEventListener('mousedown',e=>{const code='Mouse'+e.button;if(capture){e.preventDefault();captureBinding(code);return;}if(state==='playing'&&e.target===canvas){if(Object.values(bindings).includes(code))e.preventDefault();press(code);}});
 window.addEventListener('mouseup',e=>keys.delete('Mouse'+e.button));
 ui('controls-dialog').addEventListener('contextmenu',e=>e.preventDefault());
 canvas.addEventListener('contextmenu',e=>{if(Object.values(bindings).includes('Mouse2'))e.preventDefault();});
 window.addEventListener('blur',()=>{keys.clear();if(state==='playing')pause();});
 refreshBindings();
 function move(entity,dx,dy,r){if(!blocked(entity.x+dx,entity.y,r,walls))entity.x+=dx;if(!blocked(entity.x,entity.y+dy,r,walls))entity.y+=dy;}
 function kill(enemy,trap){if(!enemy.alive)return;enemy.alive=false;kills++;loot.push({x:enemy.x,y:enemy.y,resources:lootFor(enemy.kind),collected:false});for(let i=0;i<18;i++)particles.push({x:enemy.x,y:enemy.y,vx:(Math.random()-.5)*150,vy:(Math.random()-.5)*150,life:.8,color:'#e89171'});}
 function lose(message){if(state!=='playing')return;state='lost';overlay('O plano veio tarde.',message,'Ir para o próximo mapa →','A CAÇADA TERMINOU');}
 function activate(trap){
  const caught=playerInDanger(trap,player,true);
  const results=resolveTrap(trap,enemies);
  for(const {enemy,killed,immobilized} of results){if(killed)kill(enemy,trap);else if(immobilized){feedback='Criatura presa por 5 segundos. Prepare a mira!';feedbackTime=3;}else{enemy.reaction=1.5;feedback='A armadilha foi consumida. Essa criatura resistiu.';feedbackTime=3;}}
  if(caught)lose('Sua própria armadilha foi fatal. Contorne os círculos ativos e solte pedras de fora da área de impacto.');
 }
 function update(dt){
  clock+=dt;lures.forEach(l=>l.life-=dt);lures=lures.filter(l=>l.life>0);feedbackTime=Math.max(0,feedbackTime-dt);noise=Math.max(0,noise-dt);let dx=Number(down('right'))-Number(down('left')),dy=Number(down('down'))-Number(down('up'));let moving=dx!==0||dy!==0;
  nearest=traps.filter(t=>!t.used&&distance(player,t)<65).sort((a,b)=>distance(a,player)-distance(b,player))[0];
  const preparing=down('prepare')&&nearest&&!nearest.armed&&distance(player,nearest)>=nearest.r+player.r+2;
  const aiming=down('aim');const aimState=updateAim(aim,aiming,moving||preparing,aimHeld,dt);aim=aimState.progress;
  if(aimState.fire){const spent=spendConsumable(profile,'arrows');if(spent){profile=spent;saveProfile();arrows.push({x:player.x,y:player.y,angle:player.angle,remaining:900});feedback='Flecha disparada. Animais: 1 flecha / 5s. Urso: 2 flechas / 10s após a segunda.';}else feedback=`Sem flechas. Fabrique com presas de cobra (${label('craft')}).`;feedbackTime=3;}aimHeld=aiming;
  if(aiming&&pointer){const camera=cameraFor(player);player.angle=Math.atan2(pointer.y+camera.y-player.y,pointer.x+camera.x-player.x);}
  if(down('flight')&&!flightLatch&&profile.cloak){player.flying=!player.flying;}flightLatch=down('flight');
  const sprint=moving&&!preparing&&down('run')&&!player.exhausted&&player.stamina>0;
  currentSprint=sprint;
  if(sprint){player.stamina=Math.max(0,player.stamina-30*dt);if(player.stamina===0)player.exhausted=true;}else{player.stamina=Math.min(playerStats(profile).stamina,player.stamina+19*dt);if(player.stamina>25)player.exhausted=false;}
  if(moving&&!preparing){let n=Math.hypot(dx,dy);player.angle=Math.atan2(dy,dx);move(player,dx/n*(sprint?SPEED.run:playerStats(profile).walk)*dt,dy/n*(sprint?SPEED.run:playerStats(profile).walk)*dt,11);}
  updateMud(player,mudPools,dt);
  const placementKey=['pit','fire','rock','snare'].find(action=>down(action));
  if(placementKey&&!placementLatch){const type=placementKey;const spent=placeTrap(profile,type,player,walls,traps,enemies,clues);if(spent){profile=spent;saveProfile();feedback=`Armadilha colocada. Segure ${label('prepare')} para preparar.`;}else feedback='Sem armadilha no inventário ou sem espaço livre à frente.';feedbackTime=4;}placementLatch=Boolean(placementKey);
  if(down('lure')&&!lureLatch){const spent=spendConsumable(profile,'lure');if(spent){profile=spent;saveProfile();lures.push({x:player.x,y:player.y,life:6});feedback='Isca colocada. Afaste-se para que os monstros sigam o som.';feedbackTime=4;}else{feedback=`Sem iscas. Fabrique com asas (${label('craft')}).`;feedbackTime=2;}}lureLatch=down('lure');
  if(down('repair')&&!repairLatch){const spent=restoreTrap(profile,traps,player);if(spent){profile=spent;saveProfile();feedback=`Armadilha restaurada. Prepare com ${label('prepare')}.`;feedbackTime=4;}else{feedback='Precisa de um kit e de uma armadilha usada próxima.';feedbackTime=2;}}repairLatch=down('repair');
  if(down('noise')&&!spaceLatch){noise=1.5;enemies.filter(e=>e.alive&&distance(e,player)<230).forEach(e=>{e.chasing=true;e.alert=1;});}spaceLatch=down('noise');
  traps.forEach(t=>{t.flash=Math.max(0,t.flash-dt);if(t===nearest&&preparing){t.progress+=dt;if(t.progress>=1){t.armed=true;t.progress=0;triggerLatch=true;}}else t.progress=0;});
  if(nearest?.armed&&nearest.type==='rock'&&down('prepare')&&!triggerLatch){activate(nearest);triggerLatch=true;}
  if(state!=='playing')return;
  for(const trap of traps){if(playerInDanger(trap,player)){lose('Você entrou em uma armadilha ativa. Prepare de fora do círculo e contorne o perigo.');return;}}
  if(!down('prepare'))triggerLatch=false;
  for(const enemy of enemies){if(!enemy.alive)continue;
   if(tickEnemy(enemy,dt)){kill(enemy);continue;}
   enemy.reaction=Math.max(0,enemy.reaction-dt);
   const senses=perception(enemy,player,walls,sprint,moving&&!preparing);
   updatePursuit(enemy,player,senses);
   const lure=!enemy.chasing&&audibleLure(enemy,lures);
   let target=lure|| (enemy.alert>0?player:{x:enemy.homeX+Math.sin(clock*.45+enemy.phase)*45,y:enemy.homeY+Math.cos(clock*.5+enemy.phase)*26});
   let vx=target.x-enemy.x,vy=target.y-enemy.y,n=Math.hypot(vx,vy);enemy.angle=Math.atan2(vy,vx);
   if(n>3&&enemy.immobilized<=0)move(enemy,vx/n*(enemy.alert>0||lure?SPEED.monster:33)*dt,vy/n*(enemy.alert>0||lure?SPEED.monster:33)*dt,enemy.r);
   for(const trap of traps){if(trap.type!=='rock'&&trapHits(trap,enemy)){activate(trap);break;}}
   if(enemy.alive&&distance(enemy,player)<enemy.r+player.r){lose('Você foi alcançado. Melhore sua caminhada ou reserve fôlego para fugir<br>Planeje a rota e contorne suas armadilhas.');break;}
  }
  if(state==='playing'){arrows=arrows.filter(a=>!advanceArrow(a,dt,enemies,walls));
   const collected=collectLoot(profile,loot,player);if(collected!==profile){profile=collected;saveProfile();}
   for(const message of collectClues(clues,player)){
    const li=document.createElement('li');li.textContent=message;ui('clue-list').append(li);
    ui('clue-empty').hidden=true;ui('clue-count').textContent=`${clues.filter(c=>c.collected).length} / ${ENEMY_TYPES.length}`;
    feedback='Anotação recolhida. Vulnerabilidade registrada no caderno à direita.';feedbackTime=5;
   }
  }
  if(roundComplete(enemies)&&state==='playing'){for(const bag of loot){profile=collectLoot(profile,[bag],bag);}saveProfile();state='won';overlay('Você virou o jogo.',`${enemies.length} predadores eliminados.<br>Recursos restantes recolhidos. Prepare os próximos itens.`,'Ir para o próximo mapa →',`ÁREA SEGURA / ${enemies.length} DE ${enemies.length}`);}
  particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;});particles=particles.filter(p=>p.life>0);
 }
 function text(s,x,y,color='#c6d2bc',size=10){ctx.font=`${size}px monospace`;ctx.fillStyle=color;ctx.textAlign='center';ctx.fillText(s,x,y);}
 function draw(){
  const camera=cameraFor(player);ctx.fillStyle=biome.bg;ctx.fillRect(0,0,1000,620);ctx.save();ctx.translate(-camera.x,-camera.y);ctx.strokeStyle=biome.grid;ctx.lineWidth=.6;
  for(let x=20;x<WORLD.width;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,WORLD.height);ctx.stroke();}for(let y=20;y<WORLD.height;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(WORLD.width,y);ctx.stroke();}
  // Deterministic decorative flecks do not affect collisions.
  for(let i=0;i<500;i++){let x=(i*137+53)%(WORLD.width-20)+10,y=(i*79+21)%(WORLD.height-20)+10;ctx.fillStyle=biome.wall;ctx.globalAlpha=.35;ctx.fillRect(x,y,2,2);}ctx.globalAlpha=1;
  mudPools.forEach(p=>{ctx.fillStyle='#6f5336';ctx.strokeStyle='#aa8450';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(p.x,p.y,p.r,p.r*.83,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#443726';for(let i=0;i<5;i++){ctx.beginPath();ctx.ellipse(p.x+Math.sin(i*7)*25,p.y+Math.cos(i*3)*22,10,5,0,0,Math.PI*2);ctx.fill();}text('LAMA',p.x,p.y+p.r+12,'#d1b78e',10);});
  walls.forEach(w=>{ctx.fillStyle='#0003';ctx.fillRect(w.x+5,w.y+6,w.w,w.h);ctx.fillStyle=biome.wall;ctx.fillRect(w.x,w.y,w.w,w.h);ctx.strokeStyle=biome.accent+'44';ctx.strokeRect(w.x+.5,w.y+.5,w.w-1,w.h-1);for(let i=8;i<w.w;i+=14){ctx.strokeStyle='#ffffff0d';ctx.beginPath();ctx.moveTo(w.x+i,w.y+5);ctx.lineTo(w.x+i,w.y+w.h-5);ctx.stroke();}});
  clues.forEach(c=>{if(c.collected)return;ctx.save();ctx.translate(c.x,c.y);ctx.shadowColor='#e6d69a';ctx.shadowBlur=8+Math.sin(clock*3)*3;ctx.fillStyle='#e6d69a';ctx.fillRect(-8,-10,16,20);ctx.shadowBlur=0;text('?',0,5,'#303225',14);ctx.restore();text('ANOTAÇÃO',c.x,c.y+25,'#d7cf9d',8);});
  loot.filter(l=>!l.collected).forEach(l=>{ctx.fillStyle='#e6d69a';ctx.fillRect(l.x-6,l.y-6,12,12);text('RECURSOS',l.x,l.y+22,'#e6d69a',9);});
  traps.forEach(t=>{
   ctx.save();ctx.translate(t.x,t.y);let color=t.used?'#66725d':t.armed?(t.type==='fire'?'#f1a36a':'#cde58e'):'#8d9d7c';ctx.strokeStyle=color;ctx.lineWidth=1.5;ctx.setLineDash(t.armed?[]:[4,5]);ctx.beginPath();ctx.arc(0,0,t.r,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
   ctx.fillStyle=t.used?'#141a16':t.type==='fire'?(t.armed?'#a8542c':'#555d37'):'#121a16';ctx.beginPath();ctx.ellipse(0,0,19,12,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle=color;
   if(t.type==='pit'){ctx.beginPath();ctx.moveTo(-12,-5);ctx.lineTo(0,9);ctx.lineTo(12,-5);ctx.stroke();}else if(t.type==='fire'){for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(i*9-4,5);ctx.lineTo(i*9,-12-(t.armed?Math.sin(clock*9+i)*4:0));ctx.lineTo(i*9+5,5);ctx.stroke();}}else if(t.type==='snare'){ctx.strokeRect(-15,-10,30,20);ctx.beginPath();ctx.moveTo(-15,-10);ctx.lineTo(15,10);ctx.moveTo(15,-10);ctx.lineTo(-15,10);ctx.stroke();}else{ctx.strokeRect(-10,-13,20,20);ctx.beginPath();ctx.moveTo(-17,-19);ctx.lineTo(17,-19);ctx.moveTo(0,-19);ctx.lineTo(0,-13);ctx.stroke();}
   if(t.progress){ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,31,-Math.PI/2,-Math.PI/2+t.progress*Math.PI*2);ctx.stroke();}
   if(t.flash){ctx.fillStyle=`rgba(230,199,121,${t.flash})`;ctx.beginPath();ctx.arc(0,0,38*(1-t.flash/2),0,Math.PI*2);ctx.fill();}
   text(t.used?'USADA':t.type==='pit'?'BURACO':t.type==='fire'?'FOGO':t.type==='snare'?'IMOBILIZAR':'PEDRA',0,43,color,9);if(t.armed&&!t.used)text(t.type==='rock'?`${label('prepare')} · SOLTAR`:'PRONTA',0,-37,color,8);ctx.restore();
  });
  enemies.forEach(e=>{if(!e.alive)return;ctx.save();ctx.translate(e.x,e.y);ctx.rotate(e.angle);ctx.fillStyle='#ed9c7020';ctx.strokeStyle='#ed9c7044';ctx.beginPath();ctx.moveTo(0,0);
   const range=currentSprint?275:215;
   for(let a=-Math.PI/6;a<=Math.PI/6+.001;a+=Math.PI/120){let r=0;while(r<range){const x=e.x+Math.cos(e.angle+a)*(r+5),y=e.y+Math.sin(e.angle+a)*(r+5);if(walls.some(w=>x>w.x&&x<w.x+w.w&&y>w.y&&y<w.y+w.h))break;r+=5;}ctx.lineTo(Math.cos(a)*Math.min(r,range),Math.sin(a)*Math.min(r,range));}ctx.closePath();ctx.fill();ctx.stroke();ctx.setLineDash([2,7]);ctx.beginPath();ctx.arc(0,0,range/2,0,Math.PI*2);ctx.stroke();ctx.restore();});
  enemies.forEach(e=>{if(!e.alive)return;ctx.save();ctx.translate(e.x,e.y);
   if(e.alert>0)text('!',0,-e.r-14,'#f3aa87',16);
   if(e.immobilized>0){ctx.strokeStyle='#f6dfa0';ctx.lineWidth=3;ctx.strokeRect(-e.r-5,-e.r-5,e.r*2+10,e.r*2+10);text(`PRESO ${e.immobilized.toFixed(1)}s`,0,e.r+25,'#f6dfa0',9);}
   if(e.kind==='bear')text(`FLECHAS ${Math.min(2,e.poisonHits)}/2`,0,-e.r-42,'#d4dcbd',9);
   if(e.poison!==null)text(`VENENO ${e.poison.toFixed(1)}s`,0,-e.r-29,'#a5ec77',9);
   if(e.reaction>0)text('RESISTIU',0,-e.r-42,'#ffd0a1',9);
   ctx.save();ctx.rotate(e.angle);ctx.fillStyle=ENEMY_COLORS[e.kind].fill;ctx.strokeStyle=ENEMY_COLORS[e.kind].fill;ctx.lineWidth=7;
   if(e.kind==='snake'){ctx.beginPath();ctx.moveTo(-16,0);ctx.bezierCurveTo(-8,-13,0,13,12,0);ctx.stroke();}
   else if(e.kind==='bat'){ctx.beginPath();ctx.moveTo(-5,0);ctx.lineTo(-20,-13);ctx.lineTo(-15,7);ctx.lineTo(0,4);ctx.lineTo(15,7);ctx.lineTo(20,-13);ctx.lineTo(5,0);ctx.fill();}
   else if(e.kind==='wolf'){ctx.beginPath();ctx.moveTo(16,0);ctx.lineTo(-10,-13);ctx.lineTo(-5,0);ctx.lineTo(-10,13);ctx.closePath();ctx.fill();}
   else if(e.kind==='bear'){ctx.beginPath();ctx.ellipse(0,0,27,23,0,0,Math.PI*2);ctx.fill();for(const y of [-18,18]){ctx.beginPath();ctx.arc(-12,y,8,0,Math.PI*2);ctx.fill();}ctx.fillStyle='#e4b58e';ctx.beginPath();ctx.ellipse(17,0,9,12,0,0,Math.PI*2);ctx.fill();}
   else{ctx.beginPath();ctx.ellipse(0,0,e.r+2,e.r,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#efdfc4';ctx.fillRect(e.r-2,-e.r+1,8,4);ctx.fillRect(e.r-2,e.r-5,8,4);}
   ctx.fillStyle='#172116';ctx.fillRect(6,-5,3,3);ctx.restore();text(ENEMY_COLORS[e.kind].name.toUpperCase(),0,e.r+13,'#d0d9c4',8);ctx.restore();});
  arrows.forEach(a=>{ctx.strokeStyle='#c2ef83';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(a.x-Math.cos(a.angle)*15,a.y-Math.sin(a.angle)*15);ctx.lineTo(a.x,a.y);ctx.stroke();});
  if(aimHeld){ctx.strokeStyle=aim>=AIM_SECONDS?'#c2ef83':'#e9c994';ctx.setLineDash([5,6]);ctx.beginPath();ctx.moveTo(player.x,player.y);ctx.lineTo(player.x+Math.cos(player.angle)*450,player.y+Math.sin(player.angle)*450);ctx.stroke();ctx.setLineDash([]);text(`MIRA ${Math.round(aim/AIM_SECONDS*100)}%`,player.x,player.y-35,'#e9c994',11);}
  lures.forEach(l=>{ctx.strokeStyle='#9adfe3';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(l.x,l.y,10+(clock*35)%45,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#9adfe3';ctx.fillRect(l.x-5,l.y-5,10,10);text(`ISCA ${Math.ceil(l.life)}s`,l.x,l.y+25,'#9adfe3',9);});
  if(noise>0){ctx.strokeStyle=`rgba(211,236,155,${noise/2})`;ctx.beginPath();ctx.arc(player.x,player.y,30+(1.5-noise)*190,0,Math.PI*2);ctx.stroke();}
  ctx.save();ctx.translate(player.x,player.y);ctx.rotate(player.angle);if(player.flying){ctx.fillStyle='#bd8cf066';ctx.beginPath();ctx.ellipse(-5,0,23,20,0,0,Math.PI*2);ctx.fill();}if(player.mud>0){ctx.strokeStyle='#c49354';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,19,0,Math.PI*2);ctx.stroke();}ctx.shadowColor='#dcf6a0';ctx.shadowBlur=14;ctx.fillStyle='#dcf6a0';ctx.beginPath();ctx.moveTo(16,0);ctx.lineTo(-10,-10);ctx.lineTo(-6,0);ctx.lineTo(-10,10);ctx.closePath();ctx.fill();ctx.restore();
  particles.forEach(p=>{ctx.globalAlpha=p.life;ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,4,4);});ctx.globalAlpha=1;
  ctx.restore();
  // Overview keeps the expanded terrain navigable without shrinking the action.
  ctx.save();ctx.translate(800,12);ctx.fillStyle='#0b130be8';ctx.fillRect(0,0,188,122);const sx=180/WORLD.width,sy=108/WORLD.height;
  ctx.translate(4,4);ctx.fillStyle=biome.wall;walls.forEach(w=>ctx.fillRect(w.x*sx,w.y*sy,w.w*sx,w.h*sy));
  mudPools.forEach(p=>{ctx.fillStyle='#bf965b';ctx.beginPath();ctx.arc(p.x*sx,p.y*sy,4,0,Math.PI*2);ctx.fill();});
  traps.filter(t=>!t.used).forEach(t=>{ctx.fillStyle=t.armed?'#efab74':'#8caa72';ctx.fillRect(t.x*sx-1,t.y*sy-1,3,3);});
  clues.filter(c=>!c.collected).forEach(c=>{ctx.fillStyle='#e6d69a';ctx.fillRect(c.x*sx-1,c.y*sy-1,3,3);});
  enemies.filter(e=>e.alive).forEach(e=>{ctx.fillStyle=ENEMY_COLORS[e.kind].fill;ctx.fillRect(e.x*sx-2,e.y*sy-2,4,4);});
  ctx.strokeStyle='#d2ed9188';ctx.strokeRect(camera.x*sx,camera.y*sy,1000*sx,620*sy);ctx.fillStyle='#dcf6a0';ctx.beginPath();ctx.arc(player.x*sx,player.y*sy,3,0,Math.PI*2);ctx.fill();text('MAPA · 2500 × 1500',90,116,'#b6c6a5',8);ctx.restore();
  ui('kills').textContent=`${kills} / ${enemies.length} ELIMINADOS`;ui('stamina').max=playerStats(profile).stamina;ui('stamina').value=player.stamina;shopView();
  const boss=enemies.find(e=>e.kind==='bear'&&e.alive);ui('combat-hud').textContent=`${player.flying?'VOANDO · imune a buracos':'NO CHÃO'}${player.mud>0?` · LAMA ${Math.ceil(player.mud)}s`:''}${aimHeld?` · MIRA ${Math.round(aim/AIM_SECONDS*100)}%`:''}${boss?boss.poison!==null?` · URSO: veneno ${boss.poison.toFixed(1)}s`:` · URSO ${Math.min(2,boss.poisonHits)}/2 flechas`:''}`;
  const chasing=enemies.some(e=>e.alive&&e.alert>0);ui('status').textContent=state==='paused'?'PAUSADO':chasing?'! EM PERSEGUIÇÃO':'PREPARE O TERRENO';ui('status').style.color=chasing?'#efa47f':'#a1ae97';
  ui('hint').textContent=feedbackTime>0?feedback:nearest?(nearest.armed?(nearest.type==='rock'?`${label('prepare')} · Soltar pedra quando o monstro estiver no círculo.`:'Armadilha pronta. Atraia um monstro até o círculo.'):(distance(player,nearest)<nearest.r+player.r+2?'Afaste-se do círculo para preparar · ':`Segure ${label('prepare')} · `)+(nearest.type==='pit'?'Descobrir buraco':nearest.type==='fire'?'Acender poça':nearest.type==='snare'?'Preparar imobilização':'Preparar pedra')):`${label('craft')} fabricar · ${label('aim')} mirar 2s · ${label('flight')} capa · ${label('snare')} imobilizar · Lama + sair da detecção para despistar.`;
 }
 map();function frame(now){let dt=Math.min((now-last)/1000,.035);last=now;if(state==='playing')update(dt);draw();requestAnimationFrame(frame);}requestAnimationFrame(frame);
}
