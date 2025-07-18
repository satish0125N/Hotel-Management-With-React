import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setMessage('');
		setError('');

		if (!email) {
			setError('Please enter your email');
			return;
		}

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/request-password-reset`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email }),
				},
			);

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.message || 'Failed to send reset link');
			}

			setMessage('Password reset link sent to your email');
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-100'>
			<div className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-md'>
				<button
					onClick={() => navigate('/login')}
					className='text-blue-500 hover:text-blue-700 mb-4 flex items-center gap-1 text-sm'>
					<span className='text-lg'>&larr;</span> Back to Login
				</button>

				<h2 className='text-2xl font-bold text-center text-gray-800 mb-6'>
					Forgot Password 🔑
				</h2>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<input
						type='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder='Your registered email'
						className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
					/>
					{message && <p className='text-green-500 text-sm'>{message}</p>}
					{error && <p className='text-red-500 text-sm'>{error}</p>}
					<button
						type='submit'
						className='w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition'>
						Send Reset Link
					</button>
				</form>
			</div>
		</div>
	);
}

export default ForgotPassword;
