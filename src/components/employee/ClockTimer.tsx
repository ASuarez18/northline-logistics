"use client";

import { useEffect, useState } from "react";

export default function ClockTimer({ clockIn, serverTime }: { clockIn: string; serverTime: string }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const started = performance.now();
    const timer = window.setInterval(() => setElapsed(performance.now() - started), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const seconds = Math.max(0, Math.floor((Date.parse(serverTime) - Date.parse(clockIn) + elapsed) / 1000));
  const text = [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60]
    .map((value) => String(value).padStart(2, "0")).join(":");
  return <p className="my-5 font-mono text-5xl font-semibold tracking-tight tabular-nums sm:text-6xl" aria-label={`Time on shift: ${text}`}>{text}</p>;
}
