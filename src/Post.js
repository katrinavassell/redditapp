import React from "react";

function Post({ title, permalink, subreddit }) {
  return (
    <li>
      <p>
        <strong>{title}</strong>
      </p>
      <p>
        Subreddit: <em>{subreddit}</em>
      </p>
      <a
        href={`https://www.reddit.com${permalink}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View Post
      </a>
    </li>
  );
}

export default Post;
