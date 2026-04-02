import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import gsap from "gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { ArrowUpRight, CheckCircle2, Mail, MapPin, Phone } from "lucide-react";
import { cn } from "../../lib/utils";

type FormInputs = {
  name: string;
  email: string;
  message: string;
};

export const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormInputs>();

  const [isSuccess, setIsSuccess] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        if (headingRef.current)
          gsap.set(headingRef.current.querySelectorAll(".char-reveal"), { y: "0%", opacity: 1 });
        if (formContainerRef.current)
          gsap.set(formContainerRef.current, { opacity: 1, y: 0 });
        return;
      }
      // Heading char reveal
      if (headingRef.current) {
        const chars = headingRef.current.querySelectorAll(".char-reveal");
        gsap.fromTo(
          chars,
          { y: "100%", opacity: 0 },
          {
            y: "0%",
            opacity: 1,
            duration: 1.2,
            stagger: 0.04,
            ease: "power4.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 95%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Form slide up
      if (formContainerRef.current) {
        gsap.fromTo(
          formContainerRef.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: formContainerRef.current,
              start: "top 95%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  const onSubmit = async (_data: FormInputs) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    reset();
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative w-full bg-black py-8 sm:py-12 md:py-16 overflow-hidden scroll-mt-24"
    >
      {/* Background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(140,11,12,0.08)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
        <div className="absolute right-[20%] top-0 bottom-0 w-[1px] bg-white" />
        <div className="absolute left-[20%] top-0 bottom-0 w-[1px] bg-white" />
      </div>

      <div className="w-full px-4 md:px-[5%] relative z-10">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] w-12 bg-[#8C0B0C]" />
          <span className="text-[10px] md:text-[11px] font-mono text-[#8C0B0C] uppercase tracking-[0.3em]">
            Get In Touch
          </span>
        </div>

        {/* Big heading */}
        <div ref={headingRef} className="overflow-hidden mb-8 sm:mb-12 md:mb-16">
          <h2 className="flex flex-wrap">
            {"LET'S CREATE".split("").map((char, i) => (
              <span
                key={i}
                className={`char-reveal inline-block text-[10vw] sm:text-[12vw] md:text-[8vw] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-neutral-700 uppercase ${char === " " ? "w-[0.3em]" : ""
                  } ${char === "'" ? "mx-[-0.05em]" : ""}`}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-20">
          {/* Left side - Contact info */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div className="flex flex-col gap-6 sm:gap-10">
              {/* Email */}
              <a
                href="mailto:phaseonevfx@gmail.com"
                className="group flex items-start gap-3 sm:gap-4"
                data-cursor-hover
              >
                <div className="flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#8C0B0C]/50 group-hover:bg-[#8C0B0C]/10 transition-all duration-500">
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-500 group-hover:text-[#8C0B0C] transition-colors" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-neutral-600 mb-1">
                    Email
                  </p>
                  <p className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-[#8C0B0C] transition-colors break-all sm:break-normal">
                    phaseonevfx@gmail.com
                  </p>
                </div>
              </a>

              {/* Phone */}
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-white/10 flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-500" />
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-neutral-600 mb-1">
                    Phone
                  </p>
                  <p className="text-base sm:text-lg font-bold tracking-tight text-white">
                    +91 123 456 7890
                  </p>
                </div>
              </div>

              {/* Offices */}
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-white/10 flex items-center justify-center">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-500" />
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-neutral-600 mb-2 sm:mb-3">
                    Locations
                  </p>
                  <div className="flex flex-col gap-4">
                    <div>
                      <p className="text-sm font-bold text-white mb-0.5">Ludhiana</p>
                      <p className="text-xs text-neutral-500">India</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white mb-0.5">Delhi</p>
                      <p className="text-xs text-neutral-500">India</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white mb-0.5">Vijayawada</p>
                      <p className="text-xs text-neutral-500">India</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability indicator */}
            <div className="mt-8 sm:mt-12 flex items-center gap-3 bg-white/[0.02] border border-white/[0.06] rounded-full py-2.5 sm:py-3 px-4 sm:px-5">
              <div className="relative">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <div className="absolute inset-0 h-2 w-2 rounded-full bg-emerald-500 animate-ping opacity-75" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-neutral-400">
                Available for New Projects
              </span>
            </div>
          </div>

          <div ref={formContainerRef} className="lg:col-span-8">
            <div
              data-cursor-hide
              className="relative w-full rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-6 md:p-10 backdrop-blur-sm z-[500]"
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-l border-t border-[#8C0B0C]/30 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-r border-t border-[#8C0B0C]/30 rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l border-b border-[#8C0B0C]/30 rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r border-b border-[#8C0B0C]/30 rounded-br-2xl" />

              {isSuccess ? (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center">
                  <div className="mb-6 h-20 w-20 rounded-full border border-[#8C0B0C]/30 bg-[#8C0B0C]/10 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-[#8C0B0C]" />
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter text-white mb-3">
                    Message Sent
                  </h3>
                  <p className="text-sm text-neutral-500 max-w-sm">
                    This is a demo preview — in the final version, your inquiry will be delivered directly to the Phase One VFX team.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
                  {/* Row 1 - Name + Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative group">
                      <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-600 mb-3 group-focus-within:text-[#8C0B0C] transition-colors">
                        Full Name
                      </label>
                      <input
                        {...register("name", { required: true })}
                        type="text"
                        className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder:text-neutral-700 focus:border-[#8C0B0C] focus:outline-none transition-colors md:cursor-text"
                        placeholder="John Doe"
                      />
                      {errors.name && (
                        <span className="absolute right-0 bottom-3 text-[10px] text-[#8C0B0C]">Required</span>
                      )}
                    </div>
                    <div className="relative group">
                      <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-600 mb-3 group-focus-within:text-[#8C0B0C] transition-colors">
                        Email Address
                      </label>
                      <input
                        {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                        type="email"
                        className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder:text-neutral-700 focus:border-[#8C0B0C] focus:outline-none transition-colors md:cursor-text"
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <span className="absolute right-0 bottom-3 text-[10px] text-[#8C0B0C]">Valid email required</span>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="relative group">
                    <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-600 mb-3 group-focus-within:text-[#8C0B0C] transition-colors">
                      Message
                    </label>
                    <textarea
                      {...register("message", { required: true })}
                      rows={6}
                      className="w-full resize-none bg-transparent border-b border-white/10 py-3 text-white placeholder:text-neutral-700 focus:border-[#8C0B0C] focus:outline-none transition-colors md:cursor-text"
                      placeholder="Tell us what's on your mind..."
                    />
                    {errors.message && (
                      <span className="absolute right-0 bottom-3 text-[10px] text-[#8C0B0C]">Required</span>
                    )}
                  </div>

                  {/* Submit button */}
                  <div className="flex justify-end mt-2 sm:mt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative overflow-hidden rounded-full border border-white/20 bg-transparent px-8 sm:px-12 py-4 sm:py-5 transition-all duration-500 disabled:opacity-50 hover:border-[#8C0B0C] hover:shadow-[0_0_40px_rgba(140,11,12,0.3)] w-full sm:w-auto"
                      data-cursor-hover
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors w-full">
                        {isSubmitting ? (
                          <>
                            <span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 z-0 bg-[#8C0B0C] translate-y-[101%] transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
