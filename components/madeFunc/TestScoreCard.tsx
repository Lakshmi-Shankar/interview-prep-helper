"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, RotateCcw, ArrowLeft, BookOpen, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface SessionCompleteProps {
  score: number
  totalQuestions: number
  specialtyLabel: string
  fieldLabel: string
  onRetry: () => void
  onBackToSetup: () => void
}

export function TestScoreCard({
  score,
  totalQuestions,
  specialtyLabel,
  fieldLabel,
  onRetry,
  onBackToSetup,
}: SessionCompleteProps) {
  const [mounted, setMounted] = useState(false)
  const [countUp, setCountUp] = useState(0)
  const pct = Math.round((score / totalQuestions) * 100)
  
  const isPerfect = pct === 100
  const isGreat = pct >= 80
  const isGood = pct >= 60

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
    
    const duration = 800
    const steps = 20
    const increment = score / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= score) {
        setCountUp(score)
        clearInterval(timer)
      } else {
        setCountUp(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [score])

  const getPerformanceLabel = () => {
    if (isPerfect) return "Excellent"
    if (isGreat) return "Great"
    if (isGood) return "Good"
    return "Needs Practice"
  }

  const getFeedback = () => {
    if (isPerfect) return "Perfect score! You have mastered this topic."
    if (isGreat) return "Strong performance. Review any missed questions to improve further."
    if (isGood) return "Solid effort. Focus on the areas you struggled with."
    return "Keep practicing. Review the material and try again."
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div
        className={cn(
          "bg-card border border-border rounded-2xl shadow-sm p-8 max-w-sm w-full",
          "transform transition-all duration-500 ease-out",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
      >
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div
              className={cn(
                "absolute inset-0 rounded-full bg-emerald-500/20",
                "transition-all duration-700 ease-out",
                mounted ? "scale-150 opacity-0" : "scale-100 opacity-100"
              )}
              style={{ width: 56, height: 56, top: 0, left: 0 }}
            />
            <div
              className={cn(
                "w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center",
                "transition-all duration-400 ease-out",
                mounted ? "scale-100" : "scale-90"
              )}
            >
              <CheckCircle2 
                className={cn(
                  "w-7 h-7 text-emerald-600 transition-all duration-500",
                  mounted ? "opacity-100" : "opacity-0"
                )} 
                strokeWidth={2} 
              />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold text-foreground mb-1">
            Session Complete
          </h1>
          <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="">{specialtyLabel}</span>
            <span className="text-muted-foreground/40">·</span>
            <span>{fieldLabel}</span>
          </div>
        </div>

        {/* Score Section */}
        <div className="bg-muted/50 rounded-xl p-5 mb-5">
          {/* Large Score */}
          <div className="text-center mb-4">
            <div className="text-5xl font-bold tabular-nums text-foreground mb-1">
              {countUp}<span className="text-2xl text-muted-foreground font-normal">/{totalQuestions}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              questions correct
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700 ease-out",
                  isPerfect || isGreat ? "bg-emerald-500" :
                  isGood ? "bg-blue-500" : "bg-amber-500"
                )}
                style={{ width: mounted ? `${pct}%` : "0%" }}
              />
            </div>
          </div>

          {/* Percentage and Performance */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <TrendingUp className={cn(
                "w-4 h-4",
                isPerfect || isGreat ? "text-emerald-600" :
                isGood ? "text-blue-600" : "text-amber-600"
              )} />
              <span className={cn(
                "text-sm font-medium",
                isPerfect || isGreat ? "text-emerald-600" :
                isGood ? "text-blue-600" : "text-amber-600"
              )}>
                {getPerformanceLabel()}
              </span>
            </div>
            <span className="text-lg font-semibold tabular-nums text-foreground">
              {pct}%
            </span>
          </div>
        </div>

        {/* Feedback */}
        <p className="text-sm text-muted-foreground text-center mb-6 leading-relaxed">
          {getFeedback()}
        </p>

        {/* Actions */}
        <div className="space-y-2.5">
          <button
            onClick={onRetry}
            className={cn(
              "group w-full py-2.5 px-4 rounded-xl text-sm font-medium",
              "flex items-center justify-center gap-2",
              "bg-foreground text-background",
              "hover:opacity-90 active:scale-[0.98]",
              "transition-all duration-200"
            )}
          >
            <RotateCcw className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-90" />
            Try New Questions
          </button>
          <button
            onClick={onBackToSetup}
            className={cn(
              "group w-full py-2.5 px-4 rounded-xl text-sm font-medium",
              "flex items-center justify-center gap-2",
              "border border-border",
              "hover:bg-muted active:scale-[0.98]",
              "transition-all duration-200"
            )}
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Back to Setup
          </button>
        </div>
      </div>
    </main>
  )
}
