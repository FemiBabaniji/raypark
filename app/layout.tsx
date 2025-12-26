import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import "./globals.css"
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
      <head>
        <Script id="polyfills" strategy="beforeInteractive">
          {`
            // Polyfill for Iterator.prototype.toArray() - must load before React
            if (typeof Iterator !== 'undefined' && !Iterator.prototype.toArray) {
              Iterator.prototype.toArray = function() {
                return Array.from(this);
              };
            }
            
            // Polyfill for Map.prototype.values().toArray()
            if (typeof Map !== 'undefined') {
              const originalMapValues = Map.prototype.values;
              Map.prototype.values = function() {
                const iterator = originalMapValues.call(this);
                if (!iterator.toArray) {
                  iterator.toArray = function() {
                    return Array.from(this);
                  };
                }
                return iterator;
              };
            }
            
            // Polyfill for Set.prototype.values().toArray()
            if (typeof Set !== 'undefined') {
              const originalSetValues = Set.prototype.values;
              Set.prototype.values = function() {
                const iterator = originalSetValues.call(this);
                if (!iterator.toArray) {
                  iterator.toArray = function() {
                    return Array.from(this);
                  };
                }
                return iterator;
              };
            }
            
            // Polyfill for Array Iterator (for when cookies.getAll() returns array iterator)
            if (typeof Array !== 'undefined') {
              const originalArrayValues = Array.prototype.values;
              if (originalArrayValues) {
                Array.prototype.values = function() {
                  const iterator = originalArrayValues.call(this);
                  if (!iterator.toArray) {
                    iterator.toArray = function() {
                      return Array.from(this);
                    };
                  }
                  return iterator;
                };
              }
            }
          `}
        </Script>
      </head>
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
