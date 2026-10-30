import {test} from 'node:test';
import assert from 'node:assert/strict';
import {BIOMES,WORLD,distance,cameraFor,blocked,lineClear,generateWalls,generateTraps,
 ENEMY_TYPES,createEnemies,roundComplete,vulnerable,trapHits,resolveTrap,playerInDanger,
 perception,SPEED,generateClues,collectClues,clueText,SHOP,normalizeProfile,buyItem,
 canCraft,playerStats,spendConsumable,restoreTrap,placeTrap,lootFor,collectLoot,
 audibleLure,updateAim,tickEnemy,advanceArrow,AIM_SECONDS,POISON_SECONDS} from './game.js';
const randomSource=(seed=73)=>()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
const fullProfile=()=>normalizeProfile({fangs:30,wings:30,hide:30,bones:30});
const trap=(type='pit')=>({x:500,y:500,r:27,type,armed:true,used:false});
const enemy=(kind='bear',x=500,y=500)=>({...createEnemies(2).find(e=>e.kind===kind),x,y});

test('six biomes and expanded world with clamped camera',()=>{
 assert.equal(new Set(BIOMES.map(b=>b.name)).size,6);assert.ok(WORLD.width*WORLD.height>=6*620000);
 assert.deepEqual(cameraFor({x:0,y:0}),{x:0,y:0});assert.deepEqual(cameraFor({x:2500,y:1500}),{x:1500,y:880});
});
test('movement collision respects world boundaries and obstacles',()=>{
 const walls=[{x:100,y:100,w:50,h:50}];assert.equal(blocked(90,120,11,walls),true);assert.equal(blocked(80,120,11,walls),false);
 assert.equal(blocked(2495,800,11,[]),true);assert.equal(blocked(1200,800,11,[]),false);
});
test('obstacles block sight while clear routes stay visible',()=>{
 const walls=[{x:100,y:100,w:50,h:50}];assert.equal(lineClear({x:50,y:120},{x:200,y:120},walls),false);assert.equal(lineClear({x:50,y:180},{x:200,y:180},walls),true);
});
test('odd rounds have eight common animals and even rounds exactly one additional bear',()=>{
 for(let round=1;round<=30;round++){
  const enemies=createEnemies(round);assert.equal(enemies.length,round%2===0?9:8);assert.equal(enemies.filter(e=>e.kind==='bear').length,round%2===0?1:0);
  for(const kind of ENEMY_TYPES)assert.equal(enemies.filter(e=>e.kind===kind).length,2);
  assert.equal(new Set(enemies.map(e=>`${e.x},${e.y}`)).size,enemies.length);
 }
});
test('round does not complete until bear and all ordinary animals die',()=>{
 const enemies=createEnemies(2);enemies.filter(e=>e.kind!=='bear').forEach(e=>e.alive=false);assert.equal(roundComplete(enemies),false);
 enemies.find(e=>e.kind==='bear').alive=false;assert.equal(roundComplete(enemies),true);assert.equal(roundComplete([]),false);
});
test('each common species has one natural weakness and bear resists all natural traps',()=>{
 for(const kind of ENEMY_TYPES)assert.equal(['pit','fire','rock'].filter(type=>vulnerable({kind},{type})).length,1);
 for(const type of ['pit','fire','rock'])assert.equal(vulnerable({kind:'bear'},{type}),false);
 assert.equal(vulnerable({kind:'bat'},{type:'pit'}),false);
});
test('natural traps must be armed, unused and overlap their target',()=>{
 const t=trap(),e=enemy('snake');assert.equal(trapHits(t,e),true);assert.equal(trapHits(t,{...e,x:560}),false);
 t.armed=false;assert.equal(trapHits(t,e),false);t.armed=true;t.used=true;assert.equal(trapHits(t,e),false);
});
test('wrong trap is consumed, survivor stays alive and trap cannot hit again',()=>{
 const t=trap('fire'),e=enemy('snake');assert.deepEqual(resolveTrap(t,[e]),[{enemy:e,killed:false}]);assert.equal(t.used,true);assert.equal(e.alive,true);assert.deepEqual(resolveTrap(t,[enemy('wolf')]),[]);
});
test('bear is not killed by fire, pit or dropped rock',()=>{
 for(const type of ['pit','fire','rock']){const e=enemy();const result=resolveTrap(trap(type),[e]);assert.equal(result[0].killed,false);assert.equal(e.alive,true);assert.equal(e.poison,null);}
});
test('empty rock is wasted but empty automatic trap remains ready',()=>{
 for(const type of ['pit','fire','rock']){const t=trap(type);resolveTrap(t,[]);assert.equal(t.used,type==='rock');}
});
test('snare immobilizes bear for five seconds without damage or resetting poison',()=>{
 const t=trap('snare'),e=enemy();e.poison=8;const result=resolveTrap(t,[e]);assert.equal(result[0].immobilized,true);assert.equal(result[0].killed,false);assert.equal(e.immobilized,5);assert.equal(e.poison,8);
 assert.equal(tickEnemy(e,2),false);assert.equal(e.immobilized,3);assert.equal(tickEnemy(e,3),false);assert.equal(e.immobilized,0);assert.equal(e.poison,3);
});
test('cloak flight protects only from pits; fire and falling stones remain lethal',()=>{
 const p={x:500,y:500,r:11,flying:false};assert.equal(playerInDanger(trap(),p),true);p.flying=true;
 assert.equal(playerInDanger(trap(),p),false);assert.equal(playerInDanger(trap('fire'),p),true);
 assert.equal(playerInDanger(trap('rock'),p),false);assert.equal(playerInDanger(trap('rock'),p,true),true);
 assert.equal(playerInDanger(trap('snare'),p),false);assert.equal(playerInDanger(trap('fire'),{...p,x:600}),false);
});
test('hearing uses reduced circular range, requires motion and crosses obstacles',()=>{
 const e={x:300,y:300,angle:0};assert.equal(perception(e,{x:200,y:300},[]).hears,true);assert.equal(perception(e,{x:190,y:300},[]).hears,false);
 assert.equal(perception(e,{x:165,y:300},[],true).hears,true);assert.equal(perception(e,{x:160,y:300},[],true).hears,false);
 assert.equal(perception(e,{x:200,y:300},[],false,false).hears,false);assert.equal(perception(e,{x:200,y:300},[{x:240,y:280,w:10,h:40}]).hears,true);
});
test('vision keeps sixty degree cone, old range and obstacle occlusion',()=>{
 const e={x:300,y:300,angle:0};assert.equal(perception(e,{x:510,y:300},[]).sees,true);assert.equal(perception(e,{x:520,y:300},[]).sees,false);
 assert.equal(perception(e,{x:570,y:300},[],true).sees,true);assert.equal(perception(e,{x:100,y:300},[]).sees,false);
 assert.equal(perception(e,{x:400,y:400},[]).sees,false);assert.equal(perception(e,{x:400,y:340},[]).sees,true);
 assert.equal(perception(e,{x:510,y:300},[{x:380,y:280,w:20,h:40}]).sees,false);
});
test('random maps accommodate all nine spawns and twelve natural traps',()=>{
 const random=randomSource();for(let i=0;i<150;i++){
  const player={x:1250,y:1350},enemies=createEnemies(i+1),walls=generateWalls([player,...enemies],random),traps=generateTraps(walls,player,enemies,random);
  assert.equal(walls.length,28);assert.equal(traps.length,12);
  for(const p of [player,...enemies])assert.equal(blocked(p.x,p.y,150,walls),false);
  for(const type of ['pit','fire','rock'])assert.equal(traps.filter(t=>t.type===type).length,4);
  for(const t of traps){assert.equal(blocked(t.x,t.y,65,walls),false);assert.ok(enemies.every(e=>distance(e,t)>85));assert.ok(traps.every(o=>o===t||distance(t,o)>125));}
 }
});
test('notes cover each species and collect once without exposing uncollected notes',()=>{
 const notes=generateClues([],[],randomSource());assert.deepEqual(notes.map(n=>n.kind),ENEMY_TYPES);
 for(const kind of ENEMY_TYPES)assert.ok(clueText(kind));assert.match(clueText('bear'),/10 segundos/);
 assert.deepEqual(collectClues(notes,{x:0,y:0}),[]);assert.deepEqual(collectClues(notes,notes[0]),[clueText(notes[0].kind)]);
 assert.deepEqual(collectClues(notes,notes[0]),[]);assert.equal(notes[1].collected,false);
});
test('legacy saves preserve upgrades and supplies, discard coins and add empty resource inventory',()=>{
 const p=normalizeProfile({coins:900,walk:2,stamina:1,repair:2,pit:1});assert.equal(p.walk,2);assert.equal(p.stamina,1);assert.equal(p.repair,2);assert.equal(p.pit,1);assert.equal(p.coins,undefined);
 assert.equal(p.round,1);assert.equal(p.fangs,0);assert.equal(p.arrows,0);assert.equal(p.cloak,0);
});
test('save normalization clamps malformed counts and preserves round and crafting data',()=>{
 const p=normalizeProfile({round:0,walk:99,stamina:99,wings:'2',bones:Infinity,hide:-1,snare:999});assert.equal(p.round,1);assert.equal(p.walk,3);assert.equal(p.stamina,3);assert.equal(p.wings,0);assert.equal(p.bones,0);assert.equal(p.hide,0);assert.equal(p.snare,6);
 const valid=normalizeProfile({round:4,arrows:3,cloak:1,hide:2});assert.deepEqual(normalizeProfile(JSON.parse(JSON.stringify(valid))),valid);
});
test('resources drop by species, never coins, and collection is proximity based and single-use',()=>{
 for(const kind of [...ENEMY_TYPES,'bear'])assert.equal(lootFor(kind).coins,undefined);
 assert.deepEqual(lootFor('snake'),{fangs:2});assert.deepEqual(lootFor('bat'),{wings:2});assert.deepEqual(lootFor('wolf'),{hide:2});assert.deepEqual(lootFor('boar'),{bones:2});
 const p=normalizeProfile(null),bags=[{x:100,y:100,resources:lootFor('snake'),collected:false}];assert.equal(collectLoot(p,bags,{x:0,y:0}),p);
 const next=collectLoot(p,bags,{x:100,y:100});assert.equal(next.fangs,2);assert.equal(collectLoot(next,bags,{x:100,y:100}),next);
});
test('core recipes debit exact resources atomically and honor caps',()=>{
 const p=fullProfile();for(const item of Object.keys(SHOP)){assert.equal(canCraft(p,item),true);const next=buyItem(p,item);assert.equal(next[item],SHOP[item].amount??1);
  for(const [key,n] of Object.entries(SHOP[item].cost))assert.equal(next[key],p[key]-n);
 }
 const arrows=buyItem(normalizeProfile({fangs:1}),'arrows');assert.equal(arrows.arrows,3);assert.equal(arrows.fangs,0);
 assert.equal(buyItem(normalizeProfile(null),'arrows'),null);assert.equal(buyItem(p,'unknown'),null);
 assert.equal(buyItem({...p,arrows:98},'arrows'),null);assert.equal(buyItem({...p,cloak:1},'cloak'),null);
 const insufficient=normalizeProfile({hide:1});assert.equal(buyItem(insufficient,'snare'),null);assert.equal(insufficient.hide,1);
});
test('cloak needs two wings, snare needs both wolf hide and boar bones',()=>{
 assert.equal(buyItem(normalizeProfile({wings:1}),'cloak'),null);assert.equal(buyItem(normalizeProfile({wings:2}),'cloak').cloak,1);
 assert.equal(buyItem(normalizeProfile({hide:1}),'snare'),null);const snare=buyItem(normalizeProfile({hide:1,bones:1}),'snare');assert.equal(snare.hide,0);assert.equal(snare.bones,0);assert.equal(snare.snare,1);
});
test('walking maximum outruns monsters and stamina upgrades survive economy change',()=>{
 const p=normalizeProfile({walk:3,stamina:3});assert.equal(playerStats(p).stamina,160);assert.equal(playerStats(p).walk,179);
 assert.ok(SPEED.walk<SPEED.monster&&SPEED.monster<SPEED.run);assert.ok(playerStats(p).walk>SPEED.monster);
});
test('portable and immobilizing traps spend only when placement is valid',()=>{
 const player={x:1000,y:1000,angle:0};for(const type of ['pit','fire','rock','snare']){
  const p=normalizeProfile({[type]:1}),traps=[];const next=placeTrap(p,type,player,[],traps);assert.equal(next[type],0);assert.equal(traps[0].armed,false);
  assert.equal(placeTrap(p,type,player,[],traps),null);assert.equal(p[type],1);
  assert.equal(placeTrap(p,type,player,[{x:1050,y:950,w:100,h:100}],[]),null);
 }
 assert.equal(placeTrap(normalizeProfile({snare:1}),'snare',{x:20,y:20,angle:Math.PI},[],[]),null);
});
test('repair restores used trap unarmed and failed repair never spends kits',()=>{
 const p=normalizeProfile({repair:2}),t={...trap(),used:true};assert.equal(restoreTrap(p,[t],{x:900,y:500}),null);assert.equal(p.repair,2);
 const next=restoreTrap(p,[t],{x:550,y:500});assert.equal(next.repair,1);assert.equal(t.used,false);assert.equal(t.armed,false);assert.equal(restoreTrap(next,[t],{x:550,y:500}),null);
});
test('lures have long range and expire, permanent upgrades cannot be consumed',()=>{
 const lure={x:100,y:0,life:6};assert.equal(audibleLure({x:950,y:0},[lure]),lure);assert.equal(audibleLure({x:1001,y:0},[lure]),undefined);assert.equal(audibleLure({x:100,y:0},[{...lure,life:0}]),undefined);
 assert.equal(spendConsumable(normalizeProfile({cloak:1}),'cloak'),null);
});
test('aim needs full two seconds stationary, early release or movement cancels shot',()=>{
 assert.equal(AIM_SECONDS,2);let result=updateAim(0,true,false,false,1);assert.equal(result.progress,1);
 assert.equal(updateAim(result.progress,false,false,true,0.02).fire,false);
 result=updateAim(result.progress,true,false,true,1);assert.equal(result.progress,2);
 assert.equal(updateAim(result.progress,false,false,true,.02).fire,true);assert.equal(updateAim(2,false,false,false,.02).fire,false);
 assert.equal(updateAim(2,true,true,true,.02).progress,0);assert.equal(updateAim(2,false,true,true,.02).fire,false);
});
test('bear survives one arrow and ten-second poison starts only on the second hit',()=>{
 const bear=enemy('bear',600,500),arrow={x:500,y:500,angle:0,remaining:900};assert.equal(advanceArrow(arrow,.2,[bear],[]),true);assert.equal(bear.poison,null);assert.equal(bear.poisonHits,1);assert.equal(tickEnemy(bear,20),false);advanceArrow({x:500,y:500,angle:0,remaining:900},.2,[bear],[]);assert.equal(bear.poisonHits,2);assert.equal(bear.poison,10);assert.equal(bear.alive,true);
 assert.equal(tickEnemy(bear,9.99),false);assert.ok(bear.poison>0);assert.equal(tickEnemy(bear,.01),true);assert.equal(bear.poison,0);
});
test('arrows collide with obstacles, misses expire and repeated poison hits do not reset timer',()=>{
 const bear=enemy('bear',650,500);assert.equal(advanceArrow({x:500,y:500,angle:0,remaining:900},.3,[bear],[{x:550,y:450,w:40,h:100}]),true);assert.equal(bear.poison,null);
 assert.equal(advanceArrow({x:500,y:500,angle:0,remaining:50},.2,[],[]),true);
 bear.poison=4;advanceArrow({x:600,y:500,angle:0,remaining:900},.2,[bear],[]);assert.equal(bear.poison,4);
});
test('resource crafting, five-second snare, charged shot and delayed boss death work together',()=>{
 let profile=normalizeProfile(null);for(const kind of ['snake','wolf','boar']){const bag={x:500,y:500,resources:lootFor(kind),collected:false};profile=collectLoot(profile,[bag],bag);}
 profile=buyItem(profile,'arrows');profile=buyItem(profile,'snare');assert.ok(profile.arrows>0&&profile.snare>0);
 const bear=enemy(),snare=trap('snare');resolveTrap(snare,[bear]);assert.equal(bear.immobilized,5);
 const charged=updateAim(0,true,false,false,2);tickEnemy(bear,2);assert.equal(bear.immobilized,3);assert.equal(updateAim(charged.progress,false,false,true,.01).fire,true);
 profile=spendConsumable(profile,'arrows');assert.equal(profile.arrows,2);
 advanceArrow({x:400,y:500,angle:0,remaining:900},.2,[bear],[]);assert.equal(bear.poison,null);advanceArrow({x:400,y:500,angle:0,remaining:900},.2,[bear],[]);assert.equal(bear.poison,10);
 for(let i=0;i<99;i++)assert.equal(tickEnemy(bear,.1),false);assert.equal(tickEnemy(bear,.1),true);
});

import {ACTIONS,DEFAULT_BINDINGS,normalizeBindings,rebind,validBinding,keyName,generateMud,updateMud,updatePursuit,MUD_SECONDS,applyPoison,iconSVG} from './game.js';
test('normal animals die from one arrow after five seconds, extra hits do not reset timer',()=>{
 for(const kind of ENEMY_TYPES){const e=enemy(kind);advanceArrow({x:400,y:500,angle:0,remaining:900},.2,[e],[]);assert.equal(e.poison,5);assert.equal(tickEnemy(e,4.99),false);applyPoison(e);assert.ok(e.poison<.02);assert.equal(tickEnemy(e,.01),true);}
});
test('key bindings cover every action, migrate safely and reject unsupported keys',()=>{
 const defaults=normalizeBindings(null);assert.deepEqual(defaults,DEFAULT_BINDINGS);assert.deepEqual(Object.keys(defaults),Object.keys(ACTIONS));assert.equal(new Set(Object.values(defaults)).size,Object.keys(ACTIONS).length);
 assert.equal(validBinding('Mouse2'),true);assert.equal(validBinding('ArrowLeft'),true);assert.equal(validBinding('Escape'),false);assert.equal(validBinding('<script>'),false);
 const dirty=normalizeBindings({up:'KeyX',down:'KeyX',prepare:'invalid'});assert.equal(new Set(Object.values(dirty)).size,Object.keys(ACTIONS).length);assert.equal(dirty.prepare,'KeyE');
});
test('binding conflicts swap actions, persist on normalization and do not modify originals',()=>{
 const original=normalizeBindings(null),changed=rebind(original,'up','KeyS');assert.equal(changed.up,'KeyS');assert.equal(changed.down,'KeyW');assert.equal(original.up,'KeyW');
 const mouse=rebind(changed,'aim','Mouse2');assert.equal(mouse.aim,'Mouse2');assert.deepEqual(normalizeBindings(JSON.parse(JSON.stringify(mouse))),mouse);
 assert.equal(rebind(original,'unknown','KeyX'),null);assert.equal(rebind(original,'aim','Escape'),null);assert.equal(keyName('KeyG'),'G');assert.equal(keyName('Mouse2'),'Mouse dir.');
});
test('pursuit never expires on distance alone and mud only hides an undetected player',()=>{
 const e=enemy('wolf'),p={mud:0};updatePursuit(e,p,{sees:true,hears:false});assert.equal(e.chasing,true);
 for(let i=0;i<1000;i++)updatePursuit(e,p,{sees:false,hears:false});assert.equal(e.chasing,true);
 p.mud=12;updatePursuit(e,p,{sees:true,hears:false});assert.equal(e.chasing,true);updatePursuit(e,p,{sees:false,hears:true});assert.equal(e.chasing,true);
 e.x=900;e.y=800;updatePursuit(e,p,{sees:false,hears:false});assert.equal(e.chasing,false);assert.equal(e.alert,0);assert.equal(e.homeX,900);assert.equal(e.homeY,800);
 p.mud=0;updatePursuit(e,p,{sees:false,hears:false});assert.equal(e.chasing,false);updatePursuit(e,p,{sees:true,hears:false});assert.equal(e.chasing,true);
});
test('mud status is temporary, pools reusable and flying does not coat player',()=>{
 const pool={x:500,y:500,r:50},p={x:500,y:500,flying:false,mud:0};updateMud(p,[pool],.1);assert.equal(p.mud,MUD_SECONDS);
 p.x=800;updateMud(p,[pool],5);assert.equal(p.mud,7);updateMud(p,[pool],7);assert.equal(p.mud,0);
 p.x=500;updateMud(p,[pool],.1);assert.equal(p.mud,12);assert.deepEqual(pool,{x:500,y:500,r:50});
 p.flying=true;p.mud=0;updateMud(p,[pool],.1);assert.equal(p.mud,0);
});
test('eight reusable mud pools spawn without covering obstacles or trap and clue areas',()=>{
 const random=randomSource(986);for(let i=0;i<50;i++){const player={x:1250,y:1350},enemies=createEnemies(i+1),walls=generateWalls([player,...enemies],random),traps=generateTraps(walls,player,enemies,random),clues=generateClues(walls,traps,random),pools=generateMud(walls,traps,clues,[player,...enemies],random);assert.equal(pools.length,8);for(const p of pools){assert.equal(blocked(p.x,p.y,75,walls),false);assert.ok(traps.every(t=>distance(t,p)>t.r+p.r+35));assert.ok(clues.every(c=>distance(c,p)>p.r+30));}}
});
test('all resources and craft recipes have self-contained accessible decorative SVG icons',()=>{
 for(const kind of ['fangs','wings','hide','bones',...Object.keys(SHOP)]){const svg=iconSVG(kind);assert.match(svg,/<svg/);assert.match(svg,/aria-hidden="true"/);assert.match(svg,/<path/);assert.ok(!svg.includes('http'));}
});
