"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Loader2, X, AlertTriangle, CheckCircle2 } from "lucide-react";
import { findCountryCode } from "@/json/country_mapping";

// Dynamically loaded to avoid SSR issues with Leaflet

export default function MapSelector({
  onLocationSelect,
  selectedLocation,
  onClear,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [geocoding, setGeocoding] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [geoError, setGeoError] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (mapInstanceRef.current) return;

    const init = async () => {
      const L = (await import("leaflet")).default;

      // Fix default marker icons
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current, {
        center: [20.5937, 78.9629],
        zoom: 3,
        zoomControl: true,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution: "© OpenStreetMap contributors © CARTO",
          maxZoom: 18,
        },
      ).addTo(map);

      // Custom emerald marker
      const customIcon = L.divIcon({
        html: `<div style="
          width: 28px; height: 28px;
          background: rgb(16 185 129);
          border: 3px solid rgb(52 211 153);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 0 16px rgba(16,185,129,0.6);
        "></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        className: "",
      });

      map.on("click", async (e) => {
        const { lat, lng } = e.latlng;
        setGeoError(null);
        setGeocoding(true);

        // Place/update marker
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng], { icon: customIcon }).addTo(
            map,
          );
        }

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { "Accept-Language": "en" } },
          );
          const data = await res.json();
          const countryName = data?.address?.country;

          if (!countryName) throw new Error("Could not determine country.");

          const match = findCountryCode(countryName);
          if (!match) {
            setGeoError(`"${countryName}" is not in the training dataset.`);
            setGeocoding(false);
            return;
          }

          const cityName =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            data?.address?.hamlet ||
            data?.address?.municipality ||
            "";

          onLocationSelect({
            country: match,
            city: cityName,
            latitude: parseFloat(lat.toFixed(6)),
            longitude: parseFloat(lng.toFixed(6)),
            displayName: data?.display_name?.split(",").slice(0, 3).join(", "),
          });
        } catch (err) {
          setGeoError(err.message || "Reverse geocoding failed.");
        } finally {
          setGeocoding(false);
        }
      });

      mapInstanceRef.current = map;
      setMapReady(true);
    };

    init();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
        setMapReady(false);
      }
    };
  }, []);

  const handleClear = () => {
    if (markerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }
    setGeoError(null);
    onClear();
  };

  return (
    <div className="space-y-3">
      {/* Map container */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800/60 bg-slate-900">
        {/* Skeleton overlay */}
        {!mapReady && (
          <div className="absolute inset-0 z-20 bg-slate-900 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
            </div>
            <p className="text-slate-500 text-sm font-medium">Loading map…</p>
            {/* Skeleton grid */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
          </div>
        )}

        {/* Geocoding overlay */}
        {geocoding && (
          <div className="absolute inset-0 z-30 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-slate-900 border border-emerald-800/40 rounded-2xl px-5 py-4 flex items-center gap-3 shadow-xl">
              <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
              <span className="text-emerald-400 text-sm font-semibold">
                Detecting country…
              </span>
            </div>
          </div>
        )}

        {/* Map label */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-sm border border-slate-800/60 rounded-lg px-3 py-1.5 text-xs text-slate-400 font-medium pointer-events-none">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          Click to select location
        </div>

        <div ref={mapRef} style={{ height: "320px", width: "100%" }} />
      </div>

      {/* Error */}
      {geoError && (
        <div className="flex items-center gap-2.5 bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm flex-1">{geoError}</p>
          <button
            onClick={() => setGeoError(null)}
            className="text-red-600 hover:text-red-400 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Selected location info */}
      {selectedLocation && !geoError && (
        <div className="flex items-start justify-between gap-3 bg-emerald-500/8 border border-emerald-500/20 rounded-xl px-4 py-3">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                Location Selected
              </p>
              <p className="text-white text-sm font-semibold">
                {selectedLocation.country.name}
              </p>
              <p className="text-slate-500 text-xs font-mono mt-0.5">
                {selectedLocation.latitude}°N, {selectedLocation.longitude}°E
              </p>
              {selectedLocation.displayName && (
                <p className="text-slate-600 text-xs mt-0.5 truncate max-w-xs">
                  {selectedLocation.displayName}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleClear}
            className="text-slate-600 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5 p-1 hover:bg-red-500/10 rounded-lg"
            title="Clear selection"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
