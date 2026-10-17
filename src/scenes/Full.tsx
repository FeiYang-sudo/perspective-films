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
import { GoldDustText, Field } from "./GoldDust";
import { ShatterText, Embers } from "./Shatter";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ══════════════ S0 · 片名（金箔颗粒，0–7s） ══════════════
const TitleGold: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitAt = 6.4 * fps;
  const eo = interpolate(f, [exitAt, exitAt + 9], [1, 0], { ...clamp, easing: theme.ease.in });
  const ey = interpolate(f, [exitAt, exitAt + 9], [0, -26], { ...clamp });

  return (
    <AbsoluteFill style={{ opacity: eo, transform: `translateY(${ey}px)` }}>
      <Chrome hue="warm">
        <Grade />
        <Field count={150} start={0} />
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 60 }}>
          <SpringIn delay={4} y={14} blur={8}>
            <div style={{ fontFamily: theme.fonts.sans, fontSize: 24, letterSpacing: "0.6em", color: theme.colors.dim, paddingLeft: "0.6em" }}>
              THE END AT EIGHTEEN
            </div>
          </SpringIn>
          <div style={{ height: 42 }} />
          <GoldDustText text="人生的终点为什么是" size={86} y={0} />
          <div style={{ height: 6 }} />
          <GoldDustText text="18 岁" size={196} y={0} />
          <div style={{ height: 44 }} />
          <GoldRule delay={40} w={420} dur={24} thickness={2} glow={14} />
        </AbsoluteFill>
        <Field count={90} start={16} />
      </Chrome>
    </AbsoluteFill>
  );
};

// ══════════════ S1 · 交付日（进度条，7–47s） ══════════════
const BAR_W = 1180;
const X0 = (1920 - BAR_W) / 2;
const Y = 450;

const DeliverFull: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fillStart = 16;
  const fillDur = 150;
  const p = interpolate(f, [fillStart, fillStart + fillDur], [0, 1], { ...clamp, easing: theme.ease.inOut });
  const w = BAR_W * p;
  const lockFrame = fillStart + fillDur;
  const lockP = spring({ frame: f - lockFrame, fps, config: theme.spring.bouncy });
  const ringT = interpolate(f, [lockFrame, lockFrame + 26], [0, 1], { ...clamp, easing: theme.ease.out });

  return (
    <Chrome hue="warm">
      <AbsoluteFill>
        {Array.from({ length: 19 }).map((_, i) => {
          const ap = spring({ frame: f - 6 - i * 1.2, fps, config: theme.spring.snappy });
          const x = X0 + (BAR_W * i) / 18;
          const big = i % 6 === 0;
          return (
            <div key={i} style={{ position: "absolute", left: x - 1, top: Y - (big ? 15 : 9), width: 2, height: big ? 30 : 18, background: theme.colors.dim, opacity: 0.7 * ap, transform: `scaleY(${ap})` }} />
          );
        })}
        <div style={{ position: "absolute", left: X0, top: Y, width: BAR_W, height: 1, background: "rgba(255,255,255,0.12)" }} />
        <div style={{ position: "absolute", left: X0, top: Y - 2, width: w, height: 4, background: theme.colors.gold, boxShadow: "0 0 24px rgba(201,169,110,0.55)" }} />
        <div style={{ position: "absolute", left: X0 + w - 8, top: Y - 8, width: 16, height: 16, borderRadius: 8, background: "#fff", boxShadow: "0 0 26px rgba(201,169,110,0.9)" }} />
        <div style={{ position: "absolute", left: X0, top: Y - 96, width: BAR_W, textAlign: "center" }}>
          <span style={{ fontFamily: theme.fonts.serif, fontSize: 56, fontWeight: 600, color: theme.colors.gold }}>
            <Counter to={18} delay={fillStart} dur={fillDur} decimals={1} />
          </span>
          <span style={{ fontFamily: theme.fonts.sans, fontSize: 22, color: theme.colors.dim, marginLeft: 8 }}>岁</span>
        </div>
        <div style={{ position: "absolute", left: X0 - 24, top: Y + 28, fontFamily: theme.fonts.sans, fontSize: 19, color: theme.colors.dim }}>0 岁</div>
        <div style={{ position: "absolute", left: X0 + BAR_W - 24, top: Y + 28, fontFamily: theme.fonts.sans, fontSize: 19, color: theme.colors.dim }}>18 岁</div>
        {f > lockFrame - 2 && (
          <div style={{ position: "absolute", left: X0 + BAR_W - 34 * lockP, top: Y - 40 * lockP, width: 68 * lockP, height: 78 * lockP, border: `2px solid ${theme.colors.gold}`, borderRadius: 6, opacity: Math.min(1, lockP) * 0.9, boxShadow: `0 0 ${34 * lockP}px rgba(201,169,110,0.5)` }} />
        )}
        {f > lockFrame && (
          <div style={{ position: "absolute", left: X0 + BAR_W - 36, top: Y - 36, width: 72, height: 72, borderRadius: "50%", border: `2px solid rgba(201,169,110,${0.7 * (1 - ringT)})`, transform: `scale(${0.5 + ringT * 2.4})`, opacity: 1 - ringT }} />
        )}
      </AbsoluteFill>

      <Beat from={18} dur={72} top={700}><Txt size={52}>把一个孩子，当成一个项目</Txt></Beat>
      <Beat from={94} dur={78} top={700}><Txt size={54}>18 岁，就是</Txt><Txt size={60} color={theme.colors.gold}>交付日</Txt></Beat>
      <Beat from={176} dur={66} top={700}><Txt size={48} color={theme.colors.dim}>在这之前，是一笔账</Txt></Beat>
      <Beat from={246} dur={64} top={700}><Txt size={44} color={theme.colors.dim}>全国家庭，把孩子养到 17 岁</Txt></Beat>
      <Beat from={314} dur={70} top={688}><Txt size={40} color={theme.colors.dim}>平均</Txt><Txt size={82} color={theme.colors.gold}><Counter to={53.8} dur={14} decimals={1} /></Txt><Txt size={44} color={theme.colors.gold}>万</Txt></Beat>
      <Beat from={388} dur={70} top={688}><Txt size={40} color={theme.colors.dim}>城镇家庭</Txt><Txt size={82} color={theme.colors.gold}><Counter to={66.7} dur={14} decimals={1} /></Txt><Txt size={44} color={theme.colors.gold}>万</Txt></Beat>
      <Beat from={462} dur={62} top={700}><Txt size={44} color={theme.colors.dim}>摊到</Txt><Txt size={56} color={theme.colors.white}>4380</Txt><Txt size={44} color={theme.colors.dim}>天里</Txt></Beat>
      <Beat from={528} dur={66} top={688}><Txt size={40} color={theme.colors.dim}>大约每天</Txt><Txt size={84} color={theme.colors.gold}>152</Txt><Txt size={44} color={theme.colors.dim}>块</Txt></Beat>
      <Beat from={598} dur={64} top={700}><Txt size={54}>12 年，4380 天</Txt></Beat>
      <Beat from={666} dur={72} top={690}><Txt size={44} color={theme.colors.white}>验收，</Txt><Txt size={78} color={theme.colors.danger}>两天</Txt></Beat>
      <Beat from={742} dur={62} top={700}><Txt size={40} color={theme.colors.dim}>2026 年 6 月 7 日 — 8 日</Txt></Beat>
      <Beat from={808} dur={64} top={700}><Txt size={48}>那两天，决定你去哪</Txt></Beat>
      <Beat from={876} dur={62} top={700}><Txt size={42} color={theme.colors.dim}>所有人都只算一件事：</Txt></Beat>
      <Beat from={942} dur={72} top={690}><Txt size={76} color={theme.colors.danger}>考了多少分</Txt></Beat>
      <Beat from={1020} dur={70} top={700}><Txt size={42} color={theme.colors.dim}>这笔账，没人跟你算过</Txt></Beat>
      <Beat from={1096} dur={90} top={700}><Txt size={46} color={theme.colors.gold}>但 18 岁之后，账才开始算</Txt></Beat>
    </Chrome>
  );
};

// ══════════════ S2 · 考场（1020 帧） ══════════════
const Exam: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cols = 44;
  const rows = 18;
  const GX0 = 200, GY0 = 150, GX1 = 1720, GY1 = 600;
  const cw = (GX1 - GX0) / cols;
  const ch = (GY1 - GY0) / rows;
  const litFrac = interpolate(f, [10, 190], [0, 1], { ...clamp, easing: theme.ease.out });
  const collapse = interpolate(f, [250, 330], [0, 1], { ...clamp, easing: theme.ease.inOut });

  return (
    <Chrome hue="warm">
      <AbsoluteFill>
        {Array.from({ length: cols * rows }).map((_, idx) => {
          const i = idx % cols;
          const j = Math.floor(idx / cols);
          const r = (i * 37 + j * 91) % 100;
          const on = litFrac * 100 > r;
          if (!on) return null;
          const ap = spring({ frame: f - 8 - r * 1.6, fps, config: theme.spring.snappy });
          let x = GX0 + cw * (i + 0.5);
          let y = GY0 + ch * (j + 0.5);
          if (collapse > 0) {
            x += (960 - x) * collapse * 0.9;
            y += (375 - y) * collapse * 0.9;
          }
          const s = 3.2 * (1 - collapse * 0.55) * ap;
          return <div key={idx} style={{ position: "absolute", left: x - s, top: y - s, width: s * 2, height: s * 2, borderRadius: s, background: theme.colors.gold, opacity: (0.35 + 0.45 * ap) * (1 - collapse * 0.25) }} />;
        })}
        {collapse > 0.5 && (
          <div style={{ position: "absolute", left: 960 - 300 * collapse, top: 375 - 190 * collapse, width: 600 * collapse, height: 380 * collapse, border: `2px solid rgba(237,233,224,${0.85 * collapse})`, borderRadius: 4 }} />
        )}
      </AbsoluteFill>
      <Beat from={14} dur={80} top={700}><Txt size={42} color={theme.colors.dim}>2026 年 6 月</Txt></Beat>
      <Beat from={96} dur={110} top={676}><Txt size={96} color={theme.colors.gold}><Counter to={1290} dur={22} decimals={0} /></Txt><Txt size={52} color={theme.colors.gold}>万人</Txt></Beat>
      <Beat from={212} dur={70} top={700}><Txt size={50}>走进同一个考场</Txt></Beat>
      <Beat from={286} dur={74} top={700}><Txt size={50}>这是你人生里，</Txt><Txt size={54} color={theme.colors.gold}>最后一次</Txt></Beat>
      <Beat from={366} dur={76} top={700}><Txt size={46}>有 1290 万人陪你一起跑</Txt></Beat>
      <Beat from={448} dur={80} top={700}><Txt size={46}>并且所有人都承认</Txt><Txt size={56} color={theme.colors.gold}>同一条终点线</Txt></Beat>
      <Beat from={534} dur={76} top={700}><Txt size={46}>也是唯一一次，</Txt></Beat>
      <Beat from={616} dur={90} top={700}><Txt size={46}>你的 12 年，可以被压成</Txt><Txt size={60} color={theme.colors.danger}>一个分数</Txt></Beat>
      <Beat from={712} dur={100} top={700}><Txt size={44} color={theme.colors.gray ?? theme.colors.dim}>之后，再也没有了</Txt></Beat>
    </Chrome>
  );
};

// ══════════════ S3 · 验收之后（1260 帧） ══════════════
const After: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kill = 130;
  const c0 = 8, r0 = 7;
  const GX0 = 260, GY0 = 130, GX1 = 1660, GY1 = 560;
  const cw = (GX1 - GX0) / c0;
  const chh = (GY1 - GY0) / r0;
  const cleared = f > kill + 0.3;

  return (
    <Chrome hue="cold">
      <AbsoluteFill style={{ transform: `scale(${1 + (f / 1260) * 0.05})` }}>
        {!cleared && Array.from({ length: c0 * r0 }).map((_, idx) => {
          const i = idx % c0, j = Math.floor(idx / c0);
          const seed = (i * 31 + j * 17) % 100;
          if (f > kill - 12 + seed * 0.12) return null;
          const ap = spring({ frame: f - 4 - idx * 0.8, fps, config: theme.spring.snappy });
          return <div key={idx} style={{ position: "absolute", left: GX0 + i * cw + 8, top: GY0 + j * chh + 8, width: cw - 16, height: chh - 16, border: `1px solid rgba(201,169,110,${0.22 * ap})`, borderRadius: 2, background: `rgba(201,169,110,${0.035 * ap})` }} />;
        })}
        {cleared && (
          <>
            {Array.from({ length: c0 * r0 }).map((_, idx) => {
              const i = idx % c0, j = Math.floor(idx / c0);
              return <div key={idx} style={{ position: "absolute", left: GX0 + i * cw + 8, top: GY0 + j * chh + 8, width: cw - 16, height: chh - 16, border: "1px solid rgba(201,169,110,0.10)", borderRadius: 2 }} />;
            })}
            <div style={{ position: "absolute", left: 952, top: 320, width: 14, height: 74, background: theme.colors.gold, opacity: Math.floor(f / 15) % 2 === 0 ? 1 : 0.12 }} />
            <div style={{ position: "absolute", left: 800, top: 410, width: 320, height: 1, background: "rgba(201,169,110,0.5)" }} />
          </>
        )}
      </AbsoluteFill>
      <Beat from={10} dur={70} top={700}><Txt size={50}>验收之后，项目组解散</Txt></Beat>
      <Beat from={150} dur={80} top={690}><Txt size={40} color={theme.colors.dim}>2026 年，</Txt><Txt size={60} color={theme.colors.white}><Counter to={1270} dur={18} decimals={0} /></Txt><Txt size={40} color={theme.colors.dim}>万毕业生走出校门</Txt></Beat>
      <Beat from={236} dur={66} top={700}><Txt size={42} color={theme.colors.white}>同比还多了</Txt><Txt size={54} color={theme.colors.gold}>48 万</Txt></Beat>
      <Beat from={306} dur={70} top={700}><Txt size={40} color={theme.colors.dim}>第一份工资，平均</Txt></Beat>
      <Beat from={376} dur={76} top={680}><Txt size={88} color={theme.colors.gold}><Counter to={6199} dur={18} decimals={0} /></Txt><Txt size={44} color={theme.colors.dim}>元 / 月</Txt></Beat>
      <Beat from={462} dur={70} top={700}><Txt size={40} color={theme.colors.dim}>66.7 万 ÷ 6199 ≈ 107 个月</Txt></Beat>
      <Beat from={532} dur={96} top={686}><Txt size={44} color={theme.colors.white}>不吃不喝，还</Txt><Txt size={82} color={theme.colors.danger}>9 年</Txt></Beat>
      <Beat from={636} dur={76} top={700}><Txt size={40} color={theme.colors.dim}>同一个月，16—24 岁不在校的年轻人</Txt></Beat>
      <Beat from={716} dur={110} top={680}><Txt size={56} color={theme.colors.dim}>失业率</Txt><Txt size={92} color={theme.colors.danger}><Counter to={18.9} dur={16} decimals={1} /></Txt><Txt size={56} color={theme.colors.danger}>%</Txt></Beat>
      <Beat from={836} dur={70} top={700}><Txt size={44} color={theme.colors.white}>18 岁前，你的任务是</Txt><Txt size={54} color={theme.colors.gold}>把题做对</Txt></Beat>
      <Beat from={912} dur={70} top={700}><Txt size={50}>18 岁后，题没了</Txt></Beat>
      <Beat from={992} dur={70} top={700}><Txt size={42} color={theme.colors.dim}>只剩下：</Txt><Txt size={64} color={theme.colors.gold}>选题</Txt></Beat>
      <Beat from={1070} dur={90} top={700}><Txt size={44} color={theme.colors.dim}>而这一项，没有人教过</Txt></Beat>
    </Chrome>
  );
};

// ══════════════ S4 · 为什么是 18 岁（960 帧） ══════════════
const WHY = [
  { at: 10, word: "可评分", s1: "因为它是唯一能被统一评分的年纪", s2: "一张卷子，同一时间，同一标准" },
  { at: 250, word: "可验收", s1: "因为家庭的投资需要一个能签字的节点", s2: "18 岁，是那句「我尽力了」的收据" },
  { at: 490, word: "可分流", s1: "因为社会需要一个分流器", s2: "把人群分成「继续」和「进市场」两路" },
];

const Why: React.FC = () => {
  const f = useCurrentFrame();
  const cur = WHY.slice().reverse().find((x) => f >= x.at);
  const tail = f >= 730;
  return (
    <Chrome hue="warm">
      {!tail && cur && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <SpringIn delay={cur.at} y={26} scale={0.86} blur={16}>
            <div style={{ fontFamily: theme.fonts.serif, fontSize: 128, fontWeight: 700, color: theme.colors.gold, letterSpacing: "0.06em", textShadow: "0 0 60px rgba(201,169,110,0.35)" }}>{cur.word}</div>
          </SpringIn>
          <div style={{ height: 30 }} />
          <GoldRule delay={cur.at + 12} w={260} dur={20} thickness={2} glow={10} />
          <div style={{ height: 34 }} />
          <SpringIn delay={cur.at + 22} y={20} blur={10}>
            <div style={{ fontFamily: theme.fonts.serif, fontSize: 46, color: theme.colors.white }}>{cur.s1}</div>
          </SpringIn>
          <div style={{ height: 16 }} />
          <SpringIn delay={cur.at + 40} y={16} blur={8}>
            <div style={{ fontFamily: theme.fonts.sans, fontSize: 32, color: theme.colors.dim }}>{cur.s2}</div>
          </SpringIn>
        </AbsoluteFill>
      )}
      {tail && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <SpringIn delay={730} y={24} blur={12}>
            <div style={{ fontFamily: theme.fonts.serif, fontSize: 50, color: theme.colors.white }}>连「继续」这条路，也在变窄</div>
          </SpringIn>
          <div style={{ height: 40 }} />
          <SpringIn delay={770} y={20} blur={10}>
            <div>
              <span style={{ fontFamily: theme.fonts.serif, fontSize: 40, color: theme.colors.dim }}>2025 年考研 </span>
              <span style={{ fontFamily: theme.fonts.serif, fontSize: 82, fontWeight: 700, color: theme.colors.gold }}><Counter to={388} delay={0} dur={18} decimals={0} /> 万</span>
            </div>
          </SpringIn>
          <div style={{ height: 26 }} />
          <SpringIn delay={806} y={16} blur={8}>
            <div style={{ fontFamily: theme.fonts.sans, fontSize: 30, color: theme.colors.dim }}>比上年少 50 万，连续两年下降</div>
          </SpringIn>
        </AbsoluteFill>
      )}
    </Chrome>
  );
};

// ══════════════ S5 · 冷收（白热碎裂，630 帧） ══════════════
const Cold: React.FC = () => {
  const f = useCurrentFrame();
  const lead = f < 156;
  return (
    <AbsoluteFill>
      <Chrome hue="cold">
        {lead && (
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <SpringIn delay={6} y={22} blur={12}>
              <div style={{ fontFamily: theme.fonts.serif, fontSize: 58, color: theme.colors.white, textAlign: "center" }}>18 岁之所以像终点</div>
            </SpringIn>
            <div style={{ height: 26 }} />
            <SpringIn delay={44} y={18} blur={10}>
              <div style={{ fontFamily: theme.fonts.sans, fontSize: 37, color: theme.colors.dim, textAlign: "center" }}>是因为它是最后一个所有人都同意你</div>
            </SpringIn>
            <div style={{ height: 10 }} />
            <SpringIn delay={62} y={18} blur={10}>
              <div style={{ fontFamily: theme.fonts.sans, fontSize: 37, color: theme.colors.dim, textAlign: "center" }}>在同一起跑线上的时刻</div>
            </SpringIn>
            <div style={{ height: 44 }} />
            <SpringIn delay={100} y={20} blur={12}>
              <div style={{ fontFamily: theme.fonts.serif, fontSize: 60, color: theme.colors.gold, textAlign: "center" }}>终点不在 18 岁</div>
            </SpringIn>
            <div style={{ height: 16 }} />
            <SpringIn delay={120} y={16} blur={10}>
              <div style={{ fontFamily: theme.fonts.serif, fontSize: 46, color: theme.colors.white, textAlign: "center" }}>是你 18 岁那年，第一次没人告诉你该往哪跑</div>
            </SpringIn>
          </AbsoluteFill>
        )}
      </Chrome>
      {!lead && (
        <>
          <BgMesh hue="warm" />
          <Embers start={0} count={90} />
          <ShatterText text="人生没有验收日" size={158} />
          <Embers start={40} count={120} />
          <Grade />
          <Grain />
          <Vignette />
        </>
      )}
    </AbsoluteFill>
  );
};

// ══════════════ S6 · 数据来源（210 帧） ══════════════
const Src: React.FC = () => {
  const rows = [
    ["数据来源", theme.colors.white, 32],
    ["育娲人口研究《中国生育成本报告 2024 版》", theme.colors.white, 27],
    ["教育部 · 2026 高考报名 / 2026 届毕业生 / 2025 考研报名", theme.colors.white, 24],
    ["麦可思《2025 年中国本科生就业报告》", theme.colors.white, 24],
    ["国家统计局 · 2026 年 8 月城镇 16—24 岁调查失业率", theme.colors.white, 24],
    ["本片无配乐，音效为程序生成", theme.colors.dim, 22],
  ];
  return (
    <Chrome hue="warm">
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <SpringIn delay={4} y={10} blur={6}>
          <div style={{ fontFamily: theme.fonts.sans, fontSize: 18, letterSpacing: "0.5em", color: theme.colors.dim, paddingLeft: "0.5em", marginBottom: 26 }}>DATA SOURCES</div>
        </SpringIn>
        {rows.map((r, i) => (
          <SpringIn key={i} delay={12 + i * 8} y={14} blur={6}>
            <div style={{ fontFamily: i === 0 ? theme.fonts.serif : theme.fonts.sans, fontSize: r[2] as number, color: r[1] as string, marginBottom: 14, textAlign: "center" }}>{r[0]}</div>
          </SpringIn>
        ))}
      </AbsoluteFill>
    </Chrome>
  );
};

// ══════════════ 全片 ══════════════
export const Full: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: theme.colors.bg }}>
    <Sequence from={0} durationInFrames={210} name="片名"><TitleGold /></Sequence>
    <Sequence from={210} durationInFrames={1200} name="交付日"><DeliverFull /></Sequence>
    <Sequence from={1410} durationInFrames={1020} name="考场"><Exam /></Sequence>
    <Sequence from={2430} durationInFrames={1260} name="验收之后"><After /></Sequence>
    <Sequence from={3690} durationInFrames={960} name="为什么"><Why /></Sequence>
    <Sequence from={4650} durationInFrames={630} name="冷收"><Cold /></Sequence>
    <Sequence from={5280} durationInFrames={210} name="来源"><Src /></Sequence>
  </AbsoluteFill>
);
