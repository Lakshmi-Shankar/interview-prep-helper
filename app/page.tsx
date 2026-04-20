"use client"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Video, ClipboardList, BarChart3, Lock, Users, GraduationCap, Briefcase, ArrowRight, X } from "lucide-react"

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-serif text-foreground">Interview Prep Helper</h1>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#who-its-for" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Who It&apos;s For</a>
          </nav>
          <Button size="sm"><Link href="/auth/signin">Start Practicing</Link></Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-tight text-balance">
              Practice Interviews Like It's the Real Thing.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Answer real interview questions under a timer, record your responses on video, review your performance, and improve with every attempt.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="gap-2">
                <Link href="/auth/signin">
                  Start Practicing
                </Link>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => setOpen(true)}>
                View Demo
              </Button>

              {open && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                  <div className="relative bg-black rounded-lg w-[90%] max-w-3xl">
                    <button
                      className="absolute top-2 right-2 text-white text-xl z-10 hover:cursor-pointer"
                      onClick={() => setOpen(false)}
                    >
                      <X className="w-6 h-6" />
                    </button>

                    <video
                      src="/demo.mp4"
                      controls
                      autoPlay
                      className="w-full rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/hero-interview.png"
                alt="Person practicing for a job interview"
                fill
                className="object-cover rounded-2xl"
                priority
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-card p-4 rounded-xl shadow-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Real-time Timer</p>
                  <p className="text-xs text-muted-foreground">Simulates actual pressure</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-secondary/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-serif text-foreground mb-4">How It Works</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">Three simple steps to interview mastery</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Choose a Role",
                description: "Select your field and difficulty level.",
                icon: ClipboardList,
              },
              {
                step: "02",
                title: "Practice Under Pressure",
                description: "Answer timed interview questions while your camera records you.",
                icon: Video,
              },
              {
                step: "03",
                title: "Review & Improve",
                description: "Watch your response, rate yourself, add notes, and track progress.",
                icon: BarChart3,
              },
            ].map((item) => (
              <Card key={item.step} className="bg-card border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <span className="text-5xl font-serif text-primary/20">{item.step}</span>
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mt-4 mb-6">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-3">{item.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-serif text-foreground mb-4">Key Features</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">Everything you need to ace your next interview</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Clock,
                title: "Real Interview Timer",
                description: "Simulates actual interview pressure",
              },
              {
                icon: Video,
                title: "Video Recording",
                description: "Review body language and communication",
              },
              {
                icon: ClipboardList,
                title: "Curated Question Bank",
                description: "Role and difficulty-based questions",
              },
              {
                icon: BarChart3,
                title: "Progress Tracking",
                description: "See improvement over time",
              },
              {
                icon: Lock,
                title: "Private & Secure",
                description: "Your recordings stay yours",
              },
              {
                icon: Users,
                title: "Community Support",
                description: "Learn from others' experiences",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Section */}
      <section className="py-20 px-4 bg-secondary/50">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/video-review.png"
                alt="Reviewing interview recording on laptop"
                fill
                className="object-cover rounded-2xl"
              />
            </div>
          </div>
          <div className="space-y-6 order-1 lg:order-2">
            <h3 className="text-3xl md:text-4xl font-serif text-foreground leading-tight text-balance">
              Review Every Detail of Your Performance
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Watch your recordings, analyze your body language, improve your communication skills, and build unshakable confidence for the real thing.
            </p>
            <ul className="space-y-3">
              {["Frame-by-frame video playback", "Add personal notes and timestamps", "Track improvements over time"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-foreground">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section id="who-its-for" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-serif text-foreground mb-4">Who It's For</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">Perfect for anyone preparing for their next big opportunity</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: GraduationCap,
                title: "Students",
                description: "Preparing for placements",
              },
              {
                icon: Users,
                title: "Freshers",
                description: "Early-career developers",
              },
              {
                icon: Briefcase,
                title: "Professionals",
                description: "Switching roles",
              },
              {
                icon: ArrowRight,
                title: "Anyone",
                description: "Who wants confidence",
              },
            ].map((persona) => (
              <Card key={persona.title} className="text-center border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <persona.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-1">{persona.title}</h4>
                  <p className="text-sm text-muted-foreground">{persona.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-serif leading-relaxed max-w-4xl mx-auto text-balance">
            "Most people fail interviews not due to lack of knowledge, but lack of practice under pressure. Interview Prep Helper fixes that."
          </blockquote>
        </div>
      </section>

      {/* Success Image Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-3xl md:text-4xl font-serif text-foreground leading-tight text-balance">
              From Nervous to Confident
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Join thousands of job seekers who transformed their interview anxiety into interview success. Your dream job is just a few practice sessions away.
            </p>
            <div className="flex gap-8">
              <div>
                <p className="text-3xl font-serif text-primary">10k+</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
              <div>
                <p className="text-3xl font-serif text-primary">85%</p>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
              <div>
                <p className="text-3xl font-serif text-primary">500+</p>
                <p className="text-sm text-muted-foreground">Questions</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/celebrate.png"
                alt="Successful candidate celebrating"
                fill
                className="object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-secondary/50">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-6 text-balance">
            Don't just prepare. Practice.
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start your mock interview journey today and walk into your next interview with confidence.
          </p>
          <Button size="lg" className="gap-2 text-lg px-8 py-6">
            <Link href="/auth/signin">
              Start Your Mock Interview
            </Link>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-xl font-serif text-foreground">Interview Prep Helper</h1>
          <p className="text-sm text-muted-foreground">© 2026 Interview Prep Helper. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
