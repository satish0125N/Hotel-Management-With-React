import React, { useState, useEffect } from 'react';
import AddRoom from '../components/AddRoom';

function AdminDashboard() {
	const [activeTab, setActiveTab] = useState('overview');
	const [bookings, setBookings] = useState([]);
	const [rooms, setRooms] = useState([]);
	const [showAddRoom, setShowAddRoom] = useState(false);
	const [editingRoom, setEditingRoom] = useState(null);
	const [stats, setStats] = useState({
		totalRooms: 0,
		totalBookings: 0,
		totalRevenue: 0,
		occupancyRate: 0,
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			const token = localStorage.getItem('token');
			const headers = {
				Authorization: `Bearer ${token}`,
			};

			const [bookingsRes, roomsRes] = await Promise.all([
				fetch(`${import.meta.env.VITE_API_URL}/api/bookings`, { headers }),
				fetch(`${import.meta.env.VITE_API_URL}/api/rooms`, { headers }),
			]);

			if (!bookingsRes.ok || !roomsRes.ok) {
				throw new Error('Failed to fetch data');
			}

			const bookingsData = await bookingsRes.json();
			const roomsData = await roomsRes.json();

			setBookings(bookingsData);
			setRooms(roomsData);

			// Calculate stats
			// const totalRevenue = bookingsData.reduce(
			// 	(sum, booking) => sum + parseFloat(booking.total_price),
			// 	0,
			// );
			// const occupancyRate =
			// 	roomsData.length > 0 ? (bookingsData.length / roomsData.length) * 100 : 0;

			// setStats({
			// 	totalRooms: roomsData.length,
			// 	totalBookings: bookingsData.length,
			// 	totalRevenue,
			// 	occupancyRate,
			// });
			const totalRevenue = Array.isArray(bookingsData)
				? bookingsData.reduce(
						(sum, booking) => sum + parseFloat(booking.total_price),
						0,
				  )
				: 0;

			const occupancyRate =
				Array.isArray(roomsData) && roomsData.length > 0
					? (bookingsData.length / roomsData.length) * 100
					: 0;

			setStats({
				totalRooms: roomsData.length || 0,
				totalBookings: bookingsData.length || 0,
				totalRevenue,
				occupancyRate,
			});
		} catch (error) {
			console.error('Error fetching data:', error);
		} finally {
			setStats((prev) => ({
				totalRooms: prev.totalRooms || 0,
				totalBookings: prev.totalBookings || 0,
				totalRevenue: prev.totalRevenue || 0,
				occupancyRate: prev.occupancyRate || 0,
			}));
			setLoading(false);
		}
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString();
	};

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(amount);
	};

	const handleEditRoom = (room) => {
		setEditingRoom(room);
		setShowAddRoom(true);
	};

	const handleDeleteRoom = async (roomId) => {
		if (!window.confirm('Are you sure you want to delete this room?')) {
			return;
		}

		try {
			const token = localStorage.getItem('token');
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/rooms/${roomId}`,
				{
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			if (response.ok) {
				// Remove the room from the state
				setRooms(rooms.filter((room) => room.id !== roomId));
				alert('Room deleted successfully');
			} else {
				const data = await response.json();
				alert(data.message || 'Error deleting room');
			}
		} catch (error) {
			console.error('Error deleting room:', error);
			alert('Error deleting room');
		}
	};

	const handleAddOrUpdateRoom = async (roomData) => {
		try {
			const token = localStorage.getItem('token');
			const url = editingRoom
				? `${import.meta.env.VITE_API_URL}/api/rooms/${editingRoom.id}`
				: `${import.meta.env.VITE_API_URL}/api/rooms`;

			const response = await fetch(url, {
				method: editingRoom ? 'PUT' : 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(roomData),
			});

			if (response.ok) {
				// Refresh the rooms list
				fetchData();
				setShowAddRoom(false);
				setEditingRoom(null);
				alert(
					editingRoom ? 'Room updated successfully' : 'Room added successfully',
				);
			} else {
				const data = await response.json();
				alert(data.message || 'Error saving room');
			}
		} catch (error) {
			console.error('Error saving room:', error);
			alert('Error saving room');
		}
	};

	if (loading) {
		return (
			<div className='flex justify-center items-center h-64'>
				<div className='text-xl'>Loading dashboard...</div>
			</div>
		);
	}

	return (
		<div className='bg-white rounded-lg p-4 md:p-6 h-full flex flex-col'>
			<div className='flex justify-between'>
				<h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6 flex-shrink-0'>
					Admin Dashboard
				</h1>
				<button
					onClick={() => {
						localStorage.removeItem('token');
						window.location.href = '/';
					}}
					className='ml-auto bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600'>
					Logout
				</button>
			</div>

			{/* Tab Navigation */}
			<div className='border-b border-gray-200 mb-4 md:mb-6 flex-shrink-0'>
				<nav className='-mb-px flex space-x-8'>
					<button
						onClick={() => setActiveTab('overview')}
						className={`py-2 px-1 border-b-2 font-medium text-sm ${
							activeTab === 'overview'
								? 'border-indigo-500 text-indigo-600'
								: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
						}`}>
						Overview
					</button>
					<button
						onClick={() => setActiveTab('bookings')}
						className={`py-2 px-1 border-b-2 font-medium text-sm ${
							activeTab === 'bookings'
								? 'border-indigo-500 text-indigo-600'
								: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
						}`}>
						Bookings
					</button>
					<button
						onClick={() => setActiveTab('rooms')}
						className={`py-2 px-1 border-b-2 font-medium text-sm ${
							activeTab === 'rooms'
								? 'border-indigo-500 text-indigo-600'
								: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
						}`}>
						Rooms
					</button>
				</nav>
			</div>

			<div className='flex-1 overflow-y-auto'>
				{/* Overview Tab */}
				{activeTab === 'overview' && (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
						<div className='bg-blue-50 p-6 rounded-lg'>
							<h3 className='text-lg font-semibold text-blue-800'>Total Rooms</h3>
							<p className='text-3xl font-bold text-blue-600'>{stats.totalRooms}</p>
						</div>
						<div className='bg-green-50 p-6 rounded-lg'>
							<h3 className='text-lg font-semibold text-green-800'>Total Bookings</h3>
							<p className='text-3xl font-bold text-green-600'>
								{stats.totalBookings}
							</p>
						</div>
						<div className='bg-yellow-50 p-6 rounded-lg'>
							<h3 className='text-lg font-semibold text-yellow-800'>Total Revenue</h3>
							<p className='text-3xl font-bold text-yellow-600'>
								{formatCurrency(stats.totalRevenue)}
							</p>
						</div>
						<div className='bg-purple-50 p-6 rounded-lg'>
							<h3 className='text-lg font-semibold text-purple-800'>Occupancy Rate</h3>
							<p className='text-3xl font-bold text-purple-600'>
								{stats.occupancyRate.toFixed(1)}%
							</p>
						</div>
					</div>
				)}

				{/* Bookings Tab */}
				{activeTab === 'bookings' && (
					<div className='overflow-x-auto'>
						<table className='min-w-full divide-y divide-gray-200'>
							<thead className='bg-gray-50'>
								<tr>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Guest
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Room
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Check-in
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Check-out
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Guests
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Total
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{bookings.map((booking) => (
									<tr key={booking.id}>
										<td className='px-6 py-4 whitespace-nowrap text-sm capitalize  font-medium text-gray-900'>
											{booking.user?.username} {/* Room ka naam */}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											{booking.room?.room_type} {/* User ka naam */}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											{formatDate(booking.checkin_date)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											{formatDate(booking.checkout_date)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											{booking.number_of_guests}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											{formatCurrency(booking.total_price)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{/* Rooms Tab */}
				{activeTab === 'rooms' && (
					<div>
						<div className='mb-6'>
							<button
								onClick={() => setShowAddRoom(true)}
								className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors'>
								Add New Room
							</button>
						</div>
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
							{rooms.map((room) => (
								<div
									key={room.id}
									className='border rounded-lg p-4 hover:shadow-md transition-shadow'>
									{room.image_url && (
										<img
											src={room.image_url}
											alt={room.room_type}
											className='w-full h-48 object-cover rounded-md mb-4'
										/>
									)}
									<h3 className='text-lg font-semibold text-gray-800 mb-2'>
										{room.room_type}
									</h3>
									<p className='text-sm text-gray-600 mb-1'>
										Capacity: {room.capacity} guests
									</p>
									<p className='text-sm text-gray-600 mb-1'>
										Price: {formatCurrency(room.price_per_night)}/night
									</p>
									{room.amenities && (
										<p className='text-sm text-gray-600 mb-2'>
											Amenities: {room.amenities}
										</p>
									)}
									<div className='flex space-x-2 mt-4'>
										<button
											onClick={() => handleEditRoom(room)}
											className='bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors'>
											Edit
										</button>
										<button
											onClick={() => handleDeleteRoom(room.id)}
											className='bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors'>
											Delete
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			{showAddRoom && (
				<AddRoom
					onSave={handleAddOrUpdateRoom}
					onCancel={() => {
						setShowAddRoom(false);
						setEditingRoom(null);
					}}
					editingRoom={editingRoom}
				/>
			)}
		</div>
	);
}

export default AdminDashboard;
