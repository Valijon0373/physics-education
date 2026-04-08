-- guides PDF fayllari uchun storage policy (gallery bucket)

DROP POLICY IF EXISTS "gallery_guides_insert" ON storage.objects;
DROP POLICY IF EXISTS "gallery_guides_update" ON storage.objects;
DROP POLICY IF EXISTS "gallery_guides_delete" ON storage.objects;
DROP POLICY IF EXISTS "gallery_guides_select" ON storage.objects;

CREATE POLICY "gallery_guides_select"
ON storage.objects FOR SELECT
TO public
USING (
  bucket_id = 'gallery'
  AND name LIKE 'guides/%'
);

CREATE POLICY "gallery_guides_insert"
ON storage.objects FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'gallery'
  AND name LIKE 'guides/%'
);

CREATE POLICY "gallery_guides_update"
ON storage.objects FOR UPDATE
TO public
USING (
  bucket_id = 'gallery'
  AND name LIKE 'guides/%'
)
WITH CHECK (
  bucket_id = 'gallery'
  AND name LIKE 'guides/%'
);

CREATE POLICY "gallery_guides_delete"
ON storage.objects FOR DELETE
TO public
USING (
  bucket_id = 'gallery'
  AND name LIKE 'guides/%'
);
