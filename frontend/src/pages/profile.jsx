import React, { useState, useEffect } from 'react';
import { 
  User, MapPin, GraduationCap, Briefcase, Heart, Settings, Edit2, Phone, Mail, Calendar, 
  Shield, Award, FileText, Users, Home, DollarSign, Building, UserCheck, Target, 
  BookOpen, Zap, Download, Eye, RefreshCw, ChevronRight, Star, CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({});
  const [userEmail, setUserEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch profile data and user email on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found. Please log in.');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }
        // Fetch profile data
        const profileResponse = await axios.get('http://localhost:3000/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setUserData(profileResponse.data || {});
        
        // Fetch user email
        const userResponse = await axios.get('http://localhost:3000/auth/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setUserEmail(userResponse.data.email || 'Not provided');
      } catch (err) {
        console.error('Fetch Profile Error:', err.message);
        setError(err.response?.data?.error || 'Failed to fetch profile data. Please log in again.');
        setTimeout(() => navigate('/login'), 2000);
      }
    };
    fetchProfile();
  }, [navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const ProfileCard = ({ icon: Icon, title, children, className = "" }) => (
    <div className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100/50 overflow-hidden hover:shadow-xl transition-all duration-300 ${className}`}>
      <div className="bg-gradient-to-r from-blue-50/80 to-slate-50/80 px-6 py-4 border-b border-blue-100/50">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 rounded-xl shadow-lg">
            <Icon className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );

  const InfoItem = ({ label, value, icon: Icon }) => (
    <div className="flex items-start space-x-3 py-3 border-b border-blue-50 last:border-b-0 group hover:bg-blue-25 rounded-lg px-2 -mx-2 transition-colors duration-200">
      {Icon && (
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-2 rounded-lg mt-0.5 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-200">
          <Icon className="h-4 w-4 text-blue-600" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
        <p className="text-base text-slate-800 font-medium">{value || 'Not provided'}</p>
      </div>
    </div>
  );

  const StatCard = ({ title, value, bgColor, textColor, icon: Icon }) => (
    <div className={`${bgColor} rounded-2xl p-6 shadow-lg border border-blue-100/50 hover:shadow-xl transition-all duration-300 hover:scale-105`}>
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <div className="bg-white/30 p-3 rounded-xl">
            <Icon className={`h-6 w-6 ${textColor}`} />
          </div>
        </div>
        <p className={`text-2xl font-bold ${textColor} mb-2`}>{value}</p>
        <p className="text-sm text-slate-600 font-medium">{title}</p>
      </div>
    </div>
  );

  const getGenderIcon = (gender) => {
    return gender === 'Male' ? User : Users;
  };

  const getMaritalIcon = (status) => {
    return status === 'Married' ? Heart : User;
  };

  const handleEditProfile = () => {
    navigate('/profileform');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100/50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8">
            {error}
          </div>
        )}
        {/* Header Section */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-blue-100/50 overflow-hidden mb-8">
          <div className="bg-blue-400 px-8 py-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-36 -translate-x-36"></div>
            <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/5 rounded-full"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex items-center space-x-6 mb-6 md:mb-0">
                <div className="bg-white/20 backdrop-blur-sm p-5 rounded-3xl border border-white/10 shadow-lg">
                  <User className="h-14 w-14 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold">{userData.fullName || 'Not provided'}</h1>
                    <CheckCircle2 className="h-6 w-6 text-emerald-300" />
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Briefcase className="h-4 w-4 text-blue-200" />
                    <p className="text-blue-100 text-lg">{userData.occupation || 'Not provided'}</p>
                  </div>
                  <div className="flex items-center space-x-6 text-blue-100">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{userData.district || 'Not provided'}, {userData.state || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Age {userData.age || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button 
                  onClick={handleEditProfile}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center space-x-2 border border-white/10 hover:border-white/20"
                >
                  <Edit2 className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
                <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-3 rounded-2xl transition-all duration-300 border border-white/10 hover:border-white/20">
                  <Settings className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Annual Income" 
            value={`₹${userData.annualIncome || 'Not provided'}`} 
            bgColor="bg-gradient-to-br from-blue-100 to-blue-200" 
            textColor="text-blue-700"
            icon={DollarSign}
          />
          <StatCard 
            title="Work Sector" 
            value={userData.workSector || 'Not provided'} 
            bgColor="bg-gradient-to-br from-emerald-100 to-emerald-200" 
            textColor="text-emerald-700"
            icon={Building}
          />
          <StatCard 
            title="Education" 
            value={userData.educationLevel || 'Not provided'} 
            bgColor="bg-gradient-to-br from-violet-100 to-violet-200" 
            textColor="text-violet-700"
            icon={GraduationCap}
          />
          <StatCard 
            title="Aadhaar Status" 
            value={userData.aadhaarLinked === 'Yes' ? 'Linked' : 'Not Linked'} 
            bgColor={userData.aadhaarLinked === 'Yes' ? "bg-gradient-to-br from-green-100 to-green-200" : "bg-gradient-to-br from-red-100 to-red-200"} 
            textColor={userData.aadhaarLinked === 'Yes' ? "text-green-700" : "text-red-700"}
            icon={Shield}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <ProfileCard icon={User} title="Personal Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem label="Full Name" value={userData.fullName} icon={User} />
                <InfoItem label="Father's Name" value={userData.fatherName} icon={Users} />
                <InfoItem label="Mother's Name" value={userData.motherName} icon={Users} />
                {userData.maritalStatus === 'Married' && (
                  <InfoItem label="Spouse Name" value={userData.spouseName} icon={Heart} />
                )}
                <InfoItem label="Date of Birth" value={formatDate(userData.dateOfBirth)} icon={Calendar} />
                <InfoItem label="Age" value={`${userData.age || 'Not provided'} years`} icon={UserCheck} />
                <InfoItem label="Gender" value={userData.gender} icon={getGenderIcon(userData.gender)} />
                <InfoItem label="Marital Status" value={userData.maritalStatus} icon={getMaritalIcon(userData.maritalStatus)} />
              </div>
            </ProfileCard>

            {/* Contact & Location */}
            <ProfileCard icon={MapPin} title="Contact & Location">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem label="Phone Number" value={userData.phoneNumber} icon={Phone} />
                <InfoItem label="Email" value={userEmail} icon={Mail} />
                <InfoItem label="Pincode" value={userData.pincode} icon={MapPin} />
                <InfoItem label="State" value={userData.state} icon={Home} />
                <InfoItem label="District" value={userData.district} icon={MapPin} />
                <InfoItem label="Area Type" value={userData.urbanRural} icon={Building} />
              </div>
            </ProfileCard>

            {/* Professional Information */}
            <ProfileCard icon={Briefcase} title="Professional Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem label="Education Level" value={userData.educationLevel} icon={GraduationCap} />
                <InfoItem label="Occupation" value={userData.occupation} icon={Briefcase} />
                <InfoItem label="Work Sector" value={userData.workSector} icon={Building} />
                <InfoItem label="Annual Income" value={`₹${userData.annualIncome || 'Not provided'}`} icon={DollarSign} />
                <InfoItem label="Ration Card Type" value={userData.rationCardType} icon={FileText} />
                <InfoItem label="Disability" value={userData.disability} icon={Award} />
                <InfoItem label="Aadhaar Linked" value={userData.aadhaarLinked} icon={Shield} />
              </div>
            </ProfileCard>

            {/* Scheme Preferences */}
            <ProfileCard icon={Target} title="Scheme Preferences">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem label="Government Preference" value={userData.govtPreference} icon={BookOpen} />
                <InfoItem label="Preferred Sector" value={userData.preferredSector} icon={Zap} />
                <InfoItem label="Benefit Type" value={userData.benefitType} icon={Star} />
                <InfoItem label="Eligibility Awareness" value={userData.eligibilityAwareness} icon={Eye} />
              </div>
            </ProfileCard>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Actions */}
            <ProfileCard icon={Zap} title="Quick Actions">
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-4 py-3 rounded-lg hover:bg-blue-200 transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <Download className="h-5 w-5" />
                    <span>Download Profile</span>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </button>
                <button className="w-full flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-4 py-3 rounded-lg hover:bg-blue-200 transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <RefreshCw className="h-5 w-5" />
                    <span>Update Information</span>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </button>
                <button className="w-full flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-4 py-3 rounded-lg hover:bg-blue-200 transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <Star className="h-5 w-5" />
                    <span>View Recommended Schemes</span>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </ProfileCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;