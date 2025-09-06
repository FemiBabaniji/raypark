"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface DebugPanelProps {
  data?: any
  title?: string
}

export function DebugPanel({ data, title = "Debug Info" }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!data) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
      >
        🐛 {title}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-12 right-0 w-96 max-h-96 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden"
          >
            <div className="p-4 border-b border-zinc-700 flex justify-between items-center">
              <h3 className="text-white font-semibold">{title}</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                ×
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-80">
              <pre className="text-xs text-gray-300 whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
