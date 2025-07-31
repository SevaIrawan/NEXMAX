-- Create Admin User for NexMax Dashboard
-- Run this in your Supabase SQL Editor after running database-setup.sql

-- First, create the admin user in auth.users (this will be done via the application)
-- Then, manually insert the admin profile into public.users

-- Insert admin user profile
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

-- Insert sample dashboard stats for admin
INSERT INTO public.dashboard_stats (user_id, stat_type, stat_value, stat_date) VALUES
('00000000-0000-0000-0000-000000000001', 'total_users', 1250, CURRENT_DATE),
('00000000-0000-0000-0000-000000000001', 'active_sessions', 89, CURRENT_DATE),
('00000000-0000-0000-0000-000000000001', 'revenue', 45000, CURRENT_DATE),
('00000000-0000-0000-0000-000000000001', 'conversion_rate', 3.2, CURRENT_DATE);

-- Insert sample user session for admin
INSERT INTO public.user_sessions (user_id, session_start, ip_address, user_agent, is_active) VALUES
('00000000-0000-0000-0000-000000000001', NOW(), '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', true);

-- Verify the admin user was created
SELECT id, username, full_name, role, is_active, created_at 
FROM public.users 
WHERE username = 'admin'; 