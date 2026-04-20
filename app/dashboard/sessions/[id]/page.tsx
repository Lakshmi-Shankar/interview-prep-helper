import { fetchQAData } from "@/app/dashboard/action";
import { QAPager } from "./qa-pager";

export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await fetchQAData(id);
  const session = Array.isArray(data) ? data[0] : data;
  console.log("Fetched session data:", session);

  const {
    domain,
    field,
    total_questions,
    correct_answers,
    created_at,
    qa,
  } = session;

  const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const pct = Math.round((correct_answers / total_questions) * 100);

  // Pass a plain string key — the client component maps it to the Lucide icon
  const encouragement =
    pct === 100
      ? { icon: "PartyPopper" as const, text: "Perfect score — you absolutely nailed it!" }
      : pct >= 60
      ? { icon: "ThumbsUp" as const, text: "Solid effort! You're building real momentum." }
      : { icon: "Flame" as const, text: "Every attempt builds knowledge. Keep going!" };

  return (
    <main className="bg-[#fdf8f5] font-sans">

      {/* Sticky Nav */}
      <nav className="sticky top-0 z-10 bg-[#fff9f7] border-b border-[#e8d8d2] px-4">
        <div className="max-w-[1100px] mx-auto h-12 flex items-center gap-2.5">
          <a
            href="/dashboard"
            className="flex items-center gap-1.5 text-[#7a5c63] text-[13px] font-medium px-2.5 py-1.5 rounded-full hover:bg-[#f5ede8] transition-colors"
          >
            <svg
              className="w-4 h-4 fill-none stroke-[#7a5c63]"
              viewBox="0 0 24 24"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </a>

          <div className="w-px h-5 bg-[#e8d8d2]" />

          <span className="bg-[#8b4a52] text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap capitalize">
            {field}
          </span>

          <span className="hidden sm:block text-[13px] text-[#7a5c63] font-medium flex-1 truncate capitalize">
            {domain} · Session Review
          </span>

          {/* Synced client-side by QAPager */}
          <span
            id="nav-prog"
            className="ml-auto text-[12px] font-semibold text-[#c97a2f] bg-[#fef3e6] border border-[#f0c88a] px-2.5 py-0.5 rounded-full whitespace-nowrap"
          >
            1 / {total_questions}
          </span>
        </div>
      </nav>

      <div className="max-w-[1100px] mx-auto px-4 sm:px-5 py-5 pb-10">

        {/* Progress bar — synced client-side by QAPager */}
        <div className="h-1 bg-[#ede0d9] rounded-full mb-5 overflow-hidden">
          <div
            id="prog-fill"
            className="h-full bg-[#c97a2f] rounded-full transition-all duration-300"
            style={{ width: `${Math.round((1 / total_questions) * 100)}%` }}
          />
        </div>

        <QAPager
          qa={qa}
          totalQuestions={total_questions}
          correctAnswers={correct_answers}
          pct={pct}
          encouragement={encouragement}
          formattedDate={formattedDate}
          sessionId={id}
        />

      </div>
    </main>
  );
}