import { Save, Shield, Key } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h3 className="text-lg font-semibold text-white">My Profile & Account Security</h3>
        <p className="text-sm text-muted-foreground">Manage your credentials, access keys, and security settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column: Profile info */}
        <div className="md:col-span-2 bg-card border border-border rounded-xl p-6 space-y-6 shadow">
          <div className="border-b border-border pb-4">
            <h4 className="font-bold text-white text-sm">Personal Details</h4>
            <p className="text-xs text-muted-foreground">Update your identity and email parameters.</p>
          </div>
          
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
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
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Email Address</label>
              <input type="email" defaultValue="admin@intellisphere.com" className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Role</label>
              <input type="text" defaultValue="System Administrator" disabled className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-sm text-muted-foreground cursor-not-allowed" />
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/95 text-white font-semibold rounded-lg text-sm transition-colors shadow">
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right column: Quick security overview */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow">
            <h4 className="font-bold text-white text-sm mb-4 flex items-center space-x-2">
              <Shield className="h-4.5 w-4.5 text-secondary" />
              <span>Workspace Access</span>
            </h4>
            <div className="space-y-3 text-xs leading-normal">
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Organization:</span>
                <span className="font-semibold text-white">IntelliSphere Global</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">ID Token:</span>
                <span className="font-semibold text-white">JWT Bearer Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">MFA Status:</span>
                <span className="font-semibold text-secondary">Enabled</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow">
            <h4 className="font-bold text-white text-sm mb-4 flex items-center space-x-2">
              <Key className="h-4.5 w-4.5 text-accent" />
              <span>API Gateway Access</span>
            </h4>
            <p className="text-xs text-muted-foreground mb-4">You have 1 active API key registered for external simulation triggers.</p>
            <button className="w-full py-2 bg-muted hover:bg-muted/80 text-foreground border border-border rounded-lg text-xs font-semibold transition-colors">
              Rotate API Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
