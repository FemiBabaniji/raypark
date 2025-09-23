"use client"

import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { BackButton } from "@/components/ui/back-button"
import { Button } from "@/components/ui/button"
import { Users, Sparkles, MessageCircle, Coffee, Star } from "lucide-react"
import { useState } from "react"

const eventMatchData = {
  "founders-connect-mixer": {
    title: "Founders Connect Mixer",
    date: "Dec 15, 2024",
    matches: [
      {
        id: "jenny-wilson",
        name: "Jenny Wilson",
        title: "Digital Product Designer",
        email: "jenny@acme.com",
        location: "New York, NY",
        handle: "@jennywilson",
        initials: "JW",
        selectedColor: 1,
        avatarUrl: "/woman-designer.png",
        matchReason: "Looking for UX/UI expertise for wellness app",
        matchScore: 95,
        skills: ["Product Design", "UX Research", "Prototyping"],
        businessNeeds: ["Co-founder", "Collaborator"],
      },
      {
        id: "john-doe",
        name: "John Doe",
        title: "Full Stack Developer",
        email: "john@datastam.edu",
        location: "Boston, MA",
        handle: "@johndoe",
        initials: "JD",
        selectedColor: 2,
        matchReason: "Technical co-founder with healthcare experience",
        matchScore: 88,
        skills: ["Software Development", "Data Science", "AI/ML"],
        businessNeeds: ["Co-founder", "Technical Partner"],
      },
      {
        id: "sarah-chen",
        name: "Sarah Chen",
        title: "Healthcare Entrepreneur",
        email: "sarah@healthtech.io",
        location: "San Francisco, CA",
        handle: "@sarahcodes",
        initials: "SC",
        selectedColor: 3,
        avatarUrl: "/professional-headshot.png",
        matchReason: "Similar industry focus and funding stage",
        matchScore: 92,
        skills: ["Healthcare", "Business Development", "Fundraising"],
        businessNeeds: ["Investor", "Mentor", "Collaborator"],
      },
      {
        id: "mike-rodriguez",
        name: "Mike Rodriguez",
        title: "Wellness Industry Investor",
        email: "mike@wellnessfund.com",
        location: "Austin, TX",
        handle: "@mikepm",
        initials: "MR",
        selectedColor: 4,
        matchReason: "Active investor in wellness startups",
        matchScore: 85,
        skills: ["Investment", "Strategy", "Mentorship"],
        businessNeeds: ["Investment Opportunities", "Portfolio Support"],
      },
      {
        id: "alex-thompson",
        name: "Alex Thompson",
        title: "Mobile App Developer",
        email: "alex@techsolutions.com",
        location: "Seattle, WA",
        handle: "@alexdev",
        initials: "AT",
        selectedColor: 2,
        matchReason: "Mobile development expertise for wellness apps",
        matchScore: 78,
        skills: ["Mobile Development", "React Native", "iOS/Android"],
        businessNeeds: ["Freelance Projects", "Co-founder"],
      },
    ],
  },
  "ai-ml-workshop": {
    title: "AI & Machine Learning Workshop",
    date: "Dec 18, 2024",
    matches: [
      {
        id: "data-scientist-1",
        name: "Dr. Lisa Park",
        title: "AI Research Scientist",
        email: "lisa@airesearch.com",
        location: "Palo Alto, CA",
        handle: "@lisapark",
        initials: "LP",
        selectedColor: 5,
        matchReason: "AI expertise for healthcare applications",
        matchScore: 94,
        skills: ["Machine Learning", "Healthcare AI", "Research"],
        businessNeeds: ["Collaboration", "Consulting"],
      },
    ],
  },
}

export default function EventMatchesPage() {
  const router = useRouter()
  const params = useParams()
  const { eventId } = params
  const [savedMatches, setSavedMatches] = useState<string[]>([])
  const [messagedMatches, setMessagedMatches] = useState<string[]>([])

  const eventData = eventMatchData[eventId as keyof typeof eventMatchData]

  if (!eventData) {
    return <div>Event matches not found</div>
  }

  const handleSaveMatch = (matchId: string) => {
    setSavedMatches((prev) => (prev.includes(matchId) ? prev.filter((id) => id !== matchId) : [...prev, matchId]))
  }

  const handleMessageMatch = (matchId: string) => {
    setMessagedMatches((prev) => [...prev, matchId])
    // In a real app, this would open a messaging interface
    console.log("Opening message interface for:", matchId)
  }

  const handleScheduleCoffee = (matchId: string) => {
    // In a real app, this would open a scheduling interface
    console.log("Opening scheduling interface for:", matchId)
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-8">
          <BackButton onClick={() => router.push("/network/bea-founders-connect")} aria-label="Back to community" />
          <div>
            <h1 className="text-2xl font-medium text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              AI Matches for {eventData.title}
            </h1>
            <p className="text-zinc-400">
              {eventData.date} • {eventData.matches.length} potential collaborators
            </p>
          </div>
        </div>

        {/* Match Quality Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-6 border border-purple-500/20 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">How AI Matching Works</h3>
              <p className="text-neutral-300 text-sm mb-3">
                Our AI analyzes your profile, business needs, and goals to find the most relevant connections at this
                event. Match scores are based on complementary skills, shared interests, and collaboration potential.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400">90-100% Perfect Match</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-blue-400">80-89% Great Match</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-yellow-400">70-79% Good Match</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Matches Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {eventData.matches.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700 hover:border-zinc-600 transition-colors"
            >
              {/* Match Score Badge */}
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    match.matchScore >= 90
                      ? "bg-green-600/20 text-green-400 border border-green-500/30"
                      : match.matchScore >= 80
                        ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                        : "bg-yellow-600/20 text-yellow-400 border border-yellow-500/30"
                  }`}
                >
                  {match.matchScore}% Match
                </div>
                <button
                  onClick={() => handleSaveMatch(match.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    savedMatches.includes(match.id)
                      ? "bg-yellow-600/20 text-yellow-400"
                      : "bg-zinc-700/50 text-zinc-400 hover:text-yellow-400"
                  }`}
                >
                  <Star className={`w-4 h-4 ${savedMatches.includes(match.id) ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Profile Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  {match.avatarUrl ? (
                    <img
                      src={match.avatarUrl || "/placeholder.svg"}
                      alt={match.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-medium text-sm">{match.initials}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-white font-medium">{match.name}</h3>
                  <p className="text-zinc-400 text-sm">{match.title}</p>
                  <p className="text-zinc-500 text-xs">{match.location}</p>
                </div>
              </div>

              {/* Match Reason */}
              <div className="bg-zinc-700/30 rounded-lg p-3 mb-4">
                <p className="text-zinc-300 text-sm font-medium mb-1">Why you should connect:</p>
                <p className="text-zinc-400 text-sm">{match.matchReason}</p>
              </div>

              {/* Skills & Needs */}
              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-zinc-400 text-xs uppercase tracking-wide mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {match.skills.map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-zinc-400 text-xs uppercase tracking-wide mb-2">Looking For</p>
                  <div className="flex flex-wrap gap-1">
                    {match.businessNeeds.map((need) => (
                      <span key={need} className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded">
                        {need}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  onClick={() => handleMessageMatch(match.id)}
                  disabled={messagedMatches.includes(match.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {messagedMatches.includes(match.id) ? "Message Sent" : "Send Message"}
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleScheduleCoffee(match.id)}
                    className="border-zinc-600 text-zinc-300 hover:text-white"
                  >
                    <Coffee className="w-4 h-4 mr-1" />
                    Coffee Chat
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/network/${match.id}`)}
                    className="border-zinc-600 text-zinc-300 hover:text-white"
                  >
                    <Users className="w-4 h-4 mr-1" />
                    View Profile
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Saved Matches Summary */}
        {savedMatches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-yellow-600/20 rounded-2xl p-6 border border-yellow-500/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-yellow-400 font-semibold mb-1">Saved Matches</h3>
                <p className="text-yellow-300 text-sm">
                  You've saved {savedMatches.length} match{savedMatches.length !== 1 ? "es" : ""} for later follow-up
                </p>
              </div>
              <Button
                onClick={() => router.push("/network/bea-founders-connect/saved-matches")}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                View All Saved
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
