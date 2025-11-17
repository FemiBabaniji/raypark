"use client"

import Link from "next/link"
import { useRouter } from 'next/navigation'
import { motion } from "framer-motion"
import { UnifiedPortfolioCard } from "@/components/unified-portfolio-card"
import { BackButton } from "@/components/ui/back-button"
import { colors, typography, spacing, components } from "@/lib/design-system"

export default function MembersPage({
  title = "Community Members",
  members = [],
  onBack,
  showInvite = true,
}: {
  title?: string
  members?: any[]
  onBack?: () => void
  showInvite?: boolean
}) {
  const router = useRouter()

  return (
    <div className="min-h-screen overflow-hidden" style={{ backgroundColor: colors.background.primary }}>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between"
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0, 1] }}
      >
        <div className="flex items-center space-x-4">
          <BackButton
            onClick={onBack || (() => router.back())}
            style={{ color: colors.foreground.secondary }}
          />

          <div className="flex items-center space-x-3">
            <div 
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${colors.accent.blue}, ${colors.accent.purple})`,
              }}
            >
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
            <span 
              className="text-sm font-medium"
              style={{ color: colors.foreground.secondary }}
            >
              pathwai
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <button style={{ color: colors.foreground.tertiary, fontSize: typography.bodySmall.size }}>
            ai
          </button>
          <Link 
            href="/network" 
            className="font-medium"
            style={{ 
              color: colors.foreground.primary,
              fontSize: typography.bodySmall.size 
            }}
          >
            network
          </Link>
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.background.secondary }}
          >
            <span style={{ fontSize: typography.caption.size }}>U</span>
          </div>
        </div>
      </motion.nav>

      <div className="pt-20">
        <div className="flex gap-4 p-4 lg:gap-6 lg:p-6 xl:gap-8 xl:p-8 2xl:gap-12 2xl:p-12">
          <motion.div
            className="flex-1 lg:pr-80 xl:pr-96 2xl:pr-[28rem]"
            animate={{ x: "0rem", scale: 1 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                {members.map((member) => (
                  <div key={member.id} className="w-full">
                    <UnifiedPortfolioCard
                      portfolio={member}
                      onClick={() => console.log("open portfolio:", member.id)}
                      onShare={() => console.log("share portfolio:", member.id)}
                      onMore={() => console.log("more options:", member.id)}
                    />
                  </div>
                ))}

                {showInvite && (
                  <div 
                    className="w-full aspect-[4/5] rounded-3xl border-2 border-dashed hover:scale-105 transition-all cursor-pointer flex flex-col items-center justify-center group backdrop-blur-sm"
                    style={{
                      borderColor: colors.border.default,
                    }}
                  >
                    <BackButton
                      onClick={() => console.log("invite")}
                      icon={() => <span className="text-base text-white">+</span>}
                    />
                    <span 
                      className="font-medium text-sm"
                      style={{ color: colors.foreground.secondary }}
                    >
                      Invite
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="fixed right-0 top-16 w-80 lg:w-96 2xl:w-[28rem] h-full p-4 lg:p-6 xl:p-8 2xl:p-12"
            animate={{ x: "0%" }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <div 
              className="backdrop-blur-xl rounded-3xl p-8 border sticky top-6"
              style={{
                backgroundColor: components.card.background,
                borderColor: components.card.border,
                borderRadius: components.card.borderRadius,
              }}
            >
              <h2 
                className="mb-4 text-white"
                style={{
                  fontSize: typography.h2.size,
                  fontWeight: typography.h2.weight,
                }}
              >
                {title}
              </h2>
              <p 
                className="mb-6 leading-relaxed"
                style={{
                  color: colors.foreground.secondary,
                  fontSize: typography.body.size,
                  lineHeight: typography.body.lineHeight,
                }}
              >
                Meet the talented individuals who make our work possible. Each card represents a unique professional
                with their own expertise and background.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: colors.accent.purple }}
                  />
                  <span 
                    style={{ 
                      fontSize: typography.bodySmall.size,
                      color: colors.foreground.secondary 
                    }}
                  >
                    {members.length} Active Members
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: colors.accent.blue }}
                  />
                  <span 
                    style={{ 
                      fontSize: typography.bodySmall.size,
                      color: colors.foreground.secondary 
                    }}
                  >
                    Multiple Industries
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
