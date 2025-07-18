import React, { useState, useEffect } from 'react';

function EditRoom({ room, onRoomUpdated, onCancel }) {
	const [roomData, setRoomData] = useState({ ...room });
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			const payload = JSON.parse(atob(token.split('.')[1]));
			setIsAdmin(payload.role === 'admin');
		}
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setRoomData({ ...roomData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!isAdmin) {
			alert('Only admin can edit rooms.');
			return;
		}

		try {
			const token = localStorage.getItem('token');
			if (!token) {
				alert('Admin login required.');
				return;
			}

			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/rooms/${room.id}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						...roomData,
						capacity: parseInt(roomData.capacity),
						price_per_night: parseFloat(roomData.price_per_night),
					}),
				},
			);

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || 'Error updating room');
			}

			alert('Room updated successfully');
			onRoomUpdated();
		} catch (error) {
			console.error('Update Room Error:', error);
			alert(error.message);
		}
	};

	return (
		<div className='bg-white p-4 rounded shadow'>
			<h2 className='text-xl font-bold mb-4'>Edit Room</h2>
			<form onSubmit={handleSubmit} className='space-y-3'>
				<input
					type='text'
					name='room_type'
					value={roomData.room_type}
					onChange={handleChange}
					className='input'
					placeholder='Room Type'
					required
				/>
				<input
					type='number'
					name='capacity'
					value={roomData.capacity}
					onChange={handleChange}
					className='input'
					placeholder='Capacity'
					required
				/>
				<input
					type='number'
					name='price_per_night'
					value={roomData.price_per_night}
					onChange={handleChange}
					className='input'
					placeholder='Price per night'
					required
				/>
				<textarea
					name='amenities'
					value={roomData.amenities}
					onChange={handleChange}
					className='input'
					placeholder='Amenities'
				/>
				<input
					type='text'
					name='image_url'
					value={roomData.image_url}
					onChange={handleChange}
					className='input'
					placeholder='Image URL'
				/>

				<div className='flex gap-2 mt-4'>
					<button
						type='button'
						onClick={onCancel}
						className='bg-gray-300 px-3 py-1 rounded'>
						Cancel
					</button>
					<button type='submit' className='bg-blue-500 text-white px-3 py-1 rounded'>
						Update Room
					</button>
				</div>
			</form>
		</div>
	);
}

export default EditRoom;
