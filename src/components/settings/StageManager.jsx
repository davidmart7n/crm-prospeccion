import { useState } from 'react'
import { Plus, Trash2, GripVertical, Edit2, Check, X } from 'lucide-react'
import Button from '../ui/Button'

const COLORS = ['#6366f1', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#22c55e', '#ef4444', '#06b6d4', '#f97316', '#64748b']

export default function StageManager({ stages, onCreateStage, onUpdateStage, onDeleteStage }) {
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState('#6366f1')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')

  const handleCreate = (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    onCreateStage({ name: newName.trim(), color: newColor })
    setNewName('')
  }

  const startEdit = (stage) => {
    setEditingId(stage.id)
    setEditName(stage.name)
  }

  const saveEdit = async (id) => {
    if (editName.trim()) {
      await onUpdateStage(id, { name: editName.trim() })
    }
    setEditingId(null)
  }

  const toggleClosed = (stage) => {
    onUpdateStage(stage.id, { is_closed: !stage.is_closed })
  }

  const toggleWon = (stage) => {
    onUpdateStage(stage.id, { is_won: !stage.is_won })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-text">Stages del Pipeline</h3>
        <p className="text-sm text-text-muted mt-1">Organiza las etapas por las que pasan tus leads.</p>
      </div>

      <div className="space-y-2">
        {stages.map(stage => (
          <div key={stage.id} className="flex items-center gap-3 p-3.5 bg-surface-light rounded-xl border border-surface-lighter hover:border-primary/20 transition-all duration-200 group">
            <GripVertical className="w-4 h-4 text-text-muted/40 shrink-0" />
            <div
              className="w-4 h-4 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: stage.color, boxShadow: `0 0 8px ${stage.color}30` }}
            ></div>
            {editingId === stage.id ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-surface border border-surface-lighter rounded-lg text-sm text-text focus:outline-none focus:border-primary/50"
                  autoFocus
                />
                <button onClick={() => saveEdit(stage.id)} className="p-1.5 hover:bg-success/10 rounded-lg transition-colors">
                  <Check className="w-4 h-4 text-success" />
                </button>
                <button onClick={() => setEditingId(null)} className="p-1.5 hover:bg-danger/10 rounded-lg transition-colors">
                  <X className="w-4 h-4 text-danger" />
                </button>
              </div>
            ) : (
              <>
                <span className="flex-1 text-sm font-medium text-text">{stage.name}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleClosed(stage)}
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full transition-colors ${
                      stage.is_closed
                        ? 'text-white bg-danger/80 hover:bg-danger'
                        : 'text-text-muted bg-surface-lighter hover:bg-surface-lighter/80'
                    }`}
                    title={stage.is_closed ? 'Etapa cerrada (click para abrir)' : 'Etapa abierta (click para cerrar)'}
                  >
                    {stage.is_closed ? 'Cerrado' : 'Abierto'}
                  </button>
                  <button
                    onClick={() => toggleWon(stage)}
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full transition-colors ${
                      stage.is_won
                        ? 'text-white bg-success/80 hover:bg-success'
                        : 'text-text-muted bg-surface-lighter hover:bg-surface-lighter/80'
                    }`}
                    title={stage.is_won ? 'Cuenta como ganado (click para quitar)' : 'No cuenta como ganado (click para marcar)'}
                  >
                    {stage.is_won ? 'Ganado' : 'No ganado'}
                  </button>
                </div>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEdit(stage)} className="p-1.5 hover:bg-surface-lighter rounded-lg transition-colors">
                    <Edit2 className="w-3.5 h-3.5 text-text-muted" />
                  </button>
                  <button onClick={() => onDeleteStage(stage.id)} className="p-1.5 hover:bg-danger/10 rounded-lg transition-colors">
                    <Trash2 className="w-3.5 h-3.5 text-danger" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleCreate} className="flex items-center gap-2 p-3.5 bg-surface-light rounded-xl border border-surface-lighter">
        <Plus className="w-4 h-4 text-text-muted shrink-0" />
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nombre del nuevo stage..."
          className="flex-1 px-2 py-1.5 bg-transparent text-sm text-text placeholder:text-text-muted/50 focus:outline-none"
        />
        <div className="flex gap-1">
          {COLORS.slice(0, 5).map(color => (
            <button
              key={color}
              type="button"
              onClick={() => setNewColor(color)}
              className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${newColor === color ? 'border-white scale-110 shadow-sm' : 'border-transparent'}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <Button type="submit" size="sm">Agregar</Button>
      </form>
    </div>
  )
}
