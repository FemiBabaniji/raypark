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
      <body className={`${inter.className} text-foreground`}>
        <Script
          id="iterator-polyfill"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  'use strict';
  
  function addToArray(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    if (obj.toArray) return obj;
    
    // Check if it's an iterator
    if (typeof obj[Symbol.iterator] === 'function' || typeof obj.next === 'function') {
      obj.toArray = function() {
        const arr = [];
        if (typeof this.next === 'function') {
          // It's an iterator
          let result = this.next();
          while (!result.done) {
            arr.push(result.value);
            result = this.next();
          }
        } else {
          // It's iterable
          for (const item of this) {
            arr.push(item);
          }
        }
        return arr;
      };
    }
    return obj;
  }
  
  // Patch Iterator.prototype if it exists
  if (typeof Iterator !== 'undefined' && Iterator.prototype && !Iterator.prototype.toArray) {
    Iterator.prototype.toArray = function() {
      return Array.from(this);
    };
  }
  
  // Patch all Map/Set/Array iterator methods
  [Map, Set, Array].forEach(function(Constructor) {
    if (typeof Constructor === 'undefined') return;
    
    ['values', 'keys', 'entries'].forEach(function(methodName) {
      if (!Constructor.prototype[methodName]) return;
      
      const original = Constructor.prototype[methodName];
      Constructor.prototype[methodName] = function() {
        const iter = original.apply(this, arguments);
        return addToArray(iter);
      };
    });
    
    // Also patch Symbol.iterator
    if (Constructor.prototype[Symbol.iterator]) {
      const originalIterator = Constructor.prototype[Symbol.iterator];
      Constructor.prototype[Symbol.iterator] = function() {
        const iter = originalIterator.apply(this, arguments);
        return addToArray(iter);
      };
    }
  });
  
  console.log('[v0] Iterator toArray polyfill applied via beforeInteractive');
})();
            `,
          }}
        />
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
