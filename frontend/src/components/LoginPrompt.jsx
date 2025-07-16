import React from 'react';

function LoginPrompt({ onLogin, onRegister, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-md w-full">
        <div className="text-center">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to book a room. Please login or create an account to continue.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={onLogin}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            >
              Login to Your Account
            </button>
            
            <button
              onClick={onRegister}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            >
              Create New Account
            </button>
            
            <button
              onClick={onClose}
              className="w-full bg-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPrompt;
