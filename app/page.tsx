"use client"

import { HealthAnalysisAvatar } from "@/components/health-analysis-avatar"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">✨</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pragati</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Next gen health partner</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1">
        <HealthAnalysisAvatar />
      </div>
    </main>
  )
}
