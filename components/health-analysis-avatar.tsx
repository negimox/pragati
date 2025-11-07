"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef, useMemo, useCallback } from "react"
import { Heart, ThumbsUp } from "lucide-react"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function HealthAnalysisAvatar() {
  const [isHovered, setIsHovered] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [avatarVisible, setAvatarVisible] = useState(true)
  const [clickTime, setClickTime] = useState<Date | null>(null)
  const avatarRef = useRef<HTMLDivElement>(null)

  const ANALYSIS_DURATION = 13500 // 13.5 seconds

  const healthDataSets = [
    {
      heartRate: "72",
      heartRateStatus: "normal",
      bloodPressure: "120/80",
      bloodPressureStatus: "normal",
      oxygenLevel: "98",
      oxygenStatus: "excellent",
      temperature: "37.2",
      temperatureStatus: "normal",
      bmi: "22.5",
      bmiStatus: "healthy",
      overallStatus: "excellent",
    },
    {
      heartRate: "68",
      heartRateStatus: "normal",
      bloodPressure: "118/76",
      bloodPressureStatus: "normal",
      oxygenLevel: "99",
      oxygenStatus: "excellent",
      temperature: "37.0",
      temperatureStatus: "normal",
      bmi: "23.1",
      bmiStatus: "healthy",
      overallStatus: "excellent",
    },
    {
      heartRate: "76",
      heartRateStatus: "normal",
      bloodPressure: "122/82",
      bloodPressureStatus: "normal",
      oxygenLevel: "97",
      oxygenStatus: "excellent",
      temperature: "37.3",
      temperatureStatus: "normal",
      bmi: "21.8",
      bmiStatus: "healthy",
      overallStatus: "good",
    },
  ]

  const currentDataSet = useMemo(() => {
    return healthDataSets[Math.floor(Math.random() * healthDataSets.length)]
  }, [])

  const generateTimeAlignedChartData = useCallback(() => {
    const analysisTime = clickTime || new Date()

    // Heart Rate: 6 hourly data points starting from 5 hours ago to current hour
    // Aligned to click time for realistic progression
    const heartRatePoints = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date(analysisTime)
      date.setHours(date.getHours() - i)
      date.setMinutes(0)
      date.setSeconds(0)
      date.setMilliseconds(0)

      // Format as precise time label (e.g., "08:00 AM")
      const timeStr = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })

      heartRatePoints.push({
        time: timeStr,
        hour: date.getHours(),
        rate: Math.round(65 + Math.random() * 20),
        fullDate: date,
      })
    }

    // Blood Pressure: 6 daily data points from 5 days ago to today
    // Each day at a consistent time
    const bloodPressurePoints = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date(analysisTime)
      date.setDate(date.getDate() - i)
      date.setHours(9, 0, 0, 0) // Standard measurement time

      // Format as precise date label (e.g., "Nov 1, 9:00 AM")
      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })

      bloodPressurePoints.push({
        time: dateStr,
        date: date,
        systolic: Math.round(115 + Math.random() * 10),
        diastolic: Math.round(75 + Math.random() * 8),
        fullDate: date,
      })
    }

    return {
      heartRate: heartRatePoints,
      bloodPressure: bloodPressurePoints,
    }
  }, [clickTime])

  const chartData = useMemo(() => {
    return generateTimeAlignedChartData()
  }, [generateTimeAlignedChartData])

  const healthMetrics = [
    {
      label: "Heart Rate",
      value: currentDataSet.heartRate,
      unit: "bpm",
      status: currentDataSet.heartRateStatus,
    },
    {
      label: "Blood Pressure",
      value: currentDataSet.bloodPressure,
      unit: "mmHg",
      status: currentDataSet.bloodPressureStatus,
    },
    {
      label: "Oxygen Level",
      value: currentDataSet.oxygenLevel,
      unit: "%",
      status: currentDataSet.oxygenStatus,
    },
    {
      label: "Temperature",
      value: currentDataSet.temperature,
      unit: "°C",
      status: currentDataSet.temperatureStatus,
    },
    {
      label: "BMI",
      value: currentDataSet.bmi,
      unit: "kg/m²",
      status: currentDataSet.bmiStatus,
    },
  ]

  const getOverallHealthStatus = () => {
    const overallStatus = currentDataSet.overallStatus

    if (overallStatus === "excellent") {
      return {
        status: "Excellent",
        statusLabel: "Optimal",
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-50 dark:bg-green-900/20",
        borderColor: "border-green-200 dark:border-green-700",
        accentColor: "#10b981",
      }
    } else if (overallStatus === "good") {
      return {
        status: "Good",
        statusLabel: "Healthy",
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-50 dark:bg-green-900/20",
        borderColor: "border-green-200 dark:border-green-700",
        accentColor: "#10b981",
      }
    } else if (overallStatus === "concerning") {
      return {
        status: "Concerning",
        statusLabel: "Attention Needed",
        color: "text-yellow-600 dark:text-yellow-400",
        bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
        borderColor: "border-yellow-200 dark:border-yellow-700",
        accentColor: "#eab308",
      }
    } else {
      return {
        status: "Critical",
        statusLabel: "Seek Medical Help",
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-50 dark:bg-red-900/20",
        borderColor: "border-red-200 dark:border-red-700",
        accentColor: "#ef4444",
      }
    }
  }

  const healthStatus = getOverallHealthStatus()

  const handleAnalysisClick = () => {
    const analysisStartTime = new Date()
    setClickTime(analysisStartTime)
    setIsAnalyzing(true)
    setShowReport(false)
    setAnalysisProgress(0)
    setAvatarVisible(true)

    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = (elapsed / ANALYSIS_DURATION) * 100

      if (progress >= 100) {
        clearInterval(interval)
        setAnalysisProgress(100)
        setTimeout(() => {
          setAvatarVisible(false)
          setIsAnalyzing(false)
          setShowReport(true)
        }, 700)
      } else {
        setAnalysisProgress(progress)
      }
    }, 50)

    return () => clearInterval(interval)
  }

  return (
    <div className="relative w-full flex items-center justify-center min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-slate-900 p-6">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-64 h-64 bg-cyan-200/30 rounded-full blur-3xl"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
        />
      </div>

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-12 w-full max-w-7xl">
        {/* Avatar Container */}
        <AnimatePresence>
          {avatarVisible && (
            <motion.div
              ref={avatarRef}
              className="relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 blur-2xl"
                animate={{
                  scale: isHovered ? 1.4 : isAnalyzing ? 1.3 : 1.1,
                  opacity: isHovered ? 0.6 : isAnalyzing ? 0.4 : 0.2,
                }}
                transition={{ duration: 0.4 }}
              />

              {/* Avatar */}
              <motion.div
                className="relative w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-sky-100 to-cyan-100 dark:from-sky-300 dark:to-cyan-300 cursor-pointer overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800"
                animate={{
                  scale: isHovered ? 1.08 : isAnalyzing ? 1.05 : 1,
                  boxShadow: isHovered
                    ? "0 30px 60px rgba(6, 182, 212, 0.4)"
                    : isAnalyzing
                      ? "0 20px 40px rgba(59, 130, 246, 0.3)"
                      : "0 15px 30px rgba(0, 0, 0, 0.15)",
                }}
                onClick={!isAnalyzing ? handleAnalysisClick : undefined}
                transition={{ duration: 0.3 }}
                whileTap={!isAnalyzing ? { scale: 0.98 } : {}}
              >
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 200 240"
                  preserveAspectRatio="xMidYMid slice"
                  fill="none"
                >
                  {/* Head */}
                  <circle cx="100" cy="70" r="35" fill="#f4a460" />

                  {/* Neck */}
                  <rect x="85" y="100" width="30" height="20" fill="#f4a460" />

                  {/* Body/Torso - White coat */}
                  <path
                    d="M 60 120 L 55 180 Q 55 190 65 190 L 135 190 Q 145 190 145 180 L 140 120 Z"
                    fill="#ffffff"
                    stroke="#e5e7eb"
                    strokeWidth="1.5"
                  />

                  {/* Left sleeve */}
                  <path
                    d="M 60 125 Q 30 130 25 165 L 40 165 Q 45 135 70 130 Z"
                    fill="#ffffff"
                    stroke="#e5e7eb"
                    strokeWidth="1.5"
                  />

                  {/* Right sleeve */}
                  <path
                    d="M 140 125 Q 170 130 175 165 L 160 165 Q 155 135 130 130 Z"
                    fill="#ffffff"
                    stroke="#e5e7eb"
                    strokeWidth="1.5"
                  />

                  {/* Medical coat button line */}
                  <line x1="100" y1="125" x2="100" y2="185" stroke="#d1d5db" strokeWidth="1" strokeDasharray="3,3" />

                  {/* Buttons on coat */}
                  <circle cx="100" cy="145" r="2.5" fill="#9ca3af" />
                  <circle cx="100" cy="165" r="2.5" fill="#9ca3af" />

                  {/* Stethoscope tubing - curved around neck */}
                  <path
                    d="M 75 105 Q 60 95 50 100"
                    stroke="#dc2626"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 125 105 Q 140 95 150 100"
                    stroke="#dc2626"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />

                  {/* Stethoscope earpieces */}
                  <circle cx="48" cy="98" r="4" fill="#dc2626" />
                  <circle cx="152" cy="98" r="4" fill="#dc2626" />

                  {/* Stethoscope main tube down */}
                  <path d="M 100 110 L 100 160" stroke="#dc2626" strokeWidth="2.5" fill="none" strokeLinecap="round" />

                  {/* Stethoscope diaphragm */}
                  <circle cx="100" cy="168" r="6" fill="#dc2626" />
                  <circle cx="100" cy="168" r="4.5" fill="#ef4444" />

                  {/* Head hair - dark brown/black */}
                  <path d="M 65 45 Q 70 20 100 15 Q 130 20 135 45 Q 120 30 100 28 Q 80 30 65 45 Z" fill="#3f3f3f" />

                  {/* Hair strand details */}
                  <path d="M 75 40 Q 80 25 85 40" stroke="#2d2d2d" strokeWidth="1" fill="none" opacity="0.6" />
                  <path d="M 100 25 Q 105 20 110 25" stroke="#2d2d2d" strokeWidth="1" fill="none" opacity="0.6" />
                  <path d="M 120 40 Q 125 25 130 40" stroke="#2d2d2d" strokeWidth="1" fill="none" opacity="0.6" />

                  {/* Medical cap */}
                  <ellipse cx="100" cy="35" rx="42" ry="18" fill="#0ea5e9" />
                  <path d="M 70 38 Q 75 20 100 15 Q 125 20 130 38" fill="#06b6d4" />
                  <line x1="85" y1="32" x2="115" y2="32" stroke="#0284c7" strokeWidth="1.5" />

                  {/* Left eye */}
                  <ellipse cx="85" cy="65" rx="5" ry="7" fill="#ffffff" />
                  <circle cx="85" cy="66" r="3.5" fill="#1e40af" />
                  <motion.circle
                    cx="85"
                    cy="66"
                    r="1.8"
                    fill="#000000"
                    animate={
                      isAnalyzing
                        ? {
                            cx: [85, 87, 83, 85],
                            cy: [66, 67, 65, 66],
                          }
                        : {}
                    }
                    transition={
                      isAnalyzing
                        ? {
                            duration: 3.5,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }
                        : {}
                    }
                  />
                  <circle cx="87" cy="63" r="1.5" fill="#ffffff" opacity="0.8" />

                  {/* Right eye */}
                  <ellipse cx="115" cy="65" rx="5" ry="7" fill="#ffffff" />
                  <circle cx="115" cy="66" r="3.5" fill="#1e40af" />
                  <motion.circle
                    cx="115"
                    cy="66"
                    r="1.8"
                    fill="#000000"
                    animate={
                      isAnalyzing
                        ? {
                            cx: [115, 113, 117, 115],
                            cy: [66, 67, 65, 66],
                          }
                        : {}
                    }
                    transition={
                      isAnalyzing
                        ? {
                            duration: 3.5,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }
                        : {}
                    }
                  />
                  <circle cx="113" cy="63" r="1.5" fill="#ffffff" opacity="0.8" />

                  {/* Eyebrows */}
                  <path
                    d="M 78 58 Q 85 55 92 57"
                    stroke="#2d2d2d"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 108 57 Q 115 55 122 58"
                    stroke="#2d2d2d"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                  />

                  {/* Nose */}
                  <path d="M 100 68 L 100 78" stroke="#d4a574" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  <circle cx="97" cy="78" r="1.5" fill="#d4a574" />
                  <circle cx="103" cy="78" r="1.5" fill="#d4a574" />

                  {/* Smile/Mouth */}
                  <path
                    d="M 85 85 Q 100 92 115 85"
                    stroke="#8b4513"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />

                  {/* ID badge on coat */}
                  <rect x="115" y="145" width="18" height="25" fill="#e0e7ff" stroke="#818cf8" strokeWidth="1" rx="2" />
                  <rect x="116" y="146" width="16" height="8" fill="#818cf8" />
                  <circle cx="123" cy="158" r="2" fill="#818cf8" />
                  <line x1="117" y1="162" x2="129" y2="162" stroke="#818cf8" strokeWidth="0.5" opacity="0.7" />
                  <line x1="117" y1="165" x2="129" y2="165" stroke="#818cf8" strokeWidth="0.5" opacity="0.7" />

                  {/* Medical symbol badge on coat */}
                  <circle cx="70" cy="150" r="8" fill="#fef08a" stroke="#eab308" strokeWidth="1" />
                  <line x1="70" y1="142" x2="70" y2="158" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="62" y1="150" x2="78" y2="150" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" />
                </svg>

                {/* Left Hand */}
                <motion.div
                  className="absolute top-20 -left-6 w-16 h-20"
                  animate={
                    isAnalyzing
                      ? {
                          rotate: [0, -10, 10, -5, 0],
                          x: [0, -3, 3, -2, 0],
                        }
                      : { rotate: 0 }
                  }
                  transition={
                    isAnalyzing
                      ? {
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }
                      : {}
                  }
                >
                  <svg className="w-full h-full" viewBox="0 0 50 80" fill="none">
                    {/* Arm */}
                    <rect x="18" y="0" width="14" height="40" fill="#f4a460" rx="7" />
                    {/* Wrist */}
                    <ellipse cx="25" cy="45" rx="10" ry="14" fill="#f4a460" />
                    {/* Palm base */}
                    <ellipse cx="25" cy="60" rx="12" ry="10" fill="#f4a460" />

                    {/* Thumb */}
                    <path
                      d="M 12 50 Q 8 55 8 65"
                      stroke="#f4a460"
                      strokeWidth="5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Index finger */}
                    <rect x="14" y="55" width="6" height="22" fill="#f4a460" rx="3" />

                    {/* Middle finger (tallest) */}
                    <rect x="22" y="52" width="6" height="25" fill="#f4a460" rx="3" />

                    {/* Ring finger */}
                    <rect x="30" y="54" width="6" height="23" fill="#f4a460" rx="3" />

                    {/* Pinky finger */}
                    <rect x="38" y="58" width="5" height="19" fill="#f4a460" rx="2.5" />

                    {/* Finger joints/creases for detail */}
                    <line x1="14" y1="68" x2="20" y2="68" stroke="#d4a574" strokeWidth="0.5" opacity="0.6" />
                    <line x1="22" y1="65" x2="28" y2="65" stroke="#d4a574" strokeWidth="0.5" opacity="0.6" />
                    <line x1="30" y1="67" x2="36" y2="67" stroke="#d4a574" strokeWidth="0.5" opacity="0.6" />
                    <line x1="38" y1="70" x2="43" y2="70" stroke="#d4a574" strokeWidth="0.5" opacity="0.6" />
                  </svg>
                </motion.div>

                {/* Right Hand */}
                <motion.div
                  className="absolute top-20 -right-6 w-16 h-20"
                  animate={
                    isAnalyzing
                      ? {
                          rotate: [0, 10, -10, 5, 0],
                          x: [0, 3, -3, 2, 0],
                        }
                      : { rotate: 0 }
                  }
                  transition={
                    isAnalyzing
                      ? {
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }
                      : {}
                  }
                >
                  <svg className="w-full h-full" viewBox="0 0 50 80" fill="none">
                    {/* Arm */}
                    <rect x="18" y="0" width="14" height="40" fill="#f4a460" rx="7" />
                    {/* Wrist */}
                    <ellipse cx="25" cy="45" rx="10" ry="14" fill="#f4a460" />
                    {/* Palm base */}
                    <ellipse cx="25" cy="60" rx="12" ry="10" fill="#f4a460" />

                    {/* Thumb */}
                    <path
                      d="M 38 50 Q 42 55 42 65"
                      stroke="#f4a460"
                      strokeWidth="5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Pinky finger */}
                    <rect x="7" y="58" width="5" height="19" fill="#f4a460" rx="2.5" />

                    {/* Ring finger */}
                    <rect x="14" y="54" width="6" height="23" fill="#f4a460" rx="3" />

                    {/* Middle finger (tallest) */}
                    <rect x="22" y="52" width="6" height="25" fill="#f4a460" rx="3" />

                    {/* Index finger */}
                    <rect x="30" y="55" width="6" height="22" fill="#f4a460" rx="3" />

                    {/* Finger joints/creases for detail */}
                    <line x1="7" y1="70" x2="12" y2="70" stroke="#d4a574" strokeWidth="0.5" opacity="0.6" />
                    <line x1="14" y1="67" x2="20" y2="67" stroke="#d4a574" strokeWidth="0.5" opacity="0.6" />
                    <line x1="22" y1="65" x2="28" y2="65" stroke="#d4a574" strokeWidth="0.5" opacity="0.6" />
                    <line x1="30" y1="68" x2="36" y2="68" stroke="#d4a574" strokeWidth="0.5" opacity="0.6" />
                  </svg>
                </motion.div>

                {isAnalyzing && (
                  <>
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-400/20"
                      animate={{
                        opacity: [0.3, 0.7, 0.3],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-cyan-400"
                      animate={{
                        scale: [1, 1.3],
                        opacity: [1, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-blue-400"
                      animate={{
                        scale: [1, 1.3],
                        opacity: [1, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: 0.5,
                      }}
                    />
                  </>
                )}
              </motion.div>

              <AnimatePresence>
                {isHovered && !isAnalyzing && !showReport && (
                  <motion.div
                    className="absolute -top-16 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-lg whitespace-nowrap text-sm font-medium shadow-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    Click to start analysis
                    <motion.div
                      className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-800 dark:bg-slate-700"
                      style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Analysis Status */}
              <AnimatePresence>
                {isAnalyzing && (
                  <motion.div
                    className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Analyzing...</p>
                    <motion.p
                      className="text-xs text-slate-600 dark:text-slate-400 mt-1"
                      animate={{
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    >
                      Please wait
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {isAnalyzing && (
          <motion.div
            className="w-80 md:w-96 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
              style={{ width: `${Math.min(analysisProgress, 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )}

        {/* Health Report */}
        <AnimatePresence>
          {showReport && (
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Report header */}
              <div
                className={`rounded-t-3xl p-8 md:p-12 shadow-2xl border-b-2 ${healthStatus.bgColor} ${healthStatus.borderColor} bg-white dark:bg-slate-800`}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-5 bg-cyan-100 dark:bg-cyan-900 rounded-2xl shadow-md">
                      <Heart className="w-10 h-10 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Health Report</h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Analysis completed on{" "}
                        {clickTime?.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}{" "}
                        at{" "}
                        {clickTime?.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <motion.div
                    className={`p-6 rounded-2xl ${healthStatus.bgColor} ${healthStatus.borderColor} border-2 flex-1 shadow-md`}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{
                      duration: 2.5,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    <p className={`text-2xl font-bold ${healthStatus.color} mb-2`}>{healthStatus.statusLabel}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Overall Health Status</p>
                  </motion.div>

                  <motion.div
                    className="p-6 rounded-2xl bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700 flex items-center gap-4 shadow-md"
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{
                      duration: 2.5,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 20, -10, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: 1,
                      }}
                    >
                      <ThumbsUp className="w-8 h-8 text-green-600 dark:text-green-400 fill-current flex-shrink-0" />
                    </motion.div>
                    <div>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">Good Health</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">All metrics nominal</p>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-8 md:p-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 border-b border-slate-200 dark:border-slate-700">
                {healthMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-sm hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.1,
                    }}
                    whileHover={{ scale: 1.05, translateY: -4 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{metric.label}</p>
                      <motion.div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            metric.status === "excellent" || metric.status === "healthy"
                              ? "#10b981"
                              : metric.status === "normal"
                                ? "#06b6d4"
                                : "#f59e0b",
                        }}
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: index * 0.15,
                        }}
                      />
                    </div>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-3xl font-bold text-slate-900 dark:text-white">{metric.value}</span>
                      <span className="text-sm text-slate-500 dark:text-slate-500">{metric.unit}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 capitalize font-medium">{metric.status}</p>
                  </motion.div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="bg-white dark:bg-slate-800 p-8 md:p-12 border-b border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                  {/* Heart Rate Trend */}
                  <motion.div
                    className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">
                      Heart Rate Trend (Today)
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={chartData.heartRate}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.2)" />
                        <XAxis
                          dataKey="time"
                          tick={{ fill: "rgba(100, 116, 139, 0.7)", fontSize: 12 }}
                          angle={-45}
                          height={80}
                        />
                        <YAxis
                          tick={{ fill: "rgba(100, 116, 139, 0.7)", fontSize: 12 }}
                          label={{
                            value: "bpm",
                            angle: -90,
                            position: "insideLeft",
                            style: { fill: "rgba(100, 116, 139, 0.7)" },
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(15, 23, 42, 0.95)",
                            border: "1px solid rgba(100, 116, 139, 0.5)",
                            borderRadius: "12px",
                            color: "white",
                            padding: "12px",
                          }}
                          formatter={(value) => [`${Math.round(value)} bpm`, "Heart Rate"]}
                          labelStyle={{ color: "rgba(255, 255, 255, 0.8)" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="rate"
                          stroke="#06b6d4"
                          strokeWidth={3}
                          dot={{ fill: "#06b6d4", r: 5 }}
                          activeDot={{ r: 7 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </motion.div>

                  {/* Blood Pressure Trend */}
                  <motion.div
                    className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                  >
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">
                      Blood Pressure Trend (Last 6 Days)
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={chartData.bloodPressure}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.2)" />
                        <XAxis dataKey="time" tick={{ fill: "rgba(100, 116, 139, 0.7)", fontSize: 12 }} />
                        <YAxis
                          tick={{ fill: "rgba(100, 116, 139, 0.7)", fontSize: 12 }}
                          label={{
                            value: "mmHg",
                            angle: -90,
                            position: "insideLeft",
                            style: { fill: "rgba(100, 116, 139, 0.7)" },
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(15, 23, 42, 0.95)",
                            border: "1px solid rgba(100, 116, 139, 0.5)",
                            borderRadius: "12px",
                            color: "white",
                            padding: "12px",
                          }}
                          formatter={(value) => `${Math.round(value)} mmHg`}
                          labelStyle={{ color: "rgba(255, 255, 255, 0.8)" }}
                        />
                        <Bar dataKey="systolic" fill="#06b6d4" radius={[10, 10, 0, 0]} />
                        <Bar dataKey="diastolic" fill="#3b82f6" radius={[10, 10, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                </div>
              </div>

              {/* Report footer */}
              <div className="bg-white dark:bg-slate-800 rounded-b-3xl p-8 md:p-12 shadow-2xl flex flex-col sm:flex-row gap-4 justify-end border-t border-slate-200 dark:border-slate-700">
                <motion.button
                  onClick={() => {
                    setShowReport(false)
                    setAvatarVisible(true)
                    setAnalysisProgress(0)
                    setClickTime(null)
                  }}
                  className="px-8 py-4 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
                <motion.button
                  onClick={() => {
                    setShowReport(false)
                    setAvatarVisible(true)
                    setAnalysisProgress(0)
                    setClickTime(null)
                  }}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  New Analysis
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info text */}
        {!isAnalyzing && !showReport && (
          <motion.p
            className="text-center text-slate-600 dark:text-slate-400 text-base max-w-sm mt-8"
            animate={{ opacity: isHovered ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            Click on the doctor avatar above to begin your health analysis
          </motion.p>
        )}
      </div>
    </div>
  )
}
