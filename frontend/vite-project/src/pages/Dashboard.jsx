import { useState, useEffect } from 'react';
import { Copy, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import http from "../lib/http"
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const Navigate = useNavigate();

 useEffect(() => {
  const fetchLinks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      const response = await http('/api/links', {}, { method: 'GET', token });
      const data = await response.json(); 
      
      console.log('data', data);

      if (data.success && data.links) {
        setLinks(data.links);
      } else {
        setError(data.message || 'Failed to fetch links');
      }
    } catch (err) {
      setError('Error fetching links: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  fetchLinks();
}, []);

  // Filter and paginate
  const filteredLinks = links.filter(link =>
    link.short_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.original_url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const linksPerPage = 4;
  const totalPages = Math.ceil(filteredLinks.length / linksPerPage);
  const startIndex = (currentPage - 1) * linksPerPage;
  const paginatedLinks = filteredLinks.slice(startIndex, startIndex + linksPerPage);

  const handleCopy = (shortCode) => {
    navigator.clipboard.writeText(`http:localhost:9000/${shortCode}`);
  };

  const handleDelete = (id) => {
    // todo
    console.log('Delete link:', id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your links...</p>
        </div>
      </div>
    );
  }

  const handleNavigate = () =>{
    Navigate('/create')
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-lg">ShortLink</span>
            </div>
            <nav className="flex gap-8">
              <a href="#" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">Dashboard</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Analytics</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Links</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button
             onClick= {handleNavigate}
             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
              + Create New Link
            </button>
            <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
              <span className="text-sm font-medium">U</span>
            </button>
            <span className="text-sm text-gray-600">Logout</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Links</h1>
            <p className="text-gray-600 mt-1">Manage and track your shortened digital assets.</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-sm">TOTAL ACTIVE</p>
            <p className="text-4xl font-bold text-gray-900">{links.length}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or URL..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h4a1 1 0 011 1v2.586a1 1 0 01-.293.707l-7 7a1 1 0 000 1.414l7 7a1 1 0 001.414 0l7-7a1 1 0 00.293-.707V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v2.586a1 1 0 01-.293.707l-7 7a1 1 0 000 1.414l7 7a1 1 0 001.414 0l7-7a1 1 0 00.293-.707V4z" />
            </svg>
          </button>
        </div>

        {/* Links Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          {paginatedLinks.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {paginatedLinks.map((link) => {
                const createdDate = new Date(link.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }).toUpperCase();

                return (
                  <div key={link.id} className="p-4 hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.868 2.884l-.321 8.248h8.248l-.321-8.248h-7.606zM9 0a1 1 0 011 1v8.248H1V1a1 1 0 011-1h7z" />
                          </svg>
                          <a href="#" className="text-blue-600 font-medium hover:underline">
                            http://localhost:9000/{link.short_code}
                          </a>
                        </div>
                        <p className="text-gray-600 text-sm">{link.original_url}</p>
                        <div className="flex gap-6 mt-2 text-xs text-gray-500">
                          <span>{createdDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleCopy(link.short_code)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                          title="Copy link"
                        >
                          <Copy size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(link.id)}
                          className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
                          title="Delete link"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              {filteredLinks.length === 0 && links.length > 0
                ? 'No links found matching your search.'
                : 'No links created yet. Start by creating your first shortened link!'}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
              Prev Page
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg font-medium transition ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
              <span className="text-gray-600 mx-2">of {totalPages}</span>
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 text-center text-xs text-gray-500">
          <p>© 2024 SHORTLINK. THE DIGITAL ARCHITECT.</p>
          <div className="flex gap-6 justify-center mt-2">
            <a href="#" className="hover:text-gray-700">PRIVACY POLICY</a>
            <a href="#" className="hover:text-gray-700">TERMS OF SERVICE</a>
            <a href="#" className="hover:text-gray-700">API DOCUMENTATION</a>
            <a href="#" className="hover:text-gray-700">SUPPORT</a>
          </div>
        </footer>
      </main>
    </div>
  );
}