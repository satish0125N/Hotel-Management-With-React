import { useState } from 'react';
import './App.css';
import Rooms from './components/Rooms';
import AddRoom from './components/AddRoom';
import EditRoom from './components/EditRoom';

function App() {
  const [editingRoomId, setEditingRoomId] = useState(null);

  const handleEditRoom = (roomId) => {
    setEditingRoomId(roomId);
  };

  const handleRoomUpdated = () => {
    setEditingRoomId(null);
    // Optionally refresh the rooms list in the Rooms component
  };

  const handleCancelEdit = () => {
    setEditingRoomId(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800">
      <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 shadow-lg">
        <div className="container mx-auto flex items-center justify-center">
          <h1 className="text-3xl font-bold tracking-tight">Hotel Management</h1>
        </div>
      </header>

      <main className="container mx-auto p-6 flex-grow max-w-7xl">
        {editingRoomId ? (
          <EditRoom
            roomId={editingRoomId}
            onRoomUpdated={handleRoomUpdated}
            onCancel={handleCancelEdit}
          />
        ) : (
          <div className="space-y-8">
            <Rooms onEditRoom={handleEditRoom} />
            <AddRoom />
          </div>
        )}
      </main>

      <footer className="bg-gray-900 text-white p-6 shadow-inner">
        <div className="container mx-auto text-center">
          <p>© 2023 Hotel Management. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
