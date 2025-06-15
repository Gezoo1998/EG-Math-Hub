import React, { useState } from 'react';
import { Settings, Palette, Bell, Shield, Download, Database } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState('glassmorphic');
  const [language, setLanguage] = useState('english');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="glass-card p-8 slide-in">
        <div className="flex items-center mb-6">
          <Settings size={32} className="text-blue-300 mr-4" />
          <h1 className="text-3xl font-bold text-white">Settings</h1>
        </div>
        <p className="text-white/70">
          Customize your SciPub experience. More settings will be available in future updates.
        </p>
      </div>

      {/* Appearance Settings */}
      <div className="glass-card p-6 slide-in">
        <div className="flex items-center mb-4">
          <Palette size={24} className="text-purple-300 mr-3" />
          <h2 className="text-xl font-bold text-white">Appearance</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Theme
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full md:w-auto px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="glassmorphic" className="bg-gray-800">Glassmorphic (Current)</option>
              <option value="dark" className="bg-gray-800">Dark Mode (Coming Soon)</option>
              <option value="light" className="bg-gray-800">Light Mode (Coming Soon)</option>
            </select>
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full md:w-auto px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="english" className="bg-gray-800">English</option>
              <option value="spanish" className="bg-gray-800">Español (Coming Soon)</option>
              <option value="french" className="bg-gray-800">Français (Coming Soon)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card p-6 slide-in">
        <div className="flex items-center mb-4">
          <Bell size={24} className="text-green-300 mr-3" />
          <h2 className="text-xl font-bold text-white">Notifications</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">New Articles</p>
              <p className="text-white/60 text-sm">Get notified when new articles are published</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications ? 'bg-blue-500' : 'bg-white/20'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="glass-card p-6 slide-in">
        <div className="flex items-center mb-4">
          <Shield size={24} className="text-yellow-300 mr-3" />
          <h2 className="text-xl font-bold text-white">Privacy & Security</h2>
        </div>
        
        <div className="space-y-4">
          <p className="text-white/70">
            This is a demonstration platform. No user authentication is currently implemented.
            Future versions will include comprehensive privacy and security settings.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <button className="glass-button text-left p-4">
              <Shield size={18} className="mb-2" />
              <p className="font-medium">Privacy Policy</p>
              <p className="text-sm opacity-70">Review our privacy practices</p>
            </button>
            
            <button className="glass-button text-left p-4">
              <Database size={18} className="mb-2" />
              <p className="font-medium">Data Export</p>
              <p className="text-sm opacity-70">Download your data</p>
            </button>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="glass-card p-6 slide-in">
        <div className="flex items-center mb-4">
          <Download size={24} className="text-blue-300 mr-3" />
          <h2 className="text-xl font-bold text-white">Data Management</h2>
        </div>
        
        <div className="space-y-4">
          <p className="text-white/70">
            Manage your reading history and preferences. These features will be available 
            when user accounts are implemented.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <button className="glass-button text-left p-4 opacity-50 cursor-not-allowed">
              <Download size={18} className="mb-2" />
              <p className="font-medium">Export Reading History</p>
              <p className="text-sm opacity-70">Coming Soon</p>
            </button>
            
            <button className="glass-button text-left p-4 opacity-50 cursor-not-allowed">
              <Settings size={18} className="mb-2" />
              <p className="font-medium">Reset Preferences</p>
              <p className="text-sm opacity-70">Coming Soon</p>
            </button>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-white/60">
          More settings will be added in future updates. Stay tuned!
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;