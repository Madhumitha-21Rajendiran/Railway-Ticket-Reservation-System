import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import StatusBadge from "../components/common/StatusBadge";
import { getBookingByIdApi } from "../services/bookingService";
import downloadTicketPdf from "../utils/downloadTicketPdf";

const TicketPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const ticketRef = useRef(null);

  const fetchBooking = async () => {
    try {
      const res = await getBookingByIdApi(id);
      setBooking(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load ticket");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    if (!booking) return;
    downloadTicketPdf(booking);
  };

  if (loading) {
    return <div className="p-6 text-white">Loading ticket...</div>;
  }

  if (!booking) {
    return <div className="p-6 text-white">Ticket not found</div>;
  }

  return (
    <div className="flex justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <div ref={ticketRef} className="glass rounded-2xl p-6">
          <h1 className="mb-4 text-2xl font-bold text-cyan-300">
            Ticket Details
          </h1>

          <div className="space-y-2 text-white/90">
            <p><strong>PNR:</strong> {booking.pnr}</p>
            <p><strong>Passenger:</strong> {booking.passengerName}</p>
            <p><strong>Seats:</strong> {booking.seatCount}</p>
            <p><strong>Fare:</strong> ₹{booking.totalFare}</p>
          </div>

          <hr className="my-4 border-white/10" />

          <div className="space-y-2 text-white/90">
            <p>
              <strong>Train:</strong> {booking.train?.trainName} ({booking.train?.trainNumber})
            </p>
            <p>
              <strong>Route:</strong> {booking.train?.source} → {booking.train?.destination}
            </p>
            <p>
              <strong>Date:</strong> {new Date(booking.train?.journeyDate).toDateString()}
            </p>
          </div>

          <hr className="my-4 border-white/10" />

          <div className="flex gap-3">
            <StatusBadge status={booking.bookingStatus} />
            <StatusBadge status={booking.paymentStatus} />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleDownloadPdf}
            className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-black"
          >
            Download PDF
          </button>

          <button
            onClick={handlePrint}
            className="rounded-lg bg-white/10 px-4 py-2 font-semibold text-white"
          >
            Print Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketPage;