import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAdminDashboardApi } from "../../services/adminService";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  const fetchDashboard = async () => {
    try {
      const res = await getAdminDashboardApi();
      setDashboard(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load admin dashboard");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const stats = dashboard?.stats || {};
  const recentBookings = dashboard?.recentBookings || [];

  return (
    <div className="px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="glass rounded-xl p-5">
          <p className="text-white/60">Total Users</p>
          <h2 className="mt-2 text-3xl font-bold text-cyan-300">{stats.totalUsers || 0}</h2>
        </div>

        <div className="glass rounded-xl p-5">
          <p className="text-white/60">Total Trains</p>
          <h2 className="mt-2 text-3xl font-bold text-cyan-300">{stats.totalTrains || 0}</h2>
        </div>

        <div className="glass rounded-xl p-5">
          <p className="text-white/60">Total Bookings</p>
          <h2 className="mt-2 text-3xl font-bold text-cyan-300">{stats.totalBookings || 0}</h2>
        </div>

        <div className="glass rounded-xl p-5">
          <p className="text-white/60">Confirmed Bookings</p>
          <h2 className="mt-2 text-3xl font-bold text-emerald-300">{stats.confirmedBookings || 0}</h2>
        </div>

        <div className="glass rounded-xl p-5">
          <p className="text-white/60">Cancelled Bookings</p>
          <h2 className="mt-2 text-3xl font-bold text-rose-300">{stats.cancelledBookings || 0}</h2>
        </div>

        <div className="glass rounded-xl p-5">
          <p className="text-white/60">Pending Payments</p>
          <h2 className="mt-2 text-3xl font-bold text-amber-300">{stats.pendingPayments || 0}</h2>
        </div>
      </div>

      <div className="glass rounded-xl p-6">
        <h2 className="mb-4 text-2xl font-semibold">Recent Bookings</h2>

        {recentBookings.length === 0 ? (
          <p className="text-white/60">No recent bookings available.</p>
        ) : (
          <div className="space-y-4">
            {recentBookings.map((item) => (
              <div key={item._id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-cyan-300">{item.train?.trainName}</p>
                <p className="text-sm text-white/70">
                  {item.user?.name} • {item.pnr} • {item.bookingStatus} • ₹{item.totalFare}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;