"use client"

import { Mail, Phone, Linkedin, Github, Globe } from "lucide-react"

const colorOptions = [
  { name: "rose", gradient: "from-rose-400/40 to-rose-600/60" },
  { name: "blue", gradient: "from-blue-400/40 to-blue-600/60" },
  { name: "purple", gradient: "from-purple-400/40 to-purple-600/60" },
  { name: "green", gradient: "from-green-400/40 to-green-600/60" },
  { name: "orange", gradient: "from-orange-400/40 to-orange-600/60" },
  { name: "teal", gradient: "from-teal-400/40 to-teal-600/60" },
  { name: "neutral", gradient: "from-neutral-400/40 to-neutral-600/60" },
]

export interface ContactLink {
  type:
    | "email"
    | "phone"
    | "linkedin"
    | "github"
    | "website"
    | "dribbble"
    | "behance"
    | "twitter"
    | "unsplash"
    | "instagram"
  value: string
  label?: string
}

export interface UserCardProps {
  selectedColor?: number
  name: string
  description?: string
  role?: string
  industry?: string
  imageUrl?: string
  contactLinks?: ContactLink[]
  className?: string
}

const getContactIcon = (type: ContactLink["type"]) => {
  switch (type) {
    case "email":
      return Mail
    case "phone":
      return Phone
    case "linkedin":
      return Linkedin
    case "github":
      return Github
    case "website":
      return Globe
    default:
      return Mail
  }
}

export default function UserCard({
  selectedColor = 0,
  name,
  description,
  role,
  industry,
  imageUrl,
  contactLinks = [],
  className = "",
}: UserCardProps) {
  const color = colorOptions[selectedColor] || colorOptions[0]

  return (
    <div
      className={`bg-gradient-to-br ${color.gradient} rounded-3xl p-6 flex flex-col h-full min-h-[400px] ${className}`}
    >
      {/* Profile image */}
      <div className="w-16 h-16 rounded-full overflow-hidden bg-white/20 flex items-center justify-center mb-4 mx-auto">
        {imageUrl ? (
          <img src={imageUrl || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-white text-lg font-medium">
            {name
              ? name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "??"}
          </span>
        )}
      </div>

      {/* Name and description */}
      <div className="flex-1">
        <h3 className="text-white text-xl font-medium mb-1">{name || "Unknown User"}</h3>
        {role && <p className="text-white/90 text-base mb-1">{role}</p>}
        {industry && <p className="text-white/80 text-sm mb-4">{industry}</p>}

        {/* Contact links with icons inline */}
        {contactLinks.length > 0 && (
          <div className="space-y-2 mb-6">
            {contactLinks.map((contact) => {
              const Icon = getContactIcon(contact.type)
              return (
                <div key={contact.type} className="flex items-center gap-2 text-white/90 text-sm">
                  <Icon className="w-4 h-4" />
                  <span>{contact.value}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Connect button at bottom */}
      <button className="w-full bg-white/20 hover:bg-white/30 text-white py-3 rounded-lg text-sm font-medium transition-colors border border-white/20">
        Connect with {name ? name.split(" ")[0] : "User"}
      </button>
    </div>
  )
}
