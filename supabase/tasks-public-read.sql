
-- Xavfsizlik: ochiq INSERT/DELETE har kim tomonidan ishlatilishi mumkin; 

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tasks_select_public" ON tasks;
DROP POLICY IF EXISTS "tasks_insert_public" ON tasks;
DROP POLICY IF EXISTS "tasks_update_public" ON tasks;
DROP POLICY IF EXISTS "tasks_delete_public" ON tasks;

CREATE POLICY "tasks_select_public"
ON tasks FOR SELECT
TO public
USING (true);

-- Admin Dashboard brauzerdan yangi topshiriq qo‘shish
CREATE POLICY "tasks_insert_public"
ON tasks FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "tasks_update_public"
ON tasks FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "tasks_delete_public"
ON tasks FOR DELETE
TO public
USING (true);
