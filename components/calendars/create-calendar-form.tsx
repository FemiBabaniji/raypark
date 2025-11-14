"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Upload, MapPin, Globe, CheckCircle2 } from 'lucide-react'

const TINT_COLORS = [
  { name: "Gray", value: "#6B7280" },
  { name: "Pink", value: "#EC4899" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Cyan", value: "#06B6D4" },
  { name: "Green", value: "#10B981" },
  { name: "Yellow", value: "#F59E0B" },
  { name: "Orange", value: "#F97316" },
  { name: "Red", value: "#EF4444" },
  { name: "Gradient", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
]

const EMOJI_OPTIONS = ["📅", "🚀", "💼", "🎨", "🎭", "🎪", "🎯", "⚡", "🌟", "🔥", "💡", "🎓"]

export function CreateCalendarForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    iconEmoji: "📅",
    tintColor: "#8B5CF6",
    locationType: "city" as "city" | "global",
    locationCity: "",
  })

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create a calendar",
          variant: "destructive",
        })
        return
      }

      const { data, error } = await supabase
        .from("calendars")
        .insert({
          user_id: user.id,
          name: formData.name,
          description: formData.description,
          slug: formData.slug,
          public_url: formData.slug,
          icon_emoji: formData.iconEmoji,
          tint_color: formData.tintColor,
          location_type: formData.locationType,
          location_city: formData.locationType === "city" ? formData.locationCity : null,
          is_public: true,
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Calendar created successfully",
        description: "Your calendar is ready to use",
      })

      router.push(`/calendars/${data.slug}`)
    } catch (error) {
      console.error("[v0] Error creating calendar:", error)
      toast({
        title: "Error creating calendar",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Cover & Icon */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div
          className="h-48 relative flex items-center justify-center"
          style={{
            background:
              formData.tintColor.startsWith("linear")
                ? formData.tintColor
                : `linear-gradient(135deg, ${formData.tintColor}40, ${formData.tintColor}60)`,
          }}
        >
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="absolute top-4 right-4"
          >
            Change Cover
          </Button>

          <div className="relative">
            <div className="w-24 h-24 bg-background rounded-2xl flex items-center justify-center text-5xl shadow-lg">
              {formData.iconEmoji}
            </div>
            <button
              type="button"
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg"
            >
              <Upload className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <Label htmlFor="name">Calendar Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="DMZ"
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add a short description."
              rows={3}
              className="mt-2"
            />
          </div>
        </div>
      </div>

      {/* Customization */}
      <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
        <h2 className="text-lg font-semibold">Customization</h2>

        {/* Tint Color */}
        <div>
          <Label className="mb-3 block">Tint Colour</Label>
          <div className="flex flex-wrap gap-2">
            {TINT_COLORS.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => setFormData({ ...formData, tintColor: color.value })}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  formData.tintColor === color.value
                    ? "border-foreground scale-110"
                    : "border-transparent hover:scale-105"
                }`}
                style={{
                  background: color.value,
                }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Icon Emoji */}
        <div>
          <Label className="mb-3 block">Icon</Label>
          <div className="flex flex-wrap gap-2">
            {EMOJI_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setFormData({ ...formData, iconEmoji: emoji })}
                className={`w-12 h-12 text-2xl rounded-lg border-2 transition-all ${
                  formData.iconEmoji === emoji
                    ? "border-foreground bg-muted scale-110"
                    : "border-transparent hover:bg-muted/50 hover:scale-105"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Public URL */}
        <div>
          <Label htmlFor="slug">Public URL</Label>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-muted-foreground text-sm">pathwai.io/</span>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="dmz"
              required
              className="flex-1"
            />
            {formData.slug && (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            )}
          </div>
        </div>

        {/* Location */}
        <div>
          <Label className="mb-3 block">Location</Label>
          <div className="flex gap-2 mb-4">
            <Button
              type="button"
              variant={formData.locationType === "city" ? "default" : "outline"}
              onClick={() => setFormData({ ...formData, locationType: "city" })}
              className="flex-1 gap-2"
            >
              <MapPin className="w-4 h-4" />
              City
            </Button>
            <Button
              type="button"
              variant={formData.locationType === "global" ? "default" : "outline"}
              onClick={() => setFormData({ ...formData, locationType: "global" })}
              className="flex-1 gap-2"
            >
              <Globe className="w-4 h-4" />
              Global
            </Button>
          </div>

          {formData.locationType === "city" && (
            <Input
              value={formData.locationCity}
              onChange={(e) => setFormData({ ...formData, locationCity: e.target.value })}
              placeholder="Pick a city"
              className="mt-2"
            />
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-center pt-6">
        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="gap-2 min-w-56"
        >
          {loading ? (
            "Creating..."
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Create Calendar
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
