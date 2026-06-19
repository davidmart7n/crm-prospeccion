import { Search, Filter } from 'lucide-react'
import Input from '../ui/Input'
import Select from '../ui/Select'

export default function FilterBar({ search, setSearch, stageFilter, setStageFilter, tagFilter, setTagFilter, stages, tags }) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-surface rounded-xl border border-surface-lighter shadow-[var(--shadow-card)]">
      <div className="flex-1 min-w-[200px]">
        <Input
          icon={Search}
          placeholder="Buscar leads..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-text-muted shrink-0" />
        <Select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
        >
          <option value="">Todos los stages</option>
          {stages.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </Select>
        <Select
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
        >
          <option value="">Todas las etiquetas</option>
          {tags.map(t => (
            <option key={t.id} value={t.name}>{t.name}</option>
          ))}
        </Select>
      </div>
    </div>
  )
}
