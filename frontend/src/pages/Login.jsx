import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');

		if (!username || !password) {
			setError('Please enter username and password');
			return;
		}

		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password }),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.message || 'Login failed');
			}

			const data = await response.json();
			localStorage.setItem('token', data.token);

			const payload = JSON.parse(atob(data.token.split('.')[1]));

			if (payload.role === 'admin') {
				navigate('/admin');
			} else {
				navigate('/');
			}
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-100'>
			<div className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-md'>
				<button
					onClick={() => navigate('/')}
					className='text-blue-500 hover:text-blue-700 mb-4 flex items-center gap-1 text-sm'>
					<span className='text-lg'>&larr;</span> Back to Home
				</button>

				<h2 className='text-2xl font-bold text-center text-gray-800 mb-6'>
					Welcome Back 👋
				</h2>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<input
						type='text'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						placeholder='Username'
						className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
					/>
					<input
						type='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder='Password'
						className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
					/>
					{error && <p className='text-red-500 text-sm'>{error}</p>}
					<button
						type='submit'
						className='w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition'>
						Login
					</button>
				</form>

				<div className='mt-4 text-center text-sm space-y-1'>
					<p>
						Don't have an account?{' '}
						<Link to='/register' className='text-blue-500 hover:underline'>
							Register
						</Link>
					</p>
					<p>
						<Link to='/forgot-password' className='text-blue-500 hover:underline'>
							Forgot Password?
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

export default Login;
