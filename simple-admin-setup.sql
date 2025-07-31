-- Simple Admin Setup for NexMax Dashboard
-- Run this in Supabase SQL Editor

-- 1. Create admin user in auth.users (if not exists)
-- Note: You need to manually create this user in Supabase Dashboard first:
-- Go to Authentication > Users > Add User
-- Email: admin@nexmax.local
-- Password: Admin123!

-- 2. Insert admin profile into public.users
INSERT INTO public.users (id, username, full_name, role, is_active, created_at) 
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'admin',
    'NexMax Administrator',
    'admin',
    true,
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- 3. Verify admin user exists
SELECT 'Admin user created successfully!' as status, username, full_name, role 
FROM public.users 
WHERE username = 'admin';

-- 4. Check if user exists in auth.users (this will be empty if not created yet)
SELECT 'Auth user check:' as status, email, created_at 
FROM auth.users 
WHERE email = 'admin@nexmax.local'; 