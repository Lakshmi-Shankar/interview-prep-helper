"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner";
import { generateQuestionsAction } from "../../Functions/actions"
import { checkAnswerAction } from "../../Functions/actions"
import { saveSessionAction } from "../../Functions/actions"
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Loader2,
  XCircle,
  Trophy,
  RotateCcw,
  Home,
  PenLine,
  Circle,
} from "lucide-react"
import Groq from "groq-sdk"

type Question = {
  question: string
  answer: string
  explanation: string
}

type QA = {
  question: string
  answer: string
}

type Props = {
  field: string
  specialty: string
}

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
})

export default function TestPortalClient({ field, specialty }: Props) {
  const router = useRouter()

  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // const [questionSet, setQuestionSet] = useState<Result[]>([]);

  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [finished, setFinished] = useState(false)
  const [animating, setAnimating] = useState(false)
  const [slideDir, setSlideDir] = useState<"left" | "right">("right")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const specialtyLabel = specialty.charAt(0).toUpperCase() + specialty.slice(1)
  const fieldLabel = field.charAt(0).toUpperCase() + field.slice(1)

  useEffect(() => {
    generateQuestions()
  }, [field, specialty])

  useEffect(() => {
    if (!animating && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [current, animating])

  async function generateQuestions() {
    setLoading(true)
    setError(null)
    setQuestions([])
    setCurrent(0)
    setAnswers([])
    setFinished(false)

    try {
      const data = await generateQuestionsAction(field, specialty)
      // console.log(typeof(data));
      setQuestions(data)
      setAnswers(new Array(data.length).fill(""))
    } catch (err: unknown) {
      console.error((err as Error).message)
      setError("Failed to generate questions.")
    } finally {
      setLoading(false)
    }
  }

  function handleAnswerChange(value: string) {
    setAnswers((prev) => {
      const updated = [...prev]
      updated[current] = value
      return updated
    })
  }

  function navigate(dir: "next" | "back") {
    const next = dir === "next" ? current + 1 : current - 1
    if (next < 0 || next >= questions.length) return
    setSlideDir(dir === "next" ? "left" : "right")
    setAnimating(true)
    setTimeout(() => {
      setCurrent(next)
      setAnimating(false)
    }, 220)
  }

  function jumpTo(idx: number) {
    if (idx === current) return
    setSlideDir(idx > current ? "left" : "right")
    setAnimating(true)
    setTimeout(() => {
      setCurrent(idx)
      setAnimating(false)
      setSidebarOpen(false)
    }, 220)
  }

  async function handleSubmit() {
    toast.loading("Submitting your answers...")
    setFinished(true)
    const qaPairs = questions.map((q, i) => ({
      question: q.question,
      answer: answers[i],
      score: 0,
      feedback: "",
    }))
    // console.log(qaPairs)
    const evaluatedResults = await checkAnswerAction(qaPairs)
    console.log(evaluatedResults);
    await saveSessionAction(field, specialty, evaluatedResults)
    // console.log("Session saved")
    toast.dismiss()
    toast.success("Your answers have been submitted and evaluated!")
  }

  const answeredCount = answers.filter((a) => a.trim().length > 0).length

  /* ── Loading ── */
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f7f3f4] px-4">
        <div className="bg-white border border-[#e2d8da] rounded-2xl p-12 flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-[#544349] animate-spin" />
          <p className="mt-5 text-[#b09a9f] text-base">Generating your questions…</p>
        </div>
      </main>
    )
  }

  /* ── Error ── */
  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f7f3f4] px-4">
        <div className="bg-white border border-[#e2d8da] rounded-2xl p-12 flex flex-col items-center text-center max-w-sm w-full">
          <XCircle className="w-12 h-12 text-red-500 mb-5" />
          <h2 className="text-2xl font-semibold text-[#544349] mb-3">Something went wrong</h2>
          <p className="text-[#b09a9f] mb-8">{error}</p>
          <button
            onClick={generateQuestions}
            className="inline-flex items-center gap-2 bg-[#544349] hover:bg-[#3e3036] text-white font-medium px-6 py-3 rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </main>
    )
  }

  /* ── Finished ── */
  if (finished) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f7f3f4] px-4 py-8">
        <div className="bg-white border border-[#e2d8da] rounded-2xl p-12 flex flex-col items-center text-center max-w-lg w-full">
          <div className="w-20 h-20 rounded-full bg-[#f0eaeb] flex items-center justify-center mb-6">
            <Trophy className="w-9 h-9 text-[#544349]" />
          </div>
          <h2 className="text-3xl font-semibold text-[#544349] mb-3">Test Complete!</h2>
          <p className="text-[#b09a9f] mb-2">
            You&apos;ve completed all {questions.length} questions in {fieldLabel} – {specialtyLabel}
          </p>
          <p className="text-[#7d6168] font-medium mb-10">
            {answeredCount} of {questions.length} answered
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <button
              onClick={generateQuestions}
              className="inline-flex items-center justify-center gap-2 bg-[#f7f3f4] hover:bg-[#ede8e9] border border-[#e2d8da] text-[#544349] font-medium px-6 py-3 rounded-xl transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Test
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center justify-center gap-2 bg-[#544349] hover:bg-[#3e3036] text-white font-medium px-6 py-3 rounded-xl transition-colors"
            >
              <Home className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>
      </main>
    )
  }

  /* ── Quiz ── */
  const q = questions[current]
  const currentAnswer = answers[current] ?? ""
  const isLastQuestion = current + 1 >= questions.length
  const progress = Math.round(((current + 1) / questions.length) * 100)

  const slideClass = animating
    ? slideDir === "left"
      ? "opacity-0 -translate-x-3"
      : "opacity-0 translate-x-3"
    : "opacity-100 translate-x-0"

  /* Shared sidebar content — rendered both in drawer and desktop panel */
  const SidebarContent = () => (
    <>
      <p className="text-[11px] font-bold tracking-widest uppercase text-[#b09a9f] mb-4 pb-3 border-b border-[#f0eaeb]">
        Questions
      </p>

      {/* Q Grid */}
      <div className="grid grid-cols-5 gap-2 mb-5">
        {questions.map((_, idx) => {
          const isActive = idx === current
          const isAnswered = answers[idx]?.trim().length > 0
          return (
            <button
              key={idx}
              onClick={() => jumpTo(idx)}
              className={`aspect-square rounded-lg text-xs font-semibold border-2 transition-all
                ${isActive
                  ? "bg-[#544349] text-white border-[#544349]"
                  : isAnswered
                  ? "bg-[#f0eaeb] text-[#544349] border-[#c8b5ba]"
                  : "bg-white text-[#7d6168] border-[#e2d8da] hover:border-[#7d6168]"
                }`}
            >
              {idx + 1}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2 pb-5 border-b border-[#f0eaeb]">
        {[
          { color: "bg-[#544349]", label: "Current" },
          { color: "bg-[#f0eaeb] border-2 border-[#c8b5ba]", label: "Answered" },
          { color: "bg-white border-2 border-[#e2d8da]", label: "Unanswered" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2.5">
            <div className={`w-3 h-3 rounded flex-shrink-0 ${color}`} />
            <span className="text-xs text-[#b09a9f]">{label}</span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-4 flex flex-col gap-2">
        {[
          { label: "Subject", value: fieldLabel },
          { label: "Specialty", value: specialtyLabel },
          { label: "Total", value: `${questions.length} questions` },
          { label: "Answered", value: `${answeredCount} / ${questions.length}` },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-[#b09a9f]">{label}</span>
            <span className="text-[#544349] font-medium">{value}</span>
          </div>
        ))}
      </div>
    </>
  )

  return (
    <main className="min-h-screen bg-[#f7f3f4] flex flex-col">

      {/* ── Exam Banner ── */}
      <div className="bg-[#544349] text-white px-5 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="bg-white/15 text-white text-[11px] font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full">
            {fieldLabel}
          </span>
          <span className="text-white/40 hidden sm:block">|</span>
          <span className="text-white/80 text-sm hidden sm:block">{specialtyLabel}</span>
        </div>

        {/* Right side: desktop shows status, mobile shows q count + toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 text-white/70 text-sm">
            <Circle className="w-2.5 h-2.5 fill-[#e8b4bb] text-[#e8b4bb] animate-pulse" />
            <span>In progress</span>
          </div>
          <span className="text-white/60 text-sm lg:hidden">{current + 1} / {questions.length}</span>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden flex flex-col justify-center gap-[5px] w-8 h-8"
            aria-label="Toggle question navigator"
          >
            <span className="block w-5 h-0.5 bg-white/70 rounded-full" />
            <span className="block w-5 h-0.5 bg-white/70 rounded-full" />
            <span className="block w-5 h-0.5 bg-white/70 rounded-full" />
          </button>
        </div>
      </div>


      {/* ── Mobile Sidebar Drawer ── */}
      {sidebarOpen && (
        <div className="lg:hidden bg-white border-b border-[#e2d8da] px-5 pt-5 pb-6 shadow-sm">
          <SidebarContent />
        </div>
      )}

      {/* ── Page Layout ── */}
      <div className="flex flex-1 items-start w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-8 gap-6 lg:gap-8">

        {/* ── Desktop Sidebar ── */}
        <aside className="hidden lg:flex flex-col w-60 xl:w-64 flex-shrink-0 bg-white border border-[#e2d8da] rounded-2xl p-5 sticky top-6">
          <SidebarContent />
        </aside>

        {/* ── Main Content ── */}
        <div className="flex-1 flex flex-col gap-5 min-w-0">

          {/* Question Card */}
          <div className={`bg-white border border-[#e2d8da] rounded-2xl overflow-hidden transition-all duration-200 ${slideClass}`}>
            <div className="flex items-center justify-between px-5 sm:px-7 py-4 bg-[#faf7f8] border-b border-[#eee7e9]">
              <div className="flex items-center gap-3">
                <span className="bg-[#544349] text-white text-xs font-semibold tracking-wide px-4 py-1.5 rounded-full">
                  Q {current + 1}
                </span>
                <span className="text-xs tracking-widest uppercase text-[#b09a9f] hidden sm:block">
                  {fieldLabel}
                </span>
              </div>
              <span className="text-xs text-[#7d6168] bg-[#f0eaeb] px-3 py-1.5 rounded-full font-medium">
                5 marks
              </span>
            </div>
            <div className="px-5 sm:px-8 py-7 sm:py-10">
              <p className="text-xs italic text-[#b09a9f] mb-4">
                Answer in full sentences where appropriate.
              </p>
              <p className="text-xl sm:text-2xl text-[#544349] leading-relaxed font-medium">
                {q?.question}
              </p>
            </div>
          </div>

          {/* Answer Card */}
          <div className={`bg-white border border-[#e2d8da] rounded-2xl overflow-hidden transition-all duration-200 ${slideClass}`}>
            <div className="flex items-center gap-3 px-5 sm:px-7 py-4 bg-[#faf7f8] border-b border-[#eee7e9]">
              <PenLine className="w-4 h-4 text-[#7d6168]" />
              <span className="text-xs font-bold tracking-widest uppercase text-[#7d6168]">
                Your Answer
              </span>
              <span className="ml-auto text-xs text-[#b09a9f] hidden sm:block">
                Recommended: 150–300 words
              </span>
            </div>
            <div className="px-5 sm:px-8 pt-5 pb-6">
              <div
                className="relative rounded-lg"
                style={{
                  minHeight: "280px",
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, transparent 0px, transparent 39px, #f0eaeb 39px, #f0eaeb 40px)",
                }}
              >
                <textarea
                  ref={textareaRef}
                  value={currentAnswer}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder="Begin writing your answer here…"
                  className="absolute inset-0 w-full h-full bg-transparent border-none outline-none resize-none text-base text-[#544349] placeholder:text-[#c8b5ba] px-0 pt-2.5"
                  style={{ lineHeight: "40px" }}
                />
              </div>
              <p className="mt-3 text-xs text-[#b09a9f] text-right">
                {currentAnswer.length} characters
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-1 pb-6">
            <button
              onClick={() => navigate("back")}
              disabled={current === 0}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#e2d8da] bg-white text-[#7d6168] hover:bg-[#f7f3f4] hover:text-[#544349] disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <span className="text-sm text-[#b09a9f]">
              <span className="font-semibold text-[#544349]">{answeredCount}</span>
              {" of "}
              <span className="font-semibold text-[#544349]">{questions.length}</span>
              {" answered"}
            </span>

            {!isLastQuestion ? (
              <button
                onClick={() => navigate("next")}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#544349] hover:bg-[#3e3036] text-white text-sm font-medium transition-colors"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#3e3036] hover:bg-[#2e2328] text-white text-sm font-medium transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Submit Test</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </main>
  )
}