# AEGIS - The Last Minute Life Saver

AEGIS is an AI-powered productivity companion designed to behave like an intelligent personal chief of staff. 

## Features
- **Smart Prioritization**: Dynamically calculates task priority using deadlines, energy levels, and AI reasoning.
- **Autonomous Scheduling**: Optimizes your calendar to prevent burnout.
- **Focus Mode**: Deep work timer with integrated analytics.
- **Goals & Habits**: Track long-term and short-term objectives.
- **AI Chief of Staff**: Chat interface integrated with Gemini 2.5.
- **Voice Assistant**: Use voice commands to create tasks.

## Tech Stack
- **Frontend**: React 19, Vite, TailwindCSS v4, React Router DOM, Zustand, Framer Motion, Firebase Auth.
- **Backend**: Node.js, Express, MongoDB, Google Gemini API, Google Calendar API.

## Setup Instructions

### Environment Variables
1. Copy `.env.example` to `.env` in the root directory and fill in your Firebase and Gemini API keys.
2. In the `backend` folder, ensure you have your `MONGO_URI`.

### Running Locally
1. Start Backend:
\`\`\`bash
cd backend
npm install
node index.js
\`\`\`

2. Start Frontend:
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

## Hackathon Context
This project was built to maximize the evaluation criteria:
- **Problem Solving**: Not just a reminder app, it actively helps users finish work.
- **Agentic Depth**: Gemini reasons about deadlines and dynamically suggests schedules.
- **Google Technologies**: Gemini API, Google Calendar API, Firebase Auth.
- **Product Experience**: Premium UI with Framer Motion, Tailwind v4, Glassmorphism.
