import { useState, useRef, useEffect } from 'react'
import { Pencil } from 'lucide-react'

export default function InlineEdit({ value, onSave, type = 'text', options = [], displayContent, placeholder = '-' }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value ?? '')
  const inputRef = useRef(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      if (type === 'text' || type === 'number') {
        inputRef.current.select()
      }
    }
  }, [isEditing, type])

  const handleSave = () => {
    setIsEditing(false)
    const saveValue = type === 'number'
      ? (editValue === '' ? null : parseFloat(editValue))
      : editValue
    if (JSON.stringify(saveValue) !== JSON.stringify(value)) {
      onSave(saveValue)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditValue(value ?? '')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  if (isEditing) {
    if (type === 'select') {
      return (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <select
            ref={inputRef}
            value={editValue || ''}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className="w-full px-1.5 py-0.5 bg-surface-light border border-primary/50 rounded-lg text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Sin stage</option>
            {options.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          type={type === 'number' ? 'number' : 'text'}
          value={editValue ?? ''}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          placeholder={placeholder}
          className="w-full px-1.5 py-0.5 bg-surface-light border border-primary/50 rounded-lg text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
    )
  }

  return (
    <div
      className="group/cell relative flex items-center gap-1 min-h-[24px] cursor-pointer"
      onClick={(e) => {
        e.stopPropagation()
        setEditValue(value ?? '')
        setIsEditing(true)
      }}
    >
      <div className="flex-1">
        {displayContent || (value != null && value !== '' ? String(value) : <span className="text-text-muted/30">{placeholder}</span>)}
      </div>
      <button
        className="shrink-0 opacity-0 group-hover/cell:opacity-100 transition-opacity text-text-muted hover:text-primary"
        onClick={(e) => {
          e.stopPropagation()
          setEditValue(value ?? '')
          setIsEditing(true)
        }}
      >
        <Pencil className="w-3 h-3" />
      </button>
    </div>
  )
}
