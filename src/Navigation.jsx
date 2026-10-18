import React, { useEffect, useRef, useState } from "react";

const items = [
  ["home", "Home"], ["story", "I build"], ["work", "Work"],
  ["toolbox", "Stack"], ["playground", "Experiments"],
  ["open-source", "Open source"], ["journey", "Backstory"],
  ["about", "About"], ["contact", "Contact"],
];

export default function Navigation() {
  const [active, setActive] = useState("home");
  const last = useRef("home");
  useEffect(() => {
    let frame;
    const sections = items.map(([id]) => document.getElementById(id)).filter(Boolean);
    const read = () => {
      frame = null;
      const readingLine = window.innerHeight * 0.46;
      let current = sections[0]?.id;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= readingLine) current = section.id;
      }
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) current = "contact";
      if (current && current !== last.current) { last.current = current; setActive(current); }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(read); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    read();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  return <nav className="chapter-nav" aria-label="Page sections">
    {items.map(([id, label]) => <a key={id} href={`#${id}`} aria-label={label}
      aria-current={active === id ? "location" : undefined}>
      <span className="chapter-nav-label" aria-hidden="true">{label}</span>
      <span className="chapter-nav-line" aria-hidden="true" />
    </a>)}
  </nav>;
}
