import { useEffect, useState } from "react";
import api from "../api/axios";
import AdminNav from "../components/AdminNav";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <AdminNav />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-2">
          Users
        </h1>

        <p className="text-zinc-400 mb-8">
          Manage registered users.
        </p>

        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-zinc-800 border border-zinc-700 rounded-xl p-5 flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{user.name}</h2>
                <p className="text-zinc-400 text-sm">{user.email}</p>
              </div>

              <span className="px-3 py-1 rounded-full bg-zinc-700 text-sm capitalize">
                {user.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;