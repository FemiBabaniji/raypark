-- Setup Supabase Storage buckets and policies for media management

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('portfolio-media', 'portfolio-media', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']),
    ('portfolio-drafts', 'portfolio-drafts', false, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage policies for portfolio-media bucket (public read, owner write)
DROP POLICY IF EXISTS "public read media" ON storage.objects;
CREATE POLICY "public read media"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-media');

DROP POLICY IF EXISTS "owner write media" ON storage.objects;
CREATE POLICY "owner write media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'portfolio-media' 
    AND (storage.foldername(name))[1] = 'user' 
    AND (storage.foldername(name))[2] = auth.uid()::text
);

DROP POLICY IF EXISTS "owner manage own media" ON storage.objects;
CREATE POLICY "owner manage own media"
ON storage.objects FOR ALL
TO authenticated
USING (
    bucket_id = 'portfolio-media'
    AND (storage.foldername(name))[1] = 'user' 
    AND (storage.foldername(name))[2] = auth.uid()::text
)
WITH CHECK (
    bucket_id = 'portfolio-media'
    AND (storage.foldername(name))[1] = 'user' 
    AND (storage.foldername(name))[2] = auth.uid()::text
);

-- Storage policies for portfolio-drafts bucket (private, owner only)
DROP POLICY IF EXISTS "owner read drafts" ON storage.objects;
CREATE POLICY "owner read drafts"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'portfolio-drafts'
    AND (storage.foldername(name))[1] = 'user' 
    AND (storage.foldername(name))[2] = auth.uid()::text
);

DROP POLICY IF EXISTS "owner write drafts" ON storage.objects;
CREATE POLICY "owner write drafts"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'portfolio-drafts'
    AND (storage.foldername(name))[1] = 'user' 
    AND (storage.foldername(name))[2] = auth.uid()::text
);

DROP POLICY IF EXISTS "owner manage drafts" ON storage.objects;
CREATE POLICY "owner manage drafts"
ON storage.objects FOR ALL
TO authenticated
USING (
    bucket_id = 'portfolio-drafts'
    AND (storage.foldername(name))[1] = 'user' 
    AND (storage.foldername(name))[2] = auth.uid()::text
)
WITH CHECK (
    bucket_id = 'portfolio-drafts'
    AND (storage.foldername(name))[1] = 'user' 
    AND (storage.foldername(name))[2] = auth.uid()::text
);
