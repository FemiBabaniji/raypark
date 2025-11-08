"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Panel } from "@/components/ui/panel"

interface AnnouncementCardProps {
  title: string
  content: string
  author: string
  timeAgo: string
  avatarColor: string
  isImportant?: boolean
}

export function AnnouncementCard({
  title,
  content,
  author,
  timeAgo,
  avatarColor,
  isImportant = false,
}: AnnouncementCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <li className="group">
      <Panel
        variant="module"
        className={`transition-all duration-300 ease-out overflow-hidden cursor-pointer hover:shadow-lg ${
          isExpanded ? "shadow-xl" : ""
        }`}
        style={{
          backgroundColor: isImportant ? "#2A1A4A" : "#1F1F1F",
          border: "none",
          boxShadow: "none",
          height: isExpanded ? "auto" : "80px",
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div
                className="h-12 w-12 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white text-sm"
                style={{ backgroundColor: avatarColor }}
              >
                {author.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-white truncate">{title}</h3>
                  {isImportant && (
                    <span className="px-2 py-0.5 bg-violet-500 text-white text-xs rounded-full font-medium">
                      Important
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-400 mb-2">
                  {author} • {timeAgo}
                </div>
                <div
                  className={`text-sm text-gray-300 leading-relaxed transition-all duration-300 ${
                    isExpanded ? "line-clamp-none" : "line-clamp-1"
                  }`}
                >
                  {content}
                </div>
              </div>
            </div>
            <button
              className={`h-10 w-10 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-white/10 ${
                isExpanded ? "rotate-180" : ""
              }`}
            >
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Expanded content */}
          <div
            className={`transition-all duration-300 ease-out ${
              isExpanded ? "opacity-100 mt-4" : "opacity-0 h-0 overflow-hidden"
            }`}
          >
            <div className="border-t border-gray-700 pt-4">
              <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-sm text-gray-200 leading-relaxed mb-3">{content}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-blue-500/20 text-blue-300 text-xs rounded-lg hover:bg-blue-500/30 transition-colors">
                      Read More
                    </button>
                    <button className="px-3 py-1.5 bg-gray-500/20 text-gray-300 text-xs rounded-lg hover:bg-gray-500/30 transition-colors">
                      Mark as Read
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">12 reactions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Panel>
    </li>
  )
}
