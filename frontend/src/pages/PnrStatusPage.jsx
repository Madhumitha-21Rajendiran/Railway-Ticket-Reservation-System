import { useState } from "react";
import toast from "react-hot-toast";
import { getPnrStatusApi } from "../services/bookingService";

const PnrStatusPage = () => {
  const [pnr, setPnr] = useState("");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!pnr.trim()) {
      toast.error("Please enter a PNR number");
      return;
    }

    try {
      setLoading(true);
      const res = await getPnrStatusApi(pnr.trim());
      setBooking(res.data);
      toast.success("PNR status fetched");
    } catch (err) {
      console.error(err);
      setBooking(null);
      toast.error(err?.response?.data?.message || "PNR not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-10">
      <h1 className="mb-6 text-3xl font-bold">PNR Status</h1>

      <div className="glass mb-6 max-w-2xl rounded-xl p-6">
        <div className="flex flex-col gap-4 md:flex-row">
          <input
            type="text"
            placeholder="Enter PNR number"
            value={pnr}
            onChange={(e) => setPnr(e.target.value)}
            className="flex-1 rounded-lg p-3 text-black"
          />

          <button
            onClick={handleCheck}
            className="glow-btn rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-black"
          >
            {loading ? "Checking..." : "Check Status"}
          </button>
        </div>
      </div>

      {booking && (
        <div className="glass max-w-2xl rounded-xl p-6">
          <h2 className="mb-4 text-2xl font-semibold">
            {booking.train?.trainName} ({booking.train?.trainNumber})
          </h2>

          <div className="space-y-2 text-white/80">
            <p><strong>PNR:</strong> {booking.pnr}</p>
            <p><strong>Passenger:</strong> {booking.passengerName}</p>
            <p><strong>Route:</strong> {booking.train?.source} → {booking.train?.destination}</p>
            <p><strong>Date:</strong> {new Date(booking.train?.journeyDate).toDateString()}</p>
            <p><strong>Seats:</strong> {booking.seatCount}</p>
            <p><strong>Fare:</strong> ₹{booking.totalFare}</p>
            <p><strong>Booking Status:</strong> {booking.bookingStatus}</p>
            <p><strong>Payment Status:</strong> {booking.paymentStatus}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PnrStatusPage;