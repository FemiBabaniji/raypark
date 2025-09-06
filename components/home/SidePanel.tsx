"use client"

import { motion } from "framer-motion"
import MusicAppInterface from "@/components/music-app-interface"

const BASE_PADDING = 32

export default function SidePanel({
  isVisible,
  isPreviewMode,
}: {
  isVisible: boolean
  isPreviewMode: boolean
}) {
  return (
    <motion.div
      className="h-full"
      style={{
        paddingTop: isPreviewMode ? 0 : BASE_PADDING,
        paddingRight: BASE_PADDING,
        paddingLeft: BASE_PADDING,
        paddingBottom: BASE_PADDING,
      }}
      animate={{
        x: isVisible ? "0%" : "100%",
      }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      <MusicAppInterface />
    </motion.div>
  )
}
