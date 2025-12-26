"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdminStats } from "@/components/admin/admin-stats"
import { Plus, UserPlus, Upload } from "lucide-react"
import { useState } from "react"

interface AdminHomeProps {
  communityId: string
}

export function AdminHome({ communityId }: AdminHomeProps) {
  const [showCreateEvent, setShowCreateEvent] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [showImportData, setShowImportData] = useState(false)

  return (
    <div className="space-y-6">
      <AdminStats communityId={communityId} />

      <Card className="bg-white/[0.03] border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
          <CardDescription className="text-white/60">Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button
            onClick={() => setShowCreateEvent(true)}
            className="w-full justify-center h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            <Plus className="size-5" />
            Create New Event
          </Button>

          <Button
            onClick={() => setShowAddMember(true)}
            variant="secondary"
            className="w-full justify-center h-12 bg-white/[0.05] hover:bg-white/[0.08] text-white/90 font-normal border-white/10"
          >
            <UserPlus className="size-5" />
            Add Member
          </Button>

          <Button
            onClick={() => setShowImportData(true)}
            variant="secondary"
            className="w-full justify-center h-12 bg-white/[0.05] hover:bg-white/[0.08] text-white/90 font-normal border-white/10"
          >
            <Upload className="size-5" />
            Import Data
          </Button>
        </CardContent>
      </Card>

      {/* Placeholder for modals - will be implemented in phases 5-7 */}
      {showCreateEvent && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowCreateEvent(false)}
        >
          <div className="bg-[#1a1a1d] p-6 rounded-lg border border-white/10" onClick={(e) => e.stopPropagation()}>
            <p className="text-white">Create Event Modal - Coming in Phase 5</p>
            <Button onClick={() => setShowCreateEvent(false)} className="mt-4">
              Close
            </Button>
          </div>
        </div>
      )}

      {showAddMember && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowAddMember(false)}
        >
          <div className="bg-[#1a1a1d] p-6 rounded-lg border border-white/10" onClick={(e) => e.stopPropagation()}>
            <p className="text-white">Add Member Modal - Coming in Phase 6</p>
            <Button onClick={() => setShowAddMember(false)} className="mt-4">
              Close
            </Button>
          </div>
        </div>
      )}

      {showImportData && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowImportData(false)}
        >
          <div className="bg-[#1a1a1d] p-6 rounded-lg border border-white/10" onClick={(e) => e.stopPropagation()}>
            <p className="text-white">Import Data Modal - Coming in Phase 7</p>
            <Button onClick={() => setShowImportData(false)} className="mt-4">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
