"use client";
import { useState, useEffect } from "react";
import { Menu, Radar, X, Zap } from "lucide-react";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["Problem", "Dataset", "Visualizations", "Model", "WorldMap"];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#050a0e]/95 backdrop-blur-xl border-b border-emerald-950/60 shadow-xl shadow-black/40"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Radar className="w-4 h-4 text-emerald-400" />
            <div className="absolute -inset-px rounded-lg bg-emerald-400/5 group-hover:bg-emerald-400/10 transition-colors" />
          </div>
          <span className="font-bold text-white text-sm tracking-tight">
            Disas<span className="text-emerald-400">terAI</span>
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l}
              href={`/#${l.toLowerCase()}`}
              className="text-xs font-semibold text-slate-500 hover:text-emerald-400 transition-colors tracking-widest uppercase"
            >
              {l}
            </a>
          ))}
          <a
            href="/predict"
            className="flex items-center gap-1.5 text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg transition-all hover:scale-105 shadow-lg shadow-emerald-500/20"
          >
            <Zap className="w-3.5 h-3.5" /> Try Now
          </a>
        </div>

        <button
          className="lg:hidden text-slate-400 hover:text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-[#050a0e]/98 backdrop-blur-xl border-t border-emerald-950/40 px-6 py-4 space-y-3">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="block text-sm text-slate-400 hover:text-emerald-400 py-2 border-b border-slate-900 transition-colors"
            >
              {l}
            </a>
          ))}
          <a
            href="/predict"
            className="block text-center bg-emerald-500 text-slate-950 font-bold py-3 rounded-xl text-sm mt-4"
          >
            Try Prediction
          </a>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
