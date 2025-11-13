"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import PortfolioShell from "./portfolio/portfolio-shell"
import MeetingSchedulerWidget from "./portfolio/builder/widgets/MeetingSchedulerWidget"

export default function MarcusJohnsonPortfolio({ isPreviewMode = false }: { isPreviewMode?: boolean }) {
  const [profileColorIdx] = useState(4) // Orange/red gradient

  const gradient = "from-orange-500/70 to-red-500/70"

  const ProfileWidget = () => (
    <div className={`bg-gradient-to-br ${gradient} backdrop-blur-xl rounded-3xl p-8`}>
      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-white/20 overflow-hidden">
          <img src="/man-developer.png" alt="Marcus Johnson" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold leading-tight text-white">
          marcus johnson
          <br />
          is a software engineer
          <br />
          <span className="text-white/70">building scalable systems.</span>
        </h1>

        <div className="flex flex-wrap gap-3 pt-4">
          {["linkedin.", "github.", "twitter."].map((social) => (
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
          <h3 className="font-semibold text-white">BS Computer Science</h3>
          <p className="text-neutral-300 text-sm">MIT</p>
          <p className="text-neutral-400 text-xs">2016-2020</p>
        </div>
      </div>
    </div>
  )

  const DescriptionWidget = () => (
    <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-8">
      <div className="space-y-4">
        <h3 className="text-xl font-bold">About Me</h3>
        <p className="text-white leading-relaxed">
          I'm a full-stack engineer with 5 years of experience building distributed systems.{" "}
          <span className="text-neutral-400">
            Passionate about clean code, system design, and mentoring junior developers.
          </span>
        </p>
      </div>
    </div>
  )

  const ProjectsWidget = () => (
    <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-6 h-6 bg-neutral-600 rounded flex items-center justify-center">
          <div className="w-3 h-3 border border-neutral-400 rounded-sm"></div>
        </div>
        <h2 className="text-xl font-bold">Projects</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-500/70 to-cyan-500/70 rounded-2xl p-4 space-y-3">
          <span className="text-sm font-medium bg-black/20 px-2 py-1 rounded">Cloud Platform</span>
          <p className="text-xs text-white/80 leading-relaxed">
            Built a scalable microservices platform handling 1M+ requests/day...
          </p>
          <div className="flex flex-wrap gap-1">
            <span className="text-xs bg-black/20 px-2 py-1 rounded">Node.js</span>
            <span className="text-xs bg-black/20 px-2 py-1 rounded">Kubernetes</span>
          </div>
        </div>

        <div className="bg-neutral-800/50 rounded-2xl p-4 space-y-3">
          <span className="text-sm font-medium">API Gateway</span>
          <p className="text-xs text-neutral-400 leading-relaxed">
            High-performance API gateway with rate limiting and caching...
          </p>
          <div className="flex flex-wrap gap-1">
            <span className="text-xs bg-neutral-700/50 px-2 py-1 rounded">Go</span>
            <span className="text-xs bg-neutral-700/50 px-2 py-1 rounded">Redis</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <PortfolioShell title="marcus johnson." isPreviewMode={isPreviewMode} logoHref="/network" logoSrc="/logo.svg">
      <div className="lg:w-1/2 flex flex-col gap-4 sm:gap-6">
        <ProfileWidget />
        <EducationWidget />
      </div>

      <div className="lg:w-1/2 flex flex-col gap-4 sm:gap-6">
        <DescriptionWidget />
        <ProjectsWidget />
        <MeetingSchedulerWidget widgetId="meeting-scheduler-marcus" column="right" isPreviewMode={isPreviewMode} />
      </div>
    </PortfolioShell>
  )
}
