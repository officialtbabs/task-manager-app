# Task Manager App

A minimal React + TypeScript + Vite app with Supabase backend.

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```sh
git clone https://github.com/officialtbabs/task-manager-app.git
cd task-manager-app
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Environment Variables

Create a `.env` file in the project root.  
**Required:**
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```
Get these from your Supabase project dashboard (Project Settings → API).

### 4. Supabase Backend Setup

#### a. Install Supabase CLI

```sh
npm install -g supabase
```

#### b. Start Supabase Locally

```sh
supabase start
```

#### c. Apply Database Schema

Create a `tasks` table with the following schema:

```sql
create table tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  status text check (status in ('pending', 'in-progress', 'done')) default 'pending',
  extras jsonb,
  inserted_at timestamptz default now()
);

alter table tasks enable row level security;

create policy "Users can access their own tasks"
on tasks for all
using (auth.uid() = user_id);
```

Apply this using the Supabase dashboard SQL editor or via migrations.

### 5. Run the Frontend

```sh
npm run dev
```
Follow link provided to local development server.

---

## 🗄️ Supabase Schema Description

- **Table:** `tasks`
  - `id`: UUID, primary key
  - `user_id`: UUID, references `auth.users`
  - `title`: text, required
  - `description`: text, optional
  - `status`: text, enum: `'pending' | 'in-progress' | 'done'`, default `'pending'`
  - `extras`: JSONB, optional
  - `inserted_at`: timestamp, default `now()`
- **Row Level Security:** Only the owner (`user_id`) can access their tasks.

---

## 📝 Dev Note

### What I'd Build Next If I Had More Time

- Task comments for collaboration
- File attachments for tasks
- Real-time or email notifications
- Advanced filtering and search
- Mobile responsiveness improvements
- User profile management
- Team/multi-user support
- Testing

---

## 🌐 Deployed App

> [Live Demo](https://task-manager-app-ten-ochre.vercel.app)

---

**Note:**  
- You must configure your `.env` file before running the app.
- Supabase CLI and Docker are required for local backend development.
- For production, set up your Supabase project and update the `.env` accordingly.