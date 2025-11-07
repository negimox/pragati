"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useMemo, useCallback } from "react";
import { Heart, ThumbsUp } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function HealthAnalysisAvatar() {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [avatarVisible, setAvatarVisible] = useState(true);
  const [clickTime, setClickTime] = useState<Date | null>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  const ANALYSIS_DURATION = 45000; // 45 seconds - realistic analysis time

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
  ];

  const currentDataSet = useMemo(() => {
    return healthDataSets[Math.floor(Math.random() * healthDataSets.length)];
  }, []);

  const generateTimeAlignedChartData = useCallback(() => {
    const analysisTime = clickTime || new Date();

    // Heart Rate: 12 hourly data points for today (last 11 hours + current hour)
    // Showing intraday pattern with hour intervals
    const heartRatePoints = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(analysisTime);
      date.setHours(date.getHours() - i);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);

      // Format as precise time label (e.g., "08:00")
      const timeStr = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      // Simulate realistic heart rate variations throughout the day
      const baseRate = 70;
      const hourVariation = Math.sin((date.getHours() / 24) * Math.PI * 2) * 5;
      const randomVariation = (Math.random() - 0.5) * 8;
      
      heartRatePoints.push({
        time: timeStr,
        hour: date.getHours(),
        rate: Math.round(baseRate + hourVariation + randomVariation),
        fullDate: date,
      });
    }

    // Blood Pressure: 7 daily data points (last 6 days + today)
    // Recent trend showing daily measurements
    const bloodPressurePoints = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(analysisTime);
      date.setDate(date.getDate() - i);
      date.setHours(9, 0, 0, 0); // Standard morning measurement time

      // Format with date and time for precision
      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      
      const timeStr = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      // Simulate realistic blood pressure with slight daily variations
      const baseSystolic = 118;
      const baseDiastolic = 78;
      const dailyVariation = (Math.random() - 0.5) * 6;
      
      bloodPressurePoints.push({
        time: `${dateStr}\n${timeStr}`,
        date: date,
        systolic: Math.round(baseSystolic + dailyVariation),
        diastolic: Math.round(baseDiastolic + dailyVariation * 0.6),
        fullDate: date,
      });
    }

    return {
      heartRate: heartRatePoints,
      bloodPressure: bloodPressurePoints,
    };
  }, [clickTime]);

  const chartData = useMemo(() => {
    return generateTimeAlignedChartData();
  }, [generateTimeAlignedChartData]);

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
  ];

  const getOverallHealthStatus = () => {
    const overallStatus = currentDataSet.overallStatus;

    if (overallStatus === "excellent") {
      return {
        status: "Excellent",
        statusLabel: "Optimal Health",
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-50 dark:bg-green-900/20",
        borderColor: "border-green-200 dark:border-green-700",
        accentColor: "#10b981",
        recommendations: [
          "Continue your healthy lifestyle habits",
          "Maintain regular physical activity",
          "Keep up with balanced nutrition",
          "Ensure adequate sleep and hydration",
        ],
      };
    } else if (overallStatus === "good") {
      return {
        status: "Good",
        statusLabel: "Healthy Range",
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-50 dark:bg-green-900/20",
        borderColor: "border-green-200 dark:border-green-700",
        accentColor: "#10b981",
        recommendations: [
          "Maintain current health practices",
          "Consider increasing physical activity",
          "Monitor stress levels regularly",
          "Stay consistent with health checkups",
        ],
      };
    } else if (overallStatus === "concerning") {
      return {
        status: "Concerning",
        statusLabel: "Attention Needed",
        color: "text-yellow-600 dark:text-yellow-400",
        bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
        borderColor: "border-yellow-200 dark:border-yellow-700",
        accentColor: "#eab308",
        recommendations: [
          "Schedule a consultation with your doctor",
          "Review lifestyle and dietary habits",
          "Increase monitoring frequency",
          "Consider stress management techniques",
        ],
      };
    } else {
      return {
        status: "Critical",
        statusLabel: "Seek Medical Help",
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-50 dark:bg-red-900/20",
        borderColor: "border-red-200 dark:border-red-700",
        accentColor: "#ef4444",
        recommendations: [
          "Contact your healthcare provider immediately",
          "Do not delay medical attention",
          "Monitor symptoms closely",
          "Have emergency contacts ready",
        ],
      };
    }
  };

  const healthStatus = getOverallHealthStatus();

  const handleAnalysisClick = () => {
    const analysisStartTime = new Date();
    setClickTime(analysisStartTime);
    setIsAnalyzing(true);
    setShowReport(false);
    setAnalysisProgress(0);
    setAvatarVisible(true);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed / ANALYSIS_DURATION) * 100;

      if (progress >= 100) {
        clearInterval(interval);
        setAnalysisProgress(100);
        setTimeout(() => {
          setAvatarVisible(false);
          setIsAnalyzing(false);
          setShowReport(true);
        }, 700);
      } else {
        setAnalysisProgress(progress);
      }
    }, 50);

    return () => clearInterval(interval);
  };

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
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && !isAnalyzing) {
                    e.preventDefault();
                    handleAnalysisClick();
                  }
                }}
                transition={{ duration: 0.3 }}
                whileTap={!isAnalyzing ? { scale: 0.98 } : {}}
                tabIndex={!isAnalyzing ? 0 : -1}
                role="button"
                aria-label="Click to start health analysis"
                aria-busy={isAnalyzing}
              >
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 200 240"
                  preserveAspectRatio="xMidYMid slice"
                  fill="none"
                >
                  {/* Head with better skin tone */}
                  <ellipse cx="100" cy="68" rx="38" ry="42" fill="#f0c6a0" />

                  {/* Ears */}
                  <ellipse cx="63" cy="70" rx="8" ry="12" fill="#e8b896" />
                  <ellipse cx="137" cy="70" rx="8" ry="12" fill="#e8b896" />
                  <ellipse cx="64" cy="70" rx="4" ry="7" fill="#d4a574" />
                  <ellipse cx="136" cy="70" rx="4" ry="7" fill="#d4a574" />

                  {/* Neck with shadow */}
                  <path
                    d="M 82 102 L 82 122 L 118 122 L 118 102 Z"
                    fill="#f0c6a0"
                  />
                  <ellipse cx="100" cy="102" rx="18" ry="8" fill="#f0c6a0" />

                  {/* Collar/Shirt under coat */}
                  <path
                    d="M 82 122 L 75 135 L 85 135 L 85 125 L 100 118 L 115 125 L 115 135 L 125 135 L 118 122 Z"
                    fill="#e0f2fe"
                    stroke="#bae6fd"
                    strokeWidth="1"
                  />

                  {/* Body/Torso - Professional white coat with better shape */}
                  <path
                    d="M 55 135 L 50 185 Q 50 195 62 195 L 138 195 Q 150 195 150 185 L 145 135 Z"
                    fill="#ffffff"
                    stroke="#d1d5db"
                    strokeWidth="2"
                  />

                  {/* Coat lapels - more defined */}
                  <path
                    d="M 82 125 L 75 135 L 85 195"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M 118 125 L 125 135 L 115 195"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                    fill="none"
                  />

                  {/* Left sleeve - improved */}
                  <path
                    d="M 55 140 Q 25 145 20 175 L 35 175 Q 40 150 65 145 Z"
                    fill="#ffffff"
                    stroke="#d1d5db"
                    strokeWidth="2"
                  />

                  {/* Right sleeve - improved */}
                  <path
                    d="M 145 140 Q 175 145 180 175 L 165 175 Q 160 150 135 145 Z"
                    fill="#ffffff"
                    stroke="#d1d5db"
                    strokeWidth="2"
                  />

                  {/* Pocket on coat */}
                  <path
                    d="M 65 155 L 65 175 Q 65 177 67 177 L 83 177 Q 85 177 85 175 L 85 155 Z"
                    fill="#f9fafb"
                    stroke="#d1d5db"
                    strokeWidth="1"
                  />
                  <line
                    x1="67"
                    y1="158"
                    x2="83"
                    y2="158"
                    stroke="#d1d5db"
                    strokeWidth="0.8"
                  />

                  {/* Pen in pocket */}
                  <rect
                    x="72"
                    y="150"
                    width="2.5"
                    height="15"
                    fill="#1e40af"
                    rx="1"
                  />
                  <circle cx="73.25" cy="150" r="1.5" fill="#3b82f6" />
                  <line
                    x1="73.25"
                    y1="151"
                    x2="73.25"
                    y2="165"
                    stroke="#60a5fa"
                    strokeWidth="0.3"
                  />

                  {/* Buttons on coat - professional */}
                  <circle
                    cx="100"
                    cy="145"
                    r="3"
                    fill="#e5e7eb"
                    stroke="#9ca3af"
                    strokeWidth="0.8"
                  />
                  <circle
                    cx="100"
                    cy="165"
                    r="3"
                    fill="#e5e7eb"
                    stroke="#9ca3af"
                    strokeWidth="0.8"
                  />
                  <circle
                    cx="100"
                    cy="185"
                    r="3"
                    fill="#e5e7eb"
                    stroke="#9ca3af"
                    strokeWidth="0.8"
                  />

                  {/* Stethoscope - more realistic */}
                  {/* Earpieces */}
                  <ellipse
                    cx="42"
                    cy="100"
                    rx="5"
                    ry="6"
                    fill="#1f2937"
                    stroke="#374151"
                    strokeWidth="1"
                  />
                  <ellipse
                    cx="158"
                    cy="100"
                    rx="5"
                    ry="6"
                    fill="#1f2937"
                    stroke="#374151"
                    strokeWidth="1"
                  />

                  {/* Tubing around neck - left side */}
                  <path
                    d="M 45 102 Q 55 108 68 108"
                    stroke="#1f2937"
                    strokeWidth="3.5"
                    fill="none"
                    strokeLinecap="round"
                  />

                  {/* Tubing around neck - right side */}
                  <path
                    d="M 155 102 Q 145 108 132 108"
                    stroke="#1f2937"
                    strokeWidth="3.5"
                    fill="none"
                    strokeLinecap="round"
                  />

                  {/* Y-connection at bottom */}
                  <path
                    d="M 68 108 Q 80 112 95 145"
                    stroke="#1f2937"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 132 108 Q 120 112 105 145"
                    stroke="#1f2937"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />

                  {/* Main tube */}
                  <path
                    d="M 100 148 L 108 175"
                    stroke="#1f2937"
                    strokeWidth="3.5"
                    fill="none"
                    strokeLinecap="round"
                  />

                  {/* Chest piece (diaphragm) - metallic look */}
                  <ellipse
                    cx="110"
                    cy="182"
                    rx="8"
                    ry="9"
                    fill="#6b7280"
                    stroke="#374151"
                    strokeWidth="1.5"
                  />
                  <ellipse cx="110" cy="182" rx="6" ry="7" fill="#9ca3af" />
                  <ellipse cx="110" cy="182" rx="4" ry="5" fill="#d1d5db" />
                  <circle
                    cx="108"
                    cy="180"
                    r="1.5"
                    fill="#ffffff"
                    opacity="0.7"
                  />

                  {/* Hair - professional style */}
                  <path
                    d="M 62 45 Q 65 22 100 18 Q 135 22 138 45 L 138 55 Q 130 35 100 32 Q 70 35 62 55 Z"
                    fill="#2d1b12"
                  />

                  {/* Hair texture/highlights */}
                  <path
                    d="M 70 38 Q 75 28 80 38"
                    stroke="#1a0f0a"
                    strokeWidth="1.2"
                    fill="none"
                    opacity="0.5"
                  />
                  <path
                    d="M 85 35 Q 88 25 92 35"
                    stroke="#1a0f0a"
                    strokeWidth="1.2"
                    fill="none"
                    opacity="0.5"
                  />
                  <path
                    d="M 100 30 Q 103 22 106 30"
                    stroke="#1a0f0a"
                    strokeWidth="1.2"
                    fill="none"
                    opacity="0.5"
                  />
                  <path
                    d="M 110 35 Q 113 25 118 35"
                    stroke="#1a0f0a"
                    strokeWidth="1.2"
                    fill="none"
                    opacity="0.5"
                  />
                  <path
                    d="M 122 38 Q 125 28 130 38"
                    stroke="#1a0f0a"
                    strokeWidth="1.2"
                    fill="none"
                    opacity="0.5"
                  />

                  {/* Glasses - professional look */}
                  <g opacity="0.95">
                    {/* Left lens */}
                    <ellipse
                      cx="82"
                      cy="66"
                      rx="12"
                      ry="13"
                      fill="none"
                      stroke="#374151"
                      strokeWidth="2.5"
                    />
                    <ellipse
                      cx="82"
                      cy="66"
                      rx="12"
                      ry="13"
                      fill="#f0f9ff"
                      opacity="0.15"
                    />

                    {/* Right lens */}
                    <ellipse
                      cx="118"
                      cy="66"
                      rx="12"
                      ry="13"
                      fill="none"
                      stroke="#374151"
                      strokeWidth="2.5"
                    />
                    <ellipse
                      cx="118"
                      cy="66"
                      rx="12"
                      ry="13"
                      fill="#f0f9ff"
                      opacity="0.15"
                    />

                    {/* Bridge */}
                    <path
                      d="M 94 66 Q 100 64 106 66"
                      stroke="#374151"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                    />

                    {/* Temples/Arms */}
                    <path
                      d="M 70 66 L 63 68"
                      stroke="#374151"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 130 66 L 137 68"
                      stroke="#374151"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                    />

                    {/* Lens reflection */}
                    <ellipse
                      cx="78"
                      cy="62"
                      rx="3"
                      ry="4"
                      fill="#ffffff"
                      opacity="0.6"
                    />
                    <ellipse
                      cx="114"
                      cy="62"
                      rx="3"
                      ry="4"
                      fill="#ffffff"
                      opacity="0.6"
                    />
                  </g>

                  {/* Eyes behind glasses */}
                  <ellipse cx="82" cy="67" rx="4" ry="5" fill="#ffffff" />
                  <circle cx="82" cy="68" r="3.5" fill="#3b2820" />
                  <motion.circle
                    cx="82"
                    cy="68"
                    r="2"
                    fill="#0f0a08"
                    animate={
                      isAnalyzing
                        ? {
                            cx: [82, 84, 80, 82],
                            cy: [68, 69, 67, 68],
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
                  <circle
                    cx="84"
                    cy="66"
                    r="1.2"
                    fill="#ffffff"
                    opacity="0.9"
                  />

                  <ellipse cx="118" cy="67" rx="4" ry="5" fill="#ffffff" />
                  <circle cx="118" cy="68" r="3.5" fill="#3b2820" />
                  <motion.circle
                    cx="118"
                    cy="68"
                    r="2"
                    fill="#0f0a08"
                    animate={
                      isAnalyzing
                        ? {
                            cx: [118, 116, 120, 118],
                            cy: [68, 69, 67, 68],
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
                  <circle
                    cx="116"
                    cy="66"
                    r="1.2"
                    fill="#ffffff"
                    opacity="0.9"
                  />

                  {/* Eyebrows - visible above glasses */}
                  <path
                    d="M 70 56 Q 77 53 85 55"
                    stroke="#2d1b12"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 115 55 Q 123 53 130 56"
                    stroke="#2d1b12"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />

                  {/* Nose */}
                  <path
                    d="M 100 70 L 100 82 Q 100 84 102 84"
                    stroke="#d4a574"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <ellipse cx="96" cy="84" rx="2" ry="2.5" fill="#d4a574" />
                  <ellipse cx="104" cy="84" rx="2" ry="2.5" fill="#d4a574" />

                  {/* Smile - friendly and professional */}
                  <path
                    d="M 83 91 Q 100 98 117 91"
                    stroke="#8b4513"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                  {/* Subtle smile lines */}
                  <path
                    d="M 82 88 Q 80 90 82 92"
                    stroke="#d4a574"
                    strokeWidth="0.8"
                    fill="none"
                    opacity="0.4"
                  />
                  <path
                    d="M 118 88 Q 120 90 118 92"
                    stroke="#d4a574"
                    strokeWidth="0.8"
                    fill="none"
                    opacity="0.4"
                  />

                  {/* Name badge on coat - more detailed */}
                  <rect
                    x="118"
                    y="148"
                    width="24"
                    height="32"
                    fill="#ffffff"
                    stroke="#3b82f6"
                    strokeWidth="1.2"
                    rx="3"
                  />
                  <rect x="120" y="150" width="20" height="10" fill="#3b82f6" />
                  <text
                    x="130"
                    y="158"
                    fontSize="5"
                    fill="#ffffff"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    MD
                  </text>
                  <circle cx="130" cy="166" r="3.5" fill="#60a5fa" />
                  <line
                    x1="122"
                    y1="172"
                    x2="138"
                    y2="172"
                    stroke="#93c5fd"
                    strokeWidth="1"
                  />
                  <line
                    x1="122"
                    y1="175"
                    x2="138"
                    y2="175"
                    stroke="#93c5fd"
                    strokeWidth="0.8"
                  />
                  <line
                    x1="122"
                    y1="177"
                    x2="135"
                    y2="177"
                    stroke="#93c5fd"
                    strokeWidth="0.6"
                  />

                  {/* Medical cross badge */}
                  <circle cx="68" cy="155" r="10" fill="#dc2626" />
                  <rect
                    x="63"
                    y="150"
                    width="10"
                    height="10"
                    fill="#ffffff"
                    rx="1"
                  />
                  <rect
                    x="66"
                    y="147"
                    width="4"
                    height="16"
                    fill="#ffffff"
                    rx="0.5"
                  />
                </svg>

                {/* Left Hand */}
                <motion.div
                  className="absolute top-24 -left-8 w-16 h-20"
                  animate={
                    isAnalyzing
                      ? {
                          rotate: [0, -8, 8, -4, 0],
                          y: [0, -2, 2, -1, 0],
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
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 50 80"
                    fill="none"
                  >
                    {/* Sleeve cuff */}
                    <ellipse
                      cx="25"
                      cy="8"
                      rx="15"
                      ry="6"
                      fill="#ffffff"
                      stroke="#d1d5db"
                      strokeWidth="1.5"
                    />

                    {/* Arm */}
                    <rect
                      x="16"
                      y="8"
                      width="18"
                      height="35"
                      fill="#ffffff"
                      stroke="#d1d5db"
                      strokeWidth="1.5"
                    />

                    {/* Wrist transition */}
                    <ellipse cx="25" cy="43" rx="11" ry="8" fill="#f0c6a0" />

                    {/* Palm base */}
                    <ellipse cx="25" cy="56" rx="13" ry="11" fill="#f0c6a0" />
                    <ellipse
                      cx="25"
                      cy="56"
                      rx="11"
                      ry="9"
                      fill="#e8b896"
                      opacity="0.3"
                    />

                    {/* Thumb */}
                    <path
                      d="M 12 48 Q 6 52 6 62 Q 6 66 9 66"
                      stroke="#f0c6a0"
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <ellipse
                      cx="8"
                      cy="64"
                      rx="3.5"
                      ry="4"
                      fill="#e8b896"
                      opacity="0.3"
                    />

                    {/* Index finger */}
                    <rect
                      x="13"
                      y="56"
                      width="7"
                      height="20"
                      fill="#f0c6a0"
                      rx="3.5"
                    />
                    <ellipse
                      cx="16.5"
                      cy="75"
                      rx="3.5"
                      ry="4"
                      fill="#e8b896"
                      opacity="0.3"
                    />

                    {/* Middle finger (tallest) */}
                    <rect
                      x="21"
                      y="53"
                      width="7"
                      height="24"
                      fill="#f0c6a0"
                      rx="3.5"
                    />
                    <ellipse
                      cx="24.5"
                      cy="76"
                      rx="3.5"
                      ry="4"
                      fill="#e8b896"
                      opacity="0.3"
                    />

                    {/* Ring finger */}
                    <rect
                      x="29"
                      y="55"
                      width="7"
                      height="21"
                      fill="#f0c6a0"
                      rx="3.5"
                    />
                    <ellipse
                      cx="32.5"
                      cy="75"
                      rx="3.5"
                      ry="4"
                      fill="#e8b896"
                      opacity="0.3"
                    />

                    {/* Pinky finger */}
                    <rect
                      x="37"
                      y="58"
                      width="6"
                      height="17"
                      fill="#f0c6a0"
                      rx="3"
                    />
                    <ellipse
                      cx="40"
                      cy="74"
                      rx="3"
                      ry="3.5"
                      fill="#e8b896"
                      opacity="0.3"
                    />

                    {/* Finger joints/creases */}
                    <line
                      x1="13"
                      y1="66"
                      x2="20"
                      y2="66"
                      stroke="#d4a574"
                      strokeWidth="0.6"
                      opacity="0.5"
                    />
                    <line
                      x1="21"
                      y1="64"
                      x2="28"
                      y2="64"
                      stroke="#d4a574"
                      strokeWidth="0.6"
                      opacity="0.5"
                    />
                    <line
                      x1="29"
                      y1="65"
                      x2="36"
                      y2="65"
                      stroke="#d4a574"
                      strokeWidth="0.6"
                      opacity="0.5"
                    />
                    <line
                      x1="37"
                      y1="67"
                      x2="43"
                      y2="67"
                      stroke="#d4a574"
                      strokeWidth="0.6"
                      opacity="0.5"
                    />

                    {/* Knuckle details */}
                    <circle
                      cx="16.5"
                      cy="56"
                      r="1.5"
                      fill="#d4a574"
                      opacity="0.2"
                    />
                    <circle
                      cx="24.5"
                      cy="53"
                      r="1.5"
                      fill="#d4a574"
                      opacity="0.2"
                    />
                    <circle
                      cx="32.5"
                      cy="55"
                      r="1.5"
                      fill="#d4a574"
                      opacity="0.2"
                    />
                    <circle
                      cx="40"
                      cy="58"
                      r="1.2"
                      fill="#d4a574"
                      opacity="0.2"
                    />
                  </svg>
                </motion.div>

                {/* Right Hand */}
                <motion.div
                  className="absolute top-24 -right-8 w-16 h-20"
                  animate={
                    isAnalyzing
                      ? {
                          rotate: [0, 8, -8, 4, 0],
                          y: [0, -2, 2, -1, 0],
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
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 50 80"
                    fill="none"
                  >
                    {/* Sleeve cuff */}
                    <ellipse
                      cx="25"
                      cy="8"
                      rx="15"
                      ry="6"
                      fill="#ffffff"
                      stroke="#d1d5db"
                      strokeWidth="1.5"
                    />

                    {/* Arm */}
                    <rect
                      x="16"
                      y="8"
                      width="18"
                      height="35"
                      fill="#ffffff"
                      stroke="#d1d5db"
                      strokeWidth="1.5"
                    />

                    {/* Wrist transition */}
                    <ellipse cx="25" cy="43" rx="11" ry="8" fill="#f0c6a0" />

                    {/* Palm base */}
                    <ellipse cx="25" cy="56" rx="13" ry="11" fill="#f0c6a0" />
                    <ellipse
                      cx="25"
                      cy="56"
                      rx="11"
                      ry="9"
                      fill="#e8b896"
                      opacity="0.3"
                    />

                    {/* Thumb */}
                    <path
                      d="M 38 48 Q 44 52 44 62 Q 44 66 41 66"
                      stroke="#f0c6a0"
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <ellipse
                      cx="42"
                      cy="64"
                      rx="3.5"
                      ry="4"
                      fill="#e8b896"
                      opacity="0.3"
                    />

                    {/* Pinky finger */}
                    <rect
                      x="7"
                      y="58"
                      width="6"
                      height="17"
                      fill="#f0c6a0"
                      rx="3"
                    />
                    <ellipse
                      cx="10"
                      cy="74"
                      rx="3"
                      ry="3.5"
                      fill="#e8b896"
                      opacity="0.3"
                    />

                    {/* Ring finger */}
                    <rect
                      x="14"
                      y="55"
                      width="7"
                      height="21"
                      fill="#f0c6a0"
                      rx="3.5"
                    />
                    <ellipse
                      cx="17.5"
                      cy="75"
                      rx="3.5"
                      ry="4"
                      fill="#e8b896"
                      opacity="0.3"
                    />

                    {/* Middle finger (tallest) */}
                    <rect
                      x="22"
                      y="53"
                      width="7"
                      height="24"
                      fill="#f0c6a0"
                      rx="3.5"
                    />
                    <ellipse
                      cx="25.5"
                      cy="76"
                      rx="3.5"
                      ry="4"
                      fill="#e8b896"
                      opacity="0.3"
                    />

                    {/* Index finger */}
                    <rect
                      x="30"
                      y="56"
                      width="7"
                      height="20"
                      fill="#f0c6a0"
                      rx="3.5"
                    />
                    <ellipse
                      cx="33.5"
                      cy="75"
                      rx="3.5"
                      ry="4"
                      fill="#e8b896"
                      opacity="0.3"
                    />

                    {/* Finger joints/creases */}
                    <line
                      x1="7"
                      y1="67"
                      x2="13"
                      y2="67"
                      stroke="#d4a574"
                      strokeWidth="0.6"
                      opacity="0.5"
                    />
                    <line
                      x1="14"
                      y1="65"
                      x2="21"
                      y2="65"
                      stroke="#d4a574"
                      strokeWidth="0.6"
                      opacity="0.5"
                    />
                    <line
                      x1="22"
                      y1="64"
                      x2="29"
                      y2="64"
                      stroke="#d4a574"
                      strokeWidth="0.6"
                      opacity="0.5"
                    />
                    <line
                      x1="30"
                      y1="66"
                      x2="37"
                      y2="66"
                      stroke="#d4a574"
                      strokeWidth="0.6"
                      opacity="0.5"
                    />

                    {/* Knuckle details */}
                    <circle
                      cx="10"
                      cy="58"
                      r="1.2"
                      fill="#d4a574"
                      opacity="0.2"
                    />
                    <circle
                      cx="17.5"
                      cy="55"
                      r="1.5"
                      fill="#d4a574"
                      opacity="0.2"
                    />
                    <circle
                      cx="25.5"
                      cy="53"
                      r="1.5"
                      fill="#d4a574"
                      opacity="0.2"
                    />
                    <circle
                      cx="33.5"
                      cy="56"
                      r="1.5"
                      fill="#d4a574"
                      opacity="0.2"
                    />
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
                      style={{
                        clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                      }}
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
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Analyzing...
                    </p>
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
                      <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
                        Health Report
                      </h2>
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
                    <p
                      className={`text-2xl font-bold ${healthStatus.color} mb-2`}
                    >
                      {healthStatus.statusLabel}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Overall Health Status
                    </p>
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
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        Good Health
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        All metrics nominal
                      </p>
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
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {metric.label}
                      </p>
                      <motion.div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            metric.status === "excellent" ||
                            metric.status === "healthy"
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
                      <span className="text-3xl font-bold text-slate-900 dark:text-white">
                        {metric.value}
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-500">
                        {metric.unit}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 capitalize font-medium">
                      {metric.status}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="bg-white dark:bg-slate-800 p-8 md:p-12 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  Health Trends
                </h3>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                  {/* Heart Rate Trend */}
                  <motion.div
                    className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                      Heart Rate Trend (Hourly - Today)
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                      Last 12 hours of data
                    </p>
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={chartData.heartRate}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(100, 116, 139, 0.2)"
                        />
                        <XAxis
                          dataKey="time"
                          tick={{
                            fill: "rgba(100, 116, 139, 0.7)",
                            fontSize: 11,
                          }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          label={{
                            value: "Time (24-hour format)",
                            position: "insideBottom",
                            offset: -10,
                            style: { 
                              fill: "rgba(100, 116, 139, 0.7)",
                              fontSize: 11,
                            },
                          }}
                        />
                        <YAxis
                          tick={{
                            fill: "rgba(100, 116, 139, 0.7)",
                            fontSize: 12,
                          }}
                          domain={[50, 100]}
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
                          formatter={(value: number | string) => [
                            `${Math.round(Number(value))} bpm`,
                            "Heart Rate",
                          ]}
                          labelFormatter={(label) => `Time: ${label}`}
                          labelStyle={{ color: "rgba(255, 255, 255, 0.8)" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="rate"
                          stroke="#06b6d4"
                          strokeWidth={3}
                          dot={{ fill: "#06b6d4", r: 4 }}
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
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                      Blood Pressure Trend (Daily - Last 7 Days)
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                      Morning measurements (9:00 AM)
                    </p>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={chartData.bloodPressure}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(100, 116, 139, 0.2)"
                        />
                        <XAxis
                          dataKey="time"
                          tick={{
                            fill: "rgba(100, 116, 139, 0.7)",
                            fontSize: 10,
                          }}
                          interval={0}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis
                          tick={{
                            fill: "rgba(100, 116, 139, 0.7)",
                            fontSize: 12,
                          }}
                          domain={[60, 140]}
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
                          formatter={(value: number | string, name: string) => [
                            `${Math.round(Number(value))} mmHg`,
                            name === "systolic" ? "Systolic" : "Diastolic",
                          ]}
                          labelStyle={{ color: "rgba(255, 255, 255, 0.8)" }}
                        />
                        <Bar
                          dataKey="systolic"
                          fill="#06b6d4"
                          radius={[10, 10, 0, 0]}
                          name="systolic"
                        />
                        <Bar
                          dataKey="diastolic"
                          fill="#3b82f6"
                          radius={[10, 10, 0, 0]}
                          name="diastolic"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                </div>
              </div>

              {/* Health Recommendations Section */}
              <div className="bg-white dark:bg-slate-800 p-8 md:p-12 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  Personalized Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {healthStatus.recommendations.map((recommendation, index) => (
                    <motion.div
                      key={index}
                      className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 border border-slate-200 dark:border-slate-600 shadow-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {index + 1}
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          {recommendation}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Health Score Summary */}
                <motion.div
                  className="mt-8 p-8 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-2 border-cyan-200 dark:border-cyan-800"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        Overall Health Score
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400">
                        Based on comprehensive vital signs analysis
                      </p>
                    </div>
                    <motion.div
                      className="relative w-32 h-32"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                    >
                      <svg
                        className="w-full h-full transform -rotate-90"
                        viewBox="0 0 120 120"
                      >
                        <circle
                          cx="60"
                          cy="60"
                          r="54"
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth="8"
                        />
                        <motion.circle
                          cx="60"
                          cy="60"
                          r="54"
                          fill="none"
                          stroke={healthStatus.accentColor}
                          strokeWidth="8"
                          strokeLinecap="round"
                          initial={{ strokeDasharray: "0 339.292" }}
                          animate={{ strokeDasharray: "296.17 339.292" }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <span
                            className={`text-3xl font-bold ${healthStatus.color}`}
                          >
                            92
                          </span>
                          <span className="text-sm text-slate-600 dark:text-slate-400 block">
                            / 100
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Report footer */}
              <div className="bg-white dark:bg-slate-800 rounded-b-3xl p-8 md:p-12 shadow-2xl flex flex-col sm:flex-row gap-4 justify-end border-t border-slate-200 dark:border-slate-700">
                <motion.button
                  onClick={() => {
                    setShowReport(false);
                    setAvatarVisible(true);
                    setAnalysisProgress(0);
                    setClickTime(null);
                  }}
                  className="px-8 py-4 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
                <motion.button
                  onClick={() => {
                    setShowReport(false);
                    setAvatarVisible(true);
                    setAnalysisProgress(0);
                    setClickTime(null);
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
  );
}
