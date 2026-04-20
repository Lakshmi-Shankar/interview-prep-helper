"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Check, ChevronLeft, Heart, Layers, Baby, Bone,
  FlaskConical, Brain, Code2, Server, Users, ArrowRight
} from "lucide-react"

type Specialty = {
  id: string
  icon: React.ElementType
  label: string
  desc: string
  iconBg: string
  iconColor: string
}

type Domain = "medical" | "software" | "datascience"

const specialties: Record<Domain, Specialty[]> = {
  medical: [
    { id: "cardiology",   icon: Heart,        label: "Cardiology",         desc: "Heart health, ECG analysis, cardiovascular conditions",    iconBg: "bg-red-50 dark:bg-red-950",    iconColor: "text-red-500 dark:text-red-400" },
    { id: "surgery",      icon: Layers,       label: "General Surgery",    desc: "Pre/post-op care, surgical principles, procedures",        iconBg: "bg-orange-50 dark:bg-orange-950", iconColor: "text-orange-500 dark:text-orange-400" },
    { id: "pediatrics",   icon: Baby,         label: "Pediatrics",         desc: "Child growth, common illnesses, vaccination",              iconBg: "bg-pink-50 dark:bg-pink-950",  iconColor: "text-pink-500 dark:text-pink-400" },
    { id: "orthopedics",  icon: Bone,         label: "Orthopedics",        desc: "Fractures, musculoskeletal disorders, joint care",         iconBg: "bg-amber-50 dark:bg-amber-950", iconColor: "text-amber-600 dark:text-amber-400" },
    { id: "pharmacology", icon: FlaskConical, label: "Pharmacology",       desc: "Drug classes, mechanisms, interactions",                   iconBg: "bg-teal-50 dark:bg-teal-950",  iconColor: "text-teal-600 dark:text-teal-400" },
  ],
  software: [
    { id: "dsa",          icon: Layers,       label: "DSA",               desc: "Arrays, trees, graphs, dynamic programming",              iconBg: "bg-blue-50 dark:bg-blue-950",   iconColor: "text-blue-600 dark:text-blue-400" },
    { id: "systemdesign", icon: Brain,        label: "System Design",      desc: "Architecture, scalability, trade-offs",                   iconBg: "bg-purple-50 dark:bg-purple-950", iconColor: "text-purple-600 dark:text-purple-400" },
    { id: "frontend",     icon: Code2,        label: "Frontend",           desc: "React, CSS, browser internals, UI optimization",          iconBg: "bg-cyan-50 dark:bg-cyan-950",   iconColor: "text-cyan-600 dark:text-cyan-400" },
    { id: "backend",      icon: Server,       label: "Backend",            desc: "APIs, databases, concurrency, server-side logic",         iconBg: "bg-indigo-50 dark:bg-indigo-950", iconColor: "text-indigo-600 dark:text-indigo-400" },
    { id: "behavioral",   icon: Users,        label: "Behavioral",         desc: "Communication, leadership, STAR interview method",        iconBg: "bg-green-50 dark:bg-green-950", iconColor: "text-green-600 dark:text-green-400" },
  ],
  datascience: [
    { id: "ml",           icon: Brain,        label: "Machine Learning",   desc: "Supervised/unsupervised learning, model evaluation",      iconBg: "bg-violet-50 dark:bg-violet-950", iconColor: "text-violet-600 dark:text-violet-400" },
    { id: "stats",        icon: Layers,       label: "Statistics",         desc: "Probability, hypothesis testing, data analysis",          iconBg: "bg-blue-50 dark:bg-blue-950",   iconColor: "text-blue-600 dark:text-blue-400" },
    { id: "sql",          icon: Server,       label: "SQL & Data Wrangling", desc: "Joins, aggregations, window functions",               iconBg: "bg-amber-50 dark:bg-amber-950", iconColor: "text-amber-600 dark:text-amber-400" },
    { id: "dl",           icon: Code2,        label: "Deep Learning",      desc: "Neural networks, CNNs, transformers",                     iconBg: "bg-pink-50 dark:bg-pink-950",   iconColor: "text-pink-600 dark:text-pink-400" },
    { id: "casestudy",    icon: Users,        label: "Product & Case",     desc: "Metrics analysis, A/B testing, business impact",         iconBg: "bg-teal-50 dark:bg-teal-950",   iconColor: "text-teal-600 dark:text-teal-400" },
  ],
}

const fieldMeta: Record<Domain, { label: string; iconBg: string; iconColor: string }> = {
  medical:     { label: "Medical",              iconBg: "bg-green-50 dark:bg-green-950",  iconColor: "text-green-600 dark:text-green-400" },
  software:    { label: "Software Engineering", iconBg: "bg-blue-50 dark:bg-blue-950",    iconColor: "text-blue-600 dark:text-blue-400" },
  datascience: { label: "Data Science & AI",    iconBg: "bg-purple-50 dark:bg-purple-950", iconColor: "text-purple-600 dark:text-purple-400" },
}

const validFields: Domain[] = Object.keys(specialties) as Domain[]

type Props = { field: string }

export default function FieldClient({ field }: Props) {
  const router = useRouter()
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null)

  const domain = field as Domain
  const options = specialties[domain]
  const meta = fieldMeta[domain]

  const handleStart = () => {
    if (!selectedSpecialty) return
    router.push(`/practicesession/setup/${field}/${selectedSpecialty}`)
    
    sessionStorage.setItem("selectedSpecialty", selectedSpecialty);
    sessionStorage.setItem("selectedField", field);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">

        {/* Progress bar — outside card */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => router.back()}
            className="p-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-card transition-colors flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-foreground rounded-full transition-all duration-500"
              style={{ width: selectedSpecialty ? "100%" : "66%" }}
            />
          </div>

          <span className="text-xs text-muted-foreground tabular-nums flex-shrink-0">
            Step {selectedSpecialty ? 3 : 2} of 3
          </span>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">

          {/* Card top — field context + heading */}
          <div className="px-6 pt-6 pb-5 border-b border-border">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-3 ${meta.iconBg} ${meta.iconColor}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
              {meta.label}
            </div>
            <h2 className="text-xl font-semibold text-foreground">Pick a specialty</h2>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Choose the topic you want to focus on for this session.
            </p>
          </div>

          {/* Specialty options */}
          <div className="p-3 space-y-1.5">
            {options.map((option) => {
              const Icon = option.icon
              const isSelected = selectedSpecialty === option.id

              return (
                <button
                  key={option.id}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedSpecialty(option.id)}
                  className={`
                    w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl border text-left
                    transition-all duration-150 group
                    ${isSelected
                      ? "border-foreground bg-background shadow-sm"
                      : "border-transparent hover:border-border hover:bg-background"
                    }
                  `}
                >
                  {/* Colored icon */}
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${option.iconBg}`}>
                    <Icon className={`w-4 h-4 ${option.iconColor}`} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground leading-tight">{option.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{option.desc}</p>
                  </div>

                  {/* Check */}
                  {isSelected ? (
                    <span className="w-5 h-5 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-background" />
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full border border-border flex-shrink-0 group-hover:border-foreground/30 transition-colors" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div className="px-4 pb-4 pt-1">
            <button
              disabled={!selectedSpecialty}
              onClick={handleStart}
              className={`
                w-full py-3 rounded-xl text-sm font-medium transition-all duration-200
                flex items-center justify-center gap-2
                ${selectedSpecialty
                  ? "bg-foreground text-background hover:opacity-85 active:scale-[0.98]"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
                }
              `}
            >
              Start session
              {selectedSpecialty && <ArrowRight className="w-4 h-4" />}
            </button>

            <p className="text-center text-xs text-muted-foreground mt-2.5 h-4">
              {!selectedSpecialty && "Select a specialty to continue"}
            </p>
          </div>

        </div>
      </div>
    </main>
  )
}