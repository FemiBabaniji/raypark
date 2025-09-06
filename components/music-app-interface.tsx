"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

export default function MusicAppInterface() {
  const purpleColor = {
    bg: "from-purple-500 via-pink-500 to-purple-600",
    shadow: "shadow-purple-500/50",
    glow: "shadow-2xl",
  }

  return (
    <div className="fixed right-0 top-0 w-80 xl:w-96 h-screen bg-zinc-950 text-white pt-20 sm:pt-24 px-4 xl:px-6 pb-4 xl:pb-6 space-y-4 xl:space-y-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-6 text-center hover:scale-[1.02] transition-transform duration-300">
          {/* Purple Node Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
            className={`
              w-16 h-16 rounded-full bg-gradient-to-br ${purpleColor.bg} 
              ${purpleColor.shadow} ${purpleColor.glow}
              border-2 border-white/30 relative overflow-hidden mx-auto mb-3
            `}
          >
            {/* Inner highlight */}
            <div className="absolute inset-1 rounded-full bg-white/20" />

            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-white/90 rounded-full" />
            </div>

            {/* Holographic effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-60" />
          </motion.div>

          <h2 className="text-lg font-medium text-white mb-1">John Doe</h2>
          <p className="text-neutral-400 text-sm mb-2">Digital Product Designer</p>

          <p className="text-neutral-300 text-xs mb-3 leading-relaxed line-clamp-2">
            building the future of professional networking
          </p>

          {/* Skills as floating badges */}
          <div className="flex flex-wrap justify-center gap-1 mb-4">
            <span className="px-2 py-1 bg-white/10 text-white text-xs rounded-full">React</span>
            <span className="px-2 py-1 bg-white/10 text-white text-xs rounded-full">Design</span>
            <span className="px-2 py-1 bg-white/10 text-white text-xs rounded-full">TypeScript</span>
            <span className="px-2 py-1 bg-white/10 text-neutral-400 text-xs rounded-full">+5</span>
          </div>

          <button className="w-full py-2 px-4 bg-white/10 hover:bg-white/20 text-white text-sm rounded-xl transition-colors">
            edit profile
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 backdrop-blur-xl rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-zinc-400" />
            <span className="text-zinc-400 text-sm">Archetype</span>
          </div>

          <h3 className="text-xl font-semibold text-white mb-2">Data Innovator</h3>
          <p className="text-zinc-400 text-sm mb-6">Analytical problem solver</p>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">94%</div>
              <div className="text-zinc-400 text-xs">Technical</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">78%</div>
              <div className="text-zinc-400 text-xs">Leadership</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">85%</div>
              <div className="text-zinc-400 text-xs">Innovation</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
