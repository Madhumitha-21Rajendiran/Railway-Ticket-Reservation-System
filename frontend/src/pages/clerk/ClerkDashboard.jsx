import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getClerkDashboardApi } from "../../services/clerkService";

const ClerkDashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  const fetchDashboard = async () => {
    try {
      const res = await getClerkDashboardApi();
      setDashboard(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load clerk dashboard");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const stats = dashboard?.stats || {};
  const recentBookings = dashboard?.recentBookings || [];

  return (
    <div className="px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold">Clerk Dashboard</h1>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="glass rounded-xl p-5">
          <p className="text-white/60">Total Clerk Bookings</p>
          <h2 className="mt-2 text-3xl font-bold text-cyan-300">
            {stats.totalPassengerBookings || 0}
          </h2>
        </div>

        <div className="glass rounded-xl p-5">
          <p className="text-white/60">Active Bookings</p>
          <h2 className="mt-2 text-3xl font-bold text-emerald-300">
            {stats.activeBookings || 0}
          </h2>
        </div>

        <div className="glass rounded-xl p-5">
          <p className="text-white/60">Cancelled Bookings</p>
          <h2 className="mt-2 text-3xl font-bold text-rose-300">
            {stats.cancelledBookings || 0}
          </h2>
        </div>
      </div>

      <div className="glass rounded-xl p-6">
        <h2 className="mb-4 text-2xl font-semibold">Recent Clerk Bookings</h2>

        {recentBookings.length === 0 ? (
          <p className="text-white/60">No recent clerk bookings available.</p>
        ) : (
          <div className="space-y-4">
            {recentBookings.map((item) => (
              <div key={item._id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-cyan-300">
                  {item.user?.name} • {item.train?.trainName}
                </p>
                <p className="text-sm text-white/70">
                  {item.user?.mobile} • {item.pnr} • {item.bookingStatus} • ₹{item.totalFare}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClerkDashboard;