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
