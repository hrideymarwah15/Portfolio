import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const thoughts = ["useful digital products.", "experiences that feel simple.", "AI with a clear purpose.", "systems people can rely on.", "tools that make work easier.", "with care, in the open."];

export default function Story() {
  const root = useRef(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const section = root.current;
      const track = section.querySelector(".story-reading-list");
      const rows = [...track.children];
      const focus = section.querySelector(".story-focus-frame");
      let current = -1;
      section.classList.add("story-focus-ready");
      const highlight = () => {
        const frame = focus.getBoundingClientRect();
        const midpoint = frame.top + frame.height / 2;
        let nearest = 0, distance = Infinity;
        rows.forEach((row, index) => {
          const rect = row.getBoundingClientRect();
          const nextDistance = Math.abs(rect.top + rect.height / 2 - midpoint);
          if (nextDistance < distance) { distance = nextDistance; nearest = index; }
        });
        if (nearest === current) return;
        current = nearest;
        rows.forEach((row, index) => row.classList.toggle("is-current", index === current));
        section.dataset.storyStep = String(current + 1);
      };
      gsap.fromTo(track, {y:0}, {
        y:() => -rows[rows.length - 1].offsetTop,
        ease:"none", onUpdate:highlight,
        scrollTrigger:{trigger:section, start:"top top", end:"bottom bottom", scrub:0.85, invalidateOnRefresh:true, onRefresh:highlight},
      });
      highlight();
      return () => {
        section.classList.remove("story-focus-ready");
        delete section.dataset.storyStep;
        rows.forEach(row => row.classList.remove("is-current"));
        gsap.set(track, {clearProps:"transform"});
      };
    });
    return () => media.revert();
  }, {scope:root});

  return <section id="story" className="personal-story shell" ref={root} aria-labelledby="story-title">
    <div className="story-scroll-layout">
      <div className="story-reading-intro">
        <h2 id="story-title">I’m Hridey.</h2>
        <p>I build</p>
      </div>
      <div className="story-list-stage">
        <div className="story-focus-frame" aria-hidden="true"><span /></div>
        <ul className="story-reading-list">
          {thoughts.map(thought => <li key={thought}><span>{thought}</span></li>)}
        </ul>
      </div>
    </div>
  </section>;
}
