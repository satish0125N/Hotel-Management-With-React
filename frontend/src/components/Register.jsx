import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: '',
		full_name: '',
		phone: '',
		address: '',
	});
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');

		if (
			!formData.username ||
			!formData.email ||
			!formData.password ||
			!formData.full_name
		) {
			setError('Please fill all required fields');
			return;
		}

		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.message || 'Registration failed');
			}

			setSuccess(true);
		} catch (err) {
			setError(err.message);
		}
	};

	const handleLoginRedirect = () => {
		navigate('/login');
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-100'>
			<div className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-md'>
				{!success ? (
					<>
						<button
							onClick={() => navigate('/login')}
							className='text-blue-500 hover:text-blue-700 mb-4 flex items-center gap-1 text-sm'>
							<span className='text-lg'>&larr;</span> Back to Login
						</button>

						<h2 className='text-2xl font-bold text-center text-gray-800 mb-6'>
							Register Your Account
						</h2>

						<form onSubmit={handleSubmit} className='space-y-4'>
							<input
								type='text'
								name='username'
								placeholder='Username *'
								value={formData.username}
								onChange={handleChange}
								className='input'
							/>
							<input
								type='email'
								name='email'
								placeholder='Email *'
								value={formData.email}
								onChange={handleChange}
								className='input'
							/>
							<input
								type='password'
								name='password'
								placeholder='Password *'
								value={formData.password}
								onChange={handleChange}
								className='input'
							/>
							<input
								type='text'
								name='full_name'
								placeholder='Full Name *'
								value={formData.full_name}
								onChange={handleChange}
								className='input'
							/>
							<input
								type='text'
								name='phone'
								placeholder='Phone'
								value={formData.phone}
								onChange={handleChange}
								className='input'
							/>
							<input
								type='text'
								name='address'
								placeholder='Address'
								value={formData.address}
								onChange={handleChange}
								className='input'
							/>

							{error && <p className='text-red-500 text-sm'>{error}</p>}

							<button
								type='submit'
								className='w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition'>
								Register
							</button>
						</form>
					</>
				) : (
					<div className='text-center'>
						<h2 className='text-2xl font-bold text-green-600 mb-4'>
							Registration Successful!
						</h2>
						<h3 className='mb-4'> Please remember your </h3>
						<p className='mb-4'>
							<strong>Username: {formData.username}</strong> and{' '}
							<strong>Password: {formData.password} </strong>
						</p>
						<button
							onClick={handleLoginRedirect}
							className='bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition'>
							Proceed to Login
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

export default Register;
