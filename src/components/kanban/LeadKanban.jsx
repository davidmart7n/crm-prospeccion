import { DndContext, closestCorners } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import LeadCard from '../leads/LeadCard'

function StageColumn({ stage, leads, tags, onLeadClick }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id })
  const columnLeads = leads.filter(l => l.stage_id === stage.id)

  return (
    <div className={`flex flex-col min-w-[280px] max-w-[320px] rounded-2xl transition-all duration-300 ${isOver ? 'bg-primary/5 ring-2 ring-primary/20' : 'bg-surface-light/30'}`}>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-3 h-3 rounded-full shadow-sm"
            style={{ backgroundColor: stage.color, boxShadow: `0 0 8px ${stage.color}40` }}
          ></div>
          <h3 className="font-semibold text-sm text-text">{stage.name}</h3>
          <span className="text-[10px] font-bold text-text-muted bg-surface-lighter px-2 py-0.5 rounded-full">
            {columnLeads.length}
          </span>
        </div>
        {columnLeads.length > 0 && (
          <span className="text-[10px] text-text-muted">
            ${columnLeads.reduce((s, l) => s + (l.value || 0), 0).toLocaleString()}
          </span>
        )}
      </div>
      <div ref={setNodeRef} className="flex-1 p-2 space-y-2 min-h-[100px]">
        <SortableContext items={columnLeads.map(l => l.id)} strategy={verticalListSortingStrategy}>
          {columnLeads.map(lead => (
            <LeadCard
              key={lead.id}
              lead={lead}
              tags={tags}
              stage={stage}
              onClick={() => onLeadClick(lead)}
            />
          ))}
        </SortableContext>
        {columnLeads.length === 0 && (
          <div className="flex items-center justify-center h-24 rounded-xl border-2 border-dashed border-surface-lighter/50">
            <p className="text-xs text-text-muted/40">Arrastra leads aquí</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function LeadKanban({ leads, stages, tags, onLeadClick, onMoveLead }) {
  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over) return

    const leadId = active.id
    const overId = over.id

    const leadStage = leads.find(l => l.id === leadId)?.stage_id
    const overStage = stages.find(s => s.id === overId)
    const overLead = leads.find(l => l.id === overId)

    let targetStageId = null
    if (overStage) {
      targetStageId = overStage.id
    } else if (overLead) {
      targetStageId = overLead.stage_id
    }

    if (targetStageId && targetStageId !== leadStage) {
      onMoveLead(leadId, targetStageId)
    }
  }

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map(stage => (
          <StageColumn
            key={stage.id}
            stage={stage}
            leads={leads}
            tags={tags}
            onLeadClick={onLeadClick}
          />
        ))}
      </div>
    </DndContext>
  )
}
