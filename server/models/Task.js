// ============================================================
// FILE: server/models/Task.js
// PURPOSE: Defines the SHAPE of a task document in MongoDB.
// A schema is a blueprint — it tells MongoDB exactly what
// fields each task document must/can have and their types.
// ============================================================

// Line 1: Import mongoose — needed to define schemas and models.
const mongoose = require("mongoose");

// Lines 4-35: Define the TaskSchema.
// mongoose.Schema() takes an object where each key is a
// field name and each value describes the field's rules.
const TaskSchema = new mongoose.Schema(
  {
    // text: The task title typed by the user.
    // type: String — must be a string value.
    // required: true — MongoDB rejects the document if
    //   this field is missing. Prevents saving empty tasks.
    // trim: true — automatically removes leading/trailing
    //   spaces before saving. "  Buy milk  " → "Buy milk"
    text: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },

    // completed: Whether the task is done or not.
    // type: Boolean — only true or false.
    // default: false — new tasks start as incomplete.
    //   We do not need to send this field when creating
    //   a task — MongoDB sets it to false automatically.
    completed: {
      type: Boolean,
      default: false,
    },

    // dueDate: The date the task should be done by.
    // Stored as a String in YYYY-MM-DD format ("2026-05-27").
    // Not required — tasks can exist without a due date.
    dueDate: {
      type: String,
    },

    // dueTime: The time the task is due.
    // Stored as a String in HH:MM format ("14:30").
    // Not required — tasks can exist without a specific time.
    dueTime: {
      type: String,
    },

    // notes: Optional extra details about the task.
    // default: "" means if not provided, it saves as
    // an empty string rather than undefined.
    notes: {
      type: String,
      default: "",
    },

    // icon: The emoji assigned to the task on creation.
    // Stored as a string (emojis are Unicode characters).
    icon: {
      type: String,
    },

    // addedTime: A human-readable string like "2:30 PM"
    // showing when the task was created.
    // This is separate from the automatic createdAt below.
    addedTime: {
      type: String,
    },
  },
  {
    // timestamps: true tells Mongoose to automatically add
    // two fields to every document:
    // createdAt — the exact datetime the task was created
    // updatedAt — the exact datetime the task was last changed
    // These are managed by Mongoose — you never set them manually.
    timestamps: true,
  }
);

// Line 70: Create and export the Task model.
// mongoose.model("Task", TaskSchema) creates a Model —
// a class that lets us interact with the "tasks" collection
// in MongoDB (Mongoose automatically pluralizes and lowercases:
// "Task" model → "tasks" collection in the database).
// We export it so the routes file can import and use it.
module.exports = mongoose.model("Task", TaskSchema);
