"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  MapPin,
  Radar,
  Brain,
  Globe,
  Loader2,
  X,
  ChevronRight,
  Navigation,
  CheckCircle2,
} from "lucide-react";
import { DISASTER_DATA, DISASTER_COLORS } from "./DisasterMarker";

// ─── SSR-safe Leaflet imports ─────────────────────────────────────────────────
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false },
);
const DisasterMarkers = dynamic(() => import("./DisasterMarker"), {
  ssr: false,
});
const LocationSelector = dynamic(() => import("./LocationSelector"), {
  ssr: false,
});

// ─── Leaflet CSS (injected client-side only) ──────────────────────────────────
function LeafletCSS() {
  useEffect(() => {
    const existing = document.getElementById("leaflet-css");
    if (existing) return;
    const link = document.createElement("link");
    link.id = "leaflet-css";
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    // Fix Leaflet default icon paths
    const fixStyle = document.createElement("style");
    fixStyle.id = "leaflet-fix";
    fixStyle.textContent = `
      .leaflet-container { background: #050a0e !important; cursor: crosshair !important; }
      .leaflet-tile-pane { filter: brightness(0.95) saturate(0.9); }
      .disaster-popup .leaflet-popup-content-wrapper {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
      }
      .disaster-popup .leaflet-popup-content { margin: 0 !important; }
      .disaster-popup .leaflet-popup-tip-container { display: none !important; }
      .leaflet-control-zoom a {
        background: rgba(13,17,23,0.9) !important;
        border-color: rgba(255,255,255,0.08) !important;
        color: #64748b !important;
      }
      .leaflet-control-zoom a:hover { color: #10b981 !important; }
      .leaflet-control-attribution {
        background: rgba(13,17,23,0.7) !important;
        color: #1e293b !important;
        font-size: 9px !important;
      }
      .leaflet-control-attribution a { color: #334155 !important; }
    `;
    document.head.appendChild(fixStyle);

    // Fix missing marker icons
    if (typeof window !== "undefined") {
      import("leaflet").then(({ default: L }) => {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });
        // Expose L globally for DisasterMarkers / LocationSelector
        window.L = L;
      });
    }
  }, []);
  return null;
}

// ─── Legend pill ──────────────────────────────────────────────────────────────
function Legend() {
  return (
    <div className="absolute bottom-4 left-4 z-[500] flex flex-wrap gap-1.5 max-w-[220px]">
      {Object.entries(DISASTER_COLORS).map(([type, { hex }]) => (
        <div
          key={type}
          className="flex items-center gap-1 bg-[#0d1117]/85 backdrop-blur-sm border border-white/[0.06] rounded-md px-2 py-1"
        >
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: hex }}
          />
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            {type}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Selected location floating card ─────────────────────────────────────────
function LocationCard({ location, geocoding, onClear }) {
  if (!location && !geocoding) return null;

  return (
    <div className="absolute top-4 right-4 z-[500] min-w-[200px]">
      <div className="bg-[#0d1117]/92 backdrop-blur-md border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05]">
          <div className="flex items-center gap-2">
            <div
              className={`w-1.5 h-1.5 rounded-full ${geocoding ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`}
            />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {geocoding ? "Detecting…" : "Selected Location"}
            </span>
          </div>
          {location && !geocoding && (
            <button
              onClick={onClear}
              className="text-slate-700 hover:text-red-400 transition-colors p-0.5 hover:bg-red-500/10 rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {geocoding ? (
          <div className="px-4 py-4 flex items-center gap-3">
            <Loader2 className="w-4 h-4 text-emerald-400 animate-spin flex-shrink-0" />
            <span className="text-xs text-slate-500">Reverse geocoding…</span>
          </div>
        ) : (
          location && (
            <div className="px-4 py-3 space-y-2.5">
              <div>
                <p className="text-[9px] text-slate-700 uppercase tracking-widest font-bold mb-0.5">
                  Country
                </p>
                <p className="text-sm font-black text-white">
                  {location.country}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[9px] text-slate-700 uppercase tracking-widest font-bold mb-0.5">
                    Latitude
                  </p>
                  <p className="text-xs font-mono text-emerald-400">
                    {location.lat}°
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-700 uppercase tracking-widest font-bold mb-0.5">
                    Longitude
                  </p>
                  <p className="text-xs font-mono text-emerald-400">
                    {location.lng}°
                  </p>
                </div>
              </div>
              {location.display && (
                <p className="text-[9px] text-slate-700 leading-relaxed line-clamp-2">
                  {location.display}
                </p>
              )}
              <a
                href="/predict"
                className="flex items-center justify-center gap-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/25 hover:border-emerald-500/40 text-emerald-400 text-[10px] font-black uppercase tracking-widest py-2 rounded-xl transition-all w-full mt-1"
              >
                <Brain className="w-3 h-3" />
                Predict →
              </a>
            </div>
          )
        )}
      </div>
    </div>
  );
}

// ─── Continent stats mini-strip ───────────────────────────────────────────────
function ContinentStrip() {
  const entries = Object.entries(DISASTER_DATA)
    .map(([name, info]) => {
      const total = Object.values(info.data).reduce((s, v) => s + v, 0);
      const [dominant] = Object.entries(info.data).reduce((a, b) =>
        b[1] > a[1] ? b : a,
      );
      return {
        name,
        total,
        dominant,
        color: DISASTER_COLORS[dominant]?.hex ?? "#10b981",
      };
    })
    .sort((a, b) => b.total - a.total);

  const max = entries[0].total;

  return (
    <div className="grid grid-cols-5 divide-x divide-white/[0.04] border-t border-white/[0.04]">
      {entries.map(({ name, total, dominant, color }) => (
        <div
          key={name}
          className="px-3 py-3 group hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: color }}
            />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest truncate">
              {name}
            </span>
          </div>
          <div className="h-0.5 bg-slate-900 rounded-full overflow-hidden mb-1.5">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${(total / max) * 100}%`, background: color }}
            />
          </div>
          <div className="font-mono text-[10px] font-bold" style={{ color }}>
            {total.toLocaleString()}
          </div>
          <div className="text-[8px] text-slate-700 uppercase tracking-wider">
            {dominant}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Map skeleton ─────────────────────────────────────────────────────────────
function MapSkeleton() {
  return (
    <div className="absolute inset-0 z-10 bg-[#0d1117] flex flex-col items-center justify-center gap-4">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
        </div>
        <p className="text-slate-500 text-sm font-medium">Initialising map…</p>
        <p className="text-slate-700 text-xs font-mono">
          loading disaster data overlay
        </p>
      </div>
    </div>
  );
}

// ─── useInView ────────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
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

// ─── MapDemo (main export) ────────────────────────────────────────────────────
export default function MapDemo() {
  const [mapReady, setMapReady] = useState(false);
  const [location, setLocation] = useState(null);
  const [geocoding, setGeocoding] = useState(false);
  const [sectionRef, visible] = useInView(0.1);

  // Only render map client-side
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section
      id="worldmap"
      ref={sectionRef}
      className={`py-28 px-6 bg-[#050a0e] overflow-hidden transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      {isClient && <LeafletCSS />}

      <div className="max-w-6xl mx-auto">
        {/* ── Header ── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-500/8 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full mb-5">
            <ChevronRight className="w-3 h-3" />
            Interactive Demo
          </div>
          <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight mb-5 text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-100 to-emerald-400">
            Disaster intelligence, mapped
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto text-sm leading-relaxed">
            Click anywhere on the map to select a location. The system detects
            the country via reverse geocoding and loads it into the prediction
            pipeline. Continent circles show historical disaster frequency —
            sized by event count, colored by dominant disaster type.
          </p>
        </div>

        {/* ── Map card ── */}
        <div className="relative bg-white/[0.02] border border-white/[0.06] rounded-3xl overflow-hidden shadow-2xl shadow-black/60">
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.05] bg-[#0d1117]/60 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div>
                <p className="text-white text-xs font-bold">
                  Global Disaster Frequency Map
                </p>
                <p className="text-slate-700 text-[10px] font-mono">
                  EM-DAT Dataset · Continent Overlay
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {geocoding && (
                <div className="flex items-center gap-1.5 text-[10px] text-amber-400 font-mono">
                  <Loader2 className="w-3 h-3 animate-spin" /> Geocoding…
                </div>
              )}
              {location && !geocoding && (
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                  <CheckCircle2 className="w-3 h-3" /> {location.country}
                </div>
              )}
              <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-slate-700 border border-slate-800 rounded-lg px-2.5 py-1.5 font-mono">
                <MapPin className="w-3 h-3 text-emerald-800" />
                Click to select
              </div>
            </div>
          </div>

          {/* Map container */}
          <div className="relative" style={{ height: "460px" }}>
            {!mapReady && <MapSkeleton />}

            {isClient && (
              <MapContainer
                center={[20, 10]}
                zoom={2}
                minZoom={2}
                maxZoom={10}
                style={{ height: "100%", width: "100%", background: "#050a0e" }}
                zoomControl={true}
                attributionControl={true}
                whenReady={() => setMapReady(true)}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
                  subdomains="abcd"
                  maxZoom={20}
                />

                {/* Disaster continent markers */}
                <DisasterMarkers />

                {/* Click handler + user marker */}
                <LocationSelector
                  onLocationSelect={setLocation}
                  onGeocoding={setGeocoding}
                />
              </MapContainer>
            )}

            {/* Legend overlay */}
            {mapReady && <Legend />}

            {/* Location card overlay */}
            {mapReady && (
              <LocationCard
                location={location}
                geocoding={geocoding}
                onClear={() => setLocation(null)}
              />
            )}

            {/* Hint badge */}
            {mapReady && !location && !geocoding && (
              <div className="absolute bottom-4 right-4 z-[500] flex items-center gap-2 bg-[#0d1117]/85 backdrop-blur-sm border border-white/[0.06] rounded-xl px-3 py-2 text-[10px] text-slate-600 font-mono">
                <Navigation className="w-3 h-3 text-emerald-800" />
                Click anywhere on the map
              </div>
            )}
          </div>

          {/* Continent strip */}
          <ContinentStrip />
        </div>

        {/* ── Info row ── */}
        <div className="grid grid-cols-3 gap-4 mt-5">
          {[
            {
              icon: MapPin,
              label: "Click map",
              desc: "Any location worldwide",
              color: "text-emerald-400",
            },
            {
              icon: Radar,
              label: "Auto-detect",
              desc: "Country via reverse geocoding",
              color: "text-teal-400",
            },
            {
              icon: Brain,
              label: "ML prediction",
              desc: "Disaster classification <50ms",
              color: "text-cyan-400",
            },
          ].map(({ icon: Icon, label, desc, color }) => (
            <div
              key={label}
              className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.05] rounded-2xl px-4 py-3.5 hover:border-emerald-900/40 hover:bg-emerald-500/[0.02] transition-all group"
            >
              <div className="w-8 h-8 bg-white/[0.03] border border-white/[0.06] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:border-emerald-900/30 transition-colors">
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div>
                <p className="text-white text-xs font-bold">{label}</p>
                <p className="text-slate-700 text-[10px] leading-tight">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
