// 黑金主题 —— 全项目唯一的颜色/缓动来源（skill 硬规矩第 9 条）
import { Easing } from "remotion";

export const theme = {
  colors: {
    bg: "#0b0b0b",
    bgAlt: "#111112",
    gold: "#c9a96e",
    goldDim: "#8d7548",
    white: "#ede9e0",
    dim: "#6c6a66",
    danger: "#ce3830",
    glow: "rgba(201,169,110,0.45)",
  },
  fonts: {
    serif: '"Noto Serif CJK SC", "Songti SC", serif',
    sans: '"Noto Sans CJK SC", "PingFang SC", sans-serif',
    mono: '"DejaVu Sans Mono", monospace',
  },
  // 线性缓动是禁止的 —— 所有 interpolate 都要挂这些曲线
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
  },
} as const;
