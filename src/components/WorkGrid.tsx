import React, { useState } from "react";
import { motion } from "framer-motion";

interface GridProject {
  id: string;
  title: string;
  client: string;
  category: string;
  year: string;
  imageUrl: string;
  aspectClass: string; // Tailwind aspect ratio or height span
  spanClass: string; // Tailwind grid column span
}

const ALL_PROJECTS: GridProject[] = [
  {
    id: "luxe-residence",
    title: "Luxe Residence",
    client: "Luxe Group",
    category: "Residential",
    year: "2025",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
    aspectClass: "aspect-[16/10]",
    spanClass: "col-span-12 md:col-span-6",
  },
  {
    id: "ceilao-villas",
    title: "Ceilao Villas",
    client: "Ceilao",
    category: "Public Architecture",
    year: "2025",
    imageUrl:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop",
    aspectClass: "aspect-[3/4]",
    spanClass: "col-span-12 md:col-span-3",
  },
  {
    id: "span-residences",
    title: "Span Residences",
    client: "MiuX Studio",
    category: "Commercial",
    year: "2026",
    imageUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop",
    aspectClass: "aspect-[4/3]",
    spanClass: "col-span-12 md:col-span-3",
  },
  {
    id: "ikea-district",
    title: "Ikea District",
    client: "Ikea",
    category: "Urban Masterplan",
    year: "2026",
    imageUrl:
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=800&auto=format&fit=crop",
    aspectClass: "aspect-square",
    spanClass: "col-span-12 md:col-span-4",
  },
  {
    id: "atelier-lumiere",
    title: "Atelier Lumière",
    client: "MiuX",
    category: "Interior Architecture",
    year: "2026",
    imageUrl:
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=800&auto=format&fit=crop",
    aspectClass: "aspect-[16/9]",
    spanClass: "col-span-12 md:col-span-5",
  },
  {
    id: "koto-retreat",
    title: "Koto Retreat",
    client: "Kyoto Heritage Trust",
    category: "Hospitality",
    year: "2025",
    imageUrl:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop",
    aspectClass: "aspect-[3/4]",
    spanClass: "col-span-12 md:col-span-3",
  },
  {
    id: "monolith-pavilion",
    title: "Monolith Pavilion",
    client: "EisLab",
    category: "Cultural",
    year: "2025",
    imageUrl:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop",
    aspectClass: "aspect-[4/5]",
    spanClass: "col-span-12 md:col-span-4",
  },
  {
    id: "district-walkway",
    title: "District Walkway",
    client: "Dafi Tropikdane",
    category: "Civic Space",
    year: "2026",
    imageUrl:
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?q=80&w=800&auto=format&fit=crop",
    aspectClass: "aspect-[16/10]",
    spanClass: "col-span-12 md:col-span-8",
  },
];

export default function WorkGrid() {
  const [filter, setFilter] = useState<string>("ALL");

  const categories = ["ALL", "RESIDENTIAL", "COMMERCIAL", "CIVIC & PUBLIC"];

  return (
    <section className="relative min-h-screen w-full bg-[#eae8e4] text-[#121212] p-6 md:p-12 font-mono-meta select-none architectural-grid-bg">
      {/* Main Asymmetric Layout */}
      <div className="grid grid-cols-12 gap-8 mt-12 items-start">
        {/* LEFT COLUMN: Watermark Index & Counter */}
        <div className="col-span-12 lg:col-span-3 lg:sticky lg:top-12 space-y-6">
          <div className="relative">
            <span className="text-8xl md:text-[14rem] font-bold leading-none tracking-tighter text-[#121212]/15 block">
              83
            </span>
            <p className="text-xs text-[#73716b] uppercase tracking-widest mt-2">
              TOTAL INDEXED PROJECTS (2018–2026)
            </p>
          </div>

          <div className="text-xs space-y-2 border-t border-[#d3d0c9]/60 pt-4 hidden lg:block text-[#73716b]">
            <p>
              Every piece represents a bespoke balance between raw material
              physics and computational geometry.
            </p>
            <p className="font-bold text-[#121212]">
              Click any project frame to view spatial documentation.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Asymmetric Editorial Masonry Grid */}
        <div className="col-span-12 lg:col-span-9 grid grid-cols-12 gap-6 items-start">
          {ALL_PROJECTS.map((project) => (
            <motion.a
              key={project.id}
              href={`/project/${project.id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className={`group relative ${project.spanClass} block rounded-xs overflow-hidden bg-[#e2e0dc] border border-[#121212]/10 shadow-sm hover:shadow-2xl transition-all duration-300`}
            >
              <div
                className={`relative w-full ${project.aspectClass} overflow-hidden`}
              >
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Dark Vignette Gradient on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Floating Content Badge */}
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex justify-between items-end text-white opacity-0 group-hover:opacity-100">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-neutral-300 block mb-0.5">
                      {project.category} • {project.year}
                    </span>
                    <h3 className="text-lg font-bold uppercase tracking-tight">
                      {project.title}
                    </h3>
                  </div>
                  <span className="text-xs font-mono-meta underline underline-offset-4">
                    VIEW →
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-24 border-t border-[#d3d0c9]/60 pt-6 flex justify-between items-center text-xs text-[#73716b]">
        <span>STUDIO ARCH.® — ALL RIGHTS RESERVED</span>
        <a href="#top" className="hover:text-[#121212] uppercase">
          BACK TO TOP ↑
        </a>
      </footer>
    </section>
  );
}
