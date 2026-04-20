"use client";
import { Sparkles, Wand } from "lucide-react";
import { BellElectricIcon } from "./ui/bell-electric";

export default function LoadingDashboard({ message = "Preparing your dashboard" }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "500ms" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1000ms" }} />
      </div>
      
      <div className="relative z-10 text-center space-y-8">
        {/* Logo */}
        <div className="animate-fade-in-up">
          <h1 className="font-serif text-4xl text-primary mb-2">Interview Prep</h1>
          <p className="text-muted-foreground text-sm">{message}</p>
        </div>
        
        {/* Animated loader */}
        <div className="relative animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <div className="w-20 h-20 mx-auto relative">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 rounded-full border-4 border-secondary" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
            
            {/* Inner pulsing circle */}
            <div className="absolute inset-3 rounded-full bg-primary/10 flex items-center justify-center">
              {/* <Sparkles className="w-6 h-6 text-primary animate-pulse" /> */}
              
              <Wand size={34} className="animate-pulse" />
            </div>
          </div>
        </div>
        
        {/* Loading steps */}
        <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
          <div className="flex items-center justify-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <p className="text-muted-foreground text-sm">Loading your progress data...</p>
        </div>
        
        {/* Progress bar */}
        <div className="w-64 mx-auto animate-fade-in-up" style={{ animationDelay: "600ms" }}>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-progress" />
          </div>
        </div>
      </div>
    </div>
  );
}