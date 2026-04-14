-- ============================================
-- WINVA Platform — Initial Schema
-- ============================================

-- Enums
CREATE TYPE user_role AS ENUM ('admin', 'investor', 'sme');
CREATE TYPE profile_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE deal_status AS ENUM ('draft', 'active', 'closed');
CREATE TYPE deal_type AS ENUM ('equity', 'mezzanine', 'debt');
CREATE TYPE eoi_status AS ENUM ('pending', 'reviewed', 'accepted', 'rejected');
CREATE TYPE application_status AS ENUM ('pending', 'reviewed', 'accepted', 'rejected');

-- ============================================
-- PROFILES (extends auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'investor',
  full_name TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  country TEXT DEFAULT 'Côte d''Ivoire',
  status profile_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'investor'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- DEALS
-- ============================================
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  sector TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Côte d''Ivoire',
  revenue_range TEXT,
  ticket_size TEXT,
  deal_type deal_type NOT NULL DEFAULT 'equity',
  stage TEXT,
  description TEXT NOT NULL,
  status deal_status NOT NULL DEFAULT 'draft',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- NDA ACCEPTANCES
-- ============================================
CREATE TABLE nda_acceptances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address INET,
  UNIQUE(investor_id, deal_id)
);

-- ============================================
-- EXPRESSIONS OF INTEREST
-- ============================================
CREATE TABLE expressions_of_interest (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  message TEXT,
  status eoi_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- SME APPLICATIONS
-- ============================================
CREATE TABLE sme_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  company_name TEXT NOT NULL,
  sector TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Côte d''Ivoire',
  revenue TEXT,
  funding_need TEXT,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  description TEXT NOT NULL,
  status application_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER sme_applications_updated_at
  BEFORE UPDATE ON sme_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- DATAROOM FILES
-- ============================================
CREATE TABLE dataroom_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE nda_acceptances ENABLE ROW LEVEL SECURITY;
ALTER TABLE expressions_of_interest ENABLE ROW LEVEL SECURITY;
ALTER TABLE sme_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE dataroom_files ENABLE ROW LEVEL SECURITY;

-- Helper: check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- PROFILES
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE USING (is_admin());

-- DEALS
CREATE POLICY "Investors see active deals"
  ON deals FOR SELECT USING (status = 'active' OR is_admin());
CREATE POLICY "Admins manage deals"
  ON deals FOR ALL USING (is_admin());

-- NDA ACCEPTANCES
CREATE POLICY "Investors see own NDAs"
  ON nda_acceptances FOR SELECT USING (investor_id = auth.uid());
CREATE POLICY "Investors can accept NDA"
  ON nda_acceptances FOR INSERT WITH CHECK (investor_id = auth.uid());
CREATE POLICY "Admins see all NDAs"
  ON nda_acceptances FOR SELECT USING (is_admin());

-- EXPRESSIONS OF INTEREST
CREATE POLICY "Investors see own EOIs"
  ON expressions_of_interest FOR SELECT USING (investor_id = auth.uid());
CREATE POLICY "Investors can create EOI"
  ON expressions_of_interest FOR INSERT WITH CHECK (investor_id = auth.uid());
CREATE POLICY "Admins manage EOIs"
  ON expressions_of_interest FOR ALL USING (is_admin());

-- SME APPLICATIONS
CREATE POLICY "Users see own applications"
  ON sme_applications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create applications"
  ON sme_applications FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "Admins manage applications"
  ON sme_applications FOR ALL USING (is_admin());

-- DATAROOM FILES
CREATE POLICY "Investors with NDA see dataroom"
  ON dataroom_files FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM nda_acceptances
      WHERE nda_acceptances.deal_id = dataroom_files.deal_id
        AND nda_acceptances.investor_id = auth.uid()
    )
    OR is_admin()
  );
CREATE POLICY "Admins manage dataroom"
  ON dataroom_files FOR ALL USING (is_admin());
