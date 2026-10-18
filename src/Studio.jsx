import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
export default function Studio({
  mode = "studio",
  theme = "light",
  onObject,
  onHover,
  resetView = 0,
}) {
  const host = useRef(null);
  const themeRef = useRef(theme);
  themeRef.current = theme;
  const resetRef = useRef(resetView);
  resetRef.current = resetView;
  const hoverRef = useRef(onHover);
  hoverRef.current = onHover;
  const callback = useRef(onObject);
  callback.current = onObject;
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      setFailed(true);
      return;
    }
    const el = host.current;
    el.appendChild(renderer.domElement);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, 0.04);
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.35;
    room.dispose();
    pmrem.dispose();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 70);
    camera.position.set(0, 6.8, 14);
    camera.lookAt(0, mode === "centered" ? 0.45 : 0.7, 0);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xb0a6ba, 1.7));
    const light = new THREE.DirectionalLight(0xfff4e7, 3);
    light.position.set(-3, 9, 7);
    light.castShadow = true;
    light.shadow.mapSize.set(2048, 2048);
    light.shadow.camera.left = -7;
    light.shadow.camera.right = 7;
    light.shadow.camera.top = 7;
    light.shadow.camera.bottom = -7;
    light.shadow.normalBias = 0.04;
    light.shadow.radius = 5;
    scene.add(light);
    const fill = new THREE.DirectionalLight(0xd5c7ff, 1.4);
    fill.position.set(5, 5, -4);
    scene.add(fill);
    const world = new THREE.Group();
    scene.add(world);
    world.rotation.y = 0;
    const mats = {};
    const mat = (color, metalness = 0) =>
      mats[color] ||
      (mats[color] = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.58,
        metalness,
      }));
    const box = (
      w,
      h,
      d,
      color,
      x = 0,
      y = 0,
      z = 0,
      r = 0.09,
      parent = world,
    ) => {
      const mesh = new THREE.Mesh(
        new RoundedBoxGeometry(w, h, d, 3, r),
        mat(color),
      );
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    };
    const sphere = (radius, color, x, y, z, parent = world) => {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 28, 20),
        mat(color),
      );
      m.position.set(x, y, z);
      m.castShadow = true;
      parent.add(m);
      return m;
    };
    const cylinder = (rt, rb, h, color, x, y, z, parent = world) => {
      const m = new THREE.Mesh(
        new THREE.CylinderGeometry(rt, rb, h, 40),
        mat(color),
      );
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      parent.add(m);
      return m;
    };
    const torus = (r, t, color, x, y, z, parent = world) => {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(r, t, 12, 64),
        mat(color),
      );
      m.position.set(x, y, z);
      m.castShadow = true;
      parent.add(m);
      return m;
    };
    const labelTexture = (type) => {
      const c = document.createElement("canvas");
      c.width = 768;
      c.height = 480;
      const ctx = c.getContext("2d");
      ctx.fillStyle = type === "screen" ? "#292831" : "#f5f2e9";
      ctx.fillRect(0, 0, 768, 480);
      if (type === "screen") {
        ctx.fillStyle = "#f3f0eb";
        ctx.font = "700 100px Satoshi, sans-serif";
        ctx.fillText("Hridey", 62, 215);
        ctx.fillStyle = "#d7c8ed";
        ctx.fillText("Marwah", 62, 330);
      } else {
        ctx.fillStyle = "#292831";
        ctx.fillRect(0, 0, 768, 480);
        ["#b1c0cf", "#a7bb91", "#c6b1df"].forEach((color, i) => {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.roundRect(70 + i * 220, 115 + i * 30, 180, 210 - i * 30, 22);
          ctx.fill();
        });
      }
      return new THREE.CanvasTexture(c);
    };
    const targets = [];
    const interactive = (mesh, name) => {
      mesh.userData.name = name;
      targets.push(mesh);
      return mesh;
    };
    // One miniature desk, built entirely in real-time 3D.
    const desk = box(6.8, 0.25, 4.3, "#e2d7c9", 0, -0.12, 0, 0.2);
    box(6.3, 0.12, 3.95, "#eee7db", 0, 0.05, 0, 0.1);
    for (const x of [-2.6, 2.6])
      for (const z of [-1.45, 1.45])
        cylinder(0.12, 0.09, 1.3, "#c6b5a1", x, -0.8, z);
    const laptop = new THREE.Group();
    laptop.position.set(-0.45, 0.21, -0.25);
    world.add(laptop);
    const base = box(2.6, 0.12, 1.75, "#b3a5c8", 0, 0, 0, 0.1, laptop);
    interactive(base, "work");
    const lid = new THREE.Group();
    lid.position.set(0, 0.05, -0.8);
    lid.rotation.x = -0.12;
    laptop.add(lid);
    interactive(box(2.6, 1.7, 0.12, "#a899be", 0, 0.83, 0, 0.09, lid), "work");
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(2.37, 1.48),
      new THREE.MeshBasicMaterial({ map: labelTexture("screen"), toneMapped: false }),
    );
    screen.position.set(0, 0.84, 0.067);
    lid.add(screen);
    interactive(screen, "work");
    const keys = new THREE.InstancedMesh(
      new RoundedBoxGeometry(0.17, 0.025, 0.13, 2, 0.025), mat("#e3dcec"), 44,
    );
    const keyMatrix = new THREE.Object3D();
    for (let row = 0; row < 4; row++) for (let col = 0; col < 11; col++) {
      keyMatrix.position.set(-1.03 + col * 0.205, 0.075, -0.5 + row * 0.18);
      keyMatrix.updateMatrix(); keys.setMatrixAt(row * 11 + col, keyMatrix.matrix);
    }
    keys.castShadow = true; laptop.add(keys);
    box(0.77, 0.015, 0.37, "#c9bdd7", 0, 0.073, 0.54, 0.03, laptop);
    const pot = cylinder(0.42, 0.31, 0.67, "#b9a3d2", 2.25, 0.44, -1.05);
    cylinder(0.36, 0.36, 0.025, "#65564b", 2.25, 0.79, -1.05);
    interactive(pot, "about");
    for (let i = 0; i < 8; i++) {
      const a = i * 2.4;
      const leaf = sphere(
        0.3,
        i % 2 ? "#849b7b" : "#a7bb91",
        2.25 + Math.cos(a) * 0.25,
        0.95 + i * 0.07,
        -1.05 + Math.sin(a) * 0.26,
      );
      leaf.scale.set(0.48, 1.6, 0.7);
      leaf.rotation.z = Math.cos(a) * 0.7;
      interactive(leaf, "about");
    }
    const cup = cylinder(0.29, 0.24, 0.62, "#f3e6bf", 1.7, 0.4, 1.1);
    interactive(
      cylinder(0.25, 0.25, 0.02, "#65503f", 1.7, 0.72, 1.1),
      "contact",
    );
    torus(0.264, 0.025, "#f3e6bf", 1.7, 0.72, 1.1).rotation.x = Math.PI / 2;
    const handle = torus(0.21, 0.065, "#f3e6bf", 2.02, 0.43, 1.1);
    interactive(cup, "contact");
    interactive(handle, "contact");
    box(1.15, 0.13, 1.4, "#abbba4", -2.3, 0.22, 0.8, 0.04).rotation.y = -0.14;
    box(1.08, 0.11, 1.35, "#e8e5d6", -2.3, 0.33, 0.8, 0.025).rotation.y = -0.14;
    const notebook = box(1.18, 0.08, 1.42, "#c6b1df", -2.3, 0.42, 0.8, 0.035);
    notebook.rotation.y = -0.14;
    interactive(notebook, "playground");
    const pencil = box(0.075, 0.075, 1.1, "#e2b365", -2.3, 0.5, 0.8, 0.025);
    pencil.rotation.y = 0.1;
    const lamp = new THREE.Group();
    lamp.position.set(-2.5, 0.52, -1.05);
    world.add(lamp);
    cylinder(0.44, 0.48, 0.12, "#9cacc0", 0, 0.04, 0, lamp);
    cylinder(0.055, 0.055, 1.8, "#9cacc0", 0, 0.94, 0, lamp);
    const shade = cylinder(0.22, 0.57, 0.48, "#b1c0cf", 0.19, 1.8, 0, lamp);
    shade.rotation.z = -0.25;
    const bulb = sphere(0.18, "#fff2cc", 0.24, 1.59, 0, lamp);
    bulb.scale.y = 0.3;
    const mouse = box(0.36, 0.2, 0.55, "#e5e1e7", 1.2, 0.23, 0.15, 0.15);
    interactive(mouse, "work");
    box(0.018, 0.008, 0.13, "#b8a7c9", 1.2, 0.334, 0.09, 0.005);
    const gadget = new THREE.Group();
    gadget.position.set(2.7, 0.22, 0.16);
    gadget.rotation.y = -0.12;
    world.add(gadget);
    interactive(
      box(0.62, 0.13, 0.9, "#9eaf9a", 0, 0, 0, 0.07, gadget),
      "toolbox",
    );
    interactive(
      box(0.44, 0.015, 0.27, "#566756", 0, 0.075, -0.2, 0.02, gadget),
      "toolbox",
    );
    for (let i = 0; i < 6; i++)
      interactive(
        box(
          0.1,
          0.035,
          0.1,
          i === 5 ? "#dac298" : "#d6dfce",
          -0.16 + (i % 3) * 0.16,
          0.09,
          0.04 + Math.floor(i / 3) * 0.17,
          0.025,
          gadget,
        ),
        "toolbox",
      );
    const cableCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.5, 0.14, -1.05),
      new THREE.Vector3(-2.85, 0.14, -0.8),
      new THREE.Vector3(-3, 0.14, -0.2),
      new THREE.Vector3(-2.65, 0.14, 0.05),
    ]);
    const cable = new THREE.Mesh(
      new THREE.TubeGeometry(cableCurve, 24, 0.017, 6, false),
      mat("#b7acbf"),
    );
    world.add(cable);
    // A desk mat, display, speaker and headphones form a complete workstation.
    box(4.25, 0.025, 2.8, "#c8c3ce", -0.1, 0.135, 0.15, 0.16);
    const monitor = new THREE.Group();
    monitor.position.set(-0.35, 0.2, -1.65);
    world.add(monitor);
    cylinder(0.46, 0.5, 0.06, "#c0b4cb", 0, 0.06, 0, monitor);
    box(0.13, 0.8, 0.13, "#b7a9c4", 0, 0.48, 0, 0.04, monitor);
    interactive(box(3.05, 1.65, 0.18, "#c2b5d1", 0, 1.58, 0, 0.14, monitor), "work");
    const display = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 1.42),
      new THREE.MeshBasicMaterial({map: labelTexture("system"), toneMapped: false}));
    display.position.set(0, 1.59, 0.098); monitor.add(display); interactive(display, "work");
    const speaker = box(0.55, 0.9, 0.48, "#9eb29a", 1.62, 0.64, -1.4, 0.12);
    const cone = cylinder(0.17, 0.17, 0.04, "#53654f", 1.62, 0.65, -1.145);
    cone.rotation.x = Math.PI / 2;
    const tweeter = sphere(0.065, "#dce5cf", 1.62, 0.91, -1.145);
    interactive(speaker, "toolbox");
    const headphones = new THREE.Group();
    headphones.position.set(-2.45, 0.65, -0.05); headphones.rotation.y = -0.35;
    world.add(headphones);
    const band = torus(0.43, 0.065, "#a38cbf", 0, 0.25, 0, headphones);
    band.scale.y = 1.15;
    box(0.19, 0.41, 0.26, "#c7b6dc", -0.4, 0.02, 0, 0.09, headphones);
    box(0.19, 0.41, 0.26, "#c7b6dc", 0.4, 0.02, 0, 0.09, headphones);
    const board = box(1.05, 1.25, 0.1, "#e4ceaa", 2.65, 1.34, -1.82, 0.1);
    board.rotation.y = -0.1;
    box(0.58, 0.66, 0.018, "#f0e5c7", 2.6, 1.4, -1.75, 0.02).rotation.z = 0.14;
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3;
      const petal = sphere(0.12, "#b49dcd", 2.61 + Math.cos(a) * 0.13, 1.43 + Math.sin(a) * 0.13, -1.71);
      petal.scale.z = 0.28;
    }
    sphere(0.075, "#e4ceaa", 2.61, 1.43, -1.67).scale.z = 0.28;
    interactive(board, "journey");
    // Small personal objects add detail without labels or slogans.
    ["#abbba4", "#c6b1df", "#b1c0cf"].forEach((color, i) => {
      const book = new THREE.Group();
      book.position.set(-2.5, 0.2 + i * 0.105, -1.05);
      book.rotation.y = (i - 1) * 0.07;
      world.add(book);
      interactive(box(1.24, 0.095, 0.94, color, 0, 0, 0, 0.025, book), "journey");
      box(1.16, 0.055, 0.91, "#e8e5d6", 0.025, 0, 0.01, 0.012, book);
    });
    const phone = new THREE.Group();
    phone.position.set(-0.25, 0.21, 1.5);
    phone.rotation.y = -0.16;
    world.add(phone);
    interactive(box(0.52, 0.075, 0.93, "#9cacc0", 0, 0, 0, 0.075, phone), "toolbox");
    box(0.45, 0.012, 0.81, "#292831", 0, 0.045, 0, 0.055, phone);
    box(0.15, 0.008, 0.018, "#c6b1df", 0, 0.054, 0.32, 0.008, phone);
    const robot = new THREE.Group();
    robot.position.set(-1.55, 0.41, 1.45);
    robot.rotation.y = 0.2;
    world.add(robot);
    interactive(box(0.38, 0.45, 0.32, "#e5e1e7", 0, 0, 0, 0.15, robot), "open-source");
    interactive(box(0.48, 0.37, 0.38, "#e5e1e7", 0, 0.38, 0, 0.16, robot), "open-source");
    box(0.37, 0.2, 0.025, "#292831", 0, 0.4, 0.185, 0.075, robot);
    for (const side of [-1, 1]) {
      sphere(0.027, "#b1c0cf", side * 0.09, 0.4, 0.205, robot);
      const foot = sphere(0.12, "#c6b1df", side * 0.16, -0.17, 0.17, robot);
      foot.scale.set(0.8, 0.75, 1.25);
      const arm = sphere(0.08, "#e5e1e7", side * 0.25, 0.01, 0, robot);
      arm.scale.y = 1.8;
    }
    const penCup = cylinder(0.18, 0.16, 0.44, "#c6b1df", -3, 0.39, -0.25);
    interactive(penCup, "about");
    cylinder(0.15, 0.15, 0.015, "#65564b", -3, 0.62, -0.25);
    for (let i = 0; i < 3; i++) {
      const pen = cylinder(0.025, 0.025, 0.67, ["#9cacc0", "#e2b365", "#abbba4"][i], -3.08 + i * 0.08, 0.74, -0.25);
      pen.rotation.z = (i - 1) * 0.17;
    }
    const lampGlow = new THREE.PointLight(0xffdfa2, 0, 4, 2);
    lampGlow.position.set(-2.26, 2.1, -1.05); world.add(lampGlow);
    let lampOn = false;
    interactive(shade, "lamp"); interactive(bulb, "lamp");
    // Every object has a physical support; nothing levitates around the desk.
    box(0.65, 0.08, 0.52, "#b7a9c4", -2.45, 0.19, -0.05, 0.08);
    cylinder(0.045, 0.055, 1.08, "#b7a9c4", -2.45, 0.75, -0.05);
    box(0.56, 0.09, 0.15, "#b7a9c4", -2.45, 1.3, -0.05, 0.045);
    box(0.78, 0.08, 0.5, "#c6b5a1", 2.65, 0.19, -1.82, 0.07);
    box(0.09, 0.92, 0.09, "#c6b5a1", 2.65, 0.67, -1.94, 0.025);
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.ShadowMaterial({ opacity: 0.085 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.52;
    ground.receiveShadow = true;
    scene.add(ground);
    const ray = new THREE.Raycaster(),
      pointer = new THREE.Vector2(99, 99);
    let targetX = 0,
      targetY = 0,
      drag = false,
      startX = 0,
      dragDistance = 0,
      baseRot = 0,
      visible = true,
      lastHover = null,
      seenReset = resetRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const move = (e) => {
      const rect = el.getBoundingClientRect();
      pointer.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        (-(e.clientY - rect.top) / rect.height) * 2 + 1,
      );
      targetX = pointer.x * 0.08;
      targetY = pointer.y * 0.035;
      if (drag) {
        dragDistance += Math.abs(e.clientX - startX);
        baseRot = THREE.MathUtils.clamp(
          baseRot + (e.clientX - startX) * 0.006,
          -0.9,
          0.7,
        );
      }
      startX = e.clientX;
    };
    const down = (e) => {
      move(e);
      drag = true;
      dragDistance = 0;
      startX = e.clientX;
    };
    const up = () => {
      drag = false;
    };
    const click = (e) => {
      if (dragDistance > 5) return;
      const rect = el.getBoundingClientRect();
      pointer.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        (-(e.clientY - rect.top) / rect.height) * 2 + 1,
      );
      ray.setFromCamera(pointer, camera);
      const hits = ray.intersectObjects(targets);
      if (hits[0]?.object.userData.name === "lamp") {
        lampOn = !lampOn;
        lampGlow.intensity = lampOn ? 3 : 0;
        bulb.material.emissive.set(lampOn ? "#ffcc66" : "#000000");
      } else if (hits[0]) callback.current?.(hits[0].object.userData.name);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    el.addEventListener("click", click);
    const leave = () => {
      targetX = targetY = 0;
      pointer.set(99, 99);
      el.style.cursor = "grab";
      lastHover = null;
      hoverRef.current?.(null);
    };
    el.addEventListener("pointerleave", leave);
    const resize = () => {
      const w = el.clientWidth,
        h = el.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.fov = mode === "centered" && w > 600 ? 26 : 34;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();
    const io = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
    });
    io.observe(el);
    let frame = 0;
    let lastFrame = 0;
    let scrollProgress = 0;
    const readScroll = () => {
      const hero = el.closest(".hero");
      scrollProgress = hero ? THREE.MathUtils.clamp(-hero.getBoundingClientRect().top / hero.offsetHeight, 0, 1) : 0;
    };
    window.addEventListener("scroll", readScroll, {passive: true});
    readScroll();
    let seenTheme = null;
    const darkMaterials = {
      "#e2d7c9":"#35383e", "#eee7db":"#494c54", "#c6b5a1":"#292c32",
      "#b3a5c8":"#666078", "#a899be":"#716983", "#e3dcec":"#aaa7b3", "#c9bdd7":"#80788e",
      "#b9a3d2":"#62576f", "#65564b":"#292a26", "#849b7b":"#59694f", "#a7bb91":"#7a866c",
      "#f3e6bf":"#b4aa93", "#abbba4":"#626e61", "#e8e5d6":"#aaa89c", "#c6b1df":"#81718f",
      "#e2b365":"#b39a6b", "#9cacc0":"#565f70", "#b1c0cf":"#7c8696", "#e5e1e7":"#92919c",
      "#9eaf9a":"#5e6c60", "#d6dfce":"#9ca793", "#dac298":"#a38f6e", "#c8c3ce":"#3b3a43",
      "#c0b4cb":"#6f687d", "#b7a9c4":"#5f596d", "#c2b5d1":"#70677e", "#9eb29a":"#687567",
      "#a38cbf":"#797084", "#c7b6dc":"#9b8ba9", "#e4ceaa":"#a4977b", "#f0e5c7":"#c1b699",
      "#b49dcd":"#81748f", "#c7afe5":"#8d7ca4", "#e2bd72":"#b29d74", "#b2c3a7":"#849079",
      "#b8caa9":"#7e8b75", "#e4cf9e":"#a49676", "#a8bfcd":"#788d9b",
    };
    const animate = () => {
      frame = requestAnimationFrame(animate);
      if (!visible || document.hidden || performance.now() - lastFrame < 30) return;
      lastFrame = performance.now();
      if (seenReset !== resetRef.current) {
        baseRot = 0;
        targetX = targetY = 0;
        seenReset = resetRef.current;
      }
      if (seenTheme !== themeRef.current) {
        seenTheme = themeRef.current;
        for (const [original, material] of Object.entries(mats)) {
          material.color.set(seenTheme === "dark" ? darkMaterials[original] || original : original);
        }
        scene.environmentIntensity = seenTheme === "dark" ? 0.28 : 0.35;
        ground.material.opacity = seenTheme === "dark" ? 0.18 : 0.085;
      }
      world.rotation.y = THREE.MathUtils.lerp(
        world.rotation.y,
        baseRot + (reduced.matches ? 0 : targetX + scrollProgress * 0.28),
        0.12,
      );
      world.rotation.x = THREE.MathUtils.lerp(
        world.rotation.x,
        reduced.matches ? 0 : targetY,
        0.12,
      );
      ray.setFromCamera(pointer, camera);
      const hit = ray.intersectObjects(targets)[0];
      const name = hit?.object.userData.name || null;
      if (name !== lastHover) {
        lastHover = name;
        hoverRef.current?.(name);
      }
      el.style.cursor = drag ? "grabbing" : hit ? "pointer" : "grab";
      if (!reduced.matches) {
        monitor.position.y = 0.2;
      } else { monitor.position.y = 0.2; }
      renderer.render(scene, camera);
    };
    animate();
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("click", click);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("scroll", readScroll);
      environment.dispose();
      scene.traverse((o) => {
        o.geometry?.dispose();
        if (o.material) {
          const a = Array.isArray(o.material) ? o.material : [o.material];
          a.forEach((m) => {
            m.map?.dispose();
            m.dispose();
          });
        }
      });
      renderer.dispose();
      renderer.forceContextLoss();
      el.removeChild(renderer.domElement);
    };
  }, [mode]);
  return (
    <div
      ref={host}
      className="studio-canvas"
      role="img"
      aria-label="Interactive 3D workspace with monitor, laptop, headphones, lamp, plant and notebook. Drag to rotate. The lamp can be switched on; objects link to page sections."
    >
      {failed && (
        <div className="scene-fallback">
          <span>Hridey Marwah</span>
          <a href="#work">Explore my work</a>
        </div>
      )}
    </div>
  );
}
