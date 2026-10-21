import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/* ── Hand-drawn icon set ─────────────────────────────────────────────────── */

const CertIcon = () => (
  <div className="flex w-11 flex-col items-center rounded border-[2.5px] border-[#121212] bg-white px-2.5 py-2 shadow-sm">
    <span className="border-b-[1.5px] border-[#121212] pb-0.5 text-[8px] font-black leading-none tracking-tighter">
      SOTD
    </span>
    <div className="mt-1.5 w-full space-y-1">
      <div className="h-[1.5px] w-full rounded-full bg-[#121212]" />
      <div className="mx-auto h-[1.5px] w-3/4 rounded-full bg-[#121212]" />
      <div className="mx-auto h-[1.5px] w-1/2 rounded-full bg-[#121212]" />
    </div>
  </div>
);

const CameraIcon = () => (
  <div className="flex h-11 w-11 items-center justify-center rounded-full border-[2.5px] border-[#121212] bg-white shadow-sm">
    <div className="flex h-6 w-6 items-center justify-center rounded-full border-[1.5px] border-[#121212] bg-[#1a1a1a]">
      <div className="h-2 w-2 rounded-full bg-white" />
    </div>
  </div>
);

const MuseIcon = () => (
  <svg viewBox="0 0 60 60" className="h-11 w-11 drop-shadow-sm">
    <circle
      cx="30"
      cy="30"
      r="26"
      fill="white"
      stroke="#121212"
      strokeWidth="2.5"
    />
    <path
      d="M 8 28 Q 30 8, 52 28 Q 44 14, 30 15 Q 16 14, 8 28 Z"
      fill="#121212"
    />
    <path
      d="M 18 31 Q 23 27, 27 31"
      fill="none"
      stroke="#121212"
      strokeLinecap="round"
      strokeWidth="2"
    />
    <path
      d="M 33 31 Q 37 27, 42 31"
      fill="none"
      stroke="#121212"
      strokeLinecap="round"
      strokeWidth="2"
    />
    <line x1="16" x2="20" y1="36" y2="36" stroke="#dc2626" strokeWidth="1.5" />
    <line x1="40" x2="44" y1="36" y2="36" stroke="#dc2626" strokeWidth="1.5" />
    <path
      d="M 28 38 Q 30 40, 32 38"
      fill="none"
      stroke="#121212"
      strokeWidth="1.5"
    />
  </svg>
);

const WatchIcon = () => (
  <div className="flex flex-col items-center">
    <div className="h-2 w-3 rounded-t-sm bg-[#121212]" />
    <div className="flex h-9 w-9 items-center justify-center rounded-full border-[2.5px] border-[#121212] bg-white shadow-sm">
      <div className="relative flex h-6 w-6 items-center justify-center">
        <div className="absolute top-0.5 h-2.5 w-[1.5px] bg-[#121212]" />
        <div className="absolute right-1 h-[1.5px] w-2 bg-[#121212]" />
        <div className="h-1 w-1 rounded-full bg-[#121212]" />
      </div>
    </div>
    <div className="h-2 w-3 rounded-b-sm bg-[#121212]" />
  </div>
);

const CrestIcon = () => (
  <div className="rounded-full border-[2.5px] border-[#121212] bg-white p-2 shadow-sm">
    <svg viewBox="0 0 32 32" className="h-5 w-5">
      <circle
        cx="11"
        cy="22"
        r="5"
        fill="none"
        stroke="#121212"
        strokeWidth="2.5"
      />
      <circle cx="11" cy="22" r="1.7" fill="#121212" />
      <path d="M 27 10 L 10 16 L 9 20 L 26 14 Z" fill="#121212" />
      <path
        d="M 15 22 L 6 25"
        stroke="#121212"
        strokeLinecap="round"
        strokeWidth="2.5"
      />
    </svg>
  </div>
);

const CatIcon = () => (
  <svg viewBox="0 0 50 42" className="h-9 w-11 drop-shadow-sm">
    <polygon
      points="8,16 16,2 22,14"
      fill="white"
      stroke="#121212"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <polygon
      points="42,16 34,2 28,14"
      fill="white"
      stroke="#121212"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <ellipse
      cx="25"
      cy="24"
      rx="20"
      ry="15"
      fill="white"
      stroke="#121212"
      strokeWidth="2.75"
    />
    <circle cx="18" cy="22" r="2" fill="#121212" />
    <circle cx="32" cy="22" r="2" fill="#121212" />
    <circle cx="25" cy="26" r="1.2" fill="#121212" />
    <path
      d="M 22 28 Q 25 31, 28 28"
      fill="none"
      stroke="#121212"
      strokeWidth="1.5"
    />
  </svg>
);

const GamepadIcon = () => (
  <svg
    viewBox="0 0 60 40"
    className="h-8 w-11 drop-shadow-sm"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="rotate(-18 30 20)">
      <path
        d="M10 13C12 8 17 6 22 7L38 7C43 6 48 8 50 13L54 27C55 31 52 34 49 34C46 34 43 30 41 27L19 27C17 30 14 34 11 34C8 34 5 31 6 27L10 13Z"
        fill="#EAE8E4"
        stroke="#121212"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M19 14V22M15 18H23"
        stroke="#121212"
        strokeWidth="2.3"
        strokeLinecap="round"
      />

      <circle cx="39" cy="15" r="2.4" fill="#121212" />
      <circle cx="45" cy="19" r="2.4" fill="#121212" />

      <circle
        cx="30"
        cy="12"
        r="2"
        fill="white"
        stroke="#121212"
        strokeWidth="1.5"
      />

      <path
        d="M26 27C28 29 32 29 34 27"
        stroke="#121212"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </g>
  </svg>
);

const PlantIcon = () => (
  <svg viewBox="0 0 45 50" className="h-11 w-9 drop-shadow-sm">
    <path
      d="M 22 6 C 12 16, 8 30, 22 45 C 36 30, 32 16, 22 6 Z"
      fill="white"
      stroke="#121212"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path d="M 22 8 L 22 44" stroke="#121212" strokeWidth="2" />
    <path
      d="M 18 20 L 10 22 M 18 28 L 12 32 M 26 20 L 34 22 M 26 28 L 32 32"
      stroke="#121212"
      strokeLinecap="round"
      strokeWidth="1.75"
    />
  </svg>
);

const NotebookIcon = () => (
  <div className="flex h-11 w-8 -rotate-12 flex-col items-center justify-center rounded-sm border-[2px] border-[#121212] bg-white p-1 shadow-sm">
    <div className="mb-1 h-3 w-3 rounded-full border-[1.25px] border-[#121212]" />
    <div className="h-[1.5px] w-4 bg-[#121212]" />
  </div>
);

/* ── Cap Illustration ────────────────────────────────────────────────────── */

function CapIllustration({ id }: { id: string }) {
  return (
    <svg
      viewBox="0 0 200 120"
      className="w-[85%] mx-auto drop-shadow-md"
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.15" fill="#222" />
        </pattern>
      </defs>
      <path
        d="M 30 95 C 22 25, 75 10, 105 10 C 138 10, 185 25, 178 95 Z"
        fill="white"
        stroke="#121212"
        strokeWidth="4.5"
      />
      <path
        d="M 32 93 C 24 27, 76 12, 105 12 C 136 12, 183 27, 176 93 Z"
        fill={`url(#${id})`}
      />
      <path
        d="M 105 10 Q 103 55, 102 95"
        stroke="#121212"
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M 22 92 C 16 92, 22 112, 55 116 C 115 124, 172 116, 184 102 C 188 97, 182 93, 170 93 Z"
        fill="#121212"
        stroke="#121212"
        strokeWidth="2.5"
      />
      <path
        d="M 34 100 C 75 108, 130 104, 156 95"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
        strokeDasharray="2 2"
        opacity="0.5"
      />
      <circle cx="105" cy="9" r="4.5" fill="#121212" />
    </svg>
  );
}

/* ── Face Illustration ───────────────────────────────────────────────────── */

function FaceIllustration({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      viewBox="0 0 380 300"
      preserveAspectRatio="none"
      className="h-full w-full"
    >
      {isOpen && (
        <>
          <ellipse cx="190" cy="38" rx="66" ry="17" fill="#121212" />
          <ellipse cx="190" cy="40" rx="58" ry="12" fill="#262626" />
        </>
      )}

      {/* jaw + chin bowl */}
      <path
        d="M 124 38 C 115 140, 138 240, 190 240 C 242 240, 265 140, 256 38"
        fill="#eae8e4"
        stroke="#121212"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* glasses arms tuck behind the ears */}
      <path
        d="M 136 119 L 116 119 M 250 119 L 270 119"
        stroke="#121212"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* left ear + earring */}
      <path
        d="M 124 104 C 104 104, 104 144, 126 148"
        fill="#eae8e4"
        stroke="#121212"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M 112 125 L 120 133 M 120 125 L 112 133"
        stroke="#121212"
        strokeWidth="2.75"
        strokeLinecap="round"
      />

      {/* right ear */}
      <path
        d="M 256 104 C 276 104, 276 144, 254 148"
        fill="#eae8e4"
        stroke="#121212"
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      {/* temple hair block - seamlessly aligned with face rim */}
      <path
        d="M 124 38 C 121 62, 121 91, 126 119 C 132 113, 133 99, 131 82 C 129 63, 127 48, 124 38 Z"
        fill="#121212"
      />

      {/* eyebrows */}
      <path
        d={isOpen ? "M 148 84 L 184 78" : "M 148 96 L 184 93"}
        fill="none"
        stroke="#121212"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      <path
        d={isOpen ? "M 206 78 L 242 84" : "M 206 93 L 242 96"}
        fill="none"
        stroke="#121212"
        strokeWidth="6.5"
        strokeLinecap="round"
      />

      {/* glasses */}
      <rect
        x="136"
        y="106"
        width="48"
        height="42"
        rx="11"
        fill="white"
        stroke="#121212"
        strokeWidth="4.5"
      />
      <rect
        x="202"
        y="106"
        width="48"
        height="42"
        rx="11"
        fill="white"
        stroke="#121212"
        strokeWidth="4.5"
      />
      <path
        d="M 184 120 L 202 120"
        stroke="#121212"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      {/* eyes */}
      {isOpen ? (
        <>
          <g transform="translate(160, 127)">
            <path
              d="M 0 -9 Q 0 0, -9 0 Q 0 0, 0 9 Q 0 0, 9 0 Q 0 0, 0 -9 Z"
              fill="#121212"
            />
            <circle r="1.8" fill="white" />
          </g>
          <g transform="translate(226, 127)">
            <path
              d="M 0 -9 Q 0 0, -9 0 Q 0 0, 0 9 Q 0 0, 9 0 Q 0 0, 0 -9 Z"
              fill="#121212"
            />
            <circle r="1.8" fill="white" />
          </g>
        </>
      ) : (
        <>
          <path d="M 152 129 C 152 123, 168 123, 168 129 Z" fill="#121212" />
          <circle cx="160" cy="127" r="4" fill="#121212" />
          <circle cx="158.5" cy="125.5" r="1.3" fill="white" />
          <path d="M 218 129 C 218 123, 234 123, 234 129 Z" fill="#121212" />
          <circle cx="226" cy="127" r="4" fill="#121212" />
          <circle cx="224.5" cy="125.5" r="1.3" fill="white" />
        </>
      )}

      {/* nose */}
      <path
        d="M 194 123 L 193 151 L 200 151"
        fill="none"
        stroke="#121212"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* mouth */}
      {isOpen ? (
        <g>
          <path
            d="M 174 166 C 174 200, 222 200, 222 166 Z"
            fill="#121212"
            stroke="#121212"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
          <path
            d="M 176 166 Q 198 174, 220 166 L 220 173 Q 198 180, 176 173 Z"
            fill="white"
          />
          <path d="M 188 191 C 192 184, 204 184, 208 191 Z" fill="#e85c4a" />
        </g>
      ) : (
        <>
          <path
            d="M 180 184 Q 192 186, 208 180"
            fill="none"
            stroke="#121212"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path
            d="M 191 192 L 197 192"
            stroke="#121212"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}

/* ── Content & Non-Overlapping Radial Layout ─────────────────────────────── */

interface MindItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  angleDeg: number;
  radius: number;
  rotate: number;
  image: string;
  subtitle: string;
  description: string;
}

const MIND_ITEMS: MindItem[] = [
  {
    id: "awards",
    title: "Awards",
    icon: <CertIcon />,
    angleDeg: -162,
    radius: 195,
    rotate: -8,
    subtitle: "It's us on the wall",
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop",
    description:
      "He always says we were never the point of a website, but come on — we've been a source of motivation for years, opening doors to new clients and new opportunities.",
  },
  {
    id: "photography",
    title: "Photography",
    icon: <CameraIcon />,
    angleDeg: -126,
    radius: 200,
    rotate: 8,
    subtitle: "35mm prime mindset",
    image:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=800&auto=format&fit=crop",
    description:
      "Shooting 35mm and medium format around Saigon and Tokyo — the light, texture, and angles that end up feeding directly back into the design work.",
  },
  {
    id: "manga",
    title: "Manga & character",
    icon: <MuseIcon />,
    angleDeg: -90,
    radius: 205,
    rotate: -6,
    subtitle: "Visual storytelling core",
    image:
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop",
    description:
      "Deeply shaped by 90s anime line weight and expressive character sketching — the root of the studio's bold inking style, dressed up as tech minimalism.",
  },
  {
    id: "time",
    title: "Time & discipline",
    icon: <WatchIcon />,
    angleDeg: -54,
    radius: 200,
    rotate: 10,
    subtitle: "Precision mechanical design",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop",
    description:
      "Working across time zones from Ho Chi Minh City to Tokyo. Deep work blocks, focused execution, and an unreasonable attention to millisecond easing curves.",
  },
  {
    id: "cannon",
    title: "North London",
    icon: <CrestIcon />,
    angleDeg: -18,
    radius: 195,
    rotate: -10,
    subtitle: "Forever, apparently",
    image:
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800&auto=format&fit=crop",
    description:
      "A lifelong passion for crest geometry, sports typography heritage, and the specific kind of team camaraderie that fuels a high-intensity sprint week.",
  },
  {
    id: "cat",
    title: "Studio cat",
    icon: <CatIcon />,
    angleDeg: -144,
    radius: 125,
    rotate: -12,
    subtitle: "Co-pilot of the desk",
    image:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&auto=format&fit=crop",
    description:
      "Chief inspector of wireframes and keyboard squatter, currently listed on the studio wall as an honorary co-founder.",
  },
  {
    id: "gaming",
    title: "Play & gaming",
    icon: <GamepadIcon />,
    angleDeg: -108,
    radius: 130,
    rotate: 12,
    subtitle: "Haptic interface joy",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
    description:
      "Obsessed with tactile micro-interactions and the delight of a classic console menu — every interface should feel that responsive under a cursor.",
  },
  {
    id: "notebook",
    title: "Field notes",
    icon: <NotebookIcon />,
    angleDeg: -72,
    radius: 130,
    rotate: 4,
    subtitle: "Ink before pixels",
    image:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=800&auto=format&fit=crop",
    description:
      "Analog grid notebooks filled with rapid sketches and flowcharts, long before a single pixel gets touched in code.",
  },
  {
    id: "plant",
    title: "Monstera flora",
    icon: <PlantIcon />,
    angleDeg: -36,
    radius: 125,
    rotate: -10,
    subtitle: "Studio jungle energy",
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=800&auto=format&fit=crop",
    description:
      "Tropical flora providing biophilic balance to glowing screens — and a steady supply of leaf-vein curves that sneak into the design systems.",
  },
];

function arcPosition(
  angleDeg: number,
  radius: number,
  scaleFactor: number = 1,
) {
  const rad = (angleDeg * Math.PI) / 180;
  const r = radius * scaleFactor;
  return { x: Math.cos(rad) * r, y: Math.sin(rad) * r };
}

export default function AboutSection() {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<MindItem | null>(null);
  const [scaleFactor, setScaleFactor] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setScaleFactor(0.75);
      } else if (window.innerWidth < 1024) {
        setScaleFactor(0.88);
      } else {
        setScaleFactor(1);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeItem) {
          setActiveItem(null);
        } else if (isOpen) {
          setIsOpen(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeItem, isOpen]);

  return (
    <section
      id="about"
      className="relative min-h-screen w-full overflow-hidden bg-[#eae8e4] p-6 text-[#121212] architectural-grid-bg select-none md:p-12"
    >
      {/* Background Watermark Year */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-4 text-[28vw] font-bold leading-none tracking-tighter text-[#121212]/[0.06] md:px-16">
        <span>19</span>
        <span>96</span>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-6rem)] max-w-7xl flex-col justify-between">
        {/* Stage Center */}
        <div className="relative my-12 flex min-h-[460px] items-center justify-center">
          {/* Subtle Backdrop when Modal is Active */}
          <AnimatePresence>
            {activeItem && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveItem(null)}
                className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px]"
              />
            )}
          </AnimatePresence>

          {/* Active Detail Modal */}
          <AnimatePresence>
            {activeItem && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -6, y: 16 }}
                animate={{ opacity: 1, scale: 1, rotate: -3, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotate: -6, y: 16 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="fixed left-1/2 top-1/2 z-50 w-[88vw] max-w-80 -translate-x-1/2 -translate-y-1/2 rounded-xs border-2 border-[#121212] bg-white p-4 shadow-2xl md:absolute md:top-0 md:-translate-x-[calc(50%+230px)] md:translate-y-0"
              >
                <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-xs border border-neutral-300 bg-[#e2e0dc]">
                  <img
                    src={activeItem.image}
                    alt={activeItem.title}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-1.5 right-1.5 rounded bg-black/75 px-1.5 py-0.5 font-mono-meta text-[9px] font-bold uppercase text-white">
                    Studio & co-founder
                  </span>
                </div>
                <h3 className="mb-1 text-lg font-bold tracking-tight text-[#121212]">
                  {activeItem.title}
                </h3>
                <p className="mb-3 text-[10px] font-mono-meta uppercase tracking-wide text-[#dc2626]">
                  {activeItem.subtitle}
                </p>
                <p className="mb-5 text-xs leading-relaxed text-[#73716b]">
                  {activeItem.description}
                </p>
                <div className="flex items-center justify-between border-t border-neutral-200 pt-3">
                  <span className="text-[10px] font-mono-meta font-bold uppercase text-[#73716b]">
                    Portfolio archive
                  </span>
                  <button
                    onClick={() => setActiveItem(null)}
                    className="flex cursor-pointer items-center gap-1 text-[10px] font-mono-meta font-bold uppercase tracking-wide transition-colors hover:text-[#dc2626]"
                    aria-label="Close dialog"
                  >
                    Close <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive Head Stage */}
          <div className="relative flex flex-col items-center">
            {/* Tooltip on Hover */}
            <AnimatePresence>
              {isHovered && !isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.92 }}
                  transition={{ duration: 0.18 }}
                  className="absolute -top-[4.5rem] z-30 w-56 rounded-xs border border-[#121212] bg-[#121212] px-4 py-3 text-center shadow-xl pointer-events-none"
                >
                  <p className="text-xs font-semibold leading-snug text-white">
                    Ever wondered what's going on inside my head?
                  </p>
                  <div className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-[#121212]" />
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => {
                setIsOpen((v) => !v);
                setActiveItem(null);
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group relative cursor-pointer bg-transparent border-none p-0 outline-none focus:outline-none"
              aria-expanded={isOpen}
              aria-label="Toggle studio mind concepts"
            >
              {/* Radial Arc Items */}
              <AnimatePresence>
                {isOpen && (
                  <div className="pointer-events-none absolute inset-0 z-20">
                    {MIND_ITEMS.map((item) => {
                      const { x, y } = arcPosition(
                        item.angleDeg,
                        item.radius,
                        scaleFactor,
                      );
                      return (
                        <motion.button
                          key={item.id}
                          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            x,
                            y,
                            rotate: item.rotate,
                          }}
                          exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                          whileHover={{ scale: 1.18, zIndex: 40 }}
                          transition={{
                            type: "spring",
                            stiffness: 230,
                            damping: 17,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveItem(item);
                          }}
                          className="pointer-events-auto absolute left-1/2 top-1/2 -ml-6 -mt-6 flex h-12 w-12 items-center justify-center rounded-full transition-shadow duration-200 hover:drop-shadow-lg"
                          title={item.title}
                          aria-label={`View details for ${item.title}`}
                        >
                          {item.icon}
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </AnimatePresence>

              {/* Head SVG Container */}
              <div
                className="relative"
                style={{
                  width: "clamp(200px, 22vw, 288px)",
                  height: "clamp(220px, 24vw, 312px)",
                }}
              >
                {/* Scaled Cap Lift Animation */}
                <motion.div
                  animate={{
                    translateY: isOpen ? "-105px" : "50px",
                    translateX: isOpen ? "-20px" : "0px",
                    rotate: isOpen ? -16 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 210, damping: 20 }}
                  className="pointer-events-none absolute left-1/2 top-[6%] z-20 w-[58%] -translate-x-1/2"
                >
                  <CapIllustration id="cap-halftone" />
                </motion.div>

                {/* Face Base */}
                <div className="absolute left-0 top-[34%] z-10 h-[60%] w-full">
                  <FaceIllustration isOpen={isOpen} />
                </div>
              </div>

              <p className="mt-3 text-center text-[10px] font-mono-meta uppercase tracking-widest text-[#73716b] transition-colors group-hover:text-[#121212]">
                {isOpen ? "Click to close" : "Click to explore"}
              </p>
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="grid grid-cols-12 gap-6 border-t border-[#d3d0c9]/60 pt-6 text-xs font-mono-meta">
          <div className="col-span-12 md:col-span-4">
            <span className="mb-2 block text-[10px] uppercase text-[#73716b]">
              Capabilities
            </span>
            <ul className="space-y-1 font-medium text-[#121212]">
              <li>Architectural direction & masterplanning</li>
              <li>Spatial design & physical modeling</li>
              <li>Interactive 3D web & prototyping</li>
            </ul>
          </div>
          <div className="col-span-12 text-left md:col-span-8 md:text-right">
            <span className="mb-2 block text-[10px] uppercase text-[#73716b]">
              Studio philosophy
            </span>
            <p className="max-w-2xl text-sm font-bold uppercase leading-tight text-[#dc2626] md:ml-auto md:text-base">
              Shaping spatial & digital experiences with clarity, intention,
              character, and dedication since 2018.
            </p>
          </div>
        </footer>
      </div>
    </section>
  );
}
