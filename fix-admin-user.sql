-- Fix Admin User for Existing Users Table
-- Copy and paste this entire script into Supabase SQL Editor

-- Update existing admin user or insert if not exists
INSERT INTO public.users (id, username, password, role) 
VALUES (
    1,
    'admin',
    '$2a$10$Eb6hf6aygHMxQRi2AcYkzOyRql', -- hashed password for 'Admin123!'
    'admin'
) ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    password = EXCLUDED.password,
    role = EXCLUDED.role;

-- Verify the admin user was created/updated
SELECT 'Admin user updated successfully!' as status, id, username, role 
FROM public.users 
WHERE username = 'admin'; 