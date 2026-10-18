import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, GitMerge } from "@phosphor-icons/react";
import snapshot from "./data/github-activity.json";
const dateLabel = date => new Intl.DateTimeFormat("en", {month:"short",day:"numeric",year:"numeric",timeZone:"UTC"}).format(new Date(date + "T12:00:00Z"));
export default function OpenSource() {
  const scroll = useRef(null),section=useRef(null);
  const [activity,setActivity]=useState(snapshot),[live,setLive]=useState(false);
  const days=activity.days.slice(-30),total=days.reduce((n,d)=>n+d.count,0);
  const padding=new Date(days[0].date+'T12:00:00Z').getUTCDay();
  const cells=[...Array(padding).fill(null),...days];
  const weeks=Array.from({length:Math.ceil(cells.length/7)},(_,i)=>cells.slice(i*7,i*7+7));
  const [selected,setSelected]=useState(days.length-1);
  useEffect(()=>{
    let visible=false,disposed=false,timer=0,request=null;
    const refresh=async()=>{
      if(!visible||document.hidden||request)return;
      request=new AbortController();
      const timeout=setTimeout(()=>request?.abort(),12000);
      try{
        const response=await fetch('/api/github-activity',{signal:request.signal});
        if(!response.ok)throw new Error('Unavailable');
        const next=await response.json();
        if(!Array.isArray(next.days)||!next.days.length||next.days.length>30||next.days.some(d=>!/^\d{4}-\d{2}-\d{2}$/.test(d.date)||!Number.isSafeInteger(d.count)||d.count<0||!Number.isInteger(d.level)||d.level<0||d.level>4)||(!Number.isSafeInteger(next.jax?.mergedCount)||next.jax.mergedCount<0)||!Number.isFinite(Date.parse(next.fetchedAt)))throw new Error('Invalid activity');
        if(!disposed){setActivity({...next,source:snapshot.source});setSelected(i=>Math.min(i,next.days.length-1));setLive(true);}
      }catch(error){if(!disposed)setLive(false);}
      finally{clearTimeout(timeout);request=null;}
    };
    const observer=new IntersectionObserver(entries=>{
      visible=entries.at(-1).isIntersecting;clearInterval(timer);
      if(visible){refresh();timer=setInterval(refresh,60000);}
    },{rootMargin:'200px'});observer.observe(section.current);
    const onVisible=()=>{if(!document.hidden)refresh();};
    document.addEventListener('visibilitychange',onVisible);
    return()=>{disposed=true;observer.disconnect();clearInterval(timer);request?.abort();document.removeEventListener('visibilitychange',onVisible);};
  },[]);
  const onKeys=(event,index)=>{
    const delta={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7};
    if(!(event.key in delta))return;
    event.preventDefault();
    const next=Math.max(0,Math.min(days.length-1,index+delta[event.key]));
    setSelected(next);
    scroll.current.querySelector(`[data-day="${next}"]`)?.focus();
  };
  const day=days[selected];
  return (
    <section id="open-source" className="open-source shell section-pad chapter" ref={section}>
      <div className="section-heading">
        <h2>Learning<br /><em>in the open.</em></h2>
        <a className="text-link" href={activity.source} target="_blank" rel="noreferrer">My GitHub <ArrowUpRight size={18}/></a>
      </div>
      <figure className="contribution-figure">
        <div className="contribution-top"><p><strong>{total}</strong> contributions</p><span>Last 30 days · {dateLabel(days[0].date)} — {dateLabel(days.at(-1).date)}</span></div>
        <div className="contribution-scroll" ref={scroll} aria-label="GitHub contribution calendar">
          <div className="contribution-calendar" role="group" aria-label={`${total} GitHub contributions in the last 30 days. Use arrow keys to explore days.`}>
            {weeks.map((week,w)=><div className="contribution-week" key={w}>
              {week.map((d,j)=>{const index=w*7+j-padding;if (!d) return <span className="contribution-blank" key={j} aria-hidden="true"/>; return <button key={d.date} data-day={index} className={`contribution-day level-${d.level}`} tabIndex={selected===index?0:-1}
                aria-label={`${dateLabel(d.date)}: ${d.count} contribution${d.count===1?"":"s"}`} aria-pressed={selected===index}
                onFocus={()=>setSelected(index)} onClick={()=>setSelected(index)} onKeyDown={e=>onKeys(e,index)}/>;})}
            </div>)}
          </div>
        </div>
        <figcaption><p aria-live="polite">{dateLabel(day.date)} <span>· {day.count} contribution{day.count===1?"":"s"}</span></p><span>{live?'Live · updated '+new Intl.DateTimeFormat('en',{hour:'numeric',minute:'2-digit'}).format(new Date(activity.fetchedAt)):'Saved activity · '+dateLabel(activity.fetchedAt.slice(0,10))}</span></figcaption>
      </figure>
      <div className="open-source-work">
        <div className="jax-object" aria-hidden="true"><span>jax</span></div>
        <div className="jax-context"><h3>Small fixes.<br />Real codebases.</h3><p>Contributing to JAX, the numerical computing library.</p></div>
        <div className="contribution-links">
          <a href="https://github.com/jax-ml/jax/pull/34478" target="_blank" rel="noreferrer"><GitMerge size={20}/><div><h4>Correct derivatives at a boundary</h4><p>Fixing the betaln Hessian when a = b.</p></div><ArrowUpRight size={18}/></a>
          <a href="https://github.com/jax-ml/jax/pull/34788" target="_blank" rel="noreferrer"><GitMerge size={20}/><div><h4>Safer error handling</h4><p>Handling invalid error codes without an IndexError.</p></div><ArrowUpRight size={18}/></a>
          <a className="jax-all" href="https://github.com/jax-ml/jax/pulls?q=is%3Apr+author%3Ahrideymarwah15+is%3Amerged" target="_blank" rel="noreferrer">{activity.jax.mergedCount} merged pull requests <ArrowUpRight size={16}/></a>
        </div>
      </div>
    </section>
  );
}
