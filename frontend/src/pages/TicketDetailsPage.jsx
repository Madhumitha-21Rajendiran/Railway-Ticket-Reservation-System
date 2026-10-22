import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getBookingByIdApi } from "../services/bookingService";
import downloadTicketPdf from "../utils/downloadTicketPdf";

const TicketDetailsPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const res = await getBookingByIdApi(bookingId);
      setBooking(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load ticket details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const handleDownload = () => {
    if (!booking) return;
    downloadTicketPdf(booking);
  };

  if (loading) {
    return (
      <div className="px-6 py-10">
        <h1 className="mb-6 text-3xl font-bold">Ticket Details</h1>
        <div className="glass rounded-xl p-6 text-white/70">Loading ticket...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="px-6 py-10">
        <h1 className="mb-6 text-3xl font-bold">Ticket Details</h1>
        <div className="glass rounded-xl p-6 text-white/70">Ticket not found.</div>
      </div>
    );
  }

  return (
    <div className="px-6 py-10">
      <h1 className="mb-6 text-3xl font-bold">Ticket Details</h1>

      <div className="glass max-w-2xl rounded-xl p-6">
        <h2 className="mb-4 text-2xl font-semibold">
          {booking.train?.trainName} ({booking.train?.trainNumber})
        </h2>

        <div className="space-y-2 text-white/80">
          <p><strong>PNR:</strong> {booking.pnr}</p>
          <p><strong>Passenger:</strong> {booking.passengerName}</p>
          <p><strong>Age:</strong> {booking.passengerAge}</p>
          <p><strong>Gender:</strong> {booking.passengerGender}</p>
          <p><strong>Route:</strong> {booking.train?.source} → {booking.train?.destination}</p>
          <p><strong>Date:</strong> {new Date(booking.train?.journeyDate).toDateString()}</p>
          <p><strong>Departure:</strong> {booking.train?.departureTime}</p>
          <p><strong>Arrival:</strong> {booking.train?.arrivalTime}</p>
          <p><strong>Seats:</strong> {booking.seatCount}</p>
          <p><strong>Fare:</strong> ₹{booking.totalFare}</p>
          <p><strong>Booking Status:</strong> {booking.bookingStatus}</p>
          <p><strong>Payment Status:</strong> {booking.paymentStatus}</p>
        </div>

        <button
          onClick={handleDownload}
          className="glow-btn mt-6 rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-black"
        >
          Download PDF Ticket
        </button>
      </div>
    </div>
  );
};

export default TicketDetailsPage;