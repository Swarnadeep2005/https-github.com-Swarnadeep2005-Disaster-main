"use client";

import { useEffect, useRef, useState } from "react";
import {
  Brain,
  Zap,
  ArrowRight,
  MapPin,
  Activity,
  CheckCircle2,
  Radar,
  Globe,
} from "lucide-react";

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Counter({ to, suffix = "", duration = 1600 }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useInView(0.5);
  useEffect(() => {
    if (!visible) return;
    let cur = 0;
    const step = Math.ceil(to / (duration / 16));
    const t = setInterval(() => {
      cur = Math.min(cur + step, to);
      setCount(cur);
      if (cur >= to) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [visible, to, duration]);
  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

function StatChip({ icon: Icon, label, value, color, delay }) {
  const [ref, visible] = useInView(0.2);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
    >
      <div className="flex items-center gap-2.5 bg-[#0d1117]/80 backdrop-blur-sm border border-white/[0.07] rounded-2xl px-4 py-3 shadow-xl shadow-black/40 hover:border-white/[0.12] transition-colors group">
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border ${color.bg} ${color.border}`}
        >
          <Icon className={`w-4 h-4 ${color.icon}`} />
        </div>
        <div>
          <p className={`text-sm font-black font-mono ${color.icon}`}>
            {value}
          </p>
          <p className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

function WorkflowStep({ icon: Icon, label, index, delay }) {
  const [ref, visible] = useInView(0.2);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`flex items-center gap-2 transition-all duration-500 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"}`}
    >
      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
        <Icon className="w-3.5 h-3.5 text-emerald-400" />
      </div>
      <span className="text-slate-400 text-xs font-medium">{label}</span>
      <div className="flex-1 h-px bg-gradient-to-r from-slate-800 to-transparent" />
      <span className="text-[9px] text-slate-700 font-mono">0{index}</span>
    </div>
  );
}

export default function CTA() {
  const [cardRef, cardVisible] = useInView(0.15);
  const [hovered, setHovered] = useState(false);

  const chips = [
    {
      icon: Radar,
      label: "Model Type",
      value: "Random Forest",
      color: {
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        icon: "text-emerald-400",
      },
      delay: 100,
    },
    {
      icon: Activity,
      label: "Accuracy",
      value: "94.2%",
      color: {
        bg: "bg-teal-500/10",
        border: "border-teal-500/20",
        icon: "text-teal-400",
      },
      delay: 200,
    },
    {
      icon: Globe,
      label: "Countries",
      value: "170+",
      color: {
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/20",
        icon: "text-cyan-400",
      },
      delay: 300,
    },
    {
      icon: MapPin,
      label: "Map Selection",
      value: "Leaflet",
      color: {
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        icon: "text-emerald-400",
      },
      delay: 400,
    },
  ];

  const steps = [
    { icon: MapPin, label: "Click location on map" },
    { icon: Globe, label: "Country auto-detected" },
    { icon: Activity, label: "Enter magnitude parameters" },
    { icon: Brain, label: "Model classifies disaster type" },
    { icon: CheckCircle2, label: "Result returned in <50ms" },
  ];

  return (
    <section className="py-32 px-6 bg-[#050a0e] overflow-hidden relative">
      {/* Background noise grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Wide ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <div
          ref={cardRef}
          className={`transition-all duration-700 ${cardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {/* ── Main card ── */}
          <div className="relative bg-[#0a0f14] border border-white/[0.07] rounded-3xl overflow-hidden shadow-2xl shadow-black/60">
            {/* Top accent line */}
            <div className="absolute top-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

            {/* Corner glows */}
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-emerald-500/[0.06] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-teal-500/[0.04] rounded-full blur-3xl pointer-events-none" />

            {/* Inner grid (subtle) */}
            <div
              className="absolute inset-0 opacity-[0.025] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            <div className="relative grid lg:grid-cols-2 gap-0">
              {/* ── LEFT: main CTA ── */}
              <div className="p-10 md:p-14 flex flex-col justify-between">
                {/* Label */}
                <div>
                  <div className="inline-flex items-center gap-2 bg-emerald-500/8 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full mb-8">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Model Live · FastAPI + Next.js
                  </div>

                  {/* Heading */}
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.0] tracking-tight mb-6">
                    <span className="text-white block">Try the</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 via-emerald-400 to-teal-500 block">
                      Prediction
                    </span>
                    <span className="text-white block">Model</span>
                  </h2>

                  <p className="text-slate-500 text-sm leading-relaxed mb-10 max-w-sm">
                    Select a location on the map, set magnitude parameters, and
                    receive an ML-powered disaster classification in real time —
                    powered by a 128-tree Random Forest ensemble.
                  </p>
                </div>

                {/* CTA button */}
                <div>
                  <a
                    href="/predict"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    className="group relative inline-flex items-center gap-3 overflow-hidden bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-8 py-4 rounded-2xl transition-all duration-200 shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-400/30 hover:scale-[1.03] active:scale-[0.98] text-sm"
                  >
                    {/* Shimmer sweep */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-700 ${hovered ? "translate-x-full" : ""}`}
                    />
                    <Zap className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Start Prediction</span>
                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
                  </a>

                  <p className="text-slate-700 text-xs mt-4 font-mono">
                    No sign-up required · Open source · EM-DAT dataset
                  </p>
                </div>
              </div>

              {/* ── RIGHT: details panel ── */}
              <div className="relative border-t lg:border-t-0 lg:border-l border-white/[0.05] p-10 md:p-12 flex flex-col gap-8">
                {/* Stat chips 2×2 */}
                <div>
                  <p className="text-[9px] text-slate-700 uppercase tracking-[0.18em] font-bold mb-4">
                    Model stats
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {chips.map((c) => (
                      <StatChip key={c.label} {...c} />
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

                {/* Workflow steps */}
                <div>
                  <p className="text-[9px] text-slate-700 uppercase tracking-[0.18em] font-bold mb-4">
                    How it works
                  </p>
                  <div className="space-y-2.5">
                    {steps.map((s, i) => (
                      <WorkflowStep
                        key={s.label}
                        {...s}
                        index={i + 1}
                        delay={i * 80}
                      />
                    ))}
                  </div>
                </div>

                {/* Terminal output preview */}
                <div className="bg-[#050a0e]/80 border border-white/[0.05] rounded-2xl p-4 font-mono text-[10px]">
                  <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-white/[0.05]">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
                    </div>
                    <span className="text-slate-700 text-[9px]">
                      POST /predict → 200 OK
                    </span>
                  </div>
                  <div className="space-y-1 text-slate-600">
                    <div>
                      <span className="text-slate-700">{"{"}</span>
                    </div>
                    <div className="pl-4">
                      <span className="text-teal-600">"country"</span>
                      <span className="text-slate-700">: </span>
                      <span className="text-amber-600/80">101</span>
                      <span className="text-slate-700">,</span>
                    </div>
                    <div className="pl-4">
                      <span className="text-teal-600">"latitude"</span>
                      <span className="text-slate-700">: </span>
                      <span className="text-amber-600/80">20.59</span>
                      <span className="text-slate-700">,</span>
                    </div>
                    <div className="pl-4">
                      <span className="text-teal-600">"magnitude"</span>
                      <span className="text-slate-700">: </span>
                      <span className="text-amber-600/80">6.8</span>
                    </div>
                    <div>
                      <span className="text-slate-700">{"}"}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-white/[0.04]">
                      <span className="text-slate-700">
                        {'"'}predicted_disaster
                      </span>
                      <span className="text-emerald-400 font-black">Flood</span>
                      <span className="text-slate-700">{'"'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom status bar */}
            <div className="relative border-t border-white/[0.04] px-10 py-4 flex flex-wrap items-center justify-between gap-3 bg-white/[0.01]">
              <div className="flex items-center gap-5">
                {[
                  { label: "Disaster types", val: "12+" },
                  { label: "Training records", val: "10k+" },
                  { label: "Avg. latency", val: "<50ms" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-2">
                    <span className="text-emerald-500 text-xs font-black font-mono">
                      {s.val}
                    </span>
                    <span className="text-slate-700 text-[10px] uppercase tracking-wider">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-700 font-mono">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                API online
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
