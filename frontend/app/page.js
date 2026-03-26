"use client";

import { useState, useEffect, useRef } from "react";
import {
  Brain,
  Globe,
  Radar,
  AlertTriangle,
  TrendingUp,
  Shield,
  Database,
  BarChart3,
  ArrowRight,
  ChevronRight,
  Activity,
  Target,
  FlaskConical,
  ScanLine,
  Navigation,
  Crosshair,
  AreaChart,
} from "lucide-react";
import MapDemo from "@/components/MapDemo";
import CTA from "@/components/CTA";

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
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

function Counter({ to, suffix = "", duration = 1800 }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useInView(0.5);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = Math.ceil(to / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= to) {
        setCount(to);
        clearInterval(timer);
      } else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [visible, to, duration]);
  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

function Section({ id, className = "", children }) {
  const [ref, visible] = useInView();
  return (
    <section
      id={id}
      ref={ref}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </section>
  );
}

function SectionLabel({ children }) {
  return (
    <div className="inline-flex items-center gap-2 bg-emerald-500/8 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full mb-5">
      <ChevronRight className="w-3 h-3" />
      {children}
    </div>
  );
}

function SectionHeading({ children, gradient = false }) {
  return (
    <h2
      className={`text-3xl md:text-4xl lg:text-5xl font-black leading-[1.05] tracking-tight mb-5 ${
        gradient
          ? "text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-200 to-emerald-400"
          : "text-white"
      }`}
    >
      {children}
    </h2>
  );
}

function GlassCard({ children, className = "", hover = true }) {
  return (
    <div
      className={`
      relative bg-white/[0.03] backdrop-blur-md border border-white/[0.08]
      rounded-2xl overflow-hidden
      ${
        hover
          ? "hover:border-emerald-500/30 hover:bg-emerald-500/[0.04] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/40"
          : ""
      }
      ${className}
    `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      {children}
    </div>
  );
}

function VizCard({ src, title, description, reverse }) {
  return (
    <GlassCard className="p-8">
      <div
        className={`grid lg:grid-cols-2 gap-12 items-center ${
          reverse ? "lg:grid-flow-col-dense" : ""
        }`}
      >
        {/* Text Content */}
        <div className={`${reverse ? "lg:col-start-2" : ""}`}>
          <div className="inline-flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold tracking-widest uppercase mb-4">
            <ChevronRight className="w-3 h-3" />
            Data Insight
          </div>

          <h3 className="text-white text-2xl font-black mb-4 leading-tight">
            {title}
          </h3>

          <p className="text-slate-500 text-sm leading-relaxed max-w-md">
            {description}
          </p>
        </div>

        {/* Chart */}
        <div
          className={`relative overflow-hidden rounded-xl bg-slate-900/60 ${
            reverse ? "lg:col-start-1" : ""
          }`}
        >
          <img
            src={src}
            alt={title}
            className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-500"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#050a0e]/40 to-transparent" />
        </div>
      </div>
    </GlassCard>
  );
}

function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#050a0e] pt-16"
    >
      {/* Scan-line texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(16,185,129,0.012) 2px, rgba(16,185,129,0.012) 4px)",
        }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* Radial vignette */}
      <div
        className="absolute inset-0 bg-radial-gradient pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(16,185,129,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Corner decoration */}
      <div className="absolute top-24 left-8 hidden xl:block">
        <div className="text-[10px] font-mono text-emerald-900 space-y-1">
          {["SYS.INIT", "MODEL.LOAD", "API.READY", "STATUS: LIVE"].map(
            (t, i) => (
              <div key={t} className="flex items-center gap-2 opacity-60">
                <div
                  className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
                  style={{ animationDelay: `${i * 300}ms` }}
                />
                {t}
              </div>
            ),
          )}
        </div>
      </div>

      <div className="absolute top-24 right-8 hidden xl:block text-right">
        <div className="text-[10px] font-mono text-emerald-900 space-y-1">
          {["ACCURACY: 94.2%", "MODEL: RF", "FEATURES: 6", "CLASSES: 12+"].map(
            (t, i) => (
              <div
                key={t}
                className="flex items-center justify-end gap-2 opacity-60"
              >
                {t}
                <div
                  className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
                  style={{ animationDelay: `${i * 300}ms` }}
                />
              </div>
            ),
          )}
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Headline */}
        <h1 className=" mt-20 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight mb-8">
          <span className="text-white block">Machine Learning</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 block">
            Disaster Prediction
          </span>
          <span className="text-white block">System</span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-12">
          Predict disaster types using historical disaster data and geospatial
          features — powered by a{" "}
          <span className="text-emerald-400 font-semibold">
            Random Forest classifier
          </span>{" "}
          trained on the global EM-DAT database.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
          <a
            href="/predict"
            className="group flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-8 py-4 rounded-xl transition-all duration-200 shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-400/30 hover:scale-105 text-sm"
          >
            <Brain className="w-4 h-4" />
            Try Prediction
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#model"
            className="group flex items-center gap-2.5 bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-emerald-500/30 text-slate-300 hover:text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-sm backdrop-blur-sm"
          >
            <BarChart3 className="w-4 h-4" />
            View Model Analysis
          </a>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
          {[
            { val: 95, suffix: "%", label: "Model Accuracy" },
            { val: 6, suffix: "", label: "Input Features" },
            { val: 5, suffix: "+", label: "Models Compared" },
            { val: 10, suffix: "", label: "Disaster Types" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4"
            >
              <div className="text-2xl font-black text-emerald-400 font-mono mb-1">
                <Counter to={s.val} suffix={s.suffix} />
              </div>
              <div className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-700">
        <span className="text-[10px] tracking-widest uppercase font-bold">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-emerald-800 to-transparent animate-pulse" />
      </div>
    </section>
  );
}

function Problem() {
  const points = [
    {
      icon: AlertTriangle,
      title: "Massive Global Impact",
      desc: "Natural disasters cause over $300 billion in economic losses annually, displacing millions and claiming hundreds of thousands of lives worldwide.",
    },
    {
      icon: TrendingUp,
      title: "Historical Pattern Recognition",
      desc: "Understanding decades of disaster data reveals patterns in frequency, geography, and magnitude — patterns that machine learning can learn and generalize from.",
    },
    {
      icon: Shield,
      title: "Data-Driven Preparedness",
      desc: "ML models trained on historical records can assist governments, NGOs, and researchers in classifying emerging disaster scenarios for faster, smarter response.",
    },
  ];

  return (
    <Section id="problem" className="py-28 px-6 bg-[#050a0e]">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionLabel>Problem Statement</SectionLabel>
            <SectionHeading gradient>
              Why disaster prediction matters
            </SectionHeading>
            <p className="text-slate-500 text-base leading-relaxed">
              Our project focusses on predicting Natural disasters using
              innovative Machine Learning models including Ensemble models
              precisely. To improve the effectiveness of our system, we are
              incorporating various features and leveraging advanced
              methodologies that estimates natural disaster types.
            </p>
          </div>

          <div className="space-y-4">
            {points.map(({ icon: Icon, title, desc }) => (
              <GlassCard key={title} className="p-5 flex gap-4">
                <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm mb-1.5">
                    {title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {desc}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function Dataset() {
  const columns = [
    "Year",
    "Mag. Scale",
    "Mag. Value",
    "Latitude",
    "Longitude",
    "Country",
    "Disaster Type",
  ];
  const rows = [
    ["2005", "Richter", "7.6", "34.54°", "73.58°", "Pakistan", "Earthquake"],
    ["2011", "Richter", "9.0", "38.32°", "142.37°", "Japan", "Earthquake"],
    ["2017", "Kph", "295", "18.34°", "-66.06°", "Puerto Rico", "Storm"],
    ["2010", "—", "—", "18.54°", "-72.34°", "Haiti", "Earthquake"],
    ["2019", "Km²", "1200", "-33.86°", "151.20°", "Australia", "Wildfire"],
  ];

  const typeColors = {
    Earthquake: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    Storm: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    Wildfire: "text-red-400 bg-red-500/10 border-red-500/20",
  };

  return (
    <Section id="dataset" className="py-28 px-6 bg-[#050a0e]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <SectionLabel>Dataset Overview</SectionLabel>
          <SectionHeading>EM-DAT Global Disaster Database</SectionHeading>
          <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
            The model was trained on the Emergency Events Database (EM-DAT),
            maintained by CRED at UCLouvain, Belgium — one of the most
            comprehensive global disaster datasets.
          </p>
        </div>

        <GlassCard hover={false} className="overflow-x-auto">
          <div className="p-4 border-b border-white/[0.06] flex items-center gap-3">
            <Database className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono text-emerald-400 font-bold">
              natural_disaster_dataset.csv
            </span>
            <span className="ml-auto text-[10px] text-slate-600 font-mono">
              5 of 16,000+ records shown
            </span>
          </div>
          <table className="w-full text-xs min-w-[600px]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {columns.map((c) => (
                  <th
                    key={c}
                    className="text-left px-4 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest whitespace-nowrap"
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-white/[0.03] hover:bg-emerald-500/[0.03] transition-colors"
                >
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="px-4 py-3 font-mono text-slate-400 whitespace-nowrap"
                    >
                      {j === 6 ? (
                        <span
                          className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${typeColors[cell] || "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"}`}
                        >
                          {cell}
                        </span>
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>

        {/* Feature pills */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          {[
            { label: "Year", icon: Activity },
            { label: "Magnitude Scale", icon: ScanLine },
            { label: "Magnitude Value", icon: AreaChart },
            { label: "Latitude", icon: Navigation },
            { label: "Longitude", icon: Navigation },
            { label: "Country (encoded)", icon: Globe },
          ].map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-2 bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-slate-400 font-medium"
            >
              <Icon className="w-3.5 h-3.5 text-emerald-500" /> {label}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function Visualizations() {
  const charts = [
    {
      src: "disaster_distribution.png",
      title: "Disaster Type Distribution",
      description:
        "Shows the frequency of each disaster type in the training dataset, revealing class imbalance and the relative prevalence of floods, storms, and earthquakes.",
    },
    {
      src: "disaster_by_continent.png",
      title: "Disaster Frequency by Continent",
      description:
        "Geographic distribution of historical disasters by continent. Asia and the Americas show the highest concentration of events.",
    },
    {
      src: "disaster_trend.png",
      title: "Disaster Trends Over Time",
      description:
        "Annual disaster counts from 1900 to 2023 showing long-term temporal patterns and increasing disaster reporting.",
    },
    {
      src: "correlation_heatmap.png",
      title: "Feature Correlation Heatmap",
      description:
        "Correlation matrix between dataset features used to analyze relationships between disaster attributes.",
    },
    {
      src: "model_comparison.png",
      title: "Model Performance Comparison",
      description:
        "Comparison of machine learning models including Random Forest, SVM, KNN, Naive Bayes, and ensemble approaches.",
    },
    {
      src: "random_forest_tuning.png",
      title: "Random Forest Hyperparameter Tuning",
      description:
        "Performance comparison of the Random Forest classifier before and after hyperparameter optimization.",
    },
  ];

  return (
    <Section id="visualizations" className="py-28 px-6 bg-[#050a0e]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <SectionLabel>Data Visualizations</SectionLabel>
          <SectionHeading gradient>
            Insights from the training data
          </SectionHeading>

          <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
            Exploratory data analysis revealed key patterns used to guide
            feature engineering and model selection decisions.
          </p>
        </div>

        <div className="space-y-24">
          {charts.map((chart, index) => (
            <VizCard key={chart.title} {...chart} reverse={index % 2 !== 0} />
          ))}
        </div>
      </div>
    </Section>
  );
}

function ModelComparison() {
  const models = [
    {
      name: "Random Forest",
      acc: 95.19,
      prec: 95.38,
      rec: 95.38,
      f1: 95.51,
      winner: true,
    },
    {
      name: "SVM",
      acc: 63.39,
      prec: 65.0,
      rec: 65.0,
      f1: 68.31,
      winner: false,
    },
    {
      name: "KNN",
      acc: 92.61,
      prec: 93.16,
      rec: 93.16,
      f1: 93.18,
      winner: false,
    },
    {
      name: "Naive Bayes",
      acc: 62.97,
      prec: 65.32,
      rec: 65.32,
      f1: 71.67,
      winner: false,
    },
    {
      name: "Ensemble(Hard Voting)",
      acc: 91.89,
      prec: 92.3,
      rec: 92.3,
      f1: 92.89,
      winner: false,
    },
    {
      name: "Ensemble(Soft Voting)",
      acc: 93.52,
      prec: 93.92,
      rec: 93.92,
      f1: 93.33,
      winner: false,
    },
  ];

  return (
    <Section id="model" className="py-28 px-6 bg-[#050a0e]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <SectionLabel>Model Comparison</SectionLabel>
          <SectionHeading>Why Random Forest won</SectionHeading>
          <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
            Five models were trained, tuned, and evaluated using 5-fold
            cross-validation. Random Forest outperformed across all metrics.
          </p>
        </div>

        {/* Comparison table */}
        <GlassCard hover={false} className="mb-8 overflow-x-auto">
          <div className="p-4 border-b border-white/[0.06] flex items-center gap-3">
            <FlaskConical className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono text-emerald-400 font-bold">
              Model Evaluation Results
            </span>
          </div>
          <table className="w-full text-xs min-w-[500px]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Model", "Accuracy", "Precision", "Recall", "F1 Score"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {models.map((m) => (
                <tr
                  key={m.name}
                  className={`border-b border-white/[0.03] transition-colors ${m.winner ? "bg-emerald-500/[0.05]" : "hover:bg-white/[0.02]"}`}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`font-bold ${m.winner ? "text-emerald-400" : "text-slate-400"}`}
                      >
                        {m.name}
                      </span>
                      {m.winner && (
                        <span className="text-[9px] font-black bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 px-1.5 py-0.5 rounded-md tracking-widest">
                          SELECTED
                        </span>
                      )}
                    </div>
                  </td>
                  {[m.acc, m.prec, m.rec, m.f1].map((v, i) => (
                    <td key={i} className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden max-w-16">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${m.winner ? "bg-emerald-400" : "bg-slate-600"}`}
                            style={{ width: `${v}%` }}
                          />
                        </div>
                        <span
                          className={`font-mono text-xs ${m.winner ? "text-emerald-400 font-bold" : "text-slate-500"}`}
                        >
                          {v}%
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>

        {/* Model comparison chart */}
        <GlassCard className="overflow-hidden group">
          <div className="p-5 border-b border-white/[0.06]">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Model Evaluation Metrics
            </p>
          </div>
          <div className="relative bg-slate-900/40">
            <img
              src="model_comparison.png"
              alt="Model Comparison"
              className="w-full h-full object-contain p-4 group-hover:scale-[1.01] transition-transform duration-500"
            />
          </div>
        </GlassCard>
      </div>
    </Section>
  );
}

function FeatureImportance() {
  const features = [
    { name: "Country", pct: 32, color: "bg-emerald-400" },
    { name: "Year", pct: 31, color: "bg-teal-400" },
    { name: "Disaster Magnitude Scale", pct: 23, color: "bg-cyan-400" },
    { name: "Disaster Magnitude Value", pct: 8, color: "bg-emerald-600" },
    { name: "Longitude", pct: 4, color: "bg-slate-500" },
    { name: "Latitude", pct: 2, color: "bg-slate-600" },
  ];

  return (
    <Section id="features" className="py-28 px-6 bg-[#050a0e]">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <SectionLabel>Feature Importance</SectionLabel>
            <SectionHeading gradient>What drives the prediction</SectionHeading>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Random Forest calculates the relative importance of each feature
              by measuring the mean decrease in impurity across all decision
              trees. Geographic features dominate — location is the strongest
              signal for disaster type classification.
            </p>
            <div className="space-y-3">
              {features.map((f) => (
                <div key={f.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-slate-400 text-xs font-semibold">
                      {f.name}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      {f.pct}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${f.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${f.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <GlassCard className="overflow-hidden group" hover>
            <div className="p-4 border-b border-white/[0.06] flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-emerald-400 font-mono font-bold">
                feature_importance.png
              </span>
            </div>
            <div className="bg-slate-900/40">
              <img
                src="feature_importance.png"
                alt="Feature Importance"
                className="w-full h-full object-contain p-4 group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </GlassCard>
        </div>
      </div>
    </Section>
  );
}

function ConfusionMatrix() {
  return (
    <Section id="confusion" className="py-28 px-6 bg-[#050a0e]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <SectionLabel>Confusion Matrix</SectionLabel>
          <SectionHeading>Prediction vs. reality</SectionHeading>
          <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
            The confusion matrix shows how well the model's predictions align
            with actual disaster types on the test set. High diagonal values
            indicate accurate classification.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <GlassCard className="overflow-hidden group lg:col-span-2" hover>
            <div className="p-4 border-b border-white/[0.06] flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-emerald-400 font-mono font-bold">
                confusion_matrix.png
              </span>
            </div>
            <div className="bg-slate-900/40 aspect-square lg:aspect-auto lg:h-80">
              <img
                src="confusion_matrix.png"
                alt="Confusion Matrix"
                className="w-full h-full object-contain p-4 group-hover:scale-[1.01] transition-transform duration-500"
              />
            </div>
          </GlassCard>

          <div className="space-y-4">
            {[
              {
                label: "True Positives",
                desc: "Correct disaster type identified",
                color: "text-emerald-400",
                border: "border-emerald-500/20",
                bg: "bg-emerald-500/8",
              },
              {
                label: "True Negatives",
                desc: "Correctly ruled out non-matches",
                color: "text-teal-400",
                border: "border-teal-500/20",
                bg: "bg-teal-500/8",
              },
              {
                label: "False Positives",
                desc: "Wrong type assigned to event",
                color: "text-amber-400",
                border: "border-amber-500/20",
                bg: "bg-amber-500/8",
              },
              {
                label: "False Negatives",
                desc: "Disaster type missed by model",
                color: "text-red-400",
                border: "border-red-500/20",
                bg: "bg-red-500/8",
              },
            ].map((item) => (
              <GlassCard
                key={item.label}
                className={`p-4 border ${item.border} ${item.bg}`}
                hover={false}
              >
                <p className={`text-xs font-black mb-1 ${item.color}`}>
                  {item.label}
                </p>
                <p className="text-slate-500 text-xs">{item.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

export default function LandingPage() {
  return (
    <div
      className="min-h-screen bg-[#050a0e] text-white antialiased"
      style={{ fontFamily: "'DM Mono', 'Fira Code', monospace" }}
    >
      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Sora:wght@400;600;700;800;900&display=swap');
        h1, h2, h3, h4, h5 { font-family: 'Sora', sans-serif; }
        body { font-family: 'DM Mono', monospace; }
        @keyframes slide-in { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: slide-in 0.3s ease forwards; }
      `}</style>
      <Hero />
      <Problem />
      <Dataset />
      <Visualizations />
      <ModelComparison />
      <FeatureImportance />
      <ConfusionMatrix />
      <MapDemo />
      <CTA />
    </div>
  );
}
