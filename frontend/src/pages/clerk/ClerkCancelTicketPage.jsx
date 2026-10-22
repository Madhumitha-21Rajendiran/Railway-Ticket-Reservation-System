import { useState } from "react";
import toast from "react-hot-toast";
import {
  clerkCancelTicketApi,
  getClerkBookingsApi,
} from "../../services/clerkService";

const ClerkCancelTicketPage = () => {
  const [mobile, setMobile] = useState("");
  const [bookings, setBookings] = useState([]);

  const handleSearch = async () => {
    try {
      const res = await getClerkBookingsApi(mobile.trim());
      setBookings(res.data || []);

      if (!res.data || res.data.length === 0) {
        toast("No bookings found");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch passenger bookings");
    }
  };

  const handleCancel = async (id) => {
    try {
      await clerkCancelTicketApi(id);
      toast.success("Ticket cancelled successfully");
      handleSearch();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Cancellation failed");
    }
  };

  return (
    <div className="px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold">Clerk Cancel Ticket</h1>

      <div className="glass mb-8 rounded-xl p-6">
        <h2 className="mb-4 text-2xl font-semibold">Search Passenger Bookings</h2>

        <div className="flex flex-col gap-4 md:flex-row">
          <input
            type="text"
            placeholder="Enter Passenger Mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="flex-1 rounded-lg p-3 text-black"
          />
          <button
            onClick={handleSearch}
            className="glow-btn rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-black"
          >
            Search Bookings
          </button>
        </div>
      </div>

      {bookings.length > 0 && (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="glass rounded-xl p-5">
              <h2 className="text-xl font-semibold">
                {booking.train?.trainName} ({booking.train?.trainNumber})
              </h2>

              <div className="mt-3 space-y-1 text-white/80">
                <p><strong>PNR:</strong> {booking.pnr}</p>
                <p><strong>Passenger:</strong> {booking.user?.name}</p>
                <p><strong>Mobile:</strong> {booking.user?.mobile}</p>
                <p><strong>Route:</strong> {booking.train?.source} → {booking.train?.destination}</p>
                <p><strong>Fare:</strong> ₹{booking.totalFare}</p>
                <p><strong>Booking Status:</strong> {booking.bookingStatus}</p>
              </div>

              {booking.bookingStatus !== "cancelled" && (
                <button
                  onClick={() => handleCancel(booking._id)}
                  className="glow-btn mt-4 rounded-lg bg-rose-500 px-4 py-2 font-semibold text-white"
                >
                  Cancel Ticket
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClerkCancelTicketPage;