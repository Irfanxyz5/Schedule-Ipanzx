import { useState, useEffect } from 'react'
import Layout from '../components/Layout'

const IKON_OPTIONS = ['🏆', '⭐', '🎯', '🎉', '💪', '🔥', '📚', '✅', '🌟', '🥇', '🎓', '💡', '🚀', '👑', '💎']
const KATEGORI = ['PR Selesai', 'Jadwal Tercapai', 'Nilai Bagus', 'Konsistensi', 'Tantangan', 'Milestone', 'Lainnya']
const POIN_OPTIONS = [5, 10, 15, 20, 25, 50, 100]

const defaultForm = {
  id: '', judul: '', deskripsi: '', tanggal: '', ikon: '🏆',
  kategori: 'Lainnya', poin: 10, catatan: '', type: 'manual',
}

export default function Pencapaian() {
  const [mounted, setMounted] = useState(false)
  const [items, setItems] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [editId, setEditId] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [filterKategori, setFilterKategori] = useState('semua')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    setMounted(true)
    try {
      const saved = JSON.parse(localStorage.getItem('studytrack_pencapaian') || '[]')
      setItems(Array.isArray(saved) ? saved : [])
    } catch (e) {
      console.error("Error loading pencapaian items:", e)
      setItems([])
    }
  }, [])

  if (!mounted) return null

  const save = (data) => {
    localStorage.setItem('studytrack_pencapaian', JSON.stringify(data))
    setItems(data)
  }

  const openAdd = () => {
    setForm({ ...defaultForm, tanggal: new Date().toISOString().slice(0, 10) })
    setEditId(null)
    setShowModal(true)
  }

  const openEdit = (item) => {
    setForm({ ...item })
    setEditId(item.id)
    setShowModal(true)
  }

  const handleSubmit = () => {
    if (!form.judul || !form.tanggal) {
      alert('Judul dan Tanggal wajib diisi!')
      return
    }
    let updated
    if (editId) {
      updated = items.map(i => i.id === editId ? { ...form, id: editId } : i)
    } else {
      updated = [{ ...form, id: Date.now().toString() }, ...items]
    }
    save(updated)
    setShowModal(false)
  }

  const handleDelete = (id) => {
    save(items.filter(i => i.id !== id))
    setDeleteConfirm(null)
  }

  const totalPoin = items.reduce((s, i) => s + (i.poin || 0), 0)
  const getLevel = (poin) => {
    if (poin >= 500) return { name: 'Legenda', icon: '👑', color: '#E8B86D', next: null }
    if (poin >= 200) return { name: 'Master', icon: '💎', color: '#C084FC', next: 500 }
    if (poin >= 100) return { name: 'Expert', icon: '🥇', color: '#F59E0B', next: 200 }
    if (poin >= 50)  return { name: 'Mahir',  icon: '🏆', color: '#60A5FA', next: 100 }
    if (poin >= 20)  return { name: 'Pemula', icon: '⭐', color: '#4ADE80', next: 50 }
    return { name: 'Baru', icon: '🌱', color: '#94A3B8', next: 20 }
  }

  const level = getLevel(totalPoin)
  const levelProgress = level.next ? Math.round((totalPoin / level.next) * 100) : 100

  const filtered = items
    .filter(i => filterKategori === 'semua' || i.kategori === filterKategori || 
      (filterKategori === 'PR Selesai' && i.type === 'pr') ||
      (filterKategori === 'Jadwal Tercapai' && i.type === 'jadwal'))
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.tanggal) - new Date(a.tanggal)
      if (sortBy === 'oldest') return new Date(a.tanggal) - new Date(b.tanggal)
      if (sortBy === 'poin')   return (b.poin || 0) - (a.poin || 0)
      return 0
    })

  const monthlyStats = getMonthlyStats(items)

  return (
    <Layout title="Pencapaian">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold gold-gradient">Pencapaian</h1>
            <p className="text-slate-muted mt-1 text-sm">Rayakan setiap keberhasilan belajarmu</p>
          </div>
          <button className="btn-gold" onClick={openAdd}>
            <span>+</span> Tambah Pencapaian
          </button>
        </div>
      </div>

      {/* Level Card */}
      <div className="glass-card rounded-2xl p-6 mb-6 relative overflow-hidden animate-fade-up delay-100">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Level Badge */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl border-2 border-gold/30 bg-gold-muted flex items-center justify-center text-4xl animate-pulse-gold">
                {level.icon}
              </div>
            </div>
            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h2 className="font-display text-2xl font-semibold text-slate-text">Level: <span style={{ color: level.color }}>{level.name}</span></h2>
                <span className="badge badge-gold">{totalPoin} Poin</span>
              </div>
              <p className="text-slate-muted text-sm mb-3">
                {level.next
                  ? `${level.next - totalPoin} poin lagi untuk naik level!`
                  : 'Kamu sudah mencapai level tertinggi! 🎉'}
              </p>
              <div className="progress-bar max-w-sm">
                <div className="progress-fill" style={{ width: `${Math.min(levelProgress, 100)}%` }} />
              </div>
              {level.next && <p className="text-xs text-slate-muted mt-1">{totalPoin} / {level.next}</p>}
            </div>
            {/* Stats */}
            <div className="grid grid-cols-3 sm:grid-cols-1 gap-3 text-center sm:text-right">
              <MiniStat value={items.length} label="Total" icon="🏆" />
              <MiniStat value={items.filter(i => i.type === 'pr').length} label="Dari PR" icon="📚" />
              <MiniStat value={items.filter(i => i.type === 'jadwal').length} label="Dari Jadwal" icon="📅" />
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Stats */}
      {monthlyStats.length > 0 && (
        <div className="glass-card rounded-2xl p-5 mb-6 animate-fade-up delay-150">
          <h3 className="font-display text-lg font-semibold text-slate-text mb-4">📊 Pencapaian per Bulan</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {monthlyStats.slice(-6).map(m => (
              <div key={m.month} className="flex-shrink-0 text-center px-3 py-2 rounded-xl border border-slate-border min-w-[70px]">
                <div className="font-display text-lg font-bold text-gold">{m.count}</div>
                <div className="text-xs text-slate-muted">{m.month}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter & Sort */}
      <div className="flex flex-wrap gap-3 mb-6 animate-fade-up delay-200">
        <select className="input-dark w-auto" value={filterKategori} onChange={e => setFilterKategori(e.target.value)}>
          <option value="semua">Semua Kategori</option>
          {KATEGORI.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
        <select className="input-dark w-auto" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="newest">Terbaru</option>
          <option value="oldest">Terlama</option>
          <option value="poin">Poin Tertinggi</option>
        </select>
        <div className="text-slate-muted text-sm flex items-center">
          {filtered.length} pencapaian
        </div>
      </div>

      {/* Achievements Grid */}
      {filtered.length === 0 ? (
        <div className="empty-state animate-fade-up">
          <div className="text-5xl mb-4 animate-float">🏆</div>
          <h3 className="font-display text-xl text-slate-text mb-2">
            {items.length === 0 ? 'Belum Ada Pencapaian' : 'Tidak Ada Hasil'}
          </h3>
          <p className="text-slate-muted text-sm mb-6">
            {items.length === 0
              ? 'Selesaikan PR atau jadwal belajar untuk mendapat pencapaian otomatis!'
              : 'Coba ubah filter'}
          </p>
          {items.length === 0 && (
            <button className="btn-gold" onClick={openAdd}>Tambah Manual</button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item, i) => (
            <AchievementCard
              key={item.id}
              item={item}
              index={i}
              onEdit={() => openEdit(item)}
              onDelete={() => setDeleteConfirm(item.id)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-semibold gold-gradient">
                {editId ? 'Edit Pencapaian' : 'Tambah Pencapaian'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-muted hover:text-slate-text p-1">✕</button>
            </div>

            <div className="space-y-4">
              {/* Ikon Picker */}
              <div>
                <label className="block text-xs text-slate-muted mb-2 font-medium uppercase tracking-wider">Ikon</label>
                <div className="flex flex-wrap gap-2">
                  {IKON_OPTIONS.map(ikon => (
                    <button
                      key={ikon}
                      onClick={() => setForm(f => ({ ...f, ikon }))}
                      className={`w-10 h-10 rounded-lg border text-xl transition-all flex items-center justify-center
                        ${form.ikon === ikon ? 'border-gold bg-gold-muted scale-110' : 'border-slate-border hover:border-gold/40'}`}
                    >
                      {ikon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Judul */}
              <div>
                <label className="block text-xs text-slate-muted mb-1.5 font-medium uppercase tracking-wider">Judul Pencapaian *</label>
                <input
                  type="text"
                  className="input-dark"
                  placeholder="Mis: Berhasil menyelesaikan PR Matematika!"
                  value={form.judul}
                  onChange={e => setForm(f => ({ ...f, judul: e.target.value }))}
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-xs text-slate-muted mb-1.5 font-medium uppercase tracking-wider">Deskripsi</label>
                <textarea
                  className="input-dark resize-none"
                  rows={2}
                  placeholder="Ceritakan pencapaianmu..."
                  value={form.deskripsi}
                  onChange={e => setForm(f => ({ ...f, deskripsi: e.target.value }))}
                />
              </div>

              {/* Kategori & Poin */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-muted mb-1.5 font-medium uppercase tracking-wider">Kategori</label>
                  <select className="input-dark" value={form.kategori} onChange={e => setForm(f => ({ ...f, kategori: e.target.value }))}>
                    {KATEGORI.map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-muted mb-1.5 font-medium uppercase tracking-wider">Poin</label>
                  <select className="input-dark" value={form.poin} onChange={e => setForm(f => ({ ...f, poin: Number(e.target.value) }))}>
                    {POIN_OPTIONS.map(p => <option key={p} value={p}>{p} poin</option>)}
                  </select>
                </div>
              </div>

              {/* Tanggal */}
              <div>
                <label className="block text-xs text-slate-muted mb-1.5 font-medium uppercase tracking-wider">Tanggal Pencapaian *</label>
                <input type="date" className="input-dark" value={form.tanggal} onChange={e => setForm(f => ({ ...f, tanggal: e.target.value }))} />
              </div>

              {/* Catatan */}
              <div>
                <label className="block text-xs text-slate-muted mb-1.5 font-medium uppercase tracking-wider">Catatan Pribadi</label>
                <input
                  type="text"
                  className="input-dark"
                  placeholder="Perasaan atau refleksi (opsional)"
                  value={form.catatan}
                  onChange={e => setForm(f => ({ ...f, catatan: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-7">
              <button className="btn-gold flex-1 justify-center" onClick={handleSubmit}>
                {editId ? '💾 Simpan' : '🏆 Tambahkan'}
              </button>
              <button className="btn-ghost" onClick={() => setShowModal(false)}>Batal</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setDeleteConfirm(null)}>
          <div className="modal-box p-6 max-w-sm text-center">
            <div className="text-4xl mb-4">🗑️</div>
            <h3 className="font-display text-xl text-slate-text mb-2">Hapus Pencapaian?</h3>
            <p className="text-slate-muted text-sm mb-6">Poin akan dikurangkan dari total.</p>
            <div className="flex gap-3 justify-center">
              <button className="btn-danger px-6 py-2.5 rounded-xl text-sm" onClick={() => handleDelete(deleteConfirm)}>Hapus</button>
              <button className="btn-ghost" onClick={() => setDeleteConfirm(null)}>Batal</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

function AchievementCard({ item, index, onEdit, onDelete }) {
  const typeColors = {
    pr:     { bg: 'from-amber-500/15 to-orange-600/5',  border: 'hover:border-amber-500/40', accent: '#E8B86D' },
    jadwal: { bg: 'from-blue-500/15 to-indigo-600/5',   border: 'hover:border-blue-500/40',  accent: '#60A5FA' },
    manual: { bg: 'from-emerald-500/15 to-teal-600/5',  border: 'hover:border-emerald-500/40', accent: '#4ADE80' },
  }
  const style = typeColors[item.type] || typeColors.manual

  return (
    <div
      className={`glass-card rounded-2xl p-5 relative overflow-hidden transition-all hover:-translate-y-1 animate-fade-up border border-transparent ${style.border} group`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${style.bg} opacity-70 rounded-2xl`} />
      <div className="relative z-10">
        {/* Top row */}
        <div className="flex items-start justify-between mb-3">
          <div className="text-3xl">{item.ikon || '🏆'}</div>
          <div className="flex items-center gap-1.5">
            <span className="badge badge-gold text-xs">+{item.poin || 0}pt</span>
            <button onClick={onEdit} className="text-slate-muted hover:text-gold transition-colors opacity-0 group-hover:opacity-100 text-xs p-1">✏️</button>
            <button onClick={onDelete} className="text-slate-muted hover:text-status-danger transition-colors opacity-0 group-hover:opacity-100 text-xs p-1">🗑️</button>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display text-base font-semibold text-slate-text mb-1 leading-tight">{item.judul}</h3>
        {item.deskripsi && <p className="text-slate-muted text-xs mb-3 leading-relaxed line-clamp-2">{item.deskripsi}</p>}

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="badge" style={{ background: `${style.accent}18`, color: style.accent, border: `1px solid ${style.accent}25` }}>
            {item.type === 'pr' ? '📚 Dari PR' : item.type === 'jadwal' ? '📅 Dari Jadwal' : '✍️ Manual'}
          </span>
          {item.kategori && item.kategori !== 'Lainnya' && (
            <span className="badge badge-info text-xs">{item.kategori}</span>
          )}
        </div>

        {/* Date & Note */}
        <div className="mt-3 pt-3 border-t border-slate-border flex items-center justify-between">
          <span className="text-xs text-slate-muted">📅 {formatDate(item.tanggal)}</span>
          {item.catatan && <span className="text-xs text-slate-muted italic truncate max-w-[120px]">"{item.catatan}"</span>}
        </div>
      </div>
    </div>
  )
}

function MiniStat({ value, label, icon }) {
  return (
    <div>
      <div className="text-base mb-0.5">{icon}</div>
      <div className="font-display text-lg font-bold text-gold">{value}</div>
      <div className="text-xs text-slate-muted">{label}</div>
    </div>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

function getMonthlyStats(items) {
  const map = {}
  items.forEach(item => {
    if (!item.tanggal) return
    const d = new Date(item.tanggal)
    const key = d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' })
    map[key] = (map[key] || 0) + 1
  })
  return Object.entries(map).map(([month, count]) => ({ month, count }))
}
