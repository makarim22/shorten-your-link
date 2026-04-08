import { useState } from 'react';
import { Menu, X } from 'lucide-react';
// import  { BASE_URL } from '../services/http';

import Dashboard from '../assets/dashboard.jpg'
import http from "../lib/http";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [shortLink, setShortLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_URL 
  console.log("base_url", BASE_URL);

  const handleCreateLink = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        original_url: urlInput
      };

      const response = await http('/public/generate', payload, {
        method: 'POST'
      });

      const data = await response.json();
      console.log('Link created:', data);

      setShortLink(`${BASE_URL}/${data.short_code}`);
      setUrlInput('');

    } catch (err) {
      console.error('Error creating link:', err);
      setError('Error creating link: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded"></div>
              <span className="text-xl font-bold text-gray-900">ShortLink</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Dashboard</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Analytics</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Links</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <a href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Login
              </a>
              <a href="/auth/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
                Sign up
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-4">
              <a href="#" className="block text-gray-600 hover:text-gray-900 font-medium">Dashboard</a>
              <a href="#" className="block text-gray-600 hover:text-gray-900 font-medium">Analytics</a>
              <a href="#" className="block text-gray-600 hover:text-gray-900 font-medium">Links</a>
              <a href="/auth/login" className="block text-blue-600 hover:text-blue-700 font-medium">
                Login
              </a>
              <a href="/auth/register" className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-center">
                Sign up
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4">
            Shorten URLs. <span className="text-blue-600">Share Easily.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create short, memorable links for your team communications.
            Transform long, cumbersome URLs into powerful digital assets that
            drive engagement.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <a href="/auth/register" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition">
              Get Started
            </a>
            <a href="#" className="text-blue-600 hover:text-blue-700 px-8 py-3 font-semibold border border-blue-600 rounded-lg transition">
              Learn More
            </a>
          </div>

          {/* URL Shortener Demo */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-2xl mx-auto">
            <form onSubmit={handleCreateLink}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="url"
                    placeholder="https://very-long-architectural-url.com/asset-id-99238-x1"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    required
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap"
                  >
                    {loading ? 'Shortening...' : 'Shorten'}
                  </button>
                </div>

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                {shortLink && (
                  <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg flex items-center justify-between">
                    <span>Shortened link: <a href={shortLink} target="_blank" rel="noopener noreferrer" className="font-semibold underline">{shortLink}</a></span>
                    <button 
                      type="button"
                      onClick={() => navigator.clipboard.writeText(shortLink)}
                      className="ml-2 text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                    >
                      Copy
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">
            Why Choose ShortLink?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-blue-600 font-bold">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600 text-sm">
                Create short links instantly. No waiting, no complications.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-blue-600 font-bold">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
              <p className="text-gray-600 text-sm">
                Track clicks, sources, and engagement metrics in real time.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-blue-600 font-bold">🔒</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure</h3>
              <p className="text-gray-600 text-sm">
                Enterprise-grade security to protect your links and data.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Insights Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="rounded-lg overflow-hidden">
              <img
                src={Dashboard}
                alt="Analytics Dashboard"
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>

            {/* Content */}
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-2">DATA DRIVEN INSIGHTS</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Observe your link architecture in real-time.
              </h2>
              <p className="text-gray-600 mb-6">
                Every click is a data point. Our dashboard provides surgical precision into where your traffic originates, who is engaging, and how your team communications are performing across the globe.
              </p>

              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">Geographic Distribution Maps</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">Device & Browser Breakdown</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">UTM Parameter Tracking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded"></div>
              <span className="text-lg font-bold text-gray-900">ShortLink</span>
            </div>
            <div className="flex gap-8 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900">Privacy Policy</a>
              <a href="#" className="hover:text-gray-900">Terms of Service</a>
              <a href="#" className="hover:text-gray-900">Contact</a>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2024 ShortLink. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}