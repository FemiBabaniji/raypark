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
  const supabase = createClient()

  useEffect(() => {
    const getInitialSession = async () => {
      console.log("[v0] AuthProvider: Checking initial session...") // added logging
      const {
        data: { session },
      } = await supabase.auth.getSession()

      console.log("[v0] AuthProvider: Session found:", !!session) // added logging
      console.log("[v0] AuthProvider: User in session:", session?.user?.id) // added logging

      if (session?.user) {
        setSupabaseUser(session.user)
        // For now, use mock data but with real user ID
        const userData = {
          id: session.user.id,
          name: session.user.user_metadata?.name || "Alex Chen",
          email: session.user.email || "alex@example.com",
          role: "Senior Data Scientist",
          bio: "Passionate about turning complex data into actionable insights. I specialize in machine learning, data visualization, and building scalable analytics platforms.",
          imageUrl: "/professional-headshot.png",
        }
        console.log("[v0] AuthProvider: Setting user:", userData) // added logging
        setUser(userData)
      } else {
        console.log("[v0] AuthProvider: No session found") // added logging
        setUser(null)
        setSupabaseUser(null)
      }
      setLoading(false)
      console.log("[v0] AuthProvider: Initial session check complete") // added logging
    }

    getInitialSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[v0] AuthProvider: Auth state change event:", event) // added logging

      if (session?.user) {
        setSupabaseUser(session.user)
        const userData = {
          id: session.user.id,
          name: session.user.user_metadata?.name || "Alex Chen",
          email: session.user.email || "alex@example.com",
          role: "Senior Data Scientist",
          bio: "Passionate about turning complex data into actionable insights.",
          imageUrl: "/professional-headshot.png",
        }
        console.log("[v0] AuthProvider: User signed in:", userData) // added logging
        setUser(userData)
      } else {
        console.log("[v0] AuthProvider: User signed out") // added logging
        setSupabaseUser(null)
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  console.log("[v0] AuthProvider render - user:", user?.id, "loading:", loading) // added logging

  return <AuthContext.Provider value={{ user, loading, supabaseUser }}>{children}</AuthContext.Provider>
}
