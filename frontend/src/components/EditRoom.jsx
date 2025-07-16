import React, { useState, useEffect } from 'react';

function EditRoom({ roomId, onRoomUpdated, onCancel }) {
	const [roomData, setRoomData] = useState({
		room_type: '',
		capacity: '',
		price_per_night: '',
		amenities: '',
		image_urls: [''],
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchRoom = async () => {
			try {
				const token = localStorage.getItem('token');
				const response = await fetch(
					`${import.meta.env.VITE_API_URL}/api/rooms/${roomId}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					},
				);

				if (!response.ok) {
					const data = await response.json();
					throw new Error(data.message || `HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				// Use the image_urls array from the response, or create from image_url if needed
				const convertedData = {
					...data,
					image_urls: data.image_urls || (data.image_url ? [data.image_url] : ['']),
				};
				setRoomData(convertedData);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching room for editing:', error);
				setError(error.message);
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
		if (name.startsWith('image_url_')) {
			const index = parseInt(name.split('_')[2]);
			const newImageUrls = [...roomData.image_urls];
			newImageUrls[index] = value;
			setRoomData({ ...roomData, image_urls: newImageUrls });
		} else {
			setRoomData({ ...roomData, [name]: value });
		}
	};

	const handleAddImageField = () => {
		setRoomData({
			...roomData,
			image_urls: [...roomData.image_urls, ''],
		});
	};

	const handleRemoveImageField = (index) => {
		const newImageUrls = roomData.image_urls.filter((_, i) => i !== index);
		setRoomData({
			...roomData,
			image_urls: newImageUrls.length > 0 ? newImageUrls : [''], // Keep at least one field
		});
	};

	const validateForm = () => {
		if (!roomData.room_type || roomData.room_type.trim() === '') {
			alert('Room type is required');
			return false;
		}
		if (!roomData.capacity || roomData.capacity <= 0) {
			alert('Capacity must be greater than 0');
			return false;
		}
		if (!roomData.price_per_night || roomData.price_per_night <= 0) {
			alert('Price per night must be greater than 0');
			return false;
		}
		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) {
			return;
		}
		if (!validateForm()) {
			return;
		}
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				throw new Error('You must be logged in to update rooms');
			}

			// Convert numeric fields
			const updatedRoomData = {
				...roomData,
				capacity: parseInt(roomData.capacity),
				price_per_night: parseFloat(roomData.price_per_night),
				// Convert back to single image_url for API compatibility
				image_url: roomData.image_urls[0] || '',
			};

			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/rooms/${roomId}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(updatedRoomData),
				},
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.message || `HTTP error! status: ${response.status}`,
				);
			}

			const result = await response.json();
			console.log('Room updated successfully:', result);
			alert('Room updated successfully!');
			if (onRoomUpdated) {
				onRoomUpdated();
			}
		} catch (error) {
			console.error('Error updating room:', error);
			alert(error.message || 'Error updating room');
		}
	};

	if (loading) {
		return (
			<div className='flex justify-center items-center py-20'>
				<div className='animate-pulse text-center'>
					<div className='text-blue-600 text-xl font-semibold'>
						Loading room data...
					</div>
					<div className='mt-2 text-gray-500'>
						Please wait while we fetch the room details
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
						<p className='text-red-700 font-medium'>Error loading room data</p>
						<p className='text-red-600'>{error.message}</p>
					</div>
				</div>
			</div>
		);
	}

	if (!roomId) {
		return (
			<div className='bg-blue-50 border-l-4 border-blue-500 p-4 my-4 rounded shadow text-center text-gray-600'>
				Select a room to edit.
			</div>
		);
	}

	return (
		<div className='bg-white rounded-xl shadow-md p-6'>
			<h2 className='text-2xl font-bold mb-6 text-gray-800 border-b pb-2'>
				Edit Room
			</h2>
			<form onSubmit={handleSubmit} className='space-y-6'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<div>
						<label
							htmlFor='edit_room_type'
							className='block text-gray-700 text-sm font-bold mb-2'>
							Room Type:
						</label>
						<input
							type='text'
							id='edit_room_type'
							name='room_type'
							value={roomData.room_type}
							onChange={handleChange}
							required
							className='shadow-sm border border-gray-300 rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200'
							placeholder='e.g. Deluxe, Standard, Suite'
						/>
					</div>
					<div>
						<label
							htmlFor='edit_capacity'
							className='block text-gray-700 text-sm font-bold mb-2'>
							Capacity:
						</label>
						<input
							type='number'
							id='edit_capacity'
							name='capacity'
							value={roomData.capacity}
							onChange={handleChange}
							required
							className='shadow-sm border border-gray-300 rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200'
							placeholder='Number of guests'
						/>
					</div>
				</div>
				<div>
					<label
						htmlFor='edit_price_per_night'
						className='block text-gray-700 text-sm font-bold mb-2'>
						Price Per Night (₹):
					</label>
					<input
						type='number'
						id='edit_price_per_night'
						name='price_per_night'
						value={roomData.price_per_night}
						onChange={handleChange}
						step='0.01'
						required
						className='shadow-sm border border-gray-300 rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200'
						placeholder='Enter price in USD'
					/>
				</div>
				<div>
					<label
						htmlFor='edit_amenities'
						className='block text-gray-700 text-sm font-bold mb-2'>
						Amenities:
					</label>
					<textarea
						id='edit_amenities'
						name='amenities'
						value={roomData.amenities}
						onChange={handleChange}
						className='shadow-sm border border-gray-300 rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200'
						rows='3'
						placeholder='WiFi, TV, Air Conditioning, etc.'
					/>
				</div>
				<div>
					<label className='block text-gray-700 text-sm font-bold mb-2'>
						Room Images:
					</label>
					<div className='space-y-3'>
						{roomData.image_urls.map((url, index) => (
							<div key={index} className='flex gap-2'>
								<input
									type='text'
									name={`image_url_${index}`}
									value={url}
									onChange={handleChange}
									className='shadow-sm border border-gray-300 rounded-md flex-1 py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200'
									placeholder='https://example.com/room-image.jpg'
								/>
								<button
									type='button'
									onClick={() => handleRemoveImageField(index)}
									className='text-red-500 hover:text-red-700 p-2'
									disabled={roomData.image_urls.length === 1}>
									<svg
										className='w-5 h-5'
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
								</button>
							</div>
						))}
						<button
							type='button'
							onClick={handleAddImageField}
							className='inline-flex items-center text-blue-600 hover:text-blue-700'>
							<svg
								className='w-5 h-5 mr-1'
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
							Add Another Image
						</button>
					</div>
				</div>
				<div className='flex items-center justify-between pt-4'>
					<button
						type='submit'
						className='bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md transition duration-300 transform hover:-translate-y-1 flex-1 mr-3'>
						Update Room
					</button>
					<button
						type='button'
						onClick={onCancel}
						className='bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 shadow-md transition duration-300 flex-1'>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}

export default EditRoom;
