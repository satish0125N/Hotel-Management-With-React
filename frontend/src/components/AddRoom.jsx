import React, { useState } from "react";

function AddRoom() {
  const [roomData, setRoomData] = useState({
    room_type: "",
    capacity: "",
    price_per_night: "",
    amenities: "",
    image_url: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomData({ ...roomData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit triggered");
    console.log("Room data being sent:", roomData);
    const apiUrl = "/api/rooms";
    console.log("Fetching with URL:", apiUrl);
    console.log("Fetch options:", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(roomData),
    });

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roomData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Room added successfully:", result);
      // Clear the form after successful submission
      setRoomData({
        room_type: "",
        capacity: "",
        price_per_night: "",
        amenities: "",
        image_url: "",
      });
    } catch (error) {
      console.error("Error adding room:", error);
      // Optionally show an error message
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
        Add New Room
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="room_type"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Room Type:
            </label>
            <input
              type="text"
              id="room_type"
              name="room_type"
              value={roomData.room_type}
              onChange={handleChange}
              className="shadow-sm border border-gray-300 rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
              placeholder="e.g. Deluxe, Standard, Suite"
            />
          </div>
          <div>
            <label
              htmlFor="capacity"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Capacity:
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={roomData.capacity}
              onChange={handleChange}
              className="shadow-sm border border-gray-300 rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
              placeholder="Number of guests"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="price_per_night"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Price Per Night ($):
          </label>
          <input
            type="number"
            id="price_per_night"
            name="price_per_night"
            value={roomData.price_per_night}
            onChange={handleChange}
            step="0.01"
            className="shadow-sm border border-gray-300 rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            required
            placeholder="Enter price in USD"
          />
        </div>
        <div>
          <label
            htmlFor="amenities"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Amenities:
          </label>
          <textarea
            id="amenities"
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
            htmlFor="image_url"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Image URL:
          </label>
          <input
            type="text"
            id="image_url"
            name="image_url"
            value={roomData.image_url}
            onChange={handleChange}
            className="shadow-sm border border-gray-300 rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="https://example.com/room-image.jpg"
          />
        </div>
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md transition duration-300 transform hover:-translate-y-1"
          >
            Add Room
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddRoom;
