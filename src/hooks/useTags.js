import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useTags() {
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTags = async () => {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name', { ascending: true })
    if (!error) setTags(data)
    setLoading(false)
  }

  useEffect(() => { fetchTags() }, []) // eslint-disable-line react-hooks/set-state-in-effect

  const createTag = async (tag) => {
    const { data, error } = await supabase
      .from('tags')
      .insert(tag)
      .select()
      .single()
    if (!error && data) {
      setTags([...tags, data])
      return data
    }
    return null
  }

  const deleteTag = async (id) => {
    const { error } = await supabase.from('tags').delete().eq('id', id)
    if (!error) {
      setTags(tags.filter(t => t.id !== id))
    }
  }

  return { tags, loading, createTag, deleteTag, fetchTags }
}
