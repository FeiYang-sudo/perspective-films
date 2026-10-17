import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { BgMesh, Grain, Grade, Vignette } from "../components/Chrome";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ── 金粉/矿砂颗粒字：turbulence 当蒙版"吃"掉字的一部分 + 金色渐变填充 ──
export const GoldDustText: React.FC<{ text: string; size: number; y?: number }> = ({ text, size, y = 520 }) => {
  const f = useCurrentFrame();
  const heat = interpolate(f, [5, 14, 40], [0, 1.6, 1], { ...clamp, easing: theme.ease.out });
  const breathe = 1 + Math.sin(f / 16) * 0.008;
  const seed = Math.floor(f / 2) % 89;

  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        {/* 金色渐变（上亮下暗，像被光打过的金箔） */}
        <linearGradient id="gold-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff3cf" />
          <stop offset="34%" stopColor="#f3d089" />
          <stop offset="62%" stopColor="#c9a145" />
          <stop offset="100%" stopColor="#7a5a1f" />
        </linearGradient>

        {/* 颗粒蒙版：高频噪声 → 高对比 alpha → 把字"啃"成矿砂质感 */}
        <filter id="dust" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.055 0.06" numOctaves={4} seed={seed} result="n" />
          <feColorMatrix
            in="n"
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    1.6 0 0 0 -0.52"
            result="cut"
          />
          <feComposite in="SourceGraphic" in2="cut" operator="in" result="granular" />
          <feGaussianBlur in="granular" stdDeviation="0.6" result="soft" />
          <feMerge>
            <feMergeNode in="soft" />
            <feMergeNode in="granular" />
          </feMerge>
        </filter>

        {/* 外发光（单独一层，避免颗粒被糊掉） */}
        <filter id="halo" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation={18 + 22 * heat} />
        </filter>
      </defs>

      <g transform={`translate(960 ${y}) scale(${breathe})`} style={{ transformOrigin: "960px 520px" }}>
        {/* 光晕层 */}
        <text
          x={0}
          y={0}
          textAnchor="middle"
          fontFamily={theme.fonts.serif}
          fontWeight={700}
          fontSize={size}
          fill="#ffd990"
          opacity={0.55 * Math.min(1, heat)}
          filter="url(#halo)"
        >
          {text}
        </text>
        {/* 颗粒本体 */}
        <text
          x={0}
          y={0}
          textAnchor="middle"
          fontFamily={theme.fonts.serif}
          fontWeight={700}
          fontSize={size}
          fill="url(#gold-grad)"
          filter="url(#dust)"
        >
          {text}
        </text>
      </g>
    </svg>
  );
};

// ── 粒子场：细长拖尾 + 大颗散景，向上/向外飘 ──
export const Field: React.FC<{ count?: number; start?: number }> = ({ count = 110, start = 0 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen" }}>
      {Array.from({ length: count }).map((_, i) => {
        const r1 = random(`a${i}`);
        const r2 = random(`b${i}`);
        const r3 = random(`c${i}`);
        const r4 = random(`d${i}`);
        const t = f - start;
        if (t < 0) return null;
        const speed = 0.7 + r1 * 2.6;
        const x0 = r2 * 2100 - 90;
        const y0 = 1180 - ((t * speed) % 1400);
        const x = x0 + Math.sin((t + i * 7) / 26) * 22;
        const y = y0 + Math.cos((t + i * 5) / 31) * 12;
        const isBokeh = r3 > 0.78;
        const size = isBokeh ? 16 + r4 * 46 : 1.6 + r4 * 3.4;
        const op = (isBokeh ? 0.22 : 0.72) + r4 * 0.28;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: isBokeh ? size : size * 0.6,
              height: isBokeh ? size : 20 + r4 * 96,
              borderRadius: isBokeh ? "50%" : 2,
              background: isBokeh
                ? `radial-gradient(circle, rgba(255,244,214,${op}), rgba(255,210,140,0) 70%)`
                : `linear-gradient(180deg, rgba(255,246,220,${op}), rgba(255,210,140,0))`,
              filter: `blur(${isBokeh ? 3 + r1 * 9 : 0.5 + r1 * 1.4}px)`,
              transform: isBokeh ? undefined : `rotate(${(r2 - 0.5) * 16}deg)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const GoldDust: React.FC = () => {
  const f = useCurrentFrame();
  const subIn = interpolate(f, [18, 34], [0, 1], { ...clamp, easing: theme.ease.out });
  const barH = interpolate(f, [14, 30], [0, 1], { ...clamp, easing: theme.ease.out });
  const fadeOut = interpolate(f, [132, 148], [1, 0], { ...clamp });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, opacity: fadeOut }}>
      <BgMesh hue="warm" />
      <Grade />
      <Field count={190} start={0} />
      <GoldDustText text="人生没有验收日" size={168} y={520} />
      <Field count={110} start={16} />
      <Grain />
      <Vignette />

      {/* letterbox */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 88, background: "#000" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 88, background: "#000" }} />

      {/* 红竖线 + 字幕 */}
      <div
        style={{
          position: "absolute",
          left: 150,
          bottom: 126,
          display: "flex",
          alignItems: "center",
          gap: 15,
          opacity: subIn,
          transform: `translateY(${(1 - subIn) * 12}px)`,
        }}
      >
        <div style={{ width: 3, height: 28 * barH, background: "#d8512c", borderRadius: 2 }} />
        <span style={{ fontFamily: theme.fonts.sans, fontSize: 27, color: "rgba(255,255,255,0.94)" }}>
          人生没有验收日
        </span>
      </div>
    </AbsoluteFill>
  );
};
