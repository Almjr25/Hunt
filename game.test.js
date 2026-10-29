import {test} from 'node:test';
import assert from 'node:assert/strict';
import {BIOMES,trapHits,blocked,lineClear} from './game.js';
test('six distinct biomes',()=>assert.equal(new Set(BIOMES.map(b=>b.name)).size,6));
test('traps kill only when armed, unused and in range',()=>{
 const trap={x:100,y:100,r:27,armed:false,used:false};
 assert.equal(trapHits(trap,{x:100,y:100}),false);
 trap.armed=true;assert.equal(trapHits(trap,{x:120,y:100}),true);
 assert.equal(trapHits(trap,{x:150,y:100}),false);
 trap.used=true;assert.equal(trapHits(trap,{x:100,y:100}),false);
});
test('obstacles and map bounds block movement',()=>{
 const walls=[{x:100,y:100,w:50,h:50}];
 assert.equal(blocked(90,120,11,walls),true);
 assert.equal(blocked(80,120,11,walls),false);
 assert.equal(blocked(5,200,11,walls),true);
});
test('obstacles block enemy sight without blocking clear routes',()=>{
 const walls=[{x:100,y:100,w:50,h:50}];
 assert.equal(lineClear({x:50,y:120},{x:200,y:120},walls),false);
 assert.equal(lineClear({x:50,y:180},{x:200,y:180},walls),true);
});

import {ENEMY_TYPES, vulnerable, resolveTrap, playerInDanger, perception, SPEED} from './game.js';
test('each creature has exactly one effective trap, and each trap has a matching creature',()=>{
 for(const kind of ENEMY_TYPES)assert.equal(['pit','fire','rock'].filter(type=>vulnerable({kind},{type})).length,1);
 for(const type of ['pit','fire','rock'])assert.equal(ENEMY_TYPES.filter(kind=>vulnerable({kind},{type})).length,1);
});
test('wrong trap is consumed and resistant enemy survives; spent trap cannot kill again',()=>{
 const trap={x:100,y:100,r:27,type:'fire',armed:true,used:false};
 const enemy={x:100,y:100,alive:true,kind:'stria'};
 assert.deepEqual(resolveTrap(trap,[enemy]),[{enemy,killed:false}]);
 assert.equal(trap.used,true);assert.equal(trap.armed,false);assert.equal(enemy.alive,true);
 assert.deepEqual(resolveTrap(trap,[{...enemy,kind:'cross'}]),[]);
});
test('matching trap hits all occupants before consumption, including mixed resistance',()=>{
 const trap={x:100,y:100,r:27,type:'pit',armed:true,used:false};
 const results=resolveTrap(trap,[{x:100,y:100,alive:true,kind:'stria'},{x:105,y:100,alive:true,kind:'cross'},{x:200,y:100,alive:true,kind:'stria'}]);
 assert.deepEqual(results.map(r=>r.killed),[true,false]);assert.equal(trap.used,true);
});
test('empty rock drop consumes the rock; empty automatic traps remain armed',()=>{
 for(const type of ['pit','fire','rock']){const trap={type,armed:true,used:false};resolveTrap(trap,[]);assert.equal(trap.used,type==='rock');}
});
test('active pits and fire kill player; rocks only kill during drop',()=>{
 const player={x:100,y:100,r:11};
 for(const type of ['pit','fire','rock']){
  const trap={x:100,y:100,r:27,type,armed:true,used:false};
  assert.equal(playerInDanger(trap,player),type!=='rock');
  assert.equal(playerInDanger(trap,player,true),true);
  assert.equal(playerInDanger(trap,{...player,x:145},true),false);
  trap.used=true;assert.equal(playerInDanger(trap,player,true),false);
 }
});
test('hearing is omnidirectional, half old range and requires movement',()=>{
 const e={x:300,y:300,angle:0};
 assert.equal(perception(e,{x:200,y:300},[]).hears,true);
 assert.equal(perception(e,{x:190,y:300},[]).hears,false);
 assert.equal(perception(e,{x:165,y:300},[],true).hears,true);
 assert.equal(perception(e,{x:160,y:300},[],true).hears,false);
 assert.equal(perception(e,{x:200,y:300},[],false,false).hears,false);
 assert.equal(perception(e,{x:200,y:300},[{x:240,y:280,w:10,h:40}]).hears,true);
});
test('vision preserves old reach in forward 60 degree cone and respects walls',()=>{
 const e={x:300,y:300,angle:0};
 assert.equal(perception(e,{x:510,y:300},[],false,false).sees,true);
 assert.equal(perception(e,{x:520,y:300},[]).sees,false);
 assert.equal(perception(e,{x:570,y:300},[],true).sees,true);
 assert.equal(perception(e,{x:580,y:300},[],true).sees,false);
 assert.equal(perception(e,{x:100,y:300},[]).sees,false);
 assert.equal(perception(e,{x:400,y:400},[]).sees,false);
 assert.equal(perception(e,{x:400,y:340},[]).sees,true);
 assert.equal(perception(e,{x:510,y:300},[{x:380,y:280,w:20,h:40}]).sees,false);
});
test('pursuit outruns walking but is slower than sprinting',()=>{assert.ok(SPEED.walk<SPEED.monster);assert.ok(SPEED.monster<SPEED.run);});

import {generateClues, collectClues, clueText, distance} from './game.js';
test('clues describe actual weaknesses consistently for each creature mark',()=>{
 assert.match(clueText('stria'),/traço.*buracos/);
 assert.match(clueText('dot'),/círculo.*pedra/);
 assert.match(clueText('cross'),/cruz.*fogo/);
});
test('clues spawn throughout the map, including monster territory, outside obstacles and traps',()=>{
 let seed=73;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const walls=[{x:290,y:160,w:65,h:100},{x:640,y:160,w:65,h:100}];
 const traps=[{x:190,y:290,r:27},{x:500,y:245,r:27}];
 let nearEnemy=false,bottom=false;
 for(let i=0;i<200;i++){
  const clues=generateClues(walls,traps,random);
  assert.deepEqual(clues.map(c=>c.kind),ENEMY_TYPES);
  for(const c of clues){assert.equal(blocked(c.x,c.y,22,walls),false);assert.ok(traps.every(t=>distance(c,t)>t.r+30));if(distance(c,{x:500,y:80})<80)nearEnemy=true;if(c.y>500)bottom=true;}
 }
 assert.ok(nearEnemy);assert.ok(bottom);
});
test('collecting notes reveals only nearby notes once, and a new map resets them',()=>{
 const clues=generateClues([],[],()=>0.5);
 assert.deepEqual(collectClues(clues,{x:0,y:0}),[]);
 assert.deepEqual(collectClues(clues,clues[0]),[clueText(clues[0].kind)]);
 assert.equal(clues[0].collected,true);assert.equal(clues[1].collected,false);
 assert.deepEqual(collectClues(clues,clues[0]),[]);
 assert.ok(generateClues([],[],()=>0.5).every(c=>!c.collected));
});

import {SHOP, normalizeProfile, buyItem, playerStats, spendConsumable, rewardKill, audibleLure, restoreTrap} from './game.js';
test('purchases debit coins, respect limits and reject insufficient funds and unknown items',()=>{
 const base=normalizeProfile({coins:500});const bought=buyItem(base,'stamina');
 assert.equal(bought.coins,425);assert.equal(bought.stamina,1);assert.equal(base.coins,500);
 assert.equal(buyItem(normalizeProfile(null),'lure'),null);
 assert.equal(buyItem({...base,lure:3},'lure'),null);
 assert.equal(buyItem(base,'unknown'),null);
 for(const key of Object.keys(SHOP))assert.equal(buyItem({...base,[key]:3},key),null);
});
test('upgrade caps preserve sprint requirement, increase maximum stamina and normalize invalid saves',()=>{
 const p=normalizeProfile({coins:-1,walk:99,stamina:99,lure:'3',repair:Infinity});
 assert.deepEqual(p,{coins:0,walk:3,stamina:3,lure:0,repair:0});
 assert.equal(playerStats(p).stamina,160);assert.ok(playerStats(p).walk<SPEED.monster);
 assert.deepEqual(normalizeProfile(null),{coins:0,stamina:0,walk:0,lure:0,repair:0});
});
test('each kill rewards fifty coins and consumables spend once without altering upgrades',()=>{
 let p=normalizeProfile({stamina:2,lure:1});p=rewardKill(p);assert.equal(p.coins,50);
 p=spendConsumable(p,'lure');assert.equal(p.lure,0);assert.equal(p.stamina,2);
 assert.equal(spendConsumable(p,'lure'),null);assert.equal(spendConsumable(p,'stamina'),null);
 assert.deepEqual(normalizeProfile(JSON.parse(JSON.stringify(p))),p);
});
test('active sound lure attracts only nearby enemies and ceases on expiration',()=>{
 const e={x:0,y:0},lure={x:100,y:0,life:6};
 assert.equal(audibleLure(e,[lure]),lure);
 assert.equal(audibleLure({x:400,y:0},[lure]),undefined);
 assert.equal(audibleLure(e,[{...lure,life:0}]),undefined);
});
test('repair restores a used nearby trap unarmed, spends one kit, and failed use spends nothing',()=>{
 const p=normalizeProfile({repair:2}),trap={x:100,y:100,used:true,armed:false,progress:1,flash:1};
 assert.equal(restoreTrap(p,[trap],{x:300,y:100}),null);assert.equal(p.repair,2);assert.equal(trap.used,true);
 const result=restoreTrap(p,[trap],{x:150,y:100});assert.equal(result.repair,1);
 assert.equal(trap.used,false);assert.equal(trap.armed,false);assert.equal(trap.progress,0);
 assert.equal(restoreTrap(result,[trap],{x:150,y:100}),null);
 trap.used=true;assert.equal(restoreTrap({...p,repair:0},[trap],{x:150,y:100}),null);assert.equal(trap.used,true);
});
