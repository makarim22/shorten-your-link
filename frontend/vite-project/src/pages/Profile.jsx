import { useState } from 'react'
import { Mail, Shield, Bell, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const navigate = useNavigate()
  const [emailNotifications, setEmailNotifications] = useState(true)
//   const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  const handleLogout = () => {
    // Clear auth data and redirect to login
    localStorage.removeItem('authToken')
    navigate('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-gray-900">ShortLink</h1>
            <nav className="flex gap-6 text-sm text-gray-600">
              <a href="/dashboard" className="hover:text-gray-900">Dashboard</a>
              <a href="#" className="hover:text-gray-900">Analytics</a>
              <a href="#" className="hover:text-gray-900">Links</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-gray-900">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-12">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Account Management
          </h2>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
              PRO MEMBER
            </span>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          {/* User Info */}
          <div className="flex items-start gap-6 mb-8 pb-8 border-b border-gray-200">
            <img
              src="/api/placeholder/80/80"
              alt="Profile"
              className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600"
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">Alex Thompson</h3>
              <p className="text-gray-600 text-sm">Product Architect at Digital Flow</p>
            </div>
          </div>

          {/* Email and Tenure */}
          <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-200">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Email Address
              </p>
              <p className="text-gray-900 font-medium">user@example.com</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Account Tenure
              </p>
              <p className="text-gray-900 font-medium">Member since January 1, 2026</p>
            </div>
          </div>

          {/* Active Assets Card */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide opacity-90 mb-1">
                  Active Assets
                </p>
                <p className="text-4xl font-bold">12</p>
              </div>
              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg font-semibold transition">
                VIEW LINKS
              </button>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4 mb-8 pb-8 border-b border-gray-200">
            {/* Email Notifications */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Email Notifications</span>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Two-Factor Authentication */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Two-Factor Authentication</span>
              </div>
              <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">
                DISABLED
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-lg text-gray-900 font-medium hover:bg-gray-50 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout Session
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-gray-500 text-center">
          Your data is encrypted using AES-256 standards.{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700">
            Privacy Policy
          </a>
        </p>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8 flex items-center justify-between text-xs text-gray-600">
          <p>© 2024 SHORTLINK. THE DIGITAL ARCHITECT.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-900">PRIVACY POLICY</a>
            <a href="#" className="hover:text-gray-900">TERMS OF SERVICE</a>
            <a href="#" className="hover:text-gray-900">API DOCUMENTATION</a>
            <a href="#" className="hover:text-gray-900">SUPPORT</a>
          </div>
        </div>
      </footer>
    </div>
  )
}