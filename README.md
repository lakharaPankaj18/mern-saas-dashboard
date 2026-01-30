# User Management Saas Dashboard

A modern SaaS admin dashboard designed to manage users, analytics, and application settings with secure authentication and a scalable MERN-based architecture.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Axios, lucide-react
- Backend: Node.js, Express.js, JWT
- Database: MongoDB

## Key Features

### Authentication & Authrorization

- Signup Option: Allow new users to create an account easily with a secure signup process.
- Login Option: Enable users to log in to their accounts securely using their credentials.
- Logout Option: Provide a straightforward way for users to log out of their accounts.
- Persistent Login: Offer users the option to stay logged in for 7 days, enhancing convenience while maintaining security.
- Weekly Login Requirement: For added security, users are required to log in at least once a week.
- Auto Logout: Automatically log out users after 15 minutes of inactivity if the persistent login option is not selected.

### Password and Account Security

- Forgot Password Handling: Users can reset their passwords securely using an OTP (One-Time Password), ensuring both ease of use and security.
- Password Encryption: Use bcrypt to encrypt and safeguard user passwords.
- Secure Data Transmission: Employ JWT to securely transmit information between parties.

### Admin Controls and User Roles

- Immediate User Suspension: Admins can instantly suspend users to protect company data and system integrity in urgent situations.
- Role-Based Authorization: Assign roles as User or Admin, with appropriate permissions for each.

### User Management

- Admin Privileges: Admin has maximum privileges within the system. Only admin can suspend/delete user.
- User Creation: Only admin can create users.

### Task Management

- User can create a task.
- They can view, edit, update, and delete tasks they created.

## Project Structure

frontend/   # React frontend
backend/    # Node + Express backend

## Installation and Setup

### Server Side

cd backend
npm i & npm run dev

### Client Side

cd frontend
npm i & npm run dev

## Environment Variables
Create a `.env` file inside the `backend` folder and add the following environment variables:

```env
PORT=7005
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```



