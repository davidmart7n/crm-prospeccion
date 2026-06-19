import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Building2, Phone, Mail, Link2 } from 'lucide-react'
import TagBadge from './TagBadge'
import FollowupIndicator from './FollowupIndicator'

export default function LeadCard({ lead, onClick, tags: allTags }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lead.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const getTagColor = (tagName) => {
    const tag = allTags?.find(t => t.name === tagName)
    return tag?.color || '#6366f1'
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="group p-3.5 bg-surface border border-surface-lighter rounded-xl cursor-pointer hover:border-primary/30 hover:shadow-[var(--shadow-card-hover)] transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-semibold text-sm text-text group-hover:text-primary transition-colors">{lead.name}</h4>
        <FollowupIndicator lastContactAt={lead.last_contact_at} />
      </div>
      {lead.company && (
        <div className="flex items-center gap-1.5 text-xs text-text-muted mb-1.5">
          <Building2 className="w-3 h-3 shrink-0" />
          <span className="truncate">{lead.company}</span>
        </div>
      )}
      <div className="flex items-center gap-2 text-xs text-text-muted mb-2.5">
        {lead.phone && <Phone className="w-3 h-3" />}
        {lead.phone2 && <Phone className="w-3 h-3 opacity-60" />}
        {lead.email && <Mail className="w-3 h-3" />}
        {lead.linkedin && <Link2 className="w-3 h-3 text-blue-500" />}
      </div>
      {lead.tags && lead.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {lead.tags.map(tag => (
            <TagBadge key={tag} name={tag} color={getTagColor(tag)} />
          ))}
        </div>
      )}
      {lead.value && (
        <div className="text-xs font-bold text-success">
          ${lead.value.toLocaleString()}
        </div>
      )}
    </div>
  )
}
