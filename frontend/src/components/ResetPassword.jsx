import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function ResetPassword() {
	const [searchParams] = useSearchParams();
	const token = searchParams.get('token');
	const [newPassword, setNewPassword] = useState('');
	const [message, setMessage] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!newPassword) {
			setMessage('Please enter a new password');
			return;
		}

		try {
			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/api/reset-password`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ token, newPassword }),
				},
			);

			const data = await res.json();
			if (!res.ok) throw new Error(data.message);
			setMessage('Password reset successful. Redirecting to login...');
			setTimeout(() => navigate('/login'), 2000);
		} catch (err) {
			setMessage(err.message);
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-100'>
			<div className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-md'>
				<h2 className='text-2xl font-bold text-center mb-4'>Reset Password</h2>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<input
						type='password'
						placeholder='New Password'
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						className='input'
					/>
					{message && <p className='text-red-500 text-sm'>{message}</p>}
					<button
						type='submit'
						className='w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600'>
						Reset Password
					</button>
				</form>
			</div>
		</div>
	);
}

export default ResetPassword;
