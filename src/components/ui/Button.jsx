export default function Button({ children, variant = 'primary', size = 'md', loading, icon: Icon, className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none'

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/25 active:scale-[0.98]',
    ghost: 'text-text-muted hover:text-text hover:bg-surface-light active:scale-[0.98]',
    danger: 'bg-danger/10 text-danger hover:bg-danger/20 active:scale-[0.98]',
    outline: 'border border-surface-lighter text-text hover:bg-surface-light hover:border-primary/30 active:scale-[0.98]',
    success: 'bg-success/10 text-success hover:bg-success/20 active:scale-[0.98]',
  }

  const sizes = {
    xs: 'px-2.5 py-1 text-xs',
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {loading ? (
        <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  )
}
