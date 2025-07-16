import React, { useState } from 'react';

function BookingForm({ room, onBookingSuccess, onCancel }) {
	const [bookingData, setBookingData] = useState({
		checkin_date: '',
		checkout_date: '',
		number_of_guests: 1,
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleChange = (e) => {
		const { name, value } = e.target;
		setBookingData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const calculateTotalPrice = () => {
		if (!bookingData.checkin_date || !bookingData.checkout_date) return 0;

		const checkin = new Date(bookingData.checkin_date);
		const checkout = new Date(bookingData.checkout_date);
		const timeDiff = checkout.getTime() - checkin.getTime();
		const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

		return daysDiff > 0 ? daysDiff * room.price_per_night : 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		const totalPrice = calculateTotalPrice();
		if (totalPrice <= 0) {
			setError('Please select valid check-in and check-out dates');
			setLoading(false);
			return;
		}

		try {
			const token = localStorage.getItem('token');
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/bookings`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						room_id: room.id,
						...bookingData,
						total_price: totalPrice,
					}),
				},
			);

			const data = await response.json();

			if (response.ok) {
				onBookingSuccess(data);
			} else {
				setError(data.message || 'Booking failed');
			}
		} catch (error) {
			setError('Network error. Please try again.');
			console.error('Booking error:', error);
		} finally {
			setLoading(false);
		}
	};

	const totalPrice = calculateTotalPrice();

	return (
		<div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center'>
			<div className='bg-white rounded-lg shadow-xl p-6 m-4 max-w-md w-full'>
				<h2 className='text-2xl font-bold mb-4'>Book Room: {room.room_type}</h2>

				{error && (
					<div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<label
							htmlFor='checkin_date'
							className='block text-sm font-medium text-gray-700'>
							Check-in Date
						</label>
						<input
							type='date'
							id='checkin_date'
							name='checkin_date'
							value={bookingData.checkin_date}
							onChange={handleChange}
							min={new Date().toISOString().split('T')[0]}
							className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
							required
						/>
					</div>

					<div>
						<label
							htmlFor='checkout_date'
							className='block text-sm font-medium text-gray-700'>
							Check-out Date
						</label>
						<input
							type='date'
							id='checkout_date'
							name='checkout_date'
							value={bookingData.checkout_date}
							onChange={handleChange}
							min={bookingData.checkin_date || new Date().toISOString().split('T')[0]}
							className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
							required
						/>
					</div>

					<div>
						<label
							htmlFor='number_of_guests'
							className='block text-sm font-medium text-gray-700'>
							Number of Guests
						</label>
						<select
							id='number_of_guests'
							name='number_of_guests'
							value={bookingData.number_of_guests}
							onChange={handleChange}
							className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'>
							{[...Array(room.capacity)].map((_, i) => (
								<option key={i + 1} value={i + 1}>
									{i + 1} Guest{i + 1 > 1 ? 's' : ''}
								</option>
							))}
						</select>
					</div>

					<div className='border-t pt-4'>
						<div className='flex justify-between items-center mb-2'>
							<span className='text-sm text-gray-600'>Price per night:</span>
							<span className='font-medium'>₹{room.price_per_night}</span>
						</div>
						{totalPrice > 0 && (
							<div className='flex justify-between items-center mb-4'>
								<span className='text-lg font-medium'>Total:</span>
								<span className='text-lg font-bold text-green-600'>₹{totalPrice}</span>
							</div>
						)}
					</div>

					<div className='flex space-x-4'>
						<button
							type='submit'
							disabled={loading || totalPrice <= 0}
							className='flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50'>
							{loading ? 'Booking...' : 'Book Now'}
						</button>
						<button
							type='button'
							onClick={onCancel}
							className='flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500'>
							Cancel
						</button>
					</div>
				</form>

				<div className='mt-4 text-sm text-gray-500'>
					<p>Payment: Pay on arrival at the hotel</p>
				</div>
			</div>
		</div>
	);
}

export default BookingForm;
