export default function Card({ children, className = '', hover = false, onClick, ...props }) {
  return (
    <div
      className={`bg-surface rounded-xl border border-surface-lighter ${hover ? 'hover:border-primary/30 hover:shadow-[var(--shadow-card-hover)] cursor-pointer' : 'shadow-[var(--shadow-card)]'} transition-all duration-300 ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}
