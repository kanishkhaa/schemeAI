import React, { useState } from 'react';
import { 
  Settings, 
  Volume2, 
  Type, 
  AlignLeft, 
  Minus, 
  Plus, 
  Link, 
  Eye, 
  EyeOff, 
  Mouse, 
  Sun, 
  Moon, 
  Palette,
  Globe,
  X,
  RotateCcw
} from 'lucide-react';

const AccessibilityDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    textToSpeech: { enabled: false, speed: 1, pitch: 1, volume: 0.8 },
    biggerText: { enabled: false, size: 16 },
    textSpacing: { enabled: false, spacing: 0 },
    lineHeight: { enabled: false, height: 1.5 },
    highlightLinks: { enabled: false, intensity: 50 },
    dyslexiaFriendly: { enabled: false, contrast: 50 },
    hideImages: { enabled: false },
    cursor: { enabled: false, size: 24 },
    lightDark: { mode: 'auto' }, // auto, light, dark
    invertColors: { enabled: false, intensity: 100 },
    language: { current: 'en' }
  });

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const toggleSetting = (category) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        enabled: !prev[category].enabled
      }
    }));
  };

  const resetSettings = () => {
    setSettings({
      textToSpeech: { enabled: false, speed: 1, pitch: 1, volume: 0.8 },
      biggerText: { enabled: false, size: 16 },
      textSpacing: { enabled: false, spacing: 0 },
      lineHeight: { enabled: false, height: 1.5 },
      highlightLinks: { enabled: false, intensity: 50 },
      dyslexiaFriendly: { enabled: false, contrast: 50 },
      hideImages: { enabled: false },
      cursor: { enabled: false, size: 24 },
      lightDark: { mode: 'auto' },
      invertColors: { enabled: false, intensity: 100 },
      language: { current: 'en' }
    });
  };

  const IncrementControl = ({ label, value, onChange, min = 0, max = 100, step = 1, unit = '' }) => (
    <div className="flex items-center justify-between mt-2">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onChange(Math.max(min, value - step))}
          className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
        >
          <Minus size={12} />
        </button>
        <span className="min-w-12 text-center text-sm font-medium">
          {value}{unit}
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + step))}
          className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
        >
          <Plus size={12} />
        </button>
      </div>
    </div>
  );

  const FeatureCard = ({ icon: Icon, title, description, enabled, onToggle, children }) => (
    <div className={`p-4 rounded-lg border-2 transition-all ${enabled ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${enabled ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
            <Icon size={20} />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className={`w-12 h-6 rounded-full transition-all duration-200 ${enabled ? 'bg-blue-500' : 'bg-gray-300'}`}
        >
          <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
        </button>
      </div>
      {enabled && children && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Accessibility Button - Top Right */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-50"
        aria-label="Open accessibility options"
      >
        <Settings size={24} />
      </button>

      {/* Accessibility Dialog */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Settings className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Accessibility Options</h2>
                    <p className="text-gray-600">Customize your browsing experience</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={resetSettings}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center space-x-2 transition-colors"
                  >
                    <RotateCcw size={16} />
                    <span>Reset</span>
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Text to Speech */}
                <FeatureCard
                  icon={Volume2}
                  title="Text to Speech"
                  description="Listen to webpage content"
                  enabled={settings.textToSpeech.enabled}
                  onToggle={() => toggleSetting('textToSpeech')}
                >
                  <IncrementControl
                    label="Speed"
                    value={settings.textToSpeech.speed}
                    onChange={(value) => updateSetting('textToSpeech', 'speed', value)}
                    min={0.5}
                    max={2}
                    step={0.1}
                    unit="x"
                  />
                  <IncrementControl
                    label="Pitch"
                    value={settings.textToSpeech.pitch}
                    onChange={(value) => updateSetting('textToSpeech', 'pitch', value)}
                    min={0.5}
                    max={2}
                    step={0.1}
                    unit="x"
                  />
                  <IncrementControl
                    label="Volume"
                    value={Math.round(settings.textToSpeech.volume * 100)}
                    onChange={(value) => updateSetting('textToSpeech', 'volume', value / 100)}
                    min={0}
                    max={100}
                    step={5}
                    unit="%"
                  />
                </FeatureCard>

                {/* Bigger Text */}
                <FeatureCard
                  icon={Type}
                  title="Bigger Text"
                  description="Increase text size for better readability"
                  enabled={settings.biggerText.enabled}
                  onToggle={() => toggleSetting('biggerText')}
                >
                  <IncrementControl
                    label="Text Size"
                    value={settings.biggerText.size}
                    onChange={(value) => updateSetting('biggerText', 'size', value)}
                    min={12}
                    max={36}
                    step={2}
                    unit="px"
                  />
                </FeatureCard>

                {/* Text Spacing */}
                <FeatureCard
                  icon={AlignLeft}
                  title="Text Spacing"
                  description="Adjust letter and word spacing"
                  enabled={settings.textSpacing.enabled}
                  onToggle={() => toggleSetting('textSpacing')}
                >
                  <IncrementControl
                    label="Letter Spacing"
                    value={settings.textSpacing.spacing}
                    onChange={(value) => updateSetting('textSpacing', 'spacing', value)}
                    min={0}
                    max={10}
                    step={1}
                    unit="px"
                  />
                </FeatureCard>

                {/* Line Height */}
                <FeatureCard
                  icon={AlignLeft}
                  title="Line Height"
                  description="Adjust spacing between lines"
                  enabled={settings.lineHeight.enabled}
                  onToggle={() => toggleSetting('lineHeight')}
                >
                  <IncrementControl
                    label="Line Height"
                    value={settings.lineHeight.height}
                    onChange={(value) => updateSetting('lineHeight', 'height', value)}
                    min={1}
                    max={3}
                    step={0.1}
                    unit="x"
                  />
                </FeatureCard>

                {/* Highlight Links */}
                <FeatureCard
                  icon={Link}
                  title="Highlight Links"
                  description="Make links more visible"
                  enabled={settings.highlightLinks.enabled}
                  onToggle={() => toggleSetting('highlightLinks')}
                >
                  <IncrementControl
                    label="Highlight Intensity"
                    value={settings.highlightLinks.intensity}
                    onChange={(value) => updateSetting('highlightLinks', 'intensity', value)}
                    min={0}
                    max={100}
                    step={10}
                    unit="%"
                  />
                </FeatureCard>

                {/* Dyslexia Friendly */}
                <FeatureCard
                  icon={Type}
                  title="Dyslexia Friendly"
                  description="Use dyslexia-friendly fonts and colors"
                  enabled={settings.dyslexiaFriendly.enabled}
                  onToggle={() => toggleSetting('dyslexiaFriendly')}
                >
                  <IncrementControl
                    label="Contrast Level"
                    value={settings.dyslexiaFriendly.contrast}
                    onChange={(value) => updateSetting('dyslexiaFriendly', 'contrast', value)}
                    min={0}
                    max={100}
                    step={10}
                    unit="%"
                  />
                </FeatureCard>

                {/* Hide Images */}
                <FeatureCard
                  icon={settings.hideImages.enabled ? EyeOff : Eye}
                  title="Hide Images"
                  description="Hide images to reduce distractions"
                  enabled={settings.hideImages.enabled}
                  onToggle={() => toggleSetting('hideImages')}
                />

                {/* Cursor */}
                <FeatureCard
                  icon={Mouse}
                  title="Enhanced Cursor"
                  description="Increase cursor size and visibility"
                  enabled={settings.cursor.enabled}
                  onToggle={() => toggleSetting('cursor')}
                >
                  <IncrementControl
                    label="Cursor Size"
                    value={settings.cursor.size}
                    onChange={(value) => updateSetting('cursor', 'size', value)}
                    min={16}
                    max={48}
                    step={4}
                    unit="px"
                  />
                </FeatureCard>

                {/* Light/Dark Mode */}
                <FeatureCard
                  icon={settings.lightDark.mode === 'dark' ? Moon : Sun}
                  title="Light/Dark Mode"
                  description="Switch between light and dark themes"
                  enabled={settings.lightDark.mode !== 'auto'}
                  onToggle={() => {}}
                >
                  <div className="flex space-x-2">
                    {['auto', 'light', 'dark'].map(mode => (
                      <button
                        key={mode}
                        onClick={() => updateSetting('lightDark', 'mode', mode)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          settings.lightDark.mode === mode
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </button>
                    ))}
                  </div>
                </FeatureCard>

                {/* Invert Colors */}
                <FeatureCard
                  icon={Palette}
                  title="Invert Colors"
                  description="Invert page colors for better contrast"
                  enabled={settings.invertColors.enabled}
                  onToggle={() => toggleSetting('invertColors')}
                >
                  <IncrementControl
                    label="Inversion Intensity"
                    value={settings.invertColors.intensity}
                    onChange={(value) => updateSetting('invertColors', 'intensity', value)}
                    min={0}
                    max={100}
                    step={10}
                    unit="%"
                  />
                </FeatureCard>

                {/* Language */}
                <FeatureCard
                  icon={Globe}
                  title="Language"
                  description="Change interface language"
                  enabled={settings.language.current !== 'en'}
                  onToggle={() => {}}
                >
                  <select
                    value={settings.language.current}
                    onChange={(e) => updateSetting('language', 'current', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="it">Italiano</option>
                    <option value="pt">Português</option>
                    <option value="zh">中文</option>
                    <option value="ja">日本語</option>
                    <option value="ko">한국어</option>
                    <option value="ar">العربية</option>
                  </select>
                </FeatureCard>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-xl">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Active features: {Object.values(settings).filter(s => s.enabled).length}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityDialog;