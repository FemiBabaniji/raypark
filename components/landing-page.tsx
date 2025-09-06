"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Share } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()
  const [claimUrl, setClaimUrl] = useState("")

  const handleGetStarted = () => {
    router.push("/auth")
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Hero Section */}
      <div className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="lg:w-1/2">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex -space-x-2">
                  {[
                    "/professional-headshot.png",
                    "/man-developer.png",
                    "/woman-designer.png",
                    "/woman-analyst.png",
                  ].map((src, i) => (
                    <Avatar key={i} className="w-10 h-10 border-2 border-zinc-900">
                      <AvatarImage src={src || "/placeholder.svg"} className="object-cover" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="w-4 h-4 text-yellow-400">
                      ⭐
                    </div>
                  ))}
                </div>
                <span className="text-zinc-400 text-sm">Loved by 10,000+ professionals</span>
              </div>

              <h1 className="text-5xl lg:text-7xl text-white mb-6 leading-tight">
                Build your
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent [&:not(:has(.bg-clip-text))]:text-purple-400">
                  {" "}
                  professional
                </span>{" "}
                portfolio
              </h1>

              <p className="text-xl text-zinc-300 mb-8 leading-relaxed">
                Create stunning portfolio pages that showcase your skills, projects, and expertise. Connect with
                opportunities and grow your professional network.
              </p>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center bg-zinc-800 border border-zinc-600 rounded-lg p-1">
                  <span className="text-zinc-400 text-sm px-3">pathwai.co/</span>
                  <input
                    type="text"
                    placeholder="yourname"
                    value={claimUrl}
                    onChange={(e) => setClaimUrl(e.target.value)}
                    className="bg-transparent text-white px-2 py-2 text-sm focus:outline-none min-w-0 flex-1"
                  />
                </div>
                <Button
                  onClick={handleGetStarted}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Claim
                </Button>
              </div>

              <div className="text-zinc-500 text-sm">Join thousands of professionals already on pathwai</div>
            </div>

            {/* Right Content - Phone Mockup */}
            <div className="lg:w-1/2 relative">
              <div className="relative mx-auto w-80 h-[600px]">
                {/* Phone Frame */}
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-[3rem] p-6 shadow-2xl">
                  {/* Screen */}
                  <div className="bg-zinc-900 rounded-[2.5rem] h-full p-6 relative overflow-hidden">
                    {/* Profile Card */}
                    <div className="bg-gradient-to-br from-pink-600 to-purple-700 rounded-2xl p-6 text-white relative overflow-hidden mb-4">
                      <div className="relative z-10">
                        <Avatar className="w-16 h-16 mb-4">
                          <AvatarImage src="/professional-woman-headshot.png" />
                          <AvatarFallback className="bg-purple-800 text-white">JW</AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl mb-2">Jenny Wilson</h3>
                        <p className="text-white/80 text-sm mb-4">Digital Product Designer</p>
                        <p className="text-white/70 text-xs">Content creator. Digital nomad. Let's grow together!</p>
                      </div>
                      <div className="absolute top-4 right-4">
                        <button className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                          <Share className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <button className="w-full bg-purple-600 text-white py-3 rounded-lg text-sm">Portfolio</button>
                      <button className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm">Projects ↓</button>
                      <button className="w-full bg-green-600 text-white py-3 rounded-lg text-sm">Skills</button>
                      <button className="w-full bg-red-500 text-white py-3 rounded-lg text-sm">Experience</button>
                      <button className="w-full bg-amber-600 text-white py-3 rounded-lg text-sm">Contact</button>
                    </div>

                    {/* Floating Elements */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">P</span>
                    </div>
                    <div className="absolute top-32 -left-6 w-8 h-8 bg-gradient-to-br from-pink-500 to-red-500 rounded-full"></div>
                    <div className="absolute bottom-32 -right-6 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full"></div>
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -top-4 right-4 bg-zinc-800 border border-zinc-600 rounded-lg p-3 transform rotate-6">
                  <div className="text-white text-sm">Your skills</div>
                </div>
                <div className="absolute top-32 -right-8 bg-zinc-800 border border-zinc-600 rounded-lg p-3 transform -rotate-6">
                  <div className="text-white text-sm">Your projects</div>
                </div>
                <div className="absolute bottom-24 -left-8 bg-zinc-800 border border-zinc-600 rounded-lg p-3 transform rotate-12">
                  <div className="text-white text-sm">Your network</div>
                </div>
                <div className="absolute top-48 left-4 bg-zinc-800 border border-zinc-600 rounded-lg p-3 transform -rotate-12">
                  <div className="text-white text-sm">Your story</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Ticker */}
      <div className="bg-zinc-800 py-4 border-t border-b border-zinc-700">
        <div className="flex items-center justify-center gap-12 text-zinc-300 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-600 rounded-sm"></div>
            <span>DRAG & DROP BUILDER</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-pink-600 rounded-sm"></div>
            <span>FULLY CUSTOMIZABLE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
            <span>LIVE IN MINUTES</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
            <span>PROFESSIONAL TEMPLATES</span>
          </div>
        </div>
      </div>

      {/* Why Choose Section */}
      <div className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left Content */}
            <div className="lg:w-1/2">
              <h2 className="text-4xl lg:text-5xl text-white mb-6">
                Why choose{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent [&:not(:has(.bg-clip-text))]:text-purple-400">
                  pathwai
                </span>
                ?
              </h2>
              <p className="text-xl text-zinc-300 mb-8 leading-relaxed">
                With our intuitive portfolio builder and powerful networking features, your professional presence will
                stand out. Create stunning portfolios that showcase your unique skills and connect with opportunities
                that matter.
              </p>
              <Button
                onClick={handleGetStarted}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Get Started
              </Button>
            </div>

            {/* Right Content - Feature Grid */}
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              {/* Easy to Use */}
              <Card className="bg-gradient-to-br from-blue-600 to-cyan-500 border-none text-white p-6">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                    <div className="w-6 h-6 bg-white rounded-sm"></div>
                  </div>
                  <h3 className="text-lg mb-2">Easy to use</h3>
                  <p className="text-white/80 text-sm">
                    Drag and drop interface makes building your portfolio effortless
                  </p>
                </CardContent>
              </Card>

              {/* Professional Templates */}
              <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 border-none text-white p-6">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                    <div className="grid grid-cols-2 gap-1 w-6 h-6">
                      <div className="bg-white rounded-sm"></div>
                      <div className="bg-white rounded-sm"></div>
                      <div className="bg-white rounded-sm"></div>
                      <div className="bg-white rounded-sm"></div>
                    </div>
                  </div>
                  <h3 className="text-lg mb-2">Beautiful templates</h3>
                  <p className="text-white/80 text-sm">
                    Choose from professionally designed templates that make you stand out
                  </p>
                </CardContent>
              </Card>

              {/* Always Free */}
              <Card className="bg-gradient-to-br from-amber-500 to-yellow-500 border-none text-white p-6">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-white text-lg">Free</div>
                  </div>
                  <h3 className="text-lg mb-2">Always free</h3>
                  <p className="text-white/80 text-sm">Start building your portfolio today at no cost</p>
                </CardContent>
              </Card>

              {/* Network & Connect */}
              <Card className="bg-gradient-to-br from-pink-500 to-rose-500 border-none text-white p-6">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                    <div className="flex -space-x-1">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <h3 className="text-lg mb-2">Network & connect</h3>
                  <p className="text-white/80 text-sm">Discover and connect with other professionals in your field</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 lg:py-24 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl text-white mb-6">Ready to showcase your professional story?</h2>
          <p className="text-xl text-zinc-300 mb-8">
            Join thousands of professionals who trust pathwai to build stunning portfolios and connect with
            opportunities.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-lg"
            >
              Start Building Your Portfolio
            </Button>
            <Button
              variant="outline"
              className="px-8 py-4 border border-zinc-600 text-zinc-300 hover:text-white hover:border-zinc-500 rounded-lg transition-colors text-lg bg-transparent"
              onClick={() => router.push("/dashboard")}
            >
              View Examples
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-zinc-950 py-12 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-purple-600 text-white text-sm">P</AvatarFallback>
              </Avatar>
              <span className="text-lg text-white">pathwai</span>
            </div>

            <div className="flex items-center gap-8 text-zinc-400 text-sm">
              <button className="hover:text-white transition-colors">Privacy</button>
              <button className="hover:text-white transition-colors">Terms</button>
              <button className="hover:text-white transition-colors">Support</button>
              <button className="hover:text-white transition-colors">Contact</button>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-zinc-800 text-center text-zinc-500 text-sm">
            © 2024 pathwai. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
