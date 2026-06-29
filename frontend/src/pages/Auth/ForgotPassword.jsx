import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { resetPassword, loading } = useAuthStore();

  const onSubmit = async (data) => {
    try {
      await resetPassword(data.email);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error) {
      toast.error(error.message || 'Failed to send reset email');
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>
        <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
        <p className="text-muted-foreground text-sm">Enter your email address and we'll send you a link to reset your password.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthInput
          icon={Mail}
          type="email"
          placeholder="Email address"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required' })}
        />

        <div className="pt-2">
          <AuthButton type="submit" loading={loading} icon={Send}>
            Send Reset Link
          </AuthButton>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
