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
            className="border-2 border-white rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/30"
            style={{ backgroundColor: "oklch(0.145 0 0)" }}
          >
            <div
              className="border border-white rounded-lg w-32 h-20 flex items-center justify-center mx-auto mb-4 p-3"
              style={{ backgroundColor: "oklch(0.145 0 0)" }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="bg-gradient-to-br from-pink-500 via-purple-500 to-blue-600 w-10 h-10 rounded flex items-center justify-center text-lg font-black relative"
                  style={{ color: "#FFFFFF" }}
                >
                  <div className="absolute border-2 border-white/80 rounded w-8 h-8"></div>
                  <div className="absolute border border-white/60 rounded w-7 h-7"></div>
                  <div className="absolute border border-white/40 rounded w-6 h-6"></div>B
                </div>
                <div className="text-sm font-semibold leading-tight" style={{ color: "#FFFFFF" }}>
                  <div>Black</div>
                  <div>Entrepreneurship</div>
                  <div>Alliance.</div>
                </div>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: "#FFFFFF" }}>
              Black Entrepreneurship Alliance
            </h3>
            <p className="text-sm" style={{ color: "#B3B3B3" }}>
              342 active members
            </p>
          </div>

          <div
            onClick={() => handleCommunitySelect("Black Founders Network")}
            className="border-2 border-white rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/30"
            style={{ backgroundColor: "oklch(0.145 0 0)" }}
          >
            <div
              className="border border-white rounded-lg w-32 h-20 flex items-center justify-center mx-auto mb-4 p-3"
              style={{ backgroundColor: "oklch(0.145 0 0)" }}
            >
              <div className="flex items-center gap-2">
                <div className="text-3xl font-black tracking-tighter" style={{ color: "#FFFFFF" }}>
                  BFN
                </div>
                <div className="text-sm font-semibold leading-tight" style={{ color: "#FFFFFF" }}>
                  <div>Black</div>
                  <div>Founders</div>
                  <div>Network</div>
                </div>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: "#FFFFFF" }}>
              Black Founders Network
            </h3>
            <p className="text-sm" style={{ color: "#B3B3B3" }}>
              289 active members
            </p>
          </div>

          <div
            onClick={() => handleCommunitySelect("DMZ Innovation Hub")}
            className="border-2 border-white rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/30"
            style={{ backgroundColor: "oklch(0.145 0 0)" }}
          >
            <div
              className="border border-white rounded-lg w-32 h-20 flex items-center justify-center mx-auto mb-4 p-3"
              style={{ backgroundColor: "oklch(0.145 0 0)" }}
            >
              <div className="text-4xl font-black tracking-tighter" style={{ color: "#FFFFFF" }}>
                DMZ
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: "#FFFFFF" }}>
              DMZ Innovation Hub
            </h3>
            <p className="text-sm" style={{ color: "#B3B3B3" }}>
              195 active members
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
