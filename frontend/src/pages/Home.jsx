import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
function Home() {
	const [rooms, setRooms] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	const BASE_URL =
	import.meta.env.VITE_API_URL || 'https://hotel-backend-woad.vercel.app';
	const res = await fetch(`${BASE_URL}/api/public-rooms`);
	console.log('++++' + res);
	useEffect(() => {
		const fetchRooms = async () => {
			try {
				const res = await fetch(`${import.meta.env.VITE_API_URL}/api/public-rooms`);
				const data = await res.json();
				setRooms(data);
			} catch (err) {
				console.error('Error fetching public rooms:', err);
			} finally {
				setLoading(false);
			}
		};

		fetchRooms();
	}, []);

	if (loading) return <div className='text-center p-10'>Loading...</div>;

	return (
		<div className='flex flex-col min-h-screen'>
			<main className='flex-1 p-6'>
				<section className='mb-8 text-center'>
					<h2 className='text-3xl font-bold mb-2'>Welcome to Our Hotel!</h2>
					<p className='text-gray-600 max-w-xl mx-auto'>
						Experience luxury & comfort. Book your room now!
					</p>
				</section>

				<section>
					<h3 className='text-2xl font-semibold mb-4'>Available Rooms</h3>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
						{rooms.map((room) => (
							<div key={room.id} className='border border-gray-400 rounded-lg shadow'>
								<img
									src={room.image_url}
									alt={room.room_type}
									className='w-full h-40 object-cover rounded-t'
								/>
								<div className='p-4'>
									<h4 className='text-lg font-bold'>{room.room_type}</h4>
									<p className='text-black-600'>
										<b>Room Capacity: </b>
										{room.capacity}
									</p>
									<p className='text-black-600'>
										<b>Price: </b>${room.price_per_night} / Per Night
									</p>
									<p className='text-black-600'>
										<b>Amenities: </b>
										{room.amenities}
									</p>
									<button
										onClick={() => navigate('/login')}
										className='bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600'>
										Book Now
									</button>
								</div>
							</div>
						))}
					</div>
				</section>
			</main>
		</div>
	);
}

export default Home;
