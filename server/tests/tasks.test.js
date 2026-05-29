// ============================================================
// FILE: tests/tasks.test.js
// PURPOSE: Automated tests for the Todo List backend API.
// We use Jest (test runner) and Supertest (HTTP testing).
//
// HOW TO RUN: npm test (inside the server folder)
// ============================================================

// Line 1: Import supertest — lets us make real HTTP requests
// to our Express app WITHOUT starting a real server.
// It simulates GET, POST, PUT, DELETE requests in tests.
const request = require("supertest");

// Line 5: Import mongoose so we can connect/disconnect
// the test database at the start and end of tests.
const mongoose = require("mongoose");

// Line 8: Import the Express app. Note: we export 'app'
// from server/index.js without calling app.listen() in test
// mode — supertest handles that internally.
const app = require("../index");

// Line 12: Import the Task model to seed test data
// and clean up the database between tests.
const Task = require("../models/Task");

// ============================================================
// beforeAll: Runs ONCE before all tests start.
// Connects to a separate TEST database so we don't
// accidentally modify real data during testing.
// ============================================================
beforeAll(async () => {
  // Use a separate test database — "todoapp_test"
  // This keeps test data completely separate from real data.
  await mongoose.connect("mongodb://localhost:27017/todoapp_test");
});

// ============================================================
// afterEach: Runs after EACH individual test.
// Clears all tasks from the test database so each test
// starts with a clean slate — tests don't affect each other.
// ============================================================
afterEach(async () => {
  await Task.deleteMany({});
});

// ============================================================
// afterAll: Runs ONCE after all tests finish.
// Closes the database connection so Jest can exit cleanly.
// Without this, Jest hangs and never finishes.
// ============================================================
afterAll(async () => {
  await mongoose.connection.close();
});

// ============================================================
// TEST SUITE 1: GET /api/tasks
// describe() groups related tests together under one label.
// ============================================================
describe("GET /api/tasks", () => {

  // it() defines a single test. The string describes
  // what the test is checking.
  it("should return an empty array when no tasks exist", async () => {
    // request(app).get() makes a GET request to /api/tasks.
    // .expect(200) asserts the response status is 200 (OK).
    const res = await request(app).get("/api/tasks").expect(200);

    // expect() is Jest's assertion function.
    // .toEqual([]) checks the response body is an empty array.
    expect(res.body).toEqual([]);
  });

  it("should return all tasks in the database", async () => {
    // Seed the test database with two tasks before testing.
    // Task.create() is shorthand for new Task().save()
    await Task.create([
      { text: "Buy groceries", completed: false },
      { text: "Do laundry",    completed: true  },
    ]);

    const res = await request(app).get("/api/tasks").expect(200);

    // Check that exactly 2 tasks were returned.
    expect(res.body.length).toBe(2);

    // Check the first task has the right text.
    expect(res.body[0].text).toBe("Buy groceries");
  });
});

// ============================================================
// TEST SUITE 2: POST /api/tasks
// ============================================================
describe("POST /api/tasks", () => {

  it("should create a new task and return 201", async () => {
    // .post() sends a POST request.
    // .send() attaches a JSON body to the request.
    const res = await request(app)
      .post("/api/tasks")
      .send({
        text: "Walk the dog",
        dueDate: "2026-05-28",
        dueTime: "08:00",
        notes: "Take the long route",
      })
      .expect(201); // 201 = Created

    // Check the returned task has the text we sent.
    expect(res.body.text).toBe("Walk the dog");

    // Check MongoDB assigned an _id (it always does on save).
    expect(res.body._id).toBeDefined();

    // Check completed defaults to false for new tasks.
    expect(res.body.completed).toBe(false);
  });

  it("should return 400 if task title is empty", async () => {
    // Sending an empty text should be rejected.
    await request(app)
      .post("/api/tasks")
      .send({ text: "" })
      .expect(400); // 400 = Bad Request
  });

  it("should return 400 if task title is only spaces", async () => {
    // "   ".trim() is "" — should also be rejected.
    await request(app)
      .post("/api/tasks")
      .send({ text: "   " })
      .expect(400);
  });

  it("should trim whitespace from task title", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .send({ text: "  Clean the kitchen  " })
      .expect(201);

    // The saved text should have no leading/trailing spaces.
    expect(res.body.text).toBe("Clean the kitchen");
  });
});

// ============================================================
// TEST SUITE 3: PUT /api/tasks/:id
// ============================================================
describe("PUT /api/tasks/:id", () => {

  it("should toggle a task to completed", async () => {
    // Create a task to update.
    const task = await Task.create({ text: "Read a book", completed: false });

    // Send PUT request with completed: true
    const res = await request(app)
      .put(`/api/tasks/${task._id}`)
      .send({ completed: true })
      .expect(200);

    // Check the response shows completed: true
    expect(res.body.completed).toBe(true);
  });

  it("should update task text", async () => {
    const task = await Task.create({ text: "Old title" });

    const res = await request(app)
      .put(`/api/tasks/${task._id}`)
      .send({ text: "New title" })
      .expect(200);

    expect(res.body.text).toBe("New title");
  });

  it("should return 404 for a non-existent task ID", async () => {
    // Generate a valid but non-existent MongoDB ObjectId.
    const fakeId = new mongoose.Types.ObjectId();

    await request(app)
      .put(`/api/tasks/${fakeId}`)
      .send({ completed: true })
      .expect(404); // 404 = Not Found
  });
});

// ============================================================
// TEST SUITE 4: DELETE /api/tasks/:id
// ============================================================
describe("DELETE /api/tasks/:id", () => {

  it("should delete a task and return success message", async () => {
    const task = await Task.create({ text: "Task to delete" });

    const res = await request(app)
      .delete(`/api/tasks/${task._id}`)
      .expect(200);

    // Check the success message was returned.
    expect(res.body.message).toBe("Task deleted successfully");

    // Verify the task is actually gone from the database.
    // Task.findById() returns null if not found.
    const deleted = await Task.findById(task._id);
    expect(deleted).toBeNull();
  });

  it("should return 404 when deleting non-existent task", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    await request(app)
      .delete(`/api/tasks/${fakeId}`)
      .expect(404);
  });
});

// ============================================================
// TEST SUITE 5: EDGE CASES
// ============================================================
describe("Edge Cases", () => {

  it("should create task with no due date or time", async () => {
    // Due date and time are optional — this should succeed.
    const res = await request(app)
      .post("/api/tasks")
      .send({ text: "Flexible task" })
      .expect(201);

    // dueDate and dueTime should be undefined/null
    expect(res.body.dueDate).toBeUndefined();
    expect(res.body.dueTime).toBeUndefined();
  });

  it("should default completed to false", async () => {
    // Even if we don't send completed, it should be false.
    const res = await request(app)
      .post("/api/tasks")
      .send({ text: "New task" })
      .expect(201);

    expect(res.body.completed).toBe(false);
  });
});
