"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, Code2, Brain, Stethoscope, Lock, ChevronLeft } from "lucide-react"

const fields = [
  {
    id: "software",
    icon: Code2,
    label: "Software Engineering",
    desc: "DSA, system design, coding rounds",
    locked: false,
    iconBg: "bg-blue-50 dark:bg-blue-950",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "datascience",
    icon: Brain,
    label: "Data Science & AI",
    desc: "Machine learning concepts, statistics, case studies",
    locked: false,
    iconBg: "bg-purple-50 dark:bg-purple-950",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    id: "medical",
    icon: Stethoscope,
    label: "Medical",
    desc: "Clinical scenarios, medical ethics, residency prep",
    locked: false,
    iconBg: "bg-green-50 dark:bg-green-950",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    id: "more",
    icon: Lock,
    label: "More fields",
    desc: "Finance, law, product management, and more",
    locked: true,
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
  },
]

export default function OptionsCompo() {
  const router = useRouter()
  const [selectedField, setSelectedField] = useState<string | null>(null)

  const handleContinue = () => {
    if (!selectedField) return
    router.push(`/practicesession/setup/${selectedField}`)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-5">
            <Link
              href="/dashboard"
              className="p-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>

            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-foreground rounded-full transition-all duration-500"
                style={{ width: selectedField ? "66%" : "33%" }}
              />
            </div>

            <span className="text-xs text-muted-foreground tabular-nums flex-shrink-0">
              Step {selectedField ? 2 : 1} of 3
            </span>
          </div>

          <h2 className="text-xl font-semibold text-foreground">What&apos;s your field?</h2>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            Pick the area you&apos;re interviewing for. We&apos;ll tailor questions and feedback to match.
          </p>
        </div>

        {/* Options */}
        <div className="px-6 space-y-2.5">
          {fields.map((field) => {
            const Icon = field.icon
            const isSelected = selectedField === field.id

            return (
              <button
                key={field.id}
                onClick={() => !field.locked && setSelectedField(field.id)}
                disabled={field.locked}
                className={`
                  w-full flex items-center gap-4 p-4 rounded-xl border text-left
                  transition-all duration-200
                  ${field.locked
                    ? "opacity-45 cursor-not-allowed border-border bg-muted/30"
                    : isSelected
                    ? "border-foreground bg-background shadow-sm"
                    : "border-border bg-background hover:border-foreground/40 hover:bg-muted/30"
                  }
                `}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${field.iconBg}`}>
                  <Icon className={`w-5 h-5 ${field.locked ? "text-muted-foreground" : field.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${field.locked ? "text-muted-foreground" : "text-foreground"}`}>
                    {field.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{field.desc}</p>
                </div>
                {field.locked ? (
                  <span className="text-xs text-muted-foreground border border-border rounded-full px-2.5 py-1 flex-shrink-0">
                    Coming soon
                  </span>
                ) : isSelected ? (
                  <span className="w-5 h-5 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-background" />
                  </span>
                ) : (
                  <span className="w-5 h-5 rounded-full border border-border flex-shrink-0" />
                )}
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-6 pt-4 pb-6 mt-2">
          <button
            disabled={!selectedField}
            onClick={handleContinue}
            className={`
              w-full py-3 rounded-xl text-sm font-medium transition-all duration-200
              ${selectedField
                ? "bg-foreground text-background hover:opacity-85 active:scale-[0.98]"
                : "bg-muted text-muted-foreground cursor-not-allowed"
              }
            `}
          >
            Continue
          </button>
          <p className="text-center text-xs text-muted-foreground mt-3 h-4">
            {!selectedField && "Select a field above to continue"}
          </p>
        </div>

      </div>
    </main>
  )
}