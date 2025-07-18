// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import Login from './pages/Login';
// import AdminDashboard from './pages/AdminDashboard';
// import Rooms from './pages/Rooms';
// import Home from './pages/Home';

// function App() {
// 	return (
// 		<AuthProvider>
// 			<Router>
// 				<Routes>
// 					<Route path='/' element={<Home />} />
// 					<Route path='/login' element={<Login />} />
// 					<Route path='/admin' element={<AdminDashboard />} />
// 					<Route path='/rooms' element={<Rooms />} />
// 				</Routes>
// 			</Router>
// 		</AuthProvider>
// 	);
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import DefaultLayout from './layout/DefaultLayout';
import AdminDashboard from './pages/AdminDashboard';
import Register from './components/Register'; // ✅ Import Register Component
import ForgotPassword from './components/ForgotPassword'; // ✅ If using
import ResetPassword from './components/ResetPassword';
function App() {
	return (
		<AuthProvider>
			<Router>
				<DefaultLayout>
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/login' element={<Login />} />
						<Route path='/admin' element={<AdminDashboard />} />
						<Route path='/register' element={<Register />} /> {/* ✅ */}
						<Route path='/forgot-password' element={<ForgotPassword />} /> {/* ✅ */}
						<Route path='/reset-password' element={<ResetPassword />} />
					</Routes>
				</DefaultLayout>
			</Router>
		</AuthProvider>
	);
}

export default App;
