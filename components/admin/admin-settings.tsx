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
import { Loader2, ShieldAlert, ShieldCheck } from "lucide-react"
import { enableAdminRestriction, disableAdminRestriction } from "@/app/actions/admin-settings"

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
      // About to enable restriction - show confirmation modal
      setShowConfirmModal(true)
    } else {
      // Disabling restriction - no confirmation needed
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
