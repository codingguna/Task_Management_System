import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import StatCards from "./StatCards";
import TaskManager from "./TaskManager";
import UserManager from "./UserManager";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("tasks");

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
