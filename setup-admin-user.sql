-- Setup Admin User for NexMax Dashboard
-- Run this in your Supabase SQL Editor

-- Step 1: Create admin user in auth.users (if not exists)
-- Note: This needs to be done manually in Supabase Dashboard first
-- Go to Authentication > Users > Add User
-- Email: admin@nexmax.local
-- Password: Admin123!

-- Step 2: Insert admin profile into public.users
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

-- Step 3: Insert sample dashboard stats for admin
INSERT INTO public.dashboard_stats (user_id, stat_type, stat_value, stat_date) VALUES
('00000000-0000-0000-0000-000000000001', 'total_users', 1250, CURRENT_DATE),
('00000000-0000-0000-0000-000000000001', 'active_sessions', 89, CURRENT_DATE),
('00000000-0000-0000-0000-000000000001', 'revenue', 45000, CURRENT_DATE),
('00000000-0000-0000-0000-000000000001', 'conversion_rate', 3.2, CURRENT_DATE)
ON CONFLICT DO NOTHING;

-- Step 4: Insert sample user session for admin
INSERT INTO public.user_sessions (user_id, session_start, ip_address, user_agent, is_active) VALUES
('00000000-0000-0000-0000-000000000001', NOW(), '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', true)
ON CONFLICT DO NOTHING;

-- Step 5: Verify the admin user was created
SELECT id, username, full_name, role, is_active, created_at 
FROM public.users 
WHERE username = 'admin';

-- Step 6: Check if user exists in auth.users (this will show empty if not created yet)
-- You need to manually create this user in Supabase Dashboard first
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'admin@nexmax.local'; 