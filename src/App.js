import React, { useState, useEffect } from "react";
import Post from "./Post";

function App() {
  const [searchTerm, setSearchTerm] = useState("popular"); // Default subreddit
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cache, setCache] = useState({}); // Cache results to handle rate limits

  const fetchPosts = async (query) => {
    const API_URL = `https://www.reddit.com/r/${query}.json`;

    // Check if results are cached
    if (cache[query]) {
      setPosts(cache[query]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch data. Check the subreddit name.");
      }

      const data = await response.json();
      const postsData = data.data.children.map((child) => child.data);

      setPosts(postsData);
      setCache((prevCache) => ({
        ...prevCache,
        [query]: postsData, // Save results to cache
      }));
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) return; // Don't search if input is empty
    fetchPosts(searchTerm);
  };

  // Fetch default subreddit on initial load
  useEffect(() => {
    fetchPosts("popular");
  }, []);

  return (
    <div className="App">
      <h1>Reddit API App</h1>

      {/* Search Bar */}
      <div>
        <input
          type="text"
          placeholder="Search subreddit"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Loading State */}
      {loading && <p>Loading...</p>}

      {/* Error State */}
      {error && <p className="error">{error}</p>}

      {/* Posts List */}
      <ul>
        {posts.map((post) => (
          <Post
            key={post.id}
            title={post.title}
            permalink={post.permalink}
            subreddit={post.subreddit}
          />
        ))}
      </ul>
    </div>
  );
}

export default App;
