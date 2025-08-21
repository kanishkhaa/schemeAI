import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Application from './pages/application';
import ProfileForm from './pages/profileform';
import Landing from './pages/landing';
import Profile from './pages/profile';
import Sidebar from './components/sidebar';
import LoginPage from './pages/loginpage';
import SignupPage from './pages/signup';
import Scheme from './pages/scheme';
import Eligibility from './pages/eligibility';
import AccessibilityDialog from './pages/accessibility';
import Chatbot from './components/Chatbot';

function App() {
  const location = useLocation();

  const shouldShowSidebar = !['/', '/login', '/signup'].includes(location.pathname);
  const isLandingPage = location.pathname === '/';

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      {shouldShowSidebar && (
        <div className="w-72 flex-shrink-0">
          <Sidebar isOpen={true} onClose={() => {}} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/application" element={<Application />} />
          <Route path="/profileform" element={<ProfileForm />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/scheme" element={<Scheme />} />
          <Route path="/eligibility" element={<Eligibility />} />
        </Routes>
      </div>

      {/* Accessibility Dialog - exclude landing */}
      {!isLandingPage && <AccessibilityDialog />}

      {/* Chatbot - exclude landing */}
      {!isLandingPage && <Chatbot />}
    </div>
  );
}
export default App;