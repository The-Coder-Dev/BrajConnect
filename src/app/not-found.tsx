import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground relative p-4 md:p-8 overflow-hidden select-none">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center z-10 gap-6">
        {/* SVG Illustration Container */}
        <div className="relative w-full max-w-xs md:max-w-sm aspect-square flex items-center justify-center p-2">
          <Image
            src="/error.svg"
            alt="404 Page Not Found"
            width={380}
            height={380}
            className="object-contain w-full h-full select-none "
            priority
          />
        </div>

        {/* Text Content */}
        <div className="space-y-3 px-2">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-primary/10 text-primary border border-primary/20">
            404 — Page Not Found
          </span>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            Looks like this page flew above the clouds.
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto leading-relaxed">
            The page you are looking for doesn&apos;t exist or has been moved to a new destination.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full pt-2">
          <Button
            size="lg"
            className="w-full sm:w-auto min-w-[160px] gap-2 font-semibold cursor-pointer shadow-md hover:shadow-lg transition-all"
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