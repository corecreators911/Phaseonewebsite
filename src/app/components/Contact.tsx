import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight, CheckCircle2, Mail, MapPin, Phone } from "lucide-react";
import { cn } from "../../lib/utils";

type FormInputs = {
  name: string;
  email: string;
  company: string;
  budget: string;
  details: string;
};

const BUDGET_OPTIONS = [
  "< $50K",
  "$50K – $150K",
  "$150K – $500K",
  "$500K+",
];

export const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<FormInputs>();

  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isSubmitSuccessful) {
      setIsSuccess(true);
      reset();
      setTimeout(() => setIsSuccess(false), 5000);
    }
  }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    const ctx = gsap.context(() => {
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
              start: "top 85%",
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
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Magnetic button
      const btn = buttonRef.current;
      if (btn) {
        const handleMouseMove = (e: MouseEvent) => {
          const { left, top, width, height } = btn.getBoundingClientRect();
          const x = (e.clientX - left - width / 2) * 0.35;
          const y = (e.clientY - top - height / 2) * 0.35;
          gsap.to(btn, { x, y, duration: 0.6, ease: "power3.out" });
        };

        const handleMouseLeave = () => {
          gsap.to(btn, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
        };

        btn.addEventListener("mousemove", handleMouseMove);
        btn.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          btn.removeEventListener("mousemove", handleMouseMove);
          btn.removeEventListener("mouseleave", handleMouseLeave);
        };
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const onSubmit = async (data: FormInputs) => {
    return new Promise((resolve) => setTimeout(resolve, 1500));
  };

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative w-full bg-black py-12 md:py-16 px-6 overflow-hidden scroll-mt-24"
    >
      {/* Background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(140,11,12,0.08)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
        <div className="absolute right-[20%] top-0 bottom-0 w-[1px] bg-white" />
        <div className="absolute left-[20%] top-0 bottom-0 w-[1px] bg-white" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] w-12 bg-[#8C0B0C]" />
          <span className="text-[10px] md:text-[11px] font-mono text-[#8C0B0C] uppercase tracking-[0.3em]">
            Get In Touch
          </span>
        </div>

        {/* Big heading */}
        <div ref={headingRef} className="overflow-hidden mb-16 md:mb-20">
          <h2 className="flex flex-wrap">
            {"LET'S CREATE".split("").map((char, i) => (
              <span
                key={i}
                className={`char-reveal inline-block text-[12vw] md:text-[8vw] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-neutral-700 uppercase ${
                  char === " " ? "w-[0.3em]" : ""
                } ${char === "'" ? "mx-[-0.05em]" : ""}`}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left side - Contact info */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div className="flex flex-col gap-10">
              {/* Email */}
              <a
                href="mailto:hello@phaseonevfx.com"
                className="group flex items-start gap-4"
                data-cursor-hover
              >
                <div className="flex-shrink-0 h-10 w-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#8C0B0C]/50 group-hover:bg-[#8C0B0C]/10 transition-all duration-500">
                  <Mail className="w-4 h-4 text-neutral-500 group-hover:text-[#8C0B0C] transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-600 mb-1">
                    Email
                  </p>
                  <p className="text-lg font-bold tracking-tight text-white group-hover:text-[#8C0B0C] transition-colors">
                    hello@phaseonevfx.com
                  </p>
                </div>
              </a>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full border border-white/10 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-neutral-500" />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-600 mb-1">
                    Phone
                  </p>
                  <p className="text-lg font-bold tracking-tight text-white">
                    +44 20 7123 4567
                  </p>
                </div>
              </div>

              {/* Offices */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full border border-white/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-neutral-500" />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-600 mb-3">
                    Global Offices
                  </p>
                  <div className="flex flex-col gap-4">
                    <div>
                      <p className="text-sm font-bold text-white mb-0.5">London (HQ)</p>
                      <p className="text-xs text-neutral-500">12 Soho Square, W1D 3QF</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white mb-0.5">Los Angeles</p>
                      <p className="text-xs text-neutral-500">9000 Sunset Blvd, CA 90069</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white mb-0.5">New York</p>
                      <p className="text-xs text-neutral-500">350 Fifth Ave, NY 10118</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability indicator */}
            <div className="mt-12 flex items-center gap-3 bg-white/[0.02] border border-white/[0.06] rounded-full py-3 px-5">
              <div className="relative">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <div className="absolute inset-0 h-2 w-2 rounded-full bg-emerald-500 animate-ping opacity-75" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">
                Available for Q2 2026
              </span>
            </div>
          </div>

          {/* Right side - Form */}
          <div ref={formContainerRef} className="lg:col-span-8">
            <div className="relative w-full rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 md:p-10 backdrop-blur-sm">
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
                    Transmission Sent
                  </h3>
                  <p className="text-sm text-neutral-500 max-w-sm">
                    Our team will review your inquiry and respond within 24 hours.
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
                        className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder:text-neutral-700 focus:border-[#8C0B0C] focus:outline-none transition-colors"
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
                        className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder:text-neutral-700 focus:border-[#8C0B0C] focus:outline-none transition-colors"
                        placeholder="john@studio.com"
                      />
                      {errors.email && (
                        <span className="absolute right-0 bottom-3 text-[10px] text-[#8C0B0C]">Valid email required</span>
                      )}
                    </div>
                  </div>

                  {/* Row 2 - Company */}
                  <div className="relative group">
                    <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-600 mb-3 group-focus-within:text-[#8C0B0C] transition-colors">
                      Company / Studio
                    </label>
                    <input
                      {...register("company")}
                      type="text"
                      className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder:text-neutral-700 focus:border-[#8C0B0C] focus:outline-none transition-colors"
                      placeholder="Your studio or production company"
                    />
                  </div>

                  {/* Budget selection */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-600 mb-4">
                      Project Budget
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {BUDGET_OPTIONS.map((budget) => (
                        <button
                          key={budget}
                          type="button"
                          onClick={() => setSelectedBudget(budget)}
                          className={cn(
                            "px-5 py-2.5 rounded-full border text-[11px] font-mono uppercase tracking-[0.15em] transition-all duration-300",
                            selectedBudget === budget
                              ? "border-[#8C0B0C] bg-[#8C0B0C]/10 text-white shadow-[0_0_15px_rgba(140,11,12,0.2)]"
                              : "border-white/10 text-neutral-500 hover:border-white/20 hover:text-neutral-300"
                          )}
                        >
                          {budget}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="relative group">
                    <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-600 mb-3 group-focus-within:text-[#8C0B0C] transition-colors">
                      Project Details
                    </label>
                    <textarea
                      {...register("details", { required: true })}
                      rows={4}
                      className="w-full resize-none bg-transparent border-b border-white/10 py-3 text-white placeholder:text-neutral-700 focus:border-[#8C0B0C] focus:outline-none transition-colors"
                      placeholder="Tell us about your project, timeline, and vision..."
                    />
                    {errors.details && (
                      <span className="absolute right-0 bottom-3 text-[10px] text-[#8C0B0C]">Required</span>
                    )}
                  </div>

                  {/* Submit button */}
                  <div className="flex justify-end mt-4">
                    <button
                      ref={buttonRef}
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative overflow-hidden rounded-full border border-white/20 bg-transparent px-12 py-5 transition-all duration-500 disabled:opacity-50 hover:border-[#8C0B0C] hover:shadow-[0_0_40px_rgba(140,11,12,0.3)] will-change-transform"
                      data-cursor-hover
                    >
                      <span className="relative z-10 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors">
                        {isSubmitting ? (
                          <>
                            <span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            Transmitting...
                          </>
                        ) : (
                          <>
                            Send Transmission
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
