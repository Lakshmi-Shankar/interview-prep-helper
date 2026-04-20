"use client"

import Link from "next/link"
import Image from "next/image"
import { Bell, Settings, LogOut } from "lucide-react"

interface UserData {
  name: string
  mail: string
  avatar_url?: string | null
}

interface NavbarProps {
  user: UserData
  onSignOut: () => void
}



export function Navbar({ user, onSignOut }: NavbarProps) {
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <h1 className="font-serif text-2xl text-primary">
              Interview Prep
            </h1>
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-4">

            {/* Notifications */}
            <button className="relative p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </button>

            {/* Settings */}
            <button className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-all">
              <Settings className="w-5 h-5" />
            </button>

            {/* Logout */}
            <button
              onClick={onSignOut}
              className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-muted transition-all"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>

            {/* User */}
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              {user.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  alt={user.name}
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-medium text-sm">
                    {getInitials(user.name)}
                  </span>
                </div>
              )}

              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user.mail}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </header>
  )
}