# 🚀 ProjectFlow

A modern **Project Management System** inspired by Jira and Trello, built with the MERN ecosystem (React + Node.js + PostgreSQL). ProjectFlow helps teams collaborate, assign tasks, track project progress, and manage activities in real time.

## 🌐 Live Demo

**Frontend:** https://projectflow-ivory-six.vercel.app

---

# 📌 Features

## 🔐 Authentication

* User Registration
* Login & Logout
* Email OTP Verification
* Secure JWT Authentication
* HttpOnly Cookie-based Sessions
* Session Verification
* Password Hashing using bcrypt

---

## 👤 User Management

* Team Member Listing
* Search Users
* Filter Users
* Pagination
* Project-wise Members
* Invite Members to Projects

---

## 📁 Project Management

* Create Project
* Update Project
* Delete Project
* View Project Details
* Project Progress
* Project Statistics
* Project Members
* Search Projects
* Pagination

---

## ✅ Task Management

* Create Task
* Update Task
* Delete Task
* Assign Task to Team Members
* Task Priority
* Task Status
* Task Deadline
* Task Search
* Task Filtering
* Task Statistics

---

## 📊 Dashboard

* Total Projects
* Active Projects
* Completed Projects
* Pending Tasks
* Overdue Tasks
* Project Analytics
* Task Analytics
* Interactive Charts

---

## 🔔 Notifications

* Real-time Notifications
* Task Assignment Notifications
* Activity Notifications
* Read / Unread Status
* Socket.IO Integration

---

## 📜 Activity Timeline

Track every important action:

* Project Created
* Project Updated
* Member Joined
* Task Assigned
* Task Updated
* Task Deleted

Activities are filtered based on project membership.

---

## 🔍 Global Search

Search across:

* Projects
* Tasks
* Team Members

---

## 👥 Team Collaboration

* Invite Members
* Project-specific Members
* Search Members
* Filter Members by Project
* Assigned Task Members

---

## 📈 Analytics

* Task Status Distribution
* Project Completion
* Pending Tasks
* Completed Tasks
* Team Statistics

---

# ⚙ Tech Stack

## Frontend

* React.js
* React Router
* Zustand
* Axios
* Tailwind CSS
* Framer Motion
* Recharts
* Socket.IO Client
* Lucide React

## Backend

* Node.js
* Express.js
* PostgreSQL
* Socket.IO
* JWT Authentication
* bcrypt
* Nodemailer

## Database

* PostgreSQL
* Neon Database

## Deployment

Frontend

* Vercel

Backend

* Render

Database

* Neon PostgreSQL

---

# 📂 Folder Structure

```
ProjectFlow
│
├── client
│   ├── src
│   ├── components
│   ├── pages
│   ├── services
│   ├── store
│   ├── context
│   └── utils
│
├── server
│   ├── src
│   ├── controllers
│   ├── services
│   ├── middleware
│   ├── routes
│   ├── config
│   ├── utils
│   └── socket
│
└── README.md
```

---

# 🔑 Main Functionalities

* JWT Authentication
* OTP Email Verification
* Secure Cookie Authentication
* Project CRUD
* Task CRUD
* Team Management
* Activity Tracking
* Notification System
* Project Analytics
* Task Analytics
* Pagination
* Search
* Filtering
* Sorting
* Protected Routes
* Real-time Socket Events

---

# 📦 Installation

## Clone Repository

```bash
git clone https://github.com/OmkarProjects-alt/Projectflow
```

## Frontend

```bash
cd client
npm install
npm run dev
```

## Backend

```bash
cd server
npm install
npm run dev
```

---

# 🔐 Environment Variables

## Backend

Create a `.env` file.

```env
PORT=

CLOUD_DB=

JWT_SECRET=

SENDGRID_FROM_EMAIL=

SENDGRID_API_KEY=

```

---

# 📸 Screens

* Authentication
* OTP Verification
* Dashboard
* Project Management
* Task Board
* Activity Timeline
* Notifications
* Team Members
* Project Analytics

---

# 🚀 Future Improvements

* Kanban Drag & Drop
* File Attachments
* Comments on Tasks
* Role-Based Access Control (RBAC)
* Calendar View
* Dark / Light Theme
* Email Notifications
* Project Templates
* Mobile Responsive Improvements
* AI Task Suggestions

---

# 👨‍💻 Author

**Omkar Gudappe**

Full Stack Developer

---

# 📄 License

This project is licensed under the MIT License.
