import React, { useState, useRef, useEffect } from "react";
import { animate, stagger } from "animejs";
import gsap from "gsap";
import { Code, Eye, Scan, BracketsCurly, Database, Brain, Waveform, GitBranch } from "@phosphor-icons/react";
import {
  siPython, siJavascript, siHtml5, siCss, siReact, siNextdotjs,
  siTailwindcss, siFramer, siGit, siGithub, siSupabase, siNumpy,
  siTypescript, siNodedotjs, siExpress, siFastapi, siPostgresql, siRedis,
  siDocker, siOllama, siSocketdotio, siThreedotjs, siGsap, siMongodb,
} from "simple-icons";
const technologies = [
  ["Python", siPython, "AI, computer vision, and data processing.", "lilac"],
  ["JavaScript", siJavascript, "Interactive applications for the web.", "butter"],
  ["React", siReact, "Interfaces with connected, reusable components.", "blue"],
  ["Next.js", siNextdotjs, "Full-stack web applications.", "paper"],
  ["HTML", siHtml5, "Semantic structure and accessible content.", "clay"],
  ["CSS", siCss, "Responsive layouts and thoughtful motion.", "blue"],
  ["Tailwind CSS", siTailwindcss, "Consistent, responsive interface styling.", "sage"],
  ["Framer Motion", siFramer, "Transitions and interaction design.", "lilac"],
  ["Git", siGit, "Version control across project work.", "clay"],
  ["GitHub", siGithub, "Collaboration and open-source contributions.", "paper"],
  ["VS Code", null, "My everyday development environment.", "blue", Code],
  ["Canva", null, "Visual communication and design assets.", "sage"],
  ["Supabase", siSupabase, "Authentication and database workflows.", "sage"],
  ["REST APIs", null, "Connecting application interfaces and services.", "butter", BracketsCurly],
  ["JAX", null, "Contributing to open-source numerical computing.", "lilac"],
  ["NumPy", siNumpy, "Array operations for AI and vision work.", "blue"],
  ["OCR", null, "Turning prescriptions and records into usable text.", "clay", Scan],
  ["Computer Vision", null, "Image preprocessing and text extraction.", "butter", Eye],

  ["TypeScript", siTypescript, "Typed application code and developer tooling.", "blue"],
  ["Node.js", siNodedotjs, "Service runtime for Nyaay Saathi’s backend.", "sage"],
  ["Express", siExpress, "REST endpoints and middleware.", "paper"],
  ["FastAPI", siFastapi, "Python services for StudyPal and AI Agency OS.", "sage"],
  ["PostgreSQL", siPostgresql, "Relational data in full-stack applications.", "blue"],
  ["Redis", siRedis, "Caching and real-time application state.", "clay"],
  ["Docker", siDocker, "Reproducible services and sandboxed execution.", "blue"],
  ["Ollama", siOllama, "Local inference in StudyPal.", "paper"],
  ["Socket.io", siSocketdotio, "Messaging, file sharing, and read receipts.", "butter"],
  ["Three.js", siThreedotjs, "Real-time 3D, including this workspace.", "paper"],
  ["GSAP", siGsap, "Reversible scroll timelines and transitions.", "sage"],
  ["MongoDB", siMongodb, "Document databases in my broader web stack.", "sage"],
  ["Qdrant", null, "Vector search for StudyPal’s local document retrieval.", "clay", Database],
  ["RAG", null, "Retrieving context from personal documents.", "lilac", Brain],
  ["Sentence Transformers", null, "Semantic embeddings and document matching.", "blue", Brain],
  ["MCP", null, "Tool protocol integration in AeroHarness.", "butter", GitBranch],
  ["Whisper", null, "Turning lecture audio into study material.", "paper", Waveform],
  ["OpenCV", null, "Image preprocessing in the Medical OCR system.", "sage", Eye],
];
const groups=[
 {id:"everyday",label:"Everyday",names:["TypeScript","JavaScript","Python","React","Next.js","HTML","CSS","Tailwind CSS","Framer Motion","Three.js","GSAP","Git","GitHub","VS Code","Canva","Supabase","Docker","REST APIs"]},
 {id:"systems",label:"Backend & data",names:["Node.js","Express","FastAPI","PostgreSQL","Redis","Supabase","Docker","Socket.io","MongoDB","REST APIs","Python","Git"]},
 {id:"research",label:"AI / ML",names:["JAX","NumPy","Ollama","Qdrant","RAG","Sentence Transformers","Computer Vision","MCP","Whisper","OpenCV","OCR","Python"]},
];
export default function StackBoard() {
  const [selected, setSelected] = useState(0);
  const [group, setGroup] = useState("everyday");
  const board=useRef(null), mounted=useRef(false), stage=useRef(null), tilt=useRef(null);
  useEffect(() => {
    const area = stage.current, object = tilt.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const turnX = gsap.quickTo(object, "rotationX", {duration:0.65,ease:"power3.out"});
    const turnY = gsap.quickTo(object, "rotationY", {duration:0.65,ease:"power3.out"});
    const reset = () => {turnX(0);turnY(0);};
    const move = event => {
      if (event.pointerType !== "mouse" || reduced.matches) return;
      const rect=area.getBoundingClientRect();
      const x=Math.max(-1,Math.min(1,(event.clientX-rect.left)/rect.width*2-1));
      const y=Math.max(-1,Math.min(1,(event.clientY-rect.top)/rect.height*2-1));
      turnX(-y*6);turnY(x*8);
    };
    const preference = () => {gsap.set(object,{rotationX:0,rotationY:0});};
    area.addEventListener("pointermove",move);
    area.addEventListener("pointerleave",reset);
    area.addEventListener("pointercancel",reset);
    reduced.addEventListener("change",preference);
    return () => {
      area.removeEventListener("pointermove",move);
      area.removeEventListener("pointerleave",reset);
      area.removeEventListener("pointercancel",reset);
      reduced.removeEventListener("change",preference);
      turnX.tween.kill();turnY.tween.kill();
    };
  },[]);
  const shown=groups.find(g=>g.id===group).names.map(name=>technologies.find(t=>t[0]===name));
  const chooseGroup=id=>{setGroup(id);setSelected(0);};
  const tabKeys=(event,index)=>{
    let next=index;
    if(event.key==="ArrowRight")next=(index+1)%groups.length;
    else if(event.key==="ArrowLeft")next=(index+groups.length-1)%groups.length;
    else return;
    event.preventDefault();chooseGroup(groups[next].id);document.getElementById("tech-tab-"+groups[next].id)?.focus();
  };
  useEffect(()=>{
    if(!mounted.current){mounted.current=true;return;}
    if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
    const a=animate(board.current.querySelectorAll(".technology-key"),{scale:[0.94,1],delay:stagger(15),duration:350,ease:"outExpo"});
    return()=>a.revert();
  },[group]);
  const note = useRef(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const a = animate(note.current, { opacity: [0.4, 1], y: [7, 0], duration: 280, ease: "outExpo" });
    return () => a.revert();
  }, [selected, group]);
  return (
    <section id="toolbox" className="stack-section shell section-pad chapter">
      <div className="section-heading stack-heading">
        <h2>A few of my<br /><em>building blocks.</em></h2>
        <div className="stack-small-object" aria-hidden="true"><BracketsCurly size={35}/></div>
      </div>
      <div className="stack-groups" role="tablist" aria-label="Technology groups">
        {groups.map((g,i)=><button key={g.id} id={"tech-tab-"+g.id} role="tab" aria-selected={group===g.id} aria-controls="technology-panel" tabIndex={group===g.id?0:-1} onClick={()=>chooseGroup(g.id)} onKeyDown={e=>tabKeys(e,i)}>{g.label}</button>)}
      </div>
      <div className="keyboard-perspective" id="technology-panel" role="tabpanel" aria-labelledby={"tech-tab-"+group} ref={stage}>
        <div className="keyboard-float" ref={tilt}>
        <div className="stack-keyboard" aria-label="My technical stack" ref={board}>
          <div className="keyboard-underplate" aria-hidden="true"/>
          <div className="keyboard-side keyboard-side-left" aria-hidden="true"/>
          <div className="keyboard-side keyboard-side-right" aria-hidden="true"/>
          <div className="keyboard-front" aria-hidden="true"/>
          <div className="keyboard-fittings" aria-hidden="true"><i/><i/><i/><i/><span><b/><b/><b/></span></div>
          {shown.map(([name, icon, , color, Icon], i) => (
            <button key={name} className={`technology-key key-${color} ${selected === i ? "is-selected" : ""}`}
              style={{ "--key-index": i }} onClick={() => setSelected(i)}
              aria-label={name} aria-pressed={selected === i} title={name}>
              <span className="key-face">
                {icon ? <svg role="img" aria-label={name} viewBox="0 0 24 24"><path d={icon.path}/></svg>
                  : Icon ? <Icon size={37} weight="regular" aria-hidden="true" />
                  : <span className={"key-letter " + (name === "Canva" ? "canva-letter" : "")}>{name === "Canva" ? "C" : "jax"}</span>}
              </span>
              <span className="key-tooltip" aria-hidden="true">{name}</span>
            </button>
          ))}
        </div>
        </div>
      </div>
      <div className="stack-selected" ref={note} aria-live="polite" aria-atomic="true">
        <h3>{shown[selected][0]}</h3>
        <p>{shown[selected][2]}</p>
      </div>
    </section>
  );
}
