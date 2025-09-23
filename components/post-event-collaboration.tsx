"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users,
  MessageCircle,
  FolderPlus,
  Download,
  Calendar,
  CheckCircle,
  Plus,
  FileText,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface Collaborator {
  id: string
  name: string
  title: string
  company: string
  avatarUrl?: string
  role: "owner" | "collaborator" | "viewer"
  joinedAt: string
}

interface ProjectSpace {
  id: string
  title: string
  description: string
  createdAt: string
  lastActivity: string
  collaborators: Collaborator[]
  status: "active" | "planning" | "completed"
  category: "startup" | "project" | "collaboration"
}

interface PostEventCollaborationProps {
  eventId: string
  eventTitle: string
  connections: any[]
}

export default function PostEventCollaboration({ eventId, eventTitle, connections }: PostEventCollaborationProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "connections">("overview")
  const [isCreatingProject, setIsCreatingProject] = useState(false)
  const [newProjectTitle, setNewProjectTitle] = useState("")
  const [newProjectDescription, setNewProjectDescription] = useState("")
  const [selectedCollaborators, setSelectedCollaborators] = useState<string[]>([])

  const [projectSpaces, setProjectSpaces] = useState<ProjectSpace[]>([
    {
      id: "wellness-app-project",
      title: "Wellness Mobile App",
      description: "Collaborative project to build a comprehensive wellness application with AI-powered features",
      createdAt: "2 days ago",
      lastActivity: "1 hour ago",
      status: "active",
      category: "startup",
      collaborators: [
        {
          id: "current-user",
          name: "Malik Johnson",
          title: "Founder",
          company: "Wellness Startup",
          role: "owner",
          joinedAt: "2 days ago",
        },
        {
          id: "jenny-wilson",
          name: "Jenny Wilson",
          title: "Digital Product Designer",
          company: "Acme Design Studio",
          avatarUrl: "/woman-designer.png",
          role: "collaborator",
          joinedAt: "2 days ago",
        },
        {
          id: "alex-rodriguez",
          name: "Alex Rodriguez",
          title: "Full Stack Developer",
          company: "TechStart Solutions",
          role: "collaborator",
          joinedAt: "1 day ago",
        },
      ],
    },
  ])

  const handleCreateProject = () => {
    if (!newProjectTitle.trim()) return

    const newProject: ProjectSpace = {
      id: `project-${Date.now()}`,
      title: newProjectTitle,
      description: newProjectDescription,
      createdAt: "Just now",
      lastActivity: "Just now",
      status: "planning",
      category: "project",
      collaborators: [
        {
          id: "current-user",
          name: "Malik Johnson",
          title: "Founder",
          company: "Wellness Startup",
          role: "owner",
          joinedAt: "Just now",
        },
        ...selectedCollaborators.map((id) => {
          const connection = connections.find((c) => c.id === id)
          return {
            id,
            name: connection?.name || "Unknown",
            title: connection?.title || "Unknown",
            company: connection?.company || "Unknown",
            avatarUrl: connection?.avatarUrl,
            role: "collaborator" as const,
            joinedAt: "Just now",
          }
        }),
      ],
    }

    setProjectSpaces((prev) => [newProject, ...prev])
    setIsCreatingProject(false)
    setNewProjectTitle("")
    setNewProjectDescription("")
    setSelectedCollaborators([])
  }

  const handleToggleCollaborator = (connectionId: string) => {
    setSelectedCollaborators((prev) =>
      prev.includes(connectionId) ? prev.filter((id) => id !== connectionId) : [...prev, connectionId],
    )
  }

  const getStatusColor = (status: ProjectSpace["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-600/20 text-green-400 border-green-500/30"
      case "planning":
        return "bg-blue-600/20 text-blue-400 border-blue-500/30"
      case "completed":
        return "bg-purple-600/20 text-purple-400 border-purple-500/30"
      default:
        return "bg-zinc-600/20 text-zinc-400 border-zinc-500/30"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-6 border border-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Post-Event Collaboration</h2>
            <p className="text-purple-300">Continue building relationships from {eventTitle}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{connections.length}</div>
            <div className="text-purple-300 text-sm">New Connections</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/20 rounded-lg p-4 text-center">
            <div className="text-xl font-bold text-white mb-1">{projectSpaces.length}</div>
            <div className="text-purple-300 text-sm">Active Projects</div>
          </div>
          <div className="bg-black/20 rounded-lg p-4 text-center">
            <div className="text-xl font-bold text-white mb-1">
              {projectSpaces.reduce((acc, project) => acc + project.collaborators.length, 0)}
            </div>
            <div className="text-purple-300 text-sm">Total Collaborators</div>
          </div>
          <div className="bg-black/20 rounded-lg p-4 text-center">
            <div className="text-xl font-bold text-white mb-1">
              {connections.filter((c) => c.hasDownloadedResume).length || 3}
            </div>
            <div className="text-purple-300 text-sm">Resumes Downloaded</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-zinc-700/30 rounded-lg p-1">
        {[
          { id: "overview", label: "Overview", icon: Users },
          { id: "projects", label: "Project Spaces", icon: FolderPlus },
          { id: "connections", label: "Connections", icon: MessageCircle },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id ? "bg-purple-600 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-700/50"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => setIsCreatingProject(true)}
                className="bg-zinc-800/50 hover:bg-zinc-800/70 rounded-xl p-4 text-left transition-colors group"
              >
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <FolderPlus className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-medium mb-1">Create Project</h3>
                <p className="text-zinc-400 text-sm">Start a new collaboration space</p>
              </button>

              <button className="bg-zinc-800/50 hover:bg-zinc-800/70 rounded-xl p-4 text-left transition-colors group">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-medium mb-1">Send Messages</h3>
                <p className="text-zinc-400 text-sm">Follow up with connections</p>
              </button>

              <button className="bg-zinc-800/50 hover:bg-zinc-800/70 rounded-xl p-4 text-left transition-colors group">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-medium mb-1">Download Resumes</h3>
                <p className="text-zinc-400 text-sm">Access shared portfolios</p>
              </button>

              <button className="bg-zinc-800/50 hover:bg-zinc-800/70 rounded-xl p-4 text-left transition-colors group">
                <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-medium mb-1">Schedule Meetings</h3>
                <p className="text-zinc-400 text-sm">Book follow-up sessions</p>
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-zinc-800/30 rounded-2xl p-6">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-white text-sm">Jenny Wilson joined "Wellness Mobile App" project</p>
                    <p className="text-zinc-400 text-xs">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-white text-sm">Alex Rodriguez shared technical requirements document</p>
                    <p className="text-zinc-400 text-xs">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-white text-sm">New project space "Wellness Mobile App" created</p>
                    <p className="text-zinc-400 text-xs">2 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "projects" && (
          <motion.div
            key="projects"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium">Project Collaboration Spaces</h3>
              <Button
                onClick={() => setIsCreatingProject(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projectSpaces.map((project) => (
                <div key={project.id} className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-white font-semibold text-lg mb-2">{project.title}</h4>
                      <p className="text-zinc-400 text-sm leading-relaxed">{project.description}</p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}
                    >
                      {project.status}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm text-zinc-400">
                    <div>Created {project.createdAt}</div>
                    <div>•</div>
                    <div>Last activity {project.lastActivity}</div>
                  </div>

                  {/* Collaborators */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-zinc-400" />
                      <span className="text-zinc-400 text-sm">{project.collaborators.length} collaborators</span>
                    </div>
                    <div className="flex -space-x-2">
                      {project.collaborators.slice(0, 4).map((collaborator) => (
                        <div
                          key={collaborator.id}
                          className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-2 border-zinc-800 flex items-center justify-center"
                        >
                          {collaborator.avatarUrl ? (
                            <img
                              src={collaborator.avatarUrl || "/placeholder.svg"}
                              alt={collaborator.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-medium text-xs">
                              {collaborator.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          )}
                        </div>
                      ))}
                      {project.collaborators.length > 4 && (
                        <div className="w-8 h-8 bg-zinc-700 rounded-full border-2 border-zinc-800 flex items-center justify-center">
                          <span className="text-zinc-400 text-xs">+{project.collaborators.length - 4}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Open Chat
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-zinc-600 text-zinc-300 bg-transparent hover:bg-zinc-700/50"
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Files
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-zinc-600 text-zinc-300 bg-transparent hover:bg-zinc-700/50"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "connections" && (
          <motion.div
            key="connections"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium">Event Connections</h3>
              <div className="text-zinc-400 text-sm">{connections.length} connections made</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connections.map((connection) => (
                <div key={connection.id} className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700">
                  <div className="flex items-center gap-3 mb-3">
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
                            .map((n: string) => n[0])
                            .join("")}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{connection.name}</h4>
                      <p className="text-zinc-400 text-sm">{connection.title}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400">Match Score</span>
                      <span className="text-green-400 font-medium">{connection.matchScore || 85}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400">Connected</span>
                      <span className="text-zinc-300">{connection.connectedAt || "During event"}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-zinc-600 text-zinc-300 bg-transparent hover:bg-zinc-700/50"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Resume
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Project Modal */}
      <AnimatePresence>
        {isCreatingProject && (
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
              className="bg-zinc-900 rounded-2xl p-6 w-full max-w-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold text-lg">Create Project Space</h3>
                <button
                  onClick={() => setIsCreatingProject(false)}
                  className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4 text-zinc-400 rotate-45" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">Project Title</label>
                  <input
                    type="text"
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                    placeholder="e.g., Wellness Mobile App"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Description</label>
                  <textarea
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    placeholder="Describe your project and collaboration goals..."
                    rows={3}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Invite Collaborators</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {connections.slice(0, 6).map((connection) => (
                      <button
                        key={connection.id}
                        onClick={() => handleToggleCollaborator(connection.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                          selectedCollaborators.includes(connection.id)
                            ? "border-purple-500 bg-purple-600/20"
                            : "border-zinc-700 hover:border-zinc-600"
                        }`}
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-xs">
                            {connection.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm truncate">{connection.name}</p>
                          <p className="text-zinc-400 text-xs truncate">{connection.title}</p>
                        </div>
                        {selectedCollaborators.includes(connection.id) && (
                          <CheckCircle className="w-4 h-4 text-purple-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setIsCreatingProject(false)}
                    variant="outline"
                    className="flex-1 border-zinc-600 text-zinc-300 bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateProject}
                    disabled={!newProjectTitle.trim()}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                  >
                    Create Project
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
