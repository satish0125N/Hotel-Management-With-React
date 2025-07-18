import React, { useState } from 'react';

function BookingForm({ room, onCancel, onBookingConfirmed }) {
	const [formData, setFormData] = useState({
		username: '',
		checkin_date: '',
		checkout_date: '',
		number_of_guests: 1,
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const payload = {
				...formData,
				room_id: room.id,
				total_price:
					Number(room.price_per_night) *
					((new Date(formData.checkout_date) - new Date(formData.checkin_date)) /
						(1000 * 60 * 60 * 24)),
			};

			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/bookings`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(payload),
				},
			);

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.message || 'Booking failed');
			}

			alert('Booking successful!');
			onBookingConfirmed();
		} catch (error) {
			console.error('Booking error:', error);
			alert(error.message);
		}
	};

	return (
		<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
			<div className='bg-white p-6 rounded shadow-md w-full max-w-md'>
				<h2 className='text-xl font-bold mb-4'>Book {room.room_type}</h2>

				<form onSubmit={handleSubmit} className='space-y-3'>
					<input
						type='text'
						name='username'
						value={formData.username}
						onChange={handleChange}
						className='input w-full'
						placeholder='Your Name'
						required
					/>
					<input
						type='date'
						name='checkin_date'
						value={formData.checkin_date}
						onChange={handleChange}
						className='input w-full'
						required
					/>
					<input
						type='date'
						name='checkout_date'
						value={formData.checkout_date}
						onChange={handleChange}
						className='input w-full'
						required
					/>
					<input
						type='number'
						name='number_of_guests'
						value={formData.number_of_guests}
						onChange={handleChange}
						className='input w-full'
						min={1}
						required
					/>

					<div className='flex gap-2 mt-4'>
						<button
							type='button'
							onClick={onCancel}
							className='bg-gray-300 px-3 py-1 rounded'>
							Cancel
						</button>
						<button
							type='submit'
							className='bg-green-500 text-white px-3 py-1 rounded'>
							Confirm Booking
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default BookingForm;
