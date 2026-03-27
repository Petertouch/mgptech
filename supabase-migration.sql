-- ============================================
-- MGP Capital Group: Plataforma de Inversionistas
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- 0. HELPER FUNCTION (updated_at trigger)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'investor' CHECK (role IN ('super_admin', 'investor')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- 2. PROJECTS
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  location TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',
  current_phase INTEGER NOT NULL DEFAULT 1 CHECK (current_phase >= 1 AND current_phase <= 5),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  is_public BOOLEAN NOT NULL DEFAULT false,
  investment_type TEXT NOT NULL DEFAULT 'new_construction' CHECK (investment_type IN ('house_flipping', 'new_construction')),
  total_value NUMERIC(14,2) NOT NULL DEFAULT 0,
  sqft INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_is_public ON projects(is_public);

-- 3. PROJECT_INVESTORS
CREATE TABLE IF NOT EXISTS project_investors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  investor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  invested_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  investment_date DATE DEFAULT CURRENT_DATE,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, investor_id)
);
CREATE INDEX IF NOT EXISTS idx_pi_project ON project_investors(project_id);
CREATE INDEX IF NOT EXISTS idx_pi_investor ON project_investors(investor_id);

-- 4. PROJECT_PHASES
CREATE TABLE IF NOT EXISTS project_phases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  phase_number INTEGER NOT NULL CHECK (phase_number >= 1 AND phase_number <= 5),
  phase_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  report_url TEXT,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, phase_number)
);
CREATE INDEX IF NOT EXISTS idx_pp_project ON project_phases(project_id);

-- 5. PHASE_PHOTOS
CREATE TABLE IF NOT EXISTS phase_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phase_id UUID NOT NULL REFERENCES project_phases(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT DEFAULT '',
  uploaded_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_photos_phase ON phase_photos(phase_id);

-- 6. PROJECT_IMAGES (galería del proyecto)
CREATE TABLE IF NOT EXISTS project_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pimages_project ON project_images(project_id);

-- 7. PROJECT_DOCUMENTS
CREATE TABLE IF NOT EXISTS project_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  investor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  document_url TEXT NOT NULL,
  document_type TEXT NOT NULL DEFAULT 'other' CHECK (document_type IN ('contract', 'legal', 'report', 'other')),
  uploaded_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_docs_project ON project_documents(project_id);

-- 8. BLOG_POSTS
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT DEFAULT '',
  cover_image TEXT,
  meta_description TEXT DEFAULT '',
  author TEXT NOT NULL DEFAULT 'MGP Capital Group',
  published_at TIMESTAMPTZ,
  is_published BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  reading_time INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_posts(is_published);

-- 9. EMAIL_TEMPLATES
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  description TEXT DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  available_variables TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_email_templates_event ON email_templates(event_key);

-- 10. EMAIL_LOGS
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES email_templates(id) ON DELETE SET NULL,
  event_key TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  recipient_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_email_logs_event ON email_logs(event_key);
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);

-- TRIGGERS
CREATE TRIGGER profiles_updated BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER projects_updated BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER phases_updated BEFORE UPDATE ON project_phases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER blog_updated BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER email_templates_updated BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on auth user creation
CREATE OR REPLACE FUNCTION handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, role, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'investor'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_profile();

-- Auto-create 5 phases on project creation
CREATE OR REPLACE FUNCTION create_default_phases()
RETURNS TRIGGER AS $$
DECLARE
  phase_names TEXT[] := ARRAY['Adquisición', 'Diseño y Permisos', 'Construcción', 'Acabados', 'Entrega/Venta'];
  i INTEGER;
BEGIN
  FOR i IN 1..5 LOOP
    INSERT INTO project_phases (project_id, phase_number, phase_name, status)
    VALUES (NEW.id, i, phase_names[i], CASE WHEN i = 1 THEN 'in_progress' ELSE 'pending' END);
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_project_created
  AFTER INSERT ON projects
  FOR EACH ROW EXECUTE FUNCTION create_default_phases();

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_investors ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE phase_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Helper functions
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_investor_of_project(p_project_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM project_investors WHERE project_id = p_project_id AND investor_id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- PROFILES policies
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (id = auth.uid() OR is_admin());
CREATE POLICY "Admins manage profiles" ON profiles FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- PROJECTS policies
CREATE POLICY "Public projects readable" ON projects FOR SELECT USING (is_public = true);
CREATE POLICY "Investors read assigned" ON projects FOR SELECT USING (is_investor_of_project(id));
CREATE POLICY "Admins full projects" ON projects FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- PROJECT_INVESTORS policies
CREATE POLICY "Investors read own" ON project_investors FOR SELECT USING (investor_id = auth.uid());
CREATE POLICY "Admins full pi" ON project_investors FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- PROJECT_PHASES policies
CREATE POLICY "Investors read phases" ON project_phases FOR SELECT USING (is_investor_of_project(project_id));
CREATE POLICY "Public phases" ON project_phases FOR SELECT USING (EXISTS (SELECT 1 FROM projects WHERE id = project_id AND is_public = true));
CREATE POLICY "Admins full phases" ON project_phases FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- PHASE_PHOTOS policies
CREATE POLICY "Investors read photos" ON phase_photos FOR SELECT USING (EXISTS (SELECT 1 FROM project_phases pp WHERE pp.id = phase_id AND is_investor_of_project(pp.project_id)));
CREATE POLICY "Public photos" ON phase_photos FOR SELECT USING (EXISTS (SELECT 1 FROM project_phases pp JOIN projects p ON p.id = pp.project_id WHERE pp.id = phase_id AND p.is_public = true));
CREATE POLICY "Admins full photos" ON phase_photos FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- PROJECT_IMAGES policies
CREATE POLICY "Public project images" ON project_images FOR SELECT USING (EXISTS (SELECT 1 FROM projects WHERE id = project_id AND is_public = true));
CREATE POLICY "Investors read project images" ON project_images FOR SELECT USING (is_investor_of_project(project_id));
CREATE POLICY "Admins full project images" ON project_images FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- PROJECT_DOCUMENTS policies
CREATE POLICY "Investors read docs" ON project_documents FOR SELECT USING (is_investor_of_project(project_id) AND (investor_id IS NULL OR investor_id = auth.uid()));
CREATE POLICY "Admins full docs" ON project_documents FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- BLOG_POSTS policies
CREATE POLICY "Published blogs public" ON blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Admins full blog" ON blog_posts FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- EMAIL_TEMPLATES policies
CREATE POLICY "Admins manage email templates" ON email_templates FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Service read email templates" ON email_templates FOR SELECT USING (true);

-- EMAIL_LOGS policies
CREATE POLICY "Admins read email logs" ON email_logs FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Service insert email logs" ON email_logs FOR INSERT WITH CHECK (true);

-- STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public) VALUES ('project-photos', 'project-photos', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('project-documents', 'project-documents', false) ON CONFLICT DO NOTHING;

CREATE POLICY "Public read photos" ON storage.objects FOR SELECT USING (bucket_id = 'project-photos');
CREATE POLICY "Admins upload photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'project-photos' AND is_admin());
CREATE POLICY "Admins delete photos" ON storage.objects FOR DELETE USING (bucket_id = 'project-photos' AND is_admin());
CREATE POLICY "Auth read docs" ON storage.objects FOR SELECT USING (bucket_id = 'project-documents' AND auth.role() = 'authenticated');
CREATE POLICY "Admins upload docs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'project-documents' AND is_admin());
CREATE POLICY "Admins delete docs" ON storage.objects FOR DELETE USING (bucket_id = 'project-documents' AND is_admin());
