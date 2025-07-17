const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;

// Database connection details
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false,
	},
});

// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS for all origins
app.use(cors());

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	console.log('Auth headers received:', {
		hasAuthHeader: !!authHeader,
		token: token ? 'present' : 'missing',
	});

	if (!token) {
		return res.status(401).json({ message: 'Access token required' });
	}

	jwt.verify(token, JWT_SECRET, (err, user) => {
		if (err) {
			return res.status(403).json({ message: 'Invalid token' });
		}
		req.user = user;
		next();
	});
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
	console.log('Checking admin rights for user:', {
		userRole: req.user.role,
		userId: req.user.id,
		username: req.user.username,
	});

	if (req.user.role !== 'admin') {
		console.log('Access denied: User is not admin');
		return res.status(403).json({ message: 'Admin access required' });
	}
	console.log('Admin access granted');
	next();
};

// Middleware to log incoming requests to /api
app.use('/api', (req, res, next) => {
	console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
	next();
});

// Basic route for testing
app.get('/', (req, res) => {
	res.send('Hotel Management Backend is running!');
});

// API endpoint to get all rooms (public for users to view)
app.get('/api/rooms', async (req, res) => {
	try {
		// First get all rooms
		const [rooms] = await pool.promise().query('SELECT * FROM rooms');

		// Then get all images for all rooms
		const [images] = await pool
			.promise()
			.query('SELECT * FROM room_images ORDER BY display_order');

		// Map images to their respective rooms
		const roomsWithImages = rooms.map((room) => ({
			...room,
			image_urls: images
				.filter((img) => img.room_id === room.id)
				.map((img) => img.image_url),
		}));

		res.json(roomsWithImages);
	} catch (err) {
		console.error('Error fetching rooms:', err);
		res.status(500).json({ message: 'Error fetching rooms' });
	}
});

// API endpoint to get a single room by ID (public for users to view)
app.get('/api/rooms/:id', async (req, res) => {
	const roomId = req.params.id;

	try {
		// Get room details
		const [rooms] = await pool
			.promise()
			.query('SELECT * FROM rooms WHERE id = ?', [roomId]);

		if (rooms.length === 0) {
			return res.status(404).json({ message: 'Room not found' });
		}

		// Get room images
		const [images] = await pool
			.promise()
			.query(
				'SELECT image_url FROM room_images WHERE room_id = ? ORDER BY display_order',
				[roomId],
			);

		// Combine room data with images
		const roomWithImages = {
			...rooms[0],
			image_urls: images.map((img) => img.image_url),
		};

		res.json(roomWithImages);
	} catch (err) {
		console.error('Error fetching room:', err);
		res.status(500).json({ message: 'Error fetching room' });
	}
});

// API endpoint to update a room (admin only)
app.put('/api/rooms/:id', authenticateToken, isAdmin, async (req, res) => {
	const roomId = req.params.id;
	const { room_type, capacity, price_per_night, amenities, image_urls } =
		req.body;

	if (!room_type || !capacity || !price_per_night) {
		return res
			.status(400)
			.json({ message: 'Room type, capacity, and price are required' });
	}

	const connection = await pool.promise().getConnection();

	try {
		// Start a transaction
		await connection.beginTransaction();

		// Update room details
		const updatedRoom = {
			room_type,
			capacity,
			price_per_night,
			amenities,
			image_url: image_urls && image_urls.length > 0 ? image_urls[0] : null, // Keep first image as main image
		};

		await connection.query('UPDATE rooms SET ? WHERE id = ?', [
			updatedRoom,
			roomId,
		]);

		// Delete existing images
		await connection.query('DELETE FROM room_images WHERE room_id = ?', [roomId]);

		// Insert new images
		if (image_urls && image_urls.length > 0) {
			const imageValues = image_urls.map((url, index) => [roomId, url, index]);
			await connection.query(
				'INSERT INTO room_images (room_id, image_url, display_order) VALUES ?',
				[imageValues],
			);
		}

		// Commit the transaction
		await connection.commit();

		res.status(200).json({ message: 'Room updated successfully' });
	} catch (err) {
		// Rollback in case of error
		await connection.rollback();
		console.error('Error updating room:', err);
		res.status(500).json({ message: 'Error updating room' });
	} finally {
		connection.release(); // Always release the connection
	}
});

// API endpoint to add a new room (admin only)
app.post('/api/rooms', authenticateToken, isAdmin, async (req, res) => {
	console.log('Received POST request to /api/rooms');
	const { room_type, capacity, price_per_night, amenities, image_urls } =
		req.body;

	if (!room_type || !capacity || !price_per_night) {
		return res
			.status(400)
			.json({ message: 'Room type, capacity, and price are required' });
	}

	const connection = await pool.promise().getConnection();

	try {
		// Start a transaction
		await connection.beginTransaction();

		// Create room
		const newRoom = {
			room_type,
			capacity,
			price_per_night,
			amenities,
			image_url: image_urls && image_urls.length > 0 ? image_urls[0] : null, // Keep first image as main image
		};

		const [result] = await connection.query('INSERT INTO rooms SET ?', newRoom);
		const roomId = result.insertId;

		// Insert images if any
		if (image_urls && image_urls.length > 0) {
			const imageValues = image_urls.map((url, index) => [roomId, url, index]);
			await connection.query(
				'INSERT INTO room_images (room_id, image_url, display_order) VALUES ?',
				[imageValues],
			);
		}

		// Commit the transaction
		await connection.commit();

		res.status(201).json({
			message: 'Room added successfully',
			roomId: roomId,
		});
	} catch (err) {
		// Rollback in case of error
		await connection.rollback();
		console.error('Error adding room:', err);
		res.status(500).json({ message: 'Error adding room' });
	} finally {
		connection.release(); // Always release the connection
	}
});

// API endpoint to delete a room (admin only)
app.delete('/api/rooms/:id', authenticateToken, isAdmin, (req, res) => {
	const roomId = req.params.id;

	pool.query('DELETE FROM rooms WHERE id = ?', [roomId], (err, results) => {
		if (err) {
			console.error('Error deleting room:', err);
			res.status(500).json({ message: 'Error deleting room' });
			return;
		}

		if (results.affectedRows === 0) {
			return res.status(404).json({ message: 'Room not found' });
		}

		res.status(200).json({ message: 'Room deleted successfully' });
	});
});

// API endpoints for bookings
app.get('/api/bookings', authenticateToken, (req, res) => {
	let query =
		'SELECT b.*, r.room_type, r.price_per_night, u.username FROM bookings b JOIN rooms r ON b.room_id = r.id JOIN users u ON b.user_id = u.id';

	// If user is not admin, only show their bookings
	if (req.user.role !== 'admin') {
		query += ' WHERE b.user_id = ?';
		pool.query(query, [req.user.id], (err, results) => {
			if (err) {
				console.error('Error fetching bookings:', err);
				res.status(500).send('Error fetching bookings');
				return;
			}
			res.json(results);
		});
	} else {
		pool.query(query, (err, results) => {
			if (err) {
				console.error('Error fetching bookings:', err);
				res.status(500).send('Error fetching bookings');
				return;
			}
			res.json(results);
		});
	}
});

app.post('/api/bookings', authenticateToken, (req, res) => {
	const { room_id, checkin_date, checkout_date, number_of_guests, total_price } =
		req.body;

	if (
		!room_id ||
		!checkin_date ||
		!checkout_date ||
		!number_of_guests ||
		!total_price
	) {
		return res.status(400).json({ message: 'All booking fields are required' });
	}

	const newBooking = {
		user_id: req.user.id,
		room_id,
		checkin_date,
		checkout_date,
		number_of_guests,
		total_price,
	};

	pool.query('INSERT INTO bookings SET ?', newBooking, (err, results) => {
		if (err) {
			console.error('Error creating booking:', err);
			res.status(500).send('Error creating booking');
			return;
		}
		res.status(201).json({
			message: 'Booking created successfully',
			bookingId: results.insertId,
		});
	});
});

// User registration
app.post('/api/users/register', (req, res) => {
	const { username, password, email, full_name, phone, address, date_of_birth } =
		req.body;

	if (!username || !password || !email || !full_name) {
		return res.status(400).json({
			message: 'Username, password, email, and full name are required',
		});
	}

	// Check if user already exists
	pool.query(
		'SELECT id FROM users WHERE username = ? OR email = ?',
		[username, email],
		(err, results) => {
			if (err) {
				console.error('Error checking for existing user:', err);
				return res.status(500).send('Error registering user');
			}

			if (results.length > 0) {
				return res
					.status(409)
					.json({ message: 'Username or email already exists' });
			}

			// Hash the password
			bcrypt.hash(password, 10, (err, hashedPassword) => {
				if (err) {
					console.error('Error hashing password:', err);
					return res.status(500).send('Error registering user');
				}

				// Insert new user into the database
				pool.query(
					'INSERT INTO users (username, password, email, full_name, phone, address, date_of_birth, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
					[
						username,
						hashedPassword,
						email,
						full_name,
						phone,
						address,
						date_of_birth,
						'guest',
					],
					(err, results) => {
						if (err) {
							console.error('Error inserting new user:', err);
							return res.status(500).send('Error registering user');
						}

						const token = jwt.sign(
							{ id: results.insertId, username, role: 'guest' },
							JWT_SECRET,
							{ expiresIn: '1h' },
						);

						res.status(201).json({
							message: 'User registered successfully',
							userId: results.insertId,
							token,
							user: { username, role: 'guest' },
						});
					},
				);
			});
		},
	);
});

// User login
app.post('/api/users/login', (req, res) => {
	const { username, password } = req.body;
	console.log('Login request received:', {
		username,
		passwordProvided: !!password,
	});

	if (!username || !password) {
		console.log('Missing username or password');
		return res
			.status(400)
			.json({ message: 'Username and password are required' });
	}

	// Find the user by username
	console.log('Login attempt for username:', username);
	pool.query(
		'SELECT id, username, password, role FROM users WHERE username = ?',
		[username],
		(err, results) => {
			if (err) {
				console.error('Error finding user:', err);
				return res.status(500).send('Error logging in');
			}

			if (results.length === 0) {
				console.log('No user found with username:', username);
				return res.status(401).json({ message: 'Invalid username or password' });
			}

			console.log('User found:', {
				username: results[0].username,
				role: results[0].role,
				passwordLength: results[0].password.length,
				isPasswordHashed: results[0].password.startsWith('$2'), // Check if it's a bcrypt hash
			});

			const user = results[0];

			// Compare the provided password with the hashed password in the database
			bcrypt.compare(password, user.password, (err, isMatch) => {
				if (err) {
					console.error('Error comparing passwords:', err);
					return res.status(500).send('Error logging in');
				}

				console.log('Password comparison result:', isMatch);

				if (!isMatch) {
					console.log('Password does not match');
					return res.status(401).json({ message: 'Invalid username or password' });
				}

				// Passwords match, login successful
				const token = jwt.sign(
					{ id: user.id, username: user.username, role: user.role },
					JWT_SECRET,
					{ expiresIn: '1h' },
				);

				res.status(200).json({
					message: 'Login successful',
					userId: user.id,
					token,
					user: { username: user.username, role: user.role },
				});
			});
		},
	);
});

// Get hotel information
app.get('/api/hotel-info', (req, res) => {
	pool.query('SELECT * FROM hotel_info LIMIT 1', (err, results) => {
		if (err) {
			console.error('Error fetching hotel info:', err);
			res.status(500).json({ message: 'Error fetching hotel info' });
			return;
		}
		res.json(results[0] || {});
	});
});

// Start the server
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

// Error handling for database connection
pool.getConnection((err, connection) => {
	if (err) {
		console.error('Database connection failed:', err.stack);
		return;
	}
	console.log('Connected to database as ID', connection.threadId);
	connection.release(); // Release the connection back to the pool
});
