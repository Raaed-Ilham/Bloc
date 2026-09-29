import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
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
}

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
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
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
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop",
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
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
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
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1200&auto=format&fit=crop",
  },
];

const N = PROJECTS.length;
const ITEM_H = 190;
const pad = (n: number) => String(n).padStart(2, "0");

function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}

function useImage(src: string) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    let cancelled = false;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = src;
    image.onload = () => {
      if (!cancelled) setImg(image);
    };
    return () => {
      cancelled = true;
    };
  }, [src]);
  return img;
}

function coverRect(img: HTMLImageElement, w: number, h: number) {
  const ir = img.naturalWidth / img.naturalHeight;
  const cr = w / h;
  if (ir > cr) {
    const sh = img.naturalHeight;
    const sw = sh * cr;
    return { sx: (img.naturalWidth - sw) / 2, sy: 0, sw, sh };
  }
  const sw = img.naturalWidth;
  const sh = sw / cr;
  return { sx: 0, sy: (img.naturalHeight - sh) / 2, sw, sh };
}

const SLICE_PX = 5;
const MAX_SLICES = 140;

function drawCurl(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
  bend: number,
) {
  ctx.clearRect(0, 0, w, h);
  if (!img || w <= 0 || h <= 0) return;

  const { sx, sy, sw, sh } = coverRect(img, w, h);
  const b = Math.min(Math.max(bend, 0), 1);

  if (b < 0.01) {
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
    return;
  }

  const slices = Math.min(MAX_SLICES, Math.max(24, Math.round(w / SLICE_PX)));
  const sliceW = w / slices;
  const curlStart = 1 - b * 0.85;
  const maxAngle = b * (Math.PI / 2.1);
  const radius = h * 0.22;

  for (let i = 0; i < slices; i++) {
    const t = i / slices;
    const srcX = sx + t * sw;
    const srcSliceW = sw / slices;

    const angle =
      t > curlStart ? ((t - curlStart) / (1 - curlStart)) * maxAngle : 0;
    const foreshorten = Math.max(Math.cos(angle), 0.08);
    const lift = Math.sin(angle) * radius;

    const dw = sliceW * foreshorten;
    const dx = t * w + (sliceW - dw) / 2;
    const dy = -lift * 0.35;
    const dh = h - lift * 0.12;

    ctx.drawImage(img, srcX, sy, srcSliceW, sh, dx, dy, dw, dh);

    if (angle > 0) {
      const shade = Math.min(angle / maxAngle, 1);
      ctx.fillStyle = `rgba(10,8,6,${shade * 0.55})`;
      ctx.fillRect(dx, dy, dw, dh);
    }
  }

  const foldX = curlStart * w + (w - curlStart * w) * 0.35;
  const grad = ctx.createLinearGradient(foldX - 14, 0, foldX + 14, 0);
  grad.addColorStop(0, "rgba(255,255,255,0)");
  grad.addColorStop(0.5, `rgba(255,255,255,${0.22 * b})`);
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(foldX - 14, 0, 28, h);
}

function CurledImage({
  src,
  bend,
}: {
  src: string;
  bend: MotionValue<number>;
}) {
  const [wrapRef, size] = useElementSize<HTMLDivElement>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const img = useImage(src);
  const dpr =
    typeof window !== "undefined"
      ? Math.min(window.devicePixelRatio || 1, 2)
      : 1;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !img || !size.width || !size.height) return;

    canvas.width = size.width * dpr;
    canvas.height = size.height * dpr;
    canvas.style.width = `${size.width}px`;
    canvas.style.height = `${size.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let raf = 0;
    const render = () =>
      drawCurl(ctx, img, size.width, size.height, bend.get());
    render();

    const unsub = bend.on("change", () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(render);
    });
    return () => {
      unsub();
      cancelAnimationFrame(raf);
    };
  }, [img, size.width, size.height, dpr, bend]);

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}

function Sheet({
  project,
  i,
  p,
}: {
  project: Project;
  i: number;
  p: MotionValue<number>;
}) {
  const r = [i - 2, i - 1, i, i + 1, i + 2];
  const y = useTransform(p, r, ["95vh", "46vh", "0vh", "-38vh", "-82vh"]);
  const x = useTransform(p, r, ["-6vw", "-3vw", "0vw", "4vw", "9vw"]);
  const rotateX = useTransform(p, r, [22, 14, 4, 12, 20]);
  const rotateY = useTransform(p, r, [-14, -9, -4, -10, -16]);
  const rotateZ = useTransform(p, r, [-6, -3, -1, 3, 8]);
  const scale = useTransform(p, r, [0.9, 0.95, 1, 0.96, 0.9]);
  const bend = useTransform(p, r, [0.85, 0.35, 0, 0.55, 0.9]);

  return (
    <motion.div
      aria-hidden
      className="absolute left-1/2 top-[56%] md:left-[50%]"
      style={{
        width: "clamp(250px, 40vw, 620px)",
        height: "calc(clamp(250px, 40vw, 620px) * 0.72)",
        marginLeft: "calc(clamp(250px, 40vw, 620px) / -2)",
        marginTop: "calc(clamp(250px, 40vw, 620px) * 0.72 / -2)",
        x,
        y,
        rotateX,
        rotateY,
        rotateZ,
        scale,
        zIndex: i,
        transformStyle: "preserve-3d",
        willChange: "transform",
        boxShadow: "0 30px 60px -20px rgba(18,18,18,0.35)",
        borderRadius: "2px",
        overflow: "hidden",
      }}
    >
      <CurledImage src={project.imageUrl} bend={bend} />
    </motion.div>
  );
}

function Fade({
  p,
  i,
  className = "",
  children,
}: {
  p: MotionValue<number>;
  i: number;
  className?: string;
  children: React.ReactNode;
}) {
  const opacity = useTransform(p, (v) =>
    Math.max(0, 1 - Math.abs(v - i) * 2.2),
  );
  const filter = useTransform(
    p,
    (v) => `blur(${Math.min(Math.abs(v - i) * 18, 12)}px)`,
  );
  const y = useTransform(p, (v) => (i - v) * 26);
  return (
    <motion.div
      style={{ opacity, filter, y }}
      className={`absolute inset-0 ${className}`}
    >
      {children}
    </motion.div>
  );
}

function ListItem({
  project,
  i,
  p,
  onSelect,
}: {
  project: Project;
  i: number;
  p: MotionValue<number>;
  onSelect: () => void;
}) {
  const opacity = useTransform(p, (v) =>
    Math.max(0.18, 1 - Math.abs(v - i) * 0.6),
  );
  const scale = useTransform(p, (v) => 1 - Math.min(Math.abs(v - i), 2) * 0.04);
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      style={{ opacity, scale, top: i * ITEM_H - ITEM_H / 2, height: ITEM_H }}
      className="absolute inset-x-0 flex flex-col items-center justify-center gap-2 px-6 text-center"
    >
      <span className="text-xs text-[#73716b]">{project.category}</span>
      <span className="text-2xl font-medium uppercase tracking-tight text-[#121212]">
        {project.title}
      </span>
      <span className="h-px w-6 bg-[#121212]/40" />
      <span className="line-clamp-3 max-w-[30ch] text-xs leading-relaxed text-[#73716b]">
        {project.description}
      </span>
    </motion.button>
  );
}

export default function ProjectShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.5,
  });

  const p = useTransform(
    reduced ? scrollYProgress : smooth,
    (v) => v * (N - 1),
  );
  const listY = useTransform(p, (v) => -v * ITEM_H);

  useMotionValueEvent(p, "change", (v) => {
    const r = Math.round(v);
    if (r !== active) setActive(r);
  });

  const scrollToProject = (i: number) => {
    const el = containerRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (i / (N - 1)) * range, behavior: "smooth" });
  };

  return (
    <div
      ref={containerRef}
      style={{ height: `${N * 100}vh` }}
      className="relative bg-[#eae8e4] text-[#121212] architectural-grid-bg"
    >
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ perspective: "1600px", perspectiveOrigin: "50% 40%" }}
      >
        {/* Header */}
        <header className="absolute inset-x-0 top-0 z-30 flex items-start justify-between px-6 pt-6 text-xs font-mono-meta md:px-12">
          <div className="font-bold tracking-tighter">
            STUDIO ARCH.®
            <span className="block text-[10px] font-normal text-[#73716b]">
              © 2026
            </span>
          </div>
          <nav className="hidden flex-col gap-0.5 text-lg font-medium leading-none tracking-tight md:flex">
            <a href="#work" className="hover:opacity-50 transition-opacity">
              → Work
            </a>
            <a href="/about" className="hover:opacity-50 transition-opacity">
              About
            </a>
            <a href="#process" className="hover:opacity-50 transition-opacity">
              Process
            </a>
            <a href="#contact" className="hover:opacity-50 transition-opacity">
              Contact
            </a>
          </nav>
          <a
            href="mailto:inquiries@studioarch.com"
            className="underline underline-offset-2"
          >
            For inquiries
          </a>
        </header>

        {/* Curled sheets */}
        <div
          className="absolute inset-0 z-10"
          style={{ transformStyle: "preserve-3d" }}
        >
          {PROJECTS.map((project, i) => (
            <Sheet key={project.id} project={project} i={i} p={p} />
          ))}
        </div>

        {/* Left: metadata (md+) */}
        <div className="pointer-events-none absolute left-6 top-40 hidden w-[24%] md:left-12 md:block z-20">
          <p className="mb-6 text-xs text-[#73716b]">Selected work</p>
          <div className="relative h-56">
            {PROJECTS.map((project, i) => (
              <Fade
                key={project.id}
                p={p}
                i={i}
                className="space-y-4 text-xs font-mono-meta"
              >
                <div>
                  <span className="mb-1 block text-[10px] text-[#73716b]">
                    Client
                  </span>
                  {project.client}
                </div>
                <div>
                  <span className="mb-1 block text-[10px] text-[#73716b]">
                    Role
                  </span>
                  {project.role}
                </div>
                <div>
                  <span className="mb-1 block text-[10px] text-[#73716b]">
                    Launch
                  </span>
                  {project.launch}
                </div>
                <div>
                  <span className="mb-1 block text-[10px] text-[#73716b]">
                    Recognition
                  </span>
                  {project.recognition.map((r) => (
                    <div key={r}>{r}</div>
                  ))}
                </div>
              </Fade>
            ))}
          </div>
        </div>

        {/* Bottom-left: giant index + title */}
        <div className="pointer-events-none absolute bottom-16 left-6 z-20 md:bottom-10 md:left-12">
          <div className="relative h-[5.5rem] w-[15rem] md:h-[13rem] md:w-[26rem]">
            {PROJECTS.map((project, i) => (
              <Fade key={project.id} p={p} i={i}>
                <span className="block text-[5.5rem] font-bold leading-none tracking-tighter md:text-[12rem]">
                  {pad(i + 1)}
                </span>
              </Fade>
            ))}
          </div>
          <span className="ml-1 text-xs font-mono-meta text-[#73716b]">
            /{pad(N)}
          </span>
          <div className="relative mt-2 h-6 md:hidden">
            {PROJECTS.map((project, i) => (
              <Fade
                key={project.id}
                p={p}
                i={i}
                className="text-sm font-semibold uppercase"
              >
                {project.title}
              </Fade>
            ))}
          </div>
        </div>

        {/* Right: scroll-linked project list (md+) */}
        <div
          className="absolute right-8 top-0 z-20 hidden h-full w-[26%] md:block"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)",
          }}
        >
          <motion.div
            className="absolute inset-x-0 top-1/2"
            style={{ y: listY }}
          >
            {PROJECTS.map((project, i) => (
              <ListItem
                key={project.id}
                project={project}
                i={i}
                p={p}
                onSelect={() => scrollToProject(i)}
              />
            ))}
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-between px-6 pb-4 text-xs font-mono-meta text-[#73716b] md:px-12">
          <span>Scroll</span>
          <span className="flex items-center gap-1">
            Project {active + 1} of {N}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </footer>
        <motion.div
          className="absolute inset-x-0 bottom-0 z-30 h-0.5 origin-left bg-[#121212]"
          style={{ scaleX: scrollYProgress }}
        />
      </div>
    </div>
  );
}
