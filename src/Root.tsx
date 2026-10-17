import React from "react";
import { Composition } from "remotion";
import { Sample } from "./scenes/Sample";
import { Shatter } from "./scenes/Shatter";
import { GoldDust } from "./scenes/GoldDust";
import { Full } from "./scenes/Full";

export const RemotionRoot: React.FC = () => (
  <>
    {/* 全片：3 分 03 秒 / 1080p / 30fps */}
    <Composition id="Film" component={Full} durationInFrames={5490} fps={30} width={1920} height={1080} />
    <Composition id="Sample20s" component={Sample} durationInFrames={600} fps={30} width={1920} height={1080} />
    <Composition id="ShatterTest" component={Shatter} durationInFrames={150} fps={30} width={1920} height={1080} />
    <Composition id="GoldDustTest" component={GoldDust} durationInFrames={150} fps={30} width={1920} height={1080} />
  </>
);
