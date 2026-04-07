import { useState } from 'react';
import { useForm } from 'react-hook-form';
import FormInput from '../components/FormInput';

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const password = watch('password');

  const onSubmit = async (data) => {
    setApiError('');
    setSuccessMessage('');

    try {
      const response = await fetch('http://localhost:9000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setApiError(result.message || 'Registration failed');
        return;
      }

      setSuccessMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 2000);
    } catch (error) {
      setApiError('Network error. Please try again.');
      console.error('Registration error:', error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <div>
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
          <p className="text-xs text-gray-500 mt-1">MINIMUM 8 CHARACTERS</p>
        </div>

        <FormInput
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          name="confirmPassword"
          register={register}
          error={errors.confirmPassword}
          validation={{
            required: 'Please confirm your password',
            validate: (value) =>
              value === password || 'Passwords do not match',
          }}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 rounded-lg transition mt-6"
        >
          {isSubmitting ? 'Creating Account...' : 'Sign Up →'}
        </button>

        <p className="text-center text-xs text-gray-600 mt-4">
          By signing up, you agree to our{' '}
          <a href="/terms" className="text-blue-600 hover:text-blue-700">
            Terms of Service
          </a>
          {' '}and{' '}
          <a href="/privacy" className="text-blue-600 hover:text-blue-700">
            Privacy Policy
          </a>
        </p>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Log in
          </a>
        </p>
      </div>
    </>
  );
}