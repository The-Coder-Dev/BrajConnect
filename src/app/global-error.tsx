"use client"

import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Global Layout Error Captured:", error)
  }, [error])

  return (
    <html lang="en">
      <body className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-950 text-gray-100 p-4 font-sans select-none">
        <div className="max-w-md w-full text-center space-y-6 bg-gray-900/80 p-8 rounded-2xl border border-gray-800 backdrop-blur-md shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
            !
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">Critical Error Occurred</h1>
            <p className="text-sm text-gray-400">
              A global application error occurred. You can attempt to recover by clicking below.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => reset()}
              className="w-full py-2.5 px-5 bg-red-600 hover:bg-red-500 text-white font-medium rounded-xl text-sm transition-all shadow-md cursor-pointer"
            >
              Reload Application
            </button>
            <a
              href="/"
              className="w-full py-2.5 px-5 bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium rounded-xl text-sm transition-all text-center border border-gray-700 cursor-pointer"
            >
              Return Home
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
