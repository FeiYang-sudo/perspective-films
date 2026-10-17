import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";

// ── 层1：背景网格（流动的径向光，不用纯色底） ──
export const BgMesh: React.FC<{ hue?: "warm" | "cold" }> = ({ hue = "warm" }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const a = hue === "warm" ? "201,169,110" : "120,140,170";
  const b = hue === "warm" ? "150,110,60" : "70,90,130";
  const g1x = 32 + 7 * Math.sin(t / 3.1);
  const g1y = 26 + 6 * Math.cos(t / 3.7);
  const g2x = 70 + 6 * Math.cos(t / 4.3);
  const g2y = 70 + 7 * Math.sin(t / 2.9);
  return (
    <AbsoluteFill
      style={{
        background:
          `radial-gradient(58% 46% at ${g1x}% ${g1y}%, rgba(${a},0.22), rgba(${a},0) 70%),` +
          `radial-gradient(52% 40% at ${g2x}% ${g2y}%, rgba(${b},0.18), rgba(${b},0) 72%),` +
          `linear-gradient(175deg, #101011 0%, ${theme.colors.bg} 55%, #08080a 100%)`,
      }}
    />
  );
};

// ── 层4：调色（上下压暗，让视线留在中间） ──
export const Grade: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 24%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.62) 100%)",
    }}
  />
);

// ── 层5：颗粒 ──
export const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: 0.32, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%">
        <filter id="grain-n">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 12} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-n)" opacity={0.28} />
      </svg>
    </AbsoluteFill>
  );
};

// ── 层5：暗角 ──
export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(120% 95% at 50% 48%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.42) 78%, rgba(0,0,0,0.72) 100%)",
    }}
  />
);

// ── 五层堆栈的强制执行者：背景 → 内容 → 调色 → 颗粒 → 暗角 ──
export const Chrome: React.FC<{ children: React.ReactNode; hue?: "warm" | "cold" }> = ({
  children,
  hue,
}) => (
  <AbsoluteFill style={{ backgroundColor: theme.colors.bg }}>
    <BgMesh hue={hue} />
    <AbsoluteFill>{children}</AbsoluteFill>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
