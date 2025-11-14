"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Calendar } from "@/lib/types/events"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { UserPlus, Trash2, Shield, Crown } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface TeamMember {
  id: string
  user_id: string
  role: 'owner' | 'admin' | 'editor'
  added_at: string
  user: {
    id: string
    email: string
    full_name: string | null
  }
}

interface TeamManagementProps {
  slug: string
}

export function TeamManagement({ slug }: TeamManagementProps) {
  const [calendar, setCalendar] = useState<Calendar | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [addingMember, setAddingMember] = useState(false)
  const [newMemberEmail, setNewMemberEmail] = useState("")
  const [newMemberRole, setNewMemberRole] = useState<'admin' | 'editor'>("editor")
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchCalendarAndTeam()
  }, [slug])

  async function fetchCalendarAndTeam() {
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

    // Fetch team members
    const { data: membersData } = await supabase
      .from("calendar_admins")
      .select(`
        *,
        user:users(*)
      `)
      .eq("calendar_id", calData.id)

    if (membersData) {
      setTeamMembers(membersData as any)
    }

    setLoading(false)
  }

  const handleAddMember = async () => {
    if (!calendar || !newMemberEmail) return
    
    setAddingMember(true)

    try {
      const supabase = createClient()

      // Find user by email
      const { data: userData } = await supabase
        .from("users")
        .select("id")
        .eq("email", newMemberEmail)
        .single()

      if (!userData) {
        toast({
          title: "User not found",
          description: "No user exists with that email",
          variant: "destructive",
        })
        return
      }

      const { data: { user } } = await supabase.auth.getUser()

      // Add team member
      const { error } = await supabase
        .from("calendar_admins")
        .insert({
          calendar_id: calendar.id,
          user_id: userData.id,
          role: newMemberRole,
          added_by: user?.id,
        })

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already a team member",
            description: "This user is already part of the team",
            variant: "destructive",
          })
        } else {
          throw error
        }
      } else {
        toast({
          title: "Team member added",
          description: `${newMemberEmail} has been added as ${newMemberRole}`,
        })
        setNewMemberEmail("")
        fetchCalendarAndTeam()
      }
    } catch (error) {
      console.error("[v0] Error adding team member:", error)
      toast({
        title: "Error adding team member",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setAddingMember(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this team member?")) return

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("calendar_admins")
        .delete()
        .eq("id", memberId)

      if (error) throw error

      toast({
        title: "Team member removed",
      })

      fetchCalendarAndTeam()
    } catch (error) {
      console.error("[v0] Error removing team member:", error)
      toast({
        title: "Error removing team member",
        description: "Please try again",
        variant: "destructive",
      })
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
          <p className="text-muted-foreground">Manage your calendar team members</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {/* Add Team Member */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-xl font-semibold mb-4">Add Team Member</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Add your teammates as calendar admins. They'll have manage access to events managed by the calendar.
          </p>

          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="teammate@example.com"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddMember()
                  }
                }}
              />
            </div>
            <select
              value={newMemberRole}
              onChange={(e) => setNewMemberRole(e.target.value as 'admin' | 'editor')}
              className="px-4 py-2 bg-background border border-input rounded-lg text-foreground"
            >
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
            <Button
              onClick={handleAddMember}
              disabled={addingMember || !newMemberEmail}
              className="gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Add
            </Button>
          </div>
        </div>

        {/* Team Members List */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-xl font-semibold mb-6">Team Members</h2>

          {teamMembers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No team members yet. Add someone above to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 bg-background rounded-xl border border-border"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                      {member.user.full_name?.[0] || member.user.email[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{member.user.full_name || member.user.email}</p>
                      <p className="text-sm text-muted-foreground">{member.user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-lg">
                      {member.role === "admin" ? (
                        <Shield className="w-4 h-4 text-primary" />
                      ) : (
                        <Crown className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className="text-sm font-medium capitalize">{member.role}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Role Descriptions */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-xl font-semibold mb-4">Role Permissions</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-primary" />
                <span className="font-medium">Admin</span>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                Can create, edit, and delete events. Can manage team members and calendar settings.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Editor</span>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                Can create and edit events. Cannot manage team members or calendar settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
