-- Admin Setup for NexMax Dashboard
-- Copy and paste this entire script into Supabase SQL Editor

-- Insert admin profile into public.users
INSERT INTO public.users (id, username, full_name, role, is_active, created_at) 
VALUES (
    'ad97de5f-5cfb-485d-860b-770c3cf1703b',
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
('ad97de5f-5cfb-485d-860b-770c3cf1703b', 'total_users', 1250, CURRENT_DATE),
('ad97de5f-5cfb-485d-860b-770c3cf1703b', 'active_sessions', 89, CURRENT_DATE),
('ad97de5f-5cfb-485d-860b-770c3cf1703b', 'revenue', 45000, CURRENT_DATE),
('ad97de5f-5cfb-485d-860b-770c3cf1703b', 'conversion_rate', 3.2, CURRENT_DATE)
ON CONFLICT DO NOTHING;

-- Insert sample user session for admin
INSERT INTO public.user_sessions (user_id, session_start, ip_address, user_agent, is_active) VALUES
('ad97de5f-5cfb-485d-860b-770c3cf1703b', NOW(), '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', true)
ON CONFLICT DO NOTHING;

-- Verify the admin user was created
SELECT 'Admin user created successfully!' as status, username, full_name, role, is_active 
FROM public.users 
WHERE username = 'admin'; 