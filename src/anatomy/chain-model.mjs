// A concealed take-up spring feeds links; individual metal links never stretch.
export const chainState=()=>({pull:0,pullVelocity:0,sway:0,swayVelocity:0,targetPull:0,targetSway:0,bend:0,bendVelocity:0});
export function stepChain(s,dt,calm=false){
 if(calm){s.pull=s.targetPull;s.sway=0;s.pullVelocity=s.swayVelocity=s.bendVelocity=s.bend=0;return false;}
 const h=Math.min(Math.max(dt,0),.04)/4;
 for(let i=0;i<4;i++){
  s.pullVelocity+=(190*(s.targetPull-s.pull)-18*s.pullVelocity)*h;
  s.swayVelocity+=(35*(s.targetSway-s.sway)-5*s.swayVelocity)*h;
  const bendTarget=Math.max(-18,Math.min(18,s.targetSway*.16-s.swayVelocity*.08));
  s.bendVelocity+=(70*(bendTarget-s.bend)-8*s.bendVelocity)*h;
  s.pull+=s.pullVelocity*h;s.sway+=s.swayVelocity*h;s.bend+=s.bendVelocity*h;
 }
 const moving=Math.abs(s.pull-s.targetPull)+Math.abs(s.sway-s.targetSway)+Math.abs(s.pullVelocity)+Math.abs(s.swayVelocity)+Math.abs(s.bendVelocity)+Math.abs(s.bend-s.targetSway*.16)>.025;
 if(!moving){s.pull=s.targetPull;s.sway=s.targetSway;s.pullVelocity=s.swayVelocity=s.bendVelocity=0;s.bend=s.targetSway*.16;}
 return moving;
}
export function chainPose(length,pull,sway,pitch=7.4,bend=0){
 const points=[];let arc=0;
 for(let i=0;i<=64;i++){
  const u=i/64,x=sway*u**1.7+bend*Math.sin(Math.PI*u),y=(length+pull)*u;
  if(i)arc+=Math.hypot(x-points[i-1].x,y-points[i-1].y);
  points.push({x,y,arc});
 }
 const links=[];
 // Sample backwards from the weighted end so new links feed through the top.
 for(let distance=arc-8;distance>=0;distance-=pitch){
  let i=1;while(i<64&&points[i].arc<distance)i++;
  const a=points[i-1],b=points[i],t=(distance-a.arc)/(b.arc-a.arc);
  links.push({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,angle:-Math.atan2(b.x-a.x,b.y-a.y)*180/Math.PI});
 }
 return {links,tip:points[64]};
}
