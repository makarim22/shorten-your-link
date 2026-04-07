import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, ChevronLeft } from 'lucide-react';

export default function CreateLink() {
  const navigate = useNavigate();
  const [destinationUrl, setDestinationUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [isLoading, setIsLoading] = useState(false);

//   const generateRandomSlug = () => {
//     const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
//     let slug = '';
//     for (let i = 0; i < 6; i++) {
//       slug += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     setCustomSlug(slug);
//   };

  const shortLink = customSlug ? `https://short.link/${customSlug}` : 'https://short.link/your-slug';

  const handleCreateLink = async (e) => {
    e.preventDefault();
    
    if (!destinationUrl) {
      alert('Please enter a destination URL');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:9000/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          destinationUrl,
          customSlug: customSlug || undefined
        })
      });

      if (response.ok) {
        navigate('/dashboard');
      } else {
        alert('Failed to create link');
      }
    } catch (error) {
      console.error('Error creating link:', error);
      alert('Error creating link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-black">ShortLink</h1>
            <nav className="flex gap-8">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900 font-medium text-sm"
              >
                Dashboard
              </button>
              <button className="text-gray-600 hover:text-gray-900 font-medium text-sm">Analytics</button>
              <button className="text-gray-600 hover:text-gray-900 font-medium text-sm">Links</button>
            </nav>
          </div>
          <button className="text-gray-600 hover:text-gray-900">
            <div className="w-8 h-8 rounded-full bg-gray-300"></div>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-8"
        >
          <ChevronLeft size={20} />
          Back to Dashboard
        </button>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-2">Create New Short Link</h2>
          <p className="text-gray-600">Transform your long URLs into clean, manageable assets.</p>
        </div>

        <form onSubmit={handleCreateLink} className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Destination URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">DESTINATION URL *</label>
            <div className="relative">
              <span className="absolute left-4 top-4 text-gray-400">
                <Eye size={18} />
              </span>
              <input
                type="url"
                placeholder="https://example.com/your-long-url-here"
                value={destinationUrl}
                onChange={(e) => setDestinationUrl(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Ensure your URL starts with http:// or https://</p>
          </div>

          {/* Custom Slug */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">CUSTOM SLUG (OPTIONAL)</label>
            <div className="flex gap-2">
              <div className="flex items-center px-4 bg-gray-100 rounded-lg border border-gray-300 text-gray-600 font-medium">
                short.link/
              </div>
              <input
                type="text"
                placeholder="my-custom-slug"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value.toLowerCase())}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Leave blank to generate a random unique identifier.</p>
          </div>

          {/* Live Preview */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Eye size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900 text-sm mb-1">LIVE PREVIEW</p>
                <p className="text-blue-600 font-medium">{shortLink}</p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 cursor-disabled flex items-center gap-2"
            >
              <span>⚡</span>
              {isLoading ? 'Creating...' : 'Create Link'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Features Section */}
        <div className="grid grid-cols-2 gap-6 mt-12">
          <div className="flex gap-3">
            <div className="text-2xl">📊</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Real-time Analytics</h3>
              <p className="text-sm text-gray-600">Track every click, geographical location, and referral source instantly.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-2xl">🔗</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Auto-generated QR</h3>
              <p className="text-sm text-gray-600">Every link automatically creates a high-resolution QR code for print.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-2xl mx-auto px-6 py-6 flex justify-between items-center text-xs text-gray-600">
          <div className="flex gap-6">
            <button className="hover:text-gray-900">PRIVACY POLICY</button>
            <button className="hover:text-gray-900">TERMS OF SERVICE</button>
            <button className="hover:text-gray-900">API DOCUMENTATION</button>
            <button className="hover:text-gray-900">SUPPORT</button>
          </div>
          <p>© 2024 SHORTLINK. THE DIGITAL ARCHITECT.</p>
        </div>
      </footer>
    </div>
  );
}