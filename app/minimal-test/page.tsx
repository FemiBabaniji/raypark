"use client"

import { useRouter } from "next/navigation"

export default function MinimalTestPage() {
  const router = useRouter()

  const handleBEAClick = () => {
    console.log("[v0] BEA logo clicked, navigating to BEA page")
    router.push("/network/black-entrepreneurship-alliance")
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Minimal Test Page</h1>

      <div className="space-y-4">
        <p>This is a minimal test page to check if the app loads without errors.</p>

        <button
          onClick={handleBEAClick}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Test BEA Navigation
        </button>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">BEA Logo Test</h2>
          <div
            onClick={handleBEAClick}
            className="inline-block cursor-pointer p-4 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            <img src="/bea-logo.svg" alt="BEA Logo" className="h-8 w-auto" />
          </div>
        </div>
      </div>
    </div>
  )
}
