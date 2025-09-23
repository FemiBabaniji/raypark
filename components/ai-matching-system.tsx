"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Users, Target, Brain, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MatchingCriteria {
  skills: string[]
  businessNeeds: string[]
  industry: string
  stage: string
  location: string
}

interface AIMatch {
  id: string
  name: string
  title: string
  company: string
  matchScore: number
  matchReasons: string[]
  avatarUrl?: string
}

interface AIMatchingSystemProps {
  userProfile: MatchingCriteria
  eventId: string
  onMatchesFound: (matches: AIMatch[]) => void
}

export default function AIMatchingSystem({ userProfile, eventId, onMatchesFound }: AIMatchingSystemProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState(0)
  const [matches, setMatches] = useState<AIMatch[]>([])

  const analysisSteps = [
    "Analyzing your profile and goals...",
    "Scanning event attendees...",
    "Calculating compatibility scores...",
    "Finding optimal connections...",
    "Generating match insights...",
  ]

  const runMatchingAnalysis = async () => {
    setIsAnalyzing(true)
    setAnalysisStep(0)

    // Simulate AI analysis with step progression
    for (let i = 0; i < analysisSteps.length; i++) {
      setAnalysisStep(i)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    // Simulate finding matches
    const mockMatches: AIMatch[] = [
      {
        id: "match-1",
        name: "Sarah Chen",
        title: "Healthcare AI Founder",
        company: "MedTech Solutions",
        matchScore: 94,
        matchReasons: [
          "Both working in healthcare technology",
          "Complementary technical and business skills",
          "Similar funding stage and growth goals",
        ],
        avatarUrl: "/professional-headshot.png",
      },
      {
        id: "match-2",
        name: "Alex Rodriguez",
        title: "Mobile App Developer",
        company: "Freelance",
        matchScore: 87,
        matchReasons: [
          "Technical expertise you're seeking",
          "Experience in wellness app development",
          "Available for co-founder opportunities",
        ],
      },
      {
        id: "match-3",
        name: "Dr. Lisa Park",
        title: "Wellness Industry Investor",
        company: "Health Ventures",
        matchScore: 91,
        matchReasons: [
          "Active investor in wellness startups",
          "Portfolio includes similar companies",
          "Provides strategic mentorship",
        ],
      },
    ]

    setMatches(mockMatches)
    onMatchesFound(mockMatches)
    setIsAnalyzing(false)
  }

  return (
    <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl p-6 border border-purple-500/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">AI-Powered Matching</h3>
          <p className="text-neutral-300 text-sm">Find your perfect collaborators at this event</p>
        </div>
      </div>

      {!isAnalyzing && matches.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-black/20 rounded-lg p-4 text-center">
              <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h4 className="text-white font-medium text-sm mb-1">Smart Analysis</h4>
              <p className="text-neutral-400 text-xs">Analyzes skills, goals, and compatibility</p>
            </div>
            <div className="bg-black/20 rounded-lg p-4 text-center">
              <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h4 className="text-white font-medium text-sm mb-1">Quality Matches</h4>
              <p className="text-neutral-400 text-xs">Finds meaningful connections, not just contacts</p>
            </div>
            <div className="bg-black/20 rounded-lg p-4 text-center">
              <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h4 className="text-white font-medium text-sm mb-1">Actionable Insights</h4>
              <p className="text-neutral-400 text-xs">Explains why each match is relevant</p>
            </div>
          </div>

          <Button onClick={runMatchingAnalysis} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
            <Sparkles className="w-5 h-5 mr-2" />
            Find My Matches
          </Button>
        </motion.div>
      )}

      {isAnalyzing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
          </div>

          <h4 className="text-white font-medium mb-2">AI Analysis in Progress</h4>
          <p className="text-purple-300 text-sm mb-4">{analysisSteps[analysisStep]}</p>

          <div className="w-full bg-black/20 rounded-full h-2 mb-4">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${((analysisStep + 1) / analysisSteps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="flex justify-center gap-1">
            {analysisSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= analysisStep ? "bg-purple-400" : "bg-neutral-600"
                }`}
              />
            ))}
          </div>
        </motion.div>
      )}

      {matches.length > 0 && !isAnalyzing && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-medium">Found {matches.length} High-Quality Matches</h4>
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <Sparkles className="w-4 h-4" />
              <span>AI Confidence: High</span>
            </div>
          </div>

          {matches.slice(0, 2).map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/20 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    {match.avatarUrl ? (
                      <img
                        src={match.avatarUrl || "/placeholder.svg"}
                        alt={match.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-medium text-sm">
                        {match.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    )}
                  </div>
                  <div>
                    <h5 className="text-white font-medium">{match.name}</h5>
                    <p className="text-neutral-400 text-sm">
                      {match.title} at {match.company}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-medium text-sm">{match.matchScore}% Match</div>
                </div>
              </div>

              <div className="space-y-1 mb-3">
                {match.matchReasons.slice(0, 2).map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-neutral-300 text-xs">{reason}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          <Button
            onClick={() => (window.location.href = `/network/${eventId}/matches`)}
            className="w-full bg-white text-black hover:bg-neutral-200"
          >
            View All Matches & Connect
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      )}
    </div>
  )
}
