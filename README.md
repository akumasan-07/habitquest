# HabitQuest

HabitQuest is a full-stack habit tracking application that helps users build consistency through daily quest management, streak tracking, performance analytics, and long-term progress visualization.

## Features

### Habit Tracking System

* Create and manage daily quests (habits)
* Track completion history across days
* Persistent cloud-based storage for long-term habit tracking

### Progress Tracking

* Daily completion statistics
* Current and best streak tracking
* 6-month activity heatmap
* Consistency scoring based on historical completion patterns
* Weekly performance summaries for quick progress review

### Authentication & Security

* User registration and login
* JWT-based authentication
* Secure password hashing with bcrypt
* Account deletion with password confirmation

### User Experience

* Responsive design for desktop and mobile
* Light and dark theme support
* Toast notifications for user actions
* Real-time feedback and progress updates

## Tech Stack

### Frontend

* React
* React Router for navigation
* Tailwind CSS for responsive UI
* Axios for API communication
* Lucide React for icons
* Sonner for notifications
* date-fns for date manipulation and analytics calculations

### Backend

* Node.js with Express.js 
* MongoDB Atlas for cloud database storage
* Mongoose for database modeling and queries
* JSON Web Tokens (JWT) for authentication
* bcryptjs for password hashing

## Architecture

**Frontend:** React single-page application with React Router for client-side navigation and a responsive UI built with Tailwind CSS.

**Backend:** Express.js REST API with a modular structure consisting of routes, controllers, middleware, and database models.

**Authentication:** JWT-based authentication with protected routes and secure password hashing using bcrypt.

**Database:** MongoDB Atlas with Mongoose models for users, quests, and quest activity logs.

**Analytics Engine:** Calculates streaks, consistency scores, weekly summaries, and historical progress metrics from quest completion data.

**Progress Visualization:** Interactive 6-month activity heatmap and performance insights generated from stored completion history.

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/akumasan-07/habitquest.git
cd HabitQuest
```

### 2. Configure environment variables

Create:

```text
backend/.env
frontend/.env
```

Use the provided `.env.example` files as templates.

### 3. Install dependencies

Frontend:

```bash
npm install
npm run dev
```

Backend:

```bash
npm install
npm run dev
```

## Contributing

Contributions, suggestions, and feedback are always welcome. Feel free to fork the repository, open an issue, or submit a pull request if you'd like to improve HabitQuest.

## License

This project is licensed under the MIT License.
