/* eslint-disable @next/next/no-img-element */
"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Bell, Settings, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { getUserDashboardData } from "@/app/dashboard/action"

import OptionsCompo from "./optionsCompo"
import LoadingDashboard from "@/components/madeFunc/loading"
import { Navbar } from "@/components/madeFunc/navbar"

interface UserData {
  id: string
  name: string
  mail: string
  avatar_url?: string | null
}

export default function GhostPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const result = await getUserDashboardData()

        if (!result.success) {
          setError(result.error || "Failed to load user data")
          if (result.error === "Not authenticated") router.push("/auth/signin")
          return
        }

        setUserData(result.user!)
      } catch (err) {
        console.error(err)
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

  if (loading) return <LoadingDashboard />

  if (error || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-destructive">
        {error || "Failed to load"}
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">

      {/* Header */}
      <Navbar user={userData} onSignOut={handleSignOut} />

      {/* Ghost — full version on sm+ screens */}
      <div className="fixed bottom-4 left-4 z-20 pointer-events-none select-none hidden sm:flex md:bottom-6 md:left-6 flex-col items-start">
        <div className="relative flex flex-col items-start">

          {/* Speech bubble */}
          <div className="bg-card border border-border rounded-2xl shadow-lg p-3 md:p-4 mb-3 md:mb-4 w-52 md:w-64 pointer-events-auto">
            <p className="text-xs md:text-sm font-semibold text-foreground">
              Hey {userData.name.split(" ")[0]}! 👋
            </p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Pick a field and let&apos;s start practicing!
            </p>
            <div className="flex gap-1.5 mt-2 flex-wrap">
              <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded-full text-[10px]">
                #StayConsistent
              </span>
              <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded-full text-[10px]">
                #InterviewReady
              </span>
            </div>
            {/* Bubble tail */}
            <div className="absolute -bottom-2 left-6 w-3 h-3 bg-card border-r border-b border-border rotate-45" />
          </div>

          {/* Ghost image */}
          <div className="animate-ghost-float ml-2">
            <img
              src="/illustrations/Ghost.png"
              alt="ghost mascot"
              className="w-16 h-16 md:w-24 md:h-24 object-contain drop-shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Ghost — tiny version on mobile only, no bubble */}
      <div className="fixed bottom-4 left-4 z-20 pointer-events-none select-none sm:hidden">
        <div className="animate-ghost-float">
          <img
            src="/illustrations/Ghost.png"
            alt="ghost mascot"
            className="w-10 h-10 object-contain opacity-60"
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes ghost-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        .animate-ghost-float {
          animation: ghost-float 3s ease-in-out infinite;
        }
      `}</style>

      <OptionsCompo />
    </main>
  )
}