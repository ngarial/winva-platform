-- ============================================
-- WINVA Platform — Access Requests, Invitations, KYC
-- ============================================

-- 1. Investor type enum
CREATE TYPE investor_type AS ENUM ('pe-vc', 'family-office', 'business-angel', 'diaspora', 'impact', 'institutionnel', 'autre');

-- 2. KYC document type enum
CREATE TYPE kyc_doc_type AS ENUM ('cni', 'passeport', 'rccm', 'statuts', 'autre');

-- 3. Access Requests table
CREATE TABLE access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  country TEXT DEFAULT 'Côte d''Ivoire',
  investor_type investor_type,
  sectors_of_interest TEXT[],
  ticket_min TEXT,
  preferred_deal_type TEXT,
  referral_source TEXT,
  status profile_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage access requests" ON access_requests FOR ALL USING (is_admin());
-- Allow anonymous inserts (public form)
CREATE POLICY "Anyone can submit access request" ON access_requests FOR INSERT WITH CHECK (true);

-- 4. Invitations table
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  access_request_id UUID REFERENCES access_requests(id) ON DELETE SET NULL,
  created_by UUID REFERENCES profiles(id),
  used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage invitations" ON invitations FOR ALL USING (is_admin());
-- Allow anonymous read for token verification during signup
CREATE POLICY "Anyone can verify invitation token" ON invitations FOR SELECT USING (true);

-- 5. KYC Documents table
CREATE TABLE kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
  document_type kyc_doc_type NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Investors see own KYC" ON kyc_documents FOR SELECT USING (investor_id = auth.uid());
CREATE POLICY "Investors can upload KYC" ON kyc_documents FOR INSERT WITH CHECK (investor_id = auth.uid());
CREATE POLICY "Admins manage KYC" ON kyc_documents FOR ALL USING (is_admin());

-- 6. KYC Storage bucket (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('kyc', 'kyc', false)
ON CONFLICT (id) DO NOTHING;

-- KYC storage policies
CREATE POLICY "Investors upload own KYC files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'kyc' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Admins read KYC files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'kyc' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Investors read own KYC files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'kyc' AND (storage.foldername(name))[1] = auth.uid()::text);

-- 7. Enrichir profiles avec les champs investisseur
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS investor_type investor_type,
  ADD COLUMN IF NOT EXISTS sectors_of_interest TEXT[],
  ADD COLUMN IF NOT EXISTS ticket_min TEXT,
  ADD COLUMN IF NOT EXISTS preferred_deal_type TEXT,
  ADD COLUMN IF NOT EXISTS referral_source TEXT;
