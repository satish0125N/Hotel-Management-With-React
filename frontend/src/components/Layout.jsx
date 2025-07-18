import React from 'react';
import { Outlet, Link } from 'react-router-dom';

function Layout() {
	return (
		<div className='flex flex-col min-h-screen'>
			<div className='h-16'></div>

			{/* Page Content */}
			<main className='flex-1 p-4'>
				<Outlet />
			</main>

			{/* Footer */}
			<footer className='bg-gray-800 text-white p-4 text-center fixed bottom-0 w-full'>
				© 2025 Hotel Booking. All rights reserved.
			</footer>

			{/* Spacer for Fixed Footer */}
			<div className='h-16'></div>
		</div>
	);
}

export default Layout;
