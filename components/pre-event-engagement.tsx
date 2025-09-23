"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, Coffee, Calendar, Users, Send, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Match {
  id: string
  name: string
  title: string
  company: string
  avatarUrl?: string
  matchScore: number
  isOnline: boolean
  lastSeen?: string
}

interface Message {
  id: string
  senderId: string
  content: string
  timestamp: string
  isRead: boolean
}

interface CoffeeChat {
  id: string
  matchId: string
  proposedTimes: string[]
  status: "pending" | "confirmed" | "declined"
  location?: string
}

interface PreEventEngagementProps {
  eventId: string
  matches: Match[]
}

export default function PreEventEngagement({ eventId, matches }: PreEventEngagementProps) {
  const [activeTab, setActiveTab] = useState<"messages" | "coffee" | "saved">("messages")
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null)
  const [messageText, setMessageText] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      senderId: "jenny-wilson",
      content:
        "Hi! I saw we're both attending the Founders Connect mixer. I'd love to chat about your wellness app idea!",
      timestamp: "2 hours ago",
      isRead: true,
    },
    {
      id: "2",
      senderId: "current-user",
      content:
        "That would be great! I'm really interested in your UX design background. Would you be open to a quick coffee chat before the event?",
      timestamp: "1 hour ago",
      isRead: true,
    },
  ])
  const [coffeeChats, setCoffeeChats] = useState<CoffeeChat[]>([
    {
      id: "1",
      matchId: "jenny-wilson",
      proposedTimes: ["Dec 14, 3:00 PM", "Dec 14, 4:30 PM", "Dec 15, 11:00 AM"],
      status: "pending",
      location: "Cafe Luna, Downtown",
    },
  ])

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedMatch) return

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "current-user",
      content: messageText,
      timestamp: "Just now",
      isRead: false,
    }

    setMessages((prev) => [...prev, newMessage])
    setMessageText("")
  }

  const handleProposeCoffeeChat = (matchId: string) => {
    const newCoffeeChat: CoffeeChat = {
      id: Date.now().toString(),
      matchId,
      proposedTimes: ["Dec 14, 2:00 PM", "Dec 14, 4:00 PM", "Dec 15, 10:00 AM"],
      status: "pending",
      location: "Starbucks, Innovation District",
    }

    setCoffeeChats((prev) => [...prev, newCoffeeChat])
  }

  const selectedMatchData = matches.find((m) => m.id === selectedMatch)

  return (
    <div className="bg-zinc-800/30 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-medium text-white">Pre-Event Engagement</h3>
        <span className="text-sm text-zinc-400">Connect before the event</span>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 bg-zinc-700/30 rounded-lg p-1">
        {[
          { id: "messages", label: "Messages", icon: MessageCircle },
          { id: "coffee", label: "Coffee Chats", icon: Coffee },
          { id: "saved", label: "Saved Matches", icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-700/50"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "messages" && (
          <motion.div
            key="messages"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-4 h-96">
              {/* Conversations List */}
              <div className="bg-zinc-700/30 rounded-lg p-4 overflow-y-auto">
                <h4 className="text-white font-medium mb-3">Conversations</h4>
                <div className="space-y-2">
                  {matches.slice(0, 3).map((match) => (
                    <button
                      key={match.id}
                      onClick={() => setSelectedMatch(match.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                        selectedMatch === match.id ? "bg-blue-600/20 border border-blue-500/30" : "hover:bg-zinc-600/30"
                      }`}
                    >
                      <div className="relative">
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
                        {match.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-zinc-800"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">{match.name}</p>
                        <p className="text-zinc-400 text-xs truncate">{match.title}</p>
                        {!match.isOnline && match.lastSeen && (
                          <p className="text-zinc-500 text-xs">Last seen {match.lastSeen}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Interface */}
              <div className="bg-zinc-700/30 rounded-lg flex flex-col">
                {selectedMatchData ? (
                  <>
                    {/* Chat Header */}
                    <div className="flex items-center gap-3 p-4 border-b border-zinc-600/50">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        {selectedMatchData.avatarUrl ? (
                          <img
                            src={selectedMatchData.avatarUrl || "/placeholder.svg"}
                            alt={selectedMatchData.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-white font-medium text-xs">
                            {selectedMatchData.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{selectedMatchData.name}</p>
                        <p className="text-zinc-400 text-xs">{selectedMatchData.title}</p>
                      </div>
                      <div className="ml-auto">
                        <Button
                          size="sm"
                          onClick={() => handleProposeCoffeeChat(selectedMatchData.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Coffee className="w-4 h-4 mr-1" />
                          Coffee Chat
                        </Button>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderId === "current-user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                              message.senderId === "current-user" ? "bg-blue-600 text-white" : "bg-zinc-600 text-white"
                            }`}
                          >
                            <p>{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.senderId === "current-user" ? "text-blue-200" : "text-zinc-400"
                              }`}
                            >
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-zinc-600/50">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1 px-3 py-2 bg-zinc-600 border border-zinc-500 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500"
                          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        />
                        <Button onClick={handleSendMessage} size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-zinc-400">
                    <div className="text-center">
                      <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Select a conversation to start messaging</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "coffee" && (
          <motion.div
            key="coffee"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-medium">Coffee Chat Requests</h4>
              <div className="text-sm text-zinc-400">Schedule 1:1 meetings</div>
            </div>

            {coffeeChats.map((chat) => {
              const matchData = matches.find((m) => m.id === chat.matchId)
              if (!matchData) return null

              return (
                <div key={chat.id} className="bg-zinc-700/30 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      {matchData.avatarUrl ? (
                        <img
                          src={matchData.avatarUrl || "/placeholder.svg"}
                          alt={matchData.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-medium text-sm">
                          {matchData.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-white font-medium">{matchData.name}</h5>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            chat.status === "pending"
                              ? "bg-yellow-600/20 text-yellow-400"
                              : chat.status === "confirmed"
                                ? "bg-green-600/20 text-green-400"
                                : "bg-red-600/20 text-red-400"
                          }`}
                        >
                          {chat.status}
                        </span>
                      </div>
                      <p className="text-zinc-400 text-sm mb-3">
                        {matchData.title} • {matchData.company}
                      </p>

                      <div className="space-y-2 mb-3">
                        <p className="text-zinc-300 text-sm font-medium">Proposed Times:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {chat.proposedTimes.map((time, index) => (
                            <button
                              key={index}
                              className="px-3 py-2 bg-zinc-600/50 hover:bg-blue-600/30 rounded-lg text-sm text-zinc-300 hover:text-white transition-colors border border-zinc-600 hover:border-blue-500"
                            >
                              <Calendar className="w-4 h-4 inline mr-1" />
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>

                      {chat.location && (
                        <p className="text-zinc-400 text-sm mb-3">
                          <span className="font-medium">Location:</span> {chat.location}
                        </p>
                      )}

                      {chat.status === "pending" && (
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Confirm
                          </Button>
                          <Button size="sm" variant="outline" className="border-zinc-600 text-zinc-300 bg-transparent">
                            Reschedule
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {coffeeChats.length === 0 && (
              <div className="text-center py-8 text-zinc-400">
                <Coffee className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No coffee chats scheduled yet</p>
                <p className="text-sm">Start conversations to schedule meetings</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "saved" && (
          <motion.div
            key="saved"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-medium">Saved Matches</h4>
              <div className="text-sm text-zinc-400">Your top connections</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matches.slice(0, 4).map((match) => (
                <div key={match.id} className="bg-zinc-700/30 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
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
                      <p className="text-zinc-400 text-sm">{match.title}</p>
                    </div>
                    <div className="ml-auto">
                      <div className="text-green-400 font-medium text-sm">{match.matchScore}%</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedMatch(match.id)
                        setActiveTab("messages")
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleProposeCoffeeChat(match.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Coffee className="w-4 h-4 mr-1" />
                      Coffee
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
