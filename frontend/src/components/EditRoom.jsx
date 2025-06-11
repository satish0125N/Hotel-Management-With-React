import React, { useState, useEffect } from "react";

function EditRoom({ roomId, onRoomUpdated, onCancel }) {
  const [roomData, setRoomData] = useState({
    room_type: "",
    capacity: "",
    price_per_night: "",
    amenities: "",
    image_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch(`/api/rooms/${roomId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRoomData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching room for editing:", error);
        setError(error);
        setLoading(false);
      }
    };

    if (roomId) {
      fetchRoom();
    } else {
      setLoading(false);
    }
  }, [roomId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomData({ ...roomData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/rooms/${roomId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roomData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Room updated successfully:", result);
      if (onRoomUpdated) {
        onRoomUpdated();
      }
    } catch (error) {
      console.error("Error updating room:", error);
      // Optionally show an error message
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-pulse text-center">
          <div className="text-blue-600 text-xl font-semibold">
            Loading room data...
          </div>
          <div className="mt-2 text-gray-500">
            Please wait while we fetch the room details
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4 rounded shadow">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-red-700 font-medium">Error loading room data</p>
            <p className="text-red-600">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!roomId) {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4 rounded shadow text-center text-gray-600">
        Select a room to edit.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
        Edit Room
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="edit_room_type"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Room Type:
            </label>
            <input
              type="text"
              id="edit_room_type"
              name="room_type"
              value={roomData.room_type}
              onChange={handleChange}
              required
              className="shadow-sm border border-gray-300 rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="e.g. Deluxe, Standard, Suite"
            />
          </div>
          <div>
            <label
              htmlFor="edit_capacity"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Capacity:
            </label>
            <input
              type="number"
              id="edit_capacity"
              name="capacity"
              value={roomData.capacity}
              onChange={handleChange}
              required
              className="shadow-sm border border-gray-300 rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Number of guests"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="edit_price_per_night"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Price Per Night ($):
          </label>
          <input
            type="number"
            id="edit_price_per_night"
            name="price_per_night"
            value={roomData.price_per_night}
            onChange={handleChange}
            step="0.01"
            required
            className="shadow-sm border border-gray-300 rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Enter price in USD"
          />
        </div>
        <div>
          <label
            htmlFor="edit_amenities"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Amenities:
          </label>
          <textarea
            id="edit_amenities"
            name="amenities"
            value={roomData.amenities}
            onChange={handleChange}
            className="shadow-sm border border-gray-300 rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            rows="3"
            placeholder="WiFi, TV, Air Conditioning, etc."
          />
        </div>
        <div>
          <label
            htmlFor="edit_image_url"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Image URL:
          </label>
          <input
            type="text"
            id="edit_image_url"
            name="image_url"
            value={roomData.image_url}
            onChange={handleChange}
            className="shadow-sm border border-gray-300 rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="https://example.com/room-image.jpg"
          />
        </div>
        <div className="flex items-center justify-between pt-4">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md transition duration-300 transform hover:-translate-y-1 flex-1 mr-3"
          >
            Update Room
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 shadow-md transition duration-300 flex-1"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditRoom;
