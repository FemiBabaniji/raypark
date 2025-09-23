"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { QrCode, Camera, X, MessageCircle, Coffee, Star, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ScannedProfile {
  id: string
  name: string
  title: string
  company: string
  email: string
  location: string
  handle: string
  avatarUrl?: string
  bio: string
  skills: string[]
  businessNeeds: string[]
  matchScore?: number
  connectionHistory?: {
    previousEvents: string[]
    lastInteraction?: string
    sharedConnections: number
  }
}

interface QRProfileScannerProps {
  isOpen: boolean
  onClose: () => void
  onProfileScanned: (profile: ScannedProfile) => void
}

// Mock profile data that would be retrieved from QR scan
const mockProfiles: Record<string, ScannedProfile> = {
  "jenny-wilson-qr": {
    id: "jenny-wilson",
    name: "Jenny Wilson",
    title: "Digital Product Designer",
    company: "Acme Design Studio",
    email: "jenny@acme.com",
    location: "New York, NY",
    handle: "@jennywilson",
    avatarUrl: "/woman-designer.png",
    bio: "Passionate about creating user-centered digital experiences. Currently working on wellness and healthcare applications.",
    skills: ["Product Design", "UX Research", "Prototyping", "Design Systems"],
    businessNeeds: ["Co-founder", "Collaborator", "Freelance Projects"],
    matchScore: 94,
    connectionHistory: {
      previousEvents: ["Tech Innovators Mixer", "Design Thinking Workshop"],
      lastInteraction: "3 months ago",
      sharedConnections: 5,
    },
  },
  "alex-rodriguez-qr": {
    id: "alex-rodriguez",
    name: "Alex Rodriguez",
    title: "Full Stack Developer",
    company: "TechStart Solutions",
    email: "alex@techstart.com",
    location: "Austin, TX",
    handle: "@alexdev",
    bio: "Building scalable web applications with a focus on healthcare and fintech. Open to co-founder opportunities.",
    skills: ["React", "Node.js", "Python", "AWS", "Mobile Development"],
    businessNeeds: ["Co-founder", "Technical Partner", "Consulting"],
    matchScore: 87,
    connectionHistory: {
      previousEvents: ["Startup Pitch Night"],
      sharedConnections: 2,
    },
  },
}

export default function QRProfileScanner({ isOpen, onClose, onProfileScanned }: QRProfileScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedProfile, setScannedProfile] = useState<ScannedProfile | null>(null)
  const [scanResult, setScanResult] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    if (isOpen && isScanning) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => stopCamera()
  }, [isOpen, isScanning])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      // Simulate scan for demo purposes
      setTimeout(() => {
        simulateScan()
      }, 2000)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }

  const simulateScan = () => {
    // Simulate scanning a QR code
    const profileKeys = Object.keys(mockProfiles)
    const randomProfile = mockProfiles[profileKeys[Math.floor(Math.random() * profileKeys.length)]]
    setScanResult(`pathwai://profile/${randomProfile.id}`)
    setScannedProfile(randomProfile)
    setIsScanning(false)
  }

  const handleStartScan = () => {
    setIsScanning(true)
    setScannedProfile(null)
    setScanResult(null)
  }

  const handleConnect = () => {
    if (scannedProfile) {
      onProfileScanned(scannedProfile)
      onClose()
    }
  }

  const handleSaveForLater = () => {
    if (scannedProfile) {
      // Save profile to user's saved connections
      console.log("Saving profile for later:", scannedProfile.id)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-zinc-900 rounded-2xl p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">QR Profile Scanner</h3>
              <p className="text-zinc-400 text-sm">Scan attendee badges to connect</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!isScanning && !scannedProfile && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="w-32 h-32 bg-zinc-800 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <QrCode className="w-16 h-16 text-zinc-600" />
              </div>
              <h4 className="text-white font-medium mb-2">Ready to Scan</h4>
              <p className="text-zinc-400 text-sm mb-6">
                Point your camera at an attendee's QR badge to instantly view their profile and connection history
              </p>
              <Button onClick={handleStartScan} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Camera className="w-4 h-4 mr-2" />
                Start Scanning
              </Button>
            </motion.div>
          )}

          {isScanning && !scannedProfile && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="relative w-full h-64 bg-zinc-800 rounded-2xl mb-6 overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ display: stream ? "block" : "none" }}
                />
                {!stream && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        className="w-16 h-16 border-4 border-blue-500 rounded-lg mx-auto mb-4"
                      />
                      <p className="text-zinc-400 text-sm">Scanning for QR codes...</p>
                    </div>
                  </div>
                )}

                {/* Scanning overlay */}
                <div className="absolute inset-0 border-2 border-blue-500/50 rounded-2xl">
                  <motion.div
                    className="absolute inset-x-4 h-0.5 bg-blue-500"
                    animate={{ y: [16, 240, 16] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                </div>
              </div>

              <p className="text-zinc-400 text-sm mb-4">Position the QR code within the frame</p>
              <Button onClick={() => setIsScanning(false)} variant="outline" className="border-zinc-600 text-zinc-300">
                Cancel Scan
              </Button>
            </motion.div>
          )}

          {scannedProfile && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Success indicator */}
              <div className="flex items-center justify-center gap-2 text-green-400 mb-4">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Profile Scanned Successfully</span>
              </div>

              {/* Profile header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  {scannedProfile.avatarUrl ? (
                    <img
                      src={scannedProfile.avatarUrl || "/placeholder.svg"}
                      alt={scannedProfile.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-medium text-lg">
                      {scannedProfile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-lg">{scannedProfile.name}</h4>
                  <p className="text-zinc-400 text-sm">
                    {scannedProfile.title} at {scannedProfile.company}
                  </p>
                  <p className="text-zinc-500 text-xs">{scannedProfile.location}</p>
                </div>
                {scannedProfile.matchScore && (
                  <div className="text-right">
                    <div className="text-green-400 font-semibold">{scannedProfile.matchScore}%</div>
                    <div className="text-zinc-400 text-xs">Match</div>
                  </div>
                )}
              </div>

              {/* Connection history */}
              {scannedProfile.connectionHistory && (
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <h5 className="text-white font-medium text-sm mb-2">Connection History</h5>
                  <div className="space-y-2 text-xs">
                    {scannedProfile.connectionHistory.previousEvents.length > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-zinc-400">
                          Met at: {scannedProfile.connectionHistory.previousEvents.join(", ")}
                        </span>
                      </div>
                    )}
                    {scannedProfile.connectionHistory.lastInteraction && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-zinc-400">
                          Last interaction: {scannedProfile.connectionHistory.lastInteraction}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-zinc-400">
                        {scannedProfile.connectionHistory.sharedConnections} shared connections
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bio */}
              <div>
                <p className="text-zinc-300 text-sm leading-relaxed">{scannedProfile.bio}</p>
              </div>

              {/* Skills and needs */}
              <div className="space-y-3">
                <div>
                  <h5 className="text-zinc-400 text-xs uppercase tracking-wide mb-2">Skills</h5>
                  <div className="flex flex-wrap gap-1">
                    {scannedProfile.skills.map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="text-zinc-400 text-xs uppercase tracking-wide mb-2">Looking For</h5>
                  <div className="flex flex-wrap gap-1">
                    {scannedProfile.businessNeeds.map((need) => (
                      <span key={need} className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded">
                        {need}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <Button onClick={handleConnect} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Connect & Message
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleSaveForLater}
                    variant="outline"
                    className="border-zinc-600 text-zinc-300 bg-transparent"
                  >
                    <Star className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    onClick={() => console.log("Schedule coffee with:", scannedProfile.id)}
                    variant="outline"
                    className="border-zinc-600 text-zinc-300 bg-transparent"
                  >
                    <Coffee className="w-4 h-4 mr-1" />
                    Coffee
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
