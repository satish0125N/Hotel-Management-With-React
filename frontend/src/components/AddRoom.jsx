import React, { useState } from 'react';

function AddRoom({ onRoomAdded, onCancel }) {
	const [roomData, setRoomData] = useState({
		room_type: '',
		capacity: '',
		price_per_night: '',
		amenities: '',
		image_urls: [''], // Array of image URLs
	});

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

		try {
			const token = localStorage.getItem('token');
			if (!token) {
				alert('You must be logged in to add rooms');
				return;
			}

			// Convert numeric fields
			const roomDataToSend = {
				...roomData,
				capacity: parseInt(roomData.capacity),
				price_per_night: parseFloat(roomData.price_per_night),
				// Convert multiple image URLs to single URL for API compatibility
				image_url: roomData.image_urls[0] || '',
			};

			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/rooms`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(roomDataToSend),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.message || `HTTP error! status: ${response.status}`,
				);
			}

			const result = await response.json();
			console.log('Room added successfully:', result);
			alert('Room added successfully!');

			// Clear the form after successful submission
			setRoomData({
				room_type: '',
				capacity: '',
				price_per_night: '',
				amenities: '',
				image_urls: [''],
			});

			// Refresh the rooms list if a callback was provided
			if (onRoomAdded) {
				onRoomAdded();
			}
		} catch (error) {
			console.error('Error adding room:', error);
			alert(error.message || 'Error adding room');
		}
	};

	return (
		<div className='bg-white rounded-xl shadow-md p-4 md:p-6 h-full flex flex-col'>
			<div className='flex justify-between items-center mb-4 border-b pb-2'>
				<h2 className='text-xl md:text-2xl font-bold text-gray-800'>
					Add New Room
				</h2>
				<button
					onClick={onCancel}
					className='text-gray-500 hover:text-gray-700'
					aria-label='Close'>
					<svg
						className='w-6 h-6'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='2'
							d='M6 18L18 6M6 6l12 12'
						/>
					</svg>
				</button>
			</div>
			<div className='flex-1 overflow-y-auto'>
				<form onSubmit={handleSubmit} className='space-y-4 md:space-y-6'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div>
							<label
								htmlFor='room_type'
								className='block text-gray-700 text-sm font-bold mb-2'>
								Room Type:
							</label>
							<input
								type='text'
								id='room_type'
								name='room_type'
								value={roomData.room_type}
								onChange={handleChange}
								className='shadow-sm border border-gray-300 rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200'
								required
								placeholder='e.g. Deluxe, Standard, Suite'
							/>
						</div>
						<div>
							<label
								htmlFor='capacity'
								className='block text-gray-700 text-sm font-bold mb-2'>
								Capacity:
							</label>
							<input
								type='number'
								id='capacity'
								name='capacity'
								value={roomData.capacity}
								onChange={handleChange}
								className='shadow-sm border border-gray-300 rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200'
								required
								placeholder='Number of guests'
							/>
						</div>
					</div>
					<div>
						<label
							htmlFor='price_per_night'
							className='block text-gray-700 text-sm font-bold mb-2'>
							Price Per Night (₹):
						</label>
						<input
							type='number'
							id='price_per_night'
							name='price_per_night'
							value={roomData.price_per_night}
							onChange={handleChange}
							step='0.01'
							className='shadow-sm border border-gray-300 rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200'
							required
							placeholder='Enter price in USD'
						/>
					</div>
					<div>
						<label
							htmlFor='amenities'
							className='block text-gray-700 text-sm font-bold mb-2'>
							Amenities:
						</label>
						<textarea
							id='amenities'
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
					<div className='flex justify-end space-x-3 mt-6'>
						<button
							type='button'
							onClick={onCancel}
							className='bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors'>
							Cancel
						</button>
						<button
							type='submit'
							className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors'>
							Add Room
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default AddRoom;
