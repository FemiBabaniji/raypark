"use client"

import JohnDoePortfolio from "@/components/john-doe-portfolio"
import BackButton from "@/components/ui/back-button"
import { useRouter } from "next/navigation"

export default function JohnDoePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="fixed top-6 left-6 z-50">
        <BackButton onClick={() => router.push("/network")} />
      </div>

      <JohnDoePortfolio isPreviewMode={true} />
    </div>
  )
}
