# ✅ Todo List Application

A full-stack Todo List app built with the **MERN stack** (MongoDB, Express, React, Node.js). Users can manage their tasks with a clean, mobile-first purple-themed interface — complete with scheduling, overdue detection, filters, and personalized greetings.

---

## 🔗 Live Demo

> 🚀 [View Live App]([https://esiri-s-todo-list-app.vercel.app/])

---

## 📸 Screenshots

| Greeting Screen | Task List | Add New Task |
|---|---|---|
| Enter your name to get started | View, filter, and manage all tasks | Schedule tasks with date, time & notes |

---

## ✨ Features

### Core Features
- 👋 **Personalized greeting** — Enter your name and get a personalized welcome: *"Hi James, what are we working on today?"*
- ➕ **Add tasks** — Full modal form with title, due date, due time, and optional notes
- ✅ **Complete tasks** — Toggle tasks between complete and incomplete with a single tap
- ✏️ **Edit tasks** — Update any task's title, date, time, or notes
- 🗑️ **Delete tasks** — Remove individual tasks or clear all completed at once

### Bonus Features
- 🔍 **Filter tasks** — View All, Active only, or Completed only
- 🔢 **Task count** — Live counter showing how many tasks remain
- 🔴 **Overdue detection** — Tasks past their due date show a red OVERDUE badge
- 🎉 **All-done banner** — Celebration message when every task is checked off
- ⚠️ **Leave warning** — Prompts the user before leaving with unfinished tasks
- 📅 **Date & time scheduling** — Each task can have a due date and time, pre-filled to today

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | React (Hooks) | Component model, reactive state, industry standard |
| **Backend** | Node.js + Express | Fast REST API, JavaScript on server side |
| **Database** | MongoDB + Mongoose | Flexible JSON documents, easy to scale |
| **Styling** | CSS-in-JS (inline styles) | Scoped, dynamic styles without extra dependencies |
| **Testing** | Jest + Supertest | Unit and integration test coverage |

---

## 📁 Project Structure

```
todo-list-app/
├── client/                   # React frontend
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.jsx           # Main component — all UI logic lives here
│       └── index.js          # React entry point
│
├── server/                   # Node/Express backend
│   ├── models/
│   │   └── Task.js           # Mongoose schema for tasks
│   ├── routes/
│   │   └── tasks.js          # CRUD API routes
│   └── index.js              # Server entry point
│
├── tests/
│   └── tasks.test.js         # Jest + Supertest test suite
│
├── .env.example              # Environment variable template
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:
- [Node.js](https://nodejs.org/) v16 or higher
- [MongoDB](https://www.mongodb.com/) (local) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) account

---

### 1. Clone the Repository

```bash
git clone https://github.com/ediriebizimo-design/todo-list-app.git
cd todo-list-app
```

---

### 2. Set Up the Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder:

```env
MONGO_URI=mongodb://localhost:27017/todoapp
PORT=5000
```

> If using MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

Start the server:

```bash
npm start
```

The API will run at `http://localhost:5000`

---

### 3. Set Up the Frontend

```bash
cd ../client
npm install
npm start
```

The React app will open at `http://localhost:3000`

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | Fetch all tasks |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/:id` | Update a task (toggle, edit) |
| `DELETE` | `/api/tasks/:id` | Delete a task |

### Example Request — Create a Task

```bash
POST /api/tasks
Content-Type: application/json

{
  "text": "Buy groceries",
  "dueDate": "2026-05-28",
  "dueTime": "14:00",
  "notes": "Don't forget the eggs"
}
```

### Example Response

```json
{
  "_id": "664f1a2b3c4d5e6f7a8b9c0d",
  "text": "Buy groceries",
  "completed": false,
  "dueDate": "2026-05-28",
  "dueTime": "14:00",
  "notes": "Don't forget the eggs",
  "createdAt": "2026-05-27T14:35:00.000Z"
}
```

---

## 🧪 Running Tests

```bash
cd tests
npm test
```

### What's Tested

| Test Type | Examples |
|---|---|
| **Unit — helpers** | `formatDisplayDate`, `formatDisplayTime`, `isOverdue` |
| **Unit — state logic** | `addTask` builds correct object, `toggleTask` flips completed |
| **Integration — API** | `POST /api/tasks` saves to DB and returns 201 |
| **Edge cases** | Empty title rejected, no due date handled, overdue at midnight |

---

## 🧠 Key Design Decisions

**1. Derived state over stored state**
Values like `activeCount` are computed from the `tasks` array on every render rather than stored in separate `useState` variables. This ensures they are always in sync and eliminates an entire category of bugs.

**2. Functional state updates**
All `setTasks` calls use the functional form `setTasks(prev => ...)` rather than referencing the `tasks` variable directly. This is safer because React state updates can be asynchronous.

**3. CSS-in-JS styling**
Styles are JavaScript objects in a single `S` constant. Dynamic styles (like active tab highlighting) are functions that return different objects based on props. This keeps everything in one file and avoids CSS class name collisions.

**4. Component separation**
`AddTaskModal` and `EditTaskModal` are separate components even though they share similar structure. Each has a single, clear responsibility — one always starts blank, one always starts pre-filled. This makes them easier to maintain and test independently.

---

## ⚠️ Known Issues & How They Were Solved

| Issue | Root Cause | Solution |
|---|---|---|
| Browser ignores custom leave message | Modern browsers override `e.returnValue` for security | Accept it — the native prompt still appears |
| State not updating after push() | Mutating array reference doesn't trigger re-render | Always spread into a new array: `[...prev, item]` |
| Date input format mismatch | HTML inputs need `YYYY-MM-DD` exactly | Use `toISOString().split("T")[0]` |
| Task overdue at midnight | No time defaults to `T00:00` which is immediately past | Fall back to `"23:59"` when no time is set |
| Modal closes on inner click | Click event bubbles up to overlay | `e.stopPropagation()` on the modal inner div |

---

## 🌐 Deploying to Vercel (Frontend)

```bash
npm install -g vercel
cd client
vercel
```

Follow the prompts. Your live URL will look like:
```
https://todo-list-app-yourname.vercel.app
```

---

## 👤 Author

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)
- Email: your-email@example.com

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
