import React, { useLayoutEffect, useRef } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import gsap from "gsap";
import { ArrowLeft, Info, Play } from "lucide-react";
import { getProjectBySlug } from "../../data/projects";
import { useReducedMotion } from "@/lib/useReducedMotion";

// The premium redesign:
// 1. Sleek top navigation
// 2. Bold, centered title typography
// 3. Huge centered edge-to-edge style video player (no overlap)
// 4. Content section below

export const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const project = getProjectBySlug(id);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (!project || prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      // Fade in the hero text elements
      gsap.fromTo(
        ".project-hero-el",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.2,
          clearProps: "all",
        }
      );
      // Fade in the video
      gsap.fromTo(
        ".project-video",
        { scale: 0.95, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: "power4.out",
          delay: 0.5,
          clearProps: "all",
        }
      );
      // Fade in content
      gsap.fromTo(
        ".project-content",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          delay: 0.7,
          clearProps: "all",
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [project, prefersReducedMotion]);

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-black relative z-10 pt-24 pb-24 overflow-hidden">
      {/* Background ambient glow matching the accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#8C0B0C]/10 rounded-full blur-[150px] pointer-events-none opacity-40 z-0 transform-gpu will-change-transform" />
      
      {/* Back Button */}
      <div className="relative z-50 max-w-[1400px] mx-auto px-4 md:px-[5%] mb-12">
        <Link 
          to="/projects" 
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-[0.2em] bg-white/5 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-full hover:border-[#8C0B0C]/40 hover:bg-[#8C0B0C]/10"
        >
          <ArrowLeft size={14} /> Back to Archive
        </Link>
      </div>

      {/* Hero Text Section */}
      <div className="relative z-20 max-w-[1400px] mx-auto px-4 md:px-[5%] text-center mb-16">
        <div className="project-hero-el inline-block px-4 py-1.5 border border-[#8C0B0C]/30 bg-[#8C0B0C]/10 text-[#8C0B0C] text-[10px] font-bold tracking-[0.3em] uppercase rounded-full mb-8">
          {project.category}
        </div>
        <h1 className="project-hero-el text-3xl sm:text-5xl md:text-7xl lg:text-9xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-400 mb-6 drop-shadow-2xl">
          {project.title}
        </h1>
        <div className="project-hero-el flex flex-wrap items-center justify-center gap-4 text-xs font-mono tracking-widest text-neutral-500 uppercase">
          <span>Phase One VFX</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#8C0B0C] opacity-50"></span>
          <span>Next Era Visual Fidelity</span>
        </div>
      </div>

      {/* Hero Video Section (No Overlap) */}
      <div className="project-video relative z-20 max-w-[1400px] mx-auto px-4 md:px-[5%] mb-20">
        <div className="relative w-full aspect-video bg-neutral-900 rounded-2xl border border-white/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
          {project.heroVideoUrl ? (
            <iframe 
              src={project.heroVideoUrl} 
              className="w-full h-full object-cover"
              allow="autoplay; fullscreen; picture-in-picture" 
              allowFullScreen 
              title={project.title}
              style={{ border: 'none' }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 gap-4">
              <Play size={48} className="text-white/20" />
              <span className="text-white/30 tracking-widest uppercase text-sm font-bold">Video Coming Soon</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Section */}
      <div className="project-content relative z-20 max-w-[1400px] mx-auto px-4 md:px-[5%] grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Column: Description */}
        <div className="lg:col-span-8 flex flex-col gap-12">
          <div className="max-w-none">
            <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter text-white mb-8 flex items-center gap-4">
              <span className="w-8 h-1 bg-[#8C0B0C]"></span> Overview
            </h2>
            <p className="text-neutral-300 leading-relaxed text-lg md:text-xl font-medium max-w-3xl">
              {project.description}
            </p>
          </div>

          {/* BTS / Gallery */}
          {project.galleryImageUrls && project.galleryImageUrls.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-6">
                Behind The Scenes
              </h2>
              <div className="border border-white/10 rounded-2xl p-2 bg-white/[0.02]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {project.galleryImageUrls.map((url, idx) => (
                    <div key={idx} className="aspect-video rounded-xl overflow-hidden bg-black/50 border border-white/5 relative group">
                       <img src={url} alt={`BTS ${idx + 1}`} width={1280} height={720} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Key Details Sticky Sidebar */}
        <div className="lg:col-span-4 relative">
          <div className="sticky top-32 p-8 border border-white/10 rounded-2xl bg-gradient-to-b from-white/[0.05] to-transparent backdrop-blur-md shadow-2xl">
            <h3 className="text-white/50 text-xs font-bold uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <Info size={16} className="text-[#8C0B0C]" /> Specs
            </h3>
            
            <dl className="space-y-8">
              <div>
                <dt className="text-neutral-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Category</dt>
                <dd className="text-xl text-white font-medium capitalize tracking-wide">{project.category}</dd>
              </div>
              <div className="h-px w-full bg-white/10"></div>
              <div>
                <dt className="text-neutral-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Client</dt>
                <dd className="text-xl text-white font-medium capitalize tracking-wide">{project.client}</dd>
              </div>
              <div className="h-px w-full bg-white/10"></div>
              <div>
                <dt className="text-neutral-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Year</dt>
                <dd className="text-xl text-white font-medium tracking-widest">{project.year}</dd>
              </div>
              {project.award && (
                <>
                  <div className="h-px w-full bg-white/10"></div>
                  <div>
                    <dt className="text-[#8C0B0C] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Recognition</dt>
                    <dd className="text-xl text-white font-bold tracking-wide">{project.award}</dd>
                  </div>
                </>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

