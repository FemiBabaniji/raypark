"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { User, FileText, ImageIcon, Briefcase, Mail, Calendar, Star, Settings } from "lucide-react"

interface Widget {
  id: number
  type: "profile" | "about" | "projects" | "contact" | "skills" | "experience" | "testimonials" | "settings"
  x: number
  y: number
  vx: number
  vy: number
  targetX?: number
  targetY?: number
  isForming: boolean
  formDelay: number
}

const widgetTypes = [
  { type: "profile" as const, icon: User, color: "from-pink-400 to-purple-500" },
  { type: "about" as const, icon: FileText, color: "from-blue-400 to-cyan-500" },
  { type: "projects" as const, icon: Briefcase, color: "from-green-400 to-emerald-500" },
  { type: "contact" as const, icon: Mail, color: "from-orange-400 to-red-500" },
  { type: "skills" as const, icon: Star, color: "from-yellow-400 to-orange-500" },
  { type: "experience" as const, icon: Calendar, color: "from-indigo-400 to-purple-500" },
  { type: "testimonials" as const, icon: ImageIcon, color: "from-teal-400 to-blue-500" },
  { type: "settings" as const, icon: Settings, color: "from-gray-400 to-slate-500" },
]

export default function NetworkAnimation() {
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [dimensions] = useState({ width: 800, height: 600 })
  const [phase, setPhase] = useState<"floating" | "forming" | "formed">("floating")

  useEffect(() => {
    // Initialize widgets with random positions
    const initialWidgets: Widget[] = widgetTypes.map((widgetType, i) => ({
      id: i,
      type: widgetType.type,
      x: Math.random() * (dimensions.width - 100) + 50,
      y: Math.random() * (dimensions.height - 100) + 50,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
      isForming: false,
      formDelay: i * 200,
    }))

    setWidgets(initialWidgets)

    // Start the formation sequence after 2 seconds
    const formationTimer = setTimeout(() => {
      setPhase("forming")

      // Calculate grid positions for portfolio layout
      const gridCols = 3
      const gridRows = Math.ceil(widgetTypes.length / gridCols)
      const cellWidth = (dimensions.width - 200) / gridCols
      const cellHeight = (dimensions.height - 200) / gridRows
      const startX = 100
      const startY = 100

      setWidgets((prev) =>
        prev.map((widget, i) => {
          const col = i % gridCols
          const row = Math.floor(i / gridCols)
          return {
            ...widget,
            targetX: startX + col * cellWidth + cellWidth / 2,
            targetY: startY + row * cellHeight + cellHeight / 2,
            isForming: true,
          }
        }),
      )

      // Mark as formed after animation completes
      setTimeout(() => setPhase("formed"), 3000)
    }, 2000)

    return () => clearTimeout(formationTimer)
  }, [dimensions])

  useEffect(() => {
    if (phase === "floating") {
      const interval = setInterval(() => {
        setWidgets((prevWidgets) =>
          prevWidgets.map((widget) => {
            let newX = widget.x + widget.vx
            let newY = widget.y + widget.vy
            let newVx = widget.vx
            let newVy = widget.vy

            // Bounce off edges
            if (newX <= 30 || newX >= dimensions.width - 30) {
              newVx = -newVx
              newX = Math.max(30, Math.min(dimensions.width - 30, newX))
            }
            if (newY <= 30 || newY >= dimensions.height - 30) {
              newVy = -newVy
              newY = Math.max(30, Math.min(dimensions.height - 30, newY))
            }

            return {
              ...widget,
              x: newX,
              y: newY,
              vx: newVx,
              vy: newVy,
            }
          }),
        )
      }, 50)

      return () => clearInterval(interval)
    }
  }, [phase, dimensions])

  const getWidgetConfig = (type: Widget["type"]) => {
    return widgetTypes.find((w) => w.type === type) || widgetTypes[0]
  }

  return (
    <div className="w-full h-full relative overflow-hidden">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="absolute inset-0"
      >
        {/* Connection lines during formation */}
        {phase === "forming" &&
          widgets.map((widget, i) => {
            if (i === 0 || !widget.targetX || !widget.targetY) return null
            const prevWidget = widgets[i - 1]
            if (!prevWidget.targetX || !prevWidget.targetY) return null

            return (
              <motion.line
                key={`connection-${i}`}
                x1={prevWidget.targetX}
                y1={prevWidget.targetY}
                x2={widget.targetX}
                y2={widget.targetY}
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.4 }}
                transition={{ duration: 1, delay: widget.formDelay / 1000 + 0.5 }}
              />
            )
          })}

        {/* Render widgets */}
        {widgets.map((widget) => {
          const config = getWidgetConfig(widget.type)
          const IconComponent = config.icon

          return (
            <motion.g key={widget.id}>
              {/* Widget container */}
              <motion.rect
                x={widget.x - 25}
                y={widget.y - 25}
                width="50"
                height="50"
                rx="12"
                fill="url(#gradient-bg)"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="1"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 0.9,
                  x: widget.isForming && widget.targetX ? widget.targetX - 25 : widget.x - 25,
                  y: widget.isForming && widget.targetY ? widget.targetY - 25 : widget.y - 25,
                }}
                transition={{
                  duration: widget.isForming ? 1.5 : 0.5,
                  delay: widget.isForming ? widget.formDelay / 1000 : 0,
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                }}
              />

              {/* Widget icon */}
              <motion.foreignObject
                x={widget.x - 12}
                y={widget.y - 12}
                width="24"
                height="24"
                initial={{ scale: 0 }}
                animate={{
                  scale: 1,
                  x: widget.isForming && widget.targetX ? widget.targetX - 12 : widget.x - 12,
                  y: widget.isForming && widget.targetY ? widget.targetY - 12 : widget.y - 12,
                }}
                transition={{
                  duration: widget.isForming ? 1.5 : 0.5,
                  delay: widget.isForming ? widget.formDelay / 1000 + 0.2 : 0.2,
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                }}
              >
                <IconComponent className="w-6 h-6 text-white drop-shadow-lg" />
              </motion.foreignObject>

              {/* Glow effect */}
              <motion.circle
                cx={widget.x}
                cy={widget.y}
                r="35"
                fill="rgba(255, 255, 255, 0.05)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.1, 0.3],
                  cx: widget.isForming && widget.targetX ? widget.targetX : widget.x,
                  cy: widget.isForming && widget.targetY ? widget.targetY : widget.y,
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: widget.formDelay / 1000,
                }}
              />
            </motion.g>
          )
        })}

        {/* Gradient definitions */}
        <defs>
          <radialGradient id="gradient-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.3)" />
            <stop offset="100%" stopColor="rgba(219, 39, 119, 0.3)" />
          </radialGradient>
        </defs>

        {/* Floating particles */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.circle
            key={`particle-${i}`}
            r="2"
            fill="rgba(255, 255, 255, 0.3)"
            initial={{
              cx: Math.random() * dimensions.width,
              cy: Math.random() * dimensions.height,
              opacity: 0,
            }}
            animate={{
              cx: Math.random() * dimensions.width,
              cy: Math.random() * dimensions.height,
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.8,
              ease: "linear",
            }}
          />
        ))}
      </svg>

      {/* Text overlay during formation */}
      {phase === "forming" && (
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <p className="text-white/70 text-sm text-center">Building your portfolio...</p>
        </motion.div>
      )}
    </div>
  )
}
