import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import StatusBadge from "../components/common/StatusBadge";
import {
  cancelBookingApi,
  getMyBookingsApi,
} from "../services/bookingService";

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getMyBookingsApi();
      setBookings(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    try {
      await cancelBookingApi(id);
      toast.success("Ticket cancelled successfully");
      fetchBookings();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Cancellation failed");
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesStatus =
        statusFilter === "all" || booking.bookingStatus === statusFilter;

      const matchesPayment =
        paymentFilter === "all" || booking.paymentStatus === paymentFilter;

      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        booking.pnr?.toLowerCase().includes(q) ||
        booking.train?.trainName?.toLowerCase().includes(q) ||
        booking.train?.trainNumber?.toLowerCase().includes(q);

      return matchesStatus && matchesPayment && matchesSearch;
    });
  }, [bookings, statusFilter, paymentFilter, search]);

  if (loading) {
    return (
      <div className="px-6 py-10">
        <h1 className="mb-6 text-3xl font-bold">My Bookings</h1>
        <div className="glass rounded-xl p-6 text-white/70">
          Loading bookings...
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-10">
      <h1 className="mb-6 text-3xl font-bold">My Bookings</h1>

      <div className="glass mb-6 rounded-xl p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <input
            type="text"
            placeholder="Search by PNR / train"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg p-3 text-black"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg p-3 text-black"
          >
            <option value="all">All Booking Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="rounded-lg p-3 text-black"
          >
            <option value="all">All Payment Status</option>
            <option value="pending">Pending</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="glass rounded-xl p-6 text-white/70">
          No bookings match your filters.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className="glass rounded-xl p-5">
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">
                    {booking.train?.trainName} ({booking.train?.trainNumber})
                  </h2>
                  <p className="text-white/60">
                    {booking.train?.source} → {booking.train?.destination}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={booking.bookingStatus} />
                  <StatusBadge status={booking.paymentStatus} />
                </div>
              </div>

              <div className="space-y-1 text-white/80">
                <p><strong>PNR:</strong> {booking.pnr}</p>
                <p><strong>Passenger:</strong> {booking.passengerName || "User"}</p>
                <p><strong>Date:</strong> {new Date(booking.train?.journeyDate).toDateString()}</p>
                <p><strong>Seats:</strong> {booking.seatCount}</p>
                <p><strong>Fare:</strong> ₹{booking.totalFare}</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to={`/ticket/${booking._id}`}
                  className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-black"
                >
                  View Ticket
                </Link>

                {booking.bookingStatus !== "cancelled" && (
                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="glow-btn rounded-lg bg-rose-500 px-4 py-2 font-semibold text-white"
                  >
                    Cancel Ticket
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;