import React, { useState, useEffect } from 'react';
import AddRoom from '../components/AddRoom';
import EditRoom from '../components/EditRoom';
import BookingForm from '../components/BookingForm';

function Rooms() {
	const [rooms, setRooms] = useState([]);
	const [showAddModal, setShowAddModal] = useState(false);
	const [editRoomData, setEditRoomData] = useState(null);
	const [userRole, setUserRole] = useState('');
	const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			const payload = JSON.parse(atob(token.split('.')[1]));
			setUserRole(payload.role);
		} else {
			setUserRole('guest'); // Default role
		}
		fetchRooms();
	}, []);

	const fetchRooms = async () => {
		try {
			const token = localStorage.getItem('token');
			const headers = token ? { Authorization: `Bearer ${token}` } : {};

			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/rooms`, {
				headers,
			});

			if (!response.ok) throw new Error('Failed to fetch rooms');

			const data = await response.json();
			setRooms(data);
		} catch (error) {
			console.error('Error fetching rooms:', error);
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm('Are you sure you want to delete this room?')) return;
		try {
			const token = localStorage.getItem('token');
			await fetch(`${import.meta.env.VITE_API_URL}/api/rooms/${id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			fetchRooms();
		} catch (error) {
			console.error('Error deleting room:', error);
		}
	};

	return (
		<div className='p-4'>
			<h2 className='text-2xl font-bold mb-4'>Available Rooms</h2>

			{userRole === 'admin' && (
				<button
					onClick={() => setShowAddModal(true)}
					className='bg-blue-500 text-white px-4 py-2 rounded mb-4'>
					Add Room
				</button>
			)}

			<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
				{rooms.map((room) => (
					<div
						key={room.id}
						className='border rounded p-4 shadow hover:shadow-md transition'>
						<h3 className='text-xl font-semibold'>{room.room_type}</h3>
						<p>Capacity: {room.capacity}</p>
						<p>Price per Night: ₹{room.price_per_night}</p>
						<p>Amenities: {room.amenities}</p>
						<img src={room.image_url} alt='' className='mt-2 rounded' />

						{userRole === 'admin' && (
							<div className='mt-2 flex gap-2'>
								<button
									onClick={() => setEditRoomData(room)}
									className='bg-yellow-400 text-white px-2 py-1 rounded'>
									Edit
								</button>
								<button
									onClick={() => handleDelete(room.id)}
									className='bg-red-500 text-white px-2 py-1 rounded'>
									Delete
								</button>
							</div>
						)}

						{userRole !== 'admin' && (
							<div className='mt-2'>
								<button
									onClick={() => setSelectedRoomForBooking(room)}
									className='bg-green-500 text-white px-3 py-1 rounded'>
									Book Now
								</button>
							</div>
						)}
					</div>
				))}
			</div>

			{showAddModal && (
				<AddRoom
					onCancel={() => setShowAddModal(false)}
					onRoomAdded={() => {
						setShowAddModal(false);
						fetchRooms();
					}}
				/>
			)}

			{editRoomData && (
				<EditRoom
					room={editRoomData}
					onCancel={() => setEditRoomData(null)}
					onRoomUpdated={() => {
						setEditRoomData(null);
						fetchRooms();
					}}
				/>
			)}

			{selectedRoomForBooking && (
				<BookingForm
					room={selectedRoomForBooking}
					onCancel={() => setSelectedRoomForBooking(null)}
					onBookingConfirmed={() => {
						setSelectedRoomForBooking(null);
						fetchRooms();
					}}
				/>
			)}
		</div>
	);
}

export default Rooms;
