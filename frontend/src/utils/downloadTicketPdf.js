import jsPDF from "jspdf";

const downloadTicketPdf = (booking) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("RailReserve Ticket", 20, 20);

  doc.setFontSize(12);
  doc.text(`PNR: ${booking.pnr}`, 20, 40);
  doc.text(`Passenger: ${booking.passengerName}`, 20, 50);
  doc.text(`Seats: ${booking.seatCount}`, 20, 60);
  doc.text(`Fare: Rs ${booking.totalFare}`, 20, 70);

  doc.text(
    `Train: ${booking.train?.trainName} (${booking.train?.trainNumber})`,
    20,
    90
  );
  doc.text(
    `Route: ${booking.train?.source} -> ${booking.train?.destination}`,
    20,
    100
  );
  doc.text(
    `Date: ${new Date(booking.train?.journeyDate).toDateString()}`,
    20,
    110
  );

  doc.text(`Booking Status: ${booking.bookingStatus}`, 20, 130);
  doc.text(`Payment Status: ${booking.paymentStatus}`, 20, 140);

  doc.save(`ticket-${booking.pnr}.pdf`);
};

export default downloadTicketPdf;