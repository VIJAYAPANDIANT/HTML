export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">IntelliSphere</h1>
          <p className="text-muted-foreground mt-2">AI-Powered Decision Intelligence Platform</p>
        </div>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              placeholder="name@company.com" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              placeholder="••••••••" 
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-2 bg-primary hover:bg-primary/95 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
