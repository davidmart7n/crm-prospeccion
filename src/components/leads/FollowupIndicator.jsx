import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export default function FollowupIndicator({ lastContactAt, nextFollowupAt }) {
  if (!lastContactAt) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-danger/10 text-danger animate-pulse-glow">
        <span className="w-1.5 h-1.5 rounded-full bg-danger"></span>
        Sin contacto
      </span>
    )
  }

  const now = new Date()
  const lastContact = new Date(lastContactAt)
  const daysDiff = Math.floor((now - lastContact) / (1000 * 60 * 60 * 24))

  let colorClass = 'bg-success/10 text-success'
  let dotClass = 'bg-success'

  if (daysDiff > 7) {
    colorClass = 'bg-danger/10 text-danger animate-pulse-glow'
    dotClass = 'bg-danger'
  } else if (daysDiff > 3) {
    colorClass = 'bg-warning/10 text-warning'
    dotClass = 'bg-warning'
  }

  const timeAgo = formatDistanceToNow(lastContact, { addSuffix: true, locale: es })

  return (
    <div className="flex flex-col gap-0.5">
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`}></span>
        {timeAgo}
      </span>
      {nextFollowupAt && new Date(nextFollowupAt) > now && (
        <span className="text-[10px] text-text-muted">
          Próximo: {formatDistanceToNow(new Date(nextFollowupAt), { addSuffix: true, locale: es })}
        </span>
      )}
    </div>
  )
}
