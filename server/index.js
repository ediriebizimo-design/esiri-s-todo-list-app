// ============================================================
// FILE: server/index.js
// PURPOSE: This is the BACKEND SERVER entry point.
// It sets up Express, connects to MongoDB, and starts
// listening for API requests from the React frontend.
// ============================================================

// Line 1: Load environment variables from the .env file.
// This MUST be the very first line so that all other files
// can access process.env.MONGO_URI and process.env.PORT.
// dotenv reads your .env file and adds each line as a
// variable on the process.env object.
require("dotenv").config();

// Line 6: Import Express — the web framework that handles
// incoming HTTP requests (GET, POST, PUT, DELETE).
const express = require("express");

// Line 9: Import Mongoose — the library that connects to
// MongoDB and lets us define schemas and query the database.
const mongoose = require("mongoose");

// Line 12: Import cors (Cross-Origin Resource Sharing).
// Without this, the browser BLOCKS requests from
// localhost:3000 (React) to localhost:5000 (Express)
// because they are on different ports. cors() allows it.
const cors = require("cors");

// Line 17: Create the Express application instance.
// app is the object we use to define routes and middleware.
const app = express();

// Line 21: Middleware — cors() allows cross-origin requests.
// This MUST come before your routes or it won't work.
app.use(cors());

// Line 25: Middleware — express.json() parses incoming
// request bodies that contain JSON data.
// Without this, req.body would be undefined when the
// frontend sends task data in POST/PUT requests.
app.use(express.json());

// Line 31: Import the tasks router from our routes file.
// This file contains all the CRUD route handlers.
const taskRoutes = require("./routes/tasks");

// Line 35: Mount the task routes at /api/tasks.
// Any request to /api/tasks or /api/tasks/:id
// will be handled by the taskRoutes file.
// Example: GET /api/tasks → fetch all tasks
// Example: POST /api/tasks → create a new task
app.use("/api/tasks", taskRoutes);

// Line 42: A simple test route — visit /api/health in
// the browser to confirm the server is running.
// Returns a JSON object with status "ok".
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Line 48: Read the PORT from .env file.
// If PORT is not set, default to 5000.
// process.env is a Node.js object containing all
// environment variables from your system and .env file.
const PORT = process.env.PORT || 5000;

// Lines 52-62: Connect to MongoDB using the connection
// string from .env (MONGO_URI).
// mongoose.connect() is asynchronous — it returns a Promise.
// .then() runs if connection succeeds → start the server.
// .catch() runs if connection fails → log the error.
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // Connection successful — now start the HTTP server.
    // app.listen() starts accepting requests on PORT.
    // The callback logs a confirmation message.
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`✅ MongoDB connected successfully`);
    });
  })
  .catch((err) => {
    // If MongoDB connection fails, log the error and exit.
    // We do NOT start the server if there is no DB connection
    // because all API routes depend on the database.
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
