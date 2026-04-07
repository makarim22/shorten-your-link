import { useNavigate } from 'react-router-dom';
import { BarChart3, Link2, Code2 } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md">
          {/* 404 Icon and Number */}
          <div className="mb-8">
            <div className="inline-block relative mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                <span className="text-5xl font-bold text-blue-500">404</span>
              </div>
            </div>
          </div>

          {/* Heading and Description */}
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Page Not Found
          </h1>
          <p className="text-gray-600 text-base mb-8">
            The page you're looking for doesn't exist. It may have been moved, deleted, or the link might be broken.
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-12 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition flex items-center gap-2"
            >
              ← Go to Dashboard
            </button>
            <button
              className="text-blue-600 hover:text-blue-700 px-6 py-2.5 font-medium transition"
            >
              Report an Issue
            </button>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-gray-200">
            {/* Check Analytics Card */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-3 mx-auto">
                <BarChart3 size={24} className="text-blue-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Check Analytics
              </h3>
              <p className="text-xs text-gray-600">
                Track your links, geographical location, and referral sources in real-time.
              </p>
            </div>

            {/* New ShortLink Card */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-3 mx-auto">
                <Link2 size={24} className="text-blue-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                New ShortLink
              </h3>
              <p className="text-xs text-gray-600">
                Create a brand new short link in just a few seconds.
              </p>
            </div>

            {/* Developer API Card */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-3 mx-auto">
                <Code2 size={24} className="text-blue-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Developer API
              </h3>
              <p className="text-xs text-gray-600">
                Integrate our link shortener into your apps.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <p>© 2024 SHORTLINK. THE DIGITAL ARCHITECT.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-900 transition">PRIVACY POLICY</a>
            <a href="#" className="hover:text-gray-900 transition">TERMS OF SERVICE</a>
            <a href="#" className="hover:text-gray-900 transition">API DOCUMENTATION</a>
            <a href="#" className="hover:text-gray-900 transition">SUPPORT</a>
          </div>
        </div>
      </footer>
    </div>
  );
}