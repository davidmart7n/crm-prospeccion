import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jkczmvxhrcpprphntkhz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprY3ptdnhocmNwcHJwaG50a2h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExODI3OTAsImV4cCI6MjA5Njc1ODc5MH0.e4jHEtYTpwsSuEKDg9rM8HUxzEZ68xfMUTX9BW6Ir6k'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
