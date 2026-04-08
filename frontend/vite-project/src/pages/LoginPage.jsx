import { useState } from 'react';
import { useForm } from 'react-hook-form';
import FormInput from '../components/FormInput';
import http from "../lib/http"

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

const onSubmit = async (data) => {
    setApiError('');
    setSuccessMessage('');

    try {
      const response = await http('/api/login', {
        email: data.email,
        password: data.password,
      }, {
        method: 'POST'
      });

      const result = await response.json();

      if (!response.ok) {
        setApiError(result.message || 'Login failed');
        return;
      }

      // Store token in localStorage
      localStorage.setItem('token', result.token);
      setSuccessMessage('Login successful! Redirecting...');
      
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (error) {
      setApiError('Network error. Please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">Welcome Back</h2>
          <p className="text-gray-600 text-sm mb-5">Please enter your details to sign in.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {apiError}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {successMessage}
              </div>
            )}

            <FormInput
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              name="email"
              register={register}
              error={errors.email}
              validation={{
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              }}
            />

            <FormInput
              label="Password"
              type="password"
              placeholder="••••••••"
              name="password"
              register={register}
              error={errors.password}
              validation={{
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              }}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition mt-6"
            >
              {isSubmitting ? 'Logging in...' : 'Log In'}
            </button>
          </form>
        </div>

        {/* Footer Links */}
        <div className="text-center mt-6 space-y-3">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up
            </a>
          </p>
          <div className="flex justify-center gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-700">Terms of Service</a>
            <a href="#" className="hover:text-gray-700">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
}