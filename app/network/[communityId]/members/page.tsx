"use client"

import { useRouter, useParams } from "next/navigation"
import { NetworkPage, type Person } from "@/components/network-page"

const communityMembers = {
  "tech-innovators-sf": [
    {
      id: "jenny-wilson",
      name: "Jenny Wilson",
      title: "Digital Product Designer",
      org: "Tech Startup",
      email: "jenny@acme.com",
      location: "San Francisco, CA",
      handle: "@jennywilson",
      initials: "JW",
      avatarUrl: "/woman-designer.png",
      tags: ["UI/UX", "Figma", "Prototyping"],
      variant: "purple" as const,
    },
    {
      id: "john-doe",
      name: "John Doe",
      title: "Data Scientist",
      org: "State University",
      email: "john@datastam.edu",
      location: "San Francisco, CA",
      handle: "@johndoe",
      initials: "JD",
      tags: ["Python", "ML", "Analytics"],
      variant: "blue" as const,
    },
    {
      id: "sarah-chen",
      name: "Sarah Chen",
      title: "Frontend Developer",
      org: "Tech Startup",
      email: "sarah@techstartup.io",
      location: "San Francisco, CA",
      handle: "@sarahcodes",
      initials: "SC",
      avatarUrl: "/professional-headshot.png",
      tags: ["React", "TypeScript", "CSS"],
      variant: "emerald" as const,
    },
    {
      id: "mike-rodriguez",
      name: "Mike Rodriguez",
      title: "Product Manager",
      org: "Innovation Labs",
      email: "mike@innovationlabs.com",
      location: "San Francisco, CA",
      handle: "@mikepm",
      initials: "MR",
      tags: ["Strategy", "Analytics", "Leadership"],
      variant: "orange" as const,
    },
    {
      id: "alex-thompson",
      name: "Alex Thompson",
      title: "Software Engineer",
      org: "Tech Solutions",
      email: "alex@techsolutions.com",
      location: "San Francisco, CA",
      handle: "@alexdev",
      initials: "AT",
      tags: ["Node.js", "AWS", "Docker"],
      variant: "purple" as const,
    },
    {
      id: "lisa-martinez",
      name: "Lisa Martinez",
      title: "UX Researcher",
      org: "Design Studio",
      email: "lisa@designstudio.co",
      location: "San Francisco, CA",
      handle: "@lisamartinez",
      initials: "LM",
      tags: ["Research", "Testing", "Analytics"],
      variant: "pink" as const,
    },
  ] as Person[],
  "black-entrepreneurship-alliance": [
    {
      id: "marcus-johnson",
      name: "Marcus Johnson",
      title: "CEO & Founder",
      org: "TechVentures",
      email: "marcus@techventures.com",
      location: "Atlanta, GA",
      handle: "@marcusj",
      initials: "MJ",
      tags: ["Leadership", "Strategy", "Fundraising"],
      variant: "purple" as const,
    },
    {
      id: "aisha-williams",
      name: "Aisha Williams",
      title: "Marketing Director",
      org: "Growth Agency",
      email: "aisha@growthagency.com",
      location: "New York, NY",
      handle: "@aishawilliams",
      initials: "AW",
      tags: ["Marketing", "Growth", "Branding"],
      variant: "emerald" as const,
    },
  ] as Person[],
}

export default function CommunityMembersPage() {
  const router = useRouter()
  const params = useParams()
  const communityId = params.communityId as string

  const members = communityMembers[communityId as keyof typeof communityMembers] || []

  const communityNames = {
    "tech-innovators-sf": "Tech Innovators SF",
    "black-entrepreneurship-alliance": "Black Entrepreneurship Alliance",
  }

  const communityName = communityNames[communityId as keyof typeof communityNames] || "Community"

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => router.push(`/network/${communityId}`)}
          className="text-zinc-400 hover:text-white transition-colors text-sm flex items-center gap-2"
        >
          ← Back
        </button>
      </div>

      <NetworkPage
        people={members}
        onOpenPortfolio={(personId) => console.log("View member profile:", personId)}
        onInvite={() => console.log("Invite new member")}
      />
    </div>
  )
}
