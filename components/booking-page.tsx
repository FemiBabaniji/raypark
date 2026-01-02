"use client"

interface BookingPageProps {
  onClose: () => void
}

export function BookingPage({ onClose }: BookingPageProps) {
  return (
    <div className="py-20">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
          <span className="text-xs font-bold">BOOKING</span>
        </div>

        <h2 className="text-3xl font-normal mb-6">Schedule a Call</h2>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Book a time that works best for you. We'll discuss your project and how we can help bring your vision to life.
        </p>

        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg mb-6">
          <p className="text-center text-gray-500">Calendar booking widget would go here</p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="py-1.5 px-3 bg-gray-100 dark:bg-gray-800 flex items-center gap-2 text-xs hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            <span>BACK</span>
          </button>
        </div>
      </div>
    </div>
  )
}
