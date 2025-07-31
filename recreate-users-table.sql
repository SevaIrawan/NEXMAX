-- Hapus tabel users yang lama (jika ada)
DROP TABLE IF EXISTS public.users CASCADE;

-- Buat tabel users yang baru
CREATE TABLE public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert admin user
INSERT INTO public.users (username, password, role) 
VALUES ('admin', 'Admin123!', 'admin');

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Buat policy yang lebih permisif untuk development
CREATE POLICY "Allow all operations for development" ON public.users
    FOR ALL USING (true) WITH CHECK (true);

-- Buat function untuk update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Buat trigger untuk update timestamp
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Verifikasi setup
SELECT * FROM public.users; 