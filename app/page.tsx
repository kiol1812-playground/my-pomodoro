"use client";

import { useState, useEffect } from "react";

type Mode = "work" | "shortBreak" | "longBreak";

const TIMES: Record<Mode, number> = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export default function Home() {
  const [mode, setMode] = useState<Mode>("work");
  const [timeLeft, setTimeLeft] = useState<number>(TIMES.work);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setIsActive(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setTimeLeft(TIMES[newMode]);
    setIsActive(false);
  };

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#171818]">
      <div className="rounded-3xl shadow-2xl p-12 max-w-lg w-full text-center bg-[#192529]">
        <h1 className="text-4xl font-bold mb-8 text-[#92c175]">Focus</h1>

        <div className="flex justify-center gap-4 mb-10">
          {(Object.keys(TIMES) as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`px-6 py-3 rounded-xl text-lg font-bold transition-colors ${
                mode === m
                  ? "bg-[#a6ae9d] text-gray-800"
                  : "bg-[#c8d0bf] text-gray-700 hover:bg-[#b0b8a7]"
              }`}
            >
              {m === "work" ? "專注" : m === "shortBreak" ? "短休息" : "長休息"}
            </button>
          ))}
        </div>

        <div className="text-9xl font-mono font-bold mb-10 text-[#80d58b]">
          {formatTime(timeLeft)}
        </div>

        <div className="flex justify-center gap-6">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`px-10 py-4 rounded-2xl font-bold text-xl transition-transform active:scale-95 ${
              isActive
                ? "bg-[#db797c] text-white hover:opacity-90"
                : "bg-[#c8d0bf] text-gray-800 hover:bg-[#b0b8a7]"
            }`}
          >
            {isActive ? "暫停" : "開始"}
          </button>
          <button
            onClick={() => {
              setIsActive(false);
              setTimeLeft(TIMES[mode]);
            }}
            className="px-10 py-4 rounded-2xl font-bold text-xl bg-[#c8d0bf] text-gray-800 hover:bg-[#b0b8a7] transition-transform active:scale-95"
          >
            重置
          </button>
        </div>
      </div>
    </div>
  );
}
