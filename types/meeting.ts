export interface Meeting {
  id: string
  title: string
  date: string
  time: string
  host: string
  attendees: number
  type: "1-on-1" | "team" | "all-hands"
}
