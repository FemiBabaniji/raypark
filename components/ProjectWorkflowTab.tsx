"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Calendar, Tag } from "lucide-react"

type Project = {
  id: string
  name: string
  description: string
  status: "planning" | "in-progress" | "completed"
  tags: string[]
  dueDate?: string
}

export default function ProjectWorkflowTab() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Portfolio Website",
      description: "Modern portfolio website with interactive components",
      status: "in-progress",
      tags: ["React", "Next.js", "TypeScript"],
      dueDate: "2024-02-15",
    },
    {
      id: "2",
      name: "Mobile App Design",
      description: "UI/UX design for mobile application",
      status: "planning",
      tags: ["Figma", "Design", "Mobile"],
      dueDate: "2024-03-01",
    },
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "planning" as const,
    tags: "",
    dueDate: "",
  })

  const handleAddProject = () => {
    if (newProject.name.trim()) {
      const project: Project = {
        id: Date.now().toString(),
        name: newProject.name,
        description: newProject.description,
        status: newProject.status,
        tags: newProject.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        dueDate: newProject.dueDate || undefined,
      }
      setProjects([...projects, project])
      setNewProject({ name: "", description: "", status: "planning", tags: "", dueDate: "" })
      setShowAddForm(false)
    }
  }

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "planning":
        return "bg-blue-500/20 text-blue-400"
      case "in-progress":
        return "bg-yellow-500/20 text-yellow-400"
      case "completed":
        return "bg-green-500/20 text-green-400"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Project Workflow</h1>
        <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {showAddForm && (
        <Card className="bg-neutral-800/50 border-neutral-700">
          <CardHeader>
            <CardTitle className="text-white">Add New Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Project name"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              className="bg-neutral-700/50 border-neutral-600 text-white"
            />
            <Textarea
              placeholder="Project description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="bg-neutral-700/50 border-neutral-600 text-white"
            />
            <div className="grid grid-cols-2 gap-4">
              <select
                value={newProject.status}
                onChange={(e) => setNewProject({ ...newProject, status: e.target.value as Project["status"] })}
                className="bg-neutral-700/50 border border-neutral-600 rounded-md px-3 py-2 text-white"
              >
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <Input
                type="date"
                value={newProject.dueDate}
                onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
                className="bg-neutral-700/50 border-neutral-600 text-white"
              />
            </div>
            <Input
              placeholder="Tags (comma separated)"
              value={newProject.tags}
              onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
              className="bg-neutral-700/50 border-neutral-600 text-white"
            />
            <div className="flex gap-2">
              <Button onClick={handleAddProject} className="bg-green-600 hover:bg-green-700">
                Add Project
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="border-neutral-600 text-neutral-300 hover:bg-neutral-700"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {projects.map((project) => (
          <Card key={project.id} className="bg-neutral-800/50 border-neutral-700">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-white">{project.name}</CardTitle>
                  <p className="text-neutral-400 mt-1">{project.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="text-neutral-400 hover:text-white">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm">
                <Badge className={getStatusColor(project.status)}>{project.status.replace("-", " ")}</Badge>
                {project.dueDate && (
                  <div className="flex items-center gap-1 text-neutral-400">
                    <Calendar className="w-4 h-4" />
                    {project.dueDate}
                  </div>
                )}
                {project.tags.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Tag className="w-4 h-4 text-neutral-400" />
                    <div className="flex gap-1">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-neutral-600 text-neutral-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
