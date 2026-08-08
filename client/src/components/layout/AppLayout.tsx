import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  Sparkles,
  ChevronDown,
  Search,
  Sun,
  Moon,
  User,
  ChevronLeft,
  ChevronRight,
  Coins,
  Compass,
  Truck,
  Upload,
  Leaf,
  Menu
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // Layout states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Mock workspace organizations
  const organizations = [
    { name: 'IntelliSphere Global', code: 'ISG' },
    { name: 'Acme Research Labs', code: 'ARL' },
    { name: 'Cyberdyne Systems', code: 'CDS' }
  ];
  const [activeOrg, setActiveOrg] = useState(organizations[0]);

  // Mock Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Simulation completed: Agriculture Model Section 4B', read: false, time: '5m ago' },
    { id: 2, text: 'New prediction anomaly alert in Smart Grid Load', read: false, time: '1h ago' },
    { id: 3, text: 'System backup finished successfully', read: true, time: '4h ago' }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Toggle light/dark theme class on document element
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('light-theme');
  };

  // Build Breadcrumbs from pathname
  const pathnames = location.pathname.split('/').filter(x => x);
  const breadcrumbs = pathnames.map((name, index) => {
    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
    const displayName = name.replace('-', ' ');
    return { name: displayName, path: routeTo };
  });

  const handleLogout = () => {
    localStorage.removeItem('intellisphere_token');
    localStorage.removeItem('intellisphere_user');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans transition-colors duration-300">
      
      {/* 1. Responsive & Collapsible Sidebar */}
      <aside 
        className={`bg-card border-r border-border flex flex-col justify-between flex-shrink-0 transition-all duration-300 relative ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Toggle Collapse Button */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-20 bg-card border border-border rounded-full p-1 text-muted-foreground hover:text-foreground shadow z-20"
        >
          {isSidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>

        <div className="flex-1 overflow-y-auto min-h-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Logo & Platform Banner */}
          <div className="h-16 flex items-center px-5 border-b border-border space-x-3 overflow-hidden">
            <div className="p-2 bg-primary rounded-xl text-white flex-shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            {!isSidebarCollapsed && (
              <div className="animate-in fade-in duration-300">
                <h1 className="font-bold text-sm tracking-tight text-white leading-none">IntelliSphere</h1>
                <span className="text-[9px] text-secondary font-bold tracking-widest uppercase">Decision AI</span>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {[
              { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
              { name: 'AI Center', href: '/ai-center', icon: BrainCircuit },
              { name: 'Organizations', href: '/organizations', icon: Building2 },
              { name: 'Agriculture', href: '/agriculture', icon: Coins },
              { name: 'Healthcare', href: '/healthcare', icon: Activity },
              { name: 'Manufacturing', href: '/manufacturing', icon: Compass },
              { name: 'Smart City', href: '/smart-city', icon: Truck },
              { name: 'Sustainability', href: '/sustainability', icon: Leaf },
              { name: 'Analytics', href: '/analytics', icon: BarChart3 },
              { name: 'Reports', href: '/reports', icon: FileSpreadsheet },
              { name: 'Upload Center', href: '/uploads', icon: Upload },
              { name: 'Notifications', href: '/notifications', icon: Bell },
              { name: 'Settings', href: '/settings', icon: Settings },
            ].map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center rounded-lg font-medium transition-all duration-200 ${
                    isSidebarCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-4 py-2.5 text-sm'
                  } ${
                    isActive 
                      ? 'bg-primary text-white shadow-md shadow-primary/10' 
                      : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'
                  }`}
                  title={item.name}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isSidebarCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Collapsed bottom Profile Indicator / Logout */}
        <div className="p-4 border-t border-border flex flex-col items-center">
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center justify-center p-2.5 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors ${
              isSidebarCollapsed ? '' : 'space-x-2 text-sm font-medium'
            }`}
            title="Log Out"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* 2. Top Header Navigation and Content Shell */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Sticky Glassmorphic Navbar */}
        <header className="sticky top-0 h-16 border-b border-border/80 flex items-center px-8 justify-between bg-card/75 backdrop-blur-lg z-30 flex-shrink-0">
          
          {/* Left Side: Org Switcher & Breadcrumbs */}
          <div className="flex items-center space-x-4">
            {/* Sidebar toggle menu button (three lines) */}
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Org Switcher */}
            <div className="relative">
              <button 
                onClick={() => setShowOrgDropdown(!showOrgDropdown)}
                className="flex items-center space-x-2 px-2.5 py-1.5 bg-background/50 border border-border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="h-5 w-5 rounded bg-secondary/15 text-secondary flex items-center justify-center font-bold text-[10px]">
                  {activeOrg.code}
                </div>
                <span className="text-xs font-bold text-white max-w-[120px] truncate hidden md:inline">
                  {activeOrg.name}
                </span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </button>

              {showOrgDropdown && (
                <div className="absolute left-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-xl z-50 p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  {organizations.map((org) => (
                    <button
                      key={org.code}
                      onClick={() => {
                        setActiveOrg(org);
                        setShowOrgDropdown(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs font-semibold rounded-md hover:bg-muted/50 text-slate-300 hover:text-white flex items-center justify-between"
                    >
                      <span>{org.name}</span>
                      {activeOrg.code === org.code && (
                        <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="h-4 w-px bg-border/80" />

            {/* Breadcrumb Navigation */}
            <div className="flex items-center space-x-2 text-xs font-semibold text-muted-foreground">
              <Link to="/dashboard" className="hover:text-white transition-colors">Home</Link>
              {breadcrumbs.map((crumb, idx) => (
                <div key={crumb.path} className="flex items-center space-x-2">
                  <span>/</span>
                  <Link 
                    to={crumb.path} 
                    className={`hover:text-white transition-colors capitalize ${
                      idx === breadcrumbs.length - 1 ? 'text-white font-semibold' : ''
                    }`}
                  >
                    {crumb.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Search, AI Assistant, Notifications, Theme, Profile */}
          <div className="flex items-center space-x-4">
            
            {/* Search Bar */}
            <div className="relative w-40 sm:w-56 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-background/50 border border-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* AI Assistant Button */}
            <button 
              onClick={() => navigate('/ai-center')}
              className="p-2 text-muted-foreground hover:text-primary rounded-lg transition-colors focus:outline-none relative group"
              title="AI Assistant"
            >
              <Sparkles className="h-5 w-5 text-accent animate-pulse" />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-card border border-border text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow z-50">
                AI Assistant
              </span>
            </button>

            {/* Notification Center */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifDropdown(!showNotifDropdown);
                  setShowProfileDropdown(false);
                }}
                className="relative p-2 text-muted-foreground hover:text-white rounded-lg transition-colors focus:outline-none"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-destructive text-[9px] font-bold text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifDropdown && (
                <div className="absolute right-0 mt-3 w-80 bg-card border border-border rounded-xl shadow-2xl z-50 p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <span className="text-xs font-bold text-white">Notifications</span>
                    <button 
                      onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                      className="text-[10px] text-secondary hover:underline font-semibold"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className={`p-2.5 rounded-lg text-xs leading-normal flex justify-between space-x-2 ${n.read ? 'bg-muted/10' : 'bg-primary/5 border border-primary/10'}`}>
                        <div>
                          <p className={n.read ? 'text-muted-foreground' : 'text-slate-200 font-medium'}>{n.text}</p>
                          <span className="text-[9px] text-muted-foreground block mt-1">{n.time}</span>
                        </div>
                        {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-1" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 text-muted-foreground hover:text-white rounded-lg transition-colors focus:outline-none"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <div className="h-4 w-px bg-border/80" />

            {/* User Profile Menu & Avatar with Status ring */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowProfileDropdown(!showProfileDropdown);
                  setShowNotifDropdown(false);
                }}
                className="flex items-center space-x-2 focus:outline-none hover:opacity-90 transition-opacity"
              >
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-background font-bold text-xs ring-2 ring-primary/20">
                    JD
                  </div>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-secondary border-2 border-card" />
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-3 w-48 bg-card border border-border rounded-xl shadow-2xl z-50 p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link 
                    to="/profile" 
                    onClick={() => setShowProfileDropdown(false)}
                    className="flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-muted/50 text-slate-300 hover:text-white"
                  >
                    <User className="h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                  <Link 
                    to="/settings" 
                    onClick={() => setShowProfileDropdown(false)}
                    className="flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-muted/50 text-slate-300 hover:text-white"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                  <div className="border-t border-border/50 my-1" />
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-destructive/10 text-slate-300 hover:text-destructive text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Content Body Layout */}
        <div className="flex-1 overflow-y-auto p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}
