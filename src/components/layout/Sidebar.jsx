import { useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutList, Kanban, Settings, Plus, Sun, Moon, TrendingUp, Clock, Target, DollarSign, CalendarDays, LogOut } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/', icon: LayoutList, label: 'Leads', end: true },
  { to: '/kanban', icon: Kanban, label: 'Kanban', end: false },
  { to: '/calendar', icon: CalendarDays, label: 'Calendario', end: false },
  { to: '/settings', icon: Settings, label: 'Config', end: false },
]

export default function Sidebar({ leads, stages, onNewLead }) {
  const { theme, toggleTheme } = useTheme()
  const { logout } = useAuth()

  const stats = useMemo(() => {
    if (!leads || !stages) return { total: 0, pipeline: 0, followups: 0, won: 0, wonRevenue: 0 }

    const now = new Date()
    const closedStages = stages.filter(s => s.is_closed).map(s => s.id)
    const wonStages = stages.filter(s => s.is_won).map(s => s.id)
    const total = leads.length
    const pipeline = leads
      .filter(l => !closedStages.includes(l.stage_id))
      .reduce((sum, l) => sum + (l.value || 0), 0)
    const followups = leads.filter(l => {
      if (!l.last_contact_at) return true
      const days = Math.floor((now - new Date(l.last_contact_at)) / (1000 * 60 * 60 * 24))
      return days > 7
    }).length
    const won = leads.filter(l => wonStages.includes(l.stage_id)).length
    const wonRevenue = leads
      .filter(l => wonStages.includes(l.stage_id))
      .reduce((sum, l) => sum + (l.value || 0), 0)

    return { total, pipeline, followups, won, wonRevenue }
  }, [leads, stages])

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
      isActive
        ? 'bg-primary/10 text-primary shadow-sm'
        : 'text-text-muted hover:text-text hover:bg-surface-light'
    }`

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-surface border-r border-surface-lighter flex flex-col z-30">
      <div className="px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-gradient">
            <Target className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CRM Pro
            </h1>
            <p className="text-[10px] text-text-muted -mt-0.5 tracking-wide">PROSPECCION</p>
          </div>
        </div>
      </div>

      <div className="px-3 mb-2">
        <button
          onClick={onNewLead}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-accent text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Nuevo Lead
        </button>
      </div>

      <nav className="px-3 space-y-1">
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
            <item.icon className="w-4 h-4 shrink-0" />
            <span>{item.label}</span>
            {item.to === '/' && stats.total > 0 && (
              <span className="ml-auto text-[10px] font-semibold bg-surface-lighter px-1.5 py-0.5 rounded-full text-text-muted">
                {stats.total}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-4 py-4 space-y-4">
        <div className="space-y-3">
          <p className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">Pipeline</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-surface-light rounded-lg p-2.5 border border-surface-lighter">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="w-3 h-3 text-success" />
                <span className="text-[10px] text-text-muted">Valor</span>
              </div>
              <p className="text-sm font-bold text-text">
                {stats.pipeline >= 1000 ? `$${(stats.pipeline / 1000).toFixed(0)}K` : `$${stats.pipeline}`}
              </p>
            </div>
            <div className="bg-surface-light rounded-lg p-2.5 border border-surface-lighter">
              <div className="flex items-center gap-1.5 mb-1">
                <DollarSign className="w-3 h-3 text-success" />
                <span className="text-[10px] text-text-muted">Ganado</span>
              </div>
              <p className="text-sm font-bold text-success">
                {stats.wonRevenue >= 1000 ? `$${(stats.wonRevenue / 1000).toFixed(0)}K` : `$${stats.wonRevenue}`}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-surface-light rounded-lg p-2.5 border border-surface-lighter">
              <div className="flex items-center gap-1.5 mb-1">
                <Target className="w-3 h-3 text-primary" />
                <span className="text-[10px] text-text-muted">Ganados</span>
              </div>
              <p className="text-sm font-bold text-text">{stats.won}</p>
            </div>
            <div className="bg-surface-light rounded-lg p-2.5 border border-surface-lighter">
              <div className="flex items-center gap-1.5 mb-1">
                <Target className="w-3 h-3 text-text-muted" />
                <span className="text-[10px] text-text-muted">Total</span>
              </div>
              <p className="text-sm font-bold text-text">{stats.total}</p>
            </div>
          </div>
          {stats.followups > 0 && (
            <div className="flex items-center gap-2 px-2.5 py-2 bg-danger/8 rounded-lg border border-danger/15">
              <Clock className="w-3.5 h-3.5 text-danger" />
              <span className="text-xs text-danger font-medium">{stats.followups} necesitan seguimiento</span>
            </div>
          )}
        </div>

        <div className="border-t border-surface-lighter pt-3 space-y-1">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-text-muted hover:text-text hover:bg-surface-light transition-all duration-200"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span>{theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-text-muted hover:text-danger hover:bg-danger/8 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
