import * as k from '../../scripts/anatomy/iso-kit.mjs';
import * as G from '../../scripts/anatomy/lathe.mjs';
const TAU=Math.PI*2;
export const view={roadmap:{bounds:[[-116,-68,-8],[116,68,55]],azimuth:38,elevation:35},medicine:{bounds:[[-110,-68,-8],[110,68,86]],azimuth:38,elevation:32},brain:{bounds:[[-105,-85,-8],[105,85,66]],azimuth:42,elevation:32},agency:{bounds:[[-116,-116,-10],[116,116,58]],azimuth:38,elevation:35},graph:{bounds:[[-140,-90,0],[140,90,55]],azimuth:55,elevation:35},aero:{bounds:[[-80,-60,-10],[80,65,126]],azimuth:38,elevation:30}};
export function projection(kind){const v=view[kind],[lo,hi]=v.bounds,points=[];for(const x of [lo[0],hi[0]])for(const y of [lo[1],hi[1]])for(const z of [lo[2],hi[2]])points.push([x,y,z]);return k.fitProjection(points,600,380,{pad:25,azimuth:v.azimuth,elevation:v.elevation});}
const box=(name,x,y,w,d,z,h,extra={})=>({name,type:'box',x,y,w,d,z,h,r:1.2,...extra});
const cyl=(name,x,y,r,z,h,extra={})=>({name,type:'cylinder',x,y,r,z,h,...extra});
const prism=(name,F,poly,s0,s1,extra={})=>({name,type:'prism',F,poly,s0,s1,...extra});
export const routePose=p=>{
 const x=-100+200*p,y=54*Math.sin(Math.PI*p)**2;
 return {x,y,angle:Math.atan2(54*Math.PI*Math.sin(2*Math.PI*p),200)};
};
const ribbon=sign=>{
 const left=[],right=[];
 for(let i=0;i<=40;i++){
  const p=.16+.68*i/40,x=-100+200*p,y=sign*54*Math.sin(Math.PI*p)**2;
  left.push([x,y+11]);right.push([x,y-11]);
 }
 return [...left,...right.reverse()];
};
export function staticFor(kind){
 const s=[];
 if(kind==='roadmap'){
  for(const [i,[x,y]]of [[-100,-48],[92,-48],[-100,40],[92,40]].entries())s.push(box(`roadmap.foot.${i}`,x,y,8,8,-8,8,{ground:true,tone:'lo'}));
  s.push(box('roadmap.base',-110,-60,220,120,0,8,{tone:'lo',r:7}),box('learning.path',-100,-8,200,16,8,.5,{tone:'hi'}));
  for(let i=0;i<6;i++){
   const x=-88+(i%3)*66,y=i<3?-48:16,h=8+(i%3)*10;
   s.push(box(`skill.${i}.seat`,x,y,44,32,8,3,{tone:'hi',r:3}),box(`skill.${i}.module`,x+3,y+3,38,26,11,h,{tone:i===5?'sage':'mid',r:3}),box(`skill.${i}.label`,x+10,y+10,24,4,11+h,.6,{tone:'subject',signal:Math.floor(i/2)}));
   for(let j=0;j<3;j++)s.push(box(`skill.${i}.notch.${j}`,x+9+j*10,y+23,5,2,11+h,.6,{tone:'hi'}));
  }
  for(let i=0;i<8;i++)s.push(box(`path.mark.${i}`,-86+i*24,-13,12,3,8,.5,{tone:'subject'}));
 }else if(kind==='medicine'){
  for(const [i,[x,y]]of [[-94,-50],[86,-50],[-94,42],[86,42]].entries())s.push(box(`scanner.foot.${i}`,x,y,8,8,-8,8,{ground:true,tone:'lo'}));
  s.push(box('scanner.base',-104,-60,208,120,0,6,{tone:'lo',r:8}),box('blister.sheet',-77,-34,154,68,6,2,{tone:'hi',r:5}));
  for(let i=0;i<8;i++){
   const x=-57+(i%4)*38,y=i<4?-17:17;
   s.push(cyl(`pill.${i}.seat`,x,y,11,8,1,{tone:'lo'}),cyl(`pill.${i}.dome`,x,y,9,9,4,{tone:i%2?'sage':'subject'}),cyl(`pill.${i}.tablet`,x,y,6,13,.5,{tone:'hi'}),box(`pill.${i}.score`,x-3,y-.5,6,1,13.5,.3,{tone:'hi'}));
  }
  for(let i=0;i<5;i++)s.push(box(`scanner.result.${i}`,78,-25+i*10,12,4,6,1,{tone:'sage',signal:i%3}));
 }else if(kind==='brain'){
  for(const [i,[x,y]]of [[-88,-61],[80,-61],[-88,53],[80,53]].entries())s.push(box(`cognitive.foot.${i}`,x,y,8,8,-8,8,{ground:true,tone:'lo'}));
  s.push(box('cognitive.base',-100,-75,200,150,0,8,{tone:'lo',r:15}),box('shared.memory.seat',-25,-22,50,44,8,5,{tone:'hi',r:6}),box('shared.memory',-20,-17,40,34,13,12,{tone:'subject',r:4}));
  for(let i=0;i<6;i++){
   const a=i*TAU/6,x=70*Math.cos(a),y=49*Math.sin(a);
   const poly=[[.65,-2],[1,-2],[1,2],[.65,2]].map(([u,v])=>[u*x-v*Math.sin(a),u*y+v*Math.cos(a)]);
   s.push({name:`context.bus.${i}`,type:'road',poly,z:8,h:1,tone:'subject'},box(`cognitive.${i}.socket`,x-15,y-12,30,24,9,4,{tone:'lo',r:3}),box(`cognitive.${i}.module`,x-12,y-9,24,18,13,12,{tone:i%2?'hi':'mid',r:3}),cyl(`cognitive.${i}.signal`,x,y,3,25,1,{signal:i}));
   for(let j=0;j<3;j++)s.push(box(`cognitive.${i}.pin.${j}`,x-9+j*7,y+9,3,3,13,1,{tone:'hi'}));
  }
 }else if(kind==='agency'){
  for(const [i,a]of [0,1,2,3].map(i=>[i,Math.PI/4+i*Math.PI/2]))s.push(cyl(`foot.${i}`,70*Math.cos(a),70*Math.sin(a),9,-10,10,{ground:true,tone:'lo'}));
  s.push(cyl('round.plinth',0,0,108,0,10,{tone:'lo'}),cyl('drive.shoulder',0,0,54,10,9),cyl('rotary.table',0,0,50,19,5,{tone:'hi',groove:true}),cyl('spindle',0,0,9,24,7,{tone:'lo'}),cyl('spindle.cap',0,0,10,31,2,{tone:'hi'}));
  for(let i=0;i<3;i++){
   const a=-Math.PI/2+i*TAU/3,x=80*Math.cos(a),y=80*Math.sin(a);
   s.push(cyl(`agent.${i}.seat`,x,y,18,10,4,{tone:'lo'}),cyl(`agent.${i}.body`,x,y,14,14,26,{tone:'mid'}),cyl(`agent.${i}.collar`,x,y,15,40,3,{tone:'lo'}),cyl(`agent.${i}.cap`,x,y,14,43,3,{tone:'hi'}),cyl(`agent.${i}.signal`,x,y,5,46,1.4,{signal:i}));
   for(let j=0;j<4;j++){const b=j*TAU/4;s.push(cyl(`agent.${i}.bolt.${j}`,x+11*Math.cos(b),y+11*Math.sin(b),1.1,46,.7,{tone:'lo'}));}
  }
  for(let i=0;i<8;i++){const a=i*TAU/8;s.push(cyl(`rim.bolt.${i}`,99*Math.cos(a),99*Math.sin(a),1.5,10,.7,{tone:'hi'}));}
 }else if(kind==='graph'){
  const fork=54*Math.sin(Math.PI*.16)**2+11;
  s.push({name:'road.entry',type:'road',poly:[[-100,-11],[-68,-fork],[-68,fork],[-100,11]],z:0,h:4,ground:true,tone:'lo'},{name:'road.exit',type:'road',poly:[[68,-fork],[100,-11],[100,11],[68,fork]],z:0,h:4,ground:true,tone:'lo'});
  for(const sign of [-1,1])s.push({name:`road.${sign}`,type:'road',poly:ribbon(sign),z:0,h:4,ground:true,tone:'lo',route:sign});
  for(const [i,x]of [-132,100].entries()){
   s.push(box(`dock.${i}`,x,-46,32,82,0,4,{ground:true,tone:'lo',r:4}),box(`warehouse.${i}`,x+3,-42,26,24,4,27,{tone:i?'mid':'hi'}));
   // Each roof pitches upward from its walls.
   const F={o:[x+3,-42,31],a:[0,1,0],u:[1,0,0],v:[0,0,1]};
   s.push(prism(`roof.${i}`,F,[[0,0],[13,9],[26,0]],0,24,{tone:'lo'}));
   for(let j=0;j<3;j++)s.push(box(`warehouse.${i}.vent.${j}`,x+5+j*7,-18,4,.5,16,6,{tone:'lo'}));
   for(let j=0;j<3;j++)s.push(box(`parcel.${i}.${j}`,x+5+j*7,18,6,9,4,6,{tone:'hi',groove:true}));
  }
  // A barrier closes the upper route; the delivery follows the lower bypass.
  for(const y of [-70,-37])s.push(cyl(`barrier.foot.${y}`,-5,y,5,0,4,{ground:true,tone:'lo'}),cyl(`barrier.post.${y}`,-5,y,2.5,4,14,{tone:'lo'}));
  s.push(box('barrier.bar',-7,-70,4,33,18,4,{tone:'subject'}));
  for(let i=0;i<4;i++)s.push(box(`barrier.stripe.${i}`,-7,-67+i*8,4,3,22,.5,{tone:'lo'}));
  s.push(cyl('route.signal.pole',-38,-48,2,4,26),box('route.signal.body',-42,-52,8,8,30,10),cyl('route.signal',-38,-48,2.2,40,1,{signal:1}));
  for(const x of [-65,65])for(const y of [-16,16])s.push(cyl(`road.stud.${x}.${y}`,x,y,1.2,0,.5,{ground:true,tone:'hi'}));
 }else{
  for(const [i,[x,y]]of [[-63,-42],[55,-42],[-63,42],[55,42]].entries())s.push(box(`foot.${i}`,x,y,8,8,-8,8,{ground:true,tone:'lo',r:2}));
  s.push(box('case.lower',-74,-54,148,118,0,8,{tone:'lo',r:9}),box('case.front',-70,55,140,5,8,10,{tone:'mid'}),box('case.back',-70,-50,140,4,8,10),box('case.left',-70,-46,4,101,8,10),box('case.right',66,-46,4,101,8,10));
  s.push(box('board',-58,-37,116,78,8,2,{tone:'sage',r:2}),box('chip.socket',-24,-20,48,40,10,2,{tone:'lo',groove:true}),box('chip',-19,-15,38,30,12,3,{tone:'subject',groove:true}));
  for(const x of [-55,51])for(const y of [-34,34])s.push(cyl(`board.screw.${x}.${y}`,x,y,2,10,1,{tone:'hi'}));
  for(let i=0;i<6;i++){
   s.push(box(`chip.pin.left.${i}`,-28,-13+i*5,4,2.5,10,2,{tone:'hi'}),box(`chip.pin.right.${i}`,24,-13+i*5,4,2.5,10,2,{tone:'hi'}));
  }
  for(let i=0;i<3;i++)s.push(box(`capacitor.${i}`,40,-27+i*16,9,10,10,6,{tone:'mid'}),cyl(`status.${i}`,-42+i*42,48,3,8,1.2,{signal:i}));
  const F=G.frameAlong([-66,-53.3,18],[1,0,0]);
  for(let i=0;i<3;i++)s.push({name:`hinge.${i}`,type:'disc',F,s0:i*46,s1:i*46+40,r:3.3,tone:'lo'});
  s.push(box('latch.seat',-9,64,18,3,2,4,{tone:'mid'}),box('latch',-6,64,12,3,6,4,{tone:'hi',signal:1}));
 }
 return s;
}
export function dynamicFor(kind,p){
 if(kind==='roadmap'){
  const x=-90+180*p;
  return [box('learning.cursor',x-7,-8,14,16,8.5,4,{tone:'subject',dynamic:true,r:3}),box('learning.cursor.inlay',x-3,-4,6,8,12.5,.5,{tone:'hi',dynamic:true})];
 }
 if(kind==='medicine'){
  const x=-81+162*p;
  return [box('scan.left.shoe',x-5,-56,10,15,6,4,{tone:'lo',dynamic:true}),box('scan.right.shoe',x-5,41,10,15,6,4,{tone:'lo',dynamic:true}),box('scan.left.post',x-3,-52,6,6,10,50,{tone:'mid',dynamic:true}),box('scan.right.post',x-3,46,6,6,10,50,{tone:'mid',dynamic:true}),box('scan.bridge',x-5,-52,10,104,60,8,{tone:'subject',dynamic:true}),box('scan.sensor',x-3,-39,6,78,55,5,{tone:'hi',dynamic:true})];
 }
 if(kind==='brain'){
  const a=p*TAU;
  // The central memory rotor turns in place; module signals carry the context hand-off.
  return [cyl('memory.rotor',0,0,10,25,5,{tone:'subject',dynamic:true}),box('memory.rotor.slot',-7,-1,14,2,30,.4,{tone:'hi',dynamic:true}),{name:'memory.pointer',type:'road',poly:[[0,-1.5],[9,-1.5],[9,1.5],[0,1.5]].map(([r,t])=>[r*Math.cos(a)-t*Math.sin(a),r*Math.sin(a)+t*Math.cos(a)]),z:30.4,h:.5,tone:'sage',dynamic:true}];
 }
 if(kind==='agency'){
  const a=-Math.PI/2+p*TAU,x=32*Math.cos(a),y=32*Math.sin(a);
  const ring=[[10,-2],[33,-2],[36,0],[33,2],[10,2]].map(([r,t])=>[r*Math.cos(a)-t*Math.sin(a),r*Math.sin(a)+t*Math.cos(a)]);
  return [{name:'dispatch.pointer',type:'road',poly:ring,z:24,h:1.5,tone:'subject',dynamic:true},cyl('task.token',x,y,8.5,25.5,7,{tone:'subject',dynamic:true}),cyl('task.seal',x,y,4,32.5,.7,{tone:'hi',dynamic:true})];
 }
 if(kind==='graph'){
  const {x,y,angle}=routePose(p),c=Math.cos(angle),sn=Math.sin(angle);
  const F={o:[x,y,0],a:[0,0,1],u:[c,sn,0],v:[-sn,c,0]};
  const body=(name,x0,y0,w,d,z,h,tone='mid')=>prism(name,F,[[x0,y0],[x0+w,y0],[x0+w,y0+d],[x0,y0+d]],z,z+h,{tone,dynamic:true});
  const pieces=[body('truck.chassis',-12,-6,24,12,11,3,'lo'),body('truck.cargo',-11,-6,14,12,14,11,'subject'),body('truck.lid',-11,-6,14,12,25,1,'subject'),body('truck.cab',4,-6,8,12,14,8,'hi'),body('truck.window',5,-5,5,10,22,.7,'lo'),body('truck.bumper',12,-5,1.5,10,12,3,'hi')];
  for(const dx of [-7,7])for(const side of [-1,1]){
   const Fw=G.frameAlong([x+c*dx-sn*side*6,y+sn*dx+c*side*6,8],[-sn*side,c*side,0]);
   pieces.push({name:`truck.wheel.${dx}.${side}`,type:'disc',F:Fw,s0:0,s1:2.5,r:4,dynamic:true,tone:'lo'},{name:`truck.hub.${dx}.${side}`,type:'disc',F:Fw,s0:2.5,s1:2.9,r:1.5,dynamic:true,tone:'hi'});
  }
  return pieces;
 }
 const angle=(1-Math.min(1,p*2))*78*Math.PI/180,c=Math.cos(angle),s=Math.sin(angle);
 const F={o:[0,-53.3,18],a:[0,-s,c],u:[1,0,0],v:[0,c,s]};
 const beam=(name,x,y,w,d,tone='mid')=>prism(name,F,[[x,y],[x+w,y],[x+w,y+d],[x,y+d]],0,3,{tone,dynamic:true});
 return [beam('lid.hinge',-64,3.3,128,5),beam('lid.left',-64,8.3,5,95),beam('lid.right',59,8.3,5,95),beam('lid.front',-64,103.3,128,5,'hi'),prism('lid.glass',F,[[-59,8.3],[59,8.3],[59,103.3],[-59,103.3]],1,2,{tone:'glass',dynamic:true})];
}
export function pathsFor(part,P){
 let paths,at;
 if(part.type==='box'){
  paths=k.slabOf(part,part.z,part.h,P,3,.45);at=[part.x+part.w/2,part.y+part.d/2,part.z+part.h/2];
 }else if(part.type==='cylinder'){
  paths=k.cylinder(part.x,part.y,part.r,part.z,part.h,P,40,.35);at=[part.x,part.y,part.z+part.h/2];
 }else if(part.type==='disc'){
  paths=G.disc(part.s0,part.s1,part.r,part.F,P,{steps:24});at=G.add3(part.F.o,G.mul3(part.F.a,(part.s0+part.s1)/2));
 }else if(part.type==='prism'){
  paths=G.prismOf(part.F,part.poly,part.s0,part.s1,P);
  const mid=part.poly.reduce((a,p)=>[a[0]+p[0]/part.poly.length,a[1]+p[1]/part.poly.length],[0,0]);
  at=G.add3(G.add3(part.F.o,G.mul3(part.F.a,(part.s0+part.s1)/2)),G.add3(G.mul3(part.F.u,mid[0]),G.mul3(part.F.v,mid[1])));
 }else{
  paths=k.extrude(part.poly,part.z,part.h,P,{convex:false,bevel:.25});
  at=[...part.poly.reduce((a,p)=>[a[0]+p[0]/part.poly.length,a[1]+p[1]/part.poly.length],[0,0]),part.z+part.h/2];
 }
 let ink='';
 if(part.groove&&part.type==='box')ink=k.planOutline(k.insetPlan(part,1.5),part.z+part.h,P,3);
 if(part.name==='rotary.table')ink=k.ring(0,0,43,24,P,64)+k.ring(0,0,20,24,P,48);
 return {...part,paths,ink,at,key:k.depthOf(at,P)};
}
