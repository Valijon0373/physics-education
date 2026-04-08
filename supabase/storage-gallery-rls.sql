

-- Mavjud siyosatlarni takrorlab yaratmaslik uchun 
DROP POLICY IF EXISTS "gallery_public_read" ON storage.objects;
DROP POLICY IF EXISTS "gallery_anon_insert_paths" ON storage.objects;
DROP POLICY IF EXISTS "gallery_anon_update_paths" ON storage.objects;
DROP POLICY IF EXISTS "gallery_anon_delete_paths" ON storage.objects;

-- Ro‘yxat va public URL / yuklangan faylni o‘qish
CREATE POLICY "gallery_public_read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'gallery');

-- Yuklash: admin galereya, topshiriq rasmlari va mashqlar PDF papkalari
CREATE POLICY "gallery_anon_insert_paths"
ON storage.objects FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'gallery'
  AND (
    name LIKE 'admin-gallery/%'
    OR name LIKE 'tasks/%'
    OR name LIKE 'lessons/%'
  )
);

-- upsert: true bo‘lsa yoki metadata yangilansa kerak bo‘lishi mumkin
CREATE POLICY "gallery_anon_update_paths"
ON storage.objects FOR UPDATE
TO public
USING (
  bucket_id = 'gallery'
  AND (
    name LIKE 'admin-gallery/%'
    OR name LIKE 'tasks/%'
    OR name LIKE 'lessons/%'
  )
)
WITH CHECK (
  bucket_id = 'gallery'
  AND (
    name LIKE 'admin-gallery/%'
    OR name LIKE 'tasks/%'
    OR name LIKE 'lessons/%'
  )
);

-- Admin paneldan o‘chirish
CREATE POLICY "gallery_anon_delete_paths"
ON storage.objects FOR DELETE
TO public
USING (
  bucket_id = 'gallery'
  AND (
    name LIKE 'admin-gallery/%'
    OR name LIKE 'tasks/%'
    OR name LIKE 'lessons/%'
  )
);
