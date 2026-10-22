import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAdminUsersApi } from "../../services/adminService";

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await getAdminUsersApi();
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold">Manage Users</h1>

      <div className="glass rounded-xl p-6">
        {users.length === 0 ? (
          <p className="text-white/60">No users found.</p>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user._id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-cyan-300">{user.name}</p>
                <p className="text-white/70">Mobile: {user.mobile}</p>
                <p className="text-white/60">Role: {user.role}</p>
                <p className="text-white/60">Verified: {user.isVerified ? "Yes" : "No"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsersPage;