import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

const CreateTaskModal = ({ open, onClose, onCreated }) => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
  });

  useEffect(() => {
    if (open) {
      api.get("/admin/users").then((res) => setUsers(res.data));
    }
  }, [open]);

  if (!open) return null;

  const submit = async () => {
    if (!form.title || !form.assignedTo) {
      toast.error("Title and Assignee are required");
      return;
    }

    try {
      await api.post("/tasks", form);
      toast.success("Task created");
      onCreated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Task creation failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">➕ Create Task</h2>

        <div className="space-y-4">
          <input
            placeholder="Task Title"
            className="w-full px-4 py-2 border rounded-lg"
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <textarea
            placeholder="Description (optional)"
            className="w-full px-4 py-2 border rounded-lg"
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <select
            className="w-full px-4 py-2 border rounded-lg"
            onChange={(e) =>
              setForm({ ...form, assignedTo: e.target.value })
            }
          >
            <option value="">Assign to user</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
