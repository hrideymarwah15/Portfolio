import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import ThreeMeshUI from "three-mesh-ui";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { animate, stagger } from "animejs";
const colors = [
  "#c6b3e1",
  "#d4dfbb",
  "#e7c6ac",
  "#b9cedd",
  "#e6d5a3",
  "#c4cbbf",
  "#cdbce0",
  "#b8ccd1",
];
const marks = {
  JavaScript: "JS",
  HTML: "html",
  CSS: "css",
  Git: "git",
  GitHub: "gh",
  "VS Code": "code",
  Canva: "C",
  Supabase: "sb",
  "REST APIs": "API",
  "Framer Motion": "fm",
  OCR: "ocr",
  "Computer Vision": "cv",
  Ollama: "o",
  Qdrant: "Q",
  Whisper: "w",
  MCP: "mcp",
  JAX: "jax",
  Python: "py",
  OpenCV: "cv",
  NumPy: "np",
  TypeScript: "TS",
  React: "R",
  "Next.js": "N",
  "Tailwind CSS": "tw",
  Firebase: "fb",
  "Three.js": "3",
  "Node.js / Express": "js",
  FastAPI: "API",
  PostgreSQL: "pg",
  Redis: "r",
  "Socket.io": "io",
  Docker: "dk",
  GSAP: "gs",
  "Graph algorithms": "G",
  "Event-driven simulation": "S",
};
export default function ToolScene({ tools, selected, onSelect, paused }) {
  const host = useRef(null),
    selectedRef = useRef(selected),
    callback = useRef(onSelect),
    pausedRef = useRef(paused);
  selectedRef.current = selected;
  callback.current = onSelect;
  pausedRef.current = paused;
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      setFailed(true);
      return;
    }
    const el = host.current;
    el.appendChild(renderer.domElement);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-4, 4, 2.5, -2.5, 0.1, 60);
    camera.position.z = 12;
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8d7b9f, 2.7));
    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(-3, 5, 8);
    scene.add(light);
    const fill = new THREE.DirectionalLight(0xc6b4e4, 1);
    fill.position.set(3, -4, 5);
    scene.add(fill);
    const all = new THREE.Group();
    scene.add(all);
    const tiles = [],
      hitObjects = [],
      animations = [],
      uiBlocks = [];
    const chooseColumns = () =>
      Math.min(
        tools.length,
        el.clientWidth < 500
          ? 2
          : tools.length > 6
            ? 4
            : tools.length > 4
              ? 3
              : 4,
      );
    let cols = chooseColumns(),
      rows = Math.ceil(tools.length / cols);
    tools.forEach(([name], i) => {
      const tile = new THREE.Group();
      tile.userData.lift = 0;
      const row = Math.floor(i / cols),
        col = i % cols;
      tile.position.set(
        (col - (cols - 1) / 2) * 1.76,
        ((rows - 1) / 2 - row) * 1.9,
        0,
      );
      tile.rotation.set(
        -0.42,
        (col - (cols - 1) / 2) * 0.09,
        i % 2 ? 0.06 : -0.07,
      );
      const mesh = new THREE.Mesh(
        new RoundedBoxGeometry(1.35, 1.38, 0.4, 4, 0.16),
        new THREE.MeshStandardMaterial({
          color: colors[i % 8],
          roughness: 0.38,
        }),
      );
      mesh.userData.index = i;
      tile.add(mesh);
      hitObjects.push(mesh);
      const face = new ThreeMeshUI.Block({
        width: 1.21,
        height: 1.22,
        padding: 0.02,
        borderRadius: 0.13,
        backgroundColor: new THREE.Color(colors[i % 8]).convertLinearToSRGB(),
        backgroundOpacity: 1,
      });
      face.position.z = 0.207;
      tile.add(face);
      uiBlocks.push(face);
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, 512, 512);
      ctx.fillStyle = "#4d4358";
      ctx.font = "500 155px Satoshi, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(marks[name] || name.slice(0, 2), 256, 214);
      ctx.font = "500 38px Satoshi, sans-serif";
      ctx.fillText(name.length > 17 ? name.split(" ")[0] : name, 256, 384);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      const text = new THREE.Mesh(
        new THREE.PlaneGeometry(1.19, 1.19),
        new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          depthWrite: false,
          depthTest: false,
          toneMapped: false,
        }),
      );
      text.position.z = 0.24;
      text.renderOrder = 5;
      text.userData.index = i;
      tile.add(text);
      hitObjects.push(text);
      const underside = new THREE.Mesh(
        new RoundedBoxGeometry(1.28, 1.3, 0.13, 3, 0.11),
        new THREE.MeshStandardMaterial({ color: "#8b7c98", roughness: 0.65 }),
      );
      underside.position.z = -0.21;
      tile.add(underside);
      all.add(tile);
      tiles.push(tile);
    });
    ThreeMeshUI.update();
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const reduce = () => media.matches;
    let hover = -1,
      visible = true,
      lastActive = -1,
      lastTime = 0,
      selectionAnimations = [],
      frame,
      playing = true;
    const entry = reduce()
      ? null
      : animate(
          tiles.map((t) => t.scale),
          {
            x: [0.84, 1],
            y: [0.84, 1],
            z: [0.84, 1],
            delay: stagger(50),
            duration: 850,
            ease: "outElastic(1, .65)",
          },
        );
    if (entry) animations.push(entry);
    const point = new THREE.Vector2(99, 99),
      ray = new THREE.Raycaster();
    const read = (e) => {
      const r = el.getBoundingClientRect();
      point.set(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        (-(e.clientY - r.top) / r.height) * 2 + 1,
      );
      ray.setFromCamera(point, camera);
      return ray.intersectObjects(hitObjects)[0]?.object.userData.index ?? -1;
    };
    const move = (e) => {
      hover = read(e);
      el.style.cursor = hover >= 0 ? "pointer" : "default";
    };
    const click = (e) => {
      const index = read(e);
      if (index >= 0) callback.current(index);
    };
    const leave = () => {
      hover = -1;
      el.style.cursor = "default";
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("click", click);
    el.addEventListener("pointerleave", leave);
    const resize = () => {
      const w = el.clientWidth,
        h = el.clientHeight;
      renderer.setSize(w, h);
      const nextCols = chooseColumns();
      if (cols !== nextCols) {
        cols = nextCols;
        rows = Math.ceil(tools.length / cols);
        tiles.forEach((tile, i) => {
          tile.position.x = ((i % cols) - (cols - 1) / 2) * 1.76;
          tile.rotation.y = ((i % cols) - (cols - 1) / 2) * 0.09;
        });
      }
      const aspect = w / h;
      const neededWidth = (cols - 1) * 0.88 + 0.95;
      const neededHeight = (rows - 1) * 0.95 + 1.1;
      const halfHeight = Math.max(neededHeight, neededWidth / aspect);
      const halfWidth = halfHeight * aspect;
      camera.left = -halfWidth;
      camera.right = halfWidth;
      camera.top = halfHeight;
      camera.bottom = -halfHeight;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();
    const io = new IntersectionObserver((e) => {
      visible = e[0].isIntersecting;
    });
    io.observe(el);
    const tick = (time) => {
      frame = requestAnimationFrame(tick);
      if (!visible || document.hidden || time - lastTime < 30) return;
      lastTime = time;
      const shouldPlay = !reduce() && !pausedRef.current;
      if (shouldPlay !== playing) {
        playing = shouldPlay;
        entry?.[playing ? "play" : "pause"]();
      }
      if (selectedRef.current !== lastActive) {
        lastActive = selectedRef.current;
        selectionAnimations.forEach((a) => a.pause());
        selectionAnimations = [];
        tiles.forEach((tile, i) => {
          selectionAnimations.push(
            animate(tile.userData, {
              lift: i === lastActive ? 0.2 : 0,
              duration: reduce() ? 0 : 650,
              ease: "outExpo",
            }),
          );
        });
      }
      tiles.forEach((tile, i) => {
        const row = Math.floor(i / cols);
        tile.position.y =
          ((rows - 1) / 2 - row) * 1.9 +
          (reduce()
            ? i === selectedRef.current
              ? 0.2
              : 0
            : tile.userData.lift) +
          0;
        if (reduce()) tile.scale.set(1, 1, 1);
        const target = i === hover ? -0.22 : -0.42;
        tile.rotation.x = THREE.MathUtils.lerp(
          tile.rotation.x,
          target,
          reduce() ? 1 : 0.06,
        );
      });
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      animations.forEach((a) => a.revert());
      selectionAnimations.forEach((a) => a.revert());
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("click", click);
      el.removeEventListener("pointerleave", leave);
      const geometries = new Set(),
        materials = new Set();
      scene.traverse((o) => {
        if (o.geometry) geometries.add(o.geometry);
        if (o.material)
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) =>
            materials.add(m),
          );
      });
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => {
        m.map?.dispose();
        m.dispose();
      });
      uiBlocks.forEach((block) => block.clear());
      renderer.dispose();
      renderer.forceContextLoss();
      el.removeChild(renderer.domElement);
    };
  }, [tools]);
  return (
    <div
      ref={host}
      className={"tool-scene " + (failed ? "failed" : "")}
      aria-hidden="true"
    >
      {failed && (
        <div className="tool-scene-fallback">
          {tools.map(([name], i) => (
            <span key={name} style={{ background: colors[i % 8] }}>
              {marks[name] || name.slice(0, 2)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
