import React from "react";
export default function Brand({theme}) {
  return <a className="wordmark identity" href="#home" aria-label="Hridey Marwah home">
    <img className="identity-mark" src={theme === "dark" ? "/brand/hm-dark.png" : "/brand/hm-light.png"} width="38" height="38" alt=""/>
    <span>Hridey</span>
  </a>;
}
