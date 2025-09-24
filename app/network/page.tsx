"use client"

import { useRouter } from "next/navigation"

export default function NetworkPage() {
  const router = useRouter()

  const handleCommunitySelect = (community: string) => {
    if (community === "Black Entrepreneurship Alliance") {
      router.push("/onboarding/bea")
    }
    // Add other community routes as needed
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "oklch(0.18 0 0)" }}>
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-8">
        <h1 className="text-4xl font-semibold mb-4 text-center" style={{ color: "#FFFFFF" }}>
          Choose Your Community
        </h1>
        <p className="mb-12 text-center max-w-md" style={{ color: "#B3B3B3" }}>
          Select the community you're part of to access your network and events
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl w-full">
          <div
            onClick={() => handleCommunitySelect("Black Entrepreneurship Alliance")}
            className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl bg-gradient-to-br from-neutral-900/30 to-neutral-800/20 backdrop-blur-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8 text-center">
              <div className="rounded-lg w-32 h-20 flex items-center justify-center mx-auto mb-4 p-3 group-hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-neutral-900/30 to-neutral-800/20">
                <div className="flex items-center gap-2">
                  <img
                    src="/bea-logo.svg"
                    alt="Black Entrepreneurship Alliance"
                    className="h-12 w-auto group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="text-sm font-semibold leading-tight" style={{ color: "#FFFFFF" }}>
                    <div>Black</div>
                    <div>Entrepreneurship</div>
                    <div>Alliance.</div>
                  </div>
                </div>
              </div>
              <h3
                className="text-xl font-semibold mb-2 group-hover:text-blue-300 transition-colors duration-300"
                style={{ color: "#FFFFFF" }}
              >
                Black Entrepreneurship Alliance
              </h3>
              <p className="text-sm" style={{ color: "#B3B3B3" }}>
                342 active members
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          </div>

          <div
            onClick={() => handleCommunitySelect("Black Founders Network")}
            className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl bg-gradient-to-br from-neutral-900/30 to-neutral-800/20 backdrop-blur-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-teal-500/5 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8 text-center">
              <div className="rounded-lg w-32 h-20 flex items-center justify-center mx-auto mb-4 p-3 group-hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-neutral-900/30 to-neutral-800/20">
                <div className="flex items-center gap-2">
                  <div
                    className="text-3xl font-black tracking-tighter group-hover:text-teal-300 transition-colors duration-300"
                    style={{ color: "#FFFFFF" }}
                  >
                    BFN
                  </div>
                  <div className="text-sm font-semibold leading-tight" style={{ color: "#FFFFFF" }}>
                    <div>Black</div>
                    <div>Founders</div>
                    <div>Network</div>
                  </div>
                </div>
              </div>
              <h3
                className="text-xl font-semibold mb-2 group-hover:text-teal-300 transition-colors duration-300"
                style={{ color: "#FFFFFF" }}
              >
                Black Founders Network
              </h3>
              <p className="text-sm" style={{ color: "#B3B3B3" }}>
                289 active members
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          </div>

          <div
            onClick={() => handleCommunitySelect("DMZ Innovation Hub")}
            className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl bg-gradient-to-br from-neutral-900/30 to-neutral-800/20 backdrop-blur-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8 text-center">
              <div className="rounded-lg w-32 h-20 flex items-center justify-center mx-auto mb-4 p-3 group-hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-neutral-900/30 to-neutral-800/20">
                <div
                  className="text-4xl font-black tracking-tighter group-hover:text-orange-300 transition-colors duration-300"
                  style={{ color: "#FFFFFF" }}
                >
                  DMZ
                </div>
              </div>
              <h3
                className="text-xl font-semibold mb-2 group-hover:text-orange-300 transition-colors duration-300"
                style={{ color: "#FFFFFF" }}
              >
                DMZ Innovation Hub
              </h3>
              <p className="text-sm" style={{ color: "#B3B3B3" }}>
                195 active members
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
