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
