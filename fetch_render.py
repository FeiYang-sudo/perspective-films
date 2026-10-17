#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""等 GitHub Actions 渲完全片 → 自动下载 → 校验。渲染在云端，本机只负责取回。"""
import io, json, os, subprocess, time, urllib.request, urllib.error

TOK = [l.split("=", 1)[1].strip() for l in io.open("/root/.hermes/.env", encoding="utf-8")
       if l.startswith("GITHUB_TOKEN=")][0]
REPO = "FeiYang-sudo/perspective-films"
OUT = "/root/perspective/shiba-remotion/out/film_1080p.mp4"


def gh(path):
    req = urllib.request.Request("https://api.github.com" + path)
    req.add_header("Authorization", "token " + TOK)
    req.add_header("User-Agent", "hermes")
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read() or b"{}")


def main():
    # 1) 等全片那次 run（#2）结束
    deadline = time.time() + 3600
    run = None
    while time.time() < deadline:
        runs = gh(f"/repos/{REPO}/actions/runs?per_page=10").get("workflow_runs", [])
        run = runs[0] if runs else None
        if run and run["status"] == "completed":
            break
        print(f"  …渲染中 {run['status'] if run else '等待启动'}", flush=True)
        time.sleep(45)

    if not run:
        print("没找到 run #2")
        return
    print("run #2 结束:", run["conclusion"], flush=True)
    if run["conclusion"] != "success":
        print("失败日志:", run["html_url"])
        return

    # 2) 找最新 release 里的 video.mp4
    rels = gh(f"/repos/{REPO}/releases?per_page=5")
    target = None
    for rel in rels:
        for a in rel.get("assets", []):
            if a["name"].endswith(".mp4"):
                target = (rel["tag_name"], a)
                break
        if target:
            break
    if not target:
        print("release 里没有 mp4")
        return
    tag, asset = target
    print(f"  取回 {tag} / {asset['name']}  {asset['size']/1048576:.1f} MB", flush=True)

    # 3) 走代理下载（本机 github.com:443 被墙）
    url = f"https://gh-proxy.com/https://github.com/{REPO}/releases/download/{tag}/{asset['name']}"
    r = subprocess.run(["curl", "-L", "--fail", "--max-time", "900", "-o", OUT, url],
                       capture_output=True, text=True)
    if r.returncode != 0:
        print("下载失败:", r.stderr[-300:])
        return
    size = os.path.getsize(OUT)
    print(f"  已保存 {OUT}  {size/1048576:.1f} MB", flush=True)

    # 4) 校验
    p = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration,size",
                        "-show_entries", "stream=width,height,r_frame_rate", "-of", "default=nw=1", OUT],
                       capture_output=True, text=True)
    print(p.stdout.strip())
    print("DONE")


main()
