import Link from 'next/link'
import Layout from '../components/Layout'
import { useEffect, useState } from 'react'

const menuCards = [
  {
    href: '/pencatatan',
    title: 'Pencatatan PR',
    subtitle: 'Catat & kelola semua tugas rumah',
    icon: BookIcon,
    color: 'from-amber-500/20 to-orange-600/10',
    border: 'hover:border-amber-500/40',
    accentColor: '#E8B86D',
    stats: 'prCount',
    statsLabel: 'tugas aktif',
    desc: 'Simpan mata pelajaran, tanggal pengumpulan, keterangan, dan foto bukti tugas.',
    features: ['Mata Pelajaran', 'Tanggal Pengumpulan', 'Foto Lampiran', 'Status Pengumpulan'],
    delay: 'delay-100',
  },
  {
    href: '/jadwal',
    title: 'Jadwal Belajar',
    subtitle: 'Rencanakan waktu belajarmu',
    icon: CalendarIcon,
    color: 'from-blue-500/20 to-indigo-600/10',
    border: 'hover:border-blue-500/40',
    accentColor: '#60A5FA',
    stats: 'jadwalCount',
    statsLabel: 'jadwal minggu ini',
    desc: 'Susun jadwal belajar harian lengkap dengan target dan prioritas materi.',
    features: ['Semua Hari', 'Target Belajar', 'Prioritas', 'Durasi Belajar'],
    delay: 'delay-200',
  },
  {
    href: '/pencapaian',
    title: 'Pencapaian',
    subtitle: 'Rayakan setiap pencapaianmu',
    icon: TrophyIcon,
    color: 'from-emerald-500/20 to-teal-600/10',
    border: 'hover:border-emerald-500/40',
    accentColor: '#4ADE80',
    stats: 'pencapaianCount',
    statsLabel: 'pencapaian diraih',
    desc: 'Dokumentasikan setiap keberhasilan menyelesaikan tugas dan jadwal belajar.',
    features: ['Tugas Selesai', 'Jadwal Tercapai', 'Tanggal Pencapaian', 'Catatan Pribadi'],
    delay: 'delay-300',
  },
]

export default function Home() {
  const [stats, setStats] = useState({ prCount: 0, jadwalCount: 0, pencapaianCount: 0 })
  const [greeting, setGreeting] = useState('Selamat Datang')
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    // Load stats from localStorage
    const prs = JSON.parse(localStorage.getItem('studytrack_pr') || '[]')
    const jadwal = JSON.parse(localStorage.getItem('studytrack_jadwal') || '[]')
    const pencapaian = JSON.parse(localStorage.getItem('studytrack_pencapaian') || '[]')
    setStats({
      prCount: prs.filter(p => p.status !== 'selesai').length,
      jadwalCount: jadwal.length,
      pencapaianCount: pencapaian.length,
    })

    // Greeting
    const h = new Date().getHours()
    if (h < 12) setGreeting('Selamat Pagi ☀️')
    else if (h < 15) setGreeting('Selamat Siang 🌤️')
    else if (h < 18) setGreeting('Selamat Sore 🌅')
    else setGreeting('Selamat Malam 🌙')

    // Date
    const d = new Date()
    setCurrentDate(d.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
  }, [])

  return (
    <Layout title="Beranda">
      {/* ── Hero Section ── */}
      <section className="mb-12">
        <div className="relative overflow-hidden rounded-2xl glass-card p-8 sm:p-12 noise-overlay">
          {/* Decorative blobs */}
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-gold/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-10 w-60 h-60 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <p className="text-slate-muted text-sm font-medium tracking-wider uppercase animate-fade-in">{currentDate}</p>
                <h1 className="font-display text-4xl sm:text-5xl font-semibold mt-2 animate-fade-up delay-100">
                  {greeting},<br />
                  <span className="gold-gradient">Pelajar Hebat!</span>
                </h1>
              </div>
              <div className="animate-float">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#E8B86D" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    <line x1="9" y1="7" x2="15" y2="7"/>
                    <line x1="9" y1="11" x2="15" y2="11"/>
                    <line x1="9" y1="15" x2="12" y2="15"/>
                  </svg>
                </div>
              </div>
            </div>

            <p className="text-slate-muted max-w-xl leading-relaxed animate-fade-up delay-200">
              Kelola PR, susun jadwal belajar, dan catat setiap pencapaianmu — semua dalam satu tempat yang elegan.
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-4 mt-8 animate-fade-up delay-300">
              <StatPill icon="📚" value={stats.prCount} label="PR Aktif" color="text-gold" />
              <StatPill icon="📅" value={stats.jadwalCount} label="Jadwal" color="text-status-info" />
              <StatPill icon="🏆" value={stats.pencapaianCount} label="Pencapaian" color="text-status-success" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Menu Cards ── */}
      <section>
        <div className="flex items-center gap-4 mb-8 animate-fade-up delay-100">
          <h2 className="font-display text-2xl font-semibold text-slate-text">Menu Utama</h2>
          <div className="flex-1 deco-line" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {menuCards.map(card => (
            <MenuCard
              key={card.href}
              card={card}
              statValue={stats[card.stats]}
            />
          ))}
        </div>
      </section>

      {/* ── Tips Section ── */}
      <section className="mt-12 animate-fade-up delay-400">
        <div className="rounded-xl border border-gold/10 bg-gold-muted/30 p-6">
          <div className="flex items-start gap-4">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-semibold text-gold text-sm tracking-wide uppercase mb-1">Tips Belajar</h3>
              <p className="text-slate-muted text-sm leading-relaxed">
                Konsistensi adalah kunci keberhasilan. Mulailah dengan mencatat semua PR-mu, susun jadwal belajar yang realistis, 
                dan rayakan setiap pencapaian kecil untuk menjaga motivasimu tetap tinggi! 🎯
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

function StatPill({ icon, value, label, color }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-border bg-bg-surface/50">
      <span>{icon}</span>
      <span className={`font-bold text-lg font-display ${color}`}>{value}</span>
      <span className="text-slate-muted text-sm">{label}</span>
    </div>
  )
}

function MenuCard({ card, statValue }) {
  return (
    <Link href={card.href}>
      <div className={`glass-card rounded-2xl p-6 cursor-pointer transition-all duration-300 border border-transparent ${card.border} hover:-translate-y-1 hover:shadow-glow group animate-fade-up ${card.delay} relative overflow-hidden`}>
        {/* BG gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-60 rounded-2xl`} />
        
        <div className="relative z-10">
          {/* Icon + stat */}
          <div className="flex items-start justify-between mb-5">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center border"
              style={{ background: `${card.accentColor}18`, borderColor: `${card.accentColor}30` }}>
              <card.icon size={22} color={card.accentColor} />
            </div>
            <div className="text-right">
              <p className="font-display font-bold text-2xl" style={{ color: card.accentColor }}>{statValue}</p>
              <p className="text-slate-muted text-xs">{card.statsLabel}</p>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-display text-xl font-semibold text-slate-text group-hover:text-white transition-colors mb-1">{card.title}</h3>
          <p className="text-slate-muted text-xs mb-4">{card.subtitle}</p>

          {/* Desc */}
          <p className="text-slate-muted text-sm leading-relaxed mb-5">{card.desc}</p>

          {/* Features */}
          <div className="flex flex-wrap gap-2">
            {card.features.map(f => (
              <span key={f} className="text-xs px-2 py-1 rounded-md border border-slate-border text-slate-muted">
                {f}
              </span>
            ))}
          </div>

          {/* Arrow */}
          <div className="flex items-center gap-2 mt-5 text-sm font-medium transition-all" style={{ color: card.accentColor }}>
            <span>Buka</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

/* Icons */
function BookIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  )
}
function CalendarIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  )
}
function TrophyIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="8 21 12 17 16 21"/>
      <path d="M7 4v7c0 2.21 2.24 4 5 4s5-1.79 5-4V4"/>
      <path d="M2 4h5"/><path d="M17 4h5"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  )
}
