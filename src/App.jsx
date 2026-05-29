import { useState, useEffect } from "react";

const ICONS = ["🛒","🏠","💼","📚","🏃","🍽️","💊","🎯","🔧","🎨","🐾","💻","🌿","📞","✈️"];
const getIcon = () => ICONS[Math.floor(Math.random() * ICONS.length)];

const getTodayDate = () => new Date().toISOString().split("T")[0];
const getCurrentTime = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
};
const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(m)-1]} ${parseInt(d)}, ${y}`;
};
const formatDisplayTime = (timeStr) => {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const a = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2,"0")} ${a}`;
};
const getHeaderDate = () =>
  new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const S = {
  // Layout
  body: {
    fontFamily: "'Nunito', sans-serif",
    background: "#f0eeff",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  app: {
    width: "100%",
    maxWidth: 420,
    background: "#fff",
    borderRadius: 28,
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(108,63,207,0.18)",
    minHeight: "92vh",
    display: "flex",
    flexDirection: "column",
  },

  // ── Greeting ──
  greeting: {
    background: "linear-gradient(160deg,#6c3fcf 0%,#8b5cf6 100%)",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 30px",
    color: "#fff",
    textAlign: "center",
  },
  greetingInput: {
    width: "100%",
    padding: "14px 18px",
    borderRadius: 16,
    border: "none",
    fontSize: 16,
    fontFamily: "'Nunito',sans-serif",
    fontWeight: 600,
    outline: "none",
    textAlign: "center",
    background: "rgba(255,255,255,0.95)",
    color: "#1e1b4b",
    marginTop: 32,
  },
  greetingBtn: (disabled) => ({
    marginTop: 14,
    width: "100%",
    padding: "14px",
    borderRadius: 16,
    border: "none",
    background: disabled ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.25)",
    color: disabled ? "rgba(255,255,255,0.5)" : "#fff",
    fontSize: 16,
    fontWeight: 700,
    fontFamily: "'Nunito',sans-serif",
    cursor: disabled ? "not-allowed" : "pointer",
  }),

  // ── Header ──
  header: {
    background: "linear-gradient(135deg,#6c3fcf 0%,#8b5cf6 100%)",
    padding: "24px 20px 44px",
    color: "#fff",
    position: "relative",
    flexShrink: 0,
  },
  headerDate:    { fontSize: 12, opacity: 0.7, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 },
  headerTitle:   { fontSize: 26, fontWeight: 800 },
  headerWelcome: { fontSize: 13, opacity: 0.85, fontWeight: 600, marginTop: 4 },
  headerCount: {
    position: "absolute", top: 20, right: 20,
    background: "rgba(255,255,255,0.2)",
    borderRadius: 20, padding: "6px 14px",
    fontSize: 13, fontWeight: 700,
  },

  // ── Content ──
  content: {
    flex: 1,
    padding: "0 16px 90px",
    marginTop: -20,
    borderRadius: "20px 20px 0 0",
    background: "#fff",
    overflowY: "auto",
  },

  // ── Filter tabs ──
  filterRow: { display: "flex", gap: 8, padding: "16px 0 10px", overflowX: "auto" },
  filterTab: (active) => ({
    flexShrink: 0,
    padding: "7px 18px",
    borderRadius: 20,
    border: active ? "2px solid #6c3fcf" : "2px solid #ddd6fe",
    background: active ? "#6c3fcf" : "#fff",
    color: active ? "#fff" : "#6b7280",
    fontSize: 13, fontWeight: 700,
    fontFamily: "'Nunito',sans-serif",
    cursor: "pointer",
  }),

  sectionLabel: {
    fontSize: 12, fontWeight: 800, color: "#9ca3af",
    letterSpacing: 1, textTransform: "uppercase", padding: "8px 0 10px",
  },

  // ── Task card ──
  taskItem: (completed) => ({
    display: "flex", alignItems: "flex-start", gap: 12,
    background: completed ? "#f3f4f6" : "#ede9fe",
    borderRadius: 18, padding: "13px 14px", marginBottom: 10,
    opacity: completed ? 0.8 : 1, position: "relative",
  }),
  taskIcon: (completed) => ({
    width: 42, height: 42, borderRadius: "50%",
    background: completed ? "#e5e7eb" : "#ddd6fe",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 20, flexShrink: 0, marginTop: 2,
  }),
  taskBody: { flex: 1, minWidth: 0 },
  taskTitle: (completed) => ({
    fontSize: 15, fontWeight: 700,
    color: completed ? "#9ca3af" : "#1e1b4b",
    textDecoration: completed ? "line-through" : "none",
    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
  }),
  taskMeta: { fontSize: 12, color: "#a78bfa", fontWeight: 700, marginTop: 3 },
  taskMetaCompleted: { fontSize: 12, color: "#9ca3af", fontWeight: 600, marginTop: 3 },
  taskAdded: { fontSize: 11, color: "#c4b5fd", fontWeight: 600, marginTop: 1 },
  taskCheck: (checked) => ({
    width: 24, height: 24, borderRadius: 6,
    border: checked ? "2.5px solid #6c3fcf" : "2.5px solid #a78bfa",
    background: checked ? "#6c3fcf" : "transparent",
    cursor: "pointer", flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, color: "#fff", fontWeight: 800,
    marginTop: 2,
  }),
  taskBtn: (color) => ({
    width: 28, height: 28, borderRadius: "50%", border: "none",
    background: color === "red" ? "rgba(239,68,68,0.12)" : "rgba(108,63,207,0.12)",
    color: color === "red" ? "#ef4444" : "#6c3fcf",
    cursor: "pointer", fontSize: 14,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, marginTop: 2,
  }),

  // ── Done banner ──
  doneBanner: {
    background: "linear-gradient(135deg,#10b981,#059669)",
    borderRadius: 18, padding: 20,
    textAlign: "center", color: "#fff", margin: "8px 0",
  },

  emptyState: { textAlign: "center", padding: "32px 20px", color: "#9ca3af" },

  clearBtn: {
    width: "100%", padding: 11, borderRadius: 14, border: "none",
    background: "rgba(239,68,68,0.08)", color: "#ef4444",
    fontSize: 13, fontWeight: 700, fontFamily: "'Nunito',sans-serif",
    cursor: "pointer", marginTop: 6,
  },

  // ── Bottom bar ──
  bottomBar: {
    position: "sticky", bottom: 0,
    background: "#fff", borderTop: "1px solid #f3f4f6",
    padding: "12px 16px", display: "flex", gap: 10,
  },
  addBtn: {
    width: "100%", padding: "13px",
    borderRadius: 14, border: "none",
    background: "#6c3fcf", color: "#fff",
    fontSize: 15, fontWeight: 800,
    fontFamily: "'Nunito',sans-serif", cursor: "pointer",
  },

  // ── Modal shared ──
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(30,27,75,0.5)",
    display: "flex", alignItems: "center",
    justifyContent: "center", zIndex: 100, padding: 20,
  },
  modal: {
    background: "#fff", borderRadius: 24,
    padding: "24px 20px", width: "100%", maxWidth: 370,
    maxHeight: "90vh", overflowY: "auto",
  },
  modalTitle: { fontSize: 18, fontWeight: 800, color: "#1e1b4b", marginBottom: 20 },

  // form field label
  fieldLabel: {
    display: "block", fontSize: 12, fontWeight: 800,
    color: "#6c3fcf", letterSpacing: .5,
    textTransform: "uppercase", marginBottom: 6,
  },
  fieldInput: {
    width: "100%", padding: "12px 14px",
    borderRadius: 12, border: "2px solid #ddd6fe",
    fontSize: 14, fontFamily: "'Nunito',sans-serif",
    fontWeight: 600, color: "#1e1b4b",
    outline: "none", background: "#f5f3ff",
    boxSizing: "border-box",
  },
  fieldRow: { display: "flex", gap: 10 },
  fieldGroup: (flex) => ({ flex: flex || 1, marginBottom: 16 }),

  modalBtns: { display: "flex", gap: 10, marginTop: 4 },
  modalCancel: {
    flex: 1, padding: 12, borderRadius: 14,
    border: "2px solid #ddd6fe", background: "#fff",
    color: "#6b7280", fontSize: 14, fontWeight: 700,
    fontFamily: "'Nunito',sans-serif", cursor: "pointer",
  },
  modalSave: {
    flex: 1, padding: 12, borderRadius: 14, border: "none",
    background: "#6c3fcf", color: "#fff",
    fontSize: 14, fontWeight: 800,
    fontFamily: "'Nunito',sans-serif", cursor: "pointer",
  },

  // overdue badge
  overdueBadge: {
    display: "inline-block",
    background: "rgba(239,68,68,0.12)",
    color: "#ef4444",
    fontSize: 10, fontWeight: 800,
    borderRadius: 6, padding: "2px 7px",
    marginLeft: 6, verticalAlign: "middle",
    letterSpacing: .3,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function isOverdue(task) {
  if (task.completed || !task.dueDate) return false;
  const now = new Date();
  const due = new Date(`${task.dueDate}T${task.dueTime || "23:59"}`);
  return due < now;
}

// ─────────────────────────────────────────────────────────────────────────────
// TaskItem
// ─────────────────────────────────────────────────────────────────────────────
function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [hovered, setHovered] = useState(false);
  const overdue = isOverdue(task);

  return (
    <div
      style={S.taskItem(task.completed)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={S.taskIcon(task.completed)}>{task.icon}</div>

      <div style={S.taskBody}>
        <div style={S.taskTitle(task.completed)}>
          {task.text}
          {overdue && <span style={S.overdueBadge}>OVERDUE</span>}
        </div>

        {/* Due date/time */}
        {task.dueDate && (
          <div style={task.completed ? S.taskMetaCompleted : S.taskMeta}>
            📅 {formatDisplayDate(task.dueDate)}
            {task.dueTime && <span>  🕐 {formatDisplayTime(task.dueTime)}</span>}
          </div>
        )}

        {/* Added at time */}
        <div style={task.completed ? { ...S.taskAdded, color: "#9ca3af" } : S.taskAdded}>
          Added {task.addedTime}
        </div>
      </div>

      {/* Action buttons (visible on hover) */}
      {hovered && !task.completed && (
        <button style={S.taskBtn("purple")} onClick={() => onEdit(task)} title="Edit">✏️</button>
      )}
      <div
        style={S.taskCheck(task.completed)}
        onClick={() => onToggle(task.id)}
        title={task.completed ? "Mark incomplete" : "Mark complete"}
      >
        {task.completed && "✓"}
      </div>
      {hovered && (
        <button style={S.taskBtn("red")} onClick={() => onDelete(task.id)} title="Delete">✕</button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AddTaskModal  — title + date + time + notes
// ─────────────────────────────────────────────────────────────────────────────
function AddTaskModal({ onClose, onSave }) {
  const [text, setText]         = useState("");
  const [dueDate, setDueDate]   = useState(getTodayDate());
  const [dueTime, setDueTime]   = useState(getCurrentTime());
  const [notes, setNotes]       = useState("");
  const [error, setError]       = useState("");

  const handleSave = () => {
    if (!text.trim()) { setError("Please enter a task title."); return; }
    onSave({ text: text.trim(), dueDate, dueTime, notes: notes.trim() });
  };

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        <div style={S.modalTitle}>📝 Add New Task</div>

        {/* Task title */}
        <div style={S.fieldGroup()}>
          <label style={S.fieldLabel}>Task Title</label>
          <input
            style={{ ...S.fieldInput, borderColor: error ? "#ef4444" : "#ddd6fe" }}
            placeholder="What do you need to do?"
            value={text}
            onChange={e => { setText(e.target.value); setError(""); }}
            onKeyPress={e => e.key === "Enter" && handleSave()}
            maxLength={80}
            autoFocus
          />
          {error && <div style={{ fontSize: 12, color: "#ef4444", marginTop: 4, fontWeight: 600 }}>{error}</div>}
        </div>

        {/* Date + Time row */}
        <div style={S.fieldRow}>
          <div style={S.fieldGroup()}>
            <label style={S.fieldLabel}>📅 Date</label>
            <input
              style={S.fieldInput}
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
          </div>
          <div style={S.fieldGroup()}>
            <label style={S.fieldLabel}>🕐 Time</label>
            <input
              style={S.fieldInput}
              type="time"
              value={dueTime}
              onChange={e => setDueTime(e.target.value)}
            />
          </div>
        </div>

        {/* Notes */}
        <div style={S.fieldGroup()}>
          <label style={S.fieldLabel}>Notes (optional)</label>
          <textarea
            style={{ ...S.fieldInput, resize: "vertical", minHeight: 72, lineHeight: 1.5 }}
            placeholder="Any extra details..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            maxLength={200}
          />
        </div>

        <div style={S.modalBtns}>
          <button style={S.modalCancel} onClick={onClose}>Cancel</button>
          <button style={S.modalSave} onClick={handleSave}>Save Task</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EditTaskModal — same fields, pre-filled
// ─────────────────────────────────────────────────────────────────────────────
function EditTaskModal({ task, onClose, onSave }) {
  const [text, setText]       = useState(task.text);
  const [dueDate, setDueDate] = useState(task.dueDate || getTodayDate());
  const [dueTime, setDueTime] = useState(task.dueTime || getCurrentTime());
  const [notes, setNotes]     = useState(task.notes || "");
  const [error, setError]     = useState("");

  const handleSave = () => {
    if (!text.trim()) { setError("Please enter a task title."); return; }
    onSave({ text: text.trim(), dueDate, dueTime, notes: notes.trim() });
  };

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        <div style={S.modalTitle}>✏️ Edit Task</div>

        <div style={S.fieldGroup()}>
          <label style={S.fieldLabel}>Task Title</label>
          <input
            style={{ ...S.fieldInput, borderColor: error ? "#ef4444" : "#ddd6fe" }}
            value={text}
            onChange={e => { setText(e.target.value); setError(""); }}
            onKeyPress={e => e.key === "Enter" && handleSave()}
            maxLength={80}
            autoFocus
          />
          {error && <div style={{ fontSize: 12, color: "#ef4444", marginTop: 4, fontWeight: 600 }}>{error}</div>}
        </div>

        <div style={S.fieldRow}>
          <div style={S.fieldGroup()}>
            <label style={S.fieldLabel}>📅 Date</label>
            <input style={S.fieldInput} type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          </div>
          <div style={S.fieldGroup()}>
            <label style={S.fieldLabel}>🕐 Time</label>
            <input style={S.fieldInput} type="time" value={dueTime} onChange={e => setDueTime(e.target.value)} />
          </div>
        </div>

        <div style={S.fieldGroup()}>
          <label style={S.fieldLabel}>Notes (optional)</label>
          <textarea
            style={{ ...S.fieldInput, resize: "vertical", minHeight: 72, lineHeight: 1.5 }}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            maxLength={200}
          />
        </div>

        <div style={S.modalBtns}>
          <button style={S.modalCancel} onClick={onClose}>Cancel</button>
          <button style={S.modalSave} onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LeaveModal
// ─────────────────────────────────────────────────────────────────────────────
function LeaveModal({ onStay, onLeave }) {
  return (
    <div style={S.overlay}>
      <div style={S.modal}>
        <div style={{ fontSize: 42, textAlign: "center", marginBottom: 12 }}>⚠️</div>
        <div style={{ textAlign: "center", fontSize: 17, fontWeight: 800, color: "#1e1b4b", marginBottom: 8 }}>
          Wait — you have unfinished tasks!
        </div>
        <div style={{ textAlign: "center", fontSize: 14, color: "#6b7280", fontWeight: 600, marginBottom: 20 }}>
          Are you sure you want to leave without completing them?
        </div>
        <div style={S.modalBtns}>
          <button style={S.modalSave} onClick={onStay}>Stay & Finish</button>
          <button style={S.modalCancel} onClick={onLeave}>Leave Anyway</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main App
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  // ── Load from localStorage on first render ──────────────────────────────
  // Instead of starting with an empty array, we check localStorage first.
  // If tasks were saved before, we load them. If not, we start with [].
  // JSON.parse converts the saved string back into a JavaScript array.
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  // Same for userName — if the user already entered their name before,
  // we skip the greeting screen and go straight to the main app.
  const [screen, setScreen] = useState(() => {
    const savedName = localStorage.getItem("userName");
    return savedName ? "main" : "greeting";
  });

  const [userName, setUserName] = useState(() => {
    return localStorage.getItem("userName") || "";
  });

  const [filter, setFilter]       = useState("all");
  const [showAdd, setShowAdd]     = useState(false);
  const [editTask, setEditTask]   = useState(null);
  const [showLeave, setShowLeave] = useState(false);

  // ── Save tasks to localStorage every time they change ───────────────────
  // useEffect watches the tasks array. Every time a task is added,
  // deleted, toggled or edited, this runs and saves the updated
  // list to localStorage. JSON.stringify converts the array to a string
  // because localStorage can only store strings, not arrays or objects.
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // ── Save userName to localStorage when it is set ────────────────────────
  // Every time userName changes we save it. This means next time
  // the user opens the app their name is remembered and they go
  // straight to the main screen skipping the greeting.
  useEffect(() => {
    if (userName) {
      localStorage.setItem("userName", userName);
    }
  }, [userName]);

  // Browser tab close warning
  useEffect(() => {
    const handler = (e) => {
      if (tasks.some(t => !t.completed)) {
        e.preventDefault();
        e.returnValue = "You have unfinished tasks!";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [tasks]);

  // ── Actions ──────────────────────────────────────────────────────────────
  const startApp = () => { if (userName.trim()) setScreen("main"); };

  // resetApp clears everything from localStorage and sends the user
  // back to the greeting screen. Useful if someone else wants to
  // use the app or the user wants to start fresh.
  const resetApp = () => {
    localStorage.removeItem("tasks");
    localStorage.removeItem("userName");
    setTasks([]);
    setUserName("");
    setScreen("greeting");
  };

  const addTask = ({ text, dueDate, dueTime, notes }) => {
    setTasks(prev => [...prev, {
      id: Date.now(),
      text,
      dueDate,
      dueTime,
      notes,
      completed: false,
      addedTime: formatDisplayTime(getCurrentTime()),
      icon: getIcon(),
    }]);
    setShowAdd(false);
  };

  const saveEdit = ({ text, dueDate, dueTime, notes }) => {
    setTasks(prev => prev.map(t =>
      t.id === editTask.id ? { ...t, text, dueDate, dueTime, notes } : t
    ));
    setEditTask(null);
  };

  const toggleTask  = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const deleteTask  = (id) => setTasks(prev => prev.filter(t => t.id !== id));
  const clearCompleted = () => setTasks(prev => prev.filter(t => !t.completed));

  // ── Derived ──────────────────────────────────────────────────────────────
  const active          = tasks.filter(t => !t.completed);
  const completed       = tasks.filter(t =>  t.completed);
  const allDone         = tasks.length > 0 && active.length === 0;
  const visibleActive   = filter === "completed" ? [] : active;
  const visibleCompleted = filter === "active"   ? [] : completed;

  // ── Greeting Screen ───────────────────────────────────────────────────────
  if (screen === "greeting") {
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <div style={S.body}>
          <div style={S.app}>
            <div style={S.greeting}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>👋</div>
              <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Welcome!</div>
              <div style={{ fontSize: 14, opacity: 0.8, fontWeight: 600 }}>
                What's your name? Let's get things done.
              </div>
              <input
                style={S.greetingInput}
                type="text"
                placeholder="Enter your name..."
                value={userName}
                onChange={e => setUserName(e.target.value)}
                onKeyPress={e => e.key === "Enter" && startApp()}
                maxLength={30}
                autoFocus
              />
              <button
                style={S.greetingBtn(!userName.trim())}
                onClick={startApp}
                disabled={!userName.trim()}
              >
                Let's Go →
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Main Screen ───────────────────────────────────────────────────────────
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <div style={S.body}>
        <div style={S.app}>

          {/* Header */}
          <div style={S.header}>
            <div style={S.headerDate}>{getHeaderDate()}</div>
            <div style={S.headerTitle}>My Todo List</div>
            <div style={S.headerWelcome}>Hi {userName}, what are we working on today?</div>
            {/* Switch user button — clears localStorage and goes back to greeting */}
            <div
              onClick={resetApp}
              title="Switch user"
              style={{ position:"absolute", bottom:12, right:20, background:"rgba(255,255,255,0.15)", borderRadius:20, padding:"4px 12px", fontSize:11, fontWeight:700, cursor:"pointer", color:"rgba(255,255,255,0.7)" }}
            >
              ↩ Switch User
            </div>
            <div style={S.headerCount}>
              {active.length === 1 ? "1 remaining" : `${active.length} remaining`}
            </div>
          </div>

          {/* Content */}
          <div style={S.content}>

            {/* Filter tabs */}
            <div style={S.filterRow}>
              {["all","active","completed"].map(f => (
                <button key={f} style={S.filterTab(filter === f)} onClick={() => setFilter(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* All-done banner */}
            {allDone && (
              <div style={S.doneBanner}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
                <div style={{ fontSize: 17, fontWeight: 800 }}>You're done for today!</div>
                <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>
                  Great job, {userName}! Everything is checked off.
                </div>
              </div>
            )}

            {/* Active tasks */}
            {filter !== "completed" && (
              <>
                <div style={S.sectionLabel}>Tasks</div>
                {visibleActive.length === 0 && !allDone ? (
                  <div style={S.emptyState}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>No active tasks — tap "Add New Task"!</div>
                  </div>
                ) : (
                  visibleActive.map(t => (
                    <TaskItem key={t.id} task={t} onToggle={toggleTask} onDelete={deleteTask} onEdit={setEditTask} />
                  ))
                )}
              </>
            )}

            {/* Completed tasks */}
            {filter !== "active" && (
              <>
                <div style={{ ...S.sectionLabel, marginTop: 8 }}>Completed</div>
                {visibleCompleted.length === 0 ? (
                  <div style={S.emptyState}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>📋</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>No completed tasks yet</div>
                  </div>
                ) : (
                  <>
                    {visibleCompleted.map(t => (
                      <TaskItem key={t.id} task={t} onToggle={toggleTask} onDelete={deleteTask} onEdit={setEditTask} />
                    ))}
                    <button style={S.clearBtn} onClick={clearCompleted}>🗑 Clear all completed</button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Bottom bar */}
          <div style={S.bottomBar}>
            <button style={S.addBtn} onClick={() => setShowAdd(true)}>
              + Add New Task
            </button>
          </div>
        </div>

        {/* Modals */}
        {showAdd  && <AddTaskModal  onClose={() => setShowAdd(false)} onSave={addTask} />}
        {editTask && <EditTaskModal task={editTask} onClose={() => setEditTask(null)} onSave={saveEdit} />}
        {showLeave && (
          <LeaveModal
            onStay={() => setShowLeave(false)}
            onLeave={() => { setShowLeave(false); setScreen("greeting"); }}
          />
        )}
      </div>
    </>
  );
}
