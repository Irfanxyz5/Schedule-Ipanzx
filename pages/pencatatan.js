import { useState, useEffect, useRef } from 'react'
import Layout from '../components/Layout'

const MATA_PELAJARAN = [
  'Matematika', 'Fisika', 'Kimia', 'Biologi', 'Bahasa Indonesia',
  'Bahasa Inggris', 'Sejarah', 'Geografi', 'Ekonomi', 'Sosiologi',
  'PKN', 'Seni Budaya', 'PJOK', 'Informatika', 'Lainnya',
]

const STATUS_OPTIONS = [
  { value: 'belum', label: 'Belum Dikerjakan', badge: 'badge-danger' },
  { value: 'proses', label: 'Sedang Dikerjakan', badge: 'badge-warning' },
  { value: 'selesai', label: 'Sudah Dikumpulkan', badge: 'badge-success' },
]

const PRIORITAS_OPTIONS = [
  { value: 'tinggi', label: '🔴 Tinggi', color: '#F87171' },
  { value: 'sedang', label: '🟡 Sedang', color: '#FB923C' },
  { value: 'rendah', label: '🟢 Rendah', color: '#4ADE80' },
]

const defaultForm = {
  id: '', mataPelajaran: '', tanggalTugas: '', tanggalPengumpulan: '',
  keterangan: '', status: 'belum', prioritas: 'sedang',
  foto: '', fotoName: '', catatan: '',
}

export default function Pencatatan() {
  const [mounted, setMounted] = useState(false)
  const [items, setItems] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [editId, setEditId] = useState(null)
  const [lightbox, setLightbox] = useState(null)
  const [filterStatus, setFilterStatus] = useState('semua')
  const [filterMapel, setFilterMapel] = useState('semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const fileRef = useRef()

  useEffect(() => {
    setMounted(true)
    try {
      const saved = JSON.parse(localStorage.getItem('studytrack_pr') || '[]')
      setItems(Array.isArray(saved) ? saved : [])
    } catch (e) {
      console.error("Error loading PR items:", e)
      setItems([])
    }
  }, [])

  if (!mounted) return null

  const save = (data) => {
    localStorage.setItem('studytrack_pr', JSON.stringify(data))
    setItems(data)
  }

  const openAdd = () => {
    setForm({ ...defaultForm, tanggalTugas: new Date().toISOString().slice(0, 10) })
    setEditId(null)
    setShowModal(true)
  }

  const openEdit = (item) => {
    setForm({ ...item })
    setEditId(item.id)
    setShowModal(true)
  }

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setForm(f => ({ ...f, foto: ev.target.result, fotoName: file.name }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = () => {
    if (!form.mataPelajaran || !form.tanggalPengumpulan) {
      alert('Mata Pelajaran dan Tanggal Pengumpulan wajib diisi!')
      return
    }
    let updated
    if (editId) {
      updated = items.map(i => i.id === editId ? { ...form, id: editId } : i)
    } else {
      const newItem = { ...form, id: Date.now().toString() }
      updated = [newItem, ...items]
      // Auto-add pencapaian if status is selesai
      if (form.status === 'selesai') autoAddPencapaian(newItem)
    }
    // Check if status changed to selesai during edit
    if (editId && form.status === 'selesai') {
      const old = items.find(i => i.id === editId)
      if (old && old.status !== 'selesai') autoAddPencapaian(form)
    }
    save(updated)
    setShowModal(false)
  }

  const autoAddPencapaian = (pr) => {
    const pencapaian = JSON.parse(localStorage.getItem('studytrack_pencapaian') || '[]')
    const exists = pencapaian.find(p => p.referenceId === pr.id && p.type === 'pr')
    if (!exists) {
      pencapaian.unshift({
        id: Date.now().toString(),
        type: 'pr',
        referenceId: pr.id,
        judul: `PR ${pr.mataPelajaran} Selesai!`,
        deskripsi: pr.keterangan || `Berhasil menyelesaikan PR ${pr.mataPelajaran}`,
        tanggal: new Date().toISOString().slice(0, 10),
        ikon: '📚',
        poin: 10,
      })
      localStorage.setItem('studytrack_pencapaian', JSON.stringify(pencapaian))
    }
  }

  const handleDelete = (id) => {
    const updated = items.filter(i => i.id !== id)
    save(updated)
    setDeleteConfirm(null)
  }

  const toggleStatus = (id) => {
    const updated = items.map(i => {
      if (i.id !== id) return i
      const states = ['belum', 'proses', 'selesai']
      const next = states[(states.indexOf(i.status) + 1) % 3]
      if (next === 'selesai') autoAddPencapaian({ ...i, status: 'selesai' })
      return { ...i, status: next }
    })
    save(updated)
  }

  const filtered = items.filter(i => {
    const matchStatus = filterStatus === 'semua' || i.status === filterStatus
    const matchMapel = filterMapel === 'semua' || i.mataPelajaran === filterMapel
    const matchSearch = !searchQuery || i.mataPelajaran.toLowerCase().includes(searchQuery.toLowerCase()) || i.keterangan?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchStatus && matchMapel && matchSearch
  })

  const countByStatus = (s) => items.filter(i => i.status === s).length

  const getDeadlineStatus = (tgl) => {
    if (!tgl) return null
    const diff = Math.ceil((new Date(tgl) - new Date()) / 86400000)
    if (diff < 0) return { label: 'Terlambat', cls: 'badge-danger' }
    if (diff === 0) return { label: 'Hari Ini!', cls: 'badge-danger' }
    if (diff <= 2) return { label: `${diff} hari lagi`, cls: 'badge-warning' }
    return { label: `${diff} hari lagi`, cls: 'badge-info' }
  }

  return (
    <Layout title="Pencatatan PR">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold gold-gradient">Pencatatan PR</h1>
            <p className="text-slate-muted mt-1 text-sm">Kelola semua tugas rumah dengan terstruktur</p>
          </div>
          <button className="btn-gold" onClick={openAdd}>
            <PlusIcon /> Tambah PR
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-up delay-100">
        {[
          { s: 'belum',  label: 'Belum', icon: '⏳', cls: 'text-status-danger' },
          { s: 'proses', label: 'Proses', icon: '⚡', cls: 'text-status-warning' },
          { s: 'selesai',label: 'Selesai', icon: '✅', cls: 'text-status-success' },
        ].map(({ s, label, icon, cls }) => (
          <div
            key={s}
            onClick={() => setFilterStatus(filterStatus === s ? 'semua' : s)}
            className={`glass-card rounded-xl p-4 cursor-pointer transition-all hover:-translate-y-0.5 ${filterStatus === s ? 'border-gold/40 bg-gold-muted' : ''}`}
          >
            <div className="text-lg mb-1">{icon}</div>
            <p className={`font-display text-2xl font-bold ${cls}`}>{countByStatus(s)}</p>
            <p className="text-slate-muted text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 animate-fade-up delay-150">
        <input
          className="input-dark flex-1 min-w-[180px] max-w-xs"
          placeholder="🔍 Cari mata pelajaran..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <select className="input-dark w-auto" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="semua">Semua Status</option>
          {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select className="input-dark w-auto" value={filterMapel} onChange={e => setFilterMapel(e.target.value)}>
          <option value="semua">Semua Mapel</option>
          {MATA_PELAJARAN.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {/* Items List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="📚"
          title={items.length === 0 ? 'Belum Ada PR' : 'Tidak Ada Hasil'}
          desc={items.length === 0 ? 'Klik "Tambah PR" untuk mencatat tugas pertamamu!' : 'Coba ubah filter pencarian'}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((item, i) => {
            const statusOpt = STATUS_OPTIONS.find(s => s.value === item.status)
            const deadline = getDeadlineStatus(item.tanggalPengumpulan)
            const prio = PRIORITAS_OPTIONS.find(p => p.value === item.prioritas)
            return (
              <div
                key={item.id}
                className={`glass-card rounded-2xl p-5 transition-all animate-fade-up`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Left: checkbox area */}
                  <div className="flex-shrink-0 pt-0.5">
                    <button
                      onClick={() => toggleStatus(item.id)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all
                        ${item.status === 'selesai' ? 'bg-status-success border-status-success text-bg-base'
                        : item.status === 'proses' ? 'border-status-warning text-status-warning'
                        : 'border-slate-border text-slate-muted hover:border-gold'}`}
                      title="Klik untuk ubah status"
                    >
                      {item.status === 'selesai' ? '✓' : item.status === 'proses' ? '⟳' : ''}
                    </button>
                  </div>

                  {/* Middle: content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className={`font-display text-lg font-semibold ${item.status === 'selesai' ? 'line-through text-slate-muted' : 'text-slate-text'}`}>
                        {item.mataPelajaran}
                      </h3>
                      <span className={`badge ${statusOpt.badge}`}>{statusOpt.label}</span>
                      {prio && (
                        <span className="badge" style={{ background: `${prio.color}18`, color: prio.color, border: `1px solid ${prio.color}30` }}>
                          {prio.label}
                        </span>
                      )}
                      {deadline && item.status !== 'selesai' && (
                        <span className={`badge ${deadline.cls}`}>{deadline.label}</span>
                      )}
                    </div>

                    {item.keterangan && (
                      <p className="text-slate-muted text-sm mb-2 leading-relaxed">{item.keterangan}</p>
                    )}

                    <div className="flex flex-wrap gap-4 text-xs text-slate-muted">
                      {item.tanggalTugas && (
                        <span>📅 Tugas: <span className="text-slate-text">{formatDate(item.tanggalTugas)}</span></span>
                      )}
                      {item.tanggalPengumpulan && (
                        <span>🎯 Kumpul: <span className={`font-medium ${item.status !== 'selesai' && deadline?.cls === 'badge-danger' ? 'text-status-danger' : 'text-slate-text'}`}>
                          {formatDate(item.tanggalPengumpulan)}
                        </span></span>
                      )}
                    </div>

                    {item.catatan && (
                      <div className="mt-2 px-3 py-2 rounded-lg bg-bg-base/50 border border-slate-border">
                        <p className="text-xs text-slate-muted"><span className="text-gold">📝 Catatan:</span> {item.catatan}</p>
                      </div>
                    )}
                  </div>

                  {/* Right: photo + actions */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {item.foto && (
                      <button onClick={() => setLightbox(item.foto)} className="relative group">
                        <img
                          src={item.foto}
                          alt="foto"
                          className="w-14 h-14 rounded-xl object-cover border border-slate-border group-hover:border-gold/50 transition-all"
                        />
                        <div className="absolute inset-0 rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs">🔍</span>
                        </div>
                      </button>
                    )}
                    <div className="flex flex-col gap-2">
                      <button onClick={() => openEdit(item)} className="btn-ghost text-xs px-3 py-1.5 rounded-lg">
                        ✏️ Edit
                      </button>
                      <button onClick={() => setDeleteConfirm(item.id)} className="btn-danger text-xs">
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Add/Edit Modal ── */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-semibold gold-gradient">
                {editId ? 'Edit PR' : 'Tambah PR Baru'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-muted hover:text-slate-text transition-colors p-1">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Mata Pelajaran */}
              <div>
                <label className="block text-xs text-slate-muted mb-1.5 font-medium uppercase tracking-wider">Mata Pelajaran *</label>
                <select className="input-dark" value={form.mataPelajaran} onChange={e => setForm(f => ({ ...f, mataPelajaran: e.target.value }))}>
                  <option value="">Pilih Mata Pelajaran</option>
                  {MATA_PELAJARAN.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              {/* Tanggal row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-muted mb-1.5 font-medium uppercase tracking-wider">Tanggal Tugas</label>
                  <input type="date" className="input-dark" value={form.tanggalTugas} onChange={e => setForm(f => ({ ...f, tanggalTugas: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs text-slate-muted mb-1.5 font-medium uppercase tracking-wider">Tanggal Pengumpulan *</label>
                  <input type="date" className="input-dark" value={form.tanggalPengumpulan} onChange={e => setForm(f => ({ ...f, tanggalPengumpulan: e.target.value }))} />
                </div>
              </div>

              {/* Keterangan */}
              <div>
                <label className="block text-xs text-slate-muted mb-1.5 font-medium uppercase tracking-wider">Keterangan Tugas</label>
                <textarea
                  className="input-dark resize-none"
                  rows={3}
                  placeholder="Tulis deskripsi atau detail tugas..."
                  value={form.keterangan}
                  onChange={e => setForm(f => ({ ...f, keterangan: e.target.value }))}
                />
              </div>

              {/* Status & Prioritas */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-muted mb-1.5 font-medium uppercase tracking-wider">Status</label>
                  <select className="input-dark" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-muted mb-1.5 font-medium uppercase tracking-wider">Prioritas</label>
                  <select className="input-dark" value={form.prioritas} onChange={e => setForm(f => ({ ...f, prioritas: e.target.value }))}>
                    {PRIORITAS_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Catatan */}
              <div>
                <label className="block text-xs text-slate-muted mb-1.5 font-medium uppercase tracking-wider">Catatan Tambahan</label>
                <input
                  type="text"
                  className="input-dark"
                  placeholder="Catatan singkat (opsional)"
                  value={form.catatan}
                  onChange={e => setForm(f => ({ ...f, catatan: e.target.value }))}
                />
              </div>

              {/* Foto */}
              <div>
                <label className="block text-xs text-slate-muted mb-1.5 font-medium uppercase tracking-wider">Foto Tugas (Opsional)</label>
                <div
                  className="rounded-xl border-2 border-dashed border-slate-border hover:border-gold/40 transition-colors p-4 cursor-pointer text-center"
                  onClick={() => fileRef.current.click()}
                >
                  {form.foto ? (
                    <div className="flex items-center gap-3">
                      <img src={form.foto} alt="preview" className="w-16 h-16 rounded-lg object-cover" />
                      <div className="text-left">
                        <p className="text-slate-text text-sm font-medium">{form.fotoName || 'Foto dipilih'}</p>
                        <p className="text-slate-muted text-xs mt-0.5">Klik untuk ganti</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-3">
                      <p className="text-2xl mb-2">📷</p>
                      <p className="text-slate-muted text-sm">Klik untuk upload foto</p>
                      <p className="text-slate-muted text-xs mt-1">JPG, PNG, WEBP</p>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                {form.foto && (
                  <button className="text-xs text-status-danger mt-2 hover:underline" onClick={() => setForm(f => ({ ...f, foto: '', fotoName: '' }))}>
                    Hapus foto
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-7">
              <button className="btn-gold flex-1 justify-center" onClick={handleSubmit}>
                {editId ? '💾 Simpan Perubahan' : '✚ Tambahkan'}
              </button>
              <button className="btn-ghost" onClick={() => setShowModal(false)}>Batal</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setDeleteConfirm(null)}>
          <div className="modal-box p-6 max-w-sm mx-auto text-center">
            <div className="text-5xl mb-4">🗑️</div>
            <h3 className="font-display text-xl font-semibold text-slate-text mb-2">Hapus PR?</h3>
            <p className="text-slate-muted text-sm mb-6">Tindakan ini tidak bisa dibatalkan.</p>
            <div className="flex gap-3 justify-center">
              <button className="btn-danger px-6 py-2.5 rounded-xl text-sm" onClick={() => handleDelete(deleteConfirm)}>
                Ya, Hapus
              </button>
              <button className="btn-ghost" onClick={() => setDeleteConfirm(null)}>Batal</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightbox && (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="foto tugas" className="lightbox-img" />
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all"
          >
            ✕
          </button>
        </div>
      )}
    </Layout>
  )
}

function PlusIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
}

function EmptyState({ icon, title, desc }) {
  return (
    <div className="empty-state animate-fade-up">
      <div className="text-5xl mb-4 animate-float">{icon}</div>
      <h3 className="font-display text-xl text-slate-text mb-2">{title}</h3>
      <p className="text-slate-muted text-sm">{desc}</p>
    </div>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
