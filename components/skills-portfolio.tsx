"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Code2,
  Database,
  Globe,
  Smartphone,
  Server,
  GitBranch,
  Mail,
  MapPin,
  Calendar,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Download,
} from "lucide-react"

const skills = [
  { name: "JavaScript", icon: Code2, level: 95 },
  { name: "TypeScript", icon: Code2, level: 90 },
  { name: "React", icon: Globe, level: 92 },
  { name: "Next.js", icon: Globe, level: 88 },
  { name: "Node.js", icon: Server, level: 85 },
  { name: "PostgreSQL", icon: Database, level: 80 },
  { name: "React Native", icon: Smartphone, level: 75 },
  { name: "Git", icon: GitBranch, level: 90 },
]

const projects = [
  {
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.",
    technologies: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
    image: "/placeholder.svg?height=200&width=400",
    link: "#",
    github: "#",
  },
  {
    title: "Task Management App",
    description:
      "Collaborative project management tool with real-time updates, team collaboration, and progress tracking.",
    technologies: ["React", "Node.js", "Socket.io", "MongoDB"],
    image: "/placeholder.svg?height=200&width=400",
    link: "#",
    github: "#",
  },
  {
    title: "Weather Analytics Dashboard",
    description: "Data visualization platform for weather patterns with interactive charts and predictive analytics.",
    technologies: ["React", "D3.js", "Python", "FastAPI"],
    image: "/placeholder.svg?height=200&width=400",
    link: "#",
    github: "#",
  },
]

const experience = [
  {
    title: "Senior Full Stack Developer",
    company: "TechCorp Inc.",
    period: "2022 - Present",
    description:
      "Led development of microservices architecture serving 100k+ users. Mentored junior developers and implemented CI/CD pipelines.",
  },
  {
    title: "Frontend Developer",
    company: "StartupXYZ",
    period: "2020 - 2022",
    description:
      "Built responsive web applications using React and TypeScript. Collaborated with design team to implement pixel-perfect UIs.",
  },
  {
    title: "Junior Developer",
    company: "WebSolutions Ltd.",
    period: "2019 - 2020",
    description:
      "Developed and maintained client websites using modern web technologies. Gained experience in full-stack development.",
  },
]

export default function SkillsPortfolio() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Handle form submission here
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-primary-foreground"
            >
              Portfolio
            </motion.div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#skills" className="text-primary-foreground hover:text-primary-foreground/80 transition-colors">
                Skills
              </a>
              <a
                href="#projects"
                className="text-primary-foreground hover:text-primary-foreground/80 transition-colors"
              >
                Projects
              </a>
              <a
                href="#experience"
                className="text-primary-foreground hover:text-primary-foreground/80 transition-colors"
              >
                Experience
              </a>
              <a href="#contact" className="text-primary-foreground hover:text-primary-foreground/80 transition-colors">
                Contact
              </a>
            </div>
            <Button variant="secondary" size="sm" className="hidden md:flex items-center gap-2">
              <Download className="w-4 h-4" />
              Resume
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 text-balance">Full Stack Developer</h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
              Crafting digital experiences with modern technologies and clean, efficient code
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                View My Work
              </Button>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                  <Github className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Linkedin className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Twitter className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-6 bg-muted/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">Technical Skills</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A comprehensive toolkit of modern technologies and frameworks
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <skill.icon className="w-12 h-12 mx-auto mb-4 text-accent" />
                    <h3 className="font-semibold text-card-foreground mb-2">{skill.name}</h3>
                    <div className="w-full bg-muted rounded-full h-2 mb-2">
                      <motion.div
                        className="bg-accent h-2 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">{skill.level}%</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">Featured Projects</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A selection of recent work showcasing different technologies and approaches
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow group">
                  <div className="relative overflow-hidden">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-card-foreground">{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Live Demo
                      </Button>
                      <Button size="sm" variant="outline">
                        <Github className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-6 bg-muted/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">Work Experience</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Professional journey and key achievements in software development
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {experience.map((job, index) => (
              <motion.div
                key={job.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative pl-8 pb-12 last:pb-0"
              >
                {/* Timeline line */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />
                {/* Timeline dot */}
                <div className="absolute left-0 top-2 w-3 h-3 bg-accent rounded-full transform -translate-x-1/2" />

                <Card>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle className="text-card-foreground">{job.title}</CardTitle>
                        <CardDescription className="text-lg font-medium">{job.company}</CardDescription>
                      </div>
                      <div className="flex items-center text-muted-foreground mt-2 md:mt-0">
                        <Calendar className="w-4 h-4 mr-2" />
                        {job.period}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{job.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">Get In Touch</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Ready to collaborate on your next project? Let's discuss how we can work together
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h3 className="text-2xl font-semibold text-foreground mb-6">Let's Connect</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-accent" />
                  <span className="text-muted-foreground">hello@developer.com</span>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="w-5 h-5 text-accent" />
                  <span className="text-muted-foreground">San Francisco, CA</span>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <Button variant="outline" size="icon">
                  <Github className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <Linkedin className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <Twitter className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Input
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        name="email"
                        type="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Textarea
                        name="message"
                        placeholder="Your Message"
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Portfolio. Built with Next.js and Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  )
}
