-- Debug: Cek struktur tabel users yang ada
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Debug: Cek semua data di tabel users
SELECT * FROM public.users LIMIT 5;

-- Debug: Cek apakah ada user dengan username 'admin'
SELECT * FROM public.users WHERE username = 'admin';

-- Debug: Cek jumlah total users
SELECT COUNT(*) as total_users FROM public.users;

-- Debug: Cek apakah ada constraint unique pada username
SELECT 
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'users' 
    AND tc.table_schema = 'public'
    AND tc.constraint_type = 'UNIQUE'; 