"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Brain,
  Calendar,
  Activity,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ChevronRight,
  BarChart3,
  Gauge,
  ChevronDown,
  Search,
  X,
  Info,
  MapPin,
  Radar,
} from "lucide-react";
import { COUNTRY_LIST } from "@/json/country_mapping";
import { SCALE_MAPPING } from "@/json/scale_mapping";

// SSR-safe dynamic import for map
const MapSelector = dynamic(() => import("@/components/Mapselector"), {
  ssr: false,
  loading: () => (
    <div className="h-80 rounded-2xl bg-slate-900 border border-slate-800/60 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
        <p className="text-slate-500 text-sm">Loading map…</p>
      </div>
    </div>
  ),
});

function Toast({ message, type = "success", onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md text-sm font-semibold animate-in slide-in-from-top-2 duration-300 ${
        type === "success"
          ? "bg-emerald-900/90 border-emerald-500/30 text-emerald-300"
          : "bg-red-900/90 border-red-500/30 text-red-300"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 className="w-4 h-4" />
      ) : (
        <AlertTriangle className="w-4 h-4" />
      )}
      {message}
      <button onClick={onDismiss} className="ml-1 opacity-60 hover:opacity-100">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function ScaleDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  const ref = useRef(null);

  const selected = SCALE_MAPPING.find((s) => s.code === value);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider z-5000">
        Magnitude Scale
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-3 rounded-xl border px-3 py-3 text-sm text-left transition-all duration-200 ${
          open
            ? "border-emerald-500/60 bg-emerald-500/5 shadow-sm shadow-emerald-500/10"
            : selected
              ? "border-slate-700/80 bg-slate-800/60 text-white"
              : "border-slate-800/80 bg-slate-800/40 text-slate-600 hover:border-slate-700/60"
        }`}
      >
        <Gauge
          className={`w-4 h-4 flex-shrink-0 ${open ? "text-emerald-400" : selected ? "text-emerald-400" : "text-slate-600"}`}
        />
        <span
          className={`flex-1 font-mono ${selected ? "text-white" : "text-slate-600"}`}
        >
          {selected ? selected.label : "Select scale…"}
        </span>
        {selected && (
          <button
            type="button"
            onMouseEnter={() => setTooltip(selected)}
            onMouseLeave={() => setTooltip(null)}
            onClick={(e) => {
              e.stopPropagation();
              setTooltip(tooltip ? null : selected);
            }}
            className="text-slate-600 hover:text-emerald-400 transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        )}
        <ChevronDown
          className={`w-4 h-4 text-slate-600 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Tooltip */}
      {tooltip && (
        <div className="absolute right-0 top-full mt-1 z-30 bg-slate-800 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-400 max-w-[200px] shadow-xl">
          <p className="font-semibold text-white mb-0.5">{tooltip.label}</p>
          <p>{tooltip.description}</p>
          <p className="text-emerald-400 font-mono mt-1">
            Unit: {tooltip.unit}
          </p>
        </div>
      )}

      {/* Options */}
      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 z-[1000] bg-slate-900 border border-slate-700/60 rounded-xl shadow-2xl max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {SCALE_MAPPING.map((scale) => (
            <button
              key={scale.code}
              type="button"
              onClick={() => {
                onChange(scale.code);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-slate-800/80 transition-colors text-left ${
                value === scale.code
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "text-slate-300"
              }`}
            >
              <div>
                <span className="font-semibold font-mono">{scale.label}</span>
                <p className="text-slate-600 text-xs mt-0.5">
                  {scale.description}
                </p>
              </div>
              {value === scale.code && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CountryDropdown({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const inputRef = useRef(null);

  const selected = COUNTRY_LIST.find((c) => c.code === value);
  const filtered = COUNTRY_LIST.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  ).slice(0, 60);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  return (
    <div
      ref={ref}
      className={`relative ${disabled ? "opacity-60 pointer-events-none" : ""}`}
    >
      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
        Country{" "}
        {disabled && (
          <span className="text-emerald-600 normal-case tracking-normal font-normal ml-1">
            (auto-filled from map)
          </span>
        )}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        disabled={disabled}
        className={`w-full flex items-center gap-3 rounded-xl border px-3 py-3 text-sm text-left transition-all duration-200 ${
          open
            ? "border-emerald-500/60 bg-emerald-500/5"
            : selected
              ? "border-slate-700/80 bg-slate-800/60"
              : "border-slate-800/80 bg-slate-800/40 hover:border-slate-700/60"
        }`}
      >
        <MapPin
          className={`w-4 h-4 flex-shrink-0 ${selected ? "text-emerald-400" : "text-slate-600"}`}
        />
        <span
          className={`flex-1 ${selected ? "text-white" : "text-slate-600"}`}
        >
          {selected ? selected.name : "Select country…"}
        </span>
        {selected && (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
        )}
        <ChevronDown
          className={`w-4 h-4 text-slate-600 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 z-20 bg-slate-900 border border-slate-700/60 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-2 border-b border-slate-800/60">
            <div className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-2">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search countries…"
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-slate-600"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-slate-600 hover:text-slate-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
          <div className="overflow-y-auto max-h-52">
            {filtered.length === 0 ? (
              <p className="text-slate-600 text-sm text-center py-4">
                No matches found
              </p>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    onChange(c);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-slate-800/80 transition-colors text-left ${
                    value === c.code
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "text-slate-300"
                  }`}
                >
                  <span>{c.name}</span>
                  <span className="text-slate-700 text-xs font-mono">
                    {c.code}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const DISASTER_COLORS = {
  Flood: {
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    dot: "bg-blue-400",
  },
  Earthquake: {
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    dot: "bg-orange-400",
  },
  Storm: {
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    dot: "bg-purple-400",
  },
  Drought: {
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    dot: "bg-amber-400",
  },
  Wildfire: {
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    dot: "bg-red-400",
  },
  default: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    dot: "bg-emerald-400",
  },
};

function getDisasterStyle(name) {
  if (!name) return DISASTER_COLORS.default;
  const key = Object.keys(DISASTER_COLORS).find((k) =>
    name.toLowerCase().includes(k.toLowerCase()),
  );
  return DISASTER_COLORS[key] || DISASTER_COLORS.default;
}

export default function PredictPage() {
  const [year, setYear] = useState("");
  const [magScale, setMagScale] = useState(null); // numeric code
  const [magValue, setMagValue] = useState("");
  const [countryCode, setCountryCode] = useState(null); // numeric code
  const [countryName, setCountryName] = useState("");
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [yearFocused, setYearFocused] = useState(false);
  const [magFocused, setMagFocused] = useState(false);

  // Auto-fill from map click
  const handleLocationSelect = (loc) => {
    setSelectedLocation(loc);
    setCountryCode(loc.country.code);
    setCountryName(loc.country.name);
    setCity(loc.city || "");
    setLatitude(String(loc.latitude));
    setLongitude(String(loc.longitude));
    setToast({
      message: `📍 ${loc.country.name}${loc.city ? `, ${loc.city}` : ""} selected successfully`,
      type: "success",
    });
    setError(null);
  };

  const handleLocationClear = () => {
    setSelectedLocation(null);
    setCountryCode(null);
    setCountryName("");
    setCity("");
    setLatitude("");
    setLongitude("");
  };

  const handleCountryDropdown = (c) => {
    setCountryCode(c.code);
    setCountryName(c.name);
  };

  const isReady =
    year &&
    magScale !== null &&
    magValue &&
    countryCode !== null &&
    latitude &&
    longitude;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isReady) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Year: Number(year),
          Dis_Mag_Scale: Number(magScale),
          Dis_Mag_Value: Number(magValue),
          Country: Number(countryCode),
          Longitude: Number(longitude),
          Latitude: Number(latitude),
        }),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      setResult(data.predicted_disaster.name);
    } catch (err) {
      setError(err.message || "Failed to reach the prediction API.");
    } finally {
      setLoading(false);
    }
  };

  const disasterStyle = getDisasterStyle(result);
  const filledCount = [
    year,
    magScale !== null,
    magValue,
    countryCode !== null,
    city,
    latitude,
    longitude,
  ].filter(Boolean).length;
  const completionPct = Math.round((filledCount / 7) * 100);

  return (
    <div className="min-h-screen bg-slate-950 flex items-start justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-teal-500/4 rounded-full blur-3xl pointer-events-none" />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}

      <div className="relative z-10 w-full mt-8 px-4 md:px-10 lg:px-16">
        {/* Header */}
        <div className=" mt-20 text-center mb-8">
          <h1 className="  text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            Disaster
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              {" "}
              Predictor
            </span>
          </h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
            Pick a location on the map, set magnitude parameters, and get an
            instant ML-powered disaster classification.
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/60 rounded-3xl overflow-hidden shadow-2xl shadow-slate-950/60">
          {/* Card header */}
          <div className="px-6 py-4 border-b border-slate-800/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-white text-sm font-bold">Input Parameters</p>
                <p className="text-slate-600 text-xs font-mono">
                  POST /predict
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-xs text-slate-500 font-medium">
                  {filledCount}/7 fields
                </p>
                <p className="text-xs text-emerald-400 font-mono">
                  {completionPct}%
                </p>
              </div>
              <div className="relative w-9 h-9">
                <svg className="w-9 h-9 -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="rgb(52,211,153)"
                    strokeWidth="3"
                    strokeDasharray={`${completionPct * 0.879} 100`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dasharray 0.4s ease" }}
                  />
                </svg>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Section: Temporal & Magnitude */}
            <div>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5" /> Event Parameters
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Year */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Year
                  </label>
                  <div
                    className={`flex items-center rounded-xl border transition-all duration-200 ${
                      yearFocused
                        ? "border-emerald-500/60 bg-emerald-500/5 shadow-sm shadow-emerald-500/10"
                        : year
                          ? "border-slate-700/80 bg-slate-800/60"
                          : "border-slate-800/80 bg-slate-800/40 hover:border-slate-700/60"
                    }`}
                  >
                    <div
                      className={`pl-3 ${yearFocused ? "text-emerald-400" : "text-slate-600"}`}
                    >
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      type="number"
                      placeholder="e.g. 2023"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      onFocus={() => setYearFocused(true)}
                      onBlur={() => setYearFocused(false)}
                      className="w-full bg-transparent text-white text-sm px-3 py-3 rounded-xl outline-none placeholder:text-slate-600 font-mono"
                    />
                    {year && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-3" />
                    )}
                  </div>
                  <p className="text-slate-700 text-xs mt-1 pl-1">
                    Year of occurrence
                  </p>
                </div>

                {/* Scale Dropdown */}
                <ScaleDropdown value={magScale} onChange={setMagScale} />

                {/* Magnitude Value */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Magnitude Value
                  </label>
                  <div
                    className={`flex items-center rounded-xl border transition-all duration-200 ${
                      magFocused
                        ? "border-emerald-500/60 bg-emerald-500/5 shadow-sm shadow-emerald-500/10"
                        : magValue
                          ? "border-slate-700/80 bg-slate-800/60"
                          : "border-slate-800/80 bg-slate-800/40 hover:border-slate-700/60"
                    }`}
                  >
                    <div
                      className={`pl-3 ${magFocused ? "text-emerald-400" : "text-slate-600"}`}
                    >
                      <Activity className="w-4 h-4" />
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 6.8"
                      value={magValue}
                      onChange={(e) => setMagValue(e.target.value)}
                      onFocus={() => setMagFocused(true)}
                      onBlur={() => setMagFocused(false)}
                      className="w-full bg-transparent text-white text-sm px-3 py-3 rounded-xl outline-none placeholder:text-slate-600 font-mono"
                    />
                    {magValue && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-3" />
                    )}
                  </div>
                  <p className="text-slate-700 text-xs mt-1 pl-1">
                    Measured intensity
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-800/60" />

            {/* Section: Location */}
            <div>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> Geographic Location
                <span className="normal-case text-slate-700 font-normal tracking-normal">
                  — click map or select manually
                </span>
              </p>

              {/* Map */}
              <div className="mb-4">
                <MapSelector
                  onLocationSelect={handleLocationSelect}
                  selectedLocation={selectedLocation}
                  onClear={handleLocationClear}
                />
              </div>

              {/* Country + Coordinates (manual or auto-filled) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <CountryDropdown
                    value={countryCode}
                    onChange={handleCountryDropdown}
                    disabled={!!selectedLocation}
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                    City
                    {selectedLocation && (
                      <span className="text-emerald-600 normal-case tracking-normal font-normal ml-1">
                        (auto)
                      </span>
                    )}
                  </label>
                  <div
                    className={`flex items-center rounded-xl border transition-all duration-200 ${
                      city
                        ? "border-slate-700/80 bg-slate-800/60"
                        : "border-slate-800/80 bg-slate-800/40"
                    } ${selectedLocation ? "pointer-events-none" : ""}`}
                  >
                    <div className="pl-3 text-slate-600">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. New Delhi"
                      value={city}
                      readOnly={!!selectedLocation}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-transparent text-white text-sm px-3 py-3 rounded-xl outline-none placeholder:text-slate-600 font-mono"
                    />
                    {city && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-3" />
                    )}
                  </div>
                  <p className="text-slate-700 text-xs mt-1 pl-1">
                    City name (front-end only)
                  </p>
                </div>

                {/* Lat/Lng */}
                {[
                  {
                    label: "Latitude",
                    value: latitude,
                    setter: setLatitude,
                    placeholder: "e.g. 20.59",
                  },
                  {
                    label: "Longitude",
                    value: longitude,
                    setter: setLongitude,
                    placeholder: "e.g. 78.96",
                  },
                ].map(({ label, value, setter, placeholder }) => (
                  <div
                    key={label}
                    className={selectedLocation ? "opacity-70" : ""}
                  >
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                      {label}{" "}
                      {selectedLocation && (
                        <span className="text-emerald-600 normal-case tracking-normal font-normal">
                          (auto)
                        </span>
                      )}
                    </label>
                    <div
                      className={`flex items-center rounded-xl border transition-all duration-200 ${
                        value
                          ? "border-slate-700/80 bg-slate-800/60"
                          : "border-slate-800/80 bg-slate-800/40"
                      } ${selectedLocation ? "pointer-events-none" : ""}`}
                    >
                      <div className="pl-3 text-slate-600">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <input
                        type="number"
                        step="0.0001"
                        placeholder={placeholder}
                        value={value}
                        readOnly={!!selectedLocation}
                        onChange={(e) => setter(e.target.value)}
                        className="w-full bg-transparent text-white text-sm px-3 py-3 rounded-xl outline-none placeholder:text-slate-600 font-mono"
                      />
                      {value && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-3" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2.5 bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm flex-1">{error}</p>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-red-600 hover:text-red-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!isReady || loading}
              className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold text-sm transition-all duration-200 ${
                !isReady || loading
                  ? "bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700/50"
                  : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-400/25 hover:scale-[1.01] active:scale-[0.99]"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Running
                  inference…
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" /> Predict Disaster Type{" "}
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>

            {!isReady && !loading && (
              <p className="text-center text-slate-700 text-xs font-medium">
                {6 - filledCount} field{6 - filledCount !== 1 ? "s" : ""}{" "}
                remaining —{" "}
                {!selectedLocation && !latitude
                  ? "click the map to auto-fill location"
                  : "fill all fields to predict"}
              </p>
            )}
          </form>
        </div>

        {/* Result */}
        {result && (
          <div
            className={`mt-4 border rounded-2xl p-5 backdrop-blur-sm ${disasterStyle.bg} ${disasterStyle.border}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border ${disasterStyle.bg} ${disasterStyle.border}`}
                >
                  <BarChart3 className={`w-5 h-5 ${disasterStyle.color}`} />
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-0.5">
                    Predicted Disaster Type
                  </p>
                  <p
                    className={`text-2xl font-black tracking-tight ${disasterStyle.color}`}
                  >
                    {result}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <div
                  className={`w-2 h-2 rounded-full ${disasterStyle.dot} animate-pulse`}
                />
                <span className="text-xs text-slate-500 font-mono">
                  Model output
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-4 gap-3">
              {[
                { label: "Year", value: year },
                { label: "Country", value: countryName },
                { label: "City", value: city || "—" },
                {
                  label: "Scale",
                  value:
                    SCALE_MAPPING.find((s) => s.code === magScale)?.label ||
                    "—",
                },
                { label: "Magnitude", value: magValue },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-slate-600 text-xs font-medium mb-0.5">
                    {s.label}
                  </p>
                  <p className="text-slate-400 text-xs font-mono">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-slate-700 text-xs mt-5 font-medium pb-8">
          Predictions generated by a Random Forest classifier trained on
          historical disaster data.
        </p>
      </div>
    </div>
  );
}
