# 🧩 Task Management System (MERN Stack)

A full-stack **Task Management System** built using the **MERN stack** (MongoDB, Express, React, Node.js).  
This project was developed as part of a **Full Stack Developer Internship** and satisfies **Basic, Intermediate, and Advanced** task requirements.

---

## 🚀 Features

- User authentication (Register / Login)
- JWT-based authorization
- Create, update, delete tasks
- Role-based access (Admin / User)
- React frontend with reusable components
- RESTful APIs using Express
- MongoDB database with Mongoose
- Real-time updates using Socket.io
- Clean project structure
- Git version control

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- JavaScript
- Axios
- HTML5, CSS3

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- Socket.io

### Tools
- Git & GitHub
- VS Code
- Postman / Thunder Client

---

## 📂 Project Structure
```
TMS/
├── backend/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── server.js
│ ├── package.json
│ └── .env
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── services/
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── index.html
│ ├── vite.config.js
│ └── package.json
│
└── README.md
```
---

## ⚙️ Prerequisites

Make sure you have the following installed:

- Node.js (v18+ recommended)
- npm
- MongoDB (local or MongoDB Atlas)
- Git

Check versions:
```
node -v
npm -v
```
---

## 🔧 Backend Setup & Run
### 1️⃣ Navigate to backend folder
```
cd backend
```

### 2️⃣ Install dependencies
```
npm install
```

### 3️⃣ Create .env file
Create a file named .env inside backend/:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskmanager
JWT_SECRET=your_secret_key
```

### 4️⃣ Start MongoDB
If using local MongoDB:
```
mongod
```
Or connect using MongoDB Compass / Atlas.

### 5️⃣ Run backend server
```
npm run dev
```

Backend will run at:
```
http://localhost:5000
```
---

## 🎨 Frontend Setup & Run
### 1️⃣ Navigate to frontend folder
```
cd frontend
```

### 2️⃣ Install dependencies
```
npm install
```

### 3️⃣ Start frontend development server
```
npm run dev
```

Frontend will run at:
```
http://localhost:5173
```

### 🔗 API Base URL
Frontend communicates with backend using:
```
http://localhost:5000/api
```

Configured in:
```
frontend/src/services/api.js
```
---

## 🧠 Internship Task Mapping
### ✅ Level 1 – Basic

- Development environment setup

- REST API with CRUD operations

- Frontend integration

### ✅ Level 2 – Intermediate

- React component-based frontend

- Authentication & authorization using JWT

- Database integration with MongoDB

### ✅ Level 3 – Advanced

- Full MERN stack application

- Real-time features using Socket.io

- Deployment-ready project structure

---

## 👤 Author

### Gunasekaran G

 Full Stack Developer Intern

---

## 📄 License

This project is created for educational and internship purposes only.

---

