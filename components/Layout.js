import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Head from 'next/head'

const navItems = [
  { href: '/',           label: 'Beranda',      icon: HomeIcon },
  { href: '/pencatatan', label: 'Pencatatan PR', icon: BookIcon },
  { href: '/jadwal',     label: 'Jadwal Belajar', icon: CalendarIcon },
  { href: '/pencapaian', label: 'Pencapaian',    icon: TrophyIcon },
]

export default function Layout({ children, title = 'StudyTrack' }) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <Head>
        <title>{title} — StudyTrack</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen flex flex-col">
        {/* ── Navbar ── */}
        <nav className="navbar sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06091A" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                </div>
                <span className="font-display font-semibold text-lg tracking-wide">
                  <span className="gold-gradient">Study</span>
                  <span className="text-slate-text">Track</span>
                </span>
              </Link>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center gap-1">
                {navItems.map(item => {
                  const active = router.pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                        ${active
                          ? 'bg-gold-muted text-gold border border-gold/20'
                          : 'text-slate-muted hover:text-slate-text hover:bg-bg-hover'}`}
                    >
                      <item.icon size={15} />
                      {item.label}
                    </Link>
                  )
                })}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-muted hover:text-slate-text hover:bg-bg-hover transition-all"
              >
                {menuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden border-t border-slate-border animate-fade-in">
              <div className="px-4 py-3 space-y-1">
                {navItems.map(item => {
                  const active = router.pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                        ${active
                          ? 'bg-gold-muted text-gold border border-gold/20'
                          : 'text-slate-muted hover:text-slate-text hover:bg-bg-hover'}`}
                    >
                      <item.icon size={16} />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </nav>

        {/* ── Main Content ── */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 page-enter">
          {children}
        </main>

        {/* ── Footer ── */}
        <footer className="border-t border-slate-border mt-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-slate-muted text-xs">
              © 2024 <span className="text-gold font-medium">StudyTrack</span> — Kelola PR & Belajarmu dengan Elegan
            </p>
            <div className="flex items-center gap-1 text-slate-muted text-xs">
              <span>Dibuat dengan</span>
              <span className="text-status-danger">♥</span>
              <span>untuk Siswa SMA</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

/* ── Inline Icons ── */
function HomeIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
}
function BookIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  )
}
function CalendarIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  )
}
function TrophyIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="8 21 12 17 16 21"/><path d="M7 4v7c0 2.21 2.24 4 5 4s5-1.79 5-4V4"/><path d="M2 4h5"/><path d="M17 4h5"/><line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  )
}
function MenuIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  )
}
function XIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}
