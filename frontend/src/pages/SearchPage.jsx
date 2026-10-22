import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { searchTrainsApi } from "../services/trainService";

const SearchPage = () => {
  const navigate = useNavigate();

  const [searchData, setSearchData] = useState({
    source: "",
    destination: "",
    date: "",
  });

  const [trains, setTrains] = useState([]);

  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = async () => {
    if (!searchData.source || !searchData.destination || !searchData.date) {
      toast.error("Please fill all search fields");
      return;
    }

    try {
      const res = await searchTrainsApi(searchData);
      setTrains(res.data || []);

      if (!res.data || res.data.length === 0) {
        toast("No trains found");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to search trains");
    }
  };

  return (
    <div className="px-6 py-10">
      <h1 className="mb-6 text-3xl font-bold">Search Trains</h1>

      <div className="glass mb-8 rounded-xl p-6">
        <div className="grid gap-4 md:grid-cols-4">
          <input
            type="text"
            name="source"
            placeholder="Source"
            value={searchData.source}
            onChange={handleChange}
            className="rounded-lg p-3 text-black"
          />

          <input
            type="text"
            name="destination"
            placeholder="Destination"
            value={searchData.destination}
            onChange={handleChange}
            className="rounded-lg p-3 text-black"
          />

          <input
            type="date"
            name="date"
            value={searchData.date}
            onChange={handleChange}
            className="rounded-lg p-3 text-black"
          />

          <button
            onClick={handleSearch}
            className="glow-btn rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-black"
          >
            Search
          </button>
        </div>
      </div>

      {trains.length > 0 && (
        <div className="space-y-4">
          {trains.map((train) => (
            <div key={train._id} className="glass rounded-xl p-5">
              <h2 className="text-xl font-semibold">
                {train.trainName} ({train.trainNumber})
              </h2>

              <p className="text-white/80">
                {train.source} → {train.destination}
              </p>

              <p className="text-white/80">
                Date: {new Date(train.journeyDate).toDateString()}
              </p>

              <p className="text-white/80">
                Available Seats: {train.availableSeats}
              </p>

              <p className="text-white/80">Fare: ₹{train.fare}</p>

              <button
                onClick={() =>
                  navigate(`/book/${train._id}`, {
                    state: { train },
                  })
                }
                className="mt-4 rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-black"
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;