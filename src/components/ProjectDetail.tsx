import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowLeft } from "lucide-react";

export interface ProjectData {
  id: string;
  title: string;
  client: string;
  category: string;
  role: string;
  launch: string;
  liveUrl?: string;
  recognition: string[];
  about: string;
  gallery: string[];
}

export default function ProjectDetail({ project }: { project: ProjectData }) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const scrollToImage = (index: number) => {
    setActiveImgIndex(index);
    const element = document.getElementById(`gallery-img-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#eae8e4] text-[#121212] architectural-grid-bg p-6 md:p-12 font-mono-meta select-none">
      {/* Main Grid Content */}
      <div className="grid grid-cols-12 gap-8 md:gap-12 mt-12 items-start">
        {/* LEFT COLUMN: Sticky Project Description & Metadata */}
        <div className="col-span-12 lg:col-span-5 sticky top-12 space-y-10 pr-0 lg:pr-6">
          <div>
            <span className="text-[10px] text-[#73716b] uppercase block mb-1">
              Project
            </span>
            <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-[#121212] mb-4">
              {project.title}
            </h1>
          </div>

          {/* About Text Block */}
          <div className="grid grid-cols-12 gap-2 text-xs">
            <span className="col-span-3 text-[#73716b] uppercase text-[10px]">
              About
            </span>
            <p className="col-span-9 text-[#121212] leading-relaxed font-sans font-medium text-sm">
              {project.about}
            </p>
          </div>

          {/* Role & Launch Metadata */}
          <div className="grid grid-cols-12 gap-2 text-xs border-t border-[#d3d0c9]/60 pt-6">
            <span className="col-span-3 text-[#73716b] uppercase text-[10px]">
              Role
            </span>
            <div className="col-span-9 grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-[#121212]">{project.role}</p>
              </div>
              <div>
                <span className="text-[#73716b] uppercase text-[10px] block mb-0.5">
                  Launch
                </span>
                <p className="font-medium text-[#121212]">{project.launch}</p>
              </div>
            </div>
          </div>

          {/* Recognition Awards */}
          <div className="grid grid-cols-12 gap-2 text-xs border-t border-[#d3d0c9]/60 pt-6">
            <span className="col-span-3 text-[#73716b] uppercase text-[10px]">
              Recognition
            </span>
            <div className="col-span-9">
              <ul className="space-y-1.5 font-medium text-[#121212]">
                {project.recognition.map((award, i) => (
                  <li key={i}>{award}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Visit Site CTA */}
          {project.liveUrl && (
            <div className="pt-4 border-t border-[#d3d0c9]/60">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-base font-bold uppercase text-[#121212] hover:text-[#dc2626] transition-colors group"
              >
                <span>Visit site</span>
                <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Vertical Image Scroll Feed */}
        <div className="col-span-12 lg:col-span-6 space-y-12 pr-12 lg:pr-0">
          {project.gallery.map((imgUrl, index) => (
            <motion.div
              key={index}
              id={`gallery-img-${index}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[16/10] w-full bg-[#e2e0dc] rounded-xs overflow-hidden shadow-lg border border-[#121212]/10"
            >
              <img
                src={imgUrl}
                alt={`${project.title} screenshot ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-3 right-3 bg-black/75 text-white text-[9px] px-2 py-0.5 rounded font-mono-meta">
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(project.gallery.length).padStart(2, "0")}
              </span>
            </motion.div>
          ))}
        </div>

        {/* FAR RIGHT: Floating Vertical Thumbnail Strip */}
        <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 flex-col space-y-3 z-30">
          {project.gallery.map((imgUrl, index) => (
            <button
              key={index}
              onClick={() => scrollToImage(index)}
              className={`relative w-12 h-16 rounded-xs overflow-hidden border-2 transition-all cursor-pointer ${
                activeImgIndex === index
                  ? "border-[#121212] scale-110 shadow-md"
                  : "border-transparent opacity-50 hover:opacity-100"
              }`}
            >
              <img
                src={imgUrl}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-24 border-t border-[#d3d0c9]/60 pt-6 flex justify-between items-center text-xs text-[#73716b]">
        <span>STUDIO ARCH.® © 2026</span>
        <a href="#top" className="hover:text-[#121212] uppercase">
          Back to top ↑
        </a>
      </footer>
    </div>
  );
}
