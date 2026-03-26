"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

export const DISASTER_DATA = {
  Africa: {
    coords: [1.6508, 17.6791],
    data: { Flood: 1200, Storm: 350, Drought: 900, Earthquake: 200 },
  },
  Americas: {
    coords: [8.7832, -55.4915],
    data: { Flood: 1300, Storm: 1500, Drought: 300, Earthquake: 400 },
  },
  Asia: {
    coords: [34.0479, 100.6197],
    data: { Flood: 2300, Storm: 1900, Earthquake: 800, Landslide: 500 },
  },
  Europe: {
    coords: [54.526, 15.2551],
    data: { Flood: 700, Storm: 600, Earthquake: 200 },
  },
  Oceania: {
    coords: [-22.7359, 140.0188],
    data: { Storm: 450, Flood: 150 },
  },
};

export const DISASTER_COLORS = {
  Flood: { hex: "#3b82f6", light: "rgba(59,130,246,0.15)", label: "#60a5fa" },
  Storm: { hex: "#eab308", light: "rgba(234,179,8,0.15)", label: "#fbbf24" },
  Drought: { hex: "#a16207", light: "rgba(161,98,7,0.15)", label: "#d97706" },
  Earthquake: {
    hex: "#f97316",
    light: "rgba(249,115,22,0.15)",
    label: "#fb923c",
  },
  Landslide: {
    hex: "#ef4444",
    light: "rgba(239,68,68,0.15)",
    label: "#f87171",
  },
};

function getDominant(data) {
  return Object.entries(data).sort((a, b) => b[1] - a[1])[0];
}
function getTotal(data) {
  return Object.values(data).reduce((a, b) => a + b, 0);
}

function buildPopupHtml(name, { data }) {
  const total = getTotal(data);
  const [domType] = getDominant(data);
  const domColor = DISASTER_COLORS[domType]?.label || "#34d399";
  const domBg = DISASTER_COLORS[domType]?.light || "rgba(52,211,153,0.1)";
  const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const maxVal = sorted[0][1];

  const rows = sorted
    .map(([type, count]) => {
      const col = DISASTER_COLORS[type]?.hex || "#6b7280";
      const pct = ((count / total) * 100).toFixed(0);
      const barW = Math.round((count / maxVal) * 100);
      return `
      <div style="margin-bottom:7px">
        <div style="display:flex;justify-content:space-between;margin-bottom:3px">
          <div style="display:flex;align-items:center;gap:5px">
            <div style="width:7px;height:7px;border-radius:50%;background:${col};flex-shrink:0"></div>
            <span style="font-size:10.5px;color:#94a3b8;font-family:monospace">${type}</span>
          </div>
          <div style="display:flex;align-items:center;gap:6px">
            <span style="font-size:9px;color:#475569;font-family:monospace">${pct}%</span>
            <span style="font-size:11px;color:#e2e8f0;font-family:monospace;font-weight:700">${count.toLocaleString()}</span>
          </div>
        </div>
        <div style="height:3px;background:#1e293b;border-radius:2px;overflow:hidden">
          <div style="height:100%;width:${barW}%;background:${col};border-radius:2px"></div>
        </div>
      </div>`;
    })
    .join("");

  // stacked bar
  let x = 0;
  const rects = sorted
    .map(([type, count]) => {
      const w = Math.round((count / total) * 152);
      const col = DISASTER_COLORS[type]?.hex || "#6b7280";
      const r = `<rect x="${x}" y="0" width="${w}" height="8" fill="${col}"/>`;
      x += w;
      return r;
    })
    .join("");

  return `
    <div style="background:#0f172a;border:1px solid rgba(16,185,129,0.18);border-radius:14px;padding:14px 15px;min-width:205px;box-shadow:0 24px 48px rgba(0,0,0,0.7),0 0 0 1px rgba(255,255,255,0.03)">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:11px">
        <div>
          <div style="font-size:15px;font-weight:900;color:#f1f5f9;letter-spacing:-0.4px;font-family:sans-serif">${name}</div>
          <div style="font-size:9px;color:#334155;font-family:monospace;text-transform:uppercase;letter-spacing:0.12em;margin-top:2px">${total.toLocaleString()} events</div>
        </div>
        <div style="background:${domBg};border:1px solid ${DISASTER_COLORS[domType]?.hex || "#34d399"}44;border-radius:6px;padding:3px 8px;font-size:9px;font-weight:900;color:${domColor};text-transform:uppercase;letter-spacing:0.12em;font-family:monospace;white-space:nowrap">${domType}</div>
      </div>
      ${rows}
      <div style="margin-top:9px">
        <div style="font-size:9px;color:#334155;font-family:monospace;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px">Share</div>
        <div style="border-radius:4px;overflow:hidden;height:8px">
          <svg width="152" height="8" xmlns="http://www.w3.org/2000/svg" style="display:block">
            <rect width="152" height="8" fill="#1e293b"/>
            ${rects}
          </svg>
        </div>
      </div>
    </div>`;
}

export default function DisasterMarkers() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const layers = [];

    const init = async () => {
      const L = (await import("leaflet")).default;
      const maxTotal = Math.max(
        ...Object.values(DISASTER_DATA).map((c) => getTotal(c.data)),
      );

      Object.entries(DISASTER_DATA).forEach(([name, cd]) => {
        const { coords, data } = cd;
        const total = getTotal(data);
        const [domType] = getDominant(data);
        const col = DISASTER_COLORS[domType]?.hex || "#34d399";
        const radius = 24 + Math.round((total / maxTotal) * 50);

        // outer glow ring
        const glow = L.circleMarker(coords, {
          radius: radius + 12,
          color: col,
          fillColor: col,
          fillOpacity: 0.05,
          weight: 0.5,
          opacity: 0.2,
        }).addTo(map);

        // main circle
        const circle = L.circleMarker(coords, {
          radius,
          color: col,
          fillColor: col,
          fillOpacity: 0.15,
          weight: 1.5,
          opacity: 0.65,
        }).addTo(map);

        circle.bindPopup(
          L.popup({
            maxWidth: 230,
            className: "disaster-popup",
            offset: [0, -4],
            closeButton: false,
            autoPan: false,
          }).setContent(buildPopupHtml(name, cd)),
        );
        circle.on("mouseover", function () {
          this.setStyle({ fillOpacity: 0.32, weight: 2, opacity: 1 });
          this.openPopup();
        });
        circle.on("mouseout", function () {
          this.setStyle({ fillOpacity: 0.15, weight: 1.5, opacity: 0.65 });
          this.closePopup();
        });

        // label
        const lbl = L.divIcon({
          html: `<div style="transform:translate(-50%,-50%);text-align:center;pointer-events:none">
            <div style="font-size:10px;font-weight:900;color:${col};text-shadow:0 1px 10px rgba(0,0,0,0.95);font-family:sans-serif;white-space:nowrap">${name}</div>
            <div style="font-size:8.5px;color:rgba(255,255,255,0.3);font-family:monospace;margin-top:1px">${total.toLocaleString()}</div>
          </div>`,
          iconSize: [0, 0],
          className: "",
        });
        const lblMark = L.marker(coords, {
          icon: lbl,
          interactive: false,
        }).addTo(map);

        layers.push(glow, circle, lblMark);
      });
    };

    init();
    return () =>
      layers.forEach((l) => {
        try {
          map.removeLayer(l);
        } catch {}
      });
  }, [map]);

  return null;
}
