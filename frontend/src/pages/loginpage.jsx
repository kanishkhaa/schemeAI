import React, { useState, useEffect } from 'react';
import { Mail, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import Login from '../assets/login.json';
import axios from 'axios';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Handle token from Google OAuth redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');
    if (token) {
      localStorage.setItem('token', token);
      setMessage('Google login successful!');
      setTimeout(() => {
        navigate('/profileform');
      }, 2000);
    } else if (error) {
      setMessage('Google login failed: ' + error);
    }
  }, [navigate]);

  // Google Sign-In
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      window.google.accounts.id.initialize({
        client_id: "236615308696-6hubivfe1m0k6tmpp424hu4flt4bvjtt.apps.googleusercontent.com",
        callback: handleGoogleCallback,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("googleLoginDiv"),
        { theme: "outline", size: "large" }
      );
    };
    if (window.google) {
      initializeGoogleSignIn();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);
    }
  }, []);

  const handleGoogleCallback = async (response) => {
    setIsLoading(true);
    setMessage('');
    try {
      const res = await axios.post("http://localhost:3000/auth/google", {
        token: response.credential
      }, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.status === 200) {
        localStorage.setItem('token', res.data.token);
        setMessage('Google login successful!');
        setTimeout(() => {
          navigate('/profileform');
        }, 2000);
      } else {
        setMessage(res.data.error || 'Google Sign-In failed');
      }
    } catch (error) {
      console.error("Google Sign-In error:", error);
      setMessage(error.response?.data?.error || 'Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const res = await axios.post("http://localhost:3000/auth/login", {
        email: formData.email,
        password: formData.password
      }, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.status === 200) {
        localStorage.setItem('token', res.data.token);
        setMessage('Login successful!');
        setTimeout(() => {
          navigate('/profileform');
        }, 2000);
      } else {
        setMessage(res.data.error || 'Login failed');
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage(error.response?.data?.error || 'Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-4xl w-full mx-4 flex flex-col md:flex-row items-center gap-8">
        {/* Lottie Animation */}
        <div className="md:w-1/2 w-full">
          <Lottie animationData={Login} loop={true} className="w-full max-w-md mx-auto" />
        </div>

        {/* Login Form */}
        <div className="md:w-1/2 w-full">
          <h2 className="text-3xl font-bold text-sky-700 mb-6 text-center">Sign In to Your Account</h2>

          <div id="googleLoginDiv" className="flex justify-center mb-4"></div>
          <div className="my-6 text-center text-gray-500 font-medium">OR</div>

          {message && (
            <p className={`mb-4 text-center font-medium ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-200 pl-10"
              />
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-200 pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-sky-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-sky-600 text-white py-3 rounded-lg hover:bg-sky-700 transition duration-200 font-semibold disabled:opacity-50"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link
              to="/forgot-password"
              className="text-sky-600 hover:text-sky-800 font-medium transition duration-200"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="mt-2 text-center">
            <Link
              to="/signup"
              className="text-sky-600 hover:text-sky-800 font-medium transition duration-200"
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
