import { useState, useMemo, useEffect } from 'react'
import { Users, TrendingUp, Clock, Trophy, DollarSign } from 'lucide-react'
import { supabase } from '../lib/supabase'
import LeadTable from '../components/leads/LeadTable'
import FilterBar from '../components/leads/FilterBar'

function StatCard({ icon: Icon, label, value, color, className = '' }) {
  return (
    <div className={`bg-surface rounded-xl p-5 border border-surface-lighter shadow-[var(--shadow-card)] hover:border-primary/20 hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 group ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${color}12` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-bold text-text">{value}</p>
      <p className="text-xs text-text-muted mt-1">{label}</p>
    </div>
  )
}

export default function Dashboard({ leads, stages, tags, onLeadClick, onUpdateLead }) {
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [latestNotes, setLatestNotes] = useState({})

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchSearch = !search ||
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.company?.toLowerCase().includes(search.toLowerCase()) ||
        lead.email?.toLowerCase().includes(search.toLowerCase())
      const matchStage = !stageFilter || lead.stage_id === stageFilter
      const matchTag = !tagFilter || lead.tags?.includes(tagFilter)
      return matchSearch && matchStage && matchTag
    })
  }, [leads, search, stageFilter, tagFilter])

  useEffect(() => {
    const fetchLatestNotes = async () => {
      if (filteredLeads.length === 0) {
        setLatestNotes({})
        return
      }
      const leadIds = filteredLeads.map(l => l.id)
      const { data } = await supabase
        .from('notes')
        .select('lead_id, content, type, created_at')
        .in('lead_id', leadIds)
        .order('created_at', { ascending: false })
      if (data) {
        const map = {}
        data.forEach(note => {
          if (!map[note.lead_id]) map[note.lead_id] = note
        })
        setLatestNotes(map)
      }
    }
    fetchLatestNotes()
  }, [filteredLeads])

  const stats = useMemo(() => {
    const now = new Date()
    const closedStages = stages.filter(s => s.is_closed).map(s => s.id)
    const wonStages = stages.filter(s => s.is_won).map(s => s.id)
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

    return {
      total: leads.length,
      pipeline: pipeline >= 1000 ? `$${(pipeline / 1000).toFixed(1)}K` : `$${pipeline}`,
      followups,
      won,
      wonRevenue: wonRevenue >= 1000 ? `$${(wonRevenue / 1000).toFixed(1)}K` : `$${wonRevenue}`,
    }
  }, [leads, stages])

  return (
    <div className="space-y-6">
      <div className="animate-slide-up">
        <h2 className="text-2xl font-bold text-text">Leads</h2>
        <p className="text-sm text-text-muted mt-1">Gestiona y convierte tus prospectos en clientes</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={Users}
          label="Total Leads"
          value={stats.total}
          color="var(--_primary)"
          className="animate-slide-up stagger-1"
        />
        <StatCard
          icon={TrendingUp}
          label="Pipeline"
          value={stats.pipeline}
          color="var(--_success)"
          className="animate-slide-up stagger-2"
        />
        <StatCard
          icon={DollarSign}
          label="Ingresos Ganados"
          value={stats.wonRevenue}
          color="#10b981"
          className="animate-slide-up stagger-3"
        />
        <StatCard
          icon={Clock}
          label="Necesitan seguimiento"
          value={stats.followups}
          color="var(--_warning)"
          className="animate-slide-up stagger-4"
        />
        <StatCard
          icon={Trophy}
          label="Ganados"
          value={stats.won}
          color="var(--_accent)"
          className="animate-slide-up stagger-5"
        />
      </div>

      <FilterBar
        search={search}
        setSearch={setSearch}
        stageFilter={stageFilter}
        setStageFilter={setStageFilter}
        tagFilter={tagFilter}
        setTagFilter={setTagFilter}
        stages={stages}
        tags={tags}
      />

      <LeadTable
        leads={filteredLeads}
        stages={stages}
        tags={tags}
        latestNotes={latestNotes}
        onLeadClick={onLeadClick}
        onUpdateLead={onUpdateLead}
      />
    </div>
  )
}
