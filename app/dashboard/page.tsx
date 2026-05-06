"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Video,  
  FileText, 
  ClipboardCheck, 
  Plus, 
  ThumbsUp,
  Calendar,
  ChevronRight,
  BarChart3,
  Hash,
  Award,
  Gauge,
  ThumbsDown,
  Play
} from "lucide-react"
import { getUserDashboardData } from "./action"
import { supabase } from "@/lib/supabase/client"
import LoadingDashboard from "@/components/madeFunc/loading"
import ErrorScreen from "@/components/madeFunc/ErrorScreen"
import { saveUserNotes } from "@/app/dashboard/saveNotes";
import NotesCard from "@/components/madeFunc/notesCard"
import ProgressCard from "@/components/madeFunc/ProgressCard"
import { Navbar } from "@/components/madeFunc/navbar"

// Types
interface UserData {
  id: string
  name: string
  mail: string
  videoUrls: string[]
  attemptsCount: number
  rating: number | null
  selfNotes: string | null
  avatar_url?: string | null
  createdAt?: string
  currentStreak: number
  longestStreak: number
  lastActivityDate: string | null
}



const quickActions = [
  { icon: Play, label: "New Practice Session", href: "/practicesession/setup", color: "bg-primary" },
  { icon: Video, label: "Review Videos", href: "/videos", color: "bg-accent" },
  { icon: FileText, label: "My Notes", href: "/notes", color: "bg-secondary" },
]

export default function DashboardPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [sessions, setSessions] = useState<any[]>([]) // have to use unknown here because of the way data is fetched and structured, but ideally should define a Session type
  const [weeklySessionsCount, setWeeklySessionsCount] = useState(0)
  const [totalSessions, setTotalSessions] = useState(0)
  const [avgScore, setAvgScore] = useState(0);
  const [accuracyRate, setAccuracyRate] = useState(0);
  const [categoryProgress, setCategoryProgress] = useState<any[]>([])


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const result = await getUserDashboardData()
        console.log("User data fetched:", result)
        console.log("Sessions data:", result.sessionData)

        if (!result.success) {
          setError(result.error || "Failed to load user data")
          // If not authenticated, redirect to login
          if (result.error === "Not authenticated") {
            router.push("/auth/signin")
          }
          return
        }

        setUserData(result.user!)
        if (result.sessionData) {
          // console.log("Setting sessions with:", result.sessionData.totalSessions)
          setSessions(result.sessionData.sessions || [])
          setWeeklySessionsCount(result.sessionData.weeklySessionsCount || 0)
          setTotalSessions(result.sessionData.totalSessions)
          // console.log(result.sessionData.totalSessions > 0 ? Math.round(result.sessionData.totalScore / result.sessionData.totalSessions) : 0)
          setAvgScore(result.sessionData.totalSessions > 0 ? Math.round(result.sessionData.totalScore / result.sessionData.totalSessions) : 0)
          setAccuracyRate(result.sessionData.totalQuestions > 0 ? Math.round((result.sessionData.correctAnswers / result.sessionData.totalQuestions) * 100) : 0)
          setCategoryProgress(result.sessionData.categoryProgress || [])
        }
      } catch (err: unknown) {
        console.error("Error fetching user data:", err)
        setError("Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth/signin")
  }

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase()
  }

  const getScoreColor = (score: number) => {
    if (score >= 24) return "text-green-600"
    if (score >= 16) return "text-amber-600"
    return "text-red-500"
  }
  

  // Loading state
  if (loading) {
    return <LoadingDashboard message="Preparing your interview insights..." />
  }

  // Error state
  if (error || !userData) {
    return <ErrorScreen error={error || "Failed to load dashboard"} onRetry={() => router.refresh()} showBackToLogin={true} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Navbar user={userData} onSignOut={handleSignOut} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Welcome back, <span className="font-serif text-primary">{userData.name}</span>
              </h2>
              <p className="text-muted-foreground mt-1">
                {"You're making great progress! Keep practicing to ace your interviews."}
              </p>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 group">
              <Plus className="w-4 h-4" />
              <Link href={"/practicesession/setup"}>New Practice Session</Link>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 animate-fade-in-up">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Attempts</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{totalSessions}</p>
                  {weeklySessionsCount >= 0 && (
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                      {weeklySessionsCount > 0 ? (
                        <>
                          <ThumbsUp className="w-3 h-3 text-green-600" />
                          +{weeklySessionsCount} this week
                        </>
                      ) : (
                        <>
                        <ThumbsDown className="w-3 h-3 text-red-500" />
                          No sessions this week
                        </>
                      )}
                    </p>
                  )}
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Hash className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {avgScore}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {totalSessions} sessions completed 
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-accent/30 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{accuracyRate}%</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Keep practicing to improve!
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                  <Gauge className="w-6 h-6 text-secondary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Practice Streak</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{userData.currentStreak || 0} days</p>
                  <p className="text-xs text-amber-600 flex items-center gap-1 mt-2">
                    <Award className="w-3 h-3" />
                    Personal best {userData.longestStreak} days!
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Overview */}
            <ProgressCard  />

            {/* Recent Sessions */}
            <Card className="bg-card border-border animate-fade-in-up" style={{ animationDelay: "500ms" }}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-foreground">Recent Sessions</CardTitle>
                  <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                      <Link href={"/dashboard/sessions"}>
                        View All
                      </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sessions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      {/* Illustration */}
                      <img
                        src="/illustrations/no-data.gif"
                        alt="No sessions"
                        className="w-40 h-40 mb-4 opacity-80"
                      />
                      {/* Message */}
                      <p className="text-muted-foreground mb-2 font-medium">
                        No practice sessions yet
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Start your first session to track progress and improve your skills.
                      </p>
                      {/* CTA */}
                      <button
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
                      >
                        Start Practice
                      </button>
                    </div>
                  ) : (
                    sessions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5)
                      .map((session) => (
                     <div
                        key={session.id}
                        className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-border/60 hover:bg-secondary/30 transition-all cursor-pointer group"
                      >
                        {/* Play icon */}
                        <div className="w-11 h-11 flex-shrink-0 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
                          <ClipboardCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>

                        {/* Meta info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mb-0.5">
                            {session.field} • {session.domain}
                          </p>
                          <p className="text-sm font-medium text-foreground capitalize truncate">
                            {session.topic ?? `${session.field} session`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(session.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          {/* Correct answers pill */}
                          <span
                            className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                              session.correct_answers / session.total_questions >= 0.7
                                ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                                : session.correct_answers / session.total_questions >= 0.5
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
                                : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                            }`}
                          >
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            {session.correct_answers} / {session.total_questions} correct
                          </span>
                        </div>

                        {/* Score */}
                        <div className="flex-shrink-0 text-right">
                          <p className={`text-xl font-semibold leading-none ${getScoreColor(session.score)}`}>
                            {session.score}
                            <span className="text-sm font-normal text-muted-foreground">
                              /{session.total_questions * 5}
                            </span>
                          </p>
                          <p className="text-[11px] uppercase tracking-widest text-muted-foreground mt-1">Score</p>
                          {/* Mini progress bar */}
                        </div>

                        {/* Chevron */}
                        <Award className="w-4 h-4 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </div>
                    ))
                  )}
                </div>
              </CardContent>

            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-card border-border animate-fade-in-up" style={{ animationDelay: "400ms" }}>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    href={action.href}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors group"
                  >
                    <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                      <action.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors">{action.label}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Self Notes */}
            <NotesCard userData={{ selfNotes: userData.selfNotes ?? undefined }} />

            {/* Motivational Card */}
            <Card className="bg-primary text-primary-foreground border-0 overflow-hidden animate-fade-in-up" style={{ animationDelay: "600ms" }}>
              <CardContent className="p-6 relative">
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center mb-4">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl mb-2">{"You're doing great!"}</h3>
                  <p className="text-primary-foreground/80 text-sm">
                    {"Keep up the momentum. You're on track to being fully interview-ready!"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Profile Image */}
            <div className="relative rounded-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: "700ms" }}>
              <Image
                src="/images/woman-success.png"
                alt="Success awaits"
                width={400}
                height={300}
                className="object-cover w-full h-94"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-primary-foreground font-serif text-lg">{"Your success story starts here"}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Animations */}
      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  )
}