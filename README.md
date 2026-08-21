# Task Manager (To-Do App)

A full-stack task management application built as a Chingu Solo Project (Tier 3).
Users can create, view, edit, mark as complete, and delete tasks.

## Live Demo
- **Frontend (deployed):** https://todo-app.vercel.app
- **Backend API:** https://todo-backend.up.railway.app/api/tasks

## Purpose
A simple yet complete full-stack app demonstrating a clear separation between
frontend and backend, with all database access handled exclusively on the backend.

## Major Functions
- Create a new task
- View all tasks
- Edit a task's title
- Mark a task as complete / active (toggle)
- Delete a task
- Filter tasks: All / Active / Completed

## Tech Stack
- **Frontend:** Vue 3 (Composition API), Axios, Vite
- **Backend:** Laravel (REST API)
- **Database:** SQLite (accessed only from the backend via Eloquent ORM)

## Architecture
- The frontend (Vue) communicates with the backend only through a custom REST API.
- The frontend never accesses the database directly.
- The backend exposes an app-specific API (`/api/tasks`) implementing full CRUD.
- Data transformation (filtering, counting) is handled in the frontend logic.

## API Endpoints
| Method | Endpoint          | Description        |
|--------|-------------------|--------------------|
| GET    | /api/tasks        | Get all tasks      |
| POST   | /api/tasks        | Create a new task  |
| PUT    | /api/tasks/{id}   | Update a task      |
| DELETE | /api/tasks/{id}   | Delete a task      |

## Dependencies
- **Backend:** PHP 8.2+, Composer, Laravel
- **Frontend:** Node.js, npm, Vue 3, Axios

## Build & Run Locally

### Backend
​```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
php artisan serve
​```

### Frontend
​```bash
cd frontend
npm install
npm run dev
​```

The frontend runs on `http://localhost:5173` and connects to the backend
on `http://localhost:8000/api`.
