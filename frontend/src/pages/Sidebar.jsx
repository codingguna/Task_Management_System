const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-64 bg-gradient-to-b from-indigo-600 to-purple-700 text-white shadow-xl">
      <div className="p-6 text-2xl font-bold tracking-wide">
        🚀 Admin Panel
      </div>

      <nav className="px-4 space-y-2">
        <button
          onClick={() => setActiveTab("tasks")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition
            ${
              activeTab === "tasks"
                ? "bg-white/20"
                : "hover:bg-white/10"
            }`}
        >
          📋 Tasks
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition
            ${
              activeTab === "users"
                ? "bg-white/20"
                : "hover:bg-white/10"
            }`}
        >
          👤 Users
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
