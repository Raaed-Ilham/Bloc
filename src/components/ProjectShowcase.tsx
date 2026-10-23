"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface Project {
  id: string;
  title: string;
  client: string;
  category: string;
  role: string;
  launch: string;
  recognition: string[];
  description: string;
  imageUrl: string;
  href?: string;
}

// Replace these sample entries with your own projects. No header is rendered here.
const PROJECTS: Project[] = [
  {
    id: "luxe-residence",
    title: "Luxe Residence",
    client: "Luxe Group",
    category: "Residential Architecture",
    role: "Lead Architect & Design Director",
    launch: "October 2025",
    recognition: ["AIA Honor Award 2025", "ArchDaily Building of the Year"],
    description:
      "A minimalist concrete retreat set into coastal cliffs, built around raw materials and ambient light.",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=85&w=1600&auto=format&fit=crop",
  },
  {
    id: "ceilao-villas",
    title: "Ceilao Villas",
    client: "Ceilao",
    category: "Public & Cultural",
    role: "Facade Engineering & Concept",
    launch: "June 2025",
    recognition: [
      "World Architecture Festival Finalist",
      "Frame Awards Winner",
    ],
    description:
      "Modernist brutalism reimagined with wood-composite facades and open atrium courtyards.",
    imageUrl:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=85&w=1600&auto=format&fit=crop",
  },
  {
    id: "span-residences",
    title: "Span Residences",
    client: "MiuX Studio",
    category: "Commercial & Workspace",
    role: "Interior Architecture",
    launch: "January 2026",
    recognition: ["Interior Design Best of Year", "Design Anthology Award"],
    description:
      "A glass-encased studio designed around diffuse daylight and modular partition walls.",
    imageUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=85&w=1600&auto=format&fit=crop",
  },
  {
    id: "ikea-district",
    title: "Ikea District",
    client: "Ikea",
    category: "Urban Masterplan",
    role: "Principal Urban Planner",
    launch: "March 2026",
    recognition: ["ULI Excellence Award", "Global Architecture Citation"],
    description:
      "An elevated civic walkway and green canopy linking three historic districts with timber footbridges.",
    imageUrl:
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=85&w=1600&auto=format&fit=crop",
  },
];

const N = PROJECTS.length;
const ITEM_H = 220;
const CARD_RATIO = 1.7; // width / height of every sheet
const pad = (value: number) => String(value).padStart(2, "0");
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/* -------------------------------------------------------------------------- */
/*  Shaders                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * The sheet is a unit plane scaled to card size inside the shader.
 *
 * Bend model: a fold line runs through the CENTER of the sheet (slightly
 * rotated, so the curl is diagonal rather than perfectly horizontal). The half
 * of the sheet on the "leading" side of that line is wrapped onto a circular
 * arc, so the page curves away from its centre in the direction of the scroll.
 * `uBend` is signed: positive curls the top half back, negative curls the
 * bottom half back. After bending, a shear gives the diagonal parallelogram
 * pose seen in the reference.
 */
const vertexShader = /* glsl */ `
  uniform float uWidth;
  uniform float uHeight;
  uniform float uBend;       // -1..1, sign = curl direction
  uniform float uMaxAngle;   // curl angle (radians) at |uBend| = 1
  uniform vec2  uSkew;       // x: vertical edges lean, y: horizontal edges tilt

  varying vec2  vUv;
  varying float vAngle;

  void main() {
    vUv = uv;
    vec3 p = vec3(position.x * uWidth, position.y * uHeight, 0.0);

    // Fold-line normal: tilted so the curl travels along a diagonal.
    float foldTilt = 0.34;
    vec2 nrm = vec2(sin(foldTilt), cos(foldTilt));
    float ext = 0.5 * (uHeight * nrm.y + uWidth * nrm.x);

    float b = abs(uBend);
    float dir = uBend >= 0.0 ? 1.0 : -1.0;
    float s = max(dot(p.xy, nrm) * dir, 0.0); // distance past the centre fold

    vAngle = 0.0;
    if (b > 0.002 && s > 0.0) {
      float total = b * uMaxAngle;
      float radius = ext / total;
      float th = s / radius;                  // 0 at centre, total at the edge
      vAngle = th;
      float newS = radius * sin(th);
      p.xy += nrm * dir * (newS - s);         // arc in the page plane
      p.z  -= radius * (1.0 - cos(th));       // and away from the viewer
    }

    // Diagonal parallelogram pose (y is up).
    p.xy = vec2(p.x - p.y * uSkew.x, p.y - p.x * uSkew.y);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uOpacity;
  uniform vec2 uUvScale;

  varying vec2  vUv;
  varying float vAngle;

  void main() {
    vec4 color;
    float a = vAngle;

    if (gl_FrontFacing) {
      // "cover" crop so photos are never stretched
      vec2 uv = (vUv - 0.5) * uUvScale + 0.5;
      color = texture2D(uMap, uv);

      // the curve darkens as it turns away, with a soft sheen where it starts
      float shade = smoothstep(0.0, 1.6, a);
      color.rgb *= 1.0 - 0.42 * shade;
      float sheen = exp(-pow((a - 0.45) * 4.0, 2.0)) * smoothstep(0.03, 0.25, a);
      color.rgb += vec3(0.12) * sheen;

      float ed = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
      color.rgb *= 1.0 - 0.08 * (1.0 - smoothstep(0.0, 0.03, ed));
    } else {
      // reverse side of a curled page: pale paper fading to near-black
      float k = smoothstep(1.5, 2.6, a);
      color = vec4(mix(vec3(0.84, 0.83, 0.81), vec3(0.07), k * k), 1.0);
    }

    color.a *= uOpacity;
    gl_FragColor = color;
  }
`;

/* -------------------------------------------------------------------------- */
/*  WebGL stage                                                               */
/* -------------------------------------------------------------------------- */

// Distance along the diagonal lane. Sheets that have already passed (t > 1)
// compress toward a tight pile instead of continuing off-screen.
const stackDistance = (t: number) =>
  t <= 1 ? t : 1 + 0.16 * (1 - Math.exp(-(t - 1) * 0.9));

function CurvedProjectStage({
  progress,
  reducedMotion,
}: {
  progress: MotionValue<number>;
  reducedMotion: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let frame = 0;
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    let cardWidth = 400;
    let cardHeight = cardWidth / CARD_RATIO;

    let currentProgress = progress.get();
    let lastProgress = currentProgress;
    let lastTime = performance.now();
    let velocity = 0; // smoothed projects-per-second, drives the live bend

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
      premultipliedAlpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.NoToneMapping;

    const scene = new THREE.Scene();
    const cameraDistance = 1800;
    const camera = new THREE.PerspectiveCamera(35, 1, 1, 6000);
    camera.position.set(0, 0, cameraDistance);

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

    // One unit plane shared by every sheet; width/height are shader uniforms,
    // so resizing never rebuilds geometry. Dense in both axes because the
    // fold line is diagonal.
    const geometry = new THREE.PlaneGeometry(1, 1, 72, 72);

    const meshes: THREE.Mesh[] = [];
    const materials: THREE.ShaderMaterial[] = [];
    const textures: THREE.Texture[] = [];
    const loaded: boolean[] = PROJECTS.map(() => false);

    PROJECTS.forEach((project, index) => {
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uMap: { value: null },
          uWidth: { value: cardWidth },
          uHeight: { value: cardHeight },
          uBend: { value: 0 },
          uMaxAngle: { value: 0.62 },
          uSkew: { value: new THREE.Vector2(0, 0) },
          uUvScale: { value: new THREE.Vector2(1, 1) },
          uOpacity: { value: 0 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthTest: true,
        depthWrite: true,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.visible = false;
      mesh.frustumCulled = false; // vertices move in the shader
      scene.add(mesh);
      meshes.push(mesh);
      materials.push(material);

      loader.load(
        project.imageUrl,
        (texture) => {
          if (disposed) {
            texture.dispose();
            return;
          }
          // Left as raw sRGB: the shader writes values straight to the canvas.
          texture.colorSpace = THREE.NoColorSpace;
          texture.anisotropy = Math.min(
            4,
            renderer.capabilities.getMaxAnisotropy(),
          );
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.magFilter = THREE.LinearFilter;

          const img = texture.image as { width: number; height: number };
          const imageAspect = img.width / img.height;
          const uvScale = material.uniforms.uUvScale.value as THREE.Vector2;
          if (imageAspect > CARD_RATIO) {
            uvScale.set(CARD_RATIO / imageAspect, 1);
          } else {
            uvScale.set(1, imageAspect / CARD_RATIO);
          }

          material.uniforms.uMap.value = texture;
          textures.push(texture);
          loaded[index] = true;
          requestRender();
        },
        undefined,
        () => {
          console.warn(`Could not load showcase image: ${project.imageUrl}`);
        },
      );
    });

    function resize() {
      if (disposed) return;
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
      renderer.setSize(viewportWidth, viewportHeight, false);

      const fov =
        (2 * Math.atan(viewportHeight / (2 * cameraDistance)) * 180) / Math.PI;
      camera.fov = fov;
      camera.aspect = viewportWidth / Math.max(1, viewportHeight);
      camera.updateProjectionMatrix();

      const mobile = viewportWidth <= 620;
      cardWidth =
        1.3 *
        (mobile
          ? Math.min(viewportWidth * 0.8, 420)
          : clamp(viewportWidth * 0.25, 320, 560));
      cardHeight = cardWidth / CARD_RATIO;

      materials.forEach((material) => {
        material.uniforms.uWidth.value = cardWidth;
        material.uniforms.uHeight.value = cardHeight;
      });

      requestRender();
    }

    function renderScene(now: number) {
      frame = 0;
      if (disposed) return;

      // Smoothed scroll velocity -> pages flex in the direction of travel
      // while moving and relax back to flat once the spring settles.
      const dt = clamp((now - lastTime) / 1000, 0.008, 0.05);
      lastTime = now;
      const instant = (currentProgress - lastProgress) / dt;
      lastProgress = currentProgress;
      velocity += (instant - velocity) * Math.min(1, dt * 10);

      const p = clamp(currentProgress, 0, N - 1);
      const mobile = viewportWidth <= 620;

      // Diagonal lane: stepping to the NEXT project moves down-left,
      // previous projects sit up-right.
      const centerX = mobile ? 0 : -viewportWidth * 0.012;
      const centerY = viewportHeight * (mobile ? 0.02 : 0.05);
      const spacingX = viewportWidth * (mobile ? 0.05 : 0.1);
      const spacingY = Math.max(
        viewportHeight * (mobile ? 0.34 : 0.37),
        cardHeight * 1.25,
      );

      const dynamic = reducedMotion ? 0 : clamp(velocity * 0.075, -0.16, 0.16);

      meshes.forEach((mesh, index) => {
        const delta = index - p;
        const past = delta < 0;
        const t = Math.abs(delta);
        const material = materials[index];

        // position along the diagonal lane (passed sheets pile up at the top)
        const e = past ? -stackDistance(t) : t;

        // Keep the current/center sheet completely flat. Neighbouring sheets
        // get only a subtle curl, with a small scroll-direction wiggle layered on.
        const k = Math.min(t, 1);
        const eased = 1 - (1 - k) * (1 - k);
        const centerBlend = clamp(t / 0.32, 0, 1);
        const staticBend = past ? eased * 0.24 : -eased * 0.14;
        const scrollWiggle = dynamic * (1 - eased * 0.65) * centerBlend;
        const bend =
          t < 0.025 ? 0 : clamp(staticBend + scrollWiggle, -0.3, 0.3);

        const opacity = past
          ? clamp(1 - Math.max(0, t - 3) * 1.2, 0, 1)
          : clamp(1 - Math.max(0, t - 1.2) * 2.5, 0, 1);

        material.uniforms.uBend.value = bend;
        material.uniforms.uOpacity.value = opacity;

        // Let the surrounding sheets sit diagonally, but ease the active sheet
        // into a clean rectangular shape as it reaches the center.
        const skewAmount = clamp(t / 0.9, 0, 1);
        const skew = material.uniforms.uSkew.value as THREE.Vector2;
        skew.set(0.17 * skewAmount, 0.08 * skewAmount);

        mesh.visible = loaded[index] && opacity > 0.005;
        mesh.position.x = centerX - e * spacingX;
        mesh.position.y = centerY - e * spacingY;
        mesh.position.z = -t * 40;
        const scale = 1 - Math.min(t, 3) * 0.015;
        mesh.scale.set(scale, scale, 1);
        mesh.renderOrder = 100 - Math.round(t * 10);
      });

      renderer.render(scene, camera);

      // keep animating until the live bend has fully relaxed
      if (Math.abs(velocity) > 0.004 || Math.abs(instant) > 0) requestRender();
    }

    function requestRender() {
      if (disposed || frame !== 0) return;
      frame = window.requestAnimationFrame(renderScene);
    }

    const unsubscribe = progress.on("change", (value) => {
      currentProgress = value;
      requestRender();
    });

    window.addEventListener("resize", resize);
    resize();
    requestRender();

    return () => {
      disposed = true;
      unsubscribe();
      window.removeEventListener("resize", resize);
      if (frame !== 0) window.cancelAnimationFrame(frame);
      meshes.forEach((mesh) => scene.remove(mesh));
      geometry.dispose();
      materials.forEach((material) => material.dispose());
      textures.forEach((texture) => texture.dispose());
      renderer.dispose();
    };
  }, [progress, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="showcase-webgl-canvas"
      aria-hidden="true"
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  DOM pieces                                                                */
/* -------------------------------------------------------------------------- */

function Fade({
  progress,
  index,
  className = "",
  children,
}: {
  progress: MotionValue<number>;
  index: number;
  className?: string;
  children: React.ReactNode;
}) {
  const opacity = useTransform(progress, (value) =>
    clamp(1 - Math.abs(value - index) * 2.2, 0, 1),
  );
  const blur = useTransform(
    progress,
    (value) => `blur(${Math.min(Math.abs(value - index) * 8, 8)}px)`,
  );
  const y = useTransform(progress, (value) => (index - value) * 20);

  return (
    <motion.div
      className={`showcase-fade ${className}`}
      style={{ opacity, filter: blur, y }}
    >
      {children}
    </motion.div>
  );
}

function ListItem({
  project,
  index,
  progress,
  onSelect,
}: {
  project: Project;
  index: number;
  progress: MotionValue<number>;
  onSelect: () => void;
}) {
  const opacity = useTransform(progress, (value) =>
    Math.max(0.17, 1 - Math.abs(value - index) * 0.62),
  );
  const scale = useTransform(
    progress,
    (value) => 1 - Math.min(Math.abs(value - index), 2) * 0.035,
  );

  return (
    <motion.a
      href={`#project-${project.id}`}
      onClick={(event) => {
        event.preventDefault();
        onSelect();
      }}
      style={{
        opacity,
        scale,
        top: index * ITEM_H - ITEM_H / 2,
        height: ITEM_H,
      }}
      className="showcase-list-item"
    >
      <span className="showcase-eyebrow">{project.category}</span>
      <span className="showcase-list-title">{project.title}</span>
      <span className="showcase-list-dash" />
      <span className="showcase-list-description">{project.description}</span>
    </motion.a>
  );
}

export default function ProjectShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 125,
    damping: 30,
    mass: 0.42,
  });
  const progress = useTransform(
    reducedMotion ? scrollYProgress : smoothProgress,
    (value) => value * (N - 1),
  );
  const listY = useTransform(progress, (value) => -value * ITEM_H);

  useMotionValueEvent(progress, "change", (value) => {
    const next = clamp(Math.round(value), 0, N - 1);
    setActive((current) => (current === next ? current : next));
  });

  const scrollToProject = (index: number) => {
    const element = containerRef.current;
    if (!element) return;
    const top = element.getBoundingClientRect().top + window.scrollY;
    const range = element.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + (index / Math.max(1, N - 1)) * range,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <>
      <style>{`
        .showcase-root {
          --showcase-bg: #efeeec;
          --showcase-ink: #171715;
          --showcase-muted: #777570;
          position: relative;
          color: var(--showcase-ink);
          background: var(--showcase-bg);
          font-family: Arial, Helvetica, sans-serif;
          isolation: isolate;
        }

        .showcase-scroll-space {
          position: relative;
          height: ${N * 100}vh;
          height: ${N * 100}svh;
          background: #efeeec;
        }

        .showcase-stage {
          position: sticky;
          top: 0;
          width: 100%;
          height: 100vh;
          height: 100svh;
          min-height: 520px;
          overflow: hidden;
          background: #efeeec;
          isolation: isolate;
        }

        .showcase-webgl-canvas {
          position: absolute;
          z-index: 5;
          inset: 0;
          display: block;
          width: 100%;
          height: 100%;
          pointer-events: none;
          filter: drop-shadow(0 24px 25px rgba(20, 19, 18, 0.17));
        }

        .showcase-left-meta {
          position: absolute;
          z-index: 10;
          left: clamp(20px, 3.2vw, 54px);
          top: 41%;
          width: 20%;
          max-width: 260px;
          font-size: 13px;
          line-height: 1.5;
        }

        .showcase-eyebrow,
        .showcase-muted {
          display: block;
          color: var(--showcase-muted);
          font-size: clamp(11px, 0.72vw, 14px);
          line-height: 1.4;
        }

        .showcase-left-meta p {
          margin: 14px 0 0;
          max-width: 26ch;
        }

        .showcase-index {
          position: absolute;
          z-index: 12;
          left: clamp(20px, 3.2vw, 54px);
          bottom: 38px;
          pointer-events: none;
        }

        .showcase-index-label {
          display: block;
          margin-bottom: 2px;
          color: var(--showcase-muted);
          font-size: 11px;
          font-weight: 600;
        }

        .showcase-index-number {
          display: block;
          font-size: clamp(84px, 13.8vw, 202px);
          font-weight: 700;
          letter-spacing: -0.105em;
          line-height: 0.82;
        }

        .showcase-index-total {
          display: block;
          margin: 12px 0 0 5px;
          font-size: 12px;
          font-weight: 700;
        }

        .showcase-list-window {
          position: absolute;
          z-index: 15;
          top: 0;
          right: clamp(20px, 4vw, 64px);
          width: 26%;
          height: 100%;
          overflow: hidden;
          mask-image: linear-gradient(
            to bottom,
            transparent,
            #000 21%,
            #000 79%,
            transparent
          );
          -webkit-mask-image: linear-gradient(
            to bottom,
            transparent,
            #000 21%,
            #000 79%,
            transparent
          );
        }

        .showcase-list-track {
          position: absolute;
          inset: 50% 0 auto;
        }

        .showcase-list-item {
          position: absolute;
          inset-inline: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px 2px;
          text-align: center;
          text-decoration: none;
          color: inherit;
          cursor: pointer;
        }

        .showcase-list-title {
          font-size: clamp(20px, 1.5vw, 30px);
          font-weight: 400;
          letter-spacing: -0.045em;
          line-height: 1.05;
          text-transform: uppercase;
        }

        .showcase-list-dash {
          width: 14px;
          height: 1px;
          background: currentColor;
          opacity: 0.32;
        }

        .showcase-list-description {
          display: block;
          max-width: 34ch;
          color: #66645f;
          font-size: clamp(13px, 0.9vw, 17px);
          line-height: 1.45;
        }

        .showcase-fade {
          position: absolute;
          inset: 0;
        }

        .showcase-mobile-info {
          display: none;
        }

        .showcase-footer {
          position: absolute;
          z-index: 20;
          left: clamp(20px, 3.2vw, 54px);
          right: clamp(20px, 3.2vw, 54px);
          bottom: 17px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--showcase-muted);
          font-size: 11px;
          pointer-events: none;
        }

        .showcase-footer span:last-child {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--showcase-ink);
        }

        .showcase-progress-track {
          position: absolute;
          z-index: 25;
          left: 0;
          right: 0;
          bottom: 0;
          height: 2px;
          background: rgba(23, 23, 21, 0.07);
        }

        .showcase-progress-fill {
          width: 100%;
          height: 100%;
          background: var(--showcase-ink);
          transform-origin: left center;
        }

        @media (max-width: 900px) {
          .showcase-left-meta {
            display: none;
          }

          .showcase-list-window {
            right: 20px;
            width: 30%;
          }

          .showcase-list-description {
            max-width: 28ch;
          }
          .showcase-index-number {
            font-size: clamp(78px, 15vw, 140px);
          }
        }

        @media (max-width: 620px) {
          .showcase-scroll-space {
            height: ${N * 92}svh;
          }
          .showcase-stage {
            min-height: 560px;
          }
          .showcase-webgl-canvas {
            filter: drop-shadow(0 16px 20px rgba(20, 19, 18, 0.16));
          }
          .showcase-list-window {
            display: none;
          }

          .showcase-index {
            left: 18px;
            bottom: 57px;
            width: 43%;
          }

          .showcase-index-label {
            font-size: 10px;
          }
          .showcase-index-number {
            font-size: clamp(70px, 21vw, 104px);
          }
          .showcase-index-total {
            margin-top: 8px;
            font-size: 11px;
          }

          .showcase-mobile-info {
            position: absolute;
            z-index: 15;
            display: block;
            right: 18px;
            bottom: 20%;
            width: 52%;
            min-height: 120px;
            text-align: right;
          }

          .showcase-mobile-info h2 {
            margin: 6px 0 8px;
            font-size: 19px;
            font-weight: 400;
            line-height: 1.05;
            letter-spacing: -0.045em;
            text-transform: uppercase;
          }

          .showcase-mobile-info p {
            margin: 0;
            color: #66645f;
            font-size: 12px;
            line-height: 1.4;
          }

          .showcase-mobile-info .showcase-eyebrow {
            font-size: 11px;
          }

          .showcase-footer {
            left: 18px;
            right: 18px;
            bottom: 14px;
            font-size: 10px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .showcase-webgl-canvas {
            filter: none;
          }
        }
      `}</style>

      <main className="showcase-root" id="work">
        <section
          ref={containerRef}
          className="showcase-scroll-space"
          aria-label="Selected projects"
        >
          <div className="showcase-stage">
            <CurvedProjectStage
              progress={progress}
              reducedMotion={reducedMotion}
            />

            <div className="showcase-left-meta" aria-hidden="true">
              <span className="showcase-muted">Selected work</span>
              <p>
                Independent creative studio
                <br />
                Design · Digital · Direction
              </p>
            </div>

            <div className="showcase-list-window" aria-label="Project list">
              <motion.div className="showcase-list-track" style={{ y: listY }}>
                {PROJECTS.map((project, index) => (
                  <ListItem
                    key={project.id}
                    project={project}
                    index={index}
                    progress={progress}
                    onSelect={() => scrollToProject(index)}
                  />
                ))}
              </motion.div>
            </div>

            <div className="showcase-mobile-info" aria-live="polite">
              {PROJECTS.map((project, index) => (
                <Fade key={project.id} progress={progress} index={index}>
                  <span className="showcase-eyebrow">{project.category}</span>
                  <h2>{project.title}</h2>
                  <p>{project.description}</p>
                </Fade>
              ))}
            </div>

            <div className="showcase-index" aria-hidden="true">
              <span className="showcase-index-label">Selected work</span>
              <motion.span
                className="showcase-index-number"
                key={active}
                initial={
                  reducedMotion
                    ? false
                    : { opacity: 0, y: 24, filter: "blur(10px)" }
                }
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                {pad(active + 1)}
              </motion.span>
              <span className="showcase-index-total">/{pad(N)}</span>
            </div>

            <footer className="showcase-footer">
              <span>Scroll to explore</span>
              <span>
                Project {active + 1} of {N}
                <ArrowUpRight size={13} />
              </span>
            </footer>

            <div className="showcase-progress-track" aria-hidden="true">
              <motion.div
                className="showcase-progress-fill"
                style={{ scaleX: scrollYProgress }}
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
