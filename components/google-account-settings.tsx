"use client"

import { Check, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'

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
  const [googleStatus, setGoogleStatus] = useState<{
    connected: boolean
    email?: string
  }>({ connected: false })

  useEffect(() => {
    checkGoogleStatus()
  }, [])

  const checkGoogleStatus = async () => {
    try {
      const response = await fetch('/api/google/auth/status')
      const data = await response.json()
      setGoogleStatus(data)
    } catch (error) {
      console.error('Failed to check Google status:', error)
    }
  }

  const handleConnect = async (accountId: string) => {
    if (accountId === 'google') {
      window.location.href = '/api/google/auth/connect'
    } else {
      onConnect(accountId)
    }
  }

  const handleDisconnect = async (accountId: string) => {
    if (accountId === 'google') {
      try {
        await fetch('/api/google/auth/disconnect', { method: 'POST' })
        setGoogleStatus({ connected: false })
      } catch (error) {
        console.error('Failed to disconnect Google:', error)
      }
    } else {
      onDisconnect(accountId)
    }
  }

  const accounts: AccountConnection[] = [
    {
      id: "google",
      name: "Google",
      email: googleStatus.email || "ofbabaniji@gmail.com",
      connected: googleStatus.connected,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
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
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
        </svg>
      ),
    },
    {
      id: "zoom",
      name: "Zoom",
      connected: false,
      icon: (
        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="white">
            <path d="M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0"/>
          </svg>
        </div>
      ),
    },
  ]

  return (
    <div className="backdrop-blur-xl rounded-2xl p-4 border border-white/5 space-y-4">
      <div>
        <h2 className="text-base font-semibold text-white mb-1">Third Party Accounts</h2>
        <p className="text-xs text-white/50">
          Link your accounts to sign in and automate your workflows.
        </p>
      </div>

      <div className="space-y-2">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="bg-[#2a2a2a] rounded-lg p-3 flex items-center justify-between border border-white/10"
          >
            <div className="flex items-center gap-3">
              {account.icon}
              <div>
                <div className="text-white text-sm font-medium">{account.name}</div>
                <div className="text-white/50 text-xs">
                  {account.connected ? account.email : "Not Linked"}
                </div>
              </div>
            </div>

            <button
              onClick={() => account.connected ? handleDisconnect(account.id) : handleConnect(account.id)}
              className={`p-1.5 rounded-full transition-colors ${
                account.connected
                  ? "bg-green-500/20 text-green-400"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {account.connected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>
        ))}
      </div>

      {/* Account Syncing Section */}
      <div className="pt-3 border-t border-white/10">
        <h3 className="text-sm font-semibold text-white mb-3">Account Syncing</h3>
        
        <div className="space-y-2">
          <div className="bg-[#2a2a2a] rounded-lg p-3 border border-white/10">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-white text-xs font-medium">Calendar Syncing</span>
                </div>
                <p className="text-white/50 text-[10px]">
                  Sync events with Google, Outlook, or Apple calendar.
                </p>
              </div>
              <button className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-medium transition-colors whitespace-nowrap">
                Add iCal
              </button>
            </div>
          </div>

          <div className="bg-[#2a2a2a] rounded-lg p-3 border border-white/10">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-white/40" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  </svg>
                  <span className="text-white text-xs font-medium">Sync Contacts</span>
                </div>
                <p className="text-white/50 text-[10px]">
                  Sync Gmail contacts to invite them to events.
                </p>
              </div>
              <button className="px-2 py-1 rounded-lg bg-white text-black hover:bg-white/90 text-[10px] font-medium transition-colors whitespace-nowrap">
                Enable
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
