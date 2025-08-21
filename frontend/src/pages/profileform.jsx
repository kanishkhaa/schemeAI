import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import axios from 'axios';

const ProfileForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    motherName: '',
    spouseName: '',
    dateOfBirth: '',
    age: '',
    gender: '',
    maritalStatus: '',
    phoneNumber: '',
    pincode: '',
    state: '',
    district: '',
    urbanRural: '',
    educationLevel: '',
    occupation: '',
    workSector: '',
    annualIncome: '',
    rationCardType: '',
    disability: '',
    aadhaarLinked: '',
    govtPreference: '',
    preferredSector: '',
    benefitType: '',
    eligibilityAwareness: ''
  });

  // Calculate age based on date of birth
  useEffect(() => {
    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      setFormData(prev => ({ ...prev, age: age.toString() }));
    } else {
      setFormData(prev => ({ ...prev, age: '' }));
    }
  }, [formData.dateOfBirth]);

  // Fetch user location
  useEffect(() => {
    const fetchLocation = async () => {
      if (navigator.geolocation) {
        setIsLoadingLocation(true);
        setLocationError('');
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
              );
              const data = await response.json();
              if (data.address) {
                setFormData(prev => ({
                  ...prev,
                  pincode: data.address.postcode || '',
                  state: data.address.state || '',
                  district: data.address.state_district || data.address.city_district || '',
                  urbanRural: data.address.city ? 'Urban' : 'Rural'
                }));
              } else {
                setLocationError('Unable to fetch location details');
              }
            } catch (error) {
              setLocationError('Error fetching location details');
            } finally {
              setIsLoadingLocation(false);
            }
          },
          (error) => {
            setLocationError('Please enable location access or enter pincode manually');
            setIsLoadingLocation(false);
          }
        );
      } else {
        setLocationError('Geolocation is not supported by this browser');
      }
    };
    fetchLocation();
  }, []);

  const handleInputChange = (field, value) => {
    let isValid = true;
    let errorMessage = '';

    // Validation for name fields
    const nameFields = ['fullName', 'fatherName', 'motherName', 'spouseName', 'occupation'];
    if (nameFields.includes(field)) {
      if (value && !/^[a-zA-Z\s]*$/.test(value)) {
        isValid = false;
        errorMessage = 'Please enter alphabets only';
      }
    }

    // Validation for phone number
    if (field === 'phoneNumber') {
      if (value && !/^\d*$/.test(value)) {
        isValid = false;
        errorMessage = 'Please enter numbers only';
      } else if (value.length > 10) {
        value = value.slice(0, 10);
      } else if (value.length < 10 && value.length > 0) {
        isValid = false;
        errorMessage = 'Please enter 10 digits';
      }
    }

    // Validation for pincode
    if (field === 'pincode') {
      if (value && !/^\d*$/.test(value)) {
        isValid = false;
        errorMessage = 'Please enter numbers only';
      } else if (value.length > 6) {
        value = value.slice(0, 6);
      } else if (value.length < 6 && value.length > 0) {
        isValid = false;
        errorMessage = 'Pincode must be 6 digits';
      }
    }

    // Update errors
    if (!isValid) {
      setErrors(prev => ({ ...prev, [field]: errorMessage }));
    } else if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Update form data
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear spouse name if marital status is not married
    if (field === 'maritalStatus' && value !== 'Married') {
      setFormData(prev => ({ ...prev, spouseName: '' }));
      setErrors(prev => ({ ...prev, spouseName: '' }));
    }
  };

  const validateCurrentStep = () => {
    const newErrors = {};
    
    switch (currentStep) {
      case 1:
        if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
        if (!formData.fatherName.trim()) newErrors.fatherName = 'Father\'s Name is required';
        if (!formData.motherName.trim()) newErrors.motherName = 'Mother\'s Name is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of Birth is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.maritalStatus) newErrors.maritalStatus = 'Marital Status is required';
        if (!formData.phoneNumber || formData.phoneNumber.length !== 10) 
          newErrors.phoneNumber = 'Please enter 10 digits';
        if (!formData.pincode || formData.pincode.length !== 6) 
          newErrors.pincode = 'Pincode must be 6 digits';
        if (formData.maritalStatus === 'Married' && !formData.spouseName.trim())
          newErrors.spouseName = 'Spouse Name is required';
        break;
      
      case 2:
        if (!formData.educationLevel) newErrors.educationLevel = 'Education Level is required';
        if (!formData.occupation.trim()) newErrors.occupation = 'Occupation is required';
        if (!formData.workSector) newErrors.workSector = 'Work Sector is required';
        if (!formData.annualIncome) newErrors.annualIncome = 'Annual Income Range is required';
        if (!formData.aadhaarLinked) newErrors.aadhaarLinked = 'Aadhaar Linked status is required';
        break;
      
      case 3:
        if (!formData.govtPreference) newErrors.govtPreference = 'Government preference is required';
        if (!formData.preferredSector) newErrors.preferredSector = 'Preferred sector is required';
        if (!formData.benefitType) newErrors.benefitType = 'Benefit type is required';
        if (!formData.eligibilityAwareness) newErrors.eligibilityAwareness = 'Eligibility awareness is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrors({ submit: 'Authentication token not found. Please log in again.' });
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
      const response = await axios.post('http://localhost:3000/auth/profile', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      setCurrentStep(5);
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err) {
      console.error('Submit Profile Error:', err.message);
      setErrors({ submit: err.response?.data?.error || 'Failed to save profile. Please try again.' });
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { id: 1, title: 'Personal Details' },
      { id: 2, title: 'Socio-Economic' },
      { id: 3, title: 'Preferences' },
      { id: 4, title: 'Review' },
      { id: 5, title: 'Complete' }
    ];

    return (
      <div className="mb-12 relative">
        <div className="flex justify-between items-center mb-6">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-bold transition-all duration-300 ${
                currentStep > step.id ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' : 
                currentStep === step.id ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white' : 'bg-gray-100 text-gray-400'
              } shadow-md`}>
                {currentStep > step.id ? <CheckCircle className="w-6 h-6" /> : step.id}
              </div>
              <span className={`text-sm mt-3 font-semibold ${
                currentStep > step.id ? 'text-green-600' : 
                currentStep === step.id ? 'text-blue-600' : 'text-gray-400'
              }`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
        <div className="absolute top-6 left-0 w-full h-2 bg-gray-100 rounded-full"></div>
        <div 
          className="absolute top-6 left-0 h-2 rounded-full transition-all duration-500 ease-in-out bg-gradient-to-r from-blue-500 to-indigo-600"
          style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
        />
      </div>
    );
  };

  const renderBasicInfo = () => (
    <div className="space-y-10">
      <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Personal Details</h2>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-gray-50"
              placeholder="Enter your full name"
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-2">{errors.fullName}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Father's Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.fatherName}
              onChange={(e) => handleInputChange('fatherName', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-gray-50"
              placeholder="Enter father's name"
            />
            {errors.fatherName && <p className="text-red-500 text-sm mt-2">{errors.fatherName}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mother's Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.motherName}
              onChange={(e) => handleInputChange('motherName', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-gray-50"
              placeholder="Enter mother's name"
            />
            {errors.motherName && <p className="text-red-500 text-sm mt-2">{errors.motherName}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marital Status <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.maritalStatus}
              onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-gray-50"
            >
              <option value="">Select Marital Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
            </select>
            {errors.maritalStatus && <p className="text-red-500 text-sm mt-2">{errors.maritalStatus}</p>}
          </div>

          {formData.maritalStatus === 'Married' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spouse Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.spouseName}
                onChange={(e) => handleInputChange('spouseName', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-gray-50"
                placeholder="Enter spouse name"
              />
              {errors.spouseName && <p className="text-red-500 text-sm mt-2">{errors.spouseName}</p>}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-gray-50"
            />
            {errors.dateOfBirth && <p className="text-red-500 text-sm mt-2">{errors.dateOfBirth}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age
            </label>
            <input
              type="text"
              value={formData.age}
              readOnly
              className="w-full p-3 border border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed text-gray-500"
              placeholder="Auto-calculated"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-gray-50"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
              <option value="Rather not say">Rather not say</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm mt-2">{errors.gender}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-gray-50"
              placeholder="Enter 10-digit phone number"
              maxLength="10"
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm mt-2">{errors.phoneNumber}</p>}
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Location Details</h3>
        {isLoadingLocation && (
          <div className="flex items-center text-indigo-600 text-sm mb-4">
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Fetching your location...
          </div>
        )}
        {locationError && <p className="text-red-500 text-sm mb-4">{locationError}</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pincode <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.pincode}
              onChange={(e) => handleInputChange('pincode', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-gray-50"
              placeholder="Enter 6-digit pincode"
              maxLength="6"
            />
            {errors.pincode && <p className="text-red-500 text-sm mt-2">{errors.pincode}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <input
              type="text"
              value={formData.state}
              readOnly
              className="w-full p-3 border border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed text-gray-500"
              placeholder="Auto-filled based on location"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              District
            </label>
            <input
              type="text"
              value={formData.district}
              readOnly
              className="w-full p-3 border border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed text-gray-500"
              placeholder="Auto-filled based on location"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urban/Rural
            </label>
            <input
              type="text"
              value={formData.urbanRural}
              readOnly
              className="w-full p-3 border border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed text-gray-500"
              placeholder="Auto-filled based on location"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSocialEconomic = () => (
    <div className="space-y-10">
      <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Socio-Economic Details</h2>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Education Level <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.educationLevel}
              onChange={(e) => handleInputChange('educationLevel', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-gray-50"
            >
              <option value="">Select Education Level</option>
              <option value="Below 10th">Below 10th</option>
              <option value="10th Pass">10th Pass</option>
              <option value="12th Pass">12th Pass</option>
              <option value="Graduate">Graduate</option>
              <option value="Post Graduate">Post Graduate</option>
              <option value="Doctorate">Doctorate</option>
            </select>
            {errors.educationLevel && <p className="text-red-500 text-sm mt-2">{errors.educationLevel}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Occupation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.occupation}
              onChange={(e) => handleInputChange('occupation', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-gray-50"
              placeholder="Enter your occupation"
            />
            {errors.occupation && <p className="text-red-500 text-sm mt-2">{errors.occupation}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Work Sector <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.workSector}
              onChange={(e) => handleInputChange('workSector', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-gray-50"
            >
              <option value="">Select Work Sector</option>
              <option value="Government">Government</option>
              <option value="Private">Private</option>
            </select>
            {errors.workSector && <p className="text-red-500 text-sm mt-2">{errors.workSector}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annual Income Range <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.annualIncome}
              onChange={(e) => handleInputChange('annualIncome', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-gray-50"
            >
              <option value="">Select Income Range</option>
              <option value="Below 1 Lakh">Below ₹1 Lakh</option>
              <option value="1-3 Lakhs">₹1-3 Lakhs</option>
              <option value="3-5 Lakhs">₹3-5 Lakhs</option>
              <option value="5-10 Lakhs">₹5-10 Lakhs</option>
              <option value="Above 10 Lakhs">Above ₹10 Lakhs</option>
            </select>
            {errors.annualIncome && <p className="text-red-500 text-sm mt-2">{errors.annualIncome}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ration Card Type
            </label>
            <select
              value={formData.rationCardType}
              onChange={(e) => handleInputChange('rationCardType', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-gray-50"
            >
              <option value="">Select Ration Card Type</option>
              <option value="APL">APL (Above Poverty Line)</option>
              <option value="BPL">BPL (Below Poverty Line)</option>
              <option value="AAY">AAY (Antyodaya Anna Yojana)</option>
              <option value="None">None</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Disability (if any)
            </label>
            <input
              type="text"
              value={formData.disability}
              onChange={(e) => handleInputChange('disability', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-gray-50"
              placeholder="Specify disability if any"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aadhaar Linked <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.aadhaarLinked}
              onChange={(e) => handleInputChange('aadhaarLinked', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-gray-50"
            >
              <option value="">Is your Aadhaar linked?</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            {errors.aadhaarLinked && <p className="text-red-500 text-sm mt-2">{errors.aadhaarLinked}</p>}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSchemePreferences = () => (
    <div className="space-y-10">
      <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Scheme Preferences</h2>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Government Preference <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.govtPreference}
              onChange={(e) => handleInputChange('govtPreference', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-gray-50"
            >
              <option value="">Select preference</option>
              <option value="Central Government">Central Government</option>
              <option value="State Government">State Government</option>
              <option value="Both">Both</option>
            </select>
            {errors.govtPreference && <p className="text-red-500 text-sm mt-2">{errors.govtPreference}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Sector <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.preferredSector}
              onChange={(e) => handleInputChange('preferredSector', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-gray-50"
            >
              <option value="">Select sector</option>
              <option value="Education">Education</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Employment">Employment</option>
              <option value="Housing">Housing</option>
              <option value="Financial Assistance">Financial Assistance</option>
            </select>
            {errors.preferredSector && <p className="text-red-500 text-sm mt-2">{errors.preferredSector}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Benefit Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.benefitType}
              onChange={(e) => handleInputChange('benefitType', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-gray-50"
            >
              <option value="">Select benefit type</option>
              <option value="Subsidies">Subsidies</option>
              <option value="Grants">Grants</option>
              <option value="Loans">Loans</option>
              <option value="Training">Training</option>
              <option value="Other">Other</option>
            </select>
            {errors.benefitType && <p className="text-red-500 text-sm mt-2">{errors.benefitType}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Eligibility Awareness <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.eligibilityAwareness}
              onChange={(e) => handleInputChange('eligibilityAwareness', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 hover:bg-gray-50"
            >
              <option value="">Select awareness level</option>
              <option value="Fully Aware">Fully Aware</option>
              <option value="Partially Aware">Partially Aware</option>
              <option value="Not Aware">Not Aware</option>
            </select>
            {errors.eligibilityAwareness && <p className="text-red-500 text-sm mt-2">{errors.eligibilityAwareness}</p>}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="space-y-10">
      <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Review Your Information</h2>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          <p><span className="font-medium">Full Name:</span> {formData.fullName || 'N/A'}</p>
          <p><span className="font-medium">Father's Name:</span> {formData.fatherName || 'N/A'}</p>
          <p><span className="font-medium">Mother's Name:</span> {formData.motherName || 'N/A'}</p>
          {formData.maritalStatus === 'Married' && <p><span className="font-medium">Spouse Name:</span> {formData.spouseName || 'N/A'}</p>}
          <p><span className="font-medium">Date of Birth:</span> {formData.dateOfBirth || 'N/A'}</p>
          <p><span className="font-medium">Age:</span> {formData.age || 'N/A'}</p>
          <p><span className="font-medium">Gender:</span> {formData.gender || 'N/A'}</p>
          <p><span className="font-medium">Marital Status:</span> {formData.maritalStatus || 'N/A'}</p>
          <p><span className="font-medium">Phone Number:</span> {formData.phoneNumber || 'N/A'}</p>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Location Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          <p><span className="font-medium">Pincode:</span> {formData.pincode || 'N/A'}</p>
          <p><span className="font-medium">State:</span> {formData.state || 'N/A'}</p>
          <p><span className="font-medium">District:</span> {formData.district || 'N/A'}</p>
          <p><span className="font-medium">Urban/Rural:</span> {formData.urbanRural || 'N/A'}</p>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Socio-Economic Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          <p><span className="font-medium">Education Level:</span> {formData.educationLevel || 'N/A'}</p>
          <p><span className="font-medium">Occupation:</span> {formData.occupation || 'N/A'}</p>
          <p><span className="font-medium">Work Sector:</span> {formData.workSector || 'N/A'}</p>
          <p><span className="font-medium">Annual Income:</span> {formData.annualIncome || 'N/A'}</p>
          <p><span className="font-medium">Ration Card Type:</span> {formData.rationCardType || 'N/A'}</p>
          <p><span className="font-medium">Disability:</span> {formData.disability || 'N/A'}</p>
          <p><span className="font-medium">Aadhaar Linked:</span> {formData.aadhaarLinked || 'N/A'}</p>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Scheme Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          <p><span className="font-medium">Government Preference:</span> {formData.govtPreference || 'N/A'}</p>
          <p><span className="font-medium">Preferred Sector:</span> {formData.preferredSector || 'N/A'}</p>
          <p><span className="font-medium">Benefit Type:</span> {formData.benefitType || 'N/A'}</p>
          <p><span className="font-medium">Eligibility Awareness:</span> {formData.eligibilityAwareness || 'N/A'}</p>
        </div>
      </div>
    </div>
  );

  const renderComplete = () => (
    <div className="text-center space-y-8">
      <CheckCircle className="mx-auto h-20 w-20 text-green-500 animate-bounce" />
      <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Form Submitted Successfully!</h2>
      <p className="text-gray-600 max-w-lg mx-auto text-lg">Thank you for completing the profile form. Your information has been submitted successfully.</p>
      <p className="text-gray-500 text-sm">Redirecting to profile...</p>
      {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8">
        {renderStepIndicator()}
        
        <div className="min-h-[500px] transition-all duration-500">
          {currentStep === 1 && renderBasicInfo()}
          {currentStep === 2 && renderSocialEconomic()}
          {currentStep === 3 && renderSchemePreferences()}
          {currentStep === 4 && renderPreview()}
          {currentStep === 5 && renderComplete()}
        </div>

        {currentStep < 5 && (
          <div className="mt-10 flex justify-between">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="inline-flex items-center px-6 py-3 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-sm"
              >
                <ChevronLeft className="mr-2 h-5 w-5" />
                Previous
              </button>
            )}
            
            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-md"
              >
                Next
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
            ) : currentStep === 4 ? (
              <button
                onClick={handleSubmit}
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 shadow-md"
              >
                Submit
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;