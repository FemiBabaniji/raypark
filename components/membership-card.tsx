"use client"

import { motion } from "framer-motion"

interface MembershipCardProps {
  onOpenChange: (open: boolean) => void
}

export function MembershipCard({ onOpenChange }: MembershipCardProps) {
  return (
    <motion.button
      onClick={() => onOpenChange(true)}
      className="bg-gray-100 dark:bg-gray-800 py-1.5 px-3 flex items-center gap-2 text-xs cursor-pointer hover:bg-pink-100 dark:hover:bg-pink-900 transition-colors duration-300 group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-pink-500 group-hover:bg-pink-600 transition-colors duration-300"></div>
      <span>MONTHLY CLUB</span>
    </motion.button>
  )
}
