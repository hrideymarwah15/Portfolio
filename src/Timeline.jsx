import React from "react";
import { GraduationCap, Trophy, GitMerge } from "@phosphor-icons/react";
import { JourneyObject } from "./Objects";
const entries=[
  {year:"2025 — 2029",title:"Computer Science, with an AI lens.",detail:"Newton School of Technology · Rishihood University",Icon:GraduationCap},
  {year:"2025",title:"An idea, under a deadline.",detail:"Finalist · IIIT Gwalior InfoTsav hackathon",Icon:Trophy},
  {year:"2026 — Ongoing",title:"Working inside JAX.",detail:"Merged fixes in numerical computing and error handling",Icon:GitMerge},
];
export default function Timeline(){
 return <section id="journey" className="timeline-section shell section-pad chapter">
  <div className="section-heading timeline-heading"><h2>A little<br /><em>backstory.</em></h2><JourneyObject/></div>
  <div className="timeline-track"><div className="timeline-rail" aria-hidden="true"><span/></div>
   {entries.map(({year,title,detail,Icon})=><article className="timeline-entry" key={title}>
    <div className="timeline-point" aria-hidden="true"><Icon size={23}/></div>
    <div><p className="timeline-year">{year}</p><h3>{title}</h3><p>{detail}</p></div>
   </article>)}
  </div>
 </section>;
}
