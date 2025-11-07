"use client"

import type React from "react"
import { motion, AnimatePresence, useDragControls } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { Sparkles, Heart, Star } from "lucide-react"

export function DraggableChildAvatar() {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [currentThought, setCurrentThought] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])
  const [isBlinking, setIsBlinking] = useState(false)
  const avatarRef = useRef<HTMLDivElement>(null)
  const dragControls = useDragControls()

  const thoughtBubbles = [
    "Let's play together! 🎮",
    "I love making new friends! 👫",
    "Learning is so much fun! 📚",
    "What adventure shall we go on? 🚀",
  ]

  const expressions = {
    normal: { eyeScale: 1, mouthY: 0, eyebrowY: 0, mouthWidth: 10, mouthHeight: 5 },
    happy: { eyeScale: 0.8, mouthY: -2, eyebrowY: -2, mouthWidth: 14, mouthHeight: 7 },
    excited: { eyeScale: 1.2, mouthY: -4, eyebrowY: -4, mouthWidth: 16, mouthHeight: 8 },
    thinking: { eyeScale: 0.9, mouthY: 2, eyebrowY: 1, mouthWidth: 9, mouthHeight: 4 },
    dragging: { eyeScale: 1.1, mouthY: -1, eyebrowY: -1, mouthWidth: 12, mouthHeight: 6 },
  }

  const currentExpression = isDragging
    ? expressions.dragging
    : isClicked
      ? expressions.excited
      : isHovered
        ? expressions.happy
        : expressions.thinking

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentThought((prev) => (prev + 1) % thoughtBubbles.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [thoughtBubbles.length])

  // Add random blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(
      () => {
        if (!isDragging && !isClicked) {
          setIsBlinking(true)
          setTimeout(() => setIsBlinking(false), 150)
        }
      },
      Math.random() * 3000 + 2000,
    )

    return () => clearInterval(blinkInterval)
  }, [isDragging, isClicked])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (avatarRef.current && !isDragging) {
      const rect = avatarRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      setMousePosition({
        x: (e.clientX - centerX) / 10,
        y: (e.clientY - centerY) / 10,
      })
    }
  }

  const handleClick = () => {
    setIsClicked(true)

    // Create celebration particles
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 300 - 150,
      y: Math.random() * 300 - 150,
    }))
    setParticles(newParticles)

    setTimeout(() => {
      setIsClicked(false)
      setParticles([])
    }, 2000)
  }

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Celebration Particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute pointer-events-none z-50"
            initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
            animate={{
              opacity: [1, 1, 0],
              scale: [0, 1.5, 0.5],
              x: particle.x,
              y: particle.y,
              rotate: [0, 720],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
          >
            {Math.random() > 0.66 ? (
              <Star className="w-6 h-6 text-purple-400" />
            ) : Math.random() > 0.33 ? (
              <Heart className="w-6 h-6 text-pink-400" />
            ) : (
              <Sparkles className="w-6 h-6 text-teal-400" />
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Draggable Avatar */}
      <motion.div
        ref={avatarRef}
        className="relative z-10 cursor-grab active:cursor-grabbing"
        drag
        dragControls={dragControls}
        dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
        dragElastic={0.1}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        animate={{
          y: isDragging ? 0 : [0, -10, 0],
          rotate: isDragging ? mousePosition.x * 0.2 : mousePosition.x * 0.1,
          scale: isClicked ? 1.15 : isHovered || isDragging ? 1.05 : 1,
        }}
        transition={{
          y: {
            duration: 4,
            repeat: isDragging ? 0 : Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
          rotate: { duration: 0.3 },
          scale: { duration: 0.3 },
        }}
        whileDrag={{ scale: 1.1, rotate: 5 }}
      >
        {/* Drag Trail Effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/30 to-teal-400/30 blur-xl"
          animate={{
            scale: isDragging ? 1.5 : isHovered ? 1.2 : 1,
            opacity: isDragging ? 1 : isHovered ? 0.8 : 0.4,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Avatar Body - Enhanced with clothing */}
        <motion.div
          className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-orange-200 to-orange-300 dark:from-orange-300 dark:to-orange-400 relative overflow-hidden shadow-2xl"
          animate={{
            boxShadow: isDragging
              ? "0 25px 50px rgba(0,0,0,0.4), 0 0 30px rgba(147, 51, 234, 0.5)"
              : isHovered
                ? "0 20px 40px rgba(0,0,0,0.3), 0 0 20px rgba(147, 51, 234, 0.3)"
                : "0 10px 20px rgba(0,0,0,0.2)",
          }}
        >
          {/* Face - Enhanced with better proportions */}
          <motion.div
            className="absolute inset-4 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-200 dark:to-yellow-300"
            animate={{
              x: isDragging ? 0 : mousePosition.x * 0.5,
              y: isDragging ? 0 : mousePosition.y * 0.5,
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Left Eye - Enhanced with eyelids, iris, and blinking */}
            <motion.div
              className="absolute top-7 left-7 w-8 h-8 rounded-full bg-white overflow-hidden flex items-center justify-center"
              animate={{
                scaleY: isBlinking ? 0.1 : currentExpression.eyeScale,
                x: isDragging ? 0 : mousePosition.x * 0.2,
                y: isDragging ? 0 : mousePosition.y * 0.2,
              }}
              transition={{ duration: isBlinking ? 0.1 : 0.3 }}
            >
              {/* Iris */}
              <motion.div
                className="w-7 h-7 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full flex items-center justify-center"
                animate={{
                  x: mousePosition.x * 0.5,
                  y: mousePosition.y * 0.5,
                }}
              >
                {/* Pupil */}
                <motion.div
                  className="w-4 h-4 bg-gray-900 rounded-full flex items-center justify-center"
                  animate={{
                    scale: isClicked ? 1.2 : isHovered ? 0.9 : 1,
                  }}
                >
                  {/* Eye highlight */}
                  <div className="absolute top-0.5 left-0.5 w-2 h-2 bg-white rounded-full opacity-80"></div>
                </motion.div>
              </motion.div>

              {/* Eye reflection */}
              <div className="absolute top-0 right-0.5 w-2 h-2 bg-white rounded-full opacity-60"></div>
            </motion.div>

            {/* Right Eye - Enhanced with eyelids, iris, and blinking */}
            <motion.div
              className="absolute top-7 right-7 w-8 h-8 rounded-full bg-white overflow-hidden flex items-center justify-center"
              animate={{
                scaleY: isBlinking ? 0.1 : currentExpression.eyeScale,
                x: isDragging ? 0 : mousePosition.x * 0.2,
                y: isDragging ? 0 : mousePosition.y * 0.2,
              }}
              transition={{ duration: isBlinking ? 0.1 : 0.3 }}
            >
              {/* Iris */}
              <motion.div
                className="w-7 h-7 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full flex items-center justify-center"
                animate={{
                  x: mousePosition.x * 0.5,
                  y: mousePosition.y * 0.5,
                }}
              >
                {/* Pupil */}
                <motion.div
                  className="w-4 h-4 bg-gray-900 rounded-full flex items-center justify-center"
                  animate={{
                    scale: isClicked ? 1.2 : isHovered ? 0.9 : 1,
                  }}
                >
                  {/* Eye highlight */}
                  <div className="absolute top-0.5 left-0.5 w-2 h-2 bg-white rounded-full opacity-80"></div>
                </motion.div>
              </motion.div>

              {/* Eye reflection */}
              <div className="absolute top-0 right-0.5 w-2 h-2 bg-white rounded-full opacity-60"></div>
            </motion.div>

            {/* Eyebrows - Enhanced shape */}
            <motion.div
              className="absolute top-4 left-6 w-8 h-2 bg-gray-600 rounded-full"
              animate={{
                y: currentExpression.eyebrowY,
                rotate: isHovered || isDragging ? -5 : 0,
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="absolute top-4 right-6 w-8 h-2 bg-gray-600 rounded-full"
              animate={{
                y: currentExpression.eyebrowY,
                rotate: isHovered || isDragging ? 5 : 0,
              }}
              transition={{ duration: 0.3 }}
            />

            {/* Nose - Slightly improved */}
            <motion.div
              className="absolute top-12 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-gradient-to-b from-gray-600 to-gray-500 rounded-full"
              animate={{
                scaleX: isHovered || isDragging ? 1.2 : 1,
              }}
              transition={{ duration: 0.3 }}
            />

            {/* Mouth - Enhanced with more expressions */}
            <motion.div
              className="absolute bottom-7 left-1/2 transform -translate-x-1/2"
              animate={{
                y: currentExpression.mouthY,
              }}
              transition={{ duration: 0.3 }}
            >
              {isClicked ? (
                // Big smile with teeth when clicked
                <div className="relative">
                  <motion.div
                    className="w-16 h-8 bg-white border-2 border-gray-600 rounded-b-full overflow-hidden"
                    animate={{
                      width: 16,
                      height: 9,
                      rotate: [0, -2, 2, 0],
                    }}
                    transition={{
                      rotate: {
                        repeat: 3,
                        duration: 0.2,
                      },
                    }}
                  >
                    {/* Teeth */}
                    <div className="flex justify-center gap-0.5 pt-1">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="w-1.5 h-2.5 bg-white border border-gray-200 rounded-b-sm"></div>
                      ))}
                    </div>
                    {/* Tongue */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-pink-400 rounded-t-full"></div>
                  </motion.div>
                </div>
              ) : isHovered ? (
                // Bigger smile when hovered
                <motion.div
                  className="relative w-14 h-7"
                  animate={{
                    width: currentExpression.mouthWidth,
                    height: currentExpression.mouthHeight,
                  }}
                >
                  <div className="absolute inset-0 border-2 border-gray-600 rounded-b-full border-t-0"></div>
                  {/* Subtle teeth showing when smiling */}
                  <div className="absolute top-0 left-2 right-2 h-1.5 bg-white"></div>
                </motion.div>
              ) : isDragging ? (
                // Open mouth when dragging
                <motion.div
                  className="relative w-12 h-7 border-2 border-gray-600 rounded-full overflow-hidden"
                  animate={{ rotate: [-2, 2, -2] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.5 }}
                >
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-7 h-3 bg-pink-400 rounded-t-full"></div>
                </motion.div>
              ) : (
                // Default expression - more dynamic
                <motion.div
                  className="w-10 h-5 border-2 border-gray-600 rounded-b-full border-t-0"
                  animate={{
                    width: currentExpression.mouthWidth,
                    height: currentExpression.mouthHeight,
                    scaleX: [1, 1.05, 1],
                    scaleY: [1, 0.95, 1],
                  }}
                  transition={{
                    scaleX: { repeat: Number.POSITIVE_INFINITY, duration: 3 },
                    scaleY: { repeat: Number.POSITIVE_INFINITY, duration: 2.5 },
                  }}
                />
              )}
            </motion.div>

            {/* Cheeks (appear when happy or dragging) */}
            <AnimatePresence>
              {(isHovered || isClicked || isDragging) && (
                <>
                  <motion.div
                    className="absolute top-14 left-4 w-3 h-3 bg-pink-300 rounded-full opacity-60"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.6 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div
                    className="absolute top-14 right-4 w-3 h-3 bg-pink-300 rounded-full opacity-60"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.6 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Hair - Enhanced with more detail */}
          <motion.div
            className="absolute -top-2 left-4 right-4 h-10 bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-500 dark:to-amber-600"
            animate={{
              y: isDragging ? 0 : mousePosition.y * 0.1,
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Hair details */}
            <div className="absolute inset-x-3 top-1 h-4 flex justify-between">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-4 bg-amber-800 dark:bg-amber-700 rounded-full"
                  animate={{
                    y: [0, -1, 0],
                    scaleY: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Interactive Hand */}
        <motion.div
          className="absolute -bottom-4 -right-4 w-12 h-12 bg-gradient-to-br from-orange-200 to-orange-300 dark:from-orange-300 dark:to-orange-400 rounded-full shadow-lg flex items-center justify-center overflow-hidden"
          animate={{
            rotate: isDragging ? [0, 20, -20, 0] : isHovered ? [0, 10, -10, 0] : [0, 5, -5, 0],
            scale: isClicked ? 1.3 : isDragging ? 1.1 : 1,
          }}
          transition={{
            rotate: {
              duration: isDragging ? 1 : 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            },
            scale: { duration: 0.3 },
          }}
        >
          {/* Finger details */}
          <div className="w-8 h-8 bg-orange-200 dark:bg-orange-300 rounded-full relative">
            <div className="absolute top-1 left-1 w-1.5 h-3 bg-orange-300 dark:bg-orange-400 rounded-full"></div>
            <div className="absolute top-1 left-3 w-1.5 h-4 bg-orange-300 dark:bg-orange-400 rounded-full"></div>
            <div className="absolute top-1 right-3 w-1.5 h-4 bg-orange-300 dark:bg-orange-400 rounded-full"></div>
            <div className="absolute top-1 right-1 w-1.5 h-3 bg-orange-300 dark:bg-orange-400 rounded-full"></div>
          </div>
        </motion.div>

        {/* Child-friendly accessory - Small hat */}
        <motion.div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-24 h-10"
          animate={{
            rotate: isDragging ? [-2, 2, -2] : [0, -1, 0],
            y: isDragging ? 1 : [0, -1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <div className="w-20 h-5 bg-gradient-to-r from-purple-400 to-purple-500 rounded-t-xl mx-auto"></div>
          <div className="w-24 h-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-md"></div>
        </motion.div>
      </motion.div>

      {/* Interactive Thought Bubbles */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentThought}
          className="absolute -top-8 -right-8 max-w-xs cursor-pointer"
          initial={{ opacity: 0, scale: 0, x: 20, y: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0, x: -20, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          whileHover={{ scale: 1.05, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentThought((prev) => (prev + 1) % thoughtBubbles.length)}
        >
          {/* Main thought bubble - Enhanced with more child-friendly style */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl border-2 border-gray-200 dark:border-gray-600 relative"
            animate={{
              y: isDragging ? [0, -8, 0] : [0, -5, 0],
            }}
            transition={{
              duration: isDragging ? 2 : 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 text-center">
              {thoughtBubbles[currentThought]}
            </p>

            {/* Bubble tail */}
            <div className="absolute -bottom-3 left-8 w-6 h-6 bg-white dark:bg-gray-800 border-r-2 border-b-2 border-gray-200 dark:border-gray-600 transform rotate-45"></div>
          </motion.div>

          {/* Animated bubble trail */}
          <motion.div
            className="absolute -bottom-6 left-4 w-4 h-4 bg-white dark:bg-gray-800 rounded-full shadow-md border-2 border-gray-200 dark:border-gray-600"
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              delay: 0.2,
            }}
          />
          <motion.div
            className="absolute -bottom-4 left-2 w-3 h-3 bg-white dark:bg-gray-800 rounded-full shadow-md border-2 border-gray-200 dark:border-gray-600"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              delay: 0.4,
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Interaction hints */}
      <motion.div
        className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered || isDragging ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">{"Drag me around for fun! 🎉"}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">{"Click me for a surprise!"}</p>
      </motion.div>
    </div>
  )
}
