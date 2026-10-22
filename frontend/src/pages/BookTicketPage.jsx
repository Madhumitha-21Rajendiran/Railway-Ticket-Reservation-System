import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { createBookingApi } from "../services/bookingService";

const BookTicketPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const train = location.state?.train;

  const [formData, setFormData] = useState({
    passengerName: "",
    passengerAge: "",
    passengerGender: "male",
    seatCount: 1,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBooking = async () => {
    // AUTO LOGIN FIX
    if (!localStorage.getItem("token")) {
      localStorage.setItem("token", "fake-token");
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: "Madhumitha",
          role: "passenger",
        })
      );
    }

    if (!train) {
      toast.error("Train data missing. Go to Search and click Book Now again.");
      navigate("/search");
      return;
    }

    if (!formData.passengerName || !formData.passengerAge) {
      toast.error("Please fill passenger name and age");
      return;
    }

    try {
      const res = await createBookingApi({
        trainId: train._id,
        passengerName: formData.passengerName,
        passengerAge: Number(formData.passengerAge),
        passengerGender: formData.passengerGender,
        seatCount: Number(formData.seatCount),
      });

      toast.success("Booking created successfully");

      navigate("/payment", {
        state: {
          booking: res.data,
        },
      });
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Booking failed");
    }
  };

  if (!train) {
    return (
      <div className="px-6 py-10">
        <h1 className="text-3xl font-bold">Book Ticket</h1>
        <p className="mt-4 text-white/70">
          No train selected. Please go to Search and click Book Now.
        </p>
      </div>
    );
  }

  return (
    <div className="px-6 py-10">
      <h1 className="mb-6 text-3xl font-bold">Book Ticket</h1>

      <div className="glass mb-8 rounded-xl p-6">
        <h2 className="text-xl font-semibold">
          {train.trainName} ({train.trainNumber})
        </h2>
        <p>Available Seats: {train.availableSeats}</p>
        <p>Fare: ₹{train.fare}</p>
      </div>

      <div className="glass max-w-xl rounded-xl p-6">
        <div className="space-y-4">
          <input
            name="passengerName"
            value={formData.passengerName}
            onChange={handleChange}
            placeholder="Passenger Name"
            className="w-full rounded-lg p-3 text-black"
          />

          <input
            name="passengerAge"
            type="number"
            value={formData.passengerAge}
            onChange={handleChange}
            placeholder="Passenger Age"
            className="w-full rounded-lg p-3 text-black"
          />

          <select
            name="passengerGender"
            value={formData.passengerGender}
            onChange={handleChange}
            className="w-full rounded-lg p-3 text-black"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <input
            name="seatCount"
            type="number"
            min="1"
            value={formData.seatCount}
            onChange={handleChange}
            className="w-full rounded-lg p-3 text-black"
          />

          <button
            onClick={handleBooking}
            className="glow-btn w-full rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-black"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookTicketPage;