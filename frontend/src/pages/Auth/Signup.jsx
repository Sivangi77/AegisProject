import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import GoogleSignInBtn from '../../components/auth/GoogleSignInBtn';

const Signup = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { signup, loginWithGoogle, loading } = useAuthStore();
  const navigate = useNavigate();

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      await signup(data.email, data.password);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to create account');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success('Welcome to AEGIS!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Google sign in failed');
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Create Account</h2>
        <p className="text-muted-foreground text-sm">Join AEGIS to boost your productivity</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthInput
          icon={User}
          type="text"
          placeholder="Full Name"
          error={errors.name?.message}
          {...register('name', { required: 'Full name is required' })}
        />

        <AuthInput
          icon={Mail}
          type="email"
          placeholder="Email address"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />

        <AuthInput
          icon={Lock}
          type="password"
          placeholder="Password"
          error={errors.password?.message}
          {...register('password', { 
            required: 'Password is required',
            minLength: { value: 6, message: 'Must be at least 6 characters' }
          })}
        />

        <AuthInput
          icon={Lock}
          type="password"
          placeholder="Confirm Password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', { 
            required: 'Please confirm your password',
            validate: value => value === password || 'Passwords do not match'
          })}
        />

        <div className="pt-2">
          <AuthButton type="submit" loading={loading} icon={UserPlus}>
            Sign Up
          </AuthButton>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-card text-muted-foreground">Or sign up with</span>
          </div>
        </div>

        <div className="mt-6">
          <GoogleSignInBtn onClick={handleGoogleLogin} loading={loading} />
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Signup;
