import React,{useEffect,useId,useRef} from 'react';
import {chainState,stepChain,chainPose} from './anatomy/chain-model.mjs';

export default function ThemeSwitch({theme,onChange}){
 const root=useRef(null),svg=useRef(null),button=useRef(null),gesture=useRef(null),dragged=useRef(false);
 const physics=useRef(chainState()),wake=useRef(()=>{});
 const uid=useId().replace(/:/g,''),metal=`chain-metal-${uid}`,grip=`chain-grip-${uid}`,help=`chain-help-${uid}`;
 useEffect(()=>{
  const element=root.current,preference=matchMedia('(prefers-reduced-motion: reduce)');
  const links=[...svg.current.querySelectorAll('[data-link]')];
  let frame=0,last=0,visible=false,disposed=false,length=180;
  const paint=()=>{
   const s=physics.current,pose=chainPose(length,s.pull,s.sway,7.4,s.bend);
   for(let i=0;i<links.length;i++){
    const link=pose.links[i];links[i].style.display=link?'':'none';
    if(link)links[i].setAttribute('transform',`translate(${link.x} ${link.y}) rotate(${link.angle})`);
   }
   button.current.style.top=`${pose.tip.y-10}px`;
   button.current.style.left=`${pose.tip.x+(element.clientWidth-52)/2}px`;
   button.current.style.transform=`rotate(${pose.links[0]?.angle||0}deg)`;
   element.dataset.pull=s.pull.toFixed(2);element.dataset.sway=s.sway.toFixed(2);
  };
  const tick=now=>{
   frame=0;if(disposed||!visible||document.hidden)return;
   const moving=stepChain(physics.current,last?(now-last)/1000:1/60,preference.matches);last=now;paint();
   if(moving&&!preference.matches)frame=requestAnimationFrame(tick);
  };
  const run=()=>{if(!frame&&!disposed&&visible&&!document.hidden){last=0;frame=requestAnimationFrame(tick);}};
  wake.current=run;
  const resize=new ResizeObserver(()=>{
   length=parseFloat(getComputedStyle(element).getPropertyValue('--chain-length'))||180;
   svg.current.setAttribute('viewBox',`-96 0 192 ${length+64}`);paint();
  });resize.observe(element);
  const observer=new IntersectionObserver(entries=>{visible=entries.at(-1).isIntersecting;if(visible)run();else{cancelAnimationFrame(frame);frame=0;last=0;}});observer.observe(element);
  const visibility=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else run();};
  const changed=()=>{if(preference.matches){physics.current.targetSway=0;stepChain(physics.current,0,true);paint();}run();};
  document.addEventListener('visibilitychange',visibility);preference.addEventListener('change',changed);paint();
  return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();resize.disconnect();document.removeEventListener('visibilitychange',visibility);preference.removeEventListener('change',changed);wake.current=()=>{};};
 },[]);
 const release=()=>{physics.current.targetPull=0;physics.current.targetSway=0;wake.current();};
 const down=e=>{
  if(e.button!==0)return;
  dragged.current=false;gesture.current={id:e.pointerId,x:e.clientX,y:e.clientY,pull:0};e.currentTarget.setPointerCapture(e.pointerId);
 };
 const move=e=>{
  const g=gesture.current,s=physics.current;
  if(g&&g.id===e.pointerId){
   g.pull=Math.max(0,Math.min(36,e.clientY-g.y));
   if(g.pull>4||Math.abs(e.clientX-g.x)>5)dragged.current=true;
   s.targetPull=g.pull;s.targetSway=Math.max(-72,Math.min(72,e.clientX-g.x));wake.current();
  }else if(e.pointerType==='mouse'){
   const r=e.currentTarget.getBoundingClientRect();s.targetSway=Math.max(-14,Math.min(14,(e.clientX-r.left-r.width/2)*.35));wake.current();
  }
 };
 const up=e=>{
  const g=gesture.current;if(!g||g.id!==e.pointerId)return;
  gesture.current=null;if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);
  if(g.pull>=14)onChange();release();
 };
 const cancel=()=>{gesture.current=null;release();};
 const click=e=>{
  if(e.detail>0&&dragged.current){dragged.current=false;return;}
  onChange();physics.current.pull=12;physics.current.pullVelocity=0;release();
 };
 return <div className="theme-chain" ref={root}>
  <div className="chain-assembly">
   <svg ref={svg} className="chain-simulation" viewBox="-96 0 192 244" aria-hidden="true">
    <defs><linearGradient id={metal} x1="0" x2="1"><stop offset="0" stopColor="var(--chain-metal-dark)"/><stop offset=".3" stopColor="var(--chain-metal-light)"/><stop offset=".6" stopColor="var(--chain-metal-mid)"/><stop offset="1" stopColor="var(--chain-metal-dark)"/></linearGradient></defs>
    {Array.from({length:34},(_,i)=><g key={i} data-link=""><ellipse rx={i%2?1.2:2.9} ry="4.4" fill="none" stroke="var(--chain-metal-dark)" strokeWidth="2.2"/><ellipse rx={i%2?1.2:2.9} ry="4.4" fill="none" stroke={`url(#${metal})`} strokeWidth="1.5"/></g>)}
   </svg>
   <button ref={button} className="theme-chain-pull" type="button" role="switch" aria-label="Dark theme" aria-checked={theme==='dark'} aria-describedby={help} title="Pull the chain to change theme"
    onClick={click} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={cancel} onLostPointerCapture={()=>{if(gesture.current)cancel();}} onPointerLeave={()=>{if(!gesture.current)release();}}>
    <svg className="chain-grip" width="22" height="38" viewBox="0 0 22 38" aria-hidden="true">
     <defs><linearGradient id={grip}><stop offset="0" stopColor="var(--chain-metal-dark)"/><stop offset=".3" stopColor="var(--chain-metal-light)"/><stop offset=".58" stopColor="var(--chain-metal-mid)"/><stop offset="1" stopColor="var(--chain-metal-dark)"/></linearGradient></defs>
     <ellipse cx="11" cy="4" rx="2.9" ry="3.4" fill="none" stroke={`url(#${grip})`} strokeWidth="2"/>
     <path d="M11 7C5 7 3 11 3 15V27C3 33 6 36 11 36S19 33 19 27V15C19 11 17 7 11 7Z" fill={`url(#${grip})`} stroke="var(--chain-metal-dark)" strokeWidth=".6"/>
     <path d="M5 15Q11 17 17 15M4 19Q11 21 18 19M4 23Q11 25 18 23M5 27Q11 29 17 27" stroke="var(--chain-metal-dark)" opacity=".55" strokeWidth=".7" fill="none"/>
     <path d="M7 11Q5 14 6 27" stroke="var(--chain-metal-light)" opacity=".75" fill="none" strokeLinecap="round"/>
    </svg>
   </button>
  </div>
  <span className="sr-only" id={help}>Pull the chain, click, or press Enter or Space to change theme.</span>
 </div>;
}
