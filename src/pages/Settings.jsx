import { useState } from 'react'
import StageManager from '../components/settings/StageManager'
import TagBadge from '../components/leads/TagBadge'
import Button from '../components/ui/Button'
import { Plus, Trash2, Tag } from 'lucide-react'

const TAG_COLORS = ['#6366f1', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#22c55e', '#ef4444', '#06b6d4', '#f97316', '#64748b']

export default function Settings({ stages, tags, onCreateStage, onUpdateStage, onDeleteStage, onCreateTag, onDeleteTag }) {
  const [newTagName, setNewTagName] = useState('')
  const [newTagColor, setNewTagColor] = useState('#6366f1')

  const handleCreateTag = (e) => {
    e.preventDefault()
    if (!newTagName.trim()) return
    onCreateTag({ name: newTagName.trim(), color: newTagColor })
    setNewTagName('')
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div className="animate-slide-up">
        <h2 className="text-2xl font-bold text-text">Configuración</h2>
        <p className="text-sm text-text-muted mt-1">Personaliza tu pipeline y etiquetas</p>
      </div>

      <div className="animate-slide-up stagger-1">
        <StageManager
          stages={stages}
          onCreateStage={onCreateStage}
          onUpdateStage={onUpdateStage}
          onDeleteStage={onDeleteStage}
        />
      </div>

      <div className="animate-slide-up stagger-2">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-5 h-5 text-text-muted" />
          <h3 className="text-lg font-bold text-text">Etiquetas</h3>
        </div>
        <p className="text-sm text-text-muted mb-4">Crea etiquetas para categorizar tus leads.</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map(tag => (
            <div key={tag.id} className="flex items-center gap-1.5 group">
              <TagBadge name={tag.name} color={tag.color} />
              <button
                onClick={() => onDeleteTag(tag.id)}
                className="p-1 opacity-0 group-hover:opacity-100 hover:bg-danger/10 rounded-lg transition-all"
              >
                <Trash2 className="w-3 h-3 text-danger" />
              </button>
            </div>
          ))}
          {tags.length === 0 && (
            <p className="text-sm text-text-muted/60">No hay etiquetas creadas</p>
          )}
        </div>

        <form onSubmit={handleCreateTag} className="flex items-center gap-2 p-3.5 bg-surface-light rounded-xl border border-surface-lighter">
          <Plus className="w-4 h-4 text-text-muted shrink-0" />
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="Nombre de la etiqueta..."
            className="flex-1 px-2 py-1.5 bg-transparent text-sm text-text placeholder:text-text-muted/50 focus:outline-none"
          />
          <div className="flex gap-1">
            {TAG_COLORS.slice(0, 5).map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setNewTagColor(color)}
                className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${newTagColor === color ? 'border-white scale-110 shadow-sm' : 'border-transparent'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <Button type="submit" size="sm">Agregar</Button>
        </form>
      </div>
    </div>
  )
}
