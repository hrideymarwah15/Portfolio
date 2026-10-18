import React, {lazy,Suspense,useEffect,useRef,useState} from 'react';
const Mechanism=lazy(()=>import('./Mechanism.jsx'));
export default function ExperimentMachine(props){
 const root=useRef(null),[ready,setReady]=useState(false);
 useEffect(()=>{
  const observer=new IntersectionObserver(entries=>{
   if(entries.some(entry=>entry.isIntersecting)){setReady(true);observer.disconnect();}
  },{rootMargin:'400px 0px'});
  observer.observe(root.current);
  return()=>observer.disconnect();
 },[]);
 return <div className="anatomy-host" ref={root}>
  {ready?<Suspense fallback={<div className="machine-loading" role="status" aria-label="Loading mechanical illustration"/>}><Mechanism {...props}/></Suspense>:<div className="machine-loading"/>}
 </div>;
}
