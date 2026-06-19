import { useState, useEffect } from 'react'
import { X, Building2, Mail, Phone, MapPin, DollarSign, Edit2, Trash2, PhoneCall, Calendar, Check, Link2 } from 'lucide-react'
import TagBadge from './TagBadge'
import NoteTimeline from '../notes/NoteTimeline'
import FollowupIndicator from './FollowupIndicator'
import { useNotes } from '../../hooks/useNotes'

function PipelineProgress({ currentStageId, stages }) {
  const openStages = stages.filter(s => !s.is_closed)
  const currentIndex = openStages.findIndex(s => s.id === currentStageId)

  return (
    <div className="mb-6">
      <div className="flex items-center">
        {openStages.map((stage, i) => (
          <div key={stage.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  i <= currentIndex
                    ? 'text-white shadow-sm'
                    : 'bg-surface-lighter text-text-muted'
                }`}
                style={i <= currentIndex ? { backgroundColor: stage.color, boxShadow: `0 2px 8px ${stage.color}40` } : {}}
              >
                {i < currentIndex ? '✓' : i + 1}
              </div>
              <span className={`text-[9px] mt-1 text-center max-w-[60px] truncate ${i <= currentIndex ? 'text-text font-medium' : 'text-text-muted'}`}>
                {stage.name}
              </span>
            </div>
            {i < openStages.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 rounded-full transition-all duration-300 ${i < currentIndex ? '' : 'bg-surface-lighter'}`}
                style={i < currentIndex ? { background: `linear-gradient(to right, ${openStages[i].color}, ${openStages[i + 1].color})` } : {}}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function QuickAction({ icon: Icon, label, successLabel, color, onClick, isDone }) {
  return (
    <button
      onClick={onClick}
      disabled={isDone}
      className={`relative flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold overflow-hidden transition-all duration-300 ${
        isDone
          ? 'text-white scale-[1.02]'
          : `hover:scale-[1.01] active:scale-[0.98]`
      }`}
      style={{
        backgroundColor: isDone ? color : `${color}12`,
        color: isDone ? '#fff' : color,
        boxShadow: isDone ? `0 4px 12px ${color}30` : 'none',
      }}
    >
      <span className={`flex items-center gap-2 transition-all duration-200 ${isDone ? 'scale-110' : ''}`}>
        {isDone ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
        {isDone ? successLabel : label}
      </span>
    </button>
  )
}

export default function LeadDetail({ lead, stages, tags, onClose, onEdit, onDelete, onUpdate }) {
  const { notes, loading, error, createNote, updateNote, deleteNote } = useNotes(lead.id)
  const [actionDone, setActionDone] = useState(null)
  const stage = stages.find(s => s.id === lead.stage_id)

  const getTagColor = (tagName) => {
    const tag = tags?.find(t => t.name === tagName)
    return tag?.color || '#6366f1'
  }

  const handleContact = () => {
    onUpdate(lead.id, { last_contact_at: new Date().toISOString() })
  }

  const handleQuickAction = async (type) => {
    const now = new Date().toISOString()
    const content = type === 'call' ? 'Llamada realizada' : 'Reunión realizada'

    try {
      await Promise.all([
        onUpdate(lead.id, { last_contact_at: now }),
        createNote({ content, type }),
      ])
      setActionDone(type)
      setTimeout(() => setActionDone(null), 2000)
    } catch (err) {
      console.error('Error registrando acción rápida:', err)
    }
  }

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-fade-in" onClick={onClose} />

      <div
        className="fixed right-0 top-0 h-full w-full max-w-xl bg-surface border-l border-surface-lighter z-50 overflow-y-auto animate-slide-in-right"
        style={{ boxShadow: 'var(--shadow-panel)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-surface/80 backdrop-blur-md z-10 border-b border-surface-lighter px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-text">{lead.name}</h2>
              {lead.company && (
                <div className="flex items-center gap-1.5 text-sm text-text-muted mt-1">
                  <Building2 className="w-3.5 h-3.5" />
                  {lead.company}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => onEdit(lead)} className="p-2 hover:bg-surface-light rounded-xl transition-colors text-text-muted hover:text-text">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => { onDelete(lead.id); onClose() }} className="p-2 hover:bg-danger/10 rounded-xl transition-colors text-text-muted hover:text-danger">
                <Trash2 className="w-4 h-4" />
              </button>
              <button onClick={onClose} className="p-2 hover:bg-surface-light rounded-xl transition-colors text-text-muted hover:text-text">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {stage && (
            <div className="mt-3">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: `${stage.color}15`, color: stage.color }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }}></span>
                {stage.name}
              </span>
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          <PipelineProgress currentStageId={lead.stage_id} stages={stages} />

          <div className="grid grid-cols-2 gap-3">
            {lead.email && (
              <a href={`mailto:${lead.email}`} className="flex items-center gap-3 p-3 bg-surface-light rounded-xl border border-surface-lighter hover:border-primary/30 transition-all duration-200 group">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">Email</p>
                  <p className="text-sm text-text truncate">{lead.email}</p>
                </div>
              </a>
            )}
            {lead.phone && (
              <a href={`tel:${lead.phone}`} className="flex items-center gap-3 p-3 bg-surface-light rounded-xl border border-surface-lighter hover:border-primary/30 transition-all duration-200 group">
                <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors">
                  <Phone className="w-4 h-4 text-success" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">Teléfono</p>
                  <p className="text-sm text-text truncate">{lead.phone}</p>
                </div>
              </a>
            )}
            {lead.phone2 && (
              <a href={`tel:${lead.phone2}`} className="flex items-center gap-3 p-3 bg-surface-light rounded-xl border border-surface-lighter hover:border-primary/30 transition-all duration-200 group">
                <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors">
                  <Phone className="w-4 h-4 text-success" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">Teléfono 2</p>
                  <p className="text-sm text-text truncate">{lead.phone2}</p>
                </div>
              </a>
            )}
            {lead.linkedin && (
              <a href={lead.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-surface-light rounded-xl border border-surface-lighter hover:border-primary/30 transition-all duration-200 group">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Link2 className="w-4 h-4 text-blue-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">LinkedIn</p>
                  <p className="text-sm text-text truncate">{lead.linkedin}</p>
                </div>
              </a>
            )}
            {lead.source && (
              <div className="flex items-center gap-3 p-3 bg-surface-light rounded-xl border border-surface-lighter">
                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-accent" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">Origen</p>
                  <p className="text-sm text-text truncate">{lead.source}</p>
                </div>
              </div>
            )}
            {lead.value && (
              <div className="flex items-center gap-3 p-3 bg-surface-light rounded-xl border border-surface-lighter">
                <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-success" />
                </div>
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">Valor</p>
                  <p className="text-sm font-bold text-success">${lead.value.toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Seguimiento</h4>
            <FollowupIndicator lastContactAt={lead.last_contact_at} nextFollowupAt={lead.next_followup_at} />
          </div>

          <div className="flex gap-2">
            <QuickAction
              icon={PhoneCall}
              label="Registrar llamada"
              successLabel="Llamada registrada"
              color="#3b82f6"
              isDone={actionDone === 'call'}
              onClick={() => handleQuickAction('call')}
            />
            <QuickAction
              icon={Calendar}
              label="Registrar reunión"
              successLabel="Reunión registrada"
              color="#8b5cf6"
              isDone={actionDone === 'meeting'}
              onClick={() => handleQuickAction('meeting')}
            />
          </div>

          {lead.tags && lead.tags.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Etiquetas</h4>
              <div className="flex flex-wrap gap-1.5">
                {lead.tags.map(tag => (
                  <TagBadge key={tag} name={tag} color={getTagColor(tag)} />
                ))}
              </div>
            </div>
          )}

          <NoteTimeline
            notes={notes}
            loading={loading}
            error={error}
            createNote={createNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            onContact={handleContact}
          />
        </div>
      </div>
    </>
  )
}
