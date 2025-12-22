# ContestHub - Client Side

## Project Overview
ContestHub is a platform for creative contests where users can participate, submit tasks, and compete for prizes. Creators can create contests, and admins can approve contests. The frontend provides a smooth user experience with features like dark/light mode, profile management, contest browsing, and live deadline countdown.

## Features
- User authentication with Firebase
- Dark/Light theme toggle with persistent choice
- Browse contests:
  - Popular contests
  - Upcoming contests (pending admin approval)
  - All contests
- Search contests by type
- Contest participation with Stripe payment integration
- Submit contest tasks
- View winners
- User profile management with update form
- Win percentage chart (Pie chart using Recharts)
- Admin-specific views (via protected APIs)
- Responsive design using TailwindCSS & DaisyUI
- Real-time deadline countdown
- LeaderBoard
- Top Creators

## Tech Stack
- React 18
- React Router
- TailwindCSS + DaisyUI
- Framer Motion (for animations)
- tanstack Query (data fetching)
- Recharts (Pie chart for win percentage)
- React Hook Form (profile update)
- Firebase Authentication
- React Hot Toast (notifications)

