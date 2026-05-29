// ============================================================
// FILE: server/routes/tasks.js
// PURPOSE: Contains ALL the API route handlers (CRUD).
// These are the functions that run when the React frontend
// makes HTTP requests to /api/tasks.
// CRUD = Create, Read, Update, Delete
// ============================================================

// Line 1: Import Express and create a Router.
// express.Router() is a mini-app that handles a group
// of related routes — in our case, all /api/tasks routes.
const express = require("express");
const router = express.Router();

// Line 6: Import the Task model so we can query MongoDB.
// Every database operation (find, save, update, delete)
// goes through this model.
const Task = require("../models/Task");

// ============================================================
// READ — GET /api/tasks
// Called when: The React app loads and needs all tasks.
// Returns: An array of all task documents from MongoDB.
// ============================================================
router.get("/", async (req, res) => {
  // Line 23: try/catch wraps all async database code.
  // If anything goes wrong (DB offline, query error),
  // the catch block sends a 500 error instead of crashing.
  try {
    // Task.find({}) queries MongoDB for ALL documents
    // in the tasks collection. {} means no filter — get all.
    // sort({ createdAt: 1 }) orders by creation time,
    // oldest first (1 = ascending, -1 = descending).
    // await pauses execution until MongoDB responds.
    const tasks = await Task.find({}).sort({ createdAt: 1 });

    // res.json() sends the tasks array back to the frontend
    // as a JSON response with HTTP status 200 (OK).
    res.json(tasks);
  } catch (err) {
    // 500 = Internal Server Error.
    // We send the error message so the developer can debug.
    res.status(500).json({ message: err.message });
  }
});

// ============================================================
// CREATE — POST /api/tasks
// Called when: User fills out the Add Task modal and saves.
// Receives: Task data in req.body (parsed by express.json()).
// Returns: The newly created task document with its _id.
// ============================================================
router.post("/", async (req, res) => {
  try {
    // Destructure the fields sent from the React frontend.
    // req.body contains the JSON data sent in the request body.
    const { text, dueDate, dueTime, notes, icon, addedTime } = req.body;

    // Validate: if text is missing or empty, reject the request.
    // trim() removes spaces so "   " is treated as empty.
    if (!text || !text.trim()) {
      // 400 = Bad Request — the client sent invalid data.
      return res.status(400).json({ message: "Task title is required" });
    }

    // Create a new Task instance using our Mongoose model.
    // This creates the document in memory (not saved yet).
    const task = new Task({
      text: text.trim(),
      dueDate,
      dueTime,
      notes: notes || "",
      icon,
      addedTime,
      completed: false, // All new tasks start incomplete
    });

    // task.save() actually writes the document to MongoDB.
    // await waits for the save to complete before continuing.
    // After saving, task now has an _id assigned by MongoDB.
    const savedTask = await task.save();

    // 201 = Created — the standard success code for POST.
    // We send back the full saved task (including _id)
    // so the frontend can add it to state with the real ID.
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================================
// UPDATE — PUT /api/tasks/:id
// Called when: User toggles complete, edits, or reschedules.
// :id is a URL parameter — it captures the task's MongoDB _id.
// Example URL: PUT /api/tasks/664f1a2b3c4d5e6f7a8b9c0d
// ============================================================
router.put("/:id", async (req, res) => {
  try {
    // req.params.id extracts the :id from the URL.
    // findById() searches MongoDB for a document with that _id.
    const task = await Task.findById(req.params.id);

    // If no task was found with that ID, send 404 Not Found.
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update only the fields that were sent in req.body.
    // If a field is not in req.body, we keep the existing value.
    // This allows partial updates — toggle only sends completed,
    // edit sends text/dueDate/dueTime/notes.
    if (req.body.text      !== undefined) task.text      = req.body.text.trim();
    if (req.body.completed !== undefined) task.completed = req.body.completed;
    if (req.body.dueDate   !== undefined) task.dueDate   = req.body.dueDate;
    if (req.body.dueTime   !== undefined) task.dueTime   = req.body.dueTime;
    if (req.body.notes     !== undefined) task.notes     = req.body.notes;

    // Save the updated task back to MongoDB.
    // Mongoose tracks which fields changed and only
    // updates those fields — efficient and safe.
    const updatedTask = await task.save();

    // Send back the updated task so the frontend can
    // replace the old version in state.
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================================
// DELETE — DELETE /api/tasks/:id
// Called when: User clicks the ✕ button on a task.
// Also used by "Clear all completed" which calls this
// for each completed task.
// ============================================================
router.delete("/:id", async (req, res) => {
  try {
    // findByIdAndDelete() finds the document AND deletes it
    // in a single database operation — more efficient than
    // finding first then deleting separately.
    const task = await Task.findByIdAndDelete(req.params.id);

    // If nothing was deleted (ID not found), send 404.
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Send a success message confirming deletion.
    // 200 is the default status for res.json() — OK.
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Line 146: Export the router so server/index.js can
// import and mount it at /api/tasks.
module.exports = router;
