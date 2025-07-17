-- Create rooms table
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    room_type VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL,
    price_per_night DECIMAL(10, 2) NOT NULL,
    amenities TEXT,
    image_url VARCHAR(255)
);

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'guest'
);

-- Create bookings table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    room_id INTEGER NOT NULL,
    checkin_date DATE NOT NULL,
    checkout_date DATE NOT NULL,
    number_of_guests INTEGER NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- Create room_images table
CREATE TABLE room_images (
    id SERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    display_order INTEGER NOT NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);
