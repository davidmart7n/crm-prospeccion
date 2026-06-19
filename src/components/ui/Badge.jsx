export default function Badge({ children, color = 'var(--_primary)', size = 'md', dot, className = '' }) {
  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizes[size]} ${className}`}
      style={{ backgroundColor: `${color}18`, color }}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />}
      {children}
    </span>
  )
}
