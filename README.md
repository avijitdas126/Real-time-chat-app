# 🚀 YapUp - Real-Time Chat Application

![Logo](chat_app/src/app/favicon.ico)

**YapUp** is a full-stack real-time chat application that supports image sharing, unread message tracking, and online presence detection.

### 🔧 Built With

* **Frontend**: [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/)
* **Backend**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [Socket.IO](https://socket.io/)
* **Authentication**: [Clerk](https://clerk.dev/)
* **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
* **Image Upload**: [Cloudinary](https://cloudinary.com/)

---

## ✨ Features

* ⚡ Real-time messaging using Socket.IO
* 🔐 User authentication with Clerk
* 🖼️ Image attachments via Cloudinary
* 😄 Emoji picker support
* 👤 One-to-one private conversations
* 🔔 Unread message tracking per user
* ✅ Message read status
* 🗑️ Deletion logic for sender/receiver
* 🟢 Online user presence indicator
* 💻 Desktop-first responsive design

---

## 📦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/avijitdas126/Real-time-chat-app.git
cd Real-time-chat-app
```

---

## 🖥️ Frontend Setup

```bash
cd chat_app
npm install
npm run dev
```

### ➕ Add `.env.local` in `/chat_app`

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:8000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLOUD_NAME=
NEXT_PUBLIC_UPLOAD_PRESET=
```

---

## 🛠 Backend Setup

```bash
cd server
npm install
npm start
```

### ➕ Add `.env` in `/server`

```env
MONGO_URL=mongodb://0.0.0.0:27017/real-time-chat
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

---

## 🙌 Support

If you found this project helpful, please ⭐️ the repo. It encourages me to improve it further!


