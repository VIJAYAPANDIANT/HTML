import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  Building2, 
  Activity, 
  BarChart3, 
  FileSpreadsheet, 
  Bell, 
  Settings, 
  LogOut,
  Sparkles
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Center', href: '/ai-center', icon: BrainCircuit },
    { name: 'Organizations', href: '/organizations', icon: Building2 },
    { name: 'Industry Modules', href: '/industry', icon: Activity },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Reports', href: '/reports', icon: FileSpreadsheet },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Logo / Header */}
          <div className="h-16 flex items-center px-6 border-b border-border space-x-3">
            <div className="p-2 bg-primary rounded-lg text-white">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-white">IntelliSphere</h1>
              <span className="text-[10px] text-secondary font-medium tracking-wider uppercase">Decision AI</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-primary text-white shadow-md' 
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile / Logout */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <Link to="/profile" className="flex items-center space-x-3 hover:opacity-85 transition-opacity">
            <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-background font-bold">
              JD
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-white">John Doe</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          </Link>
          <button className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 border-b border-border flex items-center px-8 justify-between flex-shrink-0 bg-card/50 backdrop-blur-md">
          <h2 className="text-xl font-bold tracking-tight text-white capitalize">
            {location.pathname.substring(1).replace('-', ' ') || 'Dashboard'}
          </h2>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-muted-foreground hover:text-white rounded-full transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent" />
            </button>
          </div>
        </header>
        <div className="p-8 max-w-7xl w-full mx-auto flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
