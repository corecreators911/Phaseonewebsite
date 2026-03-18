import React, { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { projects } from "../../data/projects";
import { useReducedMotion } from "../../lib/useReducedMotion";

export const ProjectsArchive = () => {
  const safeProjects = Array.isArray(projects) ? projects : [];
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([".archive-header", ".archive-card"], { clearProps: "all", opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        ".archive-header",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          clearProps: "all",
        }
      );

      gsap.fromTo(
        ".archive-card",
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.06,
          ease: "power3.out",
          clearProps: "all",
          delay: 0.1,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div ref={containerRef} className="min-h-screen bg-black pt-32 pb-24 px-4 md:px-[5%] relative z-10 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-24 -right-1/4 w-[800px] h-[800px] bg-[#8C0B0C]/10 rounded-full blur-[120px] pointer-events-none opacity-50 transform-gpu will-change-transform" />
      
      <div className="max-w-[1400px] mx-auto relative z-10">
        <header className="archive-header mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter mb-4">
              Project <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8C0B0C] to-red-600">Archive</span>
            </h1>
            <p className="text-neutral-400 max-w-xl text-lg">
              A comprehensive showcase of our visual effects, CGI, and post-production work across film, television, and commercial projects.
            </p>
          </div>

          {/* Enhanced Showing X Projects Badge */}
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-full backdrop-blur-md">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8C0B0C] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </div>
            <span className="text-xs font-bold tracking-[0.25em] text-white uppercase">
              Showing {safeProjects.length} Projects
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {safeProjects.map((project) => (
            <Link
              to={`/projects/${project.projectId}`}
              key={project.id}
              className="archive-card group relative flex flex-col h-full rounded-xl overflow-hidden border border-white/5 bg-white/[0.02] transition-[border-color,background-color,box-shadow] duration-500 hover:border-[#8C0B0C]/40 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(140,11,12,0.15)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-black/50">
                <img
                  src={project.thumbnailUrl}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                
                {/* Year Badge */}
                <div className="absolute top-4 left-4 border border-white/20 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest text-white/80">
                  {project.year}
                </div>

                {/* Hover Arrow */}
                <div className="absolute top-4 right-4 bg-[#8C0B0C] p-2.5 rounded-full opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 shadow-[0_0_15px_rgba(140,11,12,0.5)]">
                  <span className="text-white text-sm font-bold">OPEN</span>
                </div>
              </div>

              <div className="p-6 md:p-8 flex flex-col flex-grow relative">
                {/* Subtle Inner Glow on Hover */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(140,11,12,0.15)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="text-[#8C0B0C] text-[10px] font-bold tracking-[0.25em] uppercase mb-3">
                    {project.category}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-neutral-500 transition-all duration-300">
                    {project.title}
                  </h3>
                  <div className="text-neutral-500 text-xs font-medium tracking-wide mb-6">
                    CLIENT: <span className="text-neutral-300">{project.client}</span>
                  </div>
                </div>

                <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between text-[10px] text-neutral-500 uppercase tracking-[0.2em] font-bold relative z-10">
                  <span className="group-hover:text-white transition-colors duration-300">View Project</span>
                  {project.award && <span className="text-[#8C0B0C]">{project.award}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

