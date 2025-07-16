import { useState, useEffect } from 'react';
import './App.css';
import Rooms from './components/Rooms';
import EditRoom from './components/EditRoom';
import Login from './components/Login';
import Register from './components/Register';
import BookingForm from './components/BookingForm';
import AdminDashboard from './components/AdminDashboard';
import LoginPrompt from './components/LoginPrompt';
import RoomDetailsModal from './components/RoomDetailsModal';

function App() {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(null);
	const [showRegister, setShowRegister] = useState(false);
	const [showLoginPrompt, setShowLoginPrompt] = useState(false);
	const [editingRoomId, setEditingRoomId] = useState(null);
	const [bookingRoom, setBookingRoom] = useState(null);
	const [selectedRoom, setSelectedRoom] = useState(null);
	const [currentView, setCurrentView] = useState('rooms');
	const [pendingBookingRoom, setPendingBookingRoom] = useState(null);

	useEffect(() => {
		// Check if user is already logged in
		const savedToken = localStorage.getItem('token');
		const savedUser = localStorage.getItem('user');

		if (savedToken && savedUser) {
			setToken(savedToken);
			setUser(JSON.parse(savedUser));
		}
	}, []);

	const handleLogin = (userData, userToken) => {
		setUser(userData);
		setToken(userToken);
		setCurrentView('rooms');
		setShowLoginPrompt(false);

		// If there was a pending booking, show it now
		if (pendingBookingRoom) {
			setBookingRoom(pendingBookingRoom);
			setPendingBookingRoom(null);
		}
	};

	const handleRegister = (userData, userToken) => {
		setUser(userData);
		setToken(userToken);
		setShowRegister(false);
		setShowLoginPrompt(false);

		// If there was a pending booking, show it now
		if (pendingBookingRoom) {
			setBookingRoom(pendingBookingRoom);
			setPendingBookingRoom(null);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		setUser(null);
		setToken(null);
		setCurrentView('rooms');
		setBookingRoom(null);
		setPendingBookingRoom(null);
	};

	const handleEditRoom = (roomId) => {
		setEditingRoomId(roomId);
	};

	const handleRoomUpdated = () => {
		setEditingRoomId(null);
	};

	const handleCancelEdit = () => {
		setEditingRoomId(null);
	};

	const handleBookRoom = (room) => {
		if (user) {
			setBookingRoom(room);
		} else {
			setPendingBookingRoom(room);
			setShowLoginPrompt(true);
		}
	};

	const handleBookingSuccess = (bookingData) => {
		setBookingRoom(null);
		alert('Booking successful! You will pay on arrival.');
	};

	const handleBookingCancel = () => {
		setBookingRoom(null);
	};

	const handleLoginPromptLogin = () => {
		setShowLoginPrompt(false);
		setCurrentView('login');
	};

	const handleLoginPromptRegister = () => {
		setShowLoginPrompt(false);
		setShowRegister(true);
	};

	const handleLoginPromptClose = () => {
		setShowLoginPrompt(false);
		setPendingBookingRoom(null);
	};

	const handleViewDetails = (room) => {
		setSelectedRoom(room);
	};

	const handleCloseDetails = () => {
		setSelectedRoom(null);
	};

	// Show login/register modal only when specifically requested
	if (showRegister) {
		return (
			<div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50'>
				<div className='bg-white rounded-lg p-6 max-w-md w-full m-4'>
					<Register
						onRegister={handleRegister}
						onSwitchToLogin={() => setShowRegister(false)}
					/>
				</div>
			</div>
		);
	}

	return (
		<div className='flex flex-col h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 overflow-hidden'>
			<header className='bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-4 md:p-6 shadow-lg flex-shrink-0'>
				<div className='flex items-center justify-between px-4 md:px-6'>
					<h1 className='text-2xl md:text-3xl font-bold tracking-tight'>
						Hotel Management
					</h1>
					<div className='flex items-center space-x-4'>
						{user ? (
							<>
								<span className='text-sm'>Welcome, {user.username}!</span>
								<span className='text-xs bg-blue-500 px-2 py-1 rounded'>
									{user.role === 'admin' ? 'Administrator' : 'Guest'}
								</span>
								<button
									onClick={handleLogout}
									className='bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm'>
									Logout
								</button>
							</>
						) : (
							<>
								<button
									onClick={() => setCurrentView('login')}
									className='bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded text-sm'>
									Login
								</button>
								<button
									onClick={() => setShowRegister(true)}
									className='bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-sm'>
									Register
								</button>
							</>
						)}
					</div>
				</div>
			</header>

			{/* Navigation */}
			<nav className='bg-white shadow-sm border-b flex-shrink-0'>
				<div className='px-4 md:px-6'>
					<div className='flex space-x-8'>
						<button
							onClick={() => setCurrentView('rooms')}
							className={`py-3 px-2 border-b-2 font-medium text-sm ${
								currentView === 'rooms'
									? 'border-indigo-500 text-indigo-600'
									: 'border-transparent text-gray-500 hover:text-gray-700'
							}`}>
							Rooms
						</button>
						{user && user.role === 'admin' && (
							<button
								onClick={() => setCurrentView('dashboard')}
								className={`py-3 px-2 border-b-2 font-medium text-sm ${
									currentView === 'dashboard'
										? 'border-indigo-500 text-indigo-600'
										: 'border-transparent text-gray-500 hover:text-gray-700'
								}`}>
								Dashboard
							</button>
						)}
					</div>
				</div>
			</nav>

			<main className='flex-1 overflow-hidden'>
				<div className='p-4 md:p-6 h-full overflow-y-auto'>
					{currentView === 'login' && !user ? (
						<div className='max-w-md mx-auto mt-8'>
							<Login onLogin={handleLogin} />
							<div className='text-center mt-4'>
								<button
									onClick={() => setShowRegister(true)}
									className='text-indigo-600 hover:text-indigo-500'>
									Don't have an account? Register
								</button>
							</div>
						</div>
					) : currentView === 'dashboard' && user && user.role === 'admin' ? (
						<AdminDashboard />
					) : editingRoomId ? (
						<EditRoom
							roomId={editingRoomId}
							onRoomUpdated={handleRoomUpdated}
							onCancel={handleCancelEdit}
						/>
					) : (
						<div className='space-y-8'>
							<Rooms
								onEditRoom={handleEditRoom}
								onBookRoom={handleBookRoom}
								onViewDetails={handleViewDetails}
								userRole={user?.role}
								isLoggedIn={!!user}
							/>
						</div>
					)}
				</div>
			</main>

			{/* Login Prompt Modal */}
			{showLoginPrompt && (
				<LoginPrompt
					onLogin={handleLoginPromptLogin}
					onRegister={handleLoginPromptRegister}
					onClose={handleLoginPromptClose}
				/>
			)}

			{/* Room Details Modal */}
			{selectedRoom && (
				<RoomDetailsModal
					room={selectedRoom}
					onClose={handleCloseDetails}
					onBookRoom={handleBookRoom}
					isLoggedIn={!!user}
				/>
			)}

			{/* Booking Modal */}
			{bookingRoom && (
				<BookingForm
					room={bookingRoom}
					onBookingSuccess={handleBookingSuccess}
					onCancel={handleBookingCancel}
				/>
			)}

			{/* Footer */}
			<footer className='bg-gray-900 text-white p-4 md:p-6 shadow-inner flex-shrink-0'>
				<div className='text-center px-4 md:px-6'>
					<p className='text-sm md:text-base'>
						© 2023 Hotel Management. All rights reserved.
					</p>
				</div>
			</footer>
		</div>
	);
}

export default App;
