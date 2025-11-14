"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Bell, BellOff } from 'lucide-react'

interface SubscribeButtonProps {
  calendarId: string
  calendarName: string
}

export function SubscribeButton({ calendarId, calendarName }: SubscribeButtonProps) {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    checkSubscription()
  }, [calendarId])

  async function checkSubscription() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const { data } = await supabase
      .from("calendar_subscribers")
      .select("id")
      .eq("calendar_id", calendarId)
      .eq("user_id", user.id)
      .single()

    setIsSubscribed(!!data)
  }

  async function handleSubscribe() {
    setLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to subscribe",
          variant: "destructive",
        })
        return
      }

      if (isSubscribed) {
        // Unsubscribe
        await supabase
          .from("calendar_subscribers")
          .delete()
          .eq("calendar_id", calendarId)
          .eq("user_id", user.id)

        setIsSubscribed(false)
        toast({
          title: "Unsubscribed",
          description: `You've unsubscribed from ${calendarName}`,
        })
      } else {
        // Subscribe
        await supabase
          .from("calendar_subscribers")
          .insert({
            calendar_id: calendarId,
            user_id: user.id,
            email: user.email!,
            newsletter_enabled: true,
          })

        setIsSubscribed(true)
        toast({
          title: "Subscribed",
          description: `You'll receive updates from ${calendarName}`,
        })
      }
    } catch (error) {
      console.error("[v0] Subscribe error:", error)
      toast({
        title: "Error",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleSubscribe}
      disabled={loading}
      variant={isSubscribed ? "outline" : "default"}
      className="gap-2"
    >
      {isSubscribed ? (
        <>
          <BellOff className="w-4 h-4" />
          Unsubscribe
        </>
      ) : (
        <>
          <Bell className="w-4 h-4" />
          Subscribe
        </>
      )}
    </Button>
  )
}
