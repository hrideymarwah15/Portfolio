import {writeFileSync,mkdirSync} from 'node:fs';
import * as k from './anatomy/iso-kit.mjs';
import * as A from './anatomy/audit.mjs';
import {staticFor,dynamicFor,pathsFor,projection} from '../src/anatomy/scenes.mjs';
const states=Array.from({length:17},(_,i)=>i/16),figures={};
function shapeOf(p){
 const meta={name:p.name,ground:p.ground};
 if(p.type==='box')return A.slab(p,p.z,p.h,meta,3);
 if(p.type==='cylinder')return A.cylinder(p.x,p.y,p.r,p.z,p.h,meta);
 if(p.type==='disc')return A.disc(p.F,p.s0,p.s1,p.r,meta);
 if(p.type==='prism')return A.prism(p.F,p.poly,p.s0,p.s1,meta);
 return A.extruded(p.poly,p.z,p.h,meta);
}
for(const kind of ['roadmap','medicine','graph','aero','brain']){
 const P=projection(kind),staticParts=staticFor(kind).map(p=>pathsFor(p,P)),orders=[];
 for(const position of states){
  const parts=[...staticParts,...dynamicFor(kind,position).map(p=>pathsFor(p,P))],R=A.recorder(P);
  for(const p of parts){const shape=R.solid(shapeOf(p));R.put({name:p.name,at:p.at,piece:p.dynamic?'moving':'fixed',move:[0,0,0],shapes:[shape],svg:k.solidSvg(p.paths,{tone:'mid'})});}
  A.settle(R,P,{states:[0],step:1});
  orders.push(Object.fromEntries(R.items.map(p=>[p.name,p.key])));
  if(process.argv.includes('--audit')&&[0,.5,1].includes(position)){
   console.log(`${kind} · pose ${position}`);
   // All samples are settled for drawing order. Physical contact checks use the real posed solids.
   A.auditOrExit(R,P,{frames:[0],apart:false});
  }
 }
 const initial=[...staticParts,...dynamicFor(kind,0).map(p=>pathsFor(p,P))];
 figures[kind]={width:600,height:380,parts:initial,solidCount:initial.length,projection:P,orders,states};
 console.log(`${kind}: ${initial.length} solids, ${states.length} posed drawing orders`);
}
mkdirSync('src/data',{recursive:true});writeFileSync('src/data/anatomy-machines.json',JSON.stringify(figures));
