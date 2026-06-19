import { useState, useMemo, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import LeadForm from './components/leads/LeadForm'
import LeadDetail from './components/leads/LeadDetail'
import Dashboard from './pages/Dashboard'
import KanbanView from './pages/KanbanView'
import CalendarView from './pages/CalendarView'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Modal from './components/ui/Modal'
import { useLeads } from './hooks/useLeads'
import { useStages } from './hooks/useStages'
import { useTags } from './hooks/useTags'
import { useAuth } from './context/AuthContext'
import { supabase } from './lib/supabase'

function AuthenticatedApp() {
  const [sessionReady, setSessionReady] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionReady(true)
      } else {
        supabase.auth.refreshSession().then(() => {
          setSessionReady(true)
        })
      }
    })
  }, [])

  if (!sessionReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-text-muted">Cargando sesión...</p>
        </div>
      </div>
    )
  }

  const { leads, loading: leadsLoading, createLead, updateLead, deleteLead, moveLead } = useLeads()
  const { stages, loading: stagesLoading, createStage, updateStage, deleteStage } = useStages()
  const { tags, createTag, deleteTag } = useTags()

  const [showForm, setShowForm] = useState(false)
  const [editingLead, setEditingLead] = useState(null)
  const [selectedLeadId, setSelectedLeadId] = useState(null)

  const selectedLead = useMemo(
    () => selectedLeadId ? leads.find(l => l.id === selectedLeadId) ?? null : null,
    [selectedLeadId, leads]
  )

  const handleNewLead = () => {
    setEditingLead(null)
    setShowForm(true)
  }

  const handleEditLead = (lead) => {
    setEditingLead(lead)
    setSelectedLeadId(null)
    setShowForm(true)
  }

  const handleSubmitLead = async (data) => {
    if (editingLead) {
      await updateLead(editingLead.id, data)
    } else {
      await createLead(data)
    }
    setShowForm(false)
    setEditingLead(null)
  }

  const handleLeadClick = (lead) => {
    setSelectedLeadId(lead.id)
  }

  if (leadsLoading || stagesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-text-muted">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter basename="/crm-prospeccion">
      <Routes>
        <Route element={<Layout onNewLead={handleNewLead} leads={leads} stages={stages} />}>
          <Route
            index
            element={
              <Dashboard
                leads={leads}
                stages={stages}
                tags={tags}
                onLeadClick={handleLeadClick}
                onUpdateLead={updateLead}
              />
            }
          />
          <Route
            path="kanban"
            element={
              <KanbanView
                leads={leads}
                stages={stages}
                tags={tags}
                onLeadClick={handleLeadClick}
                onMoveLead={moveLead}
              />
            }
          />
          <Route
            path="calendar"
            element={
              <CalendarView
                leads={leads}
                onLeadClick={handleLeadClick}
              />
            }
          />
          <Route
            path="settings"
            element={
              <Settings
                stages={stages}
                tags={tags}
                onCreateStage={createStage}
                onUpdateStage={updateStage}
                onDeleteStage={deleteStage}
                onCreateTag={createTag}
                onDeleteTag={deleteTag}
              />
            }
          />
        </Route>
      </Routes>

      <Modal open={showForm} onClose={() => { setShowForm(false); setEditingLead(null) }}>
        <LeadForm
          lead={editingLead}
          stages={stages}
          tags={tags}
          onSubmit={handleSubmitLead}
          onCancel={() => { setShowForm(false); setEditingLead(null) }}
        />
      </Modal>

      {selectedLead && (
        <LeadDetail
          lead={selectedLead}
          stages={stages}
          tags={tags}
          onClose={() => setSelectedLeadId(null)}
          onEdit={handleEditLead}
          onDelete={deleteLead}
          onUpdate={updateLead}
        />
      )}
    </BrowserRouter>
  )
}

export default function App() {
  const { user, loading: authLoading } = useAuth()

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-text-muted">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <BrowserRouter basename="/crm-prospeccion">
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    )
  }

  return <AuthenticatedApp />
}