import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useLeads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setLeads(data)
    setLoading(false)
  }

  useEffect(() => { fetchLeads() }, []) // eslint-disable-line react-hooks/set-state-in-effect

  const createLead = async (lead) => {
    const { data, error } = await supabase
      .from('leads')
      .insert(lead)
      .select()
      .single()
    if (!error && data) {
      setLeads(prev => [data, ...prev])
      return data
    }
    return null
  }

  const updateLead = async (id, updates) => {
    const { data, error } = await supabase
      .from('leads')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (!error && data) {
      setLeads(prev => prev.map(l => l.id === id ? data : l))
      return data
    }
    return null
  }

  const deleteLead = async (id) => {
    const { error } = await supabase.from('leads').delete().eq('id', id)
    if (!error) {
      setLeads(prev => prev.filter(l => l.id !== id))
    }
  }

  const moveLead = async (id, stageId) => {
    return updateLead(id, { stage_id: stageId })
  }

  return { leads, loading, createLead, updateLead, deleteLead, moveLead, fetchLeads }
}