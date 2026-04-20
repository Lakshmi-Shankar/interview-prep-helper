"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, TrendingUp, TrendingDown, Minus, FileText, BarChart3, Target, Zap, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

import { fetchSessions as getSessions } from "@/app/dashboard/action";

// Mock data for demonstration - replace with actual API call


interface Session {
  id: string;
  domain: string;
  score: number;
  created_at: string;
  history?: number[];
  field: string;
}

const ITEMS_PER_PAGE = 10;

// Mini sparkline component for score visualization
function ScoreBar({ score } : { score: number }) {
  const percent = (score / 30) * 100;

  const color =
    score >= 24 ? "bg-green-500" :
    score >= 18 ? "bg-yellow-500" :
    "bg-red-500";

  return (
    <div className="w-20">
      <div className="h-2 bg-muted rounded-full overflow-hidden border border-border">
        <div
          className={`h-full ${color} transition-all`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

// Score badge with color coding
function ScoreBadge({ score }: { score: number }) {
  const getScoreVariant = (score: number) => {
    if (score >= 24) return "default";
    if (score >= 18) return "secondary";
    return "outline";
  };

  const getScoreColor = (score: number) => {
    if (score >= 24) return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    if (score >= 18) return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    return "bg-red-500/10 text-red-600 border-red-500/20";
  };

  return (
    <Badge variant="outline" className={`${getScoreColor(score)} font-semibold tabular-nums`}>
      {score}/30
    </Badge>
  );
}

// Category badge
function CategoryBadge({ field }: { field: string }) {
  const getCategoryColor = (field: string) => {
    const colors: Record<string, string> = {
      software: "bg-blue-500/10 text-blue-600 border-blue-500/20 capitalize",
      medical: "bg-purple-500/10 text-purple-600 border-purple-500/20 capitalize",
      datascience: "bg-green-500/10 text-green-600 border-green-500/20 capitalize",
    };
    return colors[field] || "bg-secondary text-secondary-foreground";
  };

  return (
    <Badge variant="outline" className={getCategoryColor(field)}>
      {field}
    </Badge>
  );
}

// Session card component
function SessionCard({ session, index }: { session: Session; index: number }) {
  const router = useRouter();
  
  return (
    <Card 
      className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/20 py-0"
      onClick={() => router.push(`/dashboard/sessions/${session.id}`)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Index & Category */}
          <div className="flex items-center gap-4 min-w-0">
            <span className="text-sm font-medium text-muted-foreground w-6 text-center tabular-nums">
              {index}
            </span>
            <div className="flex flex-col gap-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <CategoryBadge field={session.field} />
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="size-3.5" />
                <time dateTime={session.created_at}>
                  {new Date(session.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </time>
              </div>
            </div>
          </div>

          {/* Right: Mini Graph & Score */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <ScoreBar score={session.score} />
            </div>
            <ScoreBadge score={session.score} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton loader for session cards
function SessionCardSkeleton() {
  return (
    <Card className="py-0">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="size-6 rounded" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-5 w-20 rounded" />
              <Skeleton className="h-4 w-28 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-7 w-16 rounded hidden sm:block" />
            <Skeleton className="h-6 w-12 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Stats summary component
function StatsSummary({ sessions }: { sessions: Session[] }) {
  const stats = useMemo(() => {
    if (sessions.length === 0) return null;
    
    const scores = sessions.map(s => s.score);
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const best = Math.max(...scores);
    const recent = sessions.slice(0, 5);
    const recentAvg = recent.length > 0 
      ? Math.round(recent.map(s => s.score).reduce((a, b) => a + b, 0) / recent.length)
      : 0;
    
    return { avg, best, total: sessions.length, recentAvg };
  }, [sessions]);

  if (!stats) return null;

  const statItems = [
    { label: "Total Sessions", value: stats.total, icon: FileText, color: "text-blue-500 bg-blue-500/10" },
    { label: "Average Score", value: `${stats.avg}/30`, icon: Target, color: "text-emerald-500 bg-emerald-500/10" },
    { label: "Best Score", value: `${stats.best}/30`, icon: Award, color: "text-amber-500 bg-amber-500/10" },
    { label: "Recent Avg", value: `${stats.recentAvg}/30`, icon: Zap, color: "text-purple-500 bg-purple-500/10" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {statItems.map((stat) => (
        <Card key={stat.label} className="py-4">
          <CardContent className="p-0 px-4">
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center size-9 rounded-lg ${stat.color}`}>
                <stat.icon className="size-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-lg font-semibold tabular-nums">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Generate pagination items
function generatePaginationItems(currentPage: number, totalPages: number) {
  const items: (number | "ellipsis")[] = [];
  
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) items.push(i);
  } else {
    items.push(1);
    
    if (currentPage > 3) items.push("ellipsis");
    
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = start; i <= end; i++) {
      if (!items.includes(i)) items.push(i);
    }
    
    if (currentPage < totalPages - 2) items.push("ellipsis");
    
    if (!items.includes(totalPages)) items.push(totalPages);
  }
  
  return items;
}

export default function SessionsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        await getSessions().then((data) => {
          console.log("Fetched sessions:", data);
          setSessions(data ?? []);
        }).catch((error) => {
          console.error("Error fetching sessions:", error);
        });
        
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(sessions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentSessions = sessions.slice(startIndex, endIndex);
  const paginationItems = generatePaginationItems(currentPage, totalPages);

  // Loading state
  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="size-10 rounded-lg" />
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-xl" />
              <div>
                <Skeleton className="h-7 w-40 rounded mb-1" />
                <Skeleton className="h-4 w-56 rounded" />
              </div>
            </div>
          </div>
        </div>
        {/* Stats skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[72px] rounded-xl" />
          ))}
        </div>
        {/* Divider skeleton */}
        <div className="my-8 flex justify-center">
          <Skeleton className="h-5 w-28 rounded" />
        </div>
        {/* Sessions skeleton */}
        <div className="space-y-3">
          {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
            <SessionCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard")}
            className="shrink-0"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10 text-primary">
              <BarChart3 className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-balance">Your Results</h1>
              <p className="text-sm text-muted-foreground">
                Track your practice sessions and progress
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {sessions.length === 0 ? (
        <Empty className="min-h-[400px] border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileText />
            </EmptyMedia>
            <EmptyTitle>No practice sessions yet</EmptyTitle>
            <EmptyDescription>
              Start your first session to see your progress here. Track your scores
              and watch your improvement over time.
            </EmptyDescription>
          </EmptyHeader>
          <Button onClick={() => router.push("/practice")}>
            Start Practice
          </Button>
        </Empty>
      ) : (
        <>
          {/* Stats Summary */}
          <StatsSummary sessions={sessions} />

          {/* Section Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-4 text-sm font-medium text-muted-foreground">
                All Sessions
              </span>
            </div>
          </div>

          {/* Results List */}
          <div className="space-y-3 mb-6">
            {currentSessions.map((session, i) => (
              <SessionCard
                key={session.id}
                session={session}
                index={startIndex + i + 1}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground order-2 sm:order-1">
                Showing {startIndex + 1}-{Math.min(endIndex, sessions.length)} of {sessions.length} results
              </p>
              
              <Pagination className="order-1 sm:order-2 mx-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {paginationItems.map((item, i) => (
                    <PaginationItem key={i} className="hidden sm:block">
                      {item === "ellipsis" ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          href="#"
                          isActive={currentPage === item}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(item);
                          }}
                          className="cursor-pointer"
                        >
                          {item}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem className="sm:hidden">
                    <span className="text-sm px-2">
                      {currentPage} / {totalPages}
                    </span>
                  </PaginationItem>
                  
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
