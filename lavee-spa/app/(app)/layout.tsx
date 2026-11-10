// Booking flow, confirmation, login and staff diary sit in a centred container; the home page is full-bleed.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">{children}</div>
}
