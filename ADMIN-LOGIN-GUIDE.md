# Panduan Login Admin NexMax Dashboard

## Langkah 1: Setup Database Supabase

### 1.1 Jalankan Script Database Setup
1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project `nexmax-dashboard`
3. Buka **SQL Editor**
4. Jalankan script `database-setup.sql` terlebih dahulu
5. Kemudian jalankan script `create-admin-user.sql`

### 1.2 Verifikasi Setup
Setelah menjalankan script, Anda akan melihat tabel:
- `public.users` - untuk menyimpan profil user (dengan username)
- `public.dashboard_stats` - untuk data dashboard
- `public.user_sessions` - untuk tracking session

## Langkah 2: Buat Admin User

### 2.1 Melalui Aplikasi (Recommended)
1. Buka `login.html` di browser
2. Klik "Daftar Akun Baru"
3. Isi form dengan data:
   - **Username**: admin
   - **Nama Lengkap**: NexMax Administrator
   - **Password**: Admin123!
4. Klik "Daftar"
5. Setelah berhasil, login dengan username yang dibuat

### 2.2 Melalui Supabase Dashboard (Alternative)
1. Buka Supabase Dashboard → Authentication → Users
2. Klik "Add User"
3. Isi data:
   - **Email**: admin@nexmax.local (dummy email untuk username-based auth)
   - **Password**: Admin123!
4. Klik "Create User"

## Langkah 3: Update Role Admin

### 3.1 Melalui SQL Editor
Jalankan query berikut di SQL Editor:

```sql
-- Update user role menjadi admin
UPDATE public.users 
SET role = 'admin', 
    full_name = 'NexMax Administrator',
    is_active = true
WHERE username = 'admin';

-- Verifikasi update
SELECT id, username, full_name, role, is_active 
FROM public.users 
WHERE username = 'admin';
```

## Langkah 4: Login dengan Admin

### 4.1 Buka Halaman Login
1. Buka file `login.html` di browser
2. Pastikan halaman login muncul dengan form username dan password

### 4.2 Login dengan Credentials Admin
Gunakan credentials berikut:
- **Username**: admin
- **Password**: Admin123!

### 4.3 Proses Login
1. Masukkan username dan password
2. Klik "Login"
3. Jika berhasil, akan redirect ke dashboard
4. Di dashboard akan muncul nama "admin" atau "NexMax Administrator"

## Langkah 5: Verifikasi Login

### 5.1 Cek Dashboard
Setelah login berhasil:
- Header akan menampilkan username admin
- Sidebar dan konten dashboard akan muncul
- Chart dan statistik akan ter-load

### 5.2 Cek Database
Di Supabase Dashboard → Table Editor → `public.users`:
- Cari user dengan username `admin`
- Pastikan `role` = 'admin'
- `last_login` akan ter-update otomatis

## Troubleshooting

### Error: "Username tidak ditemukan"
- Pastikan username sudah dibuat di database
- Cek tabel `public.users` apakah ada data user dengan username tersebut
- Pastikan script `database-setup.sql` sudah dijalankan

### Error: "Username atau password salah"
- Pastikan username dan password benar
- Cek apakah user sudah dibuat di Supabase Auth
- Pastikan format username sesuai (minimal 3 karakter)

### Error: "Username sudah digunakan"
- Pilih username lain saat registrasi
- Username harus unik di sistem

### Error: "Terlalu banyak percobaan login"
- Tunggu beberapa menit sebelum mencoba lagi
- Ini adalah fitur rate limiting dari Supabase

### Dashboard tidak muncul setelah login
- Cek console browser untuk error JavaScript
- Pastikan semua file (CSS, JS) ter-load dengan benar
- Cek koneksi internet

## Credentials Default

**Admin User:**
- Username: admin
- Password: Admin123!
- Role: admin

**Test User (opsional):**
- Username: user
- Password: User123!
- Role: user

## Keamanan

- Username minimal 3 karakter
- Password minimal 6 karakter
- Username harus unik
- Session akan expire setelah beberapa jam
- Logout akan clear semua session data

## Sistem Username-Based Authentication

Sistem ini menggunakan username untuk login, bukan email:
- Username disimpan di tabel `public.users`
- Email dummy digunakan untuk Supabase Auth (format: username@nexmax.local)
- Login dilakukan dengan mencari username di database terlebih dahulu
- Kemudian autentikasi dilakukan dengan email dummy

## Next Steps

Setelah berhasil login sebagai admin:
1. Explore dashboard features
2. Test chart interactions
3. Coba fitur logout
4. Test responsive design di mobile
5. Coba dark/light mode toggle 