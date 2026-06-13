# Taskr — Task Manager with Authentication

A full-stack task management app built with FastAPI, PostgreSQL, and React.

🔗 **Live demo:** https://task-manager-sepia-one-80.vercel.app  
🔗 **API docs:** https://task-manager-xfg7.onrender.com/docs

---

## Features

- User registration and login with JWT authentication
- Passwords hashed with bcrypt — never stored in plain text
- Create, edit, delete, and complete tasks
- Set priority levels (low, medium, high) and due dates
- Filter tasks by status (all, pending, completed)
- Fully responsive — works on mobile and desktop

---

## Tech Stack

**Frontend**
- React 18 + TypeScript
- Tailwind CSS
- Axios

**Backend**
- Python + FastAPI
- PostgreSQL (Neon)
- SQLAlchemy
- JWT authentication (python-jose)
- bcrypt password hashing

**Infrastructure**
- Backend deployed on Render
- Frontend deployed on Vercel
- Database hosted on Neon

---

## Running Locally

**1. Clone the repo**

git clone https://github.com/fabulujebabatomiwa/task-manager.git
cd task-manager

**2. Backend setup**

cd task-manager
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

Create a .env file inside the task-manager folder:

DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/taskmanager
SECRET_KEY=yoursecretkey

Run the server:

uvicorn app.main:app --reload

**3. Frontend setup**

cd frontend
npm install
npm run dev

Open http://localhost:5173 in your browser.

---

## Architecture Decisions

- REST API built with FastAPI for automatic docs generation and fast performance
- PostgreSQL chosen for relational data — tasks belong to users via foreign key
- JWT tokens issued on login and verified on every protected route via HTTP Bearer
- Passwords are never stored in plain text — bcrypt hashes them before saving
- SQLAlchemy ORM used for database access — no raw SQL in application code
- CORS configured to allow only the production frontend URL

---

## Project Structure

task-manager/
├── app/
│   ├── main.py        # FastAPI app, CORS, router
│   ├── models.py      # SQLAlchemy models (User, Task)
│   ├── routes.py      # API endpoints
│   ├── auth.py        # Password hashing, JWT logic
│   └── database.py    # Database connection
├── frontend/
│   └── src/
│       ├── App.tsx
│       └── components/
│           ├── Auth.tsx
│           └── Dashboard.tsx
└── requirements.txt