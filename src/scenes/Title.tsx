import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { Chrome } from "../components/Chrome";
import { GoldRule, SpringIn, WordReveal } from "../components/Motion";

// S0 · 片名（0–5.5s 相对本场景）
export const Title: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const exitAt = 5.0 * fps;
  const eo = interpolate(f, [exitAt, exitAt + 9], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.ease.in,
  });
  const ey = interpolate(f, [exitAt, exitAt + 9], [0, -28], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const breathe = Math.sin(f / 19) * 2.4;

  return (
    <Chrome hue="warm">
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: eo,
          transform: `translateY(${ey + breathe}px)`,
        }}
      >
        <SpringIn delay={4} y={16} blur={8}>
          <div
            style={{
              fontFamily: theme.fonts.sans,
              fontSize: 21,
              letterSpacing: "0.62em",
              color: theme.colors.dim,
              textAlign: "center",
              paddingLeft: "0.62em",
            }}
          >
            THE END AT EIGHTEEN
          </div>
        </SpringIn>

        <div style={{ height: 62 }} />

        <WordReveal text="人生的终点为什么是" delay={14} stagger={2} size={64} />

        <div style={{ height: 22 }} />

        <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
          <SpringIn delay={36} y={34} scale={0.7} blur={20}>
            <span
              style={{
                fontFamily: theme.fonts.serif,
                fontSize: 214,
                fontWeight: 700,
                color: theme.colors.gold,
                lineHeight: 0.92,
                textShadow: "0 0 70px rgba(201,169,110,0.32)",
              }}
            >
              18
            </span>
          </SpringIn>
          <SpringIn delay={46} y={18} blur={12}>
            <span
              style={{
                fontFamily: theme.fonts.serif,
                fontSize: 96,
                color: theme.colors.white,
                fontWeight: 600,
              }}
            >
              岁
            </span>
          </SpringIn>
        </div>

        <div style={{ height: 40 }} />
        <GoldRule delay={58} w={440} dur={26} thickness={2} glow={16} />
      </AbsoluteFill>
    </Chrome>
  );
};
