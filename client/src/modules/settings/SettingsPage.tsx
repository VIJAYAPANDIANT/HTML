import { Save, User } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h3 className="text-lg font-semibold text-white">System & Profile Settings</h3>
        <p className="text-sm text-muted-foreground">Adjust API keys, user profile settings, and default AI parameters.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        {/* Profile Card */}
        <div className="flex items-center space-x-4 border-b border-border pb-6">
          <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Account Owner</h4>
            <p className="text-xs text-muted-foreground">admin@intellisphere.com</p>
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">First Name</label>
              <input type="text" defaultValue="John" className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Last Name</label>
              <input type="text" defaultValue="Doe" className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">OpenAI API Key</label>
            <input type="password" placeholder="sk-proj-••••••••••••••••••••" className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            <p className="text-[10px] text-muted-foreground mt-1">If blank, the platform uses default hosted gateway tokens.</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end pt-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/95 text-white font-semibold rounded-lg text-sm transition-all shadow-md">
            <Save className="h-4 w-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
