# ShortLink - URL Shortening Application

ShortLink adalah aplikasi web modern untuk mempersingkat URL yang panjang menjadi tautan pendek yang mudah dibagikan. Aplikasi ini dilengkapi dengan fitur autentikasi, manajemen tautan, dan analitik untuk melacak performa tautan yang diperpendek.

## 📋 Daftar Isi

- [Gambaran Umum](#gambaran-umum)
- [Fitur Utama](#fitur-utama)
- [Arsitektur Sistem](#arsitektur-sistem)
- [Backend](#backend)
- [Frontend](#frontend)
- [Instalasi](#instalasi)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [API Documentation](#api-documentation)
- [Struktur Database](#struktur-database)
- [Deployment](#deployment)

## 🎯 Gambaran Umum

ShortLink menyediakan solusi lengkap untuk:
- **Mempersingkat URL** dengan kode unik yang mudah diingat
- **Autentikasi pengguna** dengan sistem login dan registrasi
- **Manajemen tautan** - membuat, melihat, dan menghapus tautan yang diperpendek
- **Tautan publik** - membuat tautan pendek tanpa memerlukan autentikasi
- **Analitik dasar** - melacak informasi tautan yang telah dibuat

## ✨ Fitur Utama

### Untuk Pengguna Authenticated
- ✅ Registrasi dan login akun
- ✅ Membuat tautan pendek dari URL panjang
- ✅ Melihat daftar semua tautan yang telah dibuat
- ✅ Menghapus tautan yang tidak lagi diperlukan
- ✅ Melihat profil pengguna
- ✅ Dashboard dengan statistik tautan
- ✅ Analytics untuk melacak performa tautan

### Untuk Pengguna Guest (Publik)
- ✅ Membuat tautan pendek tanpa perlu login
- ✅ Mengakses tautan pendek yang telah dibuat

### Fitur Teknis
- ✅ Dokumentasi API dengan Swagger/Swaggo
- ✅ Autentikasi dengan JWT token
- ✅ Database terstruktur dengan constraints yang tepat
- ✅ UI responsif dengan Tailwind CSS
- ✅ Paginasi dan pencarian tautan
- ✅ Error handling yang komprehensif

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────────┐
│                          Frontend (React JS)                     │
│                       Port: 21041 (Production)                   │
│                                                                   │
│  ├─ Dashboard (List & manage links)                             │
│  ├─ Create Link Page                                             │
│  ├─ Analytics Page                                               │
│  ├─ Profile Page                                                 │
│  ├─ Authentication (Login & Register)                            │
│  └─ Styling: Tailwind CSS                                        │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP Requests
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (Go with Gin)                         │
│                 Port: 21040 (Production)                         │
│                                                                   │
│  API Endpoints:                                                  │
│  ├─ POST   /api/register        → User registration             │
│  ├─ POST   /api/login           → User login                    │
│  ├─ POST   /api/links           → Create shortened link         │
│  ├─ GET    /api/links           → Get user's links              │
│  ├─ DELETE /api/links/:id       → Delete a link                 │
│  ├─ GET    /:short_code         → Redirect to original URL      │
│  ├─ POST   /public/generate     → Create guest link             │
│  └─ GET    /swagger/index.html  → API Documentation             │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Database Queries
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                            │
│                  Port: 5432 (Docker Network)                     │
│                                                                   │
│  Tables:                                                         │
│  ├─ users (id, email, password, created_at)                     │
│  ├─ links (id, user_id, original_url, short_code, created_at)  │
│  └─ Indexes: user_id, short_code                                │
└─────────────────────────────────────────────────────────────────┘
```

## 🔧 Backend

### Stack Teknologi
- **Bahasa**: Go
- **Framework**: Gin (HTTP Web Framework)
- **Database**: PostgreSQL
- **Documentation**: Swaggo (Swagger for Go)
- **Authentication**: JWT (JSON Web Tokens)

### Endpoints API

| Method | Endpoint | Deskripsi | Auth Required |
|--------|----------|-----------|---------------|
| POST | `/api/register` | Registrasi pengguna baru | ❌ |
| POST | `/api/login` | Login pengguna | ❌ |
| POST | `/api/links` | Buat tautan pendek baru | ✅ |
| GET | `/api/links` | Dapatkan daftar tautan pengguna | ✅ |
| DELETE | `/api/links/:id` | Hapus tautan berdasarkan ID | ✅ |
| GET | `/:short_code` | Redirect ke URL asli | ❌ |
| POST | `/public/generate` | Buat tautan publik (guest) | ❌ |

### Dokumentasi API Swagger

Setelah backend berjalan, akses dokumentasi interaktif di:
```
http://68.183.226.223:21040/swagger/index.html
```

### Request/Response Examples

**Register User**
```json
POST /api/register
{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**Login**
```json
POST /api/login
{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**Create Shortened Link**
```json
POST /api/links
Headers: Authorization: Bearer {token}
{
  "original_url": "https://example.com/very/long/url/that/needs/shortening"
}

Response:
{
  "success": true,
  "link": {
    "id": 1,
    "user_id": 1,
    "original_url": "https://example.com/very/long/url",
    "short_code": "abc123",
    "created_at": "2026-04-08T09:42:34Z"
  }
}
```

**Create Guest Link (Public)**
```json
POST /public/generate
{
  "original_url": "https://example.com/very/long/url"
}

Response:
{
  "success": true,
  "link": {
    "id": 2,
    "user_id": null,
    "original_url": "https://example.com/very/long/url",
    "short_code": "xyz789",
    "created_at": "2026-04-08T09:42:34Z"
  }
}
```

## 💻 Frontend

### Stack Teknologi
- **Framework**: React JS
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Icons**: Lucide React
- **Build Tool**: Vite

### Halaman dan Fitur

| Halaman | Deskripsi | Status |
|---------|-----------|--------|
| **Dashboard** | Tampilkan daftar tautan dengan pencarian dan paginasi | ✅ |
| **Create Link** | Form untuk membuat tautan pendek baru | ✅ |
| **Analytics** | Analitik performa tautan (dalam pengembangan) | 🔄 |
| **Profile** | Kelola profil pengguna | ✅ |
| **Landing Page** | Halaman utama dengan demo guest link | ✅ |
| **Authentication** | Login dan registrasi | ✅ |

### Fitur Dashboard
- 📊 Tampilkan total tautan aktif
- 🔍 Pencarian tautan berdasarkan short_code atau URL asli
- 📄 Paginasi dengan navigasi prev/next
- 📋 Copy tautan ke clipboard
- 🗑️ Hapus tautan yang tidak perlu / todo
- 📅 Tampilkan tanggal pembuatan tautan

### Konfigurasi Environment Frontend

File `.env`:
```
VITE_API_URL=http://68.183.226.223:21040 // berjalan di development lokal, gunakan localhost:{port}
```

**Catatan Penting**: Vite mengubah variabel environment saat build time, bukan runtime. Oleh karena itu, saat build untuk production, pastikan menyertakan `--build-arg`:

```bash
docker build --build-arg VITE_API_URL=http://68.183.226.223:21040 \
  -t ghcr.io/makarim22/shorten-your-link/shortlink-frontend:latest .
```

## 📦 Instalasi

### Prerequisites
- Docker dan Docker Compose
- Git

### Clone Repository
```bash
git clone https://github.com/makarim22/shorten-your-link.git
cd shorten-your-link
```

## ⚙️ Konfigurasi Environment

### Backend Environment (`.env`)
```
DB_HOST=pg-db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=postgres

JWT_SECRET=your_secret_key_here
BASE_URL=http://68.183.226.223:21040
```

### Frontend Environment (`.env`)
```
VITE_API_URL=http://68.183.226.223:21040
```

## 🚀 Menjalankan Aplikasi

### Development Mode (Local)

1. **Buat file `.env` di backend directory**
```bash
cd backend
cat > .env << EOF
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=postgres
JWT_SECRET=development_secret
BASE_URL=http://localhost:9002
EOF
```

2. **Jalankan Docker Compose**
```bash
docker compose up -d
```

3. **Verifikasi status container**
```bash
docker compose ps
docker compose logs backend
```

4. **Akses aplikasi**
- Frontend: http://localhost:3000
- Backend API: http://localhost:9002
- Swagger Docs: http://localhost:9002/swagger/index.html

### Production Mode

1. **Build dan push images ke registry**
```bash
# Build backend
docker build -t ghcr.io/makarim22/shorten-your-link/shortlink-backend:latest ./backend
docker push ghcr.io/makarim22/shorten-your-link/shortlink-backend:latest

# Build frontend dengan env var
docker build --build-arg VITE_API_URL=http://68.183.226.223:21040 \
  -t ghcr.io/makarim22/shorten-your-link/shortlink-frontend:latest ./frontend
docker push ghcr.io/makarim22/shorten-your-link/shortlink-frontend:latest
```

2. **Deploy di server**
```bash
# Pull latest images
docker pull ghcr.io/makarim22/shorten-your-link/shortlink-backend:latest
docker pull ghcr.io/makarim22/shorten-your-link/shortlink-frontend:latest

# Restart containers
docker compose down
docker compose up -d
```

3. **Akses aplikasi production**
- Frontend: http://68.183.226.223:21041
- Backend API: http://68.183.226.223:21040
- Swagger Docs: http://68.183.226.223:21040/swagger/index.html

## 📊 Struktur Database

### Table: users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table: links
```sql
CREATE TABLE links (
  id SERIAL PRIMARY KEY,
  user_id INT,
  original_url TEXT NOT NULL,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_links_user_id ON links(user_id);
CREATE INDEX idx_links_short_code ON links(short_code);
```

**Catatan**: `user_id` bersifat nullable untuk mendukung guest/public links.
### TODO
menambahkan tabel transaksi dan tabel profile user

### Migrasi Database

Jika ada perubahan schema, jalankan migration:
```sql
ALTER TABLE links
    ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE links
    DROP CONSTRAINT links_user_id_fkey;

ALTER TABLE links
    ADD CONSTRAINT links_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
```

## 🌐 Deployment

### Docker Network Configuration

**Local Development**:
- Network: default docker compose network
- Frontend-Backend komunikasi: internal docker network
- Port Frontend: 3000
- Port Backend: 9002

**Production (Server)**:
- Networks: `pman_web` (frontend/backend) dan `webapps` (backend/database)
- Port Frontend: 21041
- Port Backend: 21040
- Database: internal docker network

### SSL/TLS (Recommended for Production)
Untuk production, gunakan reverse proxy dengan SSL:
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:21041;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api {
        proxy_pass http://localhost:21040;
        proxy_set_header Host $host;
        proxy_set_header Authorization $http_authorization;
    }
}
```

## 🧪 Testing

### Test Autentikasi
```bash
# Register
curl -X POST http://localhost:9002/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:9002/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test Create Link
```bash
curl -X POST http://localhost:9002/api/links \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"original_url":"https://example.com/very/long/url"}'
```

### Test Guest Link
```bash
curl -X POST http://localhost:9002/public/generate \
  -H "Content-Type: application/json" \
  -d '{"original_url":"https://example.com/very/long/url"}'
```

## 📝 Troubleshooting

### Backend tidak terkoneksi ke database
```bash
# Cek status container
docker compose ps

# Lihat logs backend
docker compose logs backend

# Restart container
docker compose restart backend
```

### Frontend mengarah ke localhost di production
Pastikan rebuild frontend dengan build arg yang tepat:
```bash
docker build --build-arg VITE_API_URL=http://68.183.226.223:21040 \
  -t your-registry/frontend:latest .
```

### Port sudah digunakan
Ubah port di `docker-compose.yml`:
```yaml
services:
  frontend:
    ports:
      - "8001:3000"  # Change 8001 to desired port
```

## 📚 Resources

- [Gin Documentation](https://gin-gonic.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Swaggo for Go](https://github.com/swaggo/swag)

## 📄 License

MIT License - Silakan gunakan dengan bebas untuk project komersial maupun non-komersial.

## 👨‍💻 Author

**Makarim Muhammad** - [GitHub](https://github.com/makarim22)

---

**Terakhir diperbarui**: April 8, 2026

Untuk pertanyaan atau kontribusi, silakan buka issue atau pull request di repository.
