import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import loadRazorpay from "../utils/loadRazorpay";
import {
  createRazorpayOrderApi,
  verifyRazorpayPaymentApi,
} from "../services/paymentService";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state?.booking;

  const handlePayment = async () => {
    if (!booking) {
      toast.error("No booking found for payment");
      return;
    }

    try {
      const scriptLoaded = await loadRazorpay();

      if (!scriptLoaded) {
        toast.error("Razorpay failed to load");
        return;
      }

      const orderRes = await createRazorpayOrderApi({
        bookingId: booking._id,
      });

      const { orderId, amount, currency, key } = orderRes.data;

      const options = {
        key,
        amount,
        currency,
        name: "RailReserve",
        description: `Ticket Payment - ${booking.pnr}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            const verifyRes = await verifyRazorpayPaymentApi({
              bookingId: booking._id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast.success("Payment successful");

            navigate("/booking-success", {
              state: {
                booking: verifyRes.data.booking,
                payment: verifyRes.data.payment,
              },
            });
          } catch (err) {
            console.error(err);
            toast.error(
              err?.response?.data?.message || "Payment verification failed"
            );
          }
        },
        prefill: {
          name: booking.passengerName,
          contact: "6381058731", // change number here
        },
        notes: {
          bookingId: booking._id,
          pnr: booking.pnr,
        },
        theme: {
          color: "#22d3ee",
        },
        modal: {
          ondismiss: function () {
            toast("Payment cancelled");
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to initiate payment");
    }
  };

  if (!booking) {
    return (
      <div className="px-6 py-10">
        <h1 className="text-3xl font-bold">Payment</h1>
        <p className="mt-4 text-white/70">No booking data found.</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-10">
      <h1 className="mb-6 text-3xl font-bold">Payment</h1>

      <div className="glass max-w-xl rounded-xl p-6">
        <h2 className="mb-3 text-xl font-semibold">Booking Summary</h2>
        <p><strong>PNR:</strong> {booking.pnr}</p>
        <p><strong>Passenger:</strong> {booking.passengerName}</p>
        <p><strong>Total Fare:</strong> ₹{booking.totalFare}</p>
        <p><strong>Payment Status:</strong> {booking.paymentStatus}</p>

        <button
          onClick={handlePayment}
          className="glow-btn mt-6 rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-black"
        >
          Pay with Razorpay
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;