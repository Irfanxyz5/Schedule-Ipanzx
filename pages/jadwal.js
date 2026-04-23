import { useState, useEffect } from 'react'
import Layout from '../components/Layout'

const DAYS = [
  { id: 1, name: 'Senin',  short: 'Sen', emoji: '🌅' },
  { id: 2, name: 'Selasa', short: 'Sel', emoji: '📖' },
  { id: 3, name: 'Rabu',   short: 'Rab', emoji: '✏️' },
  { id: 4, name: 'Kamis',  short: 'Kam', emoji: '💡' },
  { id: 5, name: 'Jumat',  short: 'Jum', emoji: '🎯' },
  { id: 6, name: 'Sabtu',  short: 'Sab', emoji: '📝' },
  { id: 7, name: 'Minggu', short: 'Min', emoji: '🌟' },
]

const MAPEL = [
  'Matematika', 'Fisika', 'Kimia', 'Biologi', 'Bahasa Indonesia',
  'Bahasa Inggris', 'Sejarah', 'Geografi', 'Ekonomi', 'Sosiologi',
  'PKN', 'Seni Budaya', 'Review Semua', 'Latihan Soal', 'Lainnya',
]

const PRIORITAS = [
  { value: 'tinggi', label: '🔴 Tinggi', color: '#F87171' },
  { value: 'sedang', label: '🟡 Sedang', color: '#FB923C' },
  { value: 'rendah', label: '🟢 Rendah', color: '#4ADE80' },
]

const DURASI = ['30 menit', '45 menit', '1 jam', '1.5 jam', '2 jam', '2.5 jam', '3 jam', 'Lebih dari 3 jam']
const METODE = ['Baca Materi', 'Latihan Soal', 'Membuat Rangkuman', 'Menonton Video', 'Diskusi Kelompok', 'Flash Card', 'Mind Map', 'Lainnya']

const defaultForm = {
  id: '', hariId: 1, mataPelajaran: '', target: '', durasi: '1 jam',
  waktuMulai: '16:00', waktuSelesai: '17:00', metode: 'Baca Materi',
  prioritas: 'sedang', catatan: '', selesai: false,
}

export default function JadwalBelajar() {
  const [items, setItems] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [editId, setEditId] = useState(null)
  const [activeDay, setActiveDay] = useState(getCurrentDayId())
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [viewMode, setViewMode] = useState('week') // 'week' | 'day'

  function getCurrentDayId() {
    const d = new Date().getDay()
    return d === 0 ? 7 : d
  }

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('studytrack_jadwal') || '[]')
    setItems(saved)
  }, [])

  const save = (data) => {
    localStorage.setItem('studytrack_jadwal', JSON.stringify(data))
    setItems(data)
  }

  const openAdd = (dayId = activeDay) => {
    setForm({ ...defaultForm, hariId: dayId })
    setEditId(null)
    setShowModal(true)
  }

  const openEdit = (item) => {
    setForm({ ...item })
    setEditId(item.id)
    setShowModal(true)
  }

  const handleSubmit = () => {
    if (!form.mataPelajaran || !form.target) {
      alert('Mata Pelajaran dan Target wajib diisi!')
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

  const toggleSelesai = (id) => {
    const updated = items.map(i => {
      if (i.id !== id) return i
      const newSelesai = !i.selesai
      if (newSelesai) autoAddPencapaian({ ...i, selesai: true })
      return { ...i, selesai: newSelesai }
    })
    save(updated)
  }

  const autoAddPencapaian = (jadwal) => {
    const pencapaian = JSON.parse(localStorage.getItem('studytrack_pencapaian') || '[]')
    const exists = pencapaian.find(p => p.referenceId === jadwal.id && p.type === 'jadwal')
    if (!exists) {
      pencapaian.unshift({
        id: Date.now().toString(),
        type: 'jadwal',
        referenceId: jadwal.id,
        judul: `Jadwal ${jadwal.mataPelajaran} Tercapai! 🎉`,
        deskripsi: jadwal.target,
        tanggal: new Date().toISOString().slice(0, 10),
        ikon: '📅',
        poin: 5,
        hari: DAYS.find(d => d.id === jadwal.hariId)?.name || '',
      })
      localStorage.setItem('studytrack_pencapaian', JSON.stringify(pencapaian))
    }
  }

  const handleDelete = (id) => {
    save(items.filter(i => i.id !== id))
    setDeleteConfirm(null)
  }

  const itemsByDay = (dayId) => items.filter(i => i.hariId === dayId)
  const totalSelesai = items.filter(i => i.selesai).length
  const todayItems = itemsByDay(getCurrentDayId())
  const todayProgress = todayItems.length > 0 ? Math.round(todayItems.filter(i => i.selesai).length / todayItems.length * 100) : 0

  return (
    <Layout title="Jadwal Belajar">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold gold-gradient">Jadwal Belajar</h1>
            <p className="text-slate-muted mt-1 text-sm">Rencanakan dan pantau progres belajarmu</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-ghost text-sm" onClick={() => setViewMode(viewMode === 'week' ? 'day' : 'week')}>
              {viewMode === 'week' ? '📋 Per Hari' : '📅 Semua Hari'}
            </button>
            <button className="btn-gold" onClick={() => openAdd()}>
              <span>+</span> Tambah Jadwal
            </button>
          </div>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="glass-card rounded-2xl p-6 mb-6 animate-fade-up delay-100">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatBox icon="📅" value={items.length} label="Total Jadwal" color="text-status-info" />
          <StatBox icon="✅" value={totalSelesai} label="Sudah Selesai" color="text-status-success" />
          <StatBox icon="⏳" value={items.length - totalSelesai} label="Belum Selesai" color="text-status-warning" />
          <StatBox icon="🎯" value={todayItems.length} label="Jadwal Hari Ini" color="text-gold" />
        </div>
        {/* Today progress */}
        {todayItems.length > 0 && (
          <div className="mt-5 pt-5 border-t border-slate-border">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-muted">Progress Hari Ini ({DAYS.find(d => d.id === getCurrentDayId())?.name})</span>
              <span className="text-gold font-semibold">{todayProgress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${todayProgress}%` }} />
            </div>
          </div>
        )}
      </div>

      {viewMode === 'week' ? (
        /* ── Week View: All Days ── */
        <div className="space-y-5">
          {DAYS.map((day, di) => {
            const dayItems = itemsByDay(day.id)
            const selesaiCount = dayItems.filter(i => i.selesai).length
            const isToday = day.id === getCurrentDayId()
            return (
              <div
                key={day.id}
                className={`glass-card rounded-2xl overflow-hidden animate-fade-up`}
                style={{ animationDelay: `${di * 0.07}s` }}
              >
                {/* Day Header */}
                <div className={`px-5 py-4 flex items-center justify-between border-b border-slate-border ${isToday ? 'bg-gold-muted' : ''}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{day.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg font-semibold text-slate-text">{day.name}</h3>
                        {isToday && <span className="badge badge-gold text-xs">Hari Ini</span>}
                      </div>
                      <p className="text-xs text-slate-muted">{dayItems.length} jadwal · {selesaiCount} selesai</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {dayItems.length > 0 && (
                      <div className="text-xs text-slate-muted hidden sm:block">
                        {Math.round(selesaiCount / dayItems.length * 100)}%
                      </div>
                    )}
                    <button
                      onClick={() => openAdd(day.id)}
                      className="text-xs btn-ghost px-3 py-1.5 rounded-lg"
                    >
                      + Tambah
                    </button>
                  </div>
                </div>

                {/* Day Items */}
                <div className="p-4">
                  {dayItems.length === 0 ? (
                    <div className="text-center py-5 text-slate-muted text-sm opacity-60">
                      Belum ada jadwal — <button className="text-gold hover:underline" onClick={() => openAdd(day.id)}>tambahkan sekarang</button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {dayItems.map(item => (
                        <JadwalItem
                          key={item.id}
                          item={item}
                          onToggle={() => toggleSelesai(item.id)}
                          onEdit={() => openEdit(item)}
                          onDelete={() => setDeleteConfirm(item.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* ── Day View ── */
        <div>
          {/* Day selector */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            {DAYS.map(day => {
              const count = itemsByDay(day.id).length
              const isToday = day.id === getCurrentDayId()
              return (
                <button
                  key={day.id}
                  onClick={() => setActiveDay(day.id)}
                  className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-xl border transition-all
                    ${activeDay === day.id
                      ? 'border-gold bg-gold-muted text-gold'
                      : 'border-slate-border text-slate-muted hover:border-gold/30 hover:text-slate-text'}`}
                >
                  <span className="text-sm font-semibold">{day.short}</span>
                  {count > 0 && <span className="text-xs">{count}</span>}
                  {isToday && <div className="w-1 h-1 rounded-full bg-gold" />}
                </button>
              )
            })}
          </div>

          {/* Active day content */}
          {(() => {
            const day = DAYS.find(d => d.id === activeDay)
            const dayItems = itemsByDay(activeDay)
            return (
              <div className="glass-card rounded-2xl overflow-hidden animate-fade-in">
                <div className="px-5 py-4 border-b border-slate-border bg-gold-muted/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{day.emoji}</span>
                    <h3 className="font-display text-xl font-semibold text-slate-text">{day.name}</h3>
                  </div>
                  <button className="btn-gold text-sm" onClick={() => openAdd(activeDay)}>+ Tambah</button>
                </div>
                <div className="p-5">
                  {dayItems.length === 0 ? (
                    <div className="text-center py-10 text-slate-muted">
                      <div className="text-4xl mb-3">📭</div>
                      <p>Belum ada jadwal untuk hari {day.name}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {dayItems.map(item => (
                        <JadwalItem
                          key={item.id}
                          item={item}
                          onToggle={() => toggleSelesai(item.id)}
                          onEdit={() => openEdit(item)}
                          onDelete={() => setDeleteConfirm(item.id)}
                          expanded
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* ── Modal ── */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-semibold gold-gradient">
                {editId ? 'Edit Jadwal' : 'Tambah Jadwal Belajar'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-muted hover:text-slate-text p-1">✕</button>
            </div>

            <div className="space-y-4">
              {/* Hari */}
              <div>
                <label className="block text-xs text-slate-muted mb-1.5 font-medium uppercase tracking-wider">Hari *</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map(d => (
                    <button
                      key={d.id}
                      onClick={() => setForm(f => ({ ...f, hariId: d.id }))}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-all font-medium
                        ${form.hariId === d.id
                          ? 'bg-gold text-bg-base border-gold'
                          : 'border-slate-border text-slate-muted hover:border-gold/40 hover:text-slate-text'}`}
                    >
                      {d.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mata Pelajaran */}
              <div>
                <label className="block text-xs text-slate-muted mb-1.5 font-medium uppercase tracking-wider">Mata Pelajaran *</label>
                <select className="input-dark" value={form.mataPelajaran} onChange={e => setForm(f => ({ ...f, mataPelajaran: e.target.value }))}>
                  <option value="">Pilih Mata Pelajaran</option>
                  {MAPEL.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              {/* Target */}
              <div>
                <label className="block text-xs text-slate-muted mb-1.5 font-medium uppercase tracking-wider">Target Belajar *</label>
                <input
                  type="text"
                  className="input-dark"
                  placeholder="Mis: Pahami Bab 3 Limit Fungsi, halaman 45-60"
                  value={form.target}
                  onChange={e => setForm(f => ({ ...f, target: e.target.value }))}
                />
              </div>

              {/* Waktu */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-muted mb-1.5 font-medium uppercase tracking-wider">Mulai</label>
                  <input type="time" className="input-dark" value={form.waktuMulai} onChange={e => setForm(f => ({ ...f, waktuMulai: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs text-slate-muted mb-1.5 font-medium uppercase tracking-wider">Selesai</label>
                  <input type="time" className="input-dark" value={form.waktuSelesai} onChange={e => setForm(f => ({ ...f, waktuSelesai: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs text-slate-muted mb-1.5 font-medium uppercase tracking-wider">Durasi</label>
                  <select className="input-dark" value={form.durasi} onChange={e => setForm(f => ({ ...f, durasi: e.target.value }))}>
                    {DURASI.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* Metode & Prioritas */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-muted mb-1.5 font-medium uppercase tracking-wider">Metode Belajar</label>
                  <select className="input-dark" value={form.metode} onChange={e => setForm(f => ({ ...f, metode: e.target.value }))}>
                    {METODE.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-muted mb-1.5 font-medium uppercase tracking-wider">Prioritas</label>
                  <select className="input-dark" value={form.prioritas} onChange={e => setForm(f => ({ ...f, prioritas: e.target.value }))}>
                    {PRIORITAS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Catatan */}
              <div>
                <label className="block text-xs text-slate-muted mb-1.5 font-medium uppercase tracking-wider">Catatan</label>
                <textarea
                  className="input-dark resize-none"
                  rows={2}
                  placeholder="Catatan tambahan (opsional)"
                  value={form.catatan}
                  onChange={e => setForm(f => ({ ...f, catatan: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-7">
              <button className="btn-gold flex-1 justify-center" onClick={handleSubmit}>
                {editId ? '💾 Simpan' : '✚ Tambahkan'}
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
            <h3 className="font-display text-xl text-slate-text mb-2">Hapus Jadwal?</h3>
            <p className="text-slate-muted text-sm mb-6">Data jadwal akan dihapus permanen.</p>
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

function JadwalItem({ item, onToggle, onEdit, onDelete, expanded }) {
  const prio = [
    { value: 'tinggi', label: '🔴', color: '#F87171' },
    { value: 'sedang', label: '🟡', color: '#FB923C' },
    { value: 'rendah', label: '🟢', color: '#4ADE80' },
  ].find(p => p.value === item.prioritas)

  return (
    <div className={`rounded-xl border transition-all ${item.selesai ? 'border-status-success/20 bg-status-success/5 opacity-80' : 'border-slate-border bg-bg-base/40 hover:border-gold/20'}`}>
      <div className="p-4 flex items-start gap-3">
        {/* Check */}
        <button
          onClick={onToggle}
          className={`mt-0.5 w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs transition-all
            ${item.selesai ? 'bg-status-success border-status-success text-bg-base' : 'border-slate-border hover:border-status-success'}`}
        >
          {item.selesai ? '✓' : ''}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={`font-semibold text-sm ${item.selesai ? 'line-through text-slate-muted' : 'text-slate-text'}`}>
              {item.mataPelajaran}
            </span>
            {prio && <span style={{ color: prio.color }}>{prio.label}</span>}
            {item.selesai && <span className="badge badge-success text-xs">Selesai ✓</span>}
          </div>
          <p className="text-slate-muted text-xs mb-1.5 leading-relaxed">{item.target}</p>
          <div className="flex flex-wrap gap-3 text-xs text-slate-muted">
            {item.waktuMulai && <span>⏰ {item.waktuMulai} – {item.waktuSelesai}</span>}
            {item.durasi && <span>⌛ {item.durasi}</span>}
            {item.metode && <span>📚 {item.metode}</span>}
          </div>
          {item.catatan && expanded && (
            <p className="text-xs text-slate-muted mt-1.5 italic">{item.catatan}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-1.5 flex-shrink-0">
          <button onClick={onEdit} className="text-slate-muted hover:text-gold transition-colors p-1.5 rounded-lg hover:bg-gold-muted text-xs">
            ✏️
          </button>
          <button onClick={onDelete} className="text-slate-muted hover:text-status-danger transition-colors p-1.5 rounded-lg hover:bg-status-danger/10 text-xs">
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}

function StatBox({ icon, value, label, color }) {
  return (
    <div className="text-center">
      <div className="text-xl mb-1">{icon}</div>
      <p className={`font-display text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-slate-muted text-xs mt-0.5">{label}</p>
    </div>
  )
}
