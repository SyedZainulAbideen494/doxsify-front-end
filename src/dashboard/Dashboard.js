import React, { useState } from "react";
import axios from "axios";

const API_ROUTES = {
  aiGemini: "http://localhost:5000/api/chat/ai",
  aiImgProcessing: "http://localhost:5000/api/process-images",
  checkConvoCountAi: "http://localhost:5000/api/convo-count",
};

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false); // Assume this is set dynamically

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && !image) return; // Ensure input

    const newHistory = [...chatHistory, { role: "user", parts: [{ text: message || " " }] }];
    setChatHistory(newHistory);
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      // Check conversation count for free users
  

      let formattedResultText = "";
      let followUpMessage = message;

      if (image) {
        // Image processing
        const formData = new FormData();
        formData.append("image", image);
        formData.append("prompt", message || "Analyze this image.");
        formData.append("token", token);

        const response = await axios.post(API_ROUTES.aiImgProcessing, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        formattedResultText = response.data.result;
        followUpMessage = "Here's what I found in the image.";
        setImage(null);
      } else {
        // Text-based AI chat
        const response = await axios.post(API_ROUTES.aiGemini, {
          message,
          chatHistory: newHistory,
          token,
        });

        formattedResultText = response.data.response;
        followUpMessage = "";
      }

      setChatHistory([...newHistory, { role: "model", parts: [{ text: formattedResultText }] }]);
      setMessage(followUpMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      setChatHistory([...newHistory, { role: "model", parts: [{ text: "Something went wrong. Try again later." }] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Healthcare AI Chat</h2>

        {/* Chat Display */}
        <div className="h-72 overflow-y-auto p-2 bg-gray-200 rounded-lg mb-4">
          {chatHistory.map((chat, index) => (
            <div key={index} className={`p-2 my-2 rounded-lg ${chat.role === "user" ? "bg-blue-200 text-left" : "bg-green-200 text-right"}`}>
              {chat.parts[0].text}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Text Input */}
          <textarea
            className="w-full border rounded-lg p-3"
            rows="2"
            placeholder="Describe symptoms or upload an image..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>

          {/* Image Upload */}
          <input
            type="file"
            className="w-full border rounded-lg p-2"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Processing..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
