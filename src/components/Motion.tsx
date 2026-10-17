import React from "react";
import {
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ── 通用入场：opacity + translateY + scale + blur 一起动（禁止只淡入） ──
export const SpringIn: React.FC<{
  delay?: number;
  y?: number;
  scale?: number;
  blur?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ delay = 0, y = 44, scale = 0.94, blur = 12, style, children }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - delay, fps, config: theme.spring.smooth });
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * y}px) scale(${scale + (1 - scale) * p})`,
        filter: `blur(${(1 - p) * blur}px)`,
        willChange: "transform, opacity, filter",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ── 逐字揭示：遮罩 + 上移 + 旋转 + 模糊，错峰 3 帧 ──
export const WordReveal: React.FC<{
  text: string;
  delay?: number;
  stagger?: number;
  size?: number;
  color?: string;
  font?: string;
  weight?: number;
  letterSpacing?: string;
}> = ({
  text,
  delay = 0,
  stagger = 3,
  size = 64,
  color = theme.colors.white,
  font = theme.fonts.serif,
  weight = 600,
  letterSpacing = "0.03em",
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        fontFamily: font,
        fontSize: size,
        color,
        fontWeight: weight,
        letterSpacing,
        lineHeight: 1.34,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {text.split("").map((ch, i) => {
        const p = spring({ frame: f - delay - i * stagger, fps, config: theme.spring.snappy });
        return (
          <span
            key={i}
            style={{ display: "inline-block", overflow: "hidden", paddingBottom: size * 0.14 }}
          >
            <span
              style={{
                display: "inline-block",
                transform: `translateY(${(1 - p) * 108}%) rotate(${(1 - p) * 5}deg)`,
                opacity: p,
                filter: `blur(${(1 - p) * 7}px)`,
              }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          </span>
        );
      })}
    </div>
  );
};

// ── 数字滚动：缓动 + 高速时轻微运动模糊 ──
export const Counter: React.FC<{
  from?: number;
  to: number;
  delay?: number;
  dur?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  style?: React.CSSProperties;
}> = ({ from = 0, to, delay = 0, dur = 20, decimals = 1, suffix = "", prefix = "", style }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - delay, [0, dur], [0, 1], { ...clamp, easing: theme.ease.out });
  const v = from + (to - from) * p;
  const moving = p > 0.04 && p < 0.96;
  return (
    <span
      style={{
        fontVariantNumeric: "tabular-nums",
        filter: moving ? "blur(1.8px)" : "none",
        ...style,
      }}
    >
      {prefix}
      {v.toFixed(decimals)}
      {suffix}
    </span>
  );
};

// ── 金色细线：从 0 长出（带辉光） ──
export const GoldRule: React.FC<{
  delay: number;
  w: number;
  dur?: number;
  thickness?: number;
  glow?: number;
}> = ({ delay, w, dur = 22, thickness = 2, glow = 0 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - delay, [0, dur], [0, 1], { ...clamp, easing: theme.ease.out });
  return (
    <div
      style={{
        width: w * p,
        height: thickness,
        borderRadius: thickness,
        background: theme.colors.gold,
        boxShadow: glow ? `0 0 ${glow}px rgba(201,169,110,0.6)` : undefined,
      }}
    />
  );
};

// ── 一句台词：入场 spring，出口比入口快（9 帧 vs 24 帧） ──
const BeatInner: React.FC<{ dur: number; y: number; top?: number; children: React.ReactNode }> = ({
  dur,
  y,
  top,
  children,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f, fps, config: theme.spring.snappy });
  const ex = interpolate(f, [dur - 9, dur], [1, 0], { ...clamp, easing: theme.ease.in });
  const ey = interpolate(f, [dur - 9, dur], [0, -22], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: top ?? 640,
        display: "flex",
        justifyContent: "center",
        alignItems: "baseline",
        gap: 18,
        opacity: Math.min(p, ex),
        transform: `translateY(${(1 - p) * y + ey}px)`,
        filter: `blur(${(1 - p) * 9}px)`,
      }}
    >
      {children}
    </div>
  );
};

export const Beat: React.FC<{
  from: number;
  dur: number;
  y?: number;
  top?: number;
  children: React.ReactNode;
}> = ({ from, dur, y = 34, top, children }) => (
  <Sequence from={from} durationInFrames={dur} layout="none">
    <BeatInner dur={dur} y={y} top={top}>
      {children}
    </BeatInner>
  </Sequence>
);

// ── 台词文字样式（正文 / 数字 / 强调） ──
export const Txt: React.FC<{ children: React.ReactNode; size?: number; color?: string; serif?: boolean }> = ({
  children,
  size = 52,
  color = theme.colors.white,
  serif = true,
}) => (
  <span
    style={{
      fontFamily: serif ? theme.fonts.serif : theme.fonts.sans,
      fontSize: size,
      color,
      fontWeight: serif ? 600 : 400,
      letterSpacing: "0.02em",
      lineHeight: 1.3,
    }}
  >
    {children}
  </span>
);
