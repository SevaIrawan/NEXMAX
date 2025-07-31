-- Disable RLS for Testing
-- Run this in Supabase SQL Editor to allow anonymous access

-- 1. Disable Row Level Security on users table
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 2. Grant permissions to anon and authenticated users
GRANT ALL ON public.users TO anon, authenticated;

-- 3. Verify admin user exists
SELECT 'Admin user check:' as status, id, username, role 
FROM public.users 
WHERE username = 'admin';

-- 4. Test anonymous access
SELECT 'Anonymous access test:' as status, COUNT(*) as total_users 
FROM public.users; 