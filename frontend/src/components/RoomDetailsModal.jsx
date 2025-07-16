import React, { useState } from 'react';

function RoomDetailsModal({ room, onClose, onBookRoom, isLoggedIn }) {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	if (!room) return null;

	// Get images from the image_urls array or fallback to single image_url
	const images = room.image_urls || (room.image_url ? [room.image_url] : []);

	const nextImage = () => {
		setCurrentImageIndex((prevIndex) =>
			prevIndex === images.length - 1 ? 0 : prevIndex + 1,
		);
	};

	const prevImage = () => {
		setCurrentImageIndex((prevIndex) =>
			prevIndex === 0 ? images.length - 1 : prevIndex - 1,
		);
	};

	const goToImage = (index) => {
		setCurrentImageIndex(index);
	};

	const translateX = -(currentImageIndex * 100);
	const wrapperWidth = `${images.length * 100}%`;
	const singleSlideWidth = `${100 / images.length}%`;

	// Parse amenities if it's a string
	const amenitiesList =
		typeof room.amenities === 'string'
			? room.amenities.split(',').map((item) => item.trim())
			: [];

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4'>
			<div className='bg-white rounded-lg sm:rounded-2xl max-w-4xl w-full h-full sm:h-auto sm:max-h-[90vh] overflow-hidden shadow-2xl flex flex-col'>
				{/* Header */}
				<div className='flex items-center justify-between p-4 sm:p-6 border-b flex-shrink-0'>
					<h2 className='text-lg sm:text-2xl font-bold text-gray-800 truncate pr-2'>
						{room.room_type}
					</h2>
					<button
						onClick={onClose}
						className='text-gray-400 hover:text-gray-600 transition-colors p-1'>
						<svg
							className='h-5 w-5 sm:h-6 sm:w-6'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M6 18L18 6M6 6l12 12'
							/>
						</svg>
					</button>
				</div>

				{/* Content */}
				<div className='flex flex-col lg:flex-row flex-1 overflow-hidden'>
					{/* Image Carousel */}
					{/* Image Carousel */}
					<div className='lg:w-1/2 relative'>
						{images.length > 0 ? (
							<div className='relative h-48 sm:h-64 lg:h-full bg-gray-100'>
								<div className='absolute inset-0'>
									<div className='relative h-full w-full overflow-hidden'>
										<div
											className='flex h-full transition-transform duration-300 ease-in-out'
											style={{
												transform: `translateX(-${
													((currentImageIndex * currentImageIndex) / 2) * 100
												}%)`,
												width: `${images.length * 100}%`,
											}}>
											{images.map((image, index) => (
												<div
													key={index}
													className='h-full'
													style={{ width: `${(images.length * 100) / images.length}%` }}>
													<img
														src={image}
														alt={`${room.room_type} - Image ${index + 1}`}
														className='w-full h-full object-cover'
														onError={(e) => {
															e.target.onerror = null;
															e.target.src =
																'https://via.placeholder.com/400x300?text=Image+Not+Found';
														}}
													/>
												</div>
											))}
										</div>
									</div>
								</div>

								{/* Navigation Arrows */}
								{images.length > 1 && (
									<>
										<button
											onClick={prevImage}
											className='absolute left-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all z-10'>
											<svg
												className='h-5 w-5 text-gray-700'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M15 19l-7-7 7-7'
												/>
											</svg>
										</button>
										<button
											onClick={nextImage}
											className='absolute right-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all z-10'>
											<svg
												className='h-5 w-5 text-gray-700'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M9 5l7 7-7 7'
												/>
											</svg>
										</button>
									</>
								)}

								{/* Image Indicators */}
								{images.length > 1 && (
									<div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10'>
										{images.map((_, index) => (
											<button
												key={index}
												onClick={() => goToImage(index)}
												className={`w-3 h-3 rounded-full transition-all ${
													index === currentImageIndex
														? 'bg-white'
														: 'bg-white bg-opacity-50 hover:bg-opacity-75'
												}`}
											/>
										))}
									</div>
								)}

								{/* Price Badge */}
								<div className='absolute top-2 right-2 sm:top-4 sm:right-4 bg-green-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-full font-bold text-xs sm:text-sm z-10'>
									₹{room.price_per_night}/night
								</div>
							</div>
						) : (
							<div className='h-64 lg:h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center'>
								<span className='text-gray-500 text-lg'>No images available</span>
							</div>
						)}
					</div>

					{/* Details Panel */}
					<div className='lg:w-1/2 p-4 sm:p-6 overflow-y-auto flex-1'>
						<div className='space-y-4 sm:space-y-6'>
							{/* Basic Info */}
							<div className='flex items-center justify-between'>
								<div className='flex items-center space-x-4'>
									<div className='flex items-center'>
										<svg
											className='h-5 w-5 text-gray-500 mr-2'
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
										<span className='text-green-600 font-medium'>Available</span>
									</div>
								</div>
							</div>

							{/* Amenities */}
							{amenitiesList.length > 0 && (
								<div>
									<h3 className='text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3'>
										Amenities
									</h3>
									<div className='grid grid-cols-1 gap-2'>
										{amenitiesList.map((amenity, index) => (
											<div key={index} className='flex items-center'>
												<svg
													className='h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-2 flex-shrink-0'
													fill='currentColor'
													viewBox='0 0 20 20'>
													<path
														fillRule='evenodd'
														d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
														clipRule='evenodd'
													/>
												</svg>
												<span className='text-gray-700 text-xs sm:text-sm'>{amenity}</span>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Room Features */}
							<div>
								<h3 className='text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3'>
									Room Features
								</h3>
								<div className='space-y-2'>
									<div className='flex items-center'>
										<svg
											className='h-3 w-3 sm:h-4 sm:w-4 text-blue-500 mr-2 flex-shrink-0'
											fill='currentColor'
											viewBox='0 0 20 20'>
											<path
												fillRule='evenodd'
												d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z'
												clipRule='evenodd'
											/>
										</svg>
										<span className='text-gray-700 text-xs sm:text-sm'>
											Premium Room Service
										</span>
									</div>
									<div className='flex items-center'>
										<svg
											className='h-3 w-3 sm:h-4 sm:w-4 text-blue-500 mr-2 flex-shrink-0'
											fill='currentColor'
											viewBox='0 0 20 20'>
											<path
												fillRule='evenodd'
												d='M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z'
												clipRule='evenodd'
											/>
										</svg>
										<span className='text-gray-700 text-xs sm:text-sm'>
											Climate Control
										</span>
									</div>
									<div className='flex items-center'>
										<svg
											className='h-3 w-3 sm:h-4 sm:w-4 text-blue-500 mr-2 flex-shrink-0'
											fill='currentColor'
											viewBox='0 0 20 20'>
											<path
												fillRule='evenodd'
												d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
												clipRule='evenodd'
											/>
										</svg>
										<span className='text-gray-700 text-xs sm:text-sm'>
											Quality Assurance
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className='border-t p-4 sm:p-6 bg-gray-50 flex-shrink-0'>
					<div className='flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0'>
						<div className='text-center sm:text-left'>
							<p className='text-xl sm:text-2xl font-bold text-gray-800'>
								₹{room.price_per_night}
							</p>
							<p className='text-gray-600 text-sm sm:text-base'>per night</p>
						</div>
						<div className='flex flex-col sm:flex-row w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-3'>
							<button
								onClick={onClose}
								className='w-full sm:w-auto px-4 sm:px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm sm:text-base'>
								Close
							</button>

							<button
								onClick={() => {
									if (isLoggedIn) {
										onBookRoom(room);
										onClose();
									} else {
										alert('Please login to book a room');
									}
								}}
								className='w-full sm:w-auto px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base'>
								{isLoggedIn ? 'Book Now' : 'Login to Book'}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default RoomDetailsModal;
