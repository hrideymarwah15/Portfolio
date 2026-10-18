import test from 'node:test';
import assert from 'node:assert/strict';
import {chainState,stepChain,chainPose} from '../src/anatomy/chain-model.mjs';
test('a released weighted chain settles with finite motion after a diagonal pull',()=>{
 const s=chainState();s.targetPull=36;s.targetSway=22;
 for(let i=0;i<60;i++)stepChain(s,1/60);
 assert(s.pull>34);assert(s.sway>18);
 s.targetPull=s.targetSway=0;
 let frames=0;while(stepChain(s,1/60)&&frames<1200)frames++;
 assert(frames<1200);assert.equal(s.pull,0);assert(Math.abs(s.sway)<.001);
});
test('links retain their spacing through pull and sway; the handle stays on the end',()=>{
 for(const length of [132,180])for(const pull of [0,18,36])for(const sway of [-22,0,22]){
  const pose=chainPose(length,pull,sway);
  assert(pose.links.length<=34);
  assert.equal(pose.tip.y,length+pull);assert(Math.abs(pose.tip.x-sway)<.00001);
  for(let i=1;i<pose.links.length;i++)assert(Math.abs(Math.hypot(pose.links[i].x-pose.links[i-1].x,pose.links[i].y-pose.links[i-1].y)-7.4)<.02);
 }
});
test('reduced motion resolves directly without oscillation',()=>{
 const s=chainState();s.targetPull=24;s.targetSway=20;
 assert.equal(stepChain(s,1/60,true),false);assert.equal(s.pull,24);assert.equal(s.sway,0);
});

test('a sideways pull bends the chain and turns its final link',()=>{
 const pose=chainPose(180,20,72,7.4,12);
 assert(Math.abs(pose.links[0].angle)>15);
 assert(pose.links.some(p=>p.x>40));
});
