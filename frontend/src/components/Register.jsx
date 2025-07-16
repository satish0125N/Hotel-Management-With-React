import React, { useState } from 'react';

function Register({ onRegister, onSwitchToLogin }) {
	const [formData, setFormData] = useState({
		username: '',
		password: '',
		email: '',
		full_name: '',
		phone: '',
		address: '',
		date_of_birth: '',
	});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/users/register`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(formData),
				},
			);

			const data = await response.json();

			if (response.ok) {
				localStorage.setItem('token', data.token);
				localStorage.setItem('user', JSON.stringify(data.user));
				onRegister(data.user, data.token);
			} else {
				setError(data.message || 'Registration failed');
			}
		} catch (error) {
			setError('Network error. Please try again.');
			console.error('Registration error:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='space-y-8'>
			<div className='max-w-md w-full space-y-8'>
				<div className='relative'>
					<button
						onClick={onSwitchToLogin}
						className='absolute top-0 right-0 text-gray-400 hover:text-gray-600'>
						<svg
							className='h-6 w-6'
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
					<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
						Create your account
					</h2>
				</div>
				<form className='mt-8 space-y-6' onSubmit={handleSubmit}>
					{error && (
						<div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
							{error}
						</div>
					)}
					<div className='space-y-4'>
						<div>
							<label
								htmlFor='username'
								className='block text-sm font-medium text-gray-700'>
								Username
							</label>
							<input
								id='username'
								name='username'
								type='text'
								required
								className='mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
								placeholder='Username'
								value={formData.username}
								onChange={handleChange}
							/>
						</div>
						<div>
							<label
								htmlFor='email'
								className='block text-sm font-medium text-gray-700'>
								Email
							</label>
							<input
								id='email'
								name='email'
								type='email'
								required
								className='mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
								placeholder='Email'
								value={formData.email}
								onChange={handleChange}
							/>
						</div>
						<div>
							<label
								htmlFor='full_name'
								className='block text-sm font-medium text-gray-700'>
								Full Name
							</label>
							<input
								id='full_name'
								name='full_name'
								type='text'
								required
								className='mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
								placeholder='Full Name'
								value={formData.full_name}
								onChange={handleChange}
							/>
						</div>
						<div>
							<label
								htmlFor='phone'
								className='block text-sm font-medium text-gray-700'>
								Phone
							</label>
							<input
								id='phone'
								name='phone'
								type='tel'
								className='mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
								placeholder='Phone'
								value={formData.phone}
								onChange={handleChange}
							/>
						</div>
						<div>
							<label
								htmlFor='address'
								className='block text-sm font-medium text-gray-700'>
								Address
							</label>
							<textarea
								id='address'
								name='address'
								rows='3'
								className='mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
								placeholder='Address'
								value={formData.address}
								onChange={handleChange}
							/>
						</div>
						<div>
							<label
								htmlFor='date_of_birth'
								className='block text-sm font-medium text-gray-700'>
								Date of Birth
							</label>
							<input
								id='date_of_birth'
								name='date_of_birth'
								type='date'
								className='mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
								value={formData.date_of_birth}
								onChange={handleChange}
							/>
						</div>
						<div>
							<label
								htmlFor='password'
								className='block text-sm font-medium text-gray-700'>
								Password
							</label>
							<input
								id='password'
								name='password'
								type='password'
								required
								className='mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
								placeholder='Password'
								value={formData.password}
								onChange={handleChange}
							/>
						</div>
					</div>

					<div>
						<button
							type='submit'
							disabled={loading}
							className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'>
							{loading ? 'Creating account...' : 'Create account'}
						</button>
					</div>

					<div className='text-center'>
						<button
							type='button'
							onClick={onSwitchToLogin}
							className='text-indigo-600 hover:text-indigo-500'>
							Already have an account? Sign in
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Register;
