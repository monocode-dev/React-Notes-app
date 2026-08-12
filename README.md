# 📚 Notebook — React Notes App

A full-stack notes app with category organization, session-based authentication, and a card-catalog-inspired UI.

**Live demo:** _coming soon_
**Repo:** https://github.com/monocode-dev/React-Notes-app

---

## Features

- 🔐 **Authentication** — signup/login with hashed passwords and server-side sessions; all data scoped per user
- 🗂️ **Categories** — create and delete categories, each auto-assigned a color from a curated palette
- 📝 **Notes** — create, edit, and delete notes; each note is tagged to a category and inherits its color as a visual "guide tab"
- 🎯 **Filtering** — view all notes or filter by category from the sidebar
- 📱 **Responsive** — off-canvas sidebar with a hamburger toggle on smaller screens
- 🎨 **Card-catalog design system** — warm paper tones, brass accents, Fraunces/Source Serif typography, and library-ticket-style category tags

---

## Tech Stack

**Frontend**
- React
- Vite (dev server + proxy to backend)
- Plain CSS (custom design system, no framework)

**Backend**
- Node.js + Express
- SQLite (with foreign keys for the categories ↔ notes relationship)
- Session-based auth (`express-session`) + `bcrypt` for password hashing

---

## Project Structure

```
notes-app/
├── client/                        # React frontend
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── Categorycolor.js        # category color assignment
│       ├── utils.js                # apiRequest() helper (fetch wrapper + 401 handling)
│       ├── style.css
│       ├── Sidebar.jsx
│       ├── NotesMain.jsx
│       ├── Notes/
│       │   ├── NotesGrid.jsx
│       │   ├── NoteCard.jsx
│       │   └── NoteModal.jsx
│       ├── Categories/
│       │   ├── CategoryList.jsx
│       │   ├── CategoryItem.jsx
│       │   └── NewCategoryForm.jsx
│       └── AuthenticationComps/
│           ├── Login.jsx
│           └── Signup.jsx
│
└── server/                        # Express backend
    ├── server.js                  # auth, categories, notes routes
    ├── database.js                # SQLite setup + schema
```

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### 1. Clone the repo
```bash
git clone https://github.com/monocode-dev/React-Notes-app.git
cd React-Notes-app
```

### 2. Set up the backend
```bash
cd server
npm install
npm run dev
```
Server runs on `http://localhost:3000` (adjust to your actual port).

### 3. Set up the frontend
```bash
cd client
npm install
npm run dev
```
Vite dev server runs on `http://localhost:5173` and proxies `/api` requests to the backend.

### 4. Open the app
Visit `http://localhost:5173`, sign up for an account, and start adding categories and notes.

---

## API Overview

All responses follow a consistent shape:
```json
{ "success": true, "message": "...", "data": { ... } }
```

| Method | Endpoint              | Description                     |
|--------|------------------------|----------------------------------|
| POST   | `/signup`              | Create a new account             |
| POST   | `/login`                | Log in, starts a session         |
| POST   | `/logout`               | Ends the session                 |
| GET    | `/api/categories`       | List the current user's categories |
| POST   | `/api/categories`       | Create a category                |
| DELETE | `/api/categories/:id`   | Delete a category                |
| GET    | `/api/notes`            | List the current user's notes    |
| POST   | `/api/notes`            | Create a note                    |
| PUT    | `/api/notes/:id`        | Update a note                    |
| DELETE | `/api/notes/:id`        | Delete a note                    |

All `/api/*` routes require an authenticated session; unauthenticated requests redirect to login (handled by the `apiRequest()` helper on the frontend).

---

## Design Notes

The UI is built around a "library card catalog" metaphor:
- Categories are assigned colors in creation order from a fixed palette (terracotta, sage, dusty blue, mustard, plum, teal), cycling if more than six exist.
- Each note card displays a colored tab matching its category, similar to a library guide card.

---

## Author

Built by **Monocode** — [GitHub](https://github.com/monocode-dev) · [TikTok](https://tiktok.com/@monocode.dev) · [Portfolio](https://monocode.netlify.app)