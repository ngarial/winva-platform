-- ============================================
-- WINVA Platform — Dataroom Storage + Deal Access
-- ============================================

-- 1. Créer le bucket Storage "dataroom" (privé)
INSERT INTO storage.buckets (id, name, public)
VALUES ('dataroom', 'dataroom', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Politiques Storage — Upload (admin uniquement)
CREATE POLICY "Admins can upload dataroom files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'dataroom'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 3. Politiques Storage — Download (NDA signé ou admin)
CREATE POLICY "NDA investors can download dataroom files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'dataroom'
    AND (
      EXISTS (
        SELECT 1 FROM nda_acceptances
        WHERE nda_acceptances.investor_id = auth.uid()
          AND nda_acceptances.deal_id::text = (storage.foldername(name))[1]
      )
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    )
  );

-- 4. Politiques Storage — Delete (admin uniquement)
CREATE POLICY "Admins can delete dataroom files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'dataroom'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 5. Table deal_access (accès sélectif — UI au Module 5)
-- ============================================
CREATE TABLE deal_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  investor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  granted_by UUID REFERENCES profiles(id),
  UNIQUE(deal_id, investor_id)
);

ALTER TABLE deal_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Investors see own access"
  ON deal_access FOR SELECT USING (investor_id = auth.uid());
CREATE POLICY "Admins manage deal access"
  ON deal_access FOR ALL USING (is_admin());

-- ============================================
-- 6. Ajouter visibility aux deals
-- ============================================
CREATE TYPE deal_visibility AS ENUM ('public', 'private');
ALTER TABLE deals ADD COLUMN visibility deal_visibility NOT NULL DEFAULT 'public';

-- 7. Mettre à jour la politique RLS des deals pour supporter la visibilité
DROP POLICY IF EXISTS "Investors see active deals" ON deals;
CREATE POLICY "Investors see accessible deals"
  ON deals FOR SELECT USING (
    is_admin()
    OR (
      status = 'active'
      AND (
        visibility = 'public'
        OR EXISTS (
          SELECT 1 FROM deal_access
          WHERE deal_access.deal_id = deals.id
            AND deal_access.investor_id = auth.uid()
        )
      )
    )
  );
