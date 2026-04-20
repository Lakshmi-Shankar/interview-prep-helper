"use client";

import { useState } from "react";
import { PartyPopper, ThumbsUp, Flame, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

type IconKey = "PartyPopper" | "ThumbsUp" | "Flame";

const ICON_MAP = {
  PartyPopper,
  ThumbsUp,
  Flame,
} satisfies Record<IconKey, React.ComponentType<{ className?: string }>>;

type QAItem = {
  question: string;
  answer: string;
  score: number;
  feedback: string;
};

type Props = {
  qa: QAItem[];
  totalQuestions: number;
  correctAnswers: number;
  pct: number;
  encouragement: { icon: IconKey; text: string };
  formattedDate: string;
  sessionId: string;
};

export function QAPager({
  qa,
  totalQuestions,
  correctAnswers,
  pct,
  encouragement,
  formattedDate,
  sessionId,
}: Props) {
  const [current, setCurrent] = useState(0);
  const total = qa.length;
  const showSummary = current === total;

  const EncIcon = ICON_MAP[encouragement.icon];

  function syncNav(idx: number) {
    const prog = document.getElementById("nav-prog");
    const fill = document.getElementById("prog-fill") as HTMLElement | null;
    if (prog) {
      prog.textContent = idx === total ? "Results" : `${idx + 1} / ${total}`;
    }
    if (fill) {
      fill.style.width =
        idx === total ? "100%" : `${Math.round(((idx + 1) / total) * 100)}%`;
    }
  }

  function goTo(idx: number) {
    if (idx < 0 || idx > total) return;
    setCurrent(idx);
    syncNav(idx);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const item = qa[current];

  return (
    <>
      {/* ── Results summary ── */}
      {showSummary && (
        <div className="bg-[#fff9f7] border border-[#e8d8d2] rounded-xl overflow-hidden mb-3.5">
          <div className="bg-[#f5ede8] border-b border-[#e8d8d2] px-4 py-2.5 flex items-center gap-2">
            <div className="w-[18px] h-[18px] bg-[#8b4a52] rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-2.5 h-2.5 stroke-white fill-none" viewBox="0 0 24 24" strokeWidth={2.5}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="text-[13px] font-medium text-[#544349]">Session results</span>
            <span className="ml-auto text-[12px] text-[#a88a8f]">{formattedDate}</span>
          </div>

          <div className="p-5">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Ring */}
              <div className="relative flex-shrink-0">
                <svg viewBox="0 0 100 100" width={100} height={100} className="-rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e8d8d2" strokeWidth="9" />
                  <circle
                    cx="50" cy="50" r="40"
                    fill="none"
                    stroke="#c97a2f"
                    strokeWidth="9"
                    strokeDasharray={`${Math.round((pct / 100) * 251)} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[18px] font-medium text-[#544349]">{pct}%</span>
                </div>
              </div>

              {/* Stat boxes */}
              <div className="grid grid-cols-3 gap-2.5 flex-1 w-full">
                {[
                  { label: "Correct", value: correctAnswers, color: "#4a7c59" },
                  { label: "Missed", value: totalQuestions - correctAnswers, color: "#9b3a3a" },
                  { label: "Total", value: totalQuestions, color: "#544349" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-[#f5ede8] rounded-lg p-2.5 text-center">
                    <div className="text-[22px] font-medium leading-tight" style={{ color }}>
                      {value}
                    </div>
                    <div className="text-[11px] text-[#a88a8f] uppercase tracking-wider mt-0.5">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Encouragement */}
            <div className="mt-4 bg-[#fef3e6] border border-[#f0c88a] rounded-lg px-3.5 py-2.5 flex items-center gap-2">
              <EncIcon className="w-4 h-4 text-[#c97a2f] flex-shrink-0" />
              <span className="text-[13px] font-medium text-[#c97a2f]">{encouragement.text}</span>
            </div>

            {/* Restart */}
            <button
              onClick={() => goTo(0)}
              className="mt-3 w-full flex items-center justify-center gap-2 bg-[#8b4a52] hover:opacity-90 text-white rounded-lg py-2.5 text-[13px] font-medium transition-opacity"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Review from the beginning
            </button>

            <p className="mt-4 text-center text-[11px] text-[#c8b0b4] font-mono">
              Session · {sessionId.slice(0, 8)}…
            </p>
          </div>
        </div>
      )}

      {/* ── Three-panel layout ── */}
      {!showSummary && item && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
          {/* Question */}
          <Panel
            dotColor="#8b4a52"
            label="Question"
            badge={
              <span className="bg-[#8b4a52] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                Q{current + 1}
              </span>
            }
          >
            <p className="text-[17px] font-medium text-[#544349] leading-relaxed">
              {item.question}
            </p>
          </Panel>

          {/* Answer */}
          <Panel
            dotColor={item.score>2 ? "#4a7c59" : "#9b3a3a"}
            label="Your answer"
            badge={
              <span
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                  item.score>2
                    ? "bg-[#eef6f0] text-[#4a7c59] border-[#c0dcc8]"
                    : "bg-[#fdf0f0] text-[#9b3a3a] border-[#f0c0c0]"
                }`}
              >
                {item.score>2 ? "✓ Correct" : "✗ Incorrect"}
              </span>
            }
          >
            <div
              className={`border-l-[3px] rounded-r-md flex items-start p-3 h-full ${
                item.score>2
                  ? "border-[#4a7c59] bg-[#eef6f0]"
                  : "border-[#9b3a3a] bg-[#fdf0f0]"
              }`}
            >
              <p
                className={`text-[17px] font-medium leading-relaxed ${
                  item.score>2 ? "text-[#2d5e3c]" : "text-[#7a2a2a]"
                }`}
              >
                {item.answer}
              </p>
            </div>
          </Panel>

          {/* Feedback — full width */}
          <Panel className="sm:col-span-2" dotColor="#c97a2f" label="Feedback">
            <p className="text-[14px] text-[#7a5c63] leading-[1.75]">{item.feedback}</p>
          </Panel>
        </div>
      )}

      {/* ── Prev / Next ── */}
      {!showSummary && (
        <div className="flex gap-2.5 mb-3.5">
          <button
            onClick={() => goTo(current - 1)}
            disabled={current === 0}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[13px] font-medium border border-[#e8d8d2] bg-[#fff9f7] text-[#7a5c63] hover:bg-[#f5ede8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <button
            onClick={() => goTo(current + 1)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[13px] font-medium bg-[#8b4a52] hover:opacity-90 text-white transition-opacity"
          >
            {current === total - 1 ? "See results" : "Next"}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Dot pager ── */}
      <div className="flex justify-center gap-1.5 flex-wrap">
        {qa.map((q, i) => (
          <button
            key={i}
            aria-label={`Question ${i + 1}`}
            onClick={() => goTo(i)}
            className={`w-2.5 h-2.5 rounded-full border-none p-0 cursor-pointer transition-all duration-200 ${
              i === current
                ? "bg-[#c97a2f] scale-[1.35]"
                : i < current
                ? q.score > 2
                  ? "bg-[#4a7c59]"
                  : "bg-[#9b3a3a]"
                : "bg-[#ede0d9]"
            }`}
          />
        ))}
      </div>
    </>
  );
}

/* ── Reusable panel shell ── */
function Panel({
  children,
  dotColor,
  label,
  badge,
  className = "",
}: {
  children: React.ReactNode;
  dotColor: string;
  label: string;
  badge?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-[#fff9f7] border border-[#e8d8d2] rounded-xl overflow-hidden flex flex-col ${className}`}>
      <div className="bg-[#f5ede8] border-b border-[#e8d8d2] px-4 py-2.5 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dotColor }} />
        <span className="text-[12px] font-semibold uppercase tracking-[.06em] text-[#a88a8f]">
          {label}
        </span>
        {badge && <span className="ml-auto">{badge}</span>}
      </div>
      <div className="p-5 flex-1">{children}</div>
    </div>
  );
}