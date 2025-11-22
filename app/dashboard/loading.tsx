export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-card border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="w-20 h-6 bg-white/10 rounded animate-pulse" />
            <div className="flex items-center gap-6">
              <div className="w-16 h-4 bg-white/10 rounded animate-pulse" />
              <div className="w-20 h-4 bg-white/10 rounded animate-pulse" />
              <div className="w-16 h-4 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-20 h-4 bg-white/10 rounded animate-pulse" />
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse" />
              <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse" />
              <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content skeleton */}
      <main className="pt-32 pb-16 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="w-48 h-10 bg-white/10 rounded animate-pulse mb-12" />

          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="w-36 h-6 bg-white/10 rounded animate-pulse" />
              <div className="w-24 h-10 bg-white/10 rounded-xl animate-pulse" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-white/10 animate-pulse" />
                    <div className="flex-1">
                      <div className="w-32 h-5 bg-white/10 rounded animate-pulse mb-2" />
                      <div className="w-16 h-4 bg-white/10 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
