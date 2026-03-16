# College QR Attendance Management System

A modern, secure, role-based attendance management platform built with the MERN stack.

## Tech Stack
- **Frontend**: React, Vite, TailwindCSS, Lucide Icons, Recharts
- **Backend**: Node.js, Express, MongoDB
- **Auth**: JWT, BcryptJS
- **QR**: Dynamic Secure Tokens

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (Running locally or Atlas)

### 1. Backend Setup
1. `cd backend`
2. `npm install`
3. Create `.env` file (see `.env` for template)
4. Seed the database: `node seed.js`
5. Start the server: `npm run dev` (or `node server.js`)

### 2. Frontend Setup
1. `cd frontend`
2. `npm install`
3. Start the dev server: `npm run dev`

## Default Roles & Credentials
| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@college.edu | password123 |
| Teacher | alan@college.edu | password123 |
| Student | student1@college.edu | password123 |

## Project Structure
- `/backend`: Core API, models, and controllers.
- `/frontend`: React application with dashboard and scanner.
- `/seed.js`: Database initialization script.
