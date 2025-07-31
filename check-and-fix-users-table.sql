-- Cek struktur tabel users yang sudah ada
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Cek apakah user admin sudah ada
SELECT * FROM public.users WHERE username = 'admin';

-- Jika user admin belum ada, tambahkan
INSERT INTO public.users (username, password, role) 
VALUES ('admin', 'Admin123!', 'admin')
ON CONFLICT (username) DO UPDATE SET
    password = EXCLUDED.password,
    role = EXCLUDED.role;

-- Disable RLS sementara untuk testing
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Atau jika ingin tetap enable RLS, buat policy yang lebih permisif
-- DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
-- CREATE POLICY "Allow all operations" ON public.users FOR ALL USING (true) WITH CHECK (true);

-- Test query untuk memastikan bisa akses
SELECT COUNT(*) as total_users FROM public.users;
SELECT * FROM public.users WHERE username = 'admin'; 