import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ErrorScreenProps = {
  error?: string;
  onRetry?: () => void;
  showBackToLogin?: boolean;
};

export default function ErrorScreen({ 
  error = "We couldn't load your dashboard data. Please try again.",
  onRetry,
  showBackToLogin = true 
}: ErrorScreenProps) {
  const router = useRouter();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>
      
      <Card className="relative z-10 max-w-md w-full mx-4 border-border bg-card/95 backdrop-blur-sm animate-fade-in-up">
        <CardContent className="p-8 text-center">
          {/* Error icon */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <span className="text-2xl text-red-500">!</span>
            </div>
          </div>
          
          <h2 className="font-serif text-2xl text-foreground mb-2">Oops! Something went wrong</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          
          <div className="space-y-3">
            <Button 
              onClick={handleRetry}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
            
            {showBackToLogin && (
              <Button 
                variant="outline"
                onClick={() => router.push("/auth/signin")}
                className="w-full border-border text-foreground hover:bg-secondary"
              >
                Back to Login
              </Button>
            )}
          </div>
          
          {/* Help link */}
          <p className="text-sm text-muted-foreground mt-6">
            Need help?{" "}
            <Link href="/support" className="text-primary hover:underline">
              Contact Support
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}