interface Event {
  title: string
  date: string
  time: string
  location: {
    name: string
    addressLine?: string
    venue?: string
    venueDetails?: string
    format?: string
  }
  description: string
  attending: number
  capacity: number
}

interface CalendarTimes {
  start: string
  end: string
}

// Calculate spots remaining for an event
export function spotsRemaining(attending: number, capacity: number): number | null {
  if (!capacity || capacity <= 0) return null
  return Math.max(0, capacity - attending)
}

// Generate OpenStreetMap embed URL
export function makeMapSrc(location: Event["location"]): string | null {
  if (!location?.addressLine && !location?.name) return null

  const query = encodeURIComponent(location.addressLine || location.name)
  // Using OpenStreetMap embed
  return `https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752641776%2C0.00030577182769775396%2C51.478569861898606&layer=mapnik&marker=51.477348694%2C-0.001856088638305664`
}

// Generate ICS calendar file
export function generateICS(event: Event, calendarTimes: CalendarTimes): Blob {
  const formatICSDate = (dateStr: string): string => {
    // Convert date string to ICS format (YYYYMMDDTHHMMSSZ)
    const date = new Date(dateStr)
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  }

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Event Calendar//EN",
    "BEGIN:VEVENT",
    `DTSTART:${formatICSDate(calendarTimes.start)}`,
    `DTEND:${formatICSDate(calendarTimes.end)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`,
    `LOCATION:${event.location.addressLine || event.location.name}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")

  return new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
}

// Sanitize filename for download
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9]/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
}

// Get initials from name
export function initials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

// Format label for display
export function formatLabel(value?: string): string {
  if (!value) return "N/A"
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}
