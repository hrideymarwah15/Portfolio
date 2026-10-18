import React,{memo,useEffect,useMemo,useRef,useState} from 'react';
import figures from '../data/anatomy-machines.json';
import {clamp01,follow,followCircular,targetAt,phaseAt,advanceTour} from './model.mjs';
import {dynamicFor,pathsFor} from './scenes.mjs';
import './mechanism.css';

const descriptions={
 roadmap:'Six skill modules on a learning-path board. A cursor traces the prerequisite sequence.',
 medicine:'A medicine blister beneath a moving inspection arch that scans the packaging.',
 brain:'Six cognitive modules connected to shared memory. A central rotor and module signals show context passing through the workflow.',
 agency:'A circular dispatch hub. A task token rotates between three upright agent stations.',
 graph:'Two warehouses connected by branching roads. A delivery vehicle takes a curved bypass around a blocked route.',
 aero:'A hinged validation case. Its lid closes over a processor, demonstrates a review step and opens after verification.',
};
const Solid=memo(function Solid({part}){
 const p=part.paths;
 return <>
  <path className="machine-fill" d={p.fill}/>
  {p.shades.map((d,i)=><path key={i} className={'machine-shade shade-'+i} d={d}/>)}
  <path className="machine-top" d={p.top}/>
  
  <path className="machine-seam" d={p.crease||''}/>
  <path className="machine-bevel" d={p.bevel||''}/>
  {part.ink?<path className="machine-engraving" d={part.ink}/>:null}
  <path className="machine-edge" d={p.outline}/>
 </>;
});

export default function Mechanism({kind,name,active=true}){
 const figure=figures[kind];
 const root=useRef(null),layer=useRef(null),readout=useRef(null),announcement=useRef(null),wake=useRef(()=>{}),idle=useRef(null);
 const [paused,setPaused]=useState(false);
 const circular=kind==='agency'||kind==='brain';
 const state=useRef({position:0,target:0,clock:0,touring:true,approved:false,waiting:false});
 const resting=phaseAt(kind,0).label;
 const art=useMemo(()=>[...figure.parts].sort((a,b)=>a.key-b.key).map(part=><g key={part.name}
  data-machine-part={part.name} data-tone={part.tone} data-subject={part.tone==='subject'?'':undefined}
  data-signal={part.signal??undefined}><Solid part={part}/></g>),[figure]);
 useEffect(()=>{
  const container=root.current, preference=matchMedia('(prefers-reduced-motion: reduce)');
  const nodes=new Map([...layer.current.children].map(node=>[node.dataset.machinePart,node]));
  const moving=new Map(figure.parts.filter(p=>p.dynamic).map(p=>[p.name,{node:nodes.get(p.name),paths:[...nodes.get(p.name).querySelectorAll('path')]}]));
  let frame=0,last=0,visible=false,order='',phase='',disposed=false,painted=-1;
  const paint=()=>{
   const s=state.current,point=s.position;
   const model=targetAt(kind,s.clock);
   const mode=s.touring?model:{returning:false,paused:false};
   const next=phaseAt(kind,point,mode);
   if(s.waiting&&Math.abs(point-.5)<.015)next.label='Awaiting approval';
   const waiting=s.waiting&&Math.abs(point-.5)<.015;
   const done=point>.94&&!mode.returning;
   container.dataset.phase=waiting||mode.paused?'waiting':done?'complete':'running';
   if(Math.abs(point-painted)>.000001){
    const start=performance.now();
    for(const spec of dynamicFor(kind,point)){
     const part=pathsFor(spec,figure.projection),entry=moving.get(part.name),p=part.paths;
     const values=[p.fill,...p.shades,p.top,p.crease||'',p.bevel||'',p.outline];
     entry.paths.forEach((path,i)=>path.setAttribute('d',values[i]||''));
    }
    container.dataset.renderMs=(performance.now()-start).toFixed(2);painted=point;
   }
   for(const part of figure.parts){
    if(!Number.isInteger(part.signal))continue;
    const node=nodes.get(part.name);
    node.toggleAttribute('data-on',active&&part.signal===next.station);
    node.toggleAttribute('data-complete',active&&!mode.returning&&(part.signal<next.station||done));
   }
   const interval=Math.min(figure.states.length-2,Math.floor(point*(figure.states.length-1)));
   const mix=point*(figure.states.length-1)-interval;
   const key=part=>figure.orders[interval][part.name]*(1-mix)+figure.orders[interval+1][part.name]*mix;
   const sorted=[...figure.parts].sort((a,b)=>key(a)-key(b));
   const signature=sorted.map(part=>part.name).join('|');
   if(signature!==order){
    const fragment=document.createDocumentFragment();
    sorted.forEach(part=>fragment.appendChild(nodes.get(part.name)));
    layer.current.appendChild(fragment);order=signature;
   }
   container.dataset.position=point.toFixed(3);
   if(next.label!==phase){
    phase=next.label;readout.current.textContent=phase;
    if(container.contains(document.activeElement))announcement.current.textContent=phase;
   }
  };
  const tick=now=>{
   frame=0;if(disposed||!visible||document.hidden||!active)return;
   const dt=last?Math.min((now-last)/1000,.05):1/60;last=now;
   const s=state.current;
   if(s.touring&&!paused&&!preference.matches){
    advanceTour(s,kind,dt,{automatic:true});
   }
   s.position=preference.matches?s.target:(circular?followCircular:follow)(s.position,s.target,dt);
   if(Math.abs(s.position-s.target)<.00005)s.position=s.target;
   paint();
   if(!preference.matches&&((s.touring&&!s.waiting&&!paused)||s.position!==s.target))frame=requestAnimationFrame(tick);
  };
  const run=()=>{if(!frame&&!disposed&&visible&&!document.hidden&&active){last=0;frame=requestAnimationFrame(tick);}};
  wake.current=run;
  const observer=new IntersectionObserver(entries=>{
   visible=entries[entries.length-1].isIntersecting;
   if(visible)run();else{cancelAnimationFrame(frame);frame=0;last=0;}
  });
  observer.observe(container);
  const visibility=()=>{
   if(document.hidden){cancelAnimationFrame(frame);frame=0;last=0;}else run();
  };
  const changed=()=>{
   if(preference.matches){state.current.touring=false;state.current.target=state.current.position;paint();}
   else if(!paused)state.current.touring=true;
   run();
  };
  document.addEventListener('visibilitychange',visibility);
  preference.addEventListener('change',changed);
  paint();
  return()=>{
   disposed=true;cancelAnimationFrame(frame);clearTimeout(idle.current);observer.disconnect();
   document.removeEventListener('visibilitychange',visibility);preference.removeEventListener('change',changed);
   wake.current=()=>{};
  };
 },[figure,kind,active,paused,circular]);
 const take=position=>{
  clearTimeout(idle.current);const s=state.current;s.touring=false;s.waiting=false;
  const target=clamp01(position);s.target=circular&&target===1?0:target;wake.current();
 };
 const toggle=()=>{
  clearTimeout(idle.current);
  state.current.target=state.current.position;
  state.current.touring=true;
  setPaused(value=>!value);
 };
 const keys=event=>{
  if(['ArrowLeft','ArrowDown','ArrowRight','ArrowUp','Home','End','Escape'].includes(event.key)){
   event.preventDefault();setPaused(true);
   if(event.key==='Home')take(0);
   else if(event.key==='End')take(1);
   else if(event.key==='Escape')take(state.current.position);
   else take(state.current.position+(['ArrowRight','ArrowUp'].includes(event.key)?.5:-.5));
  }
 };
 const pointer=event=>{
  if(event.pointerType!=='mouse')return;
  const box=event.currentTarget.getBoundingClientRect();
  const fraction=(event.clientX-box.left)/box.width;
  take((fraction-.18)/.64);leave();
 };
 const leave=()=>{
  clearTimeout(idle.current);
  if(!paused&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
   idle.current=setTimeout(()=>{state.current.touring=true;wake.current();},1000);
  }
 };
 return <div ref={root} className="anatomy-machine" data-kind={kind} data-active={active?'true':'false'}>
  <button className="machine-control" type="button" aria-label={`${paused?'Resume':'Pause'} ${name} illustration. Arrow keys explore the simulation.`} aria-pressed={paused}
   onClick={toggle} onKeyDown={keys} onPointerMove={pointer} onPointerLeave={leave}
   onBlur={leave}>
   <svg className="machine-svg" viewBox={`0 0 ${figure.width} ${figure.height}`} role="img" aria-label={descriptions[kind]}>
    <g ref={layer}>{art}</g>
   </svg>
   <span className="machine-state" ref={readout} aria-hidden="true">{resting}</span>
   <span className="machine-replay" aria-hidden="true"><span>{paused?'Play':'Pause'}</span></span>
  </button>
  <span className="sr-only" aria-live="polite" ref={announcement}/>
 </div>;
}
