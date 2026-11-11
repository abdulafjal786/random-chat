# RandomChat — Random Chat with Blog

A full-stack real-time anonymous chat application with a blog.

- **Frontend:** Next.js 15 + TypeScript + Tailwind CSS
- **Backend:** Django 5 + Django REST Framework + Django Channels

---

## Project Structure

```
project/
├── frontend/        # Next.js 15 app
└── backend/         # Django app
```

---

## Quick Start

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Seed blog posts
python manage.py seed_blog

# Create admin user (optional)
python manage.py createsuperuser

# Start the server (Daphne for ASGI/WebSocket support)
daphne -b 0.0.0.0 -p 8000 config.asgi:application
```

The backend runs at **http://localhost:8000**

Admin panel: **http://localhost:8000/admin** (username: `admin`, password: `admin123`)

### 2. Frontend Setup

```bash
cd frontend

npm install

# Start dev server
npm run dev
```

The frontend runs at **http://localhost:3000**

---

## Environment Variables

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=localhost:8000
```

### Backend (optional `.env`)
```
SECRET_KEY=your-secret-key-here
DEBUG=True
```

---

## REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register/` | Register or retrieve a user by UUID |
| GET | `/api/blog/posts/` | List all published blog posts |
| GET | `/api/blog/posts/<slug>/` | Get a single blog post |

## WebSocket

```
ws://localhost:8000/ws/chat/<user_id>/
```

### Message Protocol

**Client → Server**
```json
{ "type": "message", "text": "Hello!" }
{ "type": "skip" }
```

**Server → Client**
```json
{ "type": "searching" }
{ "type": "matched", "partner_id": "<uuid>" }
{ "type": "message", "sender": "<uuid>", "text": "Hello!", "timestamp": "..." }
{ "type": "disconnected" }
```

---

## How It Works

1. User visits `/` → clicks "Start Chatting" → UUID generated & stored in `localStorage` → `POST /api/register/` → redirect to `/chat`
2. WebSocket connects → server sends `searching`
3. Two users connect → server matches them → sends `matched` to both
4. Users chat in real time via WebSocket
5. After 10–20 seconds → server auto-disconnects both → clients reconnect in 5 seconds
6. "Skip" button → sends skip event → partner notified → new match begins

---

## Production Notes

- Replace `InMemoryChannelLayer` with `channels_redis` for multi-process deployments
- Set `DEBUG=False` and configure `ALLOWED_HOSTS`
- Use PostgreSQL instead of SQLite
- Serve frontend as static files via Nginx or deploy to Vercel
"# random-chat" 
