import React from "react";
import { BracketsCurly, GitBranch, GraduationCap, EnvelopeSimple, ArrowUpRight } from "@phosphor-icons/react";

export function ChapterJoint() {
  return <div className="chapter-joint shell" aria-hidden="true"><span/><div><BracketsCurly size={19}/></div><span/></div>;
}

export function JourneyObject() {
  return <div className="journey-object" aria-hidden="true">
    <span><GraduationCap size={32}/></span><span><BracketsCurly size={32}/></span><span><GitBranch size={32}/></span>
  </div>;
}

export function ContactObject({email}) {
  return <a className="contact-object" href={`mailto:${email}`} aria-label="Email Hridey">
    <span className="envelope-letter"><BracketsCurly size={40}/></span>
    <span className="envelope-body"><EnvelopeSimple size={95} weight="thin"/></span>
    <span className="envelope-stamp"><ArrowUpRight size={24}/></span>
  </a>;
}
