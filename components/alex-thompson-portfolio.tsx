"use client"

import { Button } from "@/components/ui/button"
import PortfolioShell from "./portfolio/portfolio-shell"
import MeetingSchedulerWidget from "./portfolio/builder/widgets/MeetingSchedulerWidget"

export default function AlexThompsonPortfolio({ isPreviewMode = false }: { isPreviewMode?: boolean }) {
  const gradient = "from-green-500/70 to-teal-500/70"

  const ProfileWidget = () => (
    <div className={`bg-gradient-to-br ${gradient} backdrop-blur-xl rounded-3xl p-8`}>
      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-white/20 overflow-hidden">
          <img src="/professional-headshot.png" alt="Alex Thompson" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold leading-tight text-white">
          alex thompson
          <br />
          is a startup founder
          <br />
          <span className="text-white/70">building the future of fintech.</span>
        </h1>

        <div className="flex flex-wrap gap-3 pt-4">
          {["linkedin.", "twitter.", "medium."].map((social) => (
            <Button
              key={social}
              variant="outline"
              size="sm"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              {social}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )

  const EducationWidget = () => (
    <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-8">
      <h2 className="text-xl font-bold mb-6">Education</h2>

      <div className="space-y-4">
        <div className="bg-neutral-800/50 rounded-2xl p-4">
          <h3 className="font-semibold text-white">MBA</h3>
          <p className="text-neutral-300 text-sm">Harvard Business School</p>
          <p className="text-neutral-400 text-xs">2019-2021</p>
        </div>

        <div className="bg-neutral-800/50 rounded-2xl p-4">
          <h3 className="font-semibold text-white">BS Finance</h3>
          <p className="text-neutral-300 text-sm">Wharton School</p>
          <p className="text-neutral-400 text-xs">2015-2019</p>
        </div>
      </div>
    </div>
  )

  const DescriptionWidget = () => (
    <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-8">
      <div className="space-y-4">
        <h3 className="text-xl font-bold">About Me</h3>
        <p className="text-white leading-relaxed">
          Serial entrepreneur with two successful exits.{" "}
          <span className="text-neutral-400">
            Currently building a fintech platform to democratize access to investment opportunities.
          </span>
        </p>
      </div>
    </div>
  )

  const StartupWidget = () => (
    <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold">Current Venture</h2>
      </div>

      <div className="space-y-4">
        <div className="bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-2xl p-6">
          <h3 className="text-2xl font-bold text-white mb-2">InvestAI</h3>
          <p className="text-white/80 text-sm mb-4">
            AI-powered investment platform making wealth management accessible to everyone
          </p>
          <div className="flex gap-2 flex-wrap mb-4">
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full">Seed Stage</span>
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full">$2M Raised</span>
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full">10K Users</span>
          </div>
          <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <PortfolioShell
      title="alex thompson."
      isPreviewMode={isPreviewMode}
      logoHref="/network"
      logoSrc="/dmz-logo-white.svg"
    >
      <div className="lg:w-1/2 flex flex-col gap-4 sm:gap-6">
        <ProfileWidget />
        <EducationWidget />
      </div>

      <div className="lg:w-1/2 flex flex-col gap-4 sm:gap-6">
        <DescriptionWidget />
        <StartupWidget />
        <MeetingSchedulerWidget widgetId="meeting-scheduler-alex" column="right" isPreviewMode={isPreviewMode} />
      </div>
    </PortfolioShell>
  )
}
