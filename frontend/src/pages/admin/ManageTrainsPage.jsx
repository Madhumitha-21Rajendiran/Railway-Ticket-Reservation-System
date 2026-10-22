import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  addTrainApi,
  deleteTrainApi,
  getAdminTrainsApi,
  updateTrainApi,
} from "../../services/adminService";

const initialForm = {
  trainNumber: "",
  trainName: "",
  source: "",
  destination: "",
  departureTime: "",
  arrivalTime: "",
  journeyDate: "",
  totalSeats: "",
  availableSeats: "",
  fare: "",
};

const ManageTrainsPage = () => {
  const [trains, setTrains] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingTrainId, setEditingTrainId] = useState(null);

  const fetchTrains = async () => {
    try {
      const res = await getAdminTrainsApi();
      setTrains(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load trains");
    }
  };

  useEffect(() => {
    fetchTrains();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingTrainId(null);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        totalSeats: Number(formData.totalSeats),
        availableSeats: Number(formData.availableSeats),
        fare: Number(formData.fare),
      };

      if (editingTrainId) {
        await updateTrainApi(editingTrainId, payload);
        toast.success("Train updated successfully");
      } else {
        await addTrainApi(payload);
        toast.success("Train added successfully");
      }

      resetForm();
      fetchTrains();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to save train");
    }
  };

  const handleEdit = (train) => {
    setEditingTrainId(train._id);
    setFormData({
      trainNumber: train.trainNumber || "",
      trainName: train.trainName || "",
      source: train.source || "",
      destination: train.destination || "",
      departureTime: train.departureTime || "",
      arrivalTime: train.arrivalTime || "",
      journeyDate: train.journeyDate ? new Date(train.journeyDate).toISOString().split("T")[0] : "",
      totalSeats: train.totalSeats ?? "",
      availableSeats: train.availableSeats ?? "",
      fare: train.fare ?? "",
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteTrainApi(id);
      toast.success("Train deleted successfully");
      fetchTrains();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete train");
    }
  };

  return (
    <div className="px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold">Manage Trains</h1>

      <div className="glass mb-8 rounded-xl p-6">
        <h2 className="mb-4 text-2xl font-semibold">
          {editingTrainId ? "Edit Train" : "Add Train"}
        </h2>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <input name="trainNumber" placeholder="Train Number" value={formData.trainNumber} onChange={handleChange} className="rounded-lg p-3 text-black" />
          <input name="trainName" placeholder="Train Name" value={formData.trainName} onChange={handleChange} className="rounded-lg p-3 text-black" />
          <input name="source" placeholder="Source" value={formData.source} onChange={handleChange} className="rounded-lg p-3 text-black" />
          <input name="destination" placeholder="Destination" value={formData.destination} onChange={handleChange} className="rounded-lg p-3 text-black" />
          <input name="departureTime" placeholder="Departure Time" value={formData.departureTime} onChange={handleChange} className="rounded-lg p-3 text-black" />
          <input name="arrivalTime" placeholder="Arrival Time" value={formData.arrivalTime} onChange={handleChange} className="rounded-lg p-3 text-black" />
          <input type="date" name="journeyDate" value={formData.journeyDate} onChange={handleChange} className="rounded-lg p-3 text-black" />
          <input type="number" name="totalSeats" placeholder="Total Seats" value={formData.totalSeats} onChange={handleChange} className="rounded-lg p-3 text-black" />
          <input type="number" name="availableSeats" placeholder="Available Seats" value={formData.availableSeats} onChange={handleChange} className="rounded-lg p-3 text-black" />
          <input type="number" name="fare" placeholder="Fare" value={formData.fare} onChange={handleChange} className="rounded-lg p-3 text-black" />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleSubmit}
            className="glow-btn rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-black"
          >
            {editingTrainId ? "Update Train" : "Add Train"}
          </button>

          {editingTrainId && (
            <button
              onClick={resetForm}
              className="rounded-lg bg-white/10 px-5 py-3 font-semibold text-white"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      <div className="glass rounded-xl p-6">
        <h2 className="mb-4 text-2xl font-semibold">All Trains</h2>

        {trains.length === 0 ? (
          <p className="text-white/60">No trains found.</p>
        ) : (
          <div className="space-y-4">
            {trains.map((train) => (
              <div key={train._id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-cyan-300">
                  {train.trainName} ({train.trainNumber})
                </p>
                <p className="text-white/70">
                  {train.source} → {train.destination}
                </p>
                <p className="text-white/60">
                  Seats: {train.availableSeats}/{train.totalSeats} • Fare: ₹{train.fare}
                </p>

                <div className="mt-3 flex gap-3">
                  <button
                    onClick={() => handleEdit(train)}
                    className="rounded-lg bg-amber-400 px-4 py-2 font-semibold text-black"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(train._id)}
                    className="rounded-lg bg-rose-500 px-4 py-2 font-semibold text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTrainsPage;