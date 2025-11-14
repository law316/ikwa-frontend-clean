import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Loader2, Globe } from 'lucide-react';
import { toast } from 'react-hot-toast';
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

const countries = [
  { code: 'DZ', name: 'Algeria', language: 'en' },
  { code: 'AO', name: 'Angola', language: 'en' },
  { code: 'BJ', name: 'Benin', language: 'en' },
  { code: 'BW', name: 'Botswana', language: 'en' },
  { code: 'BF', name: 'Burkina Faso', language: 'en' },
  { code: 'BI', name: 'Burundi', language: 'en' },
  { code: 'CV', name: 'Cabo Verde', language: 'en' },
  { code: 'CM', name: 'Cameroon', language: 'en' },
  { code: 'CF', name: 'Central African Republic', language: 'en' },
  { code: 'TD', name: 'Chad', language: 'en' },
  { code: 'KM', name: 'Comoros', language: 'en' },
  { code: 'CD', name: 'Democratic Republic of the Congo', language: 'en' },
  { code: 'CG', name: 'Republic of the Congo', language: 'en' },
  { code: 'DJ', name: 'Djibouti', language: 'en' },
  { code: 'EG', name: 'Egypt', language: 'en' },
  { code: 'GQ', name: 'Equatorial Guinea', language: 'en' },
  { code: 'ER', name: 'Eritrea', language: 'en' },
  { code: 'SZ', name: 'Eswatini', language: 'en' },
  { code: 'ET', name: 'Ethiopia', language: 'en' },
  { code: 'GA', name: 'Gabon', language: 'en' },
  { code: 'GM', name: 'Gambia', language: 'en' },
  { code: 'GH', name: 'Ghana', language: 'en' },
  { code: 'GN', name: 'Guinea', language: 'en' },
  { code: 'GW', name: 'Guinea-Bissau', language: 'en' },
  { code: 'CI', name: 'Ivory Coast', language: 'en' },
  { code: 'KE', name: 'Kenya', language: 'en' },
  { code: 'LS', name: 'Lesotho', language: 'en' },
  { code: 'LR', name: 'Liberia', language: 'en' },
  { code: 'LY', name: 'Libya', language: 'en' },
  { code: 'MG', name: 'Madagascar', language: 'en' },
  { code: 'MW', name: 'Malawi', language: 'en' },
  { code: 'ML', name: 'Mali', language: 'en' },
  { code: 'MR', name: 'Mauritania', language: 'en' },
  { code: 'MU', name: 'Mauritius', language: 'en' },
  { code: 'MA', name: 'Morocco', language: 'en' },
  { code: 'MZ', name: 'Mozambique', language: 'en' },
  { code: 'NA', name: 'Namibia', language: 'en' },
  { code: 'NE', name: 'Niger', language: 'en' },
  { code: 'NG', name: 'Nigeria', language: 'en' },
  { code: 'RW', name: 'Rwanda', language: 'en' },
  { code: 'ST', name: 'São Tomé and Príncipe', language: 'en' },
  { code: 'SN', name: 'Senegal', language: 'en' },
  { code: 'SC', name: 'Seychelles', language: 'en' },
  { code: 'SL', name: 'Sierra Leone', language: 'en' },
  { code: 'SO', name: 'Somalia', language: 'en' },
  { code: 'ZA', name: 'South Africa', language: 'en' },
  { code: 'SS', name: 'South Sudan', language: 'en' },
  { code: 'SD', name: 'Sudan', language: 'en' },
  { code: 'TZ', name: 'Tanzania', language: 'en' },
  { code: 'TG', name: 'Togo', language: 'en' },
  { code: 'TN', name: 'Tunisia', language: 'en' },
  { code: 'UG', name: 'Uganda', language: 'en' },
  { code: 'ZM', name: 'Zambia', language: 'en' },
  { code: 'ZW', name: 'Zimbabwe', language: 'en' }
];

const PasswordStrengthIndicator = ({ password }) => {
  const getStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = getStrength(password);
  const strengthText = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
  const strengthColors = [
    'gray-400', // Very Weak
    'gray-500', // Weak
    'gray-600', // Medium
    'gray-700', // Strong
    'gray-900', // Very Strong
  ];

  return (
    <div className="mt-2">
      <div className="flex gap-1 h-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`flex-1 rounded-full ${i < strength ? `bg-${strengthColors[i]}` : 'bg-gray-100'}`}
          />
        ))}
      </div>
      <p className={`mt-1 text-sm font-mono text-${strengthColors[strength - 1]}`}>
        {strengthText[strength - 1]}
      </p>
    </div>
  );
};

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('US');
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { register: registerUser } = useUser();
  const password = watch('password', '');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        repeatedPassword: data.confirmPassword,
        country: selectedCountry,
      });
      toast.success('User registered successfully');
      navigate('/login', { replace: true });
    } catch (error) {
      const message = error?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
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
            Create Account
          </h2>
          <p className="mt-2 text-gray-600">
            Join our community of vintage fashion enthusiasts
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-black">
                First Name
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-300" />
                </div>
                <input
                  id="firstName"
                  type="text"
                  {...register('firstName', {
                    required: 'First name is required'
                  })}
                  className={`block w-full pl-10 pr-3 py-2 border-2 ${
                    errors.firstName ? 'border-gray-300' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:border-gray-600 text-black placeholder-gray-400`}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-gray-600 font-mono">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-black">
                Last Name
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-300" />
                </div>
                <input
                  id="lastName"
                  type="text"
                  {...register('lastName', {
                    required: 'Last name is required'
                  })}
                  className={`block w-full pl-10 pr-3 py-2 border-2 ${
                    errors.lastName ? 'border-gray-300' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:border-gray-600 text-black placeholder-gray-400`}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-gray-600 font-mono">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black">
              Email Address
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-300" />
              </div>
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className={`block w-full pl-10 pr-3 py-2 border-2 ${
                  errors.email ? 'border-gray-300' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:border-gray-600 text-black placeholder-gray-400`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-gray-600 font-mono">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-black">
              Country
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-gray-300" />
              </div>
              <select
                id="country"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 text-black"
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black">
              Password
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-300" />
              </div>
              <input
                id="password"
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  }
                })}
                className={`block w-full pl-10 pr-3 py-2 border-2 ${
                  errors.password ? 'border-gray-300' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:border-gray-600 text-black placeholder-gray-400`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-gray-600 font-mono">
                  {errors.password.message}
                </p>
              )}
            </div>
            <PasswordStrengthIndicator password={password} />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-black">
              Confirm Password
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-300" />
              </div>
              <input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
                className={`block w-full pl-10 pr-3 py-2 border-2 ${
                  errors.confirmPassword ? 'border-gray-300' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:border-gray-600 text-black placeholder-gray-400`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-gray-600 font-mono">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              {...register('terms', {
                required: 'You must accept the terms and conditions'
              })}
              className="h-4 w-4 text-gray-600 focus:ring-gray-600 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
              I agree to the{' '}
              <Link to="/terms" className="text-gray-600 hover:text-black">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-gray-600 hover:text-black">
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.terms && (
            <p className="text-sm text-gray-600 font-mono">
              {errors.terms.message}
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-gray-600 hover:text-black transition-colors duration-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default RegisterPage;