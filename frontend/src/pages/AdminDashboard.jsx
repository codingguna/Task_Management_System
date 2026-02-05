import { useState , useEffect} from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCards from "../components/StatCards";
import TaskManager from "./TaskManager";
import UserManager from "./UserManager";
import socket from "../services/socket";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("tasks");
  useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  socket.connect();
  socket.emit("register", user.id);

  socket.on("task_completion_request", data => {
    toast(`🔔 Completion requested: ${data.title}`);
    TaskManager.loadTasks();
  });

  return () => {
    socket.off("task_completion_request");
    socket.disconnect();
  };
}, []);


  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <div className="p-6 space-y-6">
          <StatCards />

          {activeTab === "tasks" ? <TaskManager /> : <UserManager />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
