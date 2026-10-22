import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAdminBookingsApi } from "../../services/adminService";

const ViewBookingsPage = () => {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await getAdminBookingsApi();
      setBookings(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load bookings");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold">View Bookings</h1>

      <div className="glass rounded-xl p-6">
        {bookings.length === 0 ? (
          <p className="text-white/60">No bookings found.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-cyan-300">
                  {booking.train?.trainName} ({booking.train?.trainNumber})
                </p>
                <p className="text-white/70">PNR: {booking.pnr}</p>
                <p className="text-white/70">Passenger: {booking.user?.name}</p>
                <p className="text-white/60">Mobile: {booking.user?.mobile}</p>
                <p className="text-white/60">Route: {booking.train?.source} → {booking.train?.destination}</p>
                <p className="text-white/60">Fare: ₹{booking.totalFare}</p>
                <p className="text-white/60">Booking Status: {booking.bookingStatus}</p>
                <p className="text-white/60">Payment Status: {booking.paymentStatus}</p>
                <p className="text-white/60">Booked by Clerk: {booking.bookedByClerk ? "Yes" : "No"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewBookingsPage;