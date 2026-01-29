import React, { useEffect, useState, useMemo } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import Topbar from "./Topbar";

const statusStyle = {
  pending: "bg-gray-100 text-gray-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  completed_request: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
};

const StatCard = ({ title, value, gradient }) => (
  <div
    className={`p-5 rounded-2xl text-white shadow-lg bg-gradient-to-r ${gradient}`}
  >
    <p className="opacity-90">{title}</p>
    <h2 className="text-3xl font-bold mt-2">{value}</h2>
  </div>
);

const MemberDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      const res = await api.get("/tasks/my");
      setTasks(res.data);
    } catch {
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const requestCompletion = async (id) => {
    try {
      await api.put(`/tasks/${id}/status`, {
        status: "completed_request",
      });
      toast.success("Completion request sent");
      fetchMyTasks();
    } catch {
      toast.error("Failed to update task");
    }
  };

  /* 📊 FRONTEND-ONLY STATS */
  const stats = useMemo(() => {
    return {
      total: tasks.length,
      completed: tasks.filter((t) => t.status === "completed").length,
      pending: tasks.filter((t) =>
        ["pending", "in_progress"].includes(t.status)
      ).length,
      requested: tasks.filter((t) => t.status === "completed_request").length,
    };
  }, [tasks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      {/* SAME TOPBAR */}
      <Topbar title="My Dashboard" />

      <div className="p-6 space-y-6">
        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            title="Total Tasks"
            value={stats.total}
            gradient="from-indigo-500 to-purple-600"
          />
          <StatCard
            title="Pending Tasks"
            value={stats.pending}
            gradient="from-yellow-400 to-orange-500"
          />
          <StatCard
            title="Completed"
            value={stats.completed}
            gradient="from-green-500 to-emerald-600"
          />
          <StatCard
            title="Awaiting Approval"
            value={stats.requested}
            gradient="from-blue-500 to-sky-600"
          />
        </div>

        {/* TASK LIST */}
        {loading ? (
          <p className="text-center text-slate-500">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="text-center text-slate-500 bg-white rounded-xl p-8 shadow">
            No tasks assigned yet
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 flex flex-col gap-4"
              >
                {/* Title + Status */}
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-slate-800">
                    {task.title}
                  </h3>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      statusStyle[task.status]
                    }`}
                  >
                    {task.status.replace("_", " ")}
                  </span>
                </div>

                {/* Description */}
                {task.description && (
                  <p className="text-sm text-slate-600">
                    {task.description}
                  </p>
                )}

                {/* Actions */}
                <div className="mt-auto">
                  {task.status === "completed" ? (
                    <div className="text-green-600 font-medium">
                      ✅ Approved by Admin
                    </div>
                  ) : task.status === "completed_request" ? (
                    <div className="text-blue-600 font-medium">
                      ⏳ Waiting for admin approval
                    </div>
                  ) : (
                    <button
                      onClick={() => requestCompletion(task._id)}
                      className="w-full py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                    >
                      Request Completion
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDashboard;
