"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Key, Lock, Smartphone, CheckCircle2 } from 'lucide-react'
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'

interface PasskeyAuthModalProps {
  open: boolean
  onClose: () => void
}

export function PasskeyAuthModal({ open, onClose }: PasskeyAuthModalProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleCreatePasskey = async () => {
    setLoading(true)
    
    try {
      // Note: Actual passkey implementation requires WebAuthn API
      // This is a simplified version showing the UI flow
      
      toast({
        title: "Passkey created",
        description: "You can now sign in without a password",
      })
      
      onClose()
      router.push("/dashboard")
    } catch (error) {
      console.error("[v0] Passkey error:", error)
      toast({
        title: "Error creating passkey",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl">Create a Passkey</DialogTitle>
          <p className="text-muted-foreground text-sm">
            Passkeys are a fast and secure way to sign in.
          </p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <Key className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium mb-1">Sign in without password or code</p>
              <p className="text-sm text-muted-foreground">
                No more remembering complex passwords
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium mb-1">Encrypted by your device</p>
              <p className="text-sm text-muted-foreground">
                Your passkey is stored securely on your device
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium mb-1">Works across all your devices</p>
              <p className="text-sm text-muted-foreground">
                Sync via iCloud, Google Password Manager, etc.
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mb-4">
          Your existing password will still work. You can update your sign in methods at any time.
        </p>

        <div className="flex flex-col gap-2">
          <Button
            onClick={handleCreatePasskey}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Creating..." : "Create Passkey"}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
          >
            Not Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
