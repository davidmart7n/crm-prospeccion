import { useState } from 'react'
import { X, Plus, MessageSquare, Phone, Users, CalendarDays } from 'lucide-react'
import Button from '../ui/Button'

export default function LeadForm({ lead, stages, tags: allTags, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: lead?.name || '',
    company: lead?.company || '',
    email: lead?.email || '',
    phone: lead?.phone || '',
    phone2: lead?.phone2 || '',
    linkedin: lead?.linkedin || '',
    stage_id: lead?.stage_id || null,
    source: lead?.source || '',
    value: lead?.value || '',
    tags: lead?.tags || [],
    next_followup_at: lead?.next_followup_at ? lead.next_followup_at.slice(0, 16) : '',
    followup_type: lead?.followup_type || 'llamada',
  })
  const [tagInput, setTagInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...form,
      value: form.value ? parseFloat(form.value) : null,
      next_followup_at: form.next_followup_at || null,
      stage_id: form.stage_id || null,
    })
  }

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm({ ...form, tags: [...form.tags, tagInput.trim()] })
      setTagInput('')
    }
  }

  const removeTag = (tag) => {
    setForm({ ...form, tags: form.tags.filter(t => t !== tag) })
  }

  const inputClass = "w-full px-3 py-2.5 bg-surface-light border border-surface-lighter rounded-xl text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-200"

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-text">{lead ? 'Editar Lead' : 'Nuevo Lead'}</h3>
          <p className="text-xs text-text-muted mt-0.5">
            {lead ? 'Actualiza la información del contacto' : 'Añade un nuevo contacto a tu pipeline'}
          </p>
        </div>
        <button type="button" onClick={onCancel} className="p-2 hover:bg-surface-light rounded-xl transition-colors">
          <X className="w-5 h-5 text-text-muted" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-medium text-text-muted mb-1.5">Nombre *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
            placeholder="Nombre del contacto"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5">Empresa</label>
          <input
            type="text"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className={inputClass}
            placeholder="Nombre de la empresa"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5">Stage</label>
          <select
            value={form.stage_id}
            onChange={(e) => setForm({ ...form, stage_id: e.target.value })}
            className={inputClass}
          >
            <option value="">Sin stage</option>
            {stages.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
            placeholder="email@ejemplo.com"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5">Teléfono</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputClass}
            placeholder="+34 600 000 000"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5">Teléfono 2</label>
          <input
            type="tel"
            value={form.phone2}
            onChange={(e) => setForm({ ...form, phone2: e.target.value })}
            className={inputClass}
            placeholder="+34 600 000 000"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5">LinkedIn</label>
          <input
            type="url"
            value={form.linkedin}
            onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
            className={inputClass}
            placeholder="https://linkedin.com/in/..."
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5">Origen</label>
          <input
            type="text"
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            className={inputClass}
            placeholder="LinkedIn, referido, web..."
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5">Valor estimado ($)</label>
          <input
            type="number"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            className={inputClass}
            placeholder="5000"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-text-muted mb-1.5">Próximo seguimiento</label>
          <input
            type="datetime-local"
            value={form.next_followup_at}
            onChange={(e) => setForm({ ...form, next_followup_at: e.target.value })}
            className={inputClass}
          />
        </div>
        {form.next_followup_at && (
          <div className="col-span-2">
            <label className="block text-xs font-medium text-text-muted mb-1.5">Tipo de contacto</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 'mensaje', icon: MessageSquare, label: 'Mensaje', color: '#3b82f6' },
                { value: 'llamada', icon: Phone, label: 'Llamada', color: '#059669' },
                { value: 'reunion', icon: Users, label: 'Reunión', color: '#7c3aed' },
                { value: 'evento', icon: CalendarDays, label: 'Evento', color: '#f59e0b' },
              ].map(({ value, icon: Icon, label, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm({ ...form, followup_type: value })}
                  className={`flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all duration-200 ${
                    form.followup_type === value
                      ? 'border-transparent shadow-sm'
                      : 'border-surface-lighter text-text-muted hover:border-surface-lighter/80 hover:bg-surface-light'
                  }`}
                  style={form.followup_type === value ? { backgroundColor: `${color}15`, color, borderColor: `${color}40` } : {}}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-text-muted mb-1.5">Etiquetas</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="Agregar etiqueta..."
            className={`${inputClass} flex-1`}
          />
          <Button type="button" onClick={addTag} icon={Plus} size="md" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {form.tags.map(tag => {
            const tagObj = allTags?.find(t => t.name === tag)
            return (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: `${tagObj?.color || '#6366f1'}18`, color: tagObj?.color || '#6366f1' }}
              >
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="hover:opacity-70 transition-opacity">×</button>
              </span>
            )
          })}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" className="flex-1">
          {lead ? 'Guardar cambios' : 'Crear lead'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
