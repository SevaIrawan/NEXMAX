# Troubleshooting Password Login NexMax Dashboard

## 🔍 **Masalah Password Salah**

### **Password yang Benar:**
- **Username:** `admin`
- **Password:** `Admin123!` (bukan "admin123!")

**Perhatikan:**
- Huruf A kapital di awal
- Tanda seru (!) di akhir
- Total 9 karakter

## 🛠️ **Langkah Perbaikan**

### **Langkah 1: Buat Admin User di Supabase Dashboard**

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project `nexmax-dashboard`
3. Buka **Authentication** → **Users**
4. Klik **"Add User"**
5. Isi data:
   - **Email:** `admin@nexmax.local`
   - **Password:** `Admin123!`
6. Klik **"Create User"**

### **Langkah 2: Jalankan Script Database**

1. Buka **SQL Editor** di Supabase
2. Jalankan script `database-setup.sql` terlebih dahulu
3. Kemudian jalankan script `setup-admin-user.sql`

### **Langkah 3: Verifikasi Setup**

Jalankan query ini di SQL Editor untuk memastikan admin user sudah dibuat:

```sql
-- Cek admin user di public.users
SELECT id, username, full_name, role, is_active 
FROM public.users 
WHERE username = 'admin';

-- Cek admin user di auth.users
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'admin@nexmax.local';
```

### **Langkah 4: Test Login**

1. Buka `login.html` di browser
2. Masukkan:
   - **Username:** `admin`
   - **Password:** `Admin123!`
3. Klik **Login**

## 🔧 **Alternatif: Registrasi Manual**

Jika masih bermasalah, coba registrasi manual:

1. Buka `login.html`
2. Klik **"Daftar Akun Baru"**
3. Isi form:
   - **Username:** `admin`
   - **Nama Lengkap:** `NexMax Administrator`
   - **Password:** `Admin123!`
   - **Konfirmasi Password:** `Admin123!`
4. Klik **"Daftar"**
5. Setelah berhasil, login dengan username `admin`

## 🚨 **Error yang Mungkin Muncul**

### **"Username tidak ditemukan"**
- Pastikan admin user sudah dibuat di `public.users`
- Jalankan script `setup-admin-user.sql`

### **"Username atau password salah"**
- Pastikan password: `Admin123!` (bukan "admin123!")
- Pastikan user sudah dibuat di `auth.users`
- Cek apakah email `admin@nexmax.local` sudah ada di Supabase Auth

### **"Username sudah digunakan"**
- Pilih username lain, misalnya `admin2`
- Atau hapus user lama terlebih dahulu

## 📋 **Checklist Setup**

- [ ] Database setup (`database-setup.sql`) sudah dijalankan
- [ ] Admin user dibuat di Supabase Auth (`admin@nexmax.local`)
- [ ] Admin profile dibuat di `public.users` (`setup-admin-user.sql`)
- [ ] Password yang benar: `Admin123!`
- [ ] Login dengan username: `admin`

## 🔐 **Credentials Default**

**Admin User:**
- Username: `admin`
- Password: `Admin123!`
- Email (internal): `admin@nexmax.local`

**Test User (opsional):**
- Username: `user`
- Password: `User123!`
- Email (internal): `user@nexmax.local`

## 💡 **Tips**

1. **Copy-paste password** untuk menghindari typo
2. **Perhatikan case sensitivity** - `Admin123!` bukan `admin123!`
3. **Pastikan tidak ada spasi** di awal atau akhir username/password
4. **Cek console browser** (F12) untuk error JavaScript
5. **Refresh halaman** jika masih bermasalah

## 🆘 **Jika Masih Bermasalah**

1. **Clear browser cache** dan cookies
2. **Coba browser lain** (Chrome, Firefox, Edge)
3. **Cek koneksi internet**
4. **Restart aplikasi** dan coba lagi
5. **Hubungi support** jika masalah berlanjut 