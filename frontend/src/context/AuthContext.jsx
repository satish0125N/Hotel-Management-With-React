// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const storedUser = JSON.parse(localStorage.getItem('user'));
		if (storedUser) setUser(storedUser);
	}, []);

	const login = (userData) => {
		setUser(userData);
		localStorage.setItem('user', JSON.stringify(userData));
		localStorage.setItem('token', userData.token);
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem('user');
		localStorage.removeItem('token');
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
