import { useEffect } from "react";
import { animate, stagger } from "animejs";
export function useVisualMotion(root, paused, active) {
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let animations = [],
      cleanups = [];
    const setup = () => {
      animations.forEach((a) => a.revert());
      cleanups.forEach((fn) => fn());
      animations = [];
      cleanups = [];
      if (media.matches) return;
      const el = root.current;
      if (!paused) {
        const objects = el.querySelectorAll(
          ".forge-cube,.small-orbit,.study-flash,.law-symbol,.aero-core,.about-flower",
        );
        animations.push(
          animate(objects, {
            "--element-float": ["0px", "-9px"],
            duration: 2400,
            delay: stagger(170),
            ease: "inOutSine",
            alternate: true,
            loop: true,
          }),
        );
        const rings = el.querySelectorAll(".aero-ring");
        if (rings.length)
          animations.push(
            animate(rings, {
              rotate: ["0deg", "360deg"],
              duration: 26000,
              ease: "linear",
              loop: true,
            }),
          );
      }
      el.querySelectorAll(".project-visual,.experiment-visual").forEach(
        (card) => {
          let motion;
          const move = (e) => {
            if (e.pointerType === "touch") return;
            const r = card.getBoundingClientRect();
            motion?.pause();
            motion = animate(card, {
              "--tilt-x": ((e.clientY - r.top) / r.height - 0.5) * -3 + "deg",
              "--tilt-y": ((e.clientX - r.left) / r.width - 0.5) * 3 + "deg",
              duration: 450,
              ease: "outExpo",
            });
          };
          const leave = () => {
            motion?.pause();
            motion = animate(card, {
              "--tilt-x": "0deg",
              "--tilt-y": "0deg",
              duration: 650,
              ease: "outElastic(1, .7)",
            });
          };
          card.addEventListener("pointermove", move);
          card.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            motion?.revert();
            card.removeEventListener("pointermove", move);
            card.removeEventListener("pointerleave", leave);
          });
        },
      );
    };
    setup();
    media.addEventListener("change", setup);
    return () => {
      media.removeEventListener("change", setup);
      animations.forEach((a) => a.revert());
      cleanups.forEach((fn) => fn());
    };
  }, [root, paused, active]);
}
