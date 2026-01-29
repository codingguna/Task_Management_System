import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Topbar = ({ title = "Dashboard" }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  return (
    <div className="bg-white/80 backdrop-blur border-b px-6 py-4 flex justify-between items-center shadow-sm">
      <h1 className="text-xl font-semibold text-slate-700">
        {title}
      </h1>

      <button
        onClick={handleLogout}
        className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Topbar;
