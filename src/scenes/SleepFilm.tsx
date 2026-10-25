import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../theme";
import { Chrome, BgMesh, Grade, Grain, Vignette } from "../components/Chrome";
import { Beat, Counter, GoldRule, SpringIn, Txt, WordReveal } from "../components/Motion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ───────────────────────── S0 · 片名（0–10s） ─────────────────────────
const Title: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exit = interpolate(f, [9 * fps, 9.5 * fps], [1, 0], { ...clamp, easing: theme.ease.in });
  const br = Math.sin(f / 20) * 2;
  return (
    <AbsoluteFill style={{ opacity: exit, transform: `translateY(${br}px)` }}>
      <Chrome hue="cold">
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <SpringIn delay={4} y={14} blur={8}>
            <div style={{ fontFamily: theme.fonts.sans, fontSize: 20, letterSpacing: "0.55em", color: theme.colors.dim, paddingLeft: "0.55em" }}>
              HOW MUCH SLEEP · CHINA 2026
            </div>
          </SpringIn>
          <div style={{ height: 46 }} />
          <WordReveal text="睡够了吗" delay={12} stagger={4} size={132} />
          <div style={{ height: 30 }} />
          <SpringIn delay={40} y={18} blur={10}>
            <div style={{ fontFamily: theme.fonts.serif, fontSize: 44, color: theme.colors.dim }}>
              中国高中生的睡眠，用数据说话
            </div>
          </SpringIn>
          <div style={{ height: 44 }} />
          <GoldRule delay={56} w={360} dur={24} thickness={2} glow={14} />
        </AbsoluteFill>
      </Chrome>
    </AbsoluteFill>
  );
};

// ───────────────────── S1 · 标准（300–1050，25s） ─────────────────────
const Standard: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rows = [
    { who: "小学生", h: "10", bed: "21:20", at: 70 },
    { who: "初中生", h: "9", bed: "22:00", at: 110 },
    { who: "高中生", h: "8", bed: "23:00", at: 150 },
  ];
  return (
    <Chrome hue="warm">
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 90 }}>
        <SpringIn delay={8} y={16} blur={8}>
          <div style={{ fontFamily: theme.fonts.sans, fontSize: 22, letterSpacing: "0.4em", color: theme.colors.dim, paddingLeft: "0.4em" }}>
            教育部办公厅 · 2021 年睡眠管理通知
          </div>
        </SpringIn>
        <div style={{ height: 54 }} />
        {rows.map((r, i) => {
          const p = spring({ frame: f - r.at, fps, config: theme.spring.snappy });
          const last = i === rows.length - 1;
          return (
            <div
              key={r.who}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 26,
                marginBottom: 26,
                opacity: p,
                transform: `translateY(${(1 - p) * 26}px)`,
              }}
            >
              <span style={{ fontFamily: theme.fonts.serif, fontSize: 46, color: theme.colors.dim, width: 190, textAlign: "right" }}>
                {r.who}
              </span>
              <span
                style={{
                  fontFamily: theme.fonts.serif,
                  fontSize: last ? 128 : 96,
                  fontWeight: 700,
                  color: last ? theme.colors.gold : theme.colors.white,
                  lineHeight: 1,
                  textShadow: last ? "0 0 50px rgba(201,169,110,0.4)" : undefined,
                }}
              >
                {r.h}
                <span style={{ fontSize: 40, marginLeft: 8 }}>小时</span>
              </span>
              <span style={{ fontFamily: theme.fonts.sans, fontSize: 26, color: theme.colors.dim }}>
                一般不晚于 {r.bed}
              </span>
            </div>
          );
        })}
        <div style={{ height: 26 }} />
        <SpringIn delay={220} y={16} blur={8}>
          <div style={{ fontFamily: theme.fonts.sans, fontSize: 30, color: theme.colors.gray ?? theme.colors.dim }}>
            全国爱卫办《睡眠健康核心信息》：中小学生 8—10 小时
          </div>
        </SpringIn>
      </AbsoluteFill>
    </Chrome>
  );
};

// ───────────────────── S2 · 现实（1050–2100，35s） ─────────────────────
const Reality: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 84.1% 进度条
  const barW = 1100;
  const p = interpolate(f, [40, 150], [0, 0.841], { ...clamp, easing: theme.ease.out });
  return (
    <Chrome hue="cold">
      <AbsoluteFill>
        {/* 84.1% 大条 */}
        <div style={{ position: "absolute", left: 410, top: 250, width: barW, height: 3, background: "rgba(255,255,255,0.12)" }} />
        <div
          style={{
            position: "absolute",
            left: 410,
            top: 244,
            width: barW * p,
            height: 15,
            background: theme.colors.danger,
            boxShadow: "0 0 26px rgba(206,56,48,0.5)",
          }}
        />
        <div style={{ position: "absolute", left: 410, top: 180, width: barW, textAlign: "center" }}>
          <span style={{ fontFamily: theme.fonts.serif, fontSize: 96, fontWeight: 700, color: theme.colors.danger }}>
            <Counter to={84.1} delay={40} dur={110} decimals={1} />%
          </span>
          <div style={{ fontFamily: theme.fonts.sans, fontSize: 24, color: theme.colors.dim, marginTop: 6 }}>
            高中生睡眠时长未达标
          </div>
        </div>
      </AbsoluteFill>

      <Beat from={170} dur={110} top={700}>
        <Txt size={38} color={theme.colors.dim}>6—17 岁 · 近 7 万名学生样本</Txt>
        <Txt size={64} color={theme.colors.gold}>超六成</Txt>
        <Txt size={38} color={theme.colors.dim}>睡不到 8 小时</Txt>
      </Beat>
      <Beat from={300} dur={100} top={688}>
        <Txt size={36} color={theme.colors.dim}>13—17 岁 · 睡眠不足比例</Txt>
        <Txt size={84} color={theme.colors.danger}>八成</Txt>
      </Beat>
      <Beat from={420} dur={110} top={676}>
        <Txt size={34} color={theme.colors.dim}>高中生上学日平均睡眠</Txt>
        <Txt size={96} color={theme.colors.white}>
          <Counter to={7.2} dur={26} decimals={1} />
        </Txt>
        <Txt size={40} color={theme.colors.dim}>小时</Txt>
      </Beat>
      <Beat from={540} dur={100} top={700}>
        <Txt size={34} color={theme.colors.dim}>全体青少年 7.8 小时，比 2009 年少了</Txt>
        <Txt size={58} color={theme.colors.gold}>0.3 小时</Txt>
      </Beat>
      <Beat from={650} dur={120} top={676}>
        <Txt size={34} color={theme.colors.dim}>上学日睡满 8 小时的青少年</Txt>
      </Beat>
      <Beat from={700} dur={90} top={756}>
        <Txt size={54} color={theme.colors.white}>47.4%</Txt>
        <Txt size={40} color={theme.colors.dim}>→</Txt>
        <Txt size={54} color={theme.colors.danger}>46.4%</Txt>
        <Txt size={30} color={theme.colors.dim}>（2009 → 2020）</Txt>
      </Beat>
    </Chrome>
  );
};

// ─────────────── S3 · 越挤越紧 / 抑郁平稳（2100–2700，20s） ───────────────
const Trend: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = interpolate(f, [20, 150], [0, 1], { ...clamp, easing: theme.ease.out });
  const W = 900, H = 300, X = 510, Y = 200;
  // 两条折线：睡眠不足（上升）vs 抑郁检出率（平稳）
  const pts = (kind: "bad" | "flat") =>
    Array.from({ length: 12 }).map((_, i) => {
      const x = X + (W * i) / 11;
      const y = kind === "bad" ? Y + H - (H * 0.1 + (H * 0.72 * i) / 11) : Y + H - H * 0.72 - Math.sin(i * 1.3) * 8;
      return `${x},${y}`;
    });
  return (
    <Chrome hue="cold">
      <AbsoluteFill>
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
          <polyline points={pts("flat").join(" ")} fill="none" stroke="rgba(237,233,224,0.55)" strokeWidth={3}
            strokeDasharray={2600} strokeDashoffset={2600 * (1 - draw)} />
          <polyline points={pts("bad").join(" ")} fill="none" stroke={theme.colors.danger} strokeWidth={5}
            strokeDasharray={2600} strokeDashoffset={2600 * (1 - draw)} filter="drop-shadow(0 0 8px rgba(206,56,48,0.6))" />
        </svg>
        <SpringIn delay={150} y={12} blur={6}>
          <div style={{ position: "absolute", left: X, top: Y - 60, fontFamily: theme.fonts.sans, fontSize: 26, color: "rgba(237,233,224,0.75)" }}>
            ● 青少年抑郁检出率 —— 保持平稳
          </div>
        </SpringIn>
        <SpringIn delay={170} y={12} blur={6}>
          <div style={{ position: "absolute", left: X + 20, top: Y + H + 24, fontFamily: theme.fonts.sans, fontSize: 26, color: theme.colors.danger }}>
            ● 睡眠不足 —— 日趋严重
          </div>
        </SpringIn>
        <SpringIn delay={210} y={10} blur={6}>
          <div style={{ position: "absolute", left: X, top: Y + H + 66, fontFamily: theme.fonts.sans, fontSize: 20, color: theme.colors.dim }}>
            2009 — 2020
          </div>
        </SpringIn>
      </AbsoluteFill>
      <Beat from={240} dur={150} top={700}>
        <Txt size={44} color={theme.colors.white}>年级越高越缺觉</Txt>
        <Txt size={44} color={theme.colors.gold}>越临近中考、高考，睡眠越被挤压</Txt>
      </Beat>
    </Chrome>
  );
};

// ─────────────── S4 · 原因（2700–3450，25s）───────────────
const Causes: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rows = [
    { name: "课业压力", v: 67, color: theme.colors.danger, at: 20 },
    { name: "电子屏幕", v: 40, color: theme.colors.gold, at: 70 },
    { name: "声光 / 噪音环境", v: 26, color: theme.colors.goldDim, at: 110 },
    { name: "家长自身睡眠", v: 20, color: theme.colors.goldDim, at: 150 },
  ];
  return (
    <Chrome hue="warm">
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 120 }}>
        <SpringIn delay={8} y={12} blur={6}>
          <div style={{ fontFamily: theme.fonts.sans, fontSize: 22, letterSpacing: "0.4em", color: theme.colors.dim, marginBottom: 46 }}>
            W H A T   T A K E S   I T   A W A Y
          </div>
        </SpringIn>
        {rows.map((r) => {
          const p = interpolate(f, [r.at, r.at + 40], [0, 1], { ...clamp, easing: theme.ease.out });
          return (
            <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 26, width: 1200 }}>
              <span style={{ fontFamily: theme.fonts.serif, fontSize: 34, color: theme.colors.white, width: 330, textAlign: "right" }}>{r.name}</span>
              <div style={{ width: 620 * p, height: 20, background: r.color, borderRadius: 3, boxShadow: `0 0 18px ${r.color}55` }} />
              <span style={{ fontFamily: theme.fonts.sans, fontSize: 26, color: theme.colors.dim }}>
                {Math.round(r.v * p)}%
              </span>
            </div>
          );
        })}
        <div style={{ height: 20 }} />
        <SpringIn delay={230} y={14} blur={8}>
          <div style={{ fontFamily: theme.fonts.sans, fontSize: 28, color: theme.colors.dim }}>
            很多孩子 12 点后才睡 → 深睡眠变少 → 影响认知恢复与激素分泌（归因口径：2019 白皮书·多选）
          </div>
        </SpringIn>
      </AbsoluteFill>
      <Beat from={400} dur={140} top={940} y={16}>
        <Txt size={32} color={theme.colors.gray ?? theme.colors.dim}>睡眠不足，正成为公共健康问题</Txt>
      </Beat>
    </Chrome>
  );
};

// ─────────────── S5 · 代价（3450–4050，20s）───────────────
const Cost: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chips = ["肥胖", "神经衰弱", "抑郁症状"];
  return (
    <Chrome hue="cold">
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 80 }}>
        <SpringIn delay={10} y={14} blur={8}>
          <div style={{ fontFamily: theme.fonts.serif, fontSize: 52, color: theme.colors.white }}>睡不好的孩子，更容易出现</div>
        </SpringIn>
        <div style={{ height: 46, display: "flex", gap: 26 }}>
          {chips.map((c, i) => {
            const p = spring({ frame: f - 50 - i * 16, fps, config: theme.spring.bouncy });
            return (
              <div
                key={c}
                style={{
                  fontFamily: theme.fonts.serif,
                  fontSize: 56,
                  color: theme.colors.bg,
                  background: theme.colors.gold,
                  padding: "10px 34px",
                  borderRadius: 6,
                  opacity: Math.min(1, p),
                  transform: `scale(${0.75 + 0.25 * p})`,
                  boxShadow: "0 0 40px rgba(201,169,110,0.35)",
                }}
              >
                {c}
              </div>
            );
          })}
        </div>
        <div style={{ height: 56 }} />
        <SpringIn delay={140} y={16} blur={8}>
          <div>
            <span style={{ fontFamily: theme.fonts.serif, fontSize: 44, color: theme.colors.white }}>其中 </span>
            <span style={{ fontFamily: theme.fonts.serif, fontSize: 76, fontWeight: 700, color: theme.colors.danger }}>超四成</span>
            <span style={{ fontFamily: theme.fonts.serif, fontSize: 44, color: theme.colors.white }}>成绩排在班级后 25%</span>
          </div>
        </SpringIn>
        <div style={{ height: 26 }} />
        <SpringIn delay={200} y={12} blur={6}>
          <div style={{ fontFamily: theme.fonts.sans, fontSize: 30, color: theme.colors.dim, letterSpacing: "0.08em" }}>
            —— 这是关联，不等于因果
          </div>
        </SpringIn>
      </AbsoluteFill>
    </Chrome>
  );
};

// ─────────────── S6 · 地区（4050–4350，10s）───────────────
const Region: React.FC = () => {
  const f = useCurrentFrame();
  const rows = [
    { p: "北京", d: "睡眠状况评分 72.94", v: 1 },
    { p: "浙江", d: "70.00", v: 0.88 },
    { p: "广西", d: "69.41", v: 0.85 },
    { p: "东部 → 西部", d: "整体东部略好于西部", v: 0.5 },
  ];
  return (
    <Chrome hue="warm">
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 60 }}>
        <SpringIn delay={4} y={10} blur={6}>
          <div style={{ fontFamily: theme.fonts.sans, fontSize: 22, letterSpacing: "0.4em", color: theme.colors.dim, marginBottom: 40 }}>
            W H E R E   T H E Y   S L E E P
          </div>
        </SpringIn>
        {rows.map((r, i) => {
          const k = interpolate(f, [20 + i * 22, 52 + i * 22], [0, r.v], { ...clamp, easing: theme.ease.out });
          return (
            <div key={r.p} style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 24, width: 1160 }}>
              <span style={{ fontFamily: theme.fonts.serif, fontSize: 36, color: i === 0 ? theme.colors.gold : theme.colors.white, width: 260, textAlign: "right" }}>{r.p}</span>
              <div style={{ width: 640 * k, height: 18, background: i === 0 ? theme.colors.gold : theme.colors.goldDim, borderRadius: 3 }} />
              <span style={{ fontFamily: theme.fonts.sans, fontSize: 24, color: theme.colors.dim }}>{r.d}</span>
            </div>
          );
        })}
      </AbsoluteFill>
    </Chrome>
  );
};

// ─────────────── S7 · 行动（4350–4950，20s）───────────────
const Action: React.FC = () => (
  <Chrome hue="warm">
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 60 }}>
      <SpringIn delay={4} y={12} blur={8}>
        <div style={{ fontFamily: theme.fonts.sans, fontSize: 22, letterSpacing: "0.4em", color: theme.colors.dim }}>A SCHOOL IN BEIJING</div>
      </SpringIn>
      <div style={{ height: 40 }} />
      <SpringIn delay={20} y={16} blur={10}>
        <div style={{ fontFamily: theme.fonts.serif, fontSize: 78, fontWeight: 700, color: theme.colors.gold }}>睡眠令</div>
      </SpringIn>
      <div style={{ height: 34 }} />
      <SpringIn delay={40} y={14} blur={8}>
        <div style={{ fontFamily: theme.fonts.serif, fontSize: 50, color: theme.colors.white }}>高中生 23:00 准时熄灯</div>
      </SpringIn>
      <div style={{ height: 18 }} />
      <SpringIn delay={60} y={14} blur={8}>
        <div style={{ fontFamily: theme.fonts.serif, fontSize: 56, color: theme.colors.white }}>作业没写完，<span style={{ color: theme.colors.gold }}>也停笔</span></div>
      </SpringIn>
      <div style={{ height: 18 }} />
      <SpringIn delay={80} y={14} blur={8}>
        <div style={{ fontFamily: theme.fonts.sans, fontSize: 34, color: theme.colors.dim }}>初中生 22:30 必须上床</div>
      </SpringIn>
      <div style={{ height: 44 }} />
      <GoldRule delay={110} w={300} dur={22} thickness={2} glow={12} />
      <div style={{ height: 30 }} />
      <SpringIn delay={140} y={12} blur={6}>
        <div style={{ fontFamily: theme.fonts.sans, fontSize: 26, color: theme.colors.dim }}>2026 年新学期，这份倡议冲上热搜</div>
      </SpringIn>
    </AbsoluteFill>
  </Chrome>
);

// ─────────────── S8 · 回顾 + 收尾（4950–5400，15s）───────────────
const Recap: React.FC = () => {
  const f = useCurrentFrame();
  const items = [
    "标准 8 小时，23:00 前就寝 —— 八成多高中生没做到",
    "全体青少年 7.8 小时，高中生只有 7.2 小时",
    "课业压力是第一因素；睡不好的孩子，成绩更常排在后面",
  ];
  return (
    <Chrome hue="warm">
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 40 }}>
        {items.map((s, i) => {
          const p = spring({ frame: f - 8 - i * 26, fps: 30, config: theme.spring.snappy });
          return (
            <div key={i} style={{ fontFamily: theme.fonts.serif, fontSize: 40, color: i === 0 ? theme.colors.white : theme.colors.dim, marginBottom: 26, opacity: p, transform: `translateY(${(1 - p) * 22}px)`, textAlign: "center" }}>
              {s}
            </div>
          );
        })}
        <div style={{ height: 60 }} />
        <SpringIn delay={130} y={18} blur={14}>
          <div style={{ fontFamily: theme.fonts.serif, fontSize: 88, fontWeight: 700, color: theme.colors.gold, textShadow: "0 0 60px rgba(201,169,110,0.45)" }}>
            晚安
          </div>
        </SpringIn>
        <div style={{ height: 20 }} />
        <SpringIn delay={160} y={14} blur={10}>
          <div style={{ fontFamily: theme.fonts.serif, fontSize: 46, color: theme.colors.white }}>十一点前，放下笔</div>
        </SpringIn>
      </AbsoluteFill>
    </Chrome>
  );
};

export const SleepFilm: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: theme.colors.bg }}>
    <Sequence from={0} durationInFrames={300} name="片名"><Title /></Sequence>
    <Sequence from={300} durationInFrames={750} name="标准"><Standard /></Sequence>
    <Sequence from={1050} durationInFrames={1050} name="现实"><Reality /></Sequence>
    <Sequence from={2100} durationInFrames={600} name="趋势"><Trend /></Sequence>
    <Sequence from={2700} durationInFrames={750} name="原因"><Causes /></Sequence>
    <Sequence from={3450} durationInFrames={600} name="代价"><Cost /></Sequence>
    <Sequence from={4050} durationInFrames={300} name="地区"><Region /></Sequence>
    <Sequence from={4350} durationInFrames={600} name="行动"><Action /></Sequence>
    <Sequence from={4950} durationInFrames={450} name="回顾"><Recap /></Sequence>
  </AbsoluteFill>
);
