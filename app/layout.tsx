import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "./_polyfill-init"
import { AuthProvider } from "@/lib/auth"
import { Toaster } from "@/components/ui/toaster"
import { AppLayout } from "@/components/app-layout"
import { ThemeProvider } from "@/lib/theme-context"
import { WhitelabelThemeApplier } from "@/lib/whitelabel-theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Portfolio Builder",
  description: "Build and manage your professional portfolio",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} text-foreground`}>
        <AuthProvider>
          <ThemeProvider>
            <WhitelabelThemeApplier />
            <AppLayout>{children}</AppLayout>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
