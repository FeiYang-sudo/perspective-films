import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../theme";
import { BgMesh, Grain, Grade, Vignette } from "../components/Chrome";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ── 粒子：确定性随机，从文字下沿往上飘的余烬 ──
export const Embers: React.FC<{ start: number; count?: number }> = ({ start, count = 80 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen" }}>
      {Array.from({ length: count }).map((_, i) => {
        const r1 = random(`x${i}`);
        const r2 = random(`y${i}`);
        const r3 = random(`s${i}`);
        const born = start + r1 * 34;
        const life = 42 + r3 * 46;
        const t = f - born;
        if (t < 0 || t > life) return null;
        const p = t / life;
        const x = 960 + (r2 - 0.5) * 1180 + Math.sin(t / 16 + i) * 14;
        const y = 540 + (r3 - 0.5) * 120 - p * (150 + r1 * 330);
        const size = 2 + r3 * 5;
        const op = Math.sin(Math.PI * p) * (0.55 + 0.45 * r2);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background:
                r1 > 0.55
                  ? "radial-gradient(circle, rgba(255,236,200,0.95), rgba(255,150,60,0.15) 70%)"
                  : "radial-gradient(circle, rgba(255,190,120,0.9), rgba(255,90,30,0.1) 70%)",
              opacity: op,
              filter: `blur(${0.6 + r3 * 2}px)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ── 白热碎裂文字 ──
export const ShatterText: React.FC<{ text: string; size: number; hold?: number }> = ({ text, size, hold = 0 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 白热过曝 → 回落
  const heat = interpolate(f, [4, 10, 30], [0, 2.6, 1.0], { ...clamp, easing: theme.ease.out });
  // 碎裂抖动幅度：入场 0 → 稳定微颤 → 结尾爆散
  const jitter = interpolate(f, [8, 26, 96 + hold, 124 + hold], [0, 11, 6, 74], { ...clamp, easing: theme.ease.inOut });
  // 整体亮度/透明度（结尾溶解）
  const dissolve = interpolate(f, [104 + hold, 126 + hold], [1, 0], { ...clamp, easing: theme.ease.in });
  // 入场
  const enter = interpolate(f, [4, 22], [0, 1], { ...clamp, easing: theme.ease.out });
  // 微呼吸
  const breathe = 1 + Math.sin(f / 14) * 0.006;

  const seed = Math.floor(f / 3) % 97;

  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="shatter-f">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.014 0.032"
            numOctaves={3}
            seed={seed}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={jitter}
            xChannelSelector="R"
            yChannelSelector="G"
          />
          <feGaussianBlur stdDeviation={f > 100 ? 1.6 : 0.55} />
        </filter>
      </svg>

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            filter: "url(#shatter-f)",
            opacity: enter * dissolve,
            transform: `scale(${(0.985 + 0.015 * enter) * breathe})`,
          }}
        >
          <span
            style={{
              fontFamily: theme.fonts.serif,
              fontSize: size,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "0.06em",
              textShadow: [
                `0 0 ${10 + 26 * heat}px rgba(255,255,255,${0.95 * Math.min(1, heat)})`,
                `0 0 ${40 + 70 * heat}px rgba(255,205,140,${0.85 * Math.min(1, heat)})`,
                `0 0 ${90 + 150 * heat}px rgba(255,140,60,${0.6 * Math.min(1, heat)})`,
                `0 0 ${170 + 240 * heat}px rgba(255,90,25,${0.38 * Math.min(1, heat)})`,
              ].join(","),
            }}
          >
            {text}
          </span>
        </div>
      </AbsoluteFill>
    </>
  );
};

// ── 参考图同款：letterbox + 字幕条 + 时间戳 ──
export const Shatter: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const subIn = interpolate(f, [16, 30], [0, 1], { ...clamp, easing: theme.ease.out });
  const subOut = interpolate(f, [128, 142], [1, 0], { ...clamp });
  const bar = interpolate(f, [12, 26], [0, 1], { ...clamp, easing: theme.ease.out });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg }}>
      <BgMesh hue="warm" />
      <Embers start={10} />
      <ShatterText text="人生没有验收日" size={146} />
      <Embers start={100} count={120} />
      <Grade />
      <Grain />
      <Vignette />

      {/* letterbox */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 92, background: "#000" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 92, background: "#000" }} />

      {/* 左下字幕 + 橙红竖线 */}
      <div
        style={{
          position: "absolute",
          left: 132,
          bottom: 128,
          display: "flex",
          alignItems: "center",
          gap: 16,
          opacity: subIn * subOut,
          transform: `translateY(${(1 - subIn) * 14}px)`,
        }}
      >
        <div style={{ width: 3, height: 30 * bar, background: "#d8512c", borderRadius: 2 }} />
        <span
          style={{
            fontFamily: theme.fonts.sans,
            fontSize: 26,
            color: "rgba(255,255,255,0.92)",
            letterSpacing: "0.02em",
          }}
        >
          最后那句，是整部片子唯一一次下判断
        </span>
      </div>

      {/* 右下时间戳 */}
      <div
        style={{
          position: "absolute",
          right: 140,
          bottom: 132,
          fontFamily: theme.fonts.mono,
          fontSize: 20,
          color: "rgba(255,255,255,0.55)",
          letterSpacing: "0.06em",
          opacity: subIn,
        }}
      >
        10-17 21:48
      </div>
    </AbsoluteFill>
  );
};
