import { useCallback, useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

// One scroll owner and one animation clock. Native keyboard and touch scrolling stay intact.
export function useSmoothScroll() {
  const instance = useRef(null);
  const navigate = useCallback((id, { history = true, immediate = false, focus = false } = {}) => {
    const target = document.getElementById(id);
    if (!target) return;
    // Use the actual document position so a native hash jump cannot leave Lenis with a stale origin.
    const inset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 108;
    const padding = parseFloat(getComputedStyle(target).paddingTop) || 0;
    const destination = id === "home" ? 0 : id === "story" ? target.getBoundingClientRect().top + window.scrollY : Math.max(0, target.getBoundingClientRect().top + window.scrollY + padding - inset);
    const complete = () => {
      if (!focus) return;
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };
    if (history && location.hash !== `#${id}`) window.history.pushState(null, "", `#${id}`);
    if (instance.current) {
      instance.current.scrollTo(destination, {immediate, onComplete:complete});
    } else {
      window.scrollTo({top:destination, behavior:"instant"});
      complete();
    }
  }, []);

  useEffect(() => {
    const lenis = new Lenis({lerp:0.075, wheelMultiplier:0.78, smoothWheel:true, syncTouch:false, anchors:false, respectReducedMotion:true});
    instance.current = lenis;
    const update = () => ScrollTrigger.update();
    const tick = time => lenis.raf(time * 1000);
    lenis.on("scroll", update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const click = event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest?.("a[href]");
      if (!link || link.target || link.hasAttribute("download")) return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
      let id;
      try { id = decodeURIComponent(url.hash.slice(1)); } catch { return; }
      if (!document.getElementById(id)) return;
      event.preventDefault();
      navigate(id, {focus:event.detail === 0});
    };
    const keyboard = event => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      if (!["PageDown", "PageUp", "Home", "End", "ArrowUp", "ArrowDown", " "].includes(event.key)) return;
      if (event.target.closest?.("input,textarea,select,[contenteditable='true']")) return;
      if (event.key === " " && event.target.closest?.("button,a,[role='switch']")) return;
      // Give native keyboard scrolling ownership immediately, even during an anchor glide.
      lenis.scrollTo(window.scrollY, {immediate:true});
    };
    document.addEventListener("keydown", keyboard);
    let frame;
    const restore = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        let id;
        try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
        if (id) navigate(id, {history:false, immediate:true});
        else lenis.scrollTo(0, {immediate:true});
      });
    };
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    document.addEventListener("click", click);
    window.addEventListener("popstate", restore);
    window.addEventListener("hashchange", restore);
    if (location.hash) restore();
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", click);
      document.removeEventListener("keydown", keyboard);
      window.removeEventListener("popstate", restore);
      window.removeEventListener("hashchange", restore);
      window.history.scrollRestoration = previousRestoration;
      gsap.ticker.remove(tick);
      lenis.off("scroll", update);
      lenis.destroy();
      instance.current = null;
    };
  }, [navigate]);
  return navigate;
}
