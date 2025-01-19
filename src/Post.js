import React from "react";

function Post({ title, permalink, subreddit }) {
  const postUrl = `https://www.reddit.com${permalink}`;

  return (
    <li>
      <h3>{title}</h3>
      <p>Subreddit: {subreddit}</p>
      <a href={postUrl} target="_blank" rel="noopener noreferrer">
        View Post
      </a>
    </li>
  );
}

export default Post;
