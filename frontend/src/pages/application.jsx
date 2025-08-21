import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  CheckCircle,
  Upload,
  Lightbulb,
  List,
  Info,
  AlertTriangle,
  Search,
  Filter,
  Download,
  ChevronRight,
  Clock,
  DollarSign,
  Users,
  Star,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
} from 'lucide-react';

const Application = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const schemes = [
    {
      id: 1,
      name: 'Soil Health Card',
      category: 'Agriculture',
      description: 'Providing farmers with comprehensive nutrient management solutions to improve soil quality and increase crop yield',
      eligibility: 'Small and marginal farmers with cultivable land',
      amount: '₹6,000 per year',
      deadline: '2025-12-31',
      applicants: '12M+',
      status: 'Active',
      rating: 4.8,
      location: 'Pan India',
    },
    {
      id: 2,
      name: 'Startup India Initiative',
      category: 'Business',
      description: 'Comprehensive support ecosystem for startups and entrepreneurs to foster innovation and business growth',
      eligibility: 'Innovative startups with DPIIT recognition',
      amount: 'Up to ₹10 Lakhs',
      deadline: '2025-10-15',
      applicants: '500K+',
      status: 'Active',
      rating: 4.6,
      location: 'Pan India',
    },
    {
      id: 3,
      name: 'Beti Bachao Beti Padhao',
      category: 'Education',
      description: 'Promotes girls\' education and empowerment through comprehensive support and awareness programs',
      eligibility: 'Girl child and women empowerment initiatives',
      amount: 'Varies by component',
      deadline: '2025-11-30',
      applicants: '2M+',
      status: 'Active',
      rating: 4.9,
      location: 'Pan India',
    },
    {
      id: 4,
      name: 'Ayushman Bharat',
      category: 'Healthcare',
      description: 'National health protection scheme providing cashless healthcare services to vulnerable families',
      eligibility: 'Families identified through SECC database',
      amount: 'Up to ₹5 Lakhs per family',
      deadline: '2025-12-31',
      applicants: '50M+',
      status: 'Active',
      rating: 4.7,
      location: 'Pan India',
    },
  ];

  const categories = ['all', 'Agriculture', 'Business', 'Education', 'Healthcare', 'Women Empowerment'];

  const schemeDetails = {
    requiredDocuments: [
      'Aadhaar Card (Original + Photocopy)',
      'Bank Account Details (Passbook/Statement)',
      'Income Certificate (Latest)',
      'Residence Proof (Utility Bill/Rent Agreement)',
      'Category Certificate (if applicable)',
      'Educational Qualification Certificate',
      'Passport Size Photographs (Recent)',
      'Active Mobile Number',
      'Active Email ID',
    ],
    eligibilityCriteria: [
      'Must be an Indian citizen',
      'Age between 18-60 years',
      'Annual family income within specified limit',
      'Not a beneficiary of similar schemes',
      'Valid bank account in applicant\'s name',
      'Complete address proof required',
      'Meets scheme-specific educational qualifications',
    ],
    submissionFormat: [
      'Complete application form in BLOCK LETTERS',
      'Attach documents in specified order',
      'Self-attest all photocopies',
      'Use black/blue ink for signatures',
      'Submit before deadline',
      'Retain acknowledgment receipt',
      'Ensure information matches documents',
    ],
    smartTips: [
      'Apply early to avoid delays',
      'Verify all documents before submission',
      'Keep multiple document copies',
      'Use official portal for applications',
      'Save application reference number',
      'Confirm eligibility thoroughly',
      'Contact helpline for clarification',
      'Track application status regularly',
    ],
    stepByStepGuide: [
      'Visit official scheme portal',
      'Review scheme guidelines',
      'Verify eligibility',
      'Collect required documents',
      'Complete application accurately',
      'Upload/attach documents',
      'Review before submission',
      'Submit and save receipt',
      'Note application reference number',
      'Monitor application status',
    ],
    postSubmissionInfo: [
      'Receive SMS/Email confirmation',
      'Verification within 15-30 days',
      'Possible field verification',
      'Status updates via SMS/Email',
      'Funds credited to bank account',
      'Check status online',
      'Contact helpline if no response after 45 days',
      'Certificate/sanction letter issued',
    ],
    dosAndDonts: {
      dos: [
        'Verify eligibility criteria thoroughly before applying',
        'Submit applications well before the deadline',
        'Ensure all documents are self-attested and valid',
        'Use the official portal for submissions',
        'Keep copies of all submitted documents',
        'Track application status regularly',
        'Provide accurate bank account details',
        'Contact the helpline for any clarifications',
      ],
      donts: [
        'Don\'t submit incomplete or illegible forms',
        'Don\'t provide false or mismatched information',
        'Don\'t miss the submission deadline',
        'Don\'t apply without meeting eligibility criteria',
        'Don\'t lose the acknowledgment receipt',
        'Don\'t use invalid or expired documents',
        'Don\'t ignore status updates or verification requests',
        'Don\'t share sensitive information on unofficial platforms',
      ],
    },
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredSchemes = schemes.filter(scheme => {
    try {
      const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || scheme.category === selectedCategory;
      return matchesSearch && matchesCategory;
    } catch (err) {
      setError('Error filtering schemes. Please try again.');
      return false;
    }
  });

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

  const TabButton = ({ id, label, icon: Icon, active }) => (
    <motion.button
      onClick={() => setActiveTab(id.toLowerCase())}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
        active 
          ? 'bg-gradient-to-r from-blue-500 to-blue-500 text-white shadow-md' 
          : 'bg-white/90 text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
      }`}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </motion.button>
  );

  const SkeletonCard = () => (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm animate-pulse"
    >
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded-full mt-4"></div>
    </motion.div>
  );

  const SchemeCard = ({ scheme }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl cursor-pointer relative overflow-hidden group"
      onClick={() => setSelectedScheme(scheme)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{scheme.name}</h3>
          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
            {scheme.category}
          </span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm text-gray-600">{scheme.rating}</span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{scheme.description}</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center text-xs text-gray-600 bg-green-50 p-2 rounded-lg">
            <DollarSign className="w-3 h-3 mr-1 text-green-500" />
            {scheme.amount}
          </div>
          <div className="flex items-center text-xs text-gray-600 bg-blue-50 p-2 rounded-lg">
            <Users className="w-3 h-3 mr-1 text-blue-500" />
            {scheme.applicants}
          </div>
          <div className="flex items-center text-xs text-gray-600 bg-yellow-50 p-2 rounded-lg">
            <Calendar className="w-3 h-3 mr-1 text-yellow-500" />
            {scheme.deadline}
          </div>
          <div className="flex items-center text-xs text-gray-600 bg-red-50 p-2 rounded-lg">
            <MapPin className="w-3 h-3 mr-1 text-red-500" />
            {scheme.location}
          </div>
        </div>
        <motion.button
          whileHover={{ x: 5 }}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-500 text-white py-2 rounded-lg flex items-center justify-center text-sm font-medium"
        >
          View Details
          <ChevronRight className="w-4 h-4 ml-1" />
        </motion.button>
      </div>
    </motion.div>
  );

  const DocumentSection = ({ title, icon: Icon, items }) => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg"
    >
      <div className="flex items-center mb-6">
        <div className="p-3 rounded-full bg-green-100 mr-3">
          <Icon className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="flex items-center p-4 bg-green-50 rounded-xl shadow-sm border border-green-100"
          >
            <div className="w-8 h-8 rounded-full bg-green-200 text-green-600 flex items-center justify-center text-sm font-semibold mr-4">
              {index + 1}
            </div>
            <p className="text-gray-700 text-sm font-medium">{item}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const EligibilitySection = ({ title, icon: Icon, items }) => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg"
    >
      <div className="flex items-center mb-6">
        <div className="p-3 rounded-full bg-blue-100 mr-3">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="flex items-center p-4 bg-blue-50 rounded-xl shadow-sm border border-blue-100"
          >
            <CheckCircle className="w-6 h-6 text-blue-600 mr-4" />
            <p className="text-gray-700 text-sm font-medium">{item}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

const SubmissionSection = ({ title, icon: Icon, items }) => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg"
  >
    <div className="flex items-center mb-6">
      <div className="p-3 rounded-full bg-blue-100 mr-3">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
    </div>
    <div className="space-y-4">
      {items.map((item, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="flex items-center p-4 bg-blue-50 rounded-xl shadow-sm border border-blue-100"
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold mr-4">
            {index + 1}
          </div>
          <p className="text-gray-700 text-sm font-medium">{item}</p>
        </motion.div>
      ))}
    </div>
  </motion.div>
);



  const TipsSection = ({ title, icon: Icon, items }) => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg"
    >
      <div className="flex items-center mb-6">
        <div className="p-3 rounded-full bg-yellow-100 mr-3">
          <Icon className="w-6 h-6 text-yellow-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="flex items-start p-4 bg-yellow-50 rounded-xl shadow-sm border border-yellow-100"
          >
            <Lightbulb className="w-6 h-6 text-yellow-600 mr-4" />
            <p className="text-gray-700 text-sm font-medium">{item}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const StepGuideSection = ({ title, icon: Icon, items }) => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg"
    >
      <div className="flex items-center mb-6">
        <div className="p-3 rounded-full bg-teal-100 mr-3">
          <Icon className="w-6 h-6 text-teal-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
      </div>
      <div className="relative">
        {items.map((item, index) => (
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
                {index < items.length - 1 && (
                  <div className="absolute top-12 left-6 w-0.5 h-[calc(100%-3rem)] bg-teal-200"></div>
                )}
              </div>
              <div className="ml-6 mt-2">
                <p className="text-gray-700 text-base font-medium">{item}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const PostSubmissionSection = ({ title, icon: Icon, items }) => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg"
    >
      <div className="flex items-center mb-6">
        <div className="p-3 rounded-full bg-cyan-100 mr-3">
          <Icon className="w-6 h-6 text-cyan-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="flex items-start p-4 bg-cyan-50 rounded-xl shadow-sm border border-cyan-100"
          >
            <Info className="w-6 h-6 text-cyan-600 mr-4" />
            <p className="text-gray-700 text-sm font-medium">{item}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const DosAndDontsSection = ({ dos, donts }) => (
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
            {dos.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-start p-4 bg-green-50 rounded-xl shadow-sm border border-green-100"
              >
                <div className="w-8 h-8 rounded-full bg-green-200 text-green-600 flex items-center justify-center text-sm font-semibold mr-4">
                  {index + 1}
                </div>
                <p className="text-gray-700 text-sm font-medium">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-full bg-red-100 mr-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Don'ts</h3>
          </div>
          <div className="space-y-4">
            {donts.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-start p-4 bg-red-50 rounded-xl shadow-sm border border-red-100"
              >
                <div className="w-8 h-8 rounded-full bg-red-200 text-red-600 flex items-center justify-center text-sm font-semibold mr-4">
                  {index + 1}
                </div>
                <p className="text-gray-700 text-sm font-medium">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center"
          >
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
            <button onClick={() => setError(null)} className="ml-3 text-lg">×</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-3xl p-4 shadow-xl border border-gray-200 mb-12"
        >
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { id: 'browse', label: 'Browse Schemes', icon: Search },
              { id: 'documents', label: 'Required Documents', icon: FileText },
              { id: 'eligibility', label: 'Eligibility Criteria', icon: CheckCircle },
              { id: 'submission', label: 'Submission Guidelines', icon: Upload },
              { id: 'tips', label: 'Smart Tips', icon: Lightbulb },
              { id: 'guide', label: 'Application Guide', icon: List },
              { id: 'post-submission', label: 'Post-Submission Info', icon: Info },
              { id: 'dos-donts', label: "Do's & Don'ts", icon: AlertTriangle },
            ].map(tab => (
              <TabButton key={tab.id} {...tab} active={activeTab === tab.id} />
            ))}
          </div>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {activeTab === 'browse' && (
            <div className="space-y-8">
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search schemes by name or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all text-gray-700"
                    />
                  </div>
                  <div className="relative min-w-[180px]">
                    <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full pl-12 pr-8 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all appearance-none text-gray-700"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <motion.div
                variants={containerVariants}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {isLoading ? (
                  Array(6).fill().map((_, i) => <SkeletonCard key={i} />)
                ) : filteredSchemes.length > 0 ? (
                  filteredSchemes.map(scheme => <SchemeCard key={scheme.id} scheme={scheme} />)
                ) : (
                  <motion.div
                    variants={itemVariants}
                    className="col-span-full text-center py-16 bg-white rounded-3xl border border-gray-200 shadow-lg"
                  >
                    <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No schemes found</h3>
                    <p className="text-gray-500">Try adjusting your search or category filter.</p>
                  </motion.div>
                )}
              </motion.div>
            </div>
          )}
          {activeTab === 'documents' && (
            <DocumentSection title="Required Documents" icon={FileText} items={schemeDetails.requiredDocuments} />
          )}
          {activeTab === 'eligibility' && (
            <EligibilitySection title="Eligibility Criteria" icon={CheckCircle} items={schemeDetails.eligibilityCriteria} />
          )}
          {activeTab === 'submission' && (
            <SubmissionSection title="Submission Guidelines" icon={Upload} items={schemeDetails.submissionFormat} />
          )}
          {activeTab === 'tips' && (
            <TipsSection title="Smart Tips" icon={Lightbulb} items={schemeDetails.smartTips} />
          )}
          {activeTab === 'guide' && (
            <StepGuideSection title="Step-by-Step Application Guide" icon={List} items={schemeDetails.stepByStepGuide} />
          )}
          {activeTab === 'post-submission' && (
            <PostSubmissionSection title="Post-Submission Information" icon={Info} items={schemeDetails.postSubmissionInfo} />
          )}
          {activeTab === 'dos-donts' && (
            <DosAndDontsSection dos={schemeDetails.dosAndDonts.dos} donts={schemeDetails.dosAndDonts.donts} />
          )}
        </motion.div>

        <AnimatePresence>
          {selectedScheme && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedScheme.name}</h2>
                      <div className="flex items-center gap-3">
                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                          {selectedScheme.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-600">{selectedScheme.rating}</span>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedScheme(null)}
                      className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                    >
                      ×
                    </motion.button>
                  </div>
                  <motion.div variants={itemVariants} className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="text-gray-700 text-sm">{selectedScheme.description}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-white rounded-xl border border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-gray-500">Amount</span>
                        </div>
                        <p className="text-gray-800 font-semibold text-sm">{selectedScheme.amount}</p>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-yellow-500" />
                          <span className="text-xs text-gray-500">Deadline</span>
                        </div>
                        <p className="text-gray-800 font-semibold text-sm">{selectedScheme.deadline}</p>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span className="text-xs text-gray-500">Applicants</span>
                        </div>
                        <p className="text-gray-800 font-semibold text-sm">{selectedScheme.applicants}</p>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="w-4 h-4 text-red-500" />
                          <span className="text-xs text-gray-500">Coverage</span>
                        </div>
                        <p className="text-gray-800 font-semibold text-sm">{selectedScheme.location}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-2xl">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        <span className="text-xs text-gray-500">Eligibility</span>
                      </div>
                      <p className="text-gray-700 text-sm">{selectedScheme.eligibility}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-500 text-white py-2.5 rounded-xl flex items-center justify-center text-sm font-medium"
                      >
                        <Globe className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                        Apply Now
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl flex items-center justify-center text-sm font-medium hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Download className="w-4 h-4 mr-2 group-hover:translate-y-0.5 transition-transform" />
                        Download Guidelines
                      </motion.button>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-50 rounded-xl text-xs text-gray-600">
                      <div className="flex flex-col sm:flex-row justify-between gap-2">
                        <div className="flex gap-4">
                          <span><Phone className="w-3 h-3 inline mr-1 text-blue-500" /> Helpline: 1800-XXX-XXXX</span>
                          <span><Mail className="w-3 h-3 inline mr-1 text-blue-500" /> support@gov.in</span>
                        </div>
                        <span><Clock className="w-3 h-3 inline mr-1 text-blue-500" /> 24/7 Support</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Application;