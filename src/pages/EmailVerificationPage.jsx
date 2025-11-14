import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Mail, Loader2, ArrowLeft, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { authService } from '../services/api';
import { useUser } from '../contexts/UserContext';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn'
    }
  }
};

const EmailVerificationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { user } = useUser();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const emailFromStorage = (() => {
        try {
          const lsUser = localStorage.getItem('user');
          return lsUser ? JSON.parse(lsUser)?.email : undefined;
        } catch (_) {
          return undefined;
        }
      })();

      const payload = { code: data.code, email: user?.email || emailFromStorage };
      const resp = await authService.verifyEmail(payload);
      const result = resp?.data ?? resp;
      const isSuccess =
        result?.success === true ||
        String(result?.status || '').toLowerCase() === 'success' ||
        (typeof result?.message === 'string' && result.message.toLowerCase().includes('success')) ||
        result?.verified === true ||
        result?.status === 200 || result?.statusCode === 200;

      if (!isSuccess) throw new Error(result?.message || 'Verification failed');

      setIsVerified(true);
      toast.success(result?.message || 'Email verified successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Verification failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCountdown > 0) return;

    const emailFromStorage = (() => {
      try {
        const lsUser = localStorage.getItem('user');
        return lsUser ? JSON.parse(lsUser)?.email : undefined;
      } catch (_) {
        return undefined;
      }
    })();

    const email = user?.email || emailFromStorage;
    if (!email) {
      toast.error('Missing email for verification. Please register or login.');
      return;
    }

    try {
      const resp = await authService.resendVerification({ email });
      const result = resp?.data ?? resp;
      const isSuccess =
        result?.success === true ||
        String(result?.status || '').toLowerCase() === 'success' ||
        (typeof result?.message === 'string' && result.message.toLowerCase().includes('sent')) ||
        result?.status === 200 || result?.statusCode === 200;

      if (!isSuccess) throw new Error(result?.message || 'Failed to resend code');

      setResendCountdown(60);
      const timer = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      toast.success(result?.message || 'Verification code resent!');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to resend code. Please try again.';
      toast.error(message);
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="min-h-screen bg-white flex items-center justify-center px-4 py-12"
    >
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border-2 border-gray-200">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black font-mono">
            Verify Your Email
          </h2>
          <p className="mt-2 text-gray-700">
            Enter the verification code sent to your email address
          </p>
        </div>

        {!isVerified ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-black">
                Verification Code
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="code"
                  type="text"
                  {...register('code', {
                    required: 'Verification code is required',
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: 'Code must be 6 digits'
                    }
                  })}
                  className={`block w-full pl-10 pr-3 py-2 border-2 ${
                    errors.code ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:border-black text-black placeholder-gray-400`}
                  placeholder="123456"
                  maxLength={6}
                />
                {errors.code && (
                  <p className="mt-1 text-sm text-red-600 font-mono">
                    {errors.code.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Verify Email'
                )}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendCountdown > 0}
                className="inline-flex items-center text-sm font-medium text-black hover:text-gray-900 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${resendCountdown > 0 ? 'animate-spin' : ''}`} />
                {resendCountdown > 0
                  ? `Resend code in ${resendCountdown}s`
                  : 'Resend verification code'}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-8 text-center space-y-4">
            <div className="rounded-full bg-gray-100 p-3 inline-block">
              <Mail className="h-6 w-6 text-black" />
            </div>
            <h3 className="text-lg font-medium text-black">
              Email Verified!
            </h3>
            <p className="text-gray-700">
              Your email has been successfully verified. Redirecting to login...
            </p>
          </div>
        )}

        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-sm font-medium text-black hover:text-gray-900 transition-colors duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Login
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default EmailVerificationPage;