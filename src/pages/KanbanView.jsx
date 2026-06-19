import LeadKanban from '../components/kanban/LeadKanban'

export default function KanbanView({ leads, stages, tags, onLeadClick, onMoveLead }) {
  return (
    <div className="space-y-6">
      <div className="animate-slide-up">
        <h2 className="text-2xl font-bold text-text">Pipeline</h2>
        <p className="text-sm text-text-muted mt-1">Arrastra los leads entre stages para actualizar su progreso</p>
      </div>
      <LeadKanban
        leads={leads}
        stages={stages}
        tags={tags}
        onLeadClick={onLeadClick}
        onMoveLead={onMoveLead}
      />
    </div>
  )
}
