import React, { useEffect, useState } from 'react';

function Rooms({ onEditRoom }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = () => {
    fetch('/api/rooms') // Assuming the backend is running on the same host/port or proxied
      .then(response => {
        console.log('Raw response:', response); // Log the raw response
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setRooms(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching rooms:", error);
        setError(error);
        setLoading(false);
      });
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      const response = await fetch(`/api/rooms/${roomId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(`Room ${roomId} deleted successfully`);
      // Refresh the rooms list after deletion
      fetchRooms();
    } catch (error) {
      console.error('Error deleting room:', error);
      // Optionally show an error message
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center py-20">
      <div className="animate-pulse text-center">
        <div className="text-blue-600 text-xl font-semibold">Loading rooms...</div>
        <div className="mt-2 text-gray-500">Please wait while we fetch the available rooms</div>
      </div>
    </div>;
  }

  if (error) {
    return <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4 rounded shadow">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-red-700 font-medium">Error loading rooms</p>
          <p className="text-red-600">{error.message}</p>
        </div>
      </div>
    </div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">Available Rooms</h2>
      {rooms.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No rooms available. Add a new room below.</div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map(room => (
            <li key={room.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              {room.image_url ? (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={room.image_url} 
                    alt={room.room_type} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                  />
                </div>
              ) : (
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-lg">No image available</span>
                </div>
              )}
              <div className="p-5">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{room.room_type}</h3>
                <div className="flex items-center mb-2">
                  <svg className="h-3 w-3 text-gray-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <p className="text-gray-700">Capacity: <span className="font-semibold">{room.capacity}</span></p>
                </div>
                <div className="flex items-center mb-3">
                  <svg className="h-3 w-3 text-gray-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-gray-700">Price: <span className="font-semibold text-green-600">${room.price_per_night}</span> / night</p>
                </div>
                {room.amenities && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Amenities:</h4>
                    <p className="text-gray-600 text-sm">{room.amenities}</p>
                  </div>
                )}
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => onEditRoom(room.id)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
                  >
                    <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002 2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRoom(room.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
                  >
                    <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Rooms;