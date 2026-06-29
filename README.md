# Aegis – AI Productivity & Task Management Platform

Aegis is a modern AI-powered productivity platform designed to help users manage tasks, goals, habits, focus sessions, calendars, and AI-assisted planning from a single dashboard.

It combines intelligent planning with a clean, mission-control-inspired interface to provide a personalized productivity experience.

---

## ✨ Features

### 🤖 AI Assistant

* AI-powered productivity assistant
* Streaming responses using Google Gemini
* Context-aware conversations
* Smart task and productivity suggestions

### 📋 Task Management

* Create, update, and delete tasks
* Organize daily work
* Track task completion
* Priority management

### 🎯 Goals

* Create long-term and short-term goals
* Track progress
* Goal completion statistics

### 🔥 Habit Tracker

* Build daily habits
* Maintain streaks
* Progress visualization
* Daily completion tracking

### 📅 Calendar

* Create and manage events
* View upcoming schedules
* Daily planning

### ⏱ Focus Sessions

* Pomodoro / focus session tracking
* Productivity monitoring

### 📊 Analytics Dashboard

* Productivity insights
* Habit statistics
* Goal progress
* Task completion metrics

### 🔐 Authentication

* User Registration
* Secure Login
* JWT Authentication
* Protected Routes

### 🎨 Modern UI

* Responsive design
* Dashboard layout
* Clean productivity-focused interface

---

# 🛠 Tech Stack

## Frontend

* React
* Vite
* React Router
* Tailwind CSS
* Zustand
* Axios

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Google Gemini API

---

# 📁 Project Structure

```
Aegis/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── ai/
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-folder>
```

---

## 2. Install Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd ../frontend
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside the **backend** directory and anotehr inside the frontend directory.

Example:

```env
PORT=8000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_google_gemini_api_key
```

Add any additional environment variables required by your project.

---

# ▶ Running the Project

## Start Backend

From the **backend** folder:

```bash
node index.js
```

Backend runs on:

```
http://localhost:5000
```

---

## Start Frontend

From the **frontend** folder:

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# 💻 API Overview

Authentication

* Register
* Login
* Get User

AI

* Chat with Gemini
* Streaming AI responses

Tasks

* CRUD Operations

Goals

* CRUD Operations

Habits

* CRUD Operations

Calendar

* Event Management

Focus

* Focus Session Management

Analytics

* Productivity Analytics

---

# 📸 Screenshots

docs/
├── dashboard.png
├── aichat.png
├── calendar.png
├── habits.png
```


# 🔮 Future Improvements

* AI-generated daily schedules
* Voice interaction
* Mobile responsive enhancements
* Reminders
* Real-time collaboration
* Email reminders
* Gamification & achievements

---

# 🤝 Contributing

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/your-feature
```

3. Commit your changes.

```bash
git commit -m "Add new feature"
```

4. Push the branch.

```bash
git push origin feature/your-feature
```

5. Open a Pull Request.

---

# 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Sivangi Kashyap**

Built using React, Node.js, Express, MongoDB, and Google Gemini AI.
