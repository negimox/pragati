"use client";

import { HealthAnalysisAvatar } from "@/components/health-analysis-avatar";
import { Activity, Heart, Brain } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      {/* Header */}
      <header
        className="sticky top-0 z-20 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-sm"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 blur-lg opacity-60 animate-pulse" />
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
                  <Activity className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Pragati
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  Next-gen health partner
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Heart className="w-4 h-4 text-red-500" />
                <span>AI-Powered Analysis</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Brain className="w-4 h-4 text-purple-500" />
                <span>Smart Insights</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1">
        <HealthAnalysisAvatar />
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-slate-600 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <p>© 2025 Pragati. Your health, our priority.</p>
      </footer>
    </main>
  );
}
