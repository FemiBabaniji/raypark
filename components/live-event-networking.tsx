"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { QrCode, Users, MessageCircle, MapPin, Clock, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import QRProfileScanner from "./qr-profile-scanner"

interface LiveEventNetworkingProps {
  eventId: string
  eventTitle: string
  isLive: boolean
}

interface RecentConnection {
  id: string
  name: string
  title: string
  avatarUrl?: string
  connectedAt: string
  matchScore: number
  quickNote?: string
}

export default function LiveEventNetworking({ eventId, eventTitle, isLive }: LiveEventNetworkingProps) {
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [recentConnections, setRecentConnections] = useState<RecentConnection[]>([
    {
      id: "jenny-wilson",
      name: "Jenny Wilson",
      title: "Digital Product Designer",
      avatarUrl: "/woman-designer.png",
      connectedAt: "5 minutes ago",
      matchScore: 94,
      quickNote: "Interested in wellness app collaboration",
    },
    {
      id: "alex-rodriguez",
      name: "Alex Rodriguez",
      title: "Full Stack Developer",
      connectedAt: "12 minutes ago",
      matchScore: 87,
      quickNote: "Available for technical co-founder role",
    },
  ])

  const handleProfileScanned = (profile: any) => {
    const newConnection: RecentConnection = {
      id: profile.id,
      name: profile.name,
      title: profile.title,
      avatarUrl: profile.avatarUrl,
      connectedAt: "Just now",
      matchScore: profile.matchScore || 85,
    }

    setRecentConnections((prev) => [newConnection, ...prev.slice(0, 4)])
  }

  if (!isLive) {
    return (
      <div className="bg-zinc-800/30 rounded-2xl p-6 text-center">
        <div className="w-16 h-16 bg-zinc-700 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Clock className="w-8 h-8 text-zinc-500" />
        </div>
        <h3 className="text-white font-medium mb-2">Event Not Started</h3>
        <p className="text-zinc-400 text-sm">Live networking features will be available during the event</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Live Event Header */}
      <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl p-6 border border-green-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <div>
              <h2 className="text-white font-semibold">Live Event Networking</h2>
              <p className="text-green-300 text-sm">{eventTitle} is happening now</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <Zap className="w-4 h-4" />
            <span>Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">{recentConnections.length}</div>
            <div className="text-green-300 text-sm">New Connections</div>
          </div>
          <div className="bg-black/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">47</div>
            <div className="text-green-300 text-sm">Active Attendees</div>
          </div>
          <div className="bg-black/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">8</div>
            <div className="text-green-300 text-sm">Potential Matches</div>
          </div>
        </div>
      </div>

      {/* QR Scanner */}
      <div className="bg-zinc-800/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <QrCode className="w-6 h-6 text-blue-400" />
            <div>
              <h3 className="text-white font-medium">Instant Profile Scanning</h3>
              <p className="text-zinc-400 text-sm">Scan attendee badges for instant connections</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-zinc-700/30 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <QrCode className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-white font-medium">Quick Scan</h4>
            </div>
            <p className="text-zinc-400 text-sm mb-3">
              Point your camera at any attendee's badge to instantly view their profile and connection history
            </p>
            <ul className="text-zinc-400 text-xs space-y-1">
              <li>• View full professional profile</li>
              <li>• See previous event connections</li>
              <li>• Check compatibility scores</li>
            </ul>
          </div>

          <div className="bg-zinc-700/30 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-white font-medium">Instant Connect</h4>
            </div>
            <p className="text-zinc-400 text-sm mb-3">
              Skip the business card exchange and connect digitally with one tap
            </p>
            <ul className="text-zinc-400 text-xs space-y-1">
              <li>• Send connection requests</li>
              <li>• Schedule follow-up meetings</li>
              <li>• Add personal notes</li>
            </ul>
          </div>
        </div>

        <Button onClick={() => setIsScannerOpen(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">
          <QrCode className="w-5 h-5 mr-2" />
          Start QR Scanner
        </Button>
      </div>

      {/* Recent Connections */}
      {recentConnections.length > 0 && (
        <div className="bg-zinc-800/30 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              <h3 className="text-white font-medium">Recent Connections</h3>
            </div>
            <span className="text-zinc-400 text-sm">{recentConnections.length} today</span>
          </div>

          <div className="space-y-3">
            {recentConnections.map((connection, index) => (
              <motion.div
                key={connection.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-zinc-700/30 rounded-lg p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    {connection.avatarUrl ? (
                      <img
                        src={connection.avatarUrl || "/placeholder.svg"}
                        alt={connection.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-medium text-sm">
                        {connection.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-white font-medium">{connection.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-green-400 text-sm font-medium">{connection.matchScore}%</span>
                        <span className="text-zinc-400 text-xs">{connection.connectedAt}</span>
                      </div>
                    </div>
                    <p className="text-zinc-400 text-sm mb-2">{connection.title}</p>
                    {connection.quickNote && (
                      <p className="text-zinc-300 text-sm bg-zinc-600/30 rounded px-2 py-1">{connection.quickNote}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Message
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-zinc-600 text-zinc-300 bg-transparent hover:bg-zinc-700/50"
                  >
                    View Profile
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Event Map/Location */}
      <div className="bg-zinc-800/30 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-orange-400" />
          <h3 className="text-white font-medium">Event Location</h3>
        </div>
        <div className="bg-zinc-700/30 rounded-lg p-4">
          <p className="text-white font-medium mb-1">Innovation Hub - Main Floor</p>
          <p className="text-zinc-400 text-sm mb-3">123 Tech Street, San Francisco, CA</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-zinc-400">Networking Area:</span>
              <span className="text-white ml-2">Lobby & Lounge</span>
            </div>
            <div>
              <span className="text-zinc-400">Presentations:</span>
              <span className="text-white ml-2">Conference Room A</span>
            </div>
          </div>
        </div>
      </div>

      <QRProfileScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onProfileScanned={handleProfileScanned}
      />
    </div>
  )
}
