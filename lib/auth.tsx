"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "./supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface User {
  id: string
  name: string
  email: string
  role?: string
  bio?: string
  imageUrl?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  supabaseUser: SupabaseUser | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  supabaseUser: null,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSupabaseUser(session.user)
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || "Alex Chen",
          email: session.user.email || "alex@example.com",
          role: "Senior Data Scientist",
          bio: "Passionate about turning complex data into actionable insights. I specialize in machine learning, data visualization, and building scalable analytics platforms.",
          imageUrl: "/professional-headshot.png",
        })
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSupabaseUser(session.user)
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || "Alex Chen",
          email: session.user.email || "alex@example.com",
          role: "Senior Data Scientist",
          bio: "Passionate about turning complex data into actionable insights.",
          imageUrl: "/professional-headshot.png",
        })
      } else {
        setSupabaseUser(null)
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return <AuthContext.Provider value={{ user, loading, supabaseUser }}>{children}</AuthContext.Provider>
}
