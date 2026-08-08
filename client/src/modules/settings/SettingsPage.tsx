import { useState, useEffect } from 'react';
import { Save, User, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [user, setUser] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@intellisphere.com'
  });
  const [apiKey, setApiKey] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Load existing user from localStorage
    const storedUser = localStorage.getItem('intellisphere_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser({
          firstName: parsed.firstName || 'Admin',
          lastName: parsed.lastName || 'User',
          email: parsed.email || 'admin@intellisphere.com'
        });
      } catch (e) {
        // ignore
      }
    }

    // Load existing API key
    const storedKey = localStorage.getItem('intellisphere_gemini_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSave = () => {
    // 1. Update user info in localStorage
    const updatedUser = { ...user };
    localStorage.setItem('intellisphere_user', JSON.stringify(updatedUser));

    // 2. Save Gemini API key locally
    localStorage.setItem('intellisphere_gemini_key', apiKey);

    // 3. Show success notification
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      // Reload page to apply initials change dynamically in navigation headers
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h3 className="text-lg font-semibold text-foreground">System & Profile Settings</h3>
        <p className="text-sm text-muted-foreground">Adjust API keys, user profile settings, and default AI parameters.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        {/* Profile Card */}
        <div className="flex items-center space-x-4 border-b border-border pb-6">
          <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-foreground text-sm">Account Owner</h4>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {/* Success Alert */}
        {showSuccess && (
          <div className="p-4 bg-secondary/10 border border-secondary/20 text-secondary rounded-lg flex items-center space-x-2 text-xs animate-in fade-in duration-200">
            <CheckCircle2 className="h-4 w-4" />
            <span>Settings saved successfully! Reloading to apply...</span>
          </div>
        )}

        {/* Form fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">First Name</label>
              <input 
                type="text" 
                value={user.firstName}
                onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Last Name</label>
              <input 
                type="text" 
                value={user.lastName}
                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Gemini API Key</label>
            <input 
              type="password" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Google Gemini API Key" 
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
            />
            <p className="text-[10px] text-muted-foreground mt-1">
              Used dynamically for AI Predictions and chat. If blank, default keys are utilized.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/95 text-white font-semibold rounded-lg text-sm transition-all shadow-md"
          >
            <Save className="h-4 w-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
