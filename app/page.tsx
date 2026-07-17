"use client";

import { useState, useEffect, useRef } from "react";

type Mode = "work" | "shortBreak" | "longBreak";

const DEFAULT_TIMES: Record<Mode, number> = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const REFLECTION_QUESTIONS = [
  "我現在在做這件事，是在逃避什麼嗎？",
  "如果有人把我過去兩小時的生活拍成影片，他會覺得我想要什麼樣的人生？",
  "我正在朝我討厭的人生走，還是朝我想要的人生走？",
  "什麼事情是最重要的，我卻假裝不重要？",
  "我今天有哪些行為是為了保護身份認同，而不是真正渴望？",
  "我今天什麼時候感到最有活力？什麼時候感到最死氣沉沉？",
];

export default function Home() {
  const [mode, setMode] = useState<Mode>("work");
  const [times, setTimes] = useState<Record<Mode, number>>(DEFAULT_TIMES);
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_TIMES.work);
  const [isActive, setIsActive] = useState<boolean>(false);

  const [isQuestionEnabled, setIsQuestionEnabled] = useState<boolean>(true);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

  const modeRef = useRef(mode);
  const isQuestionEnabledRef = useRef(isQuestionEnabled);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    isQuestionEnabledRef.current = isQuestionEnabled;
  }, [isQuestionEnabled]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setIsActive(false);

            if (modeRef.current === "work" && isQuestionEnabledRef.current) {
              const randomQ =
                REFLECTION_QUESTIONS[
                  Math.floor(Math.random() * REFLECTION_QUESTIONS.length)
                ];
              setActiveQuestion(randomQ);
            }

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
    setTimeLeft(times[newMode]);
    setIsActive(false);
  };

  const adjustTime = (minutes: number) => {
    if (isActive) return;

    setTimes((prevTimes) => {
      const newSeconds = Math.max(60, prevTimes[mode] + minutes * 60);
      setTimeLeft(newSeconds);
      return {
        ...prevTimes,
        [mode]: newSeconds,
      };
    });
  };

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");

    if (h > 0) {
      return `${h.toString().padStart(2, "0")}:${m}:${s}`;
    }
    return `${m}:${s}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative bg-[#171818]">
      <div className="rounded-3xl shadow-2xl p-12 max-w-lg w-full text-center bg-[#192529]">
        <h1 className="text-4xl font-bold mb-8 text-[#92c175]">Focus</h1>

        {/* 模式切換按鈕 */}
        <div className="flex justify-center gap-4 mb-10">
          {(Object.keys(times) as Mode[]).map((m) => (
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

        {/* 時間顯示區塊 */}
        <div className="mb-10">
          <div className="text-7xl sm:text-8xl font-mono font-bold text-[#80d58b] tracking-tight">
            {formatTime(timeLeft)}
          </div>

          {/* 時間調整按鈕列 */}
          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => adjustTime(-5)}
              disabled={isActive}
              className="px-4 py-2 rounded-xl font-bold text-gray-700 bg-[#c8d0bf] hover:bg-[#b0b8a7] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              - 5分
            </button>
            <button
              onClick={() => adjustTime(-1)}
              disabled={isActive}
              className="px-4 py-2 rounded-xl font-bold text-gray-700 bg-[#c8d0bf] hover:bg-[#b0b8a7] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              - 1分
            </button>
            <button
              onClick={() => adjustTime(1)}
              disabled={isActive}
              className="px-4 py-2 rounded-xl font-bold text-gray-700 bg-[#c8d0bf] hover:bg-[#b0b8a7] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              + 1分
            </button>
            <button
              onClick={() => adjustTime(5)}
              disabled={isActive}
              className="px-4 py-2 rounded-xl font-bold text-gray-700 bg-[#c8d0bf] hover:bg-[#b0b8a7] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              + 5分
            </button>
          </div>
        </div>

        {/* 控制按鈕 */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex justify-center gap-6 w-full">
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
                setTimeLeft(times[mode]);
              }}
              className="px-10 py-4 rounded-2xl font-bold text-xl bg-[#c8d0bf] text-gray-800 hover:bg-[#b0b8a7] transition-transform active:scale-95"
            >
              重置
            </button>
          </div>

          {/* 是否開啟問題的選項區塊 */}
          <label className="flex items-center gap-2 mt-4 cursor-pointer text-gray-600 font-medium select-none group">
            <input
              type="checkbox"
              checked={isQuestionEnabled}
              onChange={(e) => setIsQuestionEnabled(e.target.checked)}
              className="w-5 h-5 accent-[#92c175] cursor-pointer"
            />
            <span className="group-hover:text-gray-800 transition-colors">
              專注結束後，隨機問我一個反思問題
            </span>
          </label>
        </div>
      </div>

      {/* 問題彈出視窗 (Modal) */}
      {activeQuestion && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl animate-fade-in-up">
            <h2 className="text-2xl font-bold mb-6 text-[#92c175]">
              時間到！來點靈魂拷問
            </h2>
            <p className="text-xl text-gray-700 font-medium mb-10 leading-relaxed">
              {activeQuestion}
            </p>
            <button
              onClick={() => setActiveQuestion(null)}
              className="px-8 py-3 rounded-xl font-bold text-lg bg-[#c8d0bf] text-gray-800 hover:bg-[#b0b8a7] transition-transform active:scale-95 w-full"
            >
              好的，我會想想
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
