export default function TagBadge({ name, color = '#6366f1', onRemove }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105"
      style={{ backgroundColor: `${color}18`, color }}
    >
      {name}
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          className="hover:opacity-60 ml-0.5 transition-opacity"
        >
          ×
        </button>
      )}
    </span>
  )
}
