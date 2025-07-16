# Hotel Management System

A comprehensive hotel management system built with React (frontend) and Node.js (backend) with MySQL database, featuring role-based access control and modern booking functionality.

## Features

### User Features
- **User Registration & Login**: Secure authentication system with JWT tokens
- **Room Browsing**: View available rooms with detailed information, images, and amenities
- **Room Booking**: Book rooms with date selection and guest count
- **Pay on Arrival**: Payment is handled on-site upon check-in
- **Booking History**: View personal booking history and details

### Admin Features
- **Admin Dashboard**: Comprehensive overview of bookings, revenue, and occupancy rates
- **Room Management**: Add, edit, and delete rooms with full CRUD operations
- **Booking Management**: View all bookings across the system with guest details
- **Role-Based Access**: Admin-only features protected by authentication middleware
- **Statistics & Analytics**: Track hotel performance with real-time data

### Technical Features
- **JWT Authentication**: Secure token-based authentication with role management
- **Role-Based Access Control**: Different permissions for admin and guest users
- **Responsive Design**: Fully responsive design that works on desktop and mobile
- **Real-time Updates**: Dynamic data updates without page refresh
- **Input Validation**: Comprehensive validation on both client and server sides
- **Error Handling**: Proper error handling and user feedback

## Database Schema

The system uses the following database tables:
- `users` - User accounts with role-based access (admin/guest)
- `rooms` - Room information with pricing, amenities, and images
- `bookings` - Booking records with guest, room, and payment details
- `hotel_info` - Hotel information and settings
- `password_resets` - Password reset tokens for security

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL database server
- WAMP/XAMPP (for local development)
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update database configuration in `index_improved.js`:
   ```javascript
   const dbConfig = {
     host: "localhost",
     user: "root",
     password: "", // Your MySQL password
     database: "hotel_mgt",
   };
   ```

4. Start the backend server:
   ```bash
   node index_improved.js
   ```
   The server will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

### Database Setup

1. Create the database `hotel_mgt` in MySQL
2. Import the existing database schema and sample data
3. Ensure your MySQL server is running on localhost:3306

## Usage Guide

### For Guests
1. **Registration**: Create a new account with username, email, and personal details
2. **Login**: Sign in with your credentials
3. **Browse Rooms**: View available rooms with images, pricing, and amenities
4. **Book Room**: Click "Book Now" and select check-in/check-out dates
5. **Confirm Booking**: Review details and confirm (payment on arrival)
6. **View Bookings**: Check your booking history and details

### For Administrators
1. **Login**: Sign in with admin credentials
2. **Dashboard**: View statistics including total rooms, bookings, revenue, and occupancy
3. **Room Management**: Add new rooms or edit existing ones
4. **Booking Management**: View all bookings with guest information
5. **User Management**: Monitor registered users and their activities

## Default Admin Account

Use the following credentials to access admin features:
- Username: `admin`
- Password: (as configured in your database)

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login

### Rooms (Public routes for viewing, Admin routes for management)
- `GET /api/rooms` - Get all rooms (public)
- `GET /api/rooms/:id` - Get specific room (public)
- `POST /api/rooms` - Add new room (admin only)
- `PUT /api/rooms/:id` - Update room (admin only)
- `DELETE /api/rooms/:id` - Delete room (admin only)

### Bookings (Authenticated routes)
- `GET /api/bookings` - Get bookings (user sees own, admin sees all)
- `POST /api/bookings` - Create new booking (authenticated users)

### Hotel Information
- `GET /api/hotel-info` - Get hotel information

## Security Features

- **JWT Authentication**: Secure token-based authentication system
- **Password Hashing**: bcrypt for secure password storage
- **Role-Based Access**: Admin and guest roles with different permissions
- **Input Validation**: Server-side validation for all inputs
- **Protected Routes**: API endpoints protected with authentication middleware
- **CORS Configuration**: Proper cross-origin resource sharing setup

## Technologies Used

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Vite**: Fast build tool and development server

### Backend
- **Node.js**: JavaScript runtime for server-side development
- **Express.js**: Web application framework
- **MySQL2**: MySQL database driver with connection pooling
- **JWT (jsonwebtoken)**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing and security
- **CORS**: Cross-origin resource sharing middleware

## Improvements Made

1. **Authentication System**: Added JWT-based authentication with role management
2. **Role-Based Access**: Implemented admin and guest roles with appropriate permissions
3. **Booking System**: Created comprehensive booking functionality with date selection
4. **Admin Dashboard**: Built analytics dashboard with booking and revenue statistics
5. **Security**: Added password hashing, input validation, and protected routes
6. **User Experience**: Improved UI/UX with better navigation and responsive design
7. **Database Integration**: Enhanced database schema with proper relationships
8. **Error Handling**: Comprehensive error handling and user feedback

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support or questions, please contact the development team or create an issue in the repository.
