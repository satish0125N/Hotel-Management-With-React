import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Header() {
	const [user, setUser] = useState(null);
	const navigate = useNavigate();
	const location = useLocation(); // ✅ To detect route change

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			const payload = JSON.parse(atob(token.split('.')[1]));
			setUser(payload);
		} else {
			setUser(null);
		}
	}, [location]); // ✅ Re-run on every route change

	const handleLogout = () => {
		localStorage.removeItem('token');
		setUser(null);
		navigate('/login');
	};

	return (
		<header className='bg-gray-800 text-white p-4 flex justify-between items-center'>
			<h1 className='text-xl font-bold'>
				<Link to='/'>Hotel Booking</Link>
			</h1>
			<nav className='space-x-4'>
				{user ? (
					<>
						<span>Welcome, {user.username}</span>
						<button onClick={handleLogout} className='hover:underline'>
							Logout
						</button>
					</>
				) : (
					<>
						<Link to='/' className='hover:underline'>
							Home
						</Link>
						<Link to='/login' className='hover:underline'>
							Login
						</Link>
					</>
				)}
			</nav>
		</header>
	);
}

export default Header;
