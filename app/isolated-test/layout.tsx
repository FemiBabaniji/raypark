import type React from "react"
export default function IsolatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: "#0a0a0a", color: "white", fontFamily: "system-ui" }}>
        {children}
      </body>
    </html>
  )
}
