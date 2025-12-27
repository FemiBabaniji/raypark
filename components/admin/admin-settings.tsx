"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ShieldAlert, ShieldCheck, Palette } from "lucide-react"
import { enableAdminRestriction, disableAdminRestriction } from "@/app/actions/admin-settings"
import { useTheme } from "@/lib/theme-context"
import { THEMES, type ThemeName } from "@/lib/theme-colors"
import { whitelabelThemes, type WhitelabelTheme } from "@/lib/whitelabel-themes"

interface AdminSettingsProps {
  communityId: string
  currentUserId: string
}

export function AdminSettings({ communityId, currentUserId }: AdminSettingsProps) {
  const [restricted, setRestricted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const { theme, setTheme, whitelabelTheme, setWhitelabelTheme } = useTheme()

  useEffect(() => {
    async function loadSettings() {
      const supabase = createClient()
      const { data } = await supabase
        .from("communities")
        .select("admin_access_restricted")
        .eq("id", communityId)
        .single()

      if (data) {
        setRestricted(data.admin_access_restricted || false)
      }
      setLoading(false)
    }

    loadSettings()
  }, [communityId])

  const handleToggle = async () => {
    if (!restricted) {
      setShowConfirmModal(true)
    } else {
      await saveRestrictionSetting(false)
    }
  }

  const confirmEnableRestriction = async () => {
    setShowConfirmModal(false)
    await saveRestrictionSetting(true)
  }

  const saveRestrictionSetting = async (enableRestriction: boolean) => {
    setSaving(true)
    setMessage(null)

    try {
      const result = enableRestriction
        ? await enableAdminRestriction(communityId)
        : await disableAdminRestriction(communityId)

      if (!result.success) {
        throw new Error(result.error)
      }

      setRestricted(enableRestriction)
      setMessage({
        type: "success",
        text: enableRestriction
          ? "Admin access restricted successfully. You have been added to the allowlist."
          : "Admin access restriction removed. Everyone now has admin access.",
      })
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update admin access setting",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/[0.03] border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Palette className="w-5 h-5" />
            Theme Configuration
          </CardTitle>
          <CardDescription className="text-white/60">
            Customize the appearance of event cards and overall app theme
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Event Card Colors */}
          <div className="space-y-3">
            <Label className="text-white font-medium">Event Card Colors</Label>
            <p className="text-sm text-white/60">Select the color scheme for event cards throughout the platform</p>
            <div className="flex items-center gap-2 flex-wrap">
              {(Object.keys(THEMES) as ThemeName[]).map((themeName) => (
                <button
                  key={themeName}
                  onClick={() => setTheme(themeName)}
                  className="relative w-10 h-10 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/30"
                  style={{ backgroundColor: THEMES[themeName].dotColor }}
                  aria-label={`Select ${THEMES[themeName].displayName} theme`}
                  title={THEMES[themeName].displayName}
                >
                  {theme === themeName && (
                    <span className="absolute inset-0 rounded-full ring-2 ring-white ring-offset-2 ring-offset-[#1a1a1d]" />
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-white/50">
              Current: <span className="font-medium text-white/70">{THEMES[theme].displayName}</span>
            </p>
          </div>

          {/* App Theme */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <Label className="text-white font-medium">App Theme</Label>
            <p className="text-sm text-white/60">Choose the overall visual style for the application</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(Object.keys(whitelabelThemes) as WhitelabelTheme[]).map((themeName) => (
                <button
                  key={themeName}
                  onClick={() => setWhitelabelTheme(themeName)}
                  className={`w-full px-4 py-3 text-left text-sm rounded-lg transition-all ${
                    whitelabelTheme === themeName
                      ? "bg-white/10 text-white ring-2 ring-white/20"
                      : "bg-white/5 text-white/70 hover:bg-white/8"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-md flex-shrink-0"
                      style={{ backgroundColor: whitelabelThemes[themeName].accentPrimary }}
                    />
                    <span className="font-medium">{whitelabelThemes[themeName].name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Access Control */}
      <Alert variant={restricted ? "default" : "default"}>
        <ShieldCheck className="size-4" />
        <AlertTitle>Admin Access Mode</AlertTitle>
        <AlertDescription>
          {restricted ? (
            <>
              <strong>Restricted Mode:</strong> Only users with the community_admin role can access admin features.
              Manage admin users in the "Assign Role" tab.
            </>
          ) : (
            <>
              <strong>Open Mode:</strong> All community members have admin access. This is useful for testing and early
              development. Enable restrictions when you're ready to control access.
            </>
          )}
        </AlertDescription>
      </Alert>

      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="space-y-1">
          <Label htmlFor="restrict-admin" className="text-base font-medium">
            Restrict Admin Access
          </Label>
          <p className="text-sm text-muted-foreground">
            When enabled, only users with community_admin role can access admin features
          </p>
        </div>
        <Switch id="restrict-admin" checked={restricted} onCheckedChange={handleToggle} disabled={saving} />
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="size-5 text-amber-500" />
              Enable Admin Access Restriction?
            </DialogTitle>
            <DialogDescription className="space-y-3 pt-2">
              <p>This will restrict admin access to only users with the community_admin role.</p>
              <p className="font-medium">
                You will be automatically added to the admin allowlist to ensure you don't lose access.
              </p>
              <p className="text-sm text-muted-foreground">
                After enabling, you can add more admins via the "Assign Role" tab.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button onClick={confirmEnableRestriction} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Enabling...
                </>
              ) : (
                "Enable Restriction"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
