import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  GithubLogo,
  LinkedinLogo,
  FileText,
  BracketsCurly,
  Flower,
  Copy,
  Check,
} from "@phosphor-icons/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./style.css";
import Navigation from "./Navigation";
import Story from "./Story";
import ExperimentMachine from "./anatomy/ExperimentMachine";
import { completedProjects, activeProjects } from "./projects.mjs";
import ThemeSwitch from "./ThemeSwitch";
import Brand from "./Brand";
import StackBoard from "./StackBoard";
import OpenSource from "./OpenSource";
import Timeline from "./Timeline";
import Workspace from "./Workspace";
import { ContactObject } from "./Objects";
import { useVisualMotion } from "./useVisualMotion";
import { useSmoothScroll } from "./useSmoothScroll";
gsap.registerPlugin(ScrollTrigger, useGSAP);
const email = "hrideymarwah2907@gmail.com";
const GH = "https://github.com/hrideymarwah15/";
function ProjectCard({project:p, research=false}) {
  return <article className={research ? "project research-card" : "project completed-card"}>
    <div className="project-visual"><ExperimentMachine kind={p.kind} name={p.name}/></div>
    <div className="project-caption">
      <p className="project-context">{research ? p.status : p.context}</p>
      <h3>{p.url ? <a href={p.url} target="_blank" rel="noreferrer">{p.name}<ArrowUpRight size={21}/></a> : p.name}</h3>
      <p className="project-description">{p.description}</p>
      <ul className="project-features">{p.details.map(detail=><li key={detail}>{detail}</li>)}</ul>
      <p className="project-stack">{p.stack}</p>
      <div className="project-action">
        {p.question && <details className="research-question"><summary>The research question</summary><p>{p.question}</p></details>}
        {p.url && <a className="text-link project-source" href={p.url} target="_blank" rel="noreferrer" aria-label={`Explore ${p.name} on GitHub`}>View source<ArrowUpRight size={17}/></a>}
      </div>
    </div>
  </article>;
}
function App() {
  const root = useRef();
  const go = useSmoothScroll();
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("hridey-theme") || "light";
    } catch {
      return "light";
    }
  });
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    const favicon = document.querySelector('link[rel="icon"]');
    favicon.href = theme === "dark" ? "/brand/hm-dark.png" : "/brand/hm-light.png";
    favicon.type = "image/png";
    document.querySelector('meta[name="theme-color"]').content =
      theme === "light" ? "#f5f3ed" : "#1b1d22";
    try {
      localStorage.setItem("hridey-theme", theme);
    } catch {}
  }, [theme]);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".hero h1 .line", {y:22, opacity:0.65, stagger:0.1, duration:0.9, ease:"power3.out"});
      gsap.from(".hero-actions", {y:14, opacity:0.65, duration:0.7, delay:0.2, ease:"power3.out"});
      gsap.utils.toArray(".work-grid .project-visual").forEach(el => {
        gsap.fromTo(el, {y:32,scale:0.96}, {y:0,scale:1,ease:"power2.out",scrollTrigger:{trigger:el,start:"top 94%",end:"top 45%",scrub:true}});
      });
      const keyboard = gsap.timeline({scrollTrigger:{trigger:".keyboard-perspective",start:"top 96%",end:"bottom -25%",scrub:true}});
      keyboard.fromTo(".stack-keyboard",{y:60,rotationX:22,rotationZ:-5,scale:0.92},
        {y:0,rotationX:10,rotationZ:-2,scale:1,duration:0.25,ease:"power3.out"})
        .to({}, {duration:0.6}).to(".stack-keyboard",{y:-25,rotationX:0,scale:0.98,duration:0.15});
      gsap.fromTo(".technology-key",{y:14,scale:0.95}, {y:0,scale:1,stagger:0.012,ease:"power3.out",scrollTrigger:{trigger:".keyboard-perspective",start:"top 96%",end:"top 55%",scrub:true}});
      gsap.to(".stack-small-object",{y:-18,rotationZ:-12,rotationY:15,ease:"none",scrollTrigger:{trigger:"#toolbox",start:"top bottom",end:"bottom top",scrub:true}});
      gsap.fromTo(".about-art",{rotation:-3,y:22},{rotation:0,y:0,ease:"none",scrollTrigger:{trigger:"#about",start:"top bottom",end:"center center",scrub:true}});
      gsap.fromTo(".timeline-rail span",{scaleY:0},{scaleY:1,ease:"none",scrollTrigger:{trigger:".timeline-track",start:"top 70%",end:"bottom 55%",scrub:true}});
      gsap.to(".hero .studio-wrap",{y:-28,scale:0.98,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:true}});
    });
    return () => media.revert();
  }, {scope:root});
  useEffect(() => {
    let frame;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    ro.observe(root.current);
    return () => {ro.disconnect();cancelAnimationFrame(frame);};
  }, []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      location.href = "mailto:" + email;
    }
  };
  useVisualMotion(root, true);
  return (
    <div ref={root}>
      <a className="skip" href="#work">
        Skip to work
      </a>
      <header className="site-header"><div className="nav shell">
        <Brand theme={theme}/>
        <div className="nav-right">
          <ThemeSwitch theme={theme} onChange={() => setTheme(theme === "light" ? "dark" : "light")}/>
          <a className="nav-resume" href="/resume.pdf" target="_blank" rel="noreferrer" aria-label="Résumé"><FileText size={18}/><span>Résumé</span></a>
        </div>
      </div></header>
      <Navigation />
      <main className="portfolio-main w-full max-w-full">
        <section id="home" className="hero hero-centered shell">
          <div className="hero-copy">
            <h1 className="max-w-6xl">
              <span className="line">A curious mind.</span>
              <span className="line">
                A builder’s <em>hands.</em>
              </span>
            </h1>
          </div>
          <div className="studio-wrap">
            <Workspace theme={theme} onObject={go} />
          </div>
          <div className="hero-actions">
            <a className="button primary" href="#work">
              Explore my work
            </a>
          </div>
        </section>
        <Story />
        <section id="work" className="work shell section-pad chapter">
          <div className="section-heading">
            <h2>
              Things I’ve<br /><em>built.</em>
            </h2>
          </div>
          <div className="work-grid grid-flow-dense">
            {completedProjects.map(p => <ProjectCard key={p.kind} project={p}/>)}
          </div>
          <a
            className="text-link all-work"
            href={GH.slice(0, -1)}
            target="_blank"
            rel="noreferrer"
          >
            More on GitHub
            <ArrowUpRight size={17} />
          </a>
        </section>
        <StackBoard />
        <section id="playground" className="playground shell section-pad chapter">
          <div className="section-heading">
            <div>
              <h2>
                Room to<br /><em>experiment.</em>
              </h2>
            </div>
          </div>
          <p className="research-intro">Current projects and questions I’m working through.</p>
          <div className="research-grid grid-flow-dense">
            {activeProjects.map(p => <ProjectCard key={p.kind} project={p} research/>)}
          </div>
        </section>
        <OpenSource />
        <Timeline />
        <section id="about" className="about section-pad chapter">
          <div className="shell about-layout">
            <div className="about-object">
              <div className="about-art" aria-hidden="true">
                <div className="about-flower">
                  <Flower size={170} weight="fill" />
                </div>
                <div className="mini-sticky">
                  <BracketsCurly size={65} weight="light" />
                </div>
                <div className="about-circle" />
              </div>
            </div>
            <div className="about-copy">
              <h2>
                Hridey Marwah.<br /><em>Still curious.</em>
              </h2>
              <p>
                I’m Hridey, studying Computer Science & AI at Newton School of
                Technology, Rishihood University. I build learning tools, medicine
                verification workflows and supply-chain simulations. I’m currently
                exploring agent systems and cognitive AI architecture.
              </p>
              <a
                className="text-link"
                href="/resume.pdf"
                target="_blank"
                rel="noreferrer"
              >
                My résumé
                <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
        </section>

        <footer id="contact" className="shell contact chapter">
          <div className="contact-main"><div>
          <h2>Let’s make<br /><em>something good.</em></h2>
          <div className="contact-actions">
            <a className="button primary" href={"mailto:" + email}>
              Say hello
              <ArrowUpRight size={19} />
            </a>
            <button className="copy-email" onClick={copy}>
              {copied ? <Check size={17} /> : <Copy size={17} />}
              <span>{copied ? "Email copied" : email}</span>
            </button>
          </div>
          <div className="contact-socials">
            <a href={GH.slice(0,-1)} target="_blank" rel="noreferrer"><GithubLogo size={20}/>GitHub<ArrowUpRight size={16}/></a>
            <a href="https://www.linkedin.com/in/hrideymarwah" target="_blank" rel="noreferrer"><LinkedinLogo size={20}/>LinkedIn<ArrowUpRight size={16}/></a>
          </div>
          </div><ContactObject email={email}/></div>
          <div className="footer-bottom">
            <Brand theme={theme}/>
            <div>
              <a href={GH.slice(0, -1)} target="_blank" rel="noreferrer">
                GitHub
                <ArrowUpRight size={14} />
              </a>
              <a
                href="https://www.linkedin.com/in/hrideymarwah"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
                <ArrowUpRight size={14} />
              </a>
              <a href="/resume.pdf" target="_blank" rel="noreferrer">
                Résumé
                <ArrowUpRight size={14} />
              </a>
            </div>

          </div>
        </footer>
      </main>
    </div>
  );
}
const appRoot = createRoot(document.getElementById("root"));
appRoot.render(<App />);
if (import.meta.hot) import.meta.hot.dispose(() => appRoot.unmount());
