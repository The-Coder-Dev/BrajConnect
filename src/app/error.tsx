"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from "lucide-react"

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorPageProps) {
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Log the error to console / monitoring services
    console.error("Application Error Captured:", error)
  }, [error])

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground relative p-4 md:p-8 overflow-hidden select-none">
      {/* Dynamic Background Ambient Gradients */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 md:w-96 md:h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 md:w-96 md:h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse delay-700" />

      <div className="w-full max-w-lg mx-auto flex flex-col items-center text-center z-10 gap-6">
        {/* Error Illustration / Visual Anchor */}
        <div className="relative flex items-center justify-center mb-2">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center shadow-lg shadow-destructive/5 backdrop-blur-sm">
            <AlertTriangle className="w-12 h-12 text-destructive animate-bounce" />
          </div>
          <div className="absolute -inset-2 bg-destructive/5 rounded-full blur-lg -z-10" />
        </div>

        {/* Text Heading */}
        <div className="space-y-3">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-destructive/10 text-destructive border border-destructive/20">
            System Error
          </span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Something Went Wrong
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto leading-relaxed">
            An unexpected error occurred while loading this section. Don&apos;t worry, you can try reloading or return to safety.
          </p>
        </div>

        {/* Technical Error Details Accordion */}
        {error && (
          <div className="w-full text-left bg-card/60 backdrop-blur-md border border-border/80 rounded-xl overflow-hidden shadow-xs transition-all">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between p-3 md:p-4 text-xs md:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              aria-expanded={showDetails}
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-destructive" />
                Technical Error Information
              </span>
              {showDetails ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {showDetails && (
              <div className="p-4 border-t border-border/60 bg-muted/30 space-y-2 text-xs font-mono break-all text-muted-foreground">
                <div>
                  <strong className="text-foreground">Error Message:</strong>{" "}
                  {error.message || "Unknown Application Exception"}
                </div>
                {error.digest && (
                  <div>
                    <strong className="text-foreground">Digest Code:</strong>{" "}
                    <span className="bg-muted px-1.5 py-0.5 rounded border border-border">
                      {error.digest}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full pt-2">
          <Button
            onClick={() => reset()}
            size="lg"
            className="w-full sm:w-auto min-w-35 gap-2 font-semibold cursor-pointer shadow-md hover:shadow-lg transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto min-w-35 gap-2 cursor-pointer hover:bg-muted transition-colors"
            render={<Link href="/" />}
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </main>
  )
}
