import { useState } from 'react'
import { Building2, ExternalLink, Mail, MessageSquare, Pencil, Plus, X } from 'lucide-react'
import TagBadge from './TagBadge'
import InlineEdit from './InlineEdit'

function TagsInlineEdit({ tags, allTags, onSave, getTagColor }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTags, setEditTags] = useState(tags || [])

  const handleOpen = () => {
    setEditTags(tags || [])
    setIsEditing(true)
  }

  const handleSave = () => {
    setIsEditing(false)
    if (JSON.stringify(editTags) !== JSON.stringify(tags || [])) {
      onSave(editTags)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditTags(tags || [])
  }

  const addTag = (tagName) => {
    if (tagName && !editTags.includes(tagName)) {
      setEditTags([...editTags, tagName])
    }
  }

  const removeTag = (tagName) => {
    setEditTags(editTags.filter(t => t !== tagName))
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-1" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-wrap gap-1">
          {editTags.map(tag => {
            const tagObj = allTags?.find(t => t.name === tag)
            return (
              <span
                key={tag}
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs"
                style={{ backgroundColor: `${tagObj?.color || '#6366f1'}18`, color: tagObj?.color || '#6366f1' }}
              >
                {tag}
                <button onClick={() => removeTag(tag)} className="hover:opacity-70">×</button>
              </span>
            )
          })}
        </div>
        <div className="flex items-center gap-1">
          <select
            className="px-1 py-0.5 bg-surface-light border border-surface-lighter rounded-lg text-xs text-text focus:outline-none"
            value=""
            onChange={(e) => { if (e.target.value) addTag(e.target.value) }}
          >
            <option value="">+ Tag</option>
            {allTags?.filter(t => !editTags.includes(t.name)).map(t => (
              <option key={t.id} value={t.name}>{t.name}</option>
            ))}
          </select>
          <button onClick={handleSave} className="p-0.5 hover:text-success transition-colors">
            <Plus className="w-3 h-3" />
          </button>
          <button onClick={handleCancel} className="p-0.5 hover:text-danger transition-colors">
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="group/tags relative flex items-center gap-1 min-h-[24px] cursor-pointer"
      onClick={(e) => { e.stopPropagation(); handleOpen() }}
    >
      <div className="flex flex-wrap gap-1">
        {(tags && tags.length > 0) ? tags.map(tag => (
          <TagBadge key={tag} name={tag} color={getTagColor(tag)} />
        )) : (
          <span className="text-text-muted/30 text-xs">-</span>
        )}
      </div>
      <button
        className="shrink-0 opacity-0 group-hover/tags:opacity-100 transition-opacity text-text-muted hover:text-primary"
        onClick={(e) => { e.stopPropagation(); handleOpen() }}
      >
        <Pencil className="w-3 h-3" />
      </button>
    </div>
  )
}

export default function LeadTable({ leads, stages, tags, latestNotes, onLeadClick, onUpdateLead }) {
  const getTagColor = (tagName) => {
    const tag = tags?.find(t => t.name === tagName)
    return tag?.color || '#6366f1'
  }

  const getStage = (stageId) => stages.find(s => s.id === stageId)

  const handleFieldUpdate = (leadId, field, value) => {
    onUpdateLead(leadId, { [field]: value })
  }

  return (
    <div className="bg-surface rounded-xl border border-surface-lighter shadow-[var(--shadow-card)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-lighter">
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Lead</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Stage</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Etiquetas</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-text-muted uppercase tracking-wider">LinkedIn</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Última nota</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Origen</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Valor</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, idx) => {
              const stage = getStage(lead.stage_id)
              return (
                <tr
                  key={lead.id}
                  onClick={() => onLeadClick(lead)}
                  className="border-b border-surface-lighter/50 hover:bg-primary/[0.03] cursor-pointer transition-all duration-200 group animate-slide-up"
                  style={{ animationDelay: `${idx * 0.03}s` }}
                >
                  <td className="px-5 py-4">
                    <div className="space-y-0.5">
                      <InlineEdit
                        value={lead.name}
                        onSave={(val) => handleFieldUpdate(lead.id, 'name', val)}
                        displayContent={
                          <p className="font-semibold text-sm text-text group-hover:text-primary transition-colors">{lead.name}</p>
                        }
                        placeholder="Nombre"
                      />
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 group/cell">
                          <Building2 className="w-3 h-3 text-text-muted/60 shrink-0" />
                          <InlineEdit
                            value={lead.company || ''}
                            onSave={(val) => handleFieldUpdate(lead.id, 'company', val)}
                            displayContent={lead.company ? <span className="text-xs text-text-muted">{lead.company}</span> : undefined}
                            placeholder="Empresa"
                          />
                        </span>
                        {lead.email && (
                          <span className="flex items-center gap-1.5 group/cell">
                            <Mail className="w-3 h-3 text-text-muted/60 shrink-0" />
                            <InlineEdit
                              value={lead.email}
                              onSave={(val) => handleFieldUpdate(lead.id, 'email', val)}
                              displayContent={<span className="text-xs text-text-muted">{lead.email}</span>}
                              placeholder="Email"
                            />
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <InlineEdit
                      value={lead.stage_id || ''}
                      onSave={(val) => handleFieldUpdate(lead.id, 'stage_id', val || null)}
                      type="select"
                      options={stages}
                      displayContent={stage ? (
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200"
                          style={{ backgroundColor: `${stage.color}15`, color: stage.color }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stage.color }}></span>
                          {stage.name}
                        </span>
                      ) : undefined}
                      placeholder="Sin stage"
                    />
                  </td>
                  <td className="px-5 py-4">
                    <TagsInlineEdit
                      tags={lead.tags}
                      allTags={tags}
                      onSave={(val) => handleFieldUpdate(lead.id, 'tags', val)}
                      getTagColor={getTagColor}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <InlineEdit
                      value={lead.linkedin || ''}
                      onSave={(val) => handleFieldUpdate(lead.id, 'linkedin', val)}
                      displayContent={lead.linkedin ? (
                        <a
                          href={lead.linkedin.startsWith('http') ? lead.linkedin : `https://linkedin.com/in/${lead.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate max-w-[120px]">{lead.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
                        </a>
                      ) : undefined}
                      placeholder="LinkedIn"
                    />
                  </td>
                  <td className="px-5 py-4">
                    {latestNotes?.[lead.id] ? (
                      <div className="flex items-start gap-1.5 max-w-[200px]">
                        <MessageSquare className="w-3.5 h-3.5 text-text-muted/60 shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <p className="text-xs text-text-muted truncate">{latestNotes[lead.id].content}</p>
                          <p className="text-[10px] text-text-muted/40 mt-0.5">
                            {new Date(latestNotes[lead.id].created_at).toLocaleDateString('es', { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-text-muted/30">-</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <InlineEdit
                      value={lead.source || ''}
                      onSave={(val) => handleFieldUpdate(lead.id, 'source', val)}
                      displayContent={lead.source ? <span className="text-sm text-text-muted">{lead.source}</span> : undefined}
                      placeholder="Origen"
                    />
                  </td>
                  <td className="px-5 py-4">
                    <InlineEdit
                      value={lead.value || ''}
                      onSave={(val) => handleFieldUpdate(lead.id, 'value', val)}
                      type="number"
                      displayContent={lead.value ? (
                        <span className="text-sm font-semibold text-success">${lead.value.toLocaleString()}</span>
                      ) : undefined}
                      placeholder="$"
                    />
                  </td>
                </tr>
              )
            })}
            {leads.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center">
                  <div className="animate-float">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <svg className="w-8 h-8 text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-text-muted">No hay leads todavía</p>
                  <p className="text-xs text-text-muted/60 mt-1">Crea tu primer lead — cada gran venta empieza con un primer paso</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
