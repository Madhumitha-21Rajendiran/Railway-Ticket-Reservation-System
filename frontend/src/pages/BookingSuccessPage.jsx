import { Link, useLocation } from "react-router-dom";

const BookingSuccessPage = () => {
  const location = useLocation();
  const booking = location.state?.booking;
  const payment = location.state?.payment;

  if (!booking || !payment) {
    return (
      <div className="px-6 py-10">
        <h1 className="text-3xl font-bold">Booking Success</h1>
        <p className="mt-4 text-white/70">No booking information found.</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-10">
      <div className="glass max-w-2xl rounded-xl p-6">
        <h1 className="mb-4 text-3xl font-bold text-emerald-300">
          Booking Confirmed
        </h1>

        <div className="space-y-2">
          <p><strong>PNR:</strong> {booking.pnr}</p>
          <p><strong>Passenger:</strong> {booking.passengerName}</p>
          <p><strong>Total Fare:</strong> ₹{booking.totalFare}</p>
          <p><strong>Transaction ID:</strong> {payment.transactionId}</p>
          <p><strong>Payment Status:</strong> {payment.status}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/my-bookings"
            className="rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-black"
          >
            View My Bookings
          </Link>

          <Link
            to={`/ticket/${booking._id}`}
            className="rounded-lg bg-emerald-500 px-4 py-3 font-semibold text-black"
          >
            View Ticket
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;