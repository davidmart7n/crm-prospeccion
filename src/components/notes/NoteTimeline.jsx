import { useState, useEffect, useRef } from 'react'
import { format, isToday, isYesterday, isThisWeek, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { MessageSquare, Phone, Users, Mail, Trash2, Send, Edit3, Check, X, AlertCircle } from 'lucide-react'

const typeConfig = {
  note: { icon: MessageSquare, label: 'Nota', color: '#6366f1', bg: '#6366f115' },
  call: { icon: Phone, label: 'Llamada', color: '#3b82f6', bg: '#3b82f615' },
  meeting: { icon: Users, label: 'Reunión', color: '#8b5cf6', bg: '#8b5cf615' },
  email: { icon: Mail, label: 'Email', color: '#22c55e', bg: '#22c55e15' },
}

function formatDateGroup(dateStr) {
  const date = parseISO(dateStr)
  if (isToday(date)) return 'Hoy'
  if (isYesterday(date)) return 'Ayer'
  if (isThisWeek(date)) return 'Esta semana'
  return 'Anterior'
}

function groupByDate(notes) {
  const groups = {}
  notes.forEach(note => {
    const group = formatDateGroup(note.created_at)
    if (!groups[group]) groups[group] = []
    groups[group].push(note)
  })
  const order = ['Hoy', 'Ayer', 'Esta semana', 'Anterior']
  return order.filter(g => groups[g]).map(g => ({ label: g, notes: groups[g] }))
}

export default function NoteTimeline({ notes, loading, error, createNote, updateNote, deleteNote, onContact }) {
  const [content, setContent] = useState('')
  const [type, setType] = useState('note')
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editContent, setEditContent] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const textareaRef = useRef(null)
  const editRef = useRef(null)

  useEffect(() => {
    if (editingId && editRef.current) {
      editRef.current.focus()
      editRef.current.style.height = 'auto'
      editRef.current.style.height = editRef.current.scrollHeight + 'px'
    }
  }, [editingId])

  const handleTextareaChange = (e) => {
    setContent(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = e.target.scrollHeight + 'px'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim() || submitting) return
    setSubmitting(true)
    const result = await createNote({ content: content.trim(), type })
    setSubmitting(false)
    if (result) {
      setContent('')
      if (textareaRef.current) textareaRef.current.style.height = 'auto'
      if (type === 'call' || type === 'meeting' || type === 'email') {
        onContact && onContact()
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e)
    }
  }

  const startEdit = (note) => {
    setEditingId(note.id)
    setEditContent(note.content)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditContent('')
  }

  const saveEdit = async (noteId) => {
    if (!editContent.trim()) return
    const result = await updateNote(noteId, { content: editContent.trim() })
    if (result) {
      setEditingId(null)
      setEditContent('')
    }
  }

  const handleDelete = async (noteId) => {
    setDeletingId(noteId)
    await deleteNote(noteId)
    setDeletingId(null)
  }

  const grouped = groupByDate(notes)

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2">
        Actividad
        {!loading && notes.length > 0 && (
          <span className="text-[10px] font-bold bg-surface-lighter px-2 py-0.5 rounded-full text-text-muted">{notes.length}</span>
        )}
      </h4>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2 flex-wrap">
          {Object.entries(typeConfig).map(([key, { icon: Icon, label, color }]) => (
            <button
              key={key}
              type="button"
              onClick={() => setType(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                type === key ? 'shadow-sm' : 'text-text-muted hover:text-text bg-transparent'
              }`}
              style={type === key ? { backgroundColor: `${color}20`, color, boxShadow: `0 0 0 1px ${color}35` } : {}}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        <div className="relative rounded-xl border border-surface-lighter bg-surface-light/50 overflow-hidden focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-200">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Agregar nota o actividad..."
            rows={1}
            className="w-full px-4 py-3 bg-transparent text-sm text-text placeholder:text-text-muted/40 focus:outline-none resize-none min-h-[44px] max-h-[120px]"
          />
          <div className="flex items-center justify-between px-3 pb-2">
            <span className="text-[10px] text-text-muted/40">Ctrl+Enter para enviar</span>
            <button
              type="submit"
              disabled={!content.trim() || submitting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed text-white"
              style={{ backgroundColor: typeConfig[type].color }}
            >
              {submitting ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              Agregar
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-danger/10 text-danger text-xs">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          Error: {error}
        </div>
      )}

      <div className="space-y-1">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-surface-lighter/50 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-text-muted/30" />
            </div>
            <p className="text-sm text-text-muted/60">Sin actividad registrada</p>
            <p className="text-xs text-text-muted/30 mt-1">Agrega la primera nota o registra una llamada</p>
          </div>
        ) : (
          grouped.map(({ label, notes: groupNotes }) => (
            <div key={label}>
              <div className="flex items-center gap-2 py-2">
                <span className="text-[10px] font-semibold text-text-muted/50 uppercase tracking-widest">{label}</span>
                <div className="flex-1 h-px bg-surface-lighter/50" />
              </div>
              <div className="space-y-0">
                {groupNotes.map((note, idx) => {
                  const config = typeConfig[note.type] || typeConfig.note
                  const Icon = config.icon
                  const isEditing = editingId === note.id
                  const isDeleting = deletingId === note.id
                  const isLast = idx === groupNotes.length - 1
                  return (
                    <div key={note.id} className={`group flex gap-3 transition-opacity duration-200 ${isDeleting ? 'opacity-40' : ''}`}>
                      <div className="flex flex-col items-center w-8 shrink-0">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
                          style={{ backgroundColor: config.bg }}
                        >
                          <Icon className="w-4 h-4" style={{ color: config.color }} />
                        </div>
                        {!isLast && <div className="w-px flex-1 bg-surface-lighter/40 my-1" />}
                      </div>
                      <div className={`flex-1 ${!isLast ? 'pb-3' : 'pb-1'}`}>
                        {isEditing ? (
                          <div className="rounded-xl border border-primary/30 bg-surface-light p-3 space-y-2">
                            <textarea
                              ref={editRef}
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) saveEdit(note.id)
                                if (e.key === 'Escape') cancelEdit()
                              }}
                              className="w-full bg-surface border border-surface-lighter rounded-lg px-2 py-1.5 text-sm text-text focus:outline-none focus:border-primary/50 resize-none min-h-[60px]"
                            />
                            <div className="flex items-center gap-2 justify-end">
                              <button onClick={cancelEdit} className="p-1.5 rounded-lg hover:bg-surface-lighter text-text-muted transition-colors">
                                <X className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => saveEdit(note.id)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-dark transition-colors"
                              >
                                <Check className="w-3 h-3" />
                                Guardar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-xl bg-surface-light/40 hover:bg-surface-light/70 px-3 py-2.5 transition-colors duration-150 animate-slide-up">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: config.color }}>
                                {config.label}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-text-muted/40 tabular-nums">
                                  {format(parseISO(note.created_at), "d MMM yyyy · HH:mm", { locale: es })}
                                </span>
                                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                  <button onClick={() => startEdit(note)} className="p-1 rounded-lg hover:bg-surface-lighter/80 text-text-muted hover:text-text transition-colors">
                                    <Edit3 className="w-3 h-3" />
                                  </button>
                                  <button onClick={() => handleDelete(note.id)} className="p-1 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger transition-colors">
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                            <p className="text-[13px] text-text/90 leading-relaxed whitespace-pre-wrap break-words">{note.content}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
