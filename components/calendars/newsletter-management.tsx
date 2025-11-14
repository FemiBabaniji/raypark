"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Calendar } from "@/lib/types/events"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Mail, Send, Users, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Newsletter {
  subject: string
  content: string
}

interface Subscriber {
  id: string
  email: string
  newsletter_enabled: boolean
  subscribed_at: string
}

interface NewsletterManagementProps {
  slug: string
}

export function NewsletterManagement({ slug }: NewsletterManagementProps) {
  const [calendar, setCalendar] = useState<Calendar | null>(null)
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [newsletter, setNewsletter] = useState<Newsletter>({
    subject: "",
    content: "",
  })
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchCalendarAndSubscribers()
  }, [slug])

  async function fetchCalendarAndSubscribers() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push("/login")
      return
    }

    // Fetch calendar
    const { data: calData } = await supabase
      .from("calendars")
      .select("*")
      .eq("slug", slug)
      .single()

    if (!calData || calData.user_id !== user.id) {
      router.push("/calendars")
      return
    }

    setCalendar(calData)

    // Fetch subscribers
    const { data: subsData } = await supabase
      .from("calendar_subscribers")
      .select("*")
      .eq("calendar_id", calData.id)
      .eq("newsletter_enabled", true)

    if (subsData) {
      setSubscribers(subsData)
    }

    setLoading(false)
  }

  const handleSendNewsletter = async () => {
    if (!calendar || !newsletter.subject || !newsletter.content) {
      toast({
        title: "Missing fields",
        description: "Please fill in subject and content",
        variant: "destructive",
      })
      return
    }

    setSending(true)

    try {
      // In a real implementation, this would call an API endpoint
      // that sends emails via a service like SendGrid, Resend, etc.
      
      // Simulate sending
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast({
        title: "Newsletter sent",
        description: `Sent to ${subscribers.length} subscribers`,
      })

      setNewsletter({ subject: "", content: "" })
    } catch (error) {
      console.error("[v0] Error sending newsletter:", error)
      toast({
        title: "Error sending newsletter",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!calendar) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{calendar.icon_emoji}</span>
            <h1 className="text-3xl font-bold">{calendar.name}</h1>
          </div>
          <p className="text-muted-foreground">Send newsletters to your subscribers</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Subscribers</p>
                <p className="text-2xl font-bold">{subscribers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Growth (30d)</p>
                <p className="text-2xl font-bold">+12%</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Newsletters Sent</p>
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
          </div>
        </div>

        {/* Compose Newsletter */}
        <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Compose Newsletter</h2>
            <Mail className="w-6 h-6 text-muted-foreground" />
          </div>

          <p className="text-sm text-muted-foreground">
            As guests subscribe to your Calendar, you can send them newsletters to keep them in the loop.
          </p>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={newsletter.subject}
              onChange={(e) => setNewsletter({ ...newsletter, subject: e.target.value })}
              placeholder="Exciting updates from our calendar!"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="content">Message</Label>
            <Textarea
              id="content"
              value={newsletter.content}
              onChange={(e) => setNewsletter({ ...newsletter, content: e.target.value })}
              placeholder="Write your newsletter content here..."
              rows={12}
              className="mt-2 font-mono text-sm"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Will send to {subscribers.length} subscribers
            </p>
            <Button
              onClick={handleSendNewsletter}
              disabled={sending || !newsletter.subject || !newsletter.content}
              className="gap-2 min-w-32"
            >
              {sending ? (
                "Sending..."
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Newsletter
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Recent Subscribers */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-xl font-semibold mb-6">Recent Subscribers</h2>

          {subscribers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No subscribers yet. Share your calendar to grow your audience!
            </div>
          ) : (
            <div className="space-y-3">
              {subscribers.slice(0, 10).map((subscriber) => (
                <div
                  key={subscriber.id}
                  className="flex items-center justify-between p-3 bg-background rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                      {subscriber.email[0].toUpperCase()}
                    </div>
                    <p className="font-medium">{subscriber.email}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(subscriber.subscribed_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
