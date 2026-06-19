import { useState, useMemo } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Phone,
  Users,
  CalendarDays,
  Clock,
  Building2,
  Mail,
} from 'lucide-react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  parseISO,
} from 'date-fns'
import { es } from 'date-fns/locale'

const FOLLOWUP_TYPES = {
  mensaje: { icon: MessageSquare, label: 'Mensaje', color: '#3b82f6' },
  llamada: { icon: Phone, label: 'Llamada', color: '#059669' },
  reunion: { icon: Users, label: 'Reunión', color: '#7c3aed' },
  evento: { icon: CalendarDays, label: 'Evento', color: '#f59e0b' },
}

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

export default function CalendarView({ leads, onLeadClick }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [filterType, setFilterType] = useState('')

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 })
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
    return eachDayOfInterval({ start: calStart, end: calEnd })
  }, [currentMonth])

  const followupLeads = useMemo(() => {
    return leads.filter(l => l.next_followup_at)
  }, [leads])

  const eventsByDay = useMemo(() => {
    const map = {}
    followupLeads.forEach(lead => {
      const date = parseISO(lead.next_followup_at)
      const key = format(date, 'yyyy-MM-dd')
      if (!map[key]) map[key] = []
      map[key].push(lead)
    })
    Object.values(map).forEach(arr => {
      arr.sort((a, b) => new Date(a.next_followup_at) - new Date(b.next_followup_at))
    })
    return map
  }, [followupLeads])

  const selectedDateKey = format(selectedDate, 'yyyy-MM-dd')
  const selectedDayEvents = eventsByDay[selectedDateKey] || []

  const filteredSelectedEvents = filterType
    ? selectedDayEvents.filter(e => (e.followup_type || 'llamada') === filterType)
    : selectedDayEvents

  const todayEvents = useMemo(() => {
    const key = format(new Date(), 'yyyy-MM-dd')
    return eventsByDay[key] || []
  }, [eventsByDay])

  const upcomingEvents = useMemo(() => {
    const now = new Date()
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    return followupLeads
      .filter(l => {
        const d = parseISO(l.next_followup_at)
        return d >= now && d <= in7Days
      })
      .sort((a, b) => new Date(a.next_followup_at) - new Date(b.next_followup_at))
  }, [followupLeads])

  const typeCounts = useMemo(() => {
    const counts = { mensaje: 0, llamada: 0, reunion: 0, evento: 0 }
    followupLeads.forEach(l => {
      const t = l.followup_type || 'llamada'
      if (counts[t] !== undefined) counts[t]++
    })
    return counts
  }, [followupLeads])

  return (
    <div className="space-y-6">
      <div className="animate-slide-up">
        <h2 className="text-2xl font-bold text-text">Calendario</h2>
        <p className="text-sm text-text-muted mt-1">Planifica y visualiza tus próximos contactos</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {Object.entries(FOLLOWUP_TYPES).map(([key, { icon: Icon, label, color }]) => (
          <div
            key={key}
            className="bg-surface rounded-xl p-4 border border-surface-lighter shadow-[var(--shadow-card)] hover:border-primary/20 hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 group animate-slide-up"
          >
            <div className="flex items-center justify-between">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${color}12` }}
              >
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <span className="text-2xl font-bold text-text">{typeCounts[key]}</span>
            </div>
            <p className="text-xs text-text-muted mt-2">{label}es programados</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-surface rounded-2xl border border-surface-lighter shadow-[var(--shadow-card)] p-5 animate-slide-up stagger-1">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-text capitalize">
              {format(currentMonth, 'MMMM yyyy', { locale: es })}
            </h3>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentMonth(new Date())}
                className="px-3 py-1.5 text-xs font-medium text-primary bg-primary/8 hover:bg-primary/15 rounded-lg transition-colors"
              >
                Hoy
              </button>
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-1.5 hover:bg-surface-light rounded-lg transition-colors text-text-muted hover:text-text"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-1.5 hover:bg-surface-light rounded-lg transition-colors text-text-muted hover:text-text"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px bg-surface-lighter rounded-xl overflow-hidden border border-surface-lighter">
            {WEEKDAYS.map(day => (
              <div key={day} className="bg-surface-light px-2 py-2.5 text-center">
                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">{day}</span>
              </div>
            ))}

            {calendarDays.map(day => {
              const key = format(day, 'yyyy-MM-dd')
              const dayEvents = eventsByDay[key] || []
              const inMonth = isSameMonth(day, currentMonth)
              const today = isToday(day)
              const selected = isSameDay(day, selectedDate)

              return (
                <button
                  key={key}
                  onClick={() => setSelectedDate(day)}
                  className={`relative bg-surface min-h-[80px] p-1.5 text-left transition-all duration-150 hover:bg-surface-light/50 ${
                    !inMonth ? 'opacity-35' : ''
                  } ${selected ? 'ring-2 ring-inset ring-primary/40 bg-primary/5' : ''}`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 text-xs font-semibold rounded-full ${
                      today
                        ? 'bg-gradient-to-r from-primary to-accent text-white'
                        : selected
                          ? 'text-primary'
                          : 'text-text'
                    }`}
                  >
                    {format(day, 'd')}
                  </span>

                  <div className="mt-0.5 space-y-0.5">
                    {dayEvents.slice(0, 3).map(event => {
                      const type = FOLLOWUP_TYPES[event.followup_type || 'llamada'] || FOLLOWUP_TYPES.llamada
                      const Icon = type.icon
                      return (
                        <div
                          key={event.id}
                          className="flex items-center gap-1 px-1 py-0.5 rounded text-[10px] font-medium truncate"
                          style={{ backgroundColor: `${type.color}12`, color: type.color }}
                        >
                          <Icon className="w-2.5 h-2.5 shrink-0" />
                          <span className="truncate">{event.name}</span>
                        </div>
                      )
                    })}
                    {dayEvents.length > 3 && (
                      <span className="text-[10px] text-text-muted font-medium pl-1">
                        +{dayEvents.length - 3} más
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-4 animate-slide-up stagger-2">
          <div className="bg-surface rounded-2xl border border-surface-lighter shadow-[var(--shadow-card)] p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-text capitalize">
                  {format(selectedDate, "d 'de' MMMM", { locale: es })}
                </h3>
                <p className="text-[11px] text-text-muted mt-0.5">
                  {selectedDayEvents.length === 0
                    ? 'Sin eventos programados'
                    : `${selectedDayEvents.length} evento${selectedDayEvents.length > 1 ? 's' : ''}`}
                </p>
              </div>
              {selectedDayEvents.length > 0 && (
                <div className="flex gap-1">
                  {Object.entries(FOLLOWUP_TYPES).map(([key, { icon: Icon, color }]) => (
                    <button
                      key={key}
                      onClick={() => setFilterType(filterType === key ? '' : key)}
                      className={`p-1.5 rounded-lg transition-all duration-200 ${
                        filterType === key ? 'shadow-sm' : 'hover:bg-surface-light'
                      }`}
                      style={
                        filterType === key
                          ? { backgroundColor: `${color}15`, color }
                          : { color: 'var(--_text-muted)' }
                      }
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {filteredSelectedEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-text-muted">
                <CalendarDays className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-xs">
                  {filterType ? 'No hay eventos de este tipo' : 'Arrastra o selecciona un día'}
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                {filteredSelectedEvents.map(event => {
                  const type = FOLLOWUP_TYPES[event.followup_type || 'llamada'] || FOLLOWUP_TYPES.llamada
                  const Icon = type.icon
                  const time = format(parseISO(event.next_followup_at), 'HH:mm')

                  return (
                    <button
                      key={event.id}
                      onClick={() => onLeadClick(event)}
                      className="w-full text-left p-3 rounded-xl border border-surface-lighter hover:border-primary/20 hover:shadow-[var(--shadow-card-hover)] transition-all duration-200 group"
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: `${type.color}12` }}
                        >
                          <Icon className="w-4 h-4" style={{ color: type.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-text truncate group-hover:text-primary transition-colors">
                            {event.name}
                          </p>
                          {event.company && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3 h-3 text-text-muted" />
                              <span className="text-[11px] text-text-muted truncate">{event.company}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2.5 mt-1.5">
                            <span className="flex items-center gap-1 text-[11px] font-medium" style={{ color: type.color }}>
                              <Clock className="w-3 h-3" />
                              {time}
                            </span>
                            <span
                              className="px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                              style={{ backgroundColor: `${type.color}12`, color: type.color }}
                            >
                              {type.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="bg-surface rounded-2xl border border-surface-lighter shadow-[var(--shadow-card)] p-5">
            <h3 className="text-sm font-bold text-text mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Próximos 7 días
            </h3>
            {upcomingEvents.length === 0 ? (
              <p className="text-xs text-text-muted py-4 text-center">Sin eventos próximos</p>
            ) : (
              <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                {upcomingEvents.map(event => {
                  const type = FOLLOWUP_TYPES[event.followup_type || 'llamada'] || FOLLOWUP_TYPES.llamada
                  const Icon = type.icon
                  const date = parseISO(event.next_followup_at)

                  return (
                    <button
                      key={event.id}
                      onClick={() => {
                        setSelectedDate(date)
                        setCurrentMonth(date)
                        onLeadClick(event)
                      }}
                      className="w-full text-left flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-light transition-colors group"
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${type.color}12` }}
                      >
                        <Icon className="w-3.5 h-3.5" style={{ color: type.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-text truncate group-hover:text-primary transition-colors">
                          {event.name}
                        </p>
                        <p className="text-[10px] text-text-muted">
                          {format(date, "d MMM 'a las' HH:mm", { locale: es })}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
