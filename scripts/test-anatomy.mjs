import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {targetAt,phaseAt,follow,followCircular,advanceTour} from '../src/anatomy/model.mjs';
const figures=JSON.parse(readFileSync(new URL('../src/data/anatomy-machines.json',import.meta.url)));

test('all demo cycles stay bounded and close continuously',()=>{
 for(const kind of Object.keys(figures)){
  for(let i=0;i<=2400;i++){
   const pose=targetAt(kind,i/100);
   assert(Number.isFinite(pose.position));assert(pose.position>=0&&pose.position<=1);
  }
  const difference=Math.abs(targetAt(kind,11.99999).position-targetAt(kind,12).position);assert((['agency','brain'].includes(kind)?Math.min(difference,1-difference):difference)<.00001);
 }
});
test('delivery pauses at the blocked route before taking the bypass',()=>{
 const first=targetAt('graph',3.2),last=targetAt('graph',4.2);
 assert.equal(first.position,last.position);assert(first.paused&&last.paused);
 assert.equal(phaseAt('graph',first.position,first).label,'Route blocked');
 assert(targetAt('graph',6).position>first.position);
});
test('phase indicators and explanatory words follow the visible carrier position',()=>{
 for(const kind of ['aero']){
  assert.equal(phaseAt(kind,0).station,0);
  assert.equal(phaseAt(kind,.5).station,1);
  assert.equal(phaseAt(kind,1).station,2);
 }
 assert.equal(phaseAt('aero',.5).label,'Approval gate');
});
test('follow converges without overshoot even after a delayed frame',()=>{
 let p=0;for(let i=0;i<240;i++){p=follow(p,1,i===2?3:1/60);assert(p>=0&&p<=1);}
 assert(p>.999);
});
test('every figure is a detailed solid mechanism, with finite geometry and motion keys',()=>{
 for(const figure of Object.values(figures)){
  assert(figure.solidCount>=40&&figure.solidCount<=80);
  assert.equal(new Set(figure.parts.map(p=>p.name)).size,figure.parts.length);
  for(const part of figure.parts){
   assert(Number.isFinite(part.key));
   for(const path of Object.values(part.paths).flat()){
    if(typeof path==='string')assert(!/NaN|Infinity/.test(path));
   }
  }
 }
});

test('validation waits indefinitely for approval, then continues from the same station',()=>{
 const s={clock:0,approved:false};
 for(let i=0;i<1200;i++)advanceTour(s,'aero',1/60);
 assert.equal(s.clock,3.9);assert.equal(s.target,.5);assert(s.waiting);
 s.approved=true;s.clock=4.9;
 for(let i=0;i<90;i++)advanceTour(s,'aero',1/60);
 assert(!s.waiting);assert(s.target>.5);
});

test('circular dispatch crosses its seam without reversing across the whole table',()=>{
 const p=followCircular(.99,.01,1/60);assert(p>.99||p<.01);
});
test('the figures have different silhouettes and movement primitives',()=>{
 assert(figures.roadmap.parts.some(p=>p.name==='learning.path'));
 assert(figures.medicine.parts.some(p=>p.name==='scan.bridge'));
 assert(figures.brain.parts.some(p=>p.name==='shared.memory'));
 assert(figures.graph.parts.some(p=>p.name==='road.-1'));
 assert(figures.graph.parts.some(p=>p.name.startsWith('truck.wheel')));
 assert(figures.aero.parts.some(p=>p.name==='lid.glass'));
 for(const figure of Object.values(figures))assert(!figure.parts.some(p=>p.name.startsWith('rail.')));
});


test('automatic Aero demonstrations keep cycling without an unattended approval stop',()=>{
 const s={clock:0,approved:false};let passed=false;
 for(let i=0;i<1500;i++){advanceTour(s,'aero',1/60,{automatic:true});assert(!s.waiting);if(s.target>.9)passed=true;}
 assert(passed);assert(s.clock<12);
});
test('completed work and active research have the requested destinations and five distinct figures',async()=>{
 const {completedProjects,activeProjects}=await import('../src/projects.mjs');
 assert.deepEqual(completedProjects.map(p=>p.name),['RoleReady AI','Aushadhi OCR','Supply Chain Simulator']);
 assert.deepEqual(activeProjects.map(p=>p.name),['AeroHarness','Brain Architecture']);
 assert.equal(completedProjects[2].url,'https://github.com/sharmaaaditi/sc-disruption');
 const all=[...completedProjects,...activeProjects];assert.equal(new Set(all.map(p=>p.kind)).size,5);
 for(const p of all)assert(figures[p.kind]);
});
