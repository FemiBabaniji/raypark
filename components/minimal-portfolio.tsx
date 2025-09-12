import { Card } from "@/components/ui/card"

export default function MinimalPortfolio() {
  const projects = [
    {
      title: "AI Analytics Dashboard",
      description: "Real-time insights and complex queries powered by machine learning algorithms",
    },
    {
      title: "AI Analytics Dashboard",
      description: "Real-time insights and complex queries powered by machine learning algorithms",
    },
    {
      title: "AI Analytics Dashboard",
      description: "Real-time insights and complex queries powered by machine learning algorithms",
    },
    {
      title: "AI Analytics Dashboard",
      description: "Real-time insights and complex queries powered by machine learning algorithms",
    },
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Card className="bg-card border-border p-6 text-center rounded-3xl">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <div>
                <h1 className="text-foreground text-lg font-medium">John</h1>
                <p className="text-muted-foreground text-sm mt-1">building the future of professional networking</p>
              </div>
              <button className="bg-muted hover:bg-muted/80 text-foreground px-6 py-2 rounded-xl text-sm transition-colors">
                edit profile
              </button>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card border-border rounded-3xl h-80"></Card>

            {/* Projects Portfolio */}
            <Card className="bg-card border-border p-6 rounded-3xl">
              <h2 className="text-foreground text-lg font-medium mb-6">Projects Portfolio</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project, index) => (
                  <Card key={index} className="bg-muted border-border p-4 rounded-2xl">
                    <div className="h-24 bg-muted-foreground/20 rounded-xl mb-3"></div>
                    <h3 className="text-foreground font-medium text-sm mb-2">{project.title}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">{project.description}</p>
                  </Card>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            <Card className="bg-card border-border h-24 rounded-3xl"></Card>
            <Card className="bg-card border-border h-20 rounded-3xl"></Card>

            {/* Education Section */}
            <Card className="bg-card border-border p-4 rounded-3xl">
              <h3 className="text-foreground text-sm font-medium mb-4">Education</h3>
              <div className="space-y-3">
                <Card className="bg-muted border-border p-3 rounded-2xl">
                  <h4 className="text-foreground text-sm font-medium">MS Computer Science</h4>
                  <p className="text-muted-foreground text-xs">Stanford University</p>
                </Card>
                <Card className="bg-muted border-border p-3 rounded-2xl">
                  <h4 className="text-foreground text-sm font-medium">MS Computer Science</h4>
                </Card>
                <Card className="bg-muted border-border p-3 rounded-2xl">
                  <h4 className="text-foreground text-sm font-medium">MS Computer Science</h4>
                </Card>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
