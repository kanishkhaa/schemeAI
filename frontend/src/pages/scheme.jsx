import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Clock, Star, BookmarkPlus, ExternalLink, Users, MapPin, TrendingUp, Award, ChevronDown, X, Heart, Bell, Sparkles, Target, Gift, Shield, Zap, Sliders,
  Calendar, Stethoscope, CheckCircle, FileText, UserCheck, Send, Lightbulb, HelpCircle, Info, AlertCircle
} from 'lucide-react';

// Mock data for schemes (static replacement for backend data)
const mockSchemes = [
  {
    id: 'agriculture-1',
    name: 'Agriculture Support Scheme',
    provider: 'Government of India',
    providerShort: 'GoI',
    category: 'agriculture',
    eligibilityScore: 90,
    status: 'active',
    deadline: '2025-12-31',
    benefits: ['Financial aid: ₹5,00,000', 'Equipment subsidy: 50%'],
    whySuggested: 'Supports agricultural initiatives',
    description: 'A scheme to promote sustainable farming practices.',
    applicants: 1500,
    successRate: 60,
    tags: ['Agriculture', 'Sustainability'],
    fundingAmount: 500000,
    region: 'Pan India',
    applicationType: 'individual',
    location: 'Pan India',
    eligibility: ['Must be a farmer', 'Resident of India'],
    documents: ['Aadhaar Card', 'Land Ownership Proof'],
    applicationProcess: ['Register online', 'Submit documents', 'Await verification'],
    officialLinks: ['https://example.com'],
    smartTips: ['Ensure documents are valid', 'Apply early'],
    postSubmission: ['Track status online', 'Contact department'],
    dosAndDonts: ['Do: Submit complete documents', "Don't: Apply if ineligible"],
  },
  {
    id: 'education-1',
    name: 'Education Scholarship Program',
    provider: 'Government of Tamil Nadu',
    providerShort: 'GoTN',
    category: 'education',
    eligibilityScore: 85,
    status: 'closing-soon',
    deadline: '2025-09-30',
    benefits: ['Scholarship: ₹1,00,000'],
    whySuggested: 'Supports educational advancement',
    description: 'A scholarship for meritorious students.',
    applicants: 2000,
    successRate: 70,
    tags: ['Education', 'Scholarship'],
    fundingAmount: 100000,
    region: 'Tamil Nadu',
    applicationType: 'individual',
    location: 'Tamil Nadu',
    eligibility: ['Must be a student', 'Resident of Tamil Nadu'],
    documents: ['Mark Sheet', 'Income Certificate'],
    applicationProcess: ['Apply online', 'Submit academic records', 'Interview'],
    officialLinks: ['https://example.com'],
    smartTips: ['Submit recent transcripts', 'Check eligibility'],
    postSubmission: ['Check portal for updates', 'Contact education department'],
    dosAndDonts: ['Do: Provide accurate details', "Don't: Miss deadlines"],
  },
];

const Scheme = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');
  const [savedSchemes, setSavedSchemes] = useState(new Set());
  const [showProviderDropdown, setShowProviderDropdown] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [selectedState, setSelectedState] = useState('all');
  const [selectedFundingRange, setSelectedFundingRange] = useState('all');
  const [selectedApplicationType, setSelectedApplicationType] = useState('all');
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const categories = [
    { id: 'all', label: 'All Categories', icon: Target, color: 'bg-gradient-to-r from-gray-600 to-gray-800' },
    { id: 'agriculture', label: 'Agriculture', icon: Zap, color: 'bg-gradient-to-r from-green-500 to-green-700' },
    { id: 'education', label: 'Education', icon: Calendar, color: 'bg-gradient-to-r from-blue-400 to-blue-600' },
    { id: 'healthcare', label: 'Healthcare', icon: Stethoscope, color: 'bg-gradient-to-r from-red-500 to-red-700' },
    { id: 'social-welfare', label: 'Social Welfare', icon: Users, color: 'bg-gradient-to-r from-indigo-500 to-indigo-700' },
    { id: 'transport', label: 'Transport', icon: MapPin, color: 'bg-gradient-to-r from-yellow-500 to-yellow-700' },
    { id: 'women', label: 'Women Empowerment', icon: Shield, color: 'bg-gradient-to-r from-pink-500 to-pink-700' },
  ];

  const providers = [
    { id: 'all', name: 'All Providers', shortName: 'All' },
    { id: 'tn-gov', name: 'Government of Tamil Nadu', shortName: 'GoTN' },
    { id: 'india-gov', name: 'Government of India', shortName: 'GoI' },
  ];

  const states = ['All States', 'Tamil Nadu', 'Pan India'];

  const fundingRanges = [
    { id: 'all', label: 'Any Amount' },
    { id: 'under-1l', label: 'Under ₹1 Lakh' },
    { id: '1l-5l', label: '₹1L - ₹5L' },
    { id: '5l-10l', label: '₹5L - ₹10L' },
  ];

  // Filter and sort schemes
  const filteredSchemes = mockSchemes.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scheme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scheme.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesProvider = selectedProvider === 'all' || scheme.providerShort === selectedProvider;
    const matchesCategory = activeFilter === 'all' || scheme.category === activeFilter;
    const matchesFunding = selectedFundingRange === 'all' ||
                          (selectedFundingRange === 'under-1l' && scheme.fundingAmount < 100000) ||
                          (selectedFundingRange === '1l-5l' && scheme.fundingAmount >= 100000 && scheme.fundingAmount <= 500000) ||
                          (selectedFundingRange === '5l-10l' && scheme.fundingAmount > 500000 && scheme.fundingAmount <= 1000000);
    const matchesApplicationType = selectedApplicationType === 'all' || scheme.applicationType.toLowerCase() === selectedApplicationType.toLowerCase();
    const matchesState = selectedState === 'all' || scheme.location === selectedState;
    const matchesSaved = !showSavedOnly || savedSchemes.has(scheme.id);

    return matchesSearch && matchesProvider && matchesCategory && matchesFunding &&
           matchesApplicationType && matchesState && matchesSaved;
  });

  const sortedSchemes = [...filteredSchemes].sort((a, b) => {
    switch (sortBy) {
      case 'eligibility':
        return b.eligibilityScore - a.eligibilityScore;
      case 'deadline':
        return new Date(a.deadline) - new Date(b.deadline);
      case 'funding':
        return b.fundingAmount - a.fundingAmount;
      default:
        return b.eligibilityScore - a.eligibilityScore;
    }
  });

  // Use top 3 schemes with high eligibility scores for top picks
  const topSchemes = sortedSchemes.filter(scheme => scheme.eligibilityScore >= 85).slice(0, 3);
  const regularSchemes = sortedSchemes.filter(scheme => !topSchemes.includes(scheme));

  const handleSaveScheme = (schemeId) => {
    const newSaved = new Set(savedSchemes);
    if (newSaved.has(schemeId)) {
      newSaved.delete(schemeId);
    } else {
      newSaved.add(schemeId);
    }
    setSavedSchemes(newSaved);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'closing-soon':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      default:
        return 'bg-blue-100 text-blue-600 border-blue-200';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high':
        return 'bg-rose-500';
      case 'medium':
        return 'bg-amber-500';
      case 'low':
        return 'bg-emerald-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatFunding = (amount) => {
    if (amount === 0) return 'Non-monetary';
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 30) return `${diffDays} days left`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getSelectedProviderName = () => {
    const provider = providers.find(p => p.id === selectedProvider);
    return provider ? provider.shortName : 'All';
  };

  const resetFilters = () => {
    if (window.confirm('Are you sure you want to reset all filters?')) {
      setSearchQuery('');
      setSelectedProvider('all');
      setActiveFilter('all');
      setSelectedState('all');
      setSelectedFundingRange('all');
      setSelectedApplicationType('all');
      setSortBy('relevance');
      setShowSavedOnly(false);
      setSelectedScheme(null);
    }
  };

  const tabIcons = {
    overview: Info,
    documents: FileText,
    eligibility: UserCheck,
    submission: Send,
    smartTips: Lightbulb,
    applicationGuide: HelpCircle,
    postSubmission: CheckCircle,
    dosAndDonts: AlertCircle
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const renderTabContent = (scheme) => {
    switch (activeTab) {
      case 'overview':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg"
          >
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full bg-blue-100 mr-3">
                <Info className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Overview</h3>
            </div>
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-xl shadow-sm border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-semibold text-gray-700">Description</span>
                </div>
                <p className="text-gray-700 text-base font-medium">{scheme.description}</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl shadow-sm border border-emerald-100">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-semibold text-gray-700">Why Suggested</span>
                </div>
                <p className="text-gray-700 text-base font-medium">{scheme.whySuggested}</p>
              </div>
              <div className="p-4 bg-rose-50 rounded-xl shadow-sm border border-rose-100">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="w-5 h-5 text-rose-500" />
                  <span className="text-sm font-semibold text-gray-700">Benefits</span>
                </div>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm font-medium">
                  {scheme.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-indigo-50 rounded-xl shadow-sm border border-indigo-100">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-indigo-500" />
                  <span className="text-sm font-semibold text-gray-700">Eligibility Criteria</span>
                </div>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm font-medium">
                  {scheme.eligibility.map((crit, index) => (
                    <li key={index}>{crit}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        );
      case 'documents':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg"
          >
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full bg-green-100 mr-3">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Required Documents</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {scheme.documents.length > 0 ? scheme.documents.map((doc, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-center p-4 bg-green-50 rounded-xl shadow-sm border border-green-100"
                >
                  <div className="w-8 h-8 rounded-full bg-green-200 text-green-600 flex items-center justify-center text-sm font-semibold mr-4">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 text-sm font-medium">{doc}</p>
                </motion.div>
              )) : (
                <motion.div
                  variants={itemVariants}
                  className="p-4 bg-green-50 rounded-xl shadow-sm border border-green-100 col-span-full"
                >
                  <p className="text-gray-600 text-sm font-medium">No documents required</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      case 'eligibility':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg"
          >
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full bg-blue-100 mr-3">
                <UserCheck className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Eligibility Criteria</h3>
            </div>
            <div className="space-y-4">
              {scheme.eligibility.map((crit, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-center p-4 bg-blue-50 rounded-xl shadow-sm border border-blue-100"
                >
                  <CheckCircle className="w-6 h-6 text-blue-600 mr-4" />
                  <p className="text-gray-700 text-sm font-medium">{crit}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      case 'submission':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg"
          >
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full bg-blue-100 mr-3">
                <Send className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Submission Guidelines</h3>
            </div>
            <div className="space-y-4">
              {scheme.applicationProcess.map((step, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-center p-4 bg-blue-50 rounded-xl shadow-sm border border-blue-100"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold mr-4">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 text-sm font-medium">{step}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      case 'smartTips':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg"
          >
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full bg-yellow-100 mr-3">
                <Lightbulb className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Smart Tips</h3>
            </div>
            <div className="space-y-4">
              {scheme.smartTips.map((tip, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start p-4 bg-yellow-50 rounded-xl shadow-sm border border-yellow-100"
                >
                  <Lightbulb className="w-6 h-6 text-yellow-600 mr-4" />
                  <p className="text-gray-700 text-sm font-medium">{tip}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      case 'applicationGuide':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg"
          >
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full bg-teal-100 mr-3">
                <HelpCircle className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Application Guide</h3>
            </div>
            <div className="relative">
              {scheme.applicationProcess.map((step, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative mb-8 last:mb-0"
                >
                  <div className="flex items-start">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-lg">
                        {index + 1}
                      </div>
                      {index < scheme.applicationProcess.length - 1 && (
                        <div className="absolute top-12 left-6 w-0.5 h-[calc(100%-3rem)] bg-teal-200"></div>
                      )}
                    </div>
                    <div className="ml-6 mt-2">
                      <p className="text-gray-700 text-base font-medium">{step}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      case 'postSubmission':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg"
          >
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-full bg-cyan-100 mr-3">
                <CheckCircle className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Post-Submission Information</h3>
            </div>
            <div className="space-y-4">
              {scheme.postSubmission.map((info, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start p-4 bg-cyan-50 rounded-xl shadow-sm border border-cyan-100"
                >
                  <Info className="w-6 h-6 text-cyan-600 mr-4" />
                  <p className="text-gray-700 text-sm font-medium">{info}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      case 'dosAndDonts':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-full bg-green-100 mr-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Do's</h3>
                </div>
                <div className="space-y-4">
                  {scheme.dosAndDonts.filter(item => item.startsWith("Do:")).map((item, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="flex items-start p-4 bg-green-50 rounded-xl shadow-sm border border-green-100"
                    >
                      <div className="w-8 h-8 rounded-full bg-green-200 text-green-600 flex items-center justify-center text-sm font-semibold mr-4">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 text-sm font-medium">{item.replace("Do: ", "")}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-full bg-red-100 mr-3">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Don'ts</h3>
                </div>
                <div className="space-y-4">
                  {scheme.dosAndDonts.filter(item => item.startsWith("Don't:")).map((item, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="flex items-start p-4 bg-red-50 rounded-xl shadow-sm border border-red-100"
                    >
                      <div className="w-8 h-8 rounded-full bg-red-200 text-red-600 flex items-center justify-center text-sm font-semibold mr-4">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 text-sm font-medium">{item.replace("Don't: ", "")}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 font-sans">
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          .animate-fade-in { animation: fadeIn 0.6s ease-out; }
          .animate-slide-in { animation: slideIn 0.4s ease-out; }
          .animate-pulse { animation: pulse 2s infinite; }
          .hover-scale { transition: transform 0.3s ease, box-shadow 0.3s ease; }
          .hover-scale:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15); }
          .category-chip { transition: all 0.3s ease; }
          .category-chip:hover { transform: scale(1.05); }
          .progress-bar { background: linear-gradient(to right, #2563EB var(--progress), #E5E7EB var(--progress)); }
          .tab-active { border-bottom: 3px solid #2563EB; color: #2563EB; font-weight: 600; }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          .bg-glass { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); }
          .sticky-action-bar { position: sticky; bottom: 0; z-index: 10; }
          .tab-button:hover { background: linear-gradient(to right, #EFF6FF, #DBEAFE); }
          .tab-button.active { background: linear-gradient(to right, #EFF6FF, #DBEAFE); }
        `}
      </style>

      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-full shadow-lg">
                <Target className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Scheme Finder</h1>
                <p className="text-gray-600 mt-2 flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  Discover tailored government schemes with AI precision
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-emerald-50 px-5 py-2.5 rounded-full border border-emerald-200 shadow-sm">
                <span className="text-sm font-semibold text-emerald-700 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {filteredSchemes.length} Schemes Found
                </span>
              </div>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 rounded-full shadow-sm">
                <span className="text-sm font-semibold text-white flex items-center gap-2">
                  <Star className="h-5 w-5 fill-current" />
                  Profile: 85% Complete
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search and Filters */}
        <div className="bg-glass rounded-3xl shadow-xl border border-gray-100 mb-10 overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-white/80" />
              </div>
              <input
                type="text"
                placeholder="Search schemes by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-300 text-white placeholder-white/70 text-lg font-medium shadow-inner"
              />
            </div>
          </div>

          <div className="px-6 py-6 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <Target className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Categories</h3>
              <span className="text-sm text-gray-500">({categories.length})</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {categories.map(category => {
                const IconComponent = category.icon;
                const isActive = activeFilter === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveFilter(category.id)}
                    className={`category-chip group flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap border ${
                      isActive ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg border-blue-600' : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className={`p-1.5 rounded-full ${isActive ? 'bg-white/20' : category.color}`}>
                      <IconComponent className={`h-4 w-4 ${isActive ? 'text-white' : 'text-white'}`} />
                    </div>
                    <span>{category.label}</span>
                    {isActive && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowProviderDropdown(!showProviderDropdown)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all duration-300 shadow-sm ${
                    selectedProvider !== 'all' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-lg' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <MapPin className="h-5 w-5" />
                  <span className="text-sm font-semibold">{getSelectedProviderName()}</span>
                  <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${showProviderDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showProviderDropdown && (
                  <div className="absolute top-full mt-2 left-0 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 min-w-80 max-h-96 overflow-y-auto animate-fade-in">
                    <div className="p-3">
                      {providers.map(provider => (
                        <button
                          key={provider.id}
                          onClick={() => {
                            setSelectedProvider(provider.id);
                            setShowProviderDropdown(false);
                          }}
                          className={`block w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                            selectedProvider === provider.id ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'hover:bg-gray-50 hover:text-blue-600'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">{provider.shortName}</span>
                            {selectedProvider === provider.id && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 mt-1 block">{provider.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 text-sm text-gray-700 font-semibold shadow-sm transition-all duration-300 hover:bg-gray-50"
              >
                <option value="relevance">🎯 Best Match</option>
                <option value="eligibility">📊 Eligibility Score</option>
                <option value="deadline">⏰ Deadline</option>
                <option value="funding">💰 Funding Amount</option>
              </select>

              <button
                onClick={() => setShowSavedOnly(!showSavedOnly)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 font-semibold shadow-sm ${
                  showSavedOnly ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white border-rose-600 shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <Heart className={`h-5 w-5 ${showSavedOnly ? 'fill-current' : ''}`} />
                <span className="text-sm">Saved ({savedSchemes.size})</span>
              </button>

              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 font-semibold shadow-sm ${
                  showAdvancedFilters ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-lg' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700 border'
                }`}
              >
                <Sliders className="h-5 w-5" />
                <span className="text-sm">Advanced Filters</span>
              </button>

              <button
                onClick={resetFilters}
                className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 text-gray-700 font-semibold shadow-sm"
              >
                <X className="h-5 w-5" />
                <span className="text-sm">Reset Filters</span>
              </button>
            </div>
          </div>

          {showAdvancedFilters && (
            <div className="px-6 py-8 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-100 animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg">
                    <Sliders className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-gray-900">Advanced Filters</h4>
                    <p className="text-sm text-gray-600">Refine your search for the perfect scheme</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAdvancedFilters(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-white rounded-full transition-all duration-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    Location
                  </label>
                  <select 
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 text-sm bg-white shadow-sm transition-all duration-300"
                  >
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Gift className="h-5 w-5 text-emerald-600" />
                    Funding Range
                  </label>
                  <select 
                    value={selectedFundingRange}
                    onChange={(e) => setSelectedFundingRange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 text-sm bg-white shadow-sm transition-all duration-300"
                  >
                    {fundingRanges.map(range => (
                      <option key={range.id} value={range.id}>{range.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Users className="h-5 w-5 text-blue-600" />
                    Applicant Type
                  </label>
                  <select 
                    value={selectedApplicationType}
                    onChange={(e) => setSelectedApplicationType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 text-sm bg-white shadow-sm transition-all duration-300"
                  >
                    <option value="all">All Types</option>
                    <option value="individual">Individual</option>
                    <option value="group">Group</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Detailed Scheme View */}
        {selectedScheme && (
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl border border-gray-100 mb-10 overflow-hidden animate-fade-in">
            <div className="p-8 lg:p-12">
              {/* Header Section */}
              <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-10">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-full shadow-lg">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">{selectedScheme.name}</h2>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      {selectedScheme.provider}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-rose-600" />
                      Deadline: {formatDeadline(selectedScheme.deadline)}
                    </span>
                    <span className="flex items-center gap-2">
                      <Gift className="h-5 w-5 text-emerald-600" />
                      Funding: {formatFunding(selectedScheme.fundingAmount)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleSaveScheme(selectedScheme.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all duration-300 font-semibold shadow-sm ${
                      savedSchemes.has(selectedScheme.id) ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${savedSchemes.has(selectedScheme.id) ? 'fill-current' : ''}`} />
                    {savedSchemes.has(selectedScheme.id) ? 'Saved' : 'Save'}
                  </button>
                  <button
                    onClick={() => setSelectedScheme(null)}
                    className="text-gray-400 hover:text-gray-600 p-3 hover:bg-gray-100 rounded-full transition-all duration-300"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-3 mb-2">
                    <Star className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-700">Match Score</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{selectedScheme.eligibilityScore}%</span>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${selectedScheme.eligibilityScore}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-6 rounded-2xl border border-emerald-100">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-semibold text-gray-700">Applicants</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{selectedScheme.applicants.toLocaleString()}</span>
                </div>
                <div className="bg-gradient-to-r from-rose-50 to-rose-100 p-6 rounded-2xl border border-rose-100">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="h-5 w-5 text-rose-600" />
                    <span className="text-sm font-semibold text-gray-700">Success Rate</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{selectedScheme.successRate}%</span>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="relative mb-10">
                <div className="flex flex-wrap gap-2 bg-gray-100 p-2 rounded-xl border border-gray-200">
                  {['overview', 'documents', 'eligibility', 'submission', 'smartTips', 'applicationGuide', 'postSubmission', 'dosAndDonts'].map(tab => {
                    const IconComponent = tabIcons[tab];
                    return (
                      <motion.button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`tab-button flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
                          activeTab === tab ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' : 'text-gray-600 hover:text-blue-600 bg-white/90 border border-gray-200 hover:bg-blue-50'
                        }`}
                      >
                        <IconComponent className="h-5 w-5" />
                        {tab === 'overview' ? 'Overview' :
                         tab === 'documents' ? 'Documents' :
                         tab === 'eligibility' ? 'Eligibility' :
                         tab === 'submission' ? 'Submission' :
                         tab === 'smartTips' ? 'Smart Tips' :
                         tab === 'applicationGuide' ? 'Application Guide' :
                         tab === 'postSubmission' ? 'Post-Submission' : 'Do\'s & Don\'ts'}
                      </motion.button>
                    );
                  })}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                  <div className="h-1 bg-blue-600 transition-all duration-300" style={{ width: `${100 / 8}%`, transform: `translateX(${(['overview', 'documents', 'eligibility', 'submission', 'smartTips', 'applicationGuide', 'postSubmission', 'dosAndDonts'].indexOf(activeTab)) * 100}%)` }}></div>
                </div>
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mb-20"
                >
                  {renderTabContent(selectedScheme)}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Sticky Action Bar */}
            <div className="sticky-action-bar bg-white border-t border-gray-200 p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-rose-600" />
                    Deadline: {formatDeadline(selectedScheme.deadline)}
                  </span>
                  <span className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    {selectedScheme.location}
                  </span>
                </div>
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSaveScheme(selectedScheme.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all duration-300 font-semibold shadow-sm ${
                      savedSchemes.has(selectedScheme.id) ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <BookmarkPlus className="h-5 w-5" />
                    {savedSchemes.has(selectedScheme.id) ? 'Saved' : 'Save'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 font-semibold shadow-lg animate-pulse"
                  >
                    <a
                      href={selectedScheme.officialLinks[0] || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-5 w-5" />
                      Apply Now
                    </a>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Picks */}
        {!selectedScheme && (
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-full shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">✨ Top Picks for You</h2>
                <p className="text-gray-600 text-lg mt-2">Curated schemes tailored to your profile</p>
              </div>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              {topSchemes.map((scheme, index) => (
                <div key={scheme.id} className="group hover-scale animate-slide-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="relative bg-white rounded-3xl p-6 shadow-lg border border-gray-100 h-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getUrgencyColor('medium')}`}></div>
                        <span className={`px-4 py-2 rounded-full text-xs font-bold border ${getStatusColor(scheme.status)} shadow-sm`}>
                          {scheme.status === 'closing-soon' ? '🔥 Closing Soon' : '✅ Active'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleSaveScheme(scheme.id)}
                        className={`p-2.5 rounded-full transition-all duration-300 ${
                          savedSchemes.has(scheme.id) ? 'bg-rose-50 text-rose-600 shadow-md scale-110' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:scale-110'
                        }`}
                      >
                        <Heart className={`h-5 w-5 ${savedSchemes.has(scheme.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    <div className="relative mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{scheme.name}</h3>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <MapPin className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{scheme.providerShort}</p>
                          <p className="text-xs text-gray-500">{scheme.provider}</p>
                        </div>
                      </div>
                    </div>
                    <div className="relative mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Target className="h-5 w-5 text-blue-600" />
                          Match Score
                        </span>
                        <span className="text-lg font-bold text-blue-600">{scheme.eligibilityScore}%</span>
                      </div>
                      <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${scheme.eligibilityScore}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <Gift className="h-5 w-5 text-emerald-600" />
                          <span className="text-xs font-semibold text-emerald-700">Funding</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">{formatFunding(scheme.fundingAmount)}</span>
                      </div>
                      <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-4 rounded-xl border border-rose-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-5 w-5 text-rose-600" />
                          <span className="text-xs font-semibold text-rose-700">Deadline</span>
                        </div>
                        <span className={`text-sm font-bold ${scheme.status === 'closing-soon' ? 'text-rose-600' : 'text-gray-900'}`}>
                          {formatDeadline(scheme.deadline)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedScheme(scheme)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 flex items-center justify-center gap-3 font-semibold text-lg shadow-lg"
                    >
                      <ExternalLink className="h-5 w-5" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Schemes */}
        {!selectedScheme && (
          <div className="grid gap-6">
            {regularSchemes.map(scheme => (
              <div key={scheme.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 hover-scale transition-all duration-300">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <h3 className="text-xl font-bold text-gray-900 tracking-tight">{scheme.name}</h3>
                            <div className={`w-3 h-3 rounded-full ${getUrgencyColor('medium')}`}></div>
                          </div>
                          <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">{scheme.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-2">
                              <MapPin className="h-5 w-5 text-blue-600" />
                              {scheme.provider}
                            </span>
                            <span className="flex items-center gap-2">
                              <Users className="h-5 w-5 text-blue-600" />
                              {scheme.applicants.toLocaleString()} applicants
                            </span>
                            <span className="flex items-center gap-2">
                              <TrendingUp className="h-5 w-5 text-blue-600" />
                              {scheme.successRate}% success rate
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleSaveScheme(scheme.id)}
                          className={`p-2.5 rounded-full transition-all duration-300 ${
                            savedSchemes.has(scheme.id) ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 shadow-md' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                          }`}
                        >
                          <Heart className={`h-5 w-5 ${savedSchemes.has(scheme.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                      <div className="w-40 bg-gray-200 rounded-full h-3">
                        <div className="progress-bar h-3 rounded-full" style={{ '--progress': `${scheme.eligibilityScore}%` }}></div>
                      </div>
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-full shadow-sm">
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 fill-current" />
                          <span className="font-semibold">{scheme.eligibilityScore}% Match</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600 font-medium">Deadline:</span>
                      <span className="font-semibold text-gray-900">{formatDeadline(scheme.deadline)}</span>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleSaveScheme(scheme.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 transition-all duration-300 font-semibold shadow-sm ${
                          savedSchemes.has(scheme.id) ? 'bg-gray-100 text-gray-700' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <BookmarkPlus className="h-5 w-5" />
                        {savedSchemes.has(scheme.id) ? 'Saved' : 'Save'}
                      </button>
                      <button
                        onClick={() => setSelectedScheme(scheme)}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 flex items-center gap-2 font-semibold shadow-sm"
                      >
                        <ExternalLink className="h-5 w-5" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!selectedScheme && sortedSchemes.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-12 max-w-md mx-auto animate-fade-in">
              <div className="text-gray-300 mb-6">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Schemes Found</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Try adjusting your search or filters to discover more opportunities.</p>
              <button
                onClick={resetFilters}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 font-semibold shadow-lg"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scheme;