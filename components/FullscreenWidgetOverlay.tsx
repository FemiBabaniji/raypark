"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import type { PropsWithChildren } from "react"

export default function FullscreenWidgetOverlay({
  open,
  onClose,
  layoutId,
  title,
  children,
}: PropsWithChildren<{
  open: boolean
  onClose: () => void
  layoutId: string
  title?: string
}>) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/60"
            onClick={onClose}
          />

          <motion.div
            key="panel"
            layoutId={layoutId}
            className="
              fixed inset-x-0 top-6 bottom-6 z-[100]
              flex justify-center px-4 sm:px-6
            "
          >
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className="
                relative w-full max-w-5xl
                bg-gradient-to-br from-neutral-900/90 to-neutral-800/90
                backdrop-blur-xl border border-white/10 rounded-3xl
                shadow-2xl overflow-hidden
              "
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10">
                <h3 className="text-white text-lg sm:text-xl font-semibold">{title}</h3>
                <button onClick={onClose} className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 sm:p-6 overflow-auto max-h-[calc(100vh-6rem)]">{children}</div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
