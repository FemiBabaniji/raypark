"use client"

import { useRouter } from "next/navigation"
import PortfolioShell from "@/components/portfolio/portfolio-shell"

export default function TestBEAPage() {
  const router = useRouter()

  return (
    <PortfolioShell title="Test BEA Logo" logoSrc="/bea-logo.svg" onBack={() => router.push("/")}>
      <div className="flex-1 bg-neutral-900/50 backdrop-blur-xl rounded-3xl p-8">
        <h2 className="text-2xl font-bold text-white mb-4">Test Page</h2>
        <p className="text-neutral-400">
          This page is for testing the BEA logo link functionality. Click on the BEA logo in the center of the header to
          test the navigation.
        </p>
      </div>
    </PortfolioShell>
  )
}
