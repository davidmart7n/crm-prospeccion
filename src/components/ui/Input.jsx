import { forwardRef } from 'react'

const Input = forwardRef(function Input({ icon: Icon, className = '', ...props }, ref) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
      )}
      <input
        ref={ref}
        className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5 bg-surface-light border border-surface-lighter rounded-xl text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-200 ${className}`}
        {...props}
      />
    </div>
  )
})

export default Input
