import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Title } from "./Title";
import { Deliver } from "./Deliver";

// 20 秒动效样片：片名 5.5s + 交付日 14.5s
export const Sample: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={165} name="片名">
      <Title />
    </Sequence>
    <Sequence from={165} durationInFrames={435} name="交付日">
      <Deliver />
    </Sequence>
  </AbsoluteFill>
);
