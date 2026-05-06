"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function ShimmerBar({ delay = 0 }: { delay?: number }) {
  return (
    <div className="relative h-1.5 rounded-full bg-muted overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent animate-shimmer"
        style={{ animationDelay: `${delay}s` }}
      />
    </div>
  );
}

const stats = [
  { label: "Accuracy", barWidth: "w-3/5" },
  { label: "Streak", barWidth: "w-2/5" },
  { label: "Improvement", barWidth: "w-3/4" },
];

export default function ProgressCard() {
  return (
    <Card className="max-w-m overflow-hidden">
      <CardHeader className="pb-0 pt-6 px-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground mb-1.5">
              Your Progress
            </p>
            <h2 className="font-serif text-2xl font-normal leading-snug">
              Analytics are <em className="italic">on the way</em>
            </h2>
          </div>
          <div className="shrink-0 w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
            <ClockIcon />
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 pt-5 pb-6">
        <div className="flex gap-2.5 mb-5">
          {stats.map(({ label, barWidth }, i) => (
            <div key={label} className="flex-1 bg-muted rounded-lg p-3">
              <p className="text-[11px] text-muted-foreground mb-2">{label}</p>
              <ShimmerBar delay={i * 0.3} />
              <div className={`h-2 bg-muted-foreground/10 rounded-full mt-1.5 ${barWidth}`} />
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-4 flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Detailed insights for accuracy, streaks &amp; improvement are coming soon.
          </p>
          <BuildingBadge />
        </div>
      </CardContent>
    </Card>
  );
}

function ClockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#92400e" strokeWidth="1.5" />
      <path d="M12 7v5l3 3" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BuildingBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs font-medium rounded-full px-3 py-1 border border-amber-200 shrink-0">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
      Building
    </span>
  );
}