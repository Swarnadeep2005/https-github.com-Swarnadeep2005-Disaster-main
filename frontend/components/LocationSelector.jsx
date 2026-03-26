"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

export default function LocationSelector({ onLocation, onGeocoding }) {
  const map = useMap();
  const markerRef = useRef(null);
  const rippleRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    const onClick = async (e) => {
      const { lat, lng } = e.latlng;
      onGeocoding(true);

      let L;
      try {
        L = (await import("leaflet")).default;
      } catch {
        onGeocoding(false);
        return;
      }

      // Ripple circle that expands and fades
      if (rippleRef.current) {
        try {
          map.removeLayer(rippleRef.current);
        } catch {}
      }
      rippleRef.current = L.circleMarker([lat, lng], {
        radius: 4,
        color: "#34d399",
        fillColor: "#34d399",
        fillOpacity: 0.4,
        weight: 1,
        opacity: 0.8,
      }).addTo(map);

      let r = 4;
      const pulse = setInterval(() => {
        r += 2.5;
        if (rippleRef.current) {
          rippleRef.current.setRadius(r);
          rippleRef.current.setStyle({
            opacity: Math.max(0, 0.8 - r / 40),
            fillOpacity: Math.max(0, 0.4 - r / 60),
          });
        }
        if (r > 38) {
          clearInterval(pulse);
          try {
            if (rippleRef.current) map.removeLayer(rippleRef.current);
          } catch {}
        }
      }, 28);

      // Custom pin marker
      if (markerRef.current) {
        try {
          map.removeLayer(markerRef.current);
        } catch {}
      }
      const pinIcon = L.divIcon({
        html: `
          <div style="position:relative;display:flex;flex-direction:column;align-items:center">
            <div style="
              width:13px;height:13px;
              background:#34d399;
              border:2.5px solid #6ee7b7;
              border-radius:50%;
              box-shadow:0 0 0 4px rgba(52,211,153,0.18),0 0 18px rgba(52,211,153,0.55);
            "></div>
            <div style="width:1.5px;height:14px;background:linear-gradient(to bottom,#34d399,transparent);margin-top:-1px;"></div>
          </div>`,
        iconSize: [13, 27],
        iconAnchor: [6, 27],
        className: "",
      });
      markerRef.current = L.marker([lat, lng], { icon: pinIcon }).addTo(map);

      // Reverse geocode
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
          { headers: { "Accept-Language": "en" } },
        );
        const geo = await res.json();
        onLocation({
          lat: parseFloat(lat.toFixed(5)),
          lng: parseFloat(lng.toFixed(5)),
          country: geo?.address?.country ?? null,
          city:
            geo?.address?.city ||
            geo?.address?.town ||
            geo?.address?.state ||
            null,
          displayName:
            geo?.display_name?.split(",").slice(0, 3).join(", ") ?? null,
        });
      } catch {
        onLocation({
          lat: parseFloat(lat.toFixed(5)),
          lng: parseFloat(lng.toFixed(5)),
          country: null,
          city: null,
          displayName: null,
        });
      } finally {
        onGeocoding(false);
      }
    };

    map.on("click", onClick);
    return () => {
      map.off("click", onClick);
      if (markerRef.current)
        try {
          map.removeLayer(markerRef.current);
        } catch {}
      if (rippleRef.current)
        try {
          map.removeLayer(rippleRef.current);
        } catch {}
    };
  }, [map, onLocation, onGeocoding]);

  return null;
}
