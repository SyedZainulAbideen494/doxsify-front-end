import React, { useState } from "react";

const YouTubeSummarizer = () => {
  const [youtubeLink, setYoutubeLink] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSummary("");
    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in to use this feature.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://srv594954.hstgr.cloud/api/chat/ai/yt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ youtubeLink, chatHistory: [], token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch summary.");
      }

      setSummary(data.response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>🎥 YouTube Video Summarizer</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter YouTube Link"
          value={youtubeLink}
          onChange={(e) => setYoutubeLink(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Summarizing..." : "Get Summary"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {summary && (
        <div className="summary">
          <h3>📜 Summary:</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
};

export default YouTubeSummarizer;
