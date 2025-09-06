"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/auth"

interface TestResult {
  name: string
  status: "loading" | "success" | "error"
  message: string
  data?: any
}

export default function TestDatabasePage() {
  const [tests, setTests] = useState<TestResult[]>([])
  const { user, supabaseUser } = useAuth()
  const supabase = createClient()

  const updateTest = (name: string, status: TestResult["status"], message: string, data?: any) => {
    setTests((prev) => {
      const existing = prev.find((t) => t.name === name)
      if (existing) {
        existing.status = status
        existing.message = message
        existing.data = data
        return [...prev]
      }
      return [...prev, { name, status, message, data }]
    })
  }

  const runTests = async () => {
    // Test 1: Supabase Connection
    updateTest("Supabase Connection", "loading", "Testing connection...")
    try {
      const { data, error } = await supabase.from("portfolios").select("count").limit(1)
      if (error) throw error
      updateTest("Supabase Connection", "success", "Connected successfully")
    } catch (error) {
      updateTest("Supabase Connection", "error", `Connection failed: ${error}`)
    }

    // Test 2: Authentication
    updateTest("Authentication", "loading", "Checking auth state...")
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      updateTest(
        "Authentication",
        session ? "success" : "error",
        session ? `Authenticated as ${session.user.email}` : "Not authenticated (using mock data)",
        { user, supabaseUser, session: !!session },
      )
    } catch (error) {
      updateTest("Authentication", "error", `Auth check failed: ${error}`)
    }

    // Test 3: Portfolio API
    updateTest("Portfolio API", "loading", "Testing portfolio endpoints...")
    try {
      const response = await fetch("/api/portfolios")
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "API request failed")
      updateTest("Portfolio API", "success", `Found ${data.portfolios?.length || 0} portfolios`, data.portfolios)
    } catch (error) {
      updateTest("Portfolio API", "error", `API test failed: ${error}`)
    }

    // Test 4: John Doe Portfolio
    updateTest("John Doe Portfolio", "loading", "Fetching John Doe's portfolio...")
    try {
      const response = await fetch("/api/portfolios/john-doe")
      if (response.ok) {
        const data = await response.json()
        updateTest("John Doe Portfolio", "success", "John Doe's portfolio found", data.portfolio)
      } else {
        updateTest("John Doe Portfolio", "error", "John Doe's portfolio not found in database")
      }
    } catch (error) {
      updateTest("John Doe Portfolio", "error", `Failed to fetch: ${error}`)
    }

    // Test 5: Widget Types
    updateTest("Widget Types", "loading", "Testing widget types...")
    try {
      const response = await fetch("/api/widget-types")
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Widget types request failed")
      updateTest("Widget Types", "success", `Found ${data.widgetTypes?.length || 0} widget types`, data.widgetTypes)
    } catch (error) {
      updateTest("Widget Types", "error", `Widget types test failed: ${error}`)
    }

    // Test 6: Direct Database Query
    updateTest("Direct DB Query", "loading", "Testing direct database access...")
    try {
      const { data: portfolios, error } = await supabase.from("portfolios").select("*").limit(5)
      if (error) throw error
      updateTest("Direct DB Query", "success", `Direct query returned ${portfolios?.length || 0} records`, portfolios)
    } catch (error) {
      updateTest("Direct DB Query", "error", `Direct query failed: ${error}`)
    }

    // Test 7: Widget Instances
    updateTest("Widget Instances", "loading", "Testing widget instances...")
    try {
      const { data: widgets, error } = await supabase
        .from("widget_instances")
        .select(
          `
          *,
          widget_types (name, display_name)
        `,
        )
        .limit(10)
      if (error) throw error
      updateTest("Widget Instances", "success", `Found ${widgets?.length || 0} widget instances`, widgets)
    } catch (error) {
      updateTest("Widget Instances", "error", `Widget instances test failed: ${error}`)
    }
  }

  useEffect(() => {
    runTests()
  }, [])

  const getStatusColor = (status: TestResult["status"]) => {
    switch (status) {
      case "loading":
        return "text-yellow-400"
      case "success":
        return "text-green-400"
      case "error":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "loading":
        return "⏳"
      case "success":
        return "✅"
      case "error":
        return "❌"
      default:
        return "⚪"
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Database Integration Test</h1>
          <p className="text-gray-400">Testing all database connections and API endpoints</p>
          <button
            onClick={runTests}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Run Tests Again
          </button>
        </div>

        <div className="space-y-4">
          {tests.map((test) => (
            <div key={test.name} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{getStatusIcon(test.status)}</span>
                <h3 className="text-xl font-semibold text-white">{test.name}</h3>
                <span className={`text-sm font-medium ${getStatusColor(test.status)}`}>
                  {test.status.toUpperCase()}
                </span>
              </div>
              <p className={`text-sm ${getStatusColor(test.status)} mb-3`}>{test.message}</p>
              {test.data && (
                <details className="mt-3">
                  <summary className="text-sm text-gray-400 cursor-pointer hover:text-white">
                    View Data ({Array.isArray(test.data) ? test.data.length : "object"} items)
                  </summary>
                  <pre className="mt-2 p-3 bg-zinc-800 rounded text-xs text-gray-300 overflow-auto max-h-40">
                    {JSON.stringify(test.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-zinc-900 rounded-lg border border-zinc-800">
          <h3 className="text-lg font-semibold text-white mb-3">Current User State</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-400">Auth User:</span>{" "}
              <span className="text-white">{user?.name || "Not authenticated"}</span>
            </div>
            <div>
              <span className="text-gray-400">Supabase User:</span>{" "}
              <span className="text-white">{supabaseUser?.email || "None"}</span>
            </div>
            <div>
              <span className="text-gray-400">User ID:</span>{" "}
              <span className="text-white">{user?.id || "Mock ID"}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-blue-900/20 rounded-lg border border-blue-500/30">
          <h3 className="text-lg font-semibold text-blue-400 mb-3">Next Steps</h3>
          <ul className="space-y-2 text-sm text-blue-200">
            <li>• If tests are failing, run the SQL migration scripts first</li>
            <li>• Check Supabase project settings and environment variables</li>
            <li>• Verify RLS policies are properly configured</li>
            <li>• Ensure seed data has been populated</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
