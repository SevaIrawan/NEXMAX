-- Test Database Connection and Users Table
-- Run this in Supabase SQL Editor to verify everything is working

-- 1. Check if users table exists and is accessible
SELECT 'Users table check:' as status, COUNT(*) as total_users 
FROM public.users;

-- 2. Check all users in the table
SELECT 'All users:' as status, id, username, role 
FROM public.users 
ORDER BY id;

-- 3. Check specifically for admin user
SELECT 'Admin user check:' as status, id, username, role 
FROM public.users 
WHERE username = 'admin';

-- 4. Test RLS policies
SELECT 'RLS status:' as status, schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users' AND schemaname = 'public'; 