import React, { useEffect, useState } from 'react';
import AddRoom from './AddRoom';

function Rooms({
	onEditRoom,
	onBookRoom,
	onViewDetails,
	onShowLogin,
	userRole,
	isLoggedIn,
}) {
	const [rooms, setRooms] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [showAddRoom, setShowAddRoom] = useState(false);

	useEffect(() => {
		fetchRooms();
	}, []);

	const fetchRooms = () => {
		fetch(`${import.meta.env.VITE_API_URL}/api/rooms`)
			.then((response) => {
				console.log('Raw response:', response);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.then((data) => {
				setRooms(data);
				setLoading(false);
			})
			.catch((error) => {
				console.error('Error fetching rooms:', error);
				setError(error);
				setLoading(false);
			});
	};

	const handleDeleteRoom = async (roomId) => {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				alert('You must be logged in to delete rooms');
				return;
			}

			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/rooms/${roomId}`,
				{
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				},
			);

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.message || `HTTP error! status: ${response.status}`);
			}

			alert('Room deleted successfully');
			// Refresh the rooms list after deletion
			fetchRooms();
		} catch (error) {
			console.error('Error deleting room:', error);
			alert(error.message || 'Error deleting room');
		}
	};

	const isAdmin = userRole === 'admin';

	const checkAdminAccess = () => {
		if (!isLoggedIn) {
			alert('Please log in first');
			onShowLogin();
			return false;
		}
		if (!isAdmin) {
			alert('Admin access required');
			return false;
		}
		return true;
	};

	const handleAdminAction = (action, roomId = null) => {
		if (!checkAdminAccess()) return;

		switch (action) {
			case 'delete':
				if (window.confirm('Are you sure you want to delete this room?')) {
					handleDeleteRoom(roomId);
				}
				break;
			case 'edit':
				onEditRoom(roomId);
				break;
			default:
				break;
		}
	};

	if (loading) {
		return (
			<div className='flex justify-center items-center py-20'>
				<div className='animate-pulse text-center'>
					<div className='text-blue-600 text-xl font-semibold'>Loading rooms...</div>
					<div className='mt-2 text-gray-500'>
						Please wait while we fetch the available rooms
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='bg-red-50 border-l-4 border-red-500 p-4 my-4 rounded shadow'>
				<div className='flex'>
					<div className='flex-shrink-0'>
						<svg
							className='h-5 w-5 text-red-500'
							viewBox='0 0 20 20'
							fill='currentColor'>
							<path
								fillRule='evenodd'
								d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
								clipRule='evenodd'
							/>
						</svg>
					</div>
					<div className='ml-3'>
						<p className='text-red-700 font-medium'>Error loading rooms</p>
						<p className='text-red-600'>{error.message}</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='bg-white rounded-xl shadow-md p-4 md:p-6 h-full flex flex-col '>
			<div className='flex justify-between items-center mb-4 border-b pb-2'>
				<h2 className='text-2xl md:text-3xl font-bold text-gray-800 flex-shrink-0'>
					Available Rooms
				</h2>
				{userRole === 'admin' && isLoggedIn && (
					<button
						onClick={() => setShowAddRoom(true)}
						className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center'>
						<svg
							className='h-5 w-5 mr-2'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								d='M12 4v16m8-8H4'
							/>
						</svg>
						Add New Room
					</button>
				)}
			</div>
			{rooms.length === 0 ? (
				<div className='text-center py-8 text-gray-500 flex-1 flex items-center justify-center'>
					No rooms available.
					{userRole === 'admin' && isLoggedIn && (
						<button
							onClick={() => setShowAddRoom(true)}
							className='ml-2 text-blue-500 hover:text-blue-600 underline'>
							Add a room
						</button>
					)}
				</div>
			) : (
				<div className='flex-1 overflow-y-auto'>
					<ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6 pb-4'>
						{rooms.map((room) => (
							<li
								key={room.id}
								className='bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
								{room.image_url ? (
									<div className='h-40 sm:h-44 md:h-48 lg:h-40 2xl:h-36 overflow-hidden relative'>
										<img
											src={room.image_url}
											alt={room.room_type}
											className='w-full h-full object-cover transition-transform duration-500 hover:scale-105'
										/>
										<div className='absolute top-2 right-2 bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-2 py-1'>
											<span className='text-green-600 font-bold text-xs'>
												₹{room.price_per_night}/night
											</span>
										</div>
									</div>
								) : (
									<div className='h-40 sm:h-44 md:h-48 lg:h-40 2xl:h-36 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center'>
										<span className='text-gray-400 text-sm lg:text-base'>
											No image available
										</span>
									</div>
								)}
								<div className='p-5'>
									<h3 className='text-xl font-bold text-gray-800 mb-2 truncate'>
										{room.room_type}
									</h3>
									<div className='flex items-center justify-between mb-3'>
										<div className='flex items-center'>
											<svg
												className='h-4 w-4 text-gray-500 mr-2'
												fill='currentColor'
												viewBox='0 0 20 20'>
												<path d='M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z' />
											</svg>
											<span className='text-gray-700 font-medium'>
												{room.capacity} Guests
											</span>
										</div>
										<div className='flex items-center'>
											<div className='w-2 h-2 bg-green-500 rounded-full mr-2'></div>
											<span className='text-green-600 text-sm font-medium'>Available</span>
										</div>
									</div>
									{room.amenities && (
										<div className='mb-4'>
											<p className='text-gray-600 text-sm line-clamp-2'>
												{room.amenities}
											</p>
										</div>
									)}
									<div className='mt-4 space-y-2'>
										{/* See Details Button - Always visible */}
										<button
											onClick={() => onViewDetails && onViewDetails(room)}
											className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 flex items-center justify-center'>
											<svg
												className='h-4 w-4 mr-2'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth='2'
													d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
												/>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth='2'
													d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
												/>
											</svg>
											See Details
										</button>

										{/* Action Buttons */}
										<div className='flex space-x-2'>
											{userRole === 'admin' && isLoggedIn ? (
												<>
													<button
														onClick={() => onEditRoom(room.id)}
														className='flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg transition duration-200 flex items-center justify-center'>
														<svg
															className='h-4 w-4 mr-1'
															fill='none'
															stroke='currentColor'
															viewBox='0 0 24 24'>
															<path
																strokeLinecap='round'
																strokeLinejoin='round'
																strokeWidth='2'
																d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002 2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
															/>
														</svg>
														Edit
													</button>
													<button
														onClick={() => handleAdminAction('delete', room.id)}
														className='flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-3 rounded-lg transition duration-200 flex items-center justify-center'>
														<svg
															className='h-4 w-4 mr-1'
															fill='none'
															stroke='currentColor'
															viewBox='0 0 24 24'>
															<path
																strokeLinecap='round'
																strokeLinejoin='round'
																strokeWidth='2'
																d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
															/>
														</svg>
														Delete
													</button>
												</>
											) : (
												<button
													onClick={() => onBookRoom(room)}
													className='w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center'>
													<svg
														className='h-4 w-4 mr-1'
														fill='none'
														stroke='currentColor'
														viewBox='0 0 24 24'>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth='2'
															d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z'
														/>
													</svg>
													{isLoggedIn ? 'Book Now' : 'Login to Book'}
												</button>
											)}
										</div>
									</div>
								</div>
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Add Room Modal */}
			{showAddRoom && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'>
					<div className='bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
						<AddRoom
							onRoomAdded={() => {
								fetchRooms();
								setShowAddRoom(false);
							}}
							onCancel={() => setShowAddRoom(false)}
						/>
					</div>
				</div>
			)}
		</div>
	);
}

export default Rooms;
