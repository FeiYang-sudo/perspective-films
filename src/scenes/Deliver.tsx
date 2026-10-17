import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { Chrome } from "../components/Chrome";
import { Beat, Counter, SpringIn, Txt } from "../components/Motion";

// S1 · 交付日（0–14.5s 相对本场景）：进度条 0 岁 → 18 岁卡住
const BAR_W = 1180;
const X0 = (1920 - BAR_W) / 2;
const Y = 470;

export const Deliver: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fillStart = 18;
  const fillDur = 165;
  const p = interpolate(f, [fillStart, fillStart + fillDur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.ease.inOut,
  });
  const w = BAR_W * p;

  // 18 岁锁定
  const lockFrame = fillStart + fillDur;
  const lockP = spring({ frame: f - lockFrame, fps, config: theme.spring.bouncy });
  const ringT = interpolate(f, [lockFrame, lockFrame + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.ease.out,
  });

  return (
    <Chrome hue="warm">
      <AbsoluteFill>
        {/* 年刻度：错峰 1.2 帧依次长出 */}
        {Array.from({ length: 19 }).map((_, i) => {
          const ap = spring({ frame: f - 6 - i * 1.2, fps, config: theme.spring.snappy });
          const x = X0 + (BAR_W * i) / 18;
          const big = i % 6 === 0;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x - 1,
                top: Y - (big ? 15 : 9),
                width: 2,
                height: big ? 30 : 18,
                background: theme.colors.dim,
                opacity: 0.75 * ap,
                transform: `scaleY(${ap})`,
                transformOrigin: "center",
              }}
            />
          );
        })}

        {/* 底轨 */}
        <div
          style={{
            position: "absolute",
            left: X0,
            top: Y,
            width: BAR_W,
            height: 1,
            background: "rgba(255,255,255,0.13)",
          }}
        />

        {/* 金色进度 + 头部光点 */}
        <div
          style={{
            position: "absolute",
            left: X0,
            top: Y - 2,
            width: w,
            height: 4,
            background: theme.colors.gold,
            boxShadow: "0 0 24px rgba(201,169,110,0.55)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: X0 + w - 8,
            top: Y - 8,
            width: 16,
            height: 16,
            borderRadius: 8,
            background: theme.colors.white,
            boxShadow: "0 0 28px rgba(201,169,110,0.95)",
          }}
        />

        {/* 岁数：滚动计数（高速时带运动模糊） */}
        <div
          style={{
            position: "absolute",
            left: X0,
            top: Y - 104,
            width: BAR_W,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: theme.fonts.serif,
              fontSize: 58,
              fontWeight: 600,
              color: theme.colors.gold,
            }}
          >
            <Counter to={18} delay={fillStart} dur={fillDur} decimals={1} />
          </span>
          <span style={{ fontFamily: theme.fonts.sans, fontSize: 24, color: theme.colors.dim, marginLeft: 10 }}>
            岁
          </span>
        </div>

        {/* 两端语义标签 */}
        <div style={{ position: "absolute", left: X0 - 30, top: Y + 30, fontFamily: theme.fonts.sans, fontSize: 20, color: theme.colors.dim }}>
          0 岁
        </div>
        <div style={{ position: "absolute", left: X0 + BAR_W - 30, top: Y + 30, fontFamily: theme.fonts.sans, fontSize: 20, color: theme.colors.dim }}>
          18 岁
        </div>

        {/* 18 岁锁定：金框弹入 + 一圈扩散脉冲 */}
        {f > lockFrame - 2 && (
          <div
            style={{
              position: "absolute",
              left: X0 + BAR_W - 34 * lockP,
              top: Y - 40 * lockP,
              width: 68 * lockP,
              height: 78 * lockP,
              border: `2px solid ${theme.colors.gold}`,
              borderRadius: 6,
              opacity: Math.min(1, lockP) * 0.92,
              boxShadow: `0 0 ${34 * lockP}px rgba(201,169,110,0.5)`,
            }}
          />
        )}
        {f > lockFrame && (
          <div
            style={{
              position: "absolute",
              left: X0 + BAR_W - 36,
              top: Y - 36,
              width: 72,
              height: 72,
              borderRadius: "50%",
              border: `2px solid rgba(201,169,110,${0.75 * (1 - ringT)})`,
              transform: `scale(${0.5 + ringT * 2.6})`,
              opacity: 1 - ringT,
            }}
          />
        )}
      </AbsoluteFill>

      {/* 台词：一句一句错峰进场 */}
      <Beat from={22} dur={72} top={690}>
        <Txt size={54}>把一个孩子，当成一个项目</Txt>
      </Beat>

      <Beat from={96} dur={82} top={690}>
        <Txt size={56}>18 岁，就是</Txt>
        <Txt size={62} color={theme.colors.gold}>交付日</Txt>
      </Beat>

      <Beat from={182} dur={62} top={690}>
        <Txt size={50} color={theme.colors.white}>在这之前，是一笔账</Txt>
      </Beat>

      <Beat from={248} dur={60} top={690}>
        <Txt size={44} color={theme.colors.dim}>全国家庭，把孩子养到 17 岁</Txt>
      </Beat>

      <Beat from={312} dur={62} top={676}>
        <Txt size={44} color={theme.colors.dim}>平均</Txt>
        <Txt size={86} color={theme.colors.gold}>
          <Counter to={53.8} delay={0} dur={16} decimals={1} />
        </Txt>
        <Txt size={48} color={theme.colors.gold}>万</Txt>
      </Beat>

      <Beat from={378} dur={62} top={676}>
        <Txt size={44} color={theme.colors.dim}>城镇家庭</Txt>
        <Txt size={86} color={theme.colors.gold}>
          <Counter to={66.7} delay={0} dur={16} decimals={1} />
        </Txt>
        <Txt size={48} color={theme.colors.gold}>万</Txt>
      </Beat>
    </Chrome>
  );
};
