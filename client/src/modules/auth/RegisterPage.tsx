import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 py-12">
      <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">Create Account</h1>
          <p className="text-muted-foreground mt-2">Initialize your Decision AI workspace</p>
        </div>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); navigate('/login'); }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">First Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="John"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Last Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Doe"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="name@company.com" 
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Workspace Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Acme Global" 
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••" 
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-2.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary mt-6 shadow-md"
          >
            Register Workspace
          </button>
        </form>
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-secondary font-semibold hover:underline">
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
