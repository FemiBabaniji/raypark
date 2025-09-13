"use client"

export default function IsolatedTestPage() {
  const handleBEAClick = () => {
    console.log("[v0] BEA logo clicked, navigating to BEA page")
    // Use window.location instead of router to avoid any Next.js dependencies
    window.location.href = "/network/black-entrepreneurship-alliance"
  }

  return (
    <div style={{ minHeight: "100vh", padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem" }}>Isolated Test Page</h1>

      <div style={{ marginBottom: "1rem" }}>
        <p>This page uses its own layout to avoid any global import issues.</p>
      </div>

      <button
        onClick={handleBEAClick}
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "0.5rem",
          cursor: "pointer",
          marginBottom: "2rem",
        }}
      >
        Test BEA Navigation
      </button>

      <div>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>BEA Logo Test</h2>
        <div
          onClick={handleBEAClick}
          style={{
            display: "inline-block",
            cursor: "pointer",
            padding: "1rem",
            backgroundColor: "#262626",
            borderRadius: "0.5rem",
          }}
        >
          <img src="/bea-logo.svg" alt="BEA Logo" style={{ height: "2rem", width: "auto" }} />
        </div>
      </div>
    </div>
  )
}
