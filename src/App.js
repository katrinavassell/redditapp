
import React, { useState } from 'react';
import recommendedTopics from './recommendedTopics';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('relevance');
  const [timeRange, setTimeRange] = useState('all');
  const [maxResults] = useState(25);

  const sortOptions = ['relevance', 'hot', 'top', 'new'];
  const timeOptions = ['hour', 'day', 'week', 'month', 'year', 'all'];

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert('Please enter a search term');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://www.reddit.com/search.json?q=${encodeURIComponent(
          searchTerm
        )}&sort=${sortBy}&t=${timeRange}&limit=${maxResults}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }
      const data = await response.json();
      setResults(data.data.children.map((child) => child.data));
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch results. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Reddit Explorer</h1>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-full sm:w-48 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 py-3 px-4"
                >
                  {sortOptions.map(option => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
                <select 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="block w-full sm:w-48 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 py-3 px-4"
                >
                  {timeOptions.map(option => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex flex-1 gap-4">
                <input
                  type="text"
                  placeholder="Search Reddit posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 py-3 px-4"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-sm"
                >
                  Search
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {recommendedTopics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSearchTerm(topic)}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          )}

          {error && (
            <div className="rounded-md bg-red-50 p-4 mt-6">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((result) => (
              <div key={result.id} className="bg-white overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{result.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <span>r/{result.subreddit}</span>
                    <span>•</span>
                    <span>{formatDate(result.created_utc)}</span>
                  </div>
                  {result.selftext ? (
                    <p className="text-gray-600 text-sm mb-4">
                      {result.selftext.length > 200 ? result.selftext.slice(0, 200) + '...' : result.selftext}
                    </p>
                  ) : null}
                  <a
                    href={`https://reddit.com${result.permalink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-700 font-medium text-sm inline-flex items-center"
                  >
                    View Post →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 text-sm">
            Powered by the Reddit API
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
