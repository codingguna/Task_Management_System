import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import TaskCard from "./TaskCard";
import CreateTaskModal from "./CreateTaskModal";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  const loadTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch {
      toast.error("Failed to load tasks");
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const approveTask = async (id) => {
    try {
      await api.put(`/tasks/${id}/approve`);
      toast.success("Task approved");
      loadTasks();
    } catch {
      toast.error("Approval failed");
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await api.delete(`/tasks/${id}`);
      toast.success("Task deleted");
      loadTasks();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">📋 Task Management</h2>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
        >
          + Create Task
        </button>
      </div>

      {/* Content */}
      {tasks.length === 0 ? (
        <p className="text-center text-slate-500">No tasks found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onApprove={approveTask}
              onDelete={deleteTask}
            />
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={loadTasks}
      />
    </div>
  );
};

export default TaskManager;
