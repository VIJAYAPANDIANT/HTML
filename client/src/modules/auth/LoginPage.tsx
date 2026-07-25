import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';
import api from '@/lib/axios';

// Login Validation Schema via Zod
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please provide a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type LoginFields = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFields) => {
    setErrorMsg(null);
    try {
      const response = await api.post('/api/v1/auth/login', data);
      const { token, role, email, firstName, lastName } = response.data;
      
      localStorage.setItem('intellisphere_token', token);
      localStorage.setItem('intellisphere_user', JSON.stringify({ role, email, firstName, lastName }));
      
      navigate('/dashboard');
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg('Authentication failed. Please verify your connection and try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 py-12 relative overflow-hidden">
      {/* Background visual glowing circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-2xl relative z-10 transition-all duration-300">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-primary/10 text-primary rounded-xl mb-4">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Welcome Back</h1>
          <p className="text-xs text-muted-foreground mt-2">Sign in to your IntelliSphere AI workspace</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg flex items-start space-x-2 text-xs" role="alert">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email field */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              {...register('email')}
              aria-invalid={errors.email ? 'true' : 'false'}
              className={`w-full px-4 py-2.5 bg-background border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.email ? 'border-destructive' : 'border-border'
              }`}
              placeholder="name@company.com" 
            />
            {errors.email && (
              <p className="text-xs text-destructive mt-1 flex items-center space-x-1">
                <span>{errors.email.message}</span>
              </p>
            )}
          </div>

          {/* Password field */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                {...register('password')}
                aria-invalid={errors.password ? 'true' : 'false'}
                className={`w-full px-4 py-2.5 bg-background border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-10 ${
                  errors.password ? 'border-destructive' : 'border-border'
                }`}
                placeholder="••••••••" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-white"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive mt-1">
                <span>{errors.password.message}</span>
              </p>
            )}
          </div>

          {/* Submit button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-2.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary mt-6 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="text-center mt-6 border-t border-border/50 pt-6">
          <p className="text-xs text-muted-foreground">
            Don't have an account?{' '}
            <button onClick={() => navigate('/register')} className="text-secondary font-semibold hover:underline">
              Create a workspace
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
