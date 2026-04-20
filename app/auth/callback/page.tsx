"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { handleOAuthCallback } from "./action";


export default function AuthCallback() {
  const router = useRouter();

useEffect(() => {
  const handleSession = async () => {
    const { data } = await supabase.auth.getSession();

    if (data.session) {
      // Call server action
      const result = await handleOAuthCallback();
      
      console.log("🔵 Server result:", result);

      if (result.success) {
        if (result.isNewUser) {
          console.log("🎉 Welcome! Your profile has been created.");
        } else {
          console.log("👋 Welcome back!");
        }
        router.replace("/dashboard");
      } else {
        console.error("⚠️ Profile creation failed:", result.error);
        // Optionally show error to user
        router.replace("/auth/login");
      }
    } else {
      router.replace("/auth/login");
    }
  };

  handleSession();
}, [router]);

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        {/* Image Stack with Animation */}
        <div className="relative w-full h-full flex items-center justify-center p-12">
          <div className="relative w-full max-w-lg">
            {/* Main Image */}
            <div className="relative z-20 animate-fade-in-up">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                <Image
                  src="/images/login-illustration.png"
                  alt="Professional woman waiting"
                  width={500}
                  height={600}
                  className="object-cover w-full h-[500px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
              </div>
            </div>
            
            {/* Floating Image 1 */}
            <div className="absolute -top-8 -right-8 z-10 animate-float">
              <div className="rounded-xl overflow-hidden shadow-xl w-32 h-32 border-4 border-card">
                <Image
                  src="/images/woman-interview-2.png"
                  alt="Woman practicing interview"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            
            {/* Floating Image 2 */}
            <div className="absolute -bottom-4 -left-8 z-30 animate-float-delayed">
              <div className="rounded-xl overflow-hidden shadow-xl w-40 h-40 border-4 border-card">
                <Image
                  src="/images/woman-interview-2.png"
                  alt="Successful woman celebrating"
                  width={160}
                  height={160}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/2 -right-16 transform -translate-y-1/2 z-0">
              <div className="w-32 h-32 border-2 border-accent/30 rounded-full animate-spin-slow" />
            </div>
          </div>
        </div>

        {/* Progress Overlay */}
        <div className="absolute bottom-12 left-12 right-12 z-40">
          <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl animate-slide-up">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              </div>
              <div>
                <p className="text-foreground font-medium">Verifying your credentials...</p>
                <p className="text-muted-foreground text-sm mt-1">This will only take a moment</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4 h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full animate-progress" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Loading State */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md text-center animate-fade-in">
          {/* Logo */}
          <div className="mb-12">
            <Link href="/" className="inline-block">
              <h1 className="font-serif text-4xl text-primary hover:scale-105 transition-transform duration-300">
                Interview Prep
              </h1>
            </Link>
          </div>

          {/* Loading Animation */}
          <div className="flex flex-col items-center gap-8">
            {/* Animated Spinner */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-secondary" />
              <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg 
                  className="w-8 h-8 text-primary animate-pulse" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              </div>
            </div>

            {/* Status Text */}
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">
                Signing you in...
              </h2>
              <p className="text-muted-foreground">
                Please wait while we verify your credentials
              </p>
            </div>

            {/* Animated Dots */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-16 pt-8 border-t border-border">
            <div className="flex items-center justify-center gap-6 text-muted-foreground text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secure authentication</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Privacy protected</span>
              </div>
            </div>
          </div>

          {/* Troubleshooting Link */}
          <p className="mt-8 text-sm text-muted-foreground">
            Taking too long?{" "}
            <Link 
              href="/login" 
              className="text-primary font-medium hover:underline hover:text-primary/80 transition-colors"
            >
              Try signing in again
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
