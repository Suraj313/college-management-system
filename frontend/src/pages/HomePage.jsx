import React from 'react';
import { Link } from 'react-router-dom';

// Ensure your background image is imported
import backgroundImage from '../assets/1.jpg'; 

function HomePage() {
    return (
        // Main container with the background image
        <div 
            className="flex items-center justify-center min-h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            {/* The overlay is now part of the card itself, not needed here */}

            {/* Frosted Glass Card */}
            <div className="text-center p-8 md:p-12 rounded-xl
                           border border-white/20 
                           bg-gray-900/30
                           backdrop-blur-lg 
                           shadow-2xl max-w-lg">
                
                <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
                    Welcome to the College Portal 🏛️
                </h1>
                
                <p className="text-gray-200 mb-8 text-lg">
                    Your central hub for managing courses, attendance, and grades. Please sign in or create an account to continue.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link 
                        to="/login" 
                        className="px-8 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 transition-all duration-300"
                    >
                        Login
                    </Link>
                    <Link 
                        to="/signup" 
                        className="px-8 py-3 font-semibold text-blue-600 bg-white rounded-lg shadow-lg hover:bg-gray-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 focus:ring-offset-gray-900 transition-all duration-300"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default HomePage;