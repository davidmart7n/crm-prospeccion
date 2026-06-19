-- CRM Prospeccion - Schema para Supabase

-- Stages personalizables del pipeline
CREATE TABLE stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1',
  sort_order INTEGER NOT NULL,
  is_closed BOOLEAN DEFAULT FALSE,
  is_won BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT,
  email TEXT,
  phone TEXT,
  phone2 TEXT,
  linkedin TEXT,
  stage_id UUID REFERENCES stages(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  source TEXT,
  value DECIMAL,
  last_contact_at TIMESTAMPTZ,
  next_followup_at TIMESTAMPTZ,
  followup_type TEXT DEFAULT 'llamada',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notas/actividades por lead
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'note',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Tags con colores
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Datos iniciales de stages
INSERT INTO stages (name, color, sort_order, is_closed, is_won) VALUES
  ('Nuevo', '#6366f1', 0, FALSE, FALSE),
  ('Llamada', '#3b82f6', 1, FALSE, FALSE),
  ('Seguimiento', '#0ea5e9', 2, FALSE, FALSE),
  ('Reunión', '#8b5cf6', 3, FALSE, FALSE),
  ('Propuesta', '#f59e0b', 4, FALSE, FALSE),
  ('Ganado', '#22c55e', 5, TRUE, TRUE),
  ('Perdido', '#ef4444', 6, TRUE, FALSE);

-- Habilitar RLS (Row Level Security)
ALTER TABLE stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Políticas restrictivas: solo usuarios autenticados
CREATE POLICY "Authenticated users can access stages" ON stages FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can access leads" ON leads FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can access notes" ON notes FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can access tags" ON tags FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Migración: si ya tienes la tabla creada, ejecuta esto:
-- ALTER TABLE stages ADD COLUMN IF NOT EXISTS is_won BOOLEAN DEFAULT FALSE;
-- UPDATE stages SET is_won = TRUE WHERE name = 'Ganado';

-- Migración: añadir phone2 y linkedin a leads
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS phone2 TEXT;
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS linkedin TEXT;

-- Migración: añadir followup_type a leads
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS followup_type TEXT DEFAULT 'llamada';

-- Migración: añadir stage "Seguimiento" entre Llamada y Reunión
-- INSERT INTO stages (name, color, sort_order, is_closed, is_won) VALUES ('Seguimiento', '#0ea5e9', 2, FALSE, FALSE);
-- UPDATE stages SET sort_order = sort_order + 1 WHERE sort_order >= 2 AND name != 'Seguimiento';
