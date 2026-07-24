import { Building2, Plus, Users } from 'lucide-react';

export default function OrganizationsPage() {
  const orgs = [
    { name: 'IntelliSphere Global', domain: 'global.intellisphere.com', members: 42, role: 'Owner' },
    { name: 'Acme Research Labs', domain: 'acme.io', members: 15, role: 'Admin' },
    { name: 'Cyberdyne Systems', domain: 'cyberdyne.jp', members: 8, role: 'Member' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-white">Organizations & Workspaces</h3>
          <p className="text-sm text-muted-foreground">Manage organization units, team memberships, and collaborative environments.</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/95 text-white font-semibold rounded-lg text-sm transition-colors">
          <Plus className="h-4 w-4" />
          <span>New Workspace</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {orgs.map((org) => (
          <div key={org.name} className="bg-card border border-border rounded-xl p-6 shadow hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-secondary/10 rounded-lg text-secondary">
                <Building2 className="h-6 w-6" />
              </div>
              <span className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">
                {org.role}
              </span>
            </div>
            <h4 className="text-lg font-bold text-white mb-1">{org.name}</h4>
            <p className="text-sm text-muted-foreground mb-4">{org.domain}</p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground border-t border-border pt-4">
              <Users className="h-4 w-4" />
              <span>{org.members} active users</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
