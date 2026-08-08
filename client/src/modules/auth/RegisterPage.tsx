import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/common/Logo';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import api from '@/lib/axios';

// Registration validation schema
const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().min(1, 'Email is required').email('Please provide a valid email address'),
  workspaceName: z.string().min(1, 'Workspace name is required'),
  role: z.enum(['SUPER_ADMIN', 'ORG_ADMIN', 'ANALYST', 'OPERATOR']),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string().min(6, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterFields = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFields) => {
    setErrorMsg(null);
    try {
      const payload = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        workspaceName: data.workspaceName,
      };
      
      await api.post('/api/v1/auth/register', payload);
      // Redirect to login after successful register
      navigate('/login');
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg('Workspace registration failed. Please try again later.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-primary/10 text-primary rounded-xl mb-4">
            <Logo className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Create Workspace</h1>
          <p className="text-xs text-muted-foreground mt-2">Initialize your SaaS organization and credentials</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg flex items-start space-x-2 text-xs" role="alert">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">First Name</label>
              <input 
                type="text" 
                {...register('firstName')}
                aria-invalid={errors.firstName ? 'true' : 'false'}
                className={`w-full px-4 py-2 bg-background border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.firstName ? 'border-destructive' : 'border-border'
                }`}
                placeholder="John" 
              />
              {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Last Name</label>
              <input 
                type="text" 
                {...register('lastName')}
                aria-invalid={errors.lastName ? 'true' : 'false'}
                className={`w-full px-4 py-2 bg-background border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.lastName ? 'border-destructive' : 'border-border'
                }`}
                placeholder="Doe" 
              />
              {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              {...register('email')}
              aria-invalid={errors.email ? 'true' : 'false'}
              className={`w-full px-4 py-2 bg-background border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.email ? 'border-destructive' : 'border-border'
              }`}
              placeholder="name@company.com" 
            />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
          </div>

          {/* Workspace Name */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Workspace / Company</label>
            <input 
              type="text" 
              {...register('workspaceName')}
              aria-invalid={errors.workspaceName ? 'true' : 'false'}
              className={`w-full px-4 py-2 bg-background border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.workspaceName ? 'border-destructive' : 'border-border'
              }`}
              placeholder="Acme Global" 
            />
            {errors.workspaceName && <p className="text-xs text-destructive mt-1">{errors.workspaceName.message}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Workspace Role</label>
            <select 
              {...register('role')}
              aria-invalid={errors.role ? 'true' : 'false'}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="ORG_ADMIN">Organization Admin</option>
              <option value="ANALYST">Analyst</option>
              <option value="OPERATOR">Operator</option>
            </select>
            {errors.role && <p className="text-xs text-destructive mt-1">{errors.role.message}</p>}
          </div>

          {/* Password & Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                {...register('password')}
                aria-invalid={errors.password ? 'true' : 'false'}
                className={`w-full px-4 py-2 bg-background border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-10 ${
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
            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Confirm Password</label>
            <input 
              type={showPassword ? 'text' : 'password'} 
              {...register('confirmPassword')}
              aria-invalid={errors.confirmPassword ? 'true' : 'false'}
              className={`w-full px-4 py-2 bg-background border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.confirmPassword ? 'border-destructive' : 'border-border'
              }`}
              placeholder="••••••••" 
            />
            {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-2.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary mt-6 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Registering Workspace...</span>
              </>
            ) : (
              <span>Register Workspace</span>
            )}
          </button>
        </form>

        <div className="text-center mt-6 border-t border-border/50 pt-6">
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
