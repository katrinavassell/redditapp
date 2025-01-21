
import React, { useState } from 'react';
import recommendedTopics from './recommendedTopics';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('relevance');
  const [timeRange, setTimeRange] = useState('all');
  const [limit, setLimit] = useState(25);

  const sortOptions = ['relevance', 'hot', 'top', 'new'];
  const timeOptions = ['hour', 'day', 'week', 'month', 'year', 'all'];

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
        )}&sort=${sortBy}&t=${timeRange}&limit=${limit}`
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
    <div>
      <header className="w-full bg-black text-white py-4 text-center">
        <h1 className="text-3xl font-bold">Reddit API App</h1>
      </header>

      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
        <div className="w-full max-w-md mb-6">
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex gap-2">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded p-2"
              >
                {sortOptions.map(option => (
                  <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
                ))}
              </select>
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded p-2"
              >
                {timeOptions.map(option => (
                  <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="flex">
              <input
                type="text"
                placeholder="Search for posts"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-l-lg p-2 flex-grow"
              />
              <button
                onClick={handleSearch}
                className="bg-green-500 text-white px-4 rounded-r-lg hover:bg-green-600"
              >
                Search
              </button>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {recommendedTopics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSearchTerm(topic)}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-300"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="text-center text-gray-500">Loading...</div>
          )}

          {error && <div className="text-center text-red-500">{error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
            {results.map((result) => (
              <div key={result.id} className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-xl font-semibold">{result.title}</h3>
                <p className="text-gray-600">Subreddit: {result.subreddit}</p>
                <a
                  href={`https://reddit.com${result.permalink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline mt-2 block"
                >
                  View Post
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="w-full bg-black text-white py-4 text-center">
        <p>Powered by the Reddit API</p>
      </footer>
    </div>
  );
};

export default App;
