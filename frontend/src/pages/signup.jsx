import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Lottie from 'lottie-react';
import SignupAnimation from '../assets/login.json';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Handle token from Google OAuth redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      setMessage('Google signup successful!');
      // Redirect to dashboard or home page after a delay
      setTimeout(() => {
        navigate('/profileform'); // Adjust the route as per your app
      }, 2000);
    }
  }, [navigate]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/auth/signup', form, {
        headers: { 'Content-Type': 'application/json' },
      });
      setMessage('Signup successful!');
      localStorage.setItem('token', res.data.token);
      setTimeout(() => {
        navigate('/profileform'); // Adjust the route as per your app
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Signup failed');
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-4xl w-full mx-4 flex flex-col md:flex-row items-center gap-8">
        {/* Lottie Animation */}
        <div className="md:w-1/2 w-full">
          <Lottie animationData={SignupAnimation} loop={true} className="w-full max-w-md mx-auto" />
        </div>

        {/* Signup Form */}
        <div className="md:w-1/2 w-full">
          <h2 className="text-3xl font-bold text-sky-700 mb-6 text-center">Create Your Account</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                required
                className="w-full p-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-200"
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                onChange={handleChange}
                required
                className="w-full p-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-200"
              />
            </div>
            <div>
              <input
                name="phone"
                placeholder="Phone Number"
                onChange={handleChange}
                required
                className="w-full p-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-200"
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
                className="w-full p-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-200"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-sky-600 text-white py-3 rounded-lg hover:bg-sky-700 transition duration-200 font-semibold"
            >
              Sign Up
            </button>
          </form>

          <div className="my-6 text-center text-gray-500 font-medium">OR</div>

          <button
            onClick={handleGoogleSignup}
            className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition duration-200 font-semibold flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147.933-2.627 1.467-4.373 1.467-2.687 0-4.973-1.067-6.667-2.867-1.693-1.8-2.64-4.24-2.64-6.933s.947-5.133 2.64-6.933c1.694-1.8 3.98-2.867 6.667-2.867 2.093 0 3.867.667 5.227 1.92l-2.24 2.24c-.96-1.013-2.213-1.52-3.987-1.52-1.653 0-3.067.693-4.12 1.84-1.053 1.147-1.653 2.707-1.653 4.44s.6 3.293 1.653 4.44c1.053 1.147 2.467 1.84 4.12 1.84 1.413 0 2.56-.373 3.44-1.12.88-.747 1.373-1.84 1.373-3.28h-5.76z" />
            </svg>
            Sign up with Google
          </button>

          <div className="mt-4 text-center">
            <button
              onClick={handleLoginRedirect}
              className="text-sky-600 hover:text-sky-800 font-medium transition duration-200"
            >
              Already have an account? Login
            </button>
          </div>

          {message && (
            <p className={`mt-4 text-center font-medium ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Signup;

