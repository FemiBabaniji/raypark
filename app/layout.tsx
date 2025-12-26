import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Universal toArray polyfill that works with any iterator
                function addToArrayMethod(obj) {
                  if (obj && typeof obj === 'object' && typeof obj[Symbol.iterator] === 'function') {
                    if (!obj.toArray) {
                      obj.toArray = function() {
                        const result = [];
                        for (const item of this) {
                          result.push(item);
                        }
                        return result;
                      };
                    }
                  }
                  return obj;
                }

                // Polyfill Iterator.prototype if it exists
                if (typeof Iterator !== 'undefined' && Iterator.prototype) {
                  if (!Iterator.prototype.toArray) {
                    Iterator.prototype.toArray = function() {
                      return Array.from(this);
                    };
                  }
                }

                // Wrap Map.prototype.values to add toArray to returned iterator
                if (typeof Map !== 'undefined') {
                  const originalMapValues = Map.prototype.values;
                  Map.prototype.values = function() {
                    const iterator = originalMapValues.call(this);
                    return addToArrayMethod(iterator);
                  };
                  
                  const originalMapKeys = Map.prototype.keys;
                  Map.prototype.keys = function() {
                    const iterator = originalMapKeys.call(this);
                    return addToArrayMethod(iterator);
                  };
                  
                  const originalMapEntries = Map.prototype.entries;
                  Map.prototype.entries = function() {
                    const iterator = originalMapEntries.call(this);
                    return addToArrayMethod(iterator);
                  };
                }

                // Wrap Set.prototype.values to add toArray to returned iterator
                if (typeof Set !== 'undefined') {
                  const originalSetValues = Set.prototype.values;
                  Set.prototype.values = function() {
                    const iterator = originalSetValues.call(this);
                    return addToArrayMethod(iterator);
                  };
                  
                  const originalSetKeys = Set.prototype.keys;
                  Set.prototype.keys = function() {
                    const iterator = originalSetKeys.call(this);
                    return addToArrayMethod(iterator);
                  };
                  
                  const originalSetEntries = Set.prototype.entries;
                  Set.prototype.entries = function() {
                    const iterator = originalSetEntries.call(this);
                    return addToArrayMethod(iterator);
                  };
                }

                // Wrap Array.prototype iterator methods
                if (typeof Array !== 'undefined') {
                  ['values', 'keys', 'entries'].forEach(function(method) {
                    if (Array.prototype[method]) {
                      const original = Array.prototype[method];
                      Array.prototype[method] = function() {
                        const iterator = original.call(this);
                        return addToArrayMethod(iterator);
                      };
                    }
                  });
                }

                // Add to any object that has Symbol.iterator
                const originalSymbolIterator = Object.prototype[Symbol.iterator];
                if (originalSymbolIterator) {
                  Object.defineProperty(Object.prototype, Symbol.iterator, {
                    value: function() {
                      const iterator = originalSymbolIterator.call(this);
                      return addToArrayMethod(iterator);
                    },
                    configurable: true,
                    writable: true
                  });
                }
              })();
            `,
          }}
        />
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
