import React, { useState, useEffect } from 'react';

function AddRoom({ onSave, onCancel, editingRoom }) {
	const [roomData, setRoomData] = useState({
		room_type: '',
		capacity: '',
		price_per_night: '',
		amenities: '',
		image_url: '',
	});

	useEffect(() => {
		if (editingRoom) {
			setRoomData({
				room_type: editingRoom.room_type || '',
				capacity: editingRoom.capacity || '',
				price_per_night: editingRoom.price_per_night || '',
				amenities: editingRoom.amenities || '',
				image_url: editingRoom.image_url || '',
			});
		}
	}, [editingRoom]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setRoomData({ ...roomData, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!roomData.room_type || !roomData.capacity || !roomData.price_per_night) {
			alert('Please fill all required fields');
			return;
		}

		const payload = {
			...roomData,
			capacity: parseInt(roomData.capacity),
			price_per_night: parseFloat(roomData.price_per_night),
		};

		onSave(payload);
	};

	return (
		<div className='bg-white p-4 rounded shadow'>
			<h2 className='text-xl font-bold mb-4'>
				{editingRoom ? 'Edit Room' : 'Add New Room'}
			</h2>
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
						{editingRoom ? 'Update Room' : 'Add Room'}
					</button>
				</div>
			</form>
		</div>
	);
}

export default AddRoom;
