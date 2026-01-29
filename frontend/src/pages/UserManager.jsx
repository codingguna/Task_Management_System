import { useEffect, useState } from "react";
import api from "../services/api";
import CreateUserModal from "./CreateUserModal";
import toast from "react-hot-toast";

const roleStyle = {
  admin: "bg-purple-100 text-purple-700",
  member: "bg-blue-100 text-blue-700",
};

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  const loadUsers = async () => {
  try {
    const res = await api.get("/admin/users");
    console.log(res.data);
    setUsers(res.data);
  } catch {
    toast.error("Failed to load users");
  }
};

  useEffect(() => {
    loadUsers();
  }, []);

  const createUser = async (data) => {
  try {
    await api.post("/admin/users", data);
    toast.success("User created successfully");
    loadUsers();
  } catch (err) {
    toast.error(err.response?.data?.message || "User creation failed");
  }
};


  const deleteUser = async (id) => {
  if (!window.confirm("Delete this user?")) return;

  try {
    await api.delete(`/admin/users/${id}`);
    toast.success("User deleted");
    loadUsers();
  } catch {
    toast.error("Failed to delete user");
  }
};


  return (
    <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-800">
          👥 User Management
        </h2>

        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
        >
          + Create User
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-left text-slate-500">
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="bg-white shadow-sm rounded-xl">
                <td className="p-3 font-medium">{user.name}</td>
                <td className="p-3 text-slate-600">{user.email}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      roleStyle[user.role]
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="text-center text-slate-500 mt-6">
            No users found
          </p>
        )}
      </div>

      {/* Create User Modal */}
      <CreateUserModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={createUser}
      />
    </div>
  );
};

export default UserManager;
