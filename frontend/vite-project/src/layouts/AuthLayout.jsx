import { Outlet } from "react-router-dom"

export default function AuthLayout({
  title,
  description,
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ShortLink</h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 text-sm mb-6">{description}</p>

          <Outlet />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>© 2024 SHORTLINK. THE DIGITAL ARCHITECT.</p>
          <div className="mt-3 space-x-4">
            <a href="/privacy" className="hover:text-gray-700">PRIVACY POLICY</a>
            <a href="/terms" className="hover:text-gray-700">TERMS OF SERVICE</a>
            <a href="/api-docs" className="hover:text-gray-700">API DOCUMENTATION</a>
            <a href="/support" className="hover:text-gray-700">SUPPORT</a>
          </div>
        </div>
      </div>
    </div>
  );
}