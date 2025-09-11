"use client"

import { useState } from "react"
import { CommunitySelection } from "./community-selection"
import { CommunityDetail } from "./community-detail"
import { EventDetail } from "./event-detail"

interface Community {
  name: string
  subtitle: string
  members: string
  gradient: string
  icon: string
}

interface Event {
  title: string
  date: string
  time: string
  location: string
  description: string
  attending: number
  gradient: string
}

export function NetworkContainer() {
  const [networkView, setNetworkView] = useState("communities")
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  if (networkView === "communities") {
    return <CommunitySelection setSelectedCommunity={setSelectedCommunity} setNetworkView={setNetworkView} />
  }

  if (networkView === "event" && selectedEvent) {
    return <EventDetail selectedEvent={selectedEvent} setNetworkView={setNetworkView} />
  }

  if (networkView === "detail" && selectedCommunity) {
    return (
      <CommunityDetail
        selectedCommunity={selectedCommunity}
        setNetworkView={setNetworkView}
        setSelectedEvent={setSelectedEvent}
      />
    )
  }

  return null
}
