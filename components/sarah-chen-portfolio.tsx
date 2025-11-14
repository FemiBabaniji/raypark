"use client"

import { Button } from "@/components/ui/button"
import PortfolioShell from "./portfolio/portfolio-shell"
import MeetingSchedulerWidget from "./portfolio/builder/widgets/MeetingSchedulerWidget"

export default function SarahChenPortfolio({ isPreviewMode = false }: { isPreviewMode?: boolean }) {
  const ProfileWidget = () => (
    <div className="bg-gradient-to-br from-blue-500/70 to-cyan-500/70 backdrop-blur-xl rounded-3xl p-8">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-white/20 overflow-hidden">
          <img src="/woman-designer.png" alt="Sarah Chen" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold leading-tight text-white">
          sarah chen
          <br />
          is a product designer
          <br />
          <span className="text-white/70">currently at stripe.</span>
        </h1>

        <div className="flex flex-wrap gap-3 pt-4">
          {["linkedin.", "dribbble.", "behance.", "twitter."].map((social) => (
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
          <div>
            <h3 className="font-semibold text-white">MFA Interaction Design</h3>
            <p className="text-neutral-300 text-sm">School of Visual Arts</p>
            <p className="text-neutral-400 text-xs">2019 • GPA: 3.9</p>
          </div>
        </div>

        <div className="bg-neutral-800/50 rounded-2xl p-4">
          <div>
            <h3 className="font-semibold text-white">BA Graphic Design</h3>
            <p className="text-neutral-300 text-sm">Rhode Island School of Design</p>
            <p className="text-neutral-400 text-xs">2017 • GPA: 3.8</p>
          </div>
        </div>

        <div className="bg-neutral-800/50 rounded-2xl p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-white">UX Design Professional</h3>
              <p className="text-neutral-300 text-sm">Google</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <p className="text-neutral-400 text-xs">2020</p>
              <span className="inline-block bg-green-600 text-white text-xs px-2 py-1 rounded">Certified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const AboutWidget = () => (
    <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-8">
      <div className="space-y-4">
        <h3 className="text-xl font-bold">About Me</h3>
        <p className="text-white leading-relaxed">
          I'm a product designer passionate about creating intuitive experiences that solve real user problems.{" "}
          <span className="text-neutral-400">
            With 6+ years of experience, I specialize in design systems, user research, and crafting delightful
            interfaces that users love.
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
        <h2 className="text-xl font-bold">Projects Portfolio</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-purple-500/70 to-blue-500/70 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium bg-black/20 px-2 py-1 rounded">Design System</span>
          </div>
          <p className="text-xs text-white/80 leading-relaxed">
            Built comprehensive design system for Stripe's payment products, improving consistency across 50+ teams.
          </p>
          <div className="flex flex-wrap gap-1">
            <span className="text-xs bg-black/20 px-2 py-1 rounded">Figma</span>
            <span className="text-xs bg-black/20 px-2 py-1 rounded">React</span>
            <span className="text-xs bg-black/20 px-2 py-1 rounded">Storybook</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-green-400">Completed</span>
            <span className="text-2xl font-bold">100%</span>
          </div>
        </div>

        <div className="bg-neutral-800/50 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Mobile Banking</span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Redesigned mobile banking experience, increasing user engagement by 40% and reducing support tickets.
          </p>
          <div className="flex flex-wrap gap-1">
            <span className="text-xs bg-neutral-700/50 px-2 py-1 rounded">iOS</span>
            <span className="text-xs bg-neutral-700/50 px-2 py-1 rounded">Android</span>
            <span className="text-xs bg-neutral-700/50 px-2 py-1 rounded">Prototyping</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-green-400">Completed</span>
            <span className="text-2xl font-bold">100%</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-500/70 to-pink-500/70 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium bg-black/20 px-2 py-1 rounded">E-commerce</span>
          </div>
          <p className="text-xs text-white/80 leading-relaxed">
            Led checkout redesign that improved conversion rates by 25% and reduced cart abandonment significantly.
          </p>
          <div className="flex flex-wrap gap-1">
            <span className="text-xs bg-black/20 px-2 py-1 rounded">UX Research</span>
            <span className="text-xs bg-black/20 px-2 py-1 rounded">A/B Testing</span>
            <span className="text-xs bg-black/20 px-2 py-1 rounded">Analytics</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-green-400">Completed</span>
            <span className="text-2xl font-bold">100%</span>
          </div>
        </div>

        <div className="bg-neutral-800/50 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Dashboard</span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Created analytics dashboard for enterprise clients with real-time data visualization and insights.
          </p>
          <div className="flex flex-wrap gap-1">
            <span className="text-xs bg-neutral-700/50 px-2 py-1 rounded">Data Viz</span>
            <span className="text-xs bg-neutral-700/50 px-2 py-1 rounded">D3.js</span>
            <span className="text-xs bg-neutral-700/50 px-2 py-1 rounded">React</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-400">In Progress</span>
            <span className="text-2xl font-bold">75%</span>
          </div>
        </div>
      </div>
    </div>
  )

  const ExperienceWidget = () => (
    <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-8">
      <h2 className="text-xl font-bold mb-6">Work Experience</h2>

      <div className="space-y-4">
        <div className="bg-neutral-800/50 rounded-2xl p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-white">Senior Product Designer</h3>
              <p className="text-neutral-300 text-sm">Stripe</p>
              <p className="text-neutral-400 text-xs">2021 - Present</p>
            </div>
            <span className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded">Current</span>
          </div>
          <p className="text-neutral-400 text-xs mt-2">
            Leading design for payment infrastructure products, managing design system, and mentoring junior designers.
          </p>
        </div>

        <div className="bg-neutral-800/50 rounded-2xl p-4">
          <div>
            <h3 className="font-semibold text-white">Product Designer</h3>
            <p className="text-neutral-300 text-sm">Airbnb</p>
            <p className="text-neutral-400 text-xs">2019 - 2021 • 2 years</p>
            <p className="text-neutral-400 text-xs mt-2">
              Designed host tools and guest experiences, conducted user research, and collaborated with engineering
              teams.
            </p>
          </div>
        </div>

        <div className="bg-neutral-800/50 rounded-2xl p-4">
          <div>
            <h3 className="font-semibold text-white">UX Designer</h3>
            <p className="text-neutral-300 text-sm">IBM</p>
            <p className="text-neutral-400 text-xs">2017 - 2019 • 2 years</p>
            <p className="text-neutral-400 text-xs mt-2">
              Created enterprise software interfaces, developed design patterns, and worked on accessibility
              improvements.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const SkillsWidget = () => (
    <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 backdrop-blur-xl rounded-3xl p-8">
      <h2 className="text-xl font-bold mb-6">Skills & Tools</h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-white mb-2">Design</h3>
          <div className="flex flex-wrap gap-2">
            {["Figma", "Sketch", "Adobe XD", "Prototyping", "Wireframing", "User Research"].map((skill) => (
              <span key={skill} className="text-xs bg-neutral-800/50 px-3 py-1.5 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white mb-2">Development</h3>
          <div className="flex flex-wrap gap-2">
            {["HTML/CSS", "React", "Tailwind", "Framer Motion", "Git"].map((skill) => (
              <span key={skill} className="text-xs bg-neutral-800/50 px-3 py-1.5 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white mb-2">Methodology</h3>
          <div className="flex flex-wrap gap-2">
            {["Design Thinking", "Agile", "User Testing", "A/B Testing", "Analytics"].map((skill) => (
              <span key={skill} className="text-xs bg-neutral-800/50 px-3 py-1.5 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <PortfolioShell title="sarah chen." isPreviewMode={true} logoHref="/network" logoSrc="/dmz-logo-white.svg">
      <div className="lg:w-1/2 flex flex-col gap-4 sm:gap-6">
        <ProfileWidget />
        <EducationWidget />
        <SkillsWidget />
      </div>

      <div className="lg:w-1/2 flex flex-col gap-4 sm:gap-6">
        <AboutWidget />
        <ProjectsWidget />
        <MeetingSchedulerWidget widgetId="meeting-scheduler-sarah" column="right" isPreviewMode={isPreviewMode} />
        <ExperienceWidget />
      </div>
    </PortfolioShell>
  )
}
