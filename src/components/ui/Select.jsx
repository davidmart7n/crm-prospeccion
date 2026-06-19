import { forwardRef } from 'react'

const Select = forwardRef(function Select({ icon: Icon, className = '', children, ...props }, ref) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
      )}
      <select
        ref={ref}
        className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-8 py-2.5 bg-surface-light border border-surface-lighter rounded-xl text-sm text-text appearance-none focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-200 cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </select>
      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  )
})

export default Select
