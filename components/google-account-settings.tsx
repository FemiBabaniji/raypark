"use client"

import { Check, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"

type AccountConnection = {
  id: string
  name: string
  icon: React.ReactNode
  email?: string
  connected: boolean
}

type GoogleAccountSettingsProps = {
  onConnect: (accountId: string) => void
  onDisconnect: (accountId: string) => void
}

export default function GoogleAccountSettings({
  onConnect,
  onDisconnect,
}: GoogleAccountSettingsProps) {
  const accounts: AccountConnection[] = [
    {
      id: "google",
      name: "Google",
      email: "ofbabaniji@gmail.com",
      connected: true,
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ),
    },
    {
      id: "apple",
      name: "Apple",
      connected: false,
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
        </svg>
      ),
    },
    {
      id: "zoom",
      name: "Zoom",
      connected: false,
      icon: (
        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
            <path d="M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0"/>
          </svg>
        </div>
      ),
    },
  ]

  return (
    <div className="bg-zinc-900 rounded-2xl p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Third Party Accounts</h2>
        <p className="text-zinc-400 text-sm">
          Link your accounts to sign in to Luma and automate your workflows.
        </p>
      </div>

      <div className="space-y-3">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="bg-zinc-800 rounded-xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              {account.icon}
              <div>
                <div className="text-white font-medium">{account.name}</div>
                <div className="text-zinc-400 text-sm">
                  {account.connected ? account.email : "Not Linked"}
                </div>
              </div>
            </div>

            <button
              onClick={() => account.connected ? onDisconnect(account.id) : onConnect(account.id)}
              className={`p-2 rounded-full transition-colors ${
                account.connected
                  ? "bg-green-500/20 text-green-400"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {account.connected ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>
        ))}
      </div>

      {/* Account Syncing Section */}
      <div className="pt-6 border-t border-zinc-800">
        <h3 className="text-lg font-semibold text-white mb-4">Account Syncing</h3>
        
        <div className="space-y-3">
          <div className="bg-zinc-800 rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-white font-medium">Calendar Syncing</span>
                </div>
                <p className="text-zinc-400 text-sm">
                  Sync your Luma events with your Google, Outlook, or Apple calendar.
                </p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="bg-zinc-700 hover:bg-zinc-600 text-white ml-4"
              >
                Add iCal Subscription
              </Button>
            </div>
          </div>

          <div className="bg-zinc-800 rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-5 h-5 text-zinc-400" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-white font-medium">Sync Contacts with Google</span>
                </div>
                <p className="text-zinc-400 text-sm">
                  Sync your Gmail contacts to easily invite them to your events.
                </p>
              </div>
              <Button
                size="sm"
                variant="default"
                className="bg-white hover:bg-zinc-100 text-zinc-900 ml-4"
              >
                Enable Syncing
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
