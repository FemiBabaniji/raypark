"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Users, MessageCircle, Coffee, Calendar, Target } from "lucide-react"
import PreEventEngagement from "./pre-event-engagement"

interface EventPreparationProps {
  eventId: string
  eventTitle: string
  eventDate: string
  matches: any[]
}

export default function EventPreparationDashboard({ eventId, eventTitle, eventDate, matches }: EventPreparationProps) {
  const [completedTasks, setCompletedTasks] = useState<string[]>([])

  const preparationTasks = [
    {
      id: "review-matches",
      title: "Review AI Matches",
      description: "Check your recommended connections",
      icon: Users,
      completed: false,
    },
    {
      id: "send-messages",
      title: "Send Introduction Messages",
      description: "Reach out to 3-5 key matches",
      icon: MessageCircle,
      completed: false,
    },
    {
      id: "schedule-coffee",
      title: "Schedule Coffee Chats",
      description: "Book pre-event meetings",
      icon: Coffee,
      completed: false,
    },
    {
      id: "set-goals",
      title: "Set Networking Goals",
      description: "Define what you want to achieve",
      icon: Target,
      completed: false,
    },
  ]

  const toggleTask = (taskId: string) => {
    setCompletedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]))
  }

  const completionPercentage = (completedTasks.length / preparationTasks.length) * 100

  return (
    <div className="space-y-6">
      {/* Event Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-6 border border-blue-500/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{eventTitle}</h2>
            <p className="text-blue-300">{eventDate} • Get ready to make meaningful connections</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{Math.round(completionPercentage)}%</div>
            <div className="text-blue-300 text-sm">Ready</div>
          </div>
        </div>

        <div className="w-full bg-black/20 rounded-full h-3 mb-4">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <p className="text-neutral-300 text-sm">
          Complete your preparation checklist to enter the event with purpose and maximize your networking success.
        </p>
      </div>

      {/* Preparation Checklist */}
      <div className="bg-zinc-800/30 rounded-2xl p-6">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          Pre-Event Preparation
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {preparationTasks.map((task, index) => {
            const isCompleted = completedTasks.includes(task.id)
            const IconComponent = task.icon

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  isCompleted
                    ? "bg-green-600/20 border-green-500/30"
                    : "bg-zinc-700/30 border-zinc-600 hover:border-zinc-500"
                }`}
                onClick={() => toggleTask(task.id)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isCompleted ? "bg-green-600" : "bg-zinc-600"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <IconComponent className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium mb-1 ${isCompleted ? "text-green-400" : "text-white"}`}>
                      {task.title}
                    </h4>
                    <p className={`text-sm ${isCompleted ? "text-green-300" : "text-zinc-400"}`}>{task.description}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Pre-Event Engagement Tools */}
      <PreEventEngagement eventId={eventId} matches={matches} />

      {/* Event Day Tips */}
      <div className="bg-zinc-800/30 rounded-2xl p-6">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-400" />
          Event Day Success Tips
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-700/30 rounded-lg p-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
              <Users className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-white font-medium mb-2">Use QR Codes</h4>
            <p className="text-zinc-400 text-sm">
              Scan attendee badges to instantly view profiles and connection history
            </p>
          </div>

          <div className="bg-zinc-700/30 rounded-lg p-4">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mb-3">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-white font-medium mb-2">Follow Up</h4>
            <p className="text-zinc-400 text-sm">
              Reference your pre-event conversations to make meaningful connections
            </p>
          </div>

          <div className="bg-zinc-700/30 rounded-lg p-4">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mb-3">
              <Target className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-white font-medium mb-2">Stay Focused</h4>
            <p className="text-zinc-400 text-sm">Prioritize your pre-identified matches and collaboration goals</p>
          </div>
        </div>
      </div>
    </div>
  )
}
