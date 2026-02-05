import { useEffect, useState } from "react";
import api from "../services/api";

const StatCards = () => {
  const [stats, setStats] = useState({ users: 0, tasks: 0, completed: 0 });

  useEffect(() => {
    api.get("/admin/stats").then(res => setStats(res.data));
  }, []);

  const Card = ({ title, value }) => (
    <div className="bg-white p-5 rounded-xl shadow">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold">{value}</h2>
    </div>
  );

  return (
    <div className="grid grid-cols-3 gap-6">
      <Card title="Total Users" value={stats.users} />
      <Card title="Total Tasks" value={stats.tasks} />
      <Card title="Completed Tasks" value={stats.completed} />
    </div>
  );
};

export default StatCards;
