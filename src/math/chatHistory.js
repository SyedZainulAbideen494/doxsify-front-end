import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './chatHistory.css';
import LoadingSpinner from '../app_modules/LoadingSpinner';
import { FaArrowLeft } from 'react-icons/fa';
import { API_ROUTES } from '../app_modules/apiRoutes';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
const ChatHistoryPage = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const formatContent = (content) => {
    // Format code blocks
    content = content.replace(/```(.*?)```/gs, "<pre><code>$1</code></pre>");
    // Format large headers
    content = content.replace(/## (.*?)(?=\n|\r\n)/g, "<h2 class='large-text'>$1</h2>");
    // Format bold text
    content = content.replace(/\*\*(.*?)\*\*/g, "<strong class='large-text'>$1</strong>");
    // Format italic text
    content = content.replace(/\*(.*?)\*/g, "<em>$1</em>");
    // Format list items
    content = content.replace(/^\* (.*?)(?=\n|\r\n)/gm, "<li>$1</li>");
    content = content.replace(/(<li>.*?<\/li>)/g, "<ul>$1</ul>");
    // Format tables
    content = content.replace(/((?:\|.*?\|(?:\r?\n|$))+)/g, (match) => {
      const rows = match.split('\n').filter(row => row.trim());
      const tableRows = rows.map((row, index) => {
        const cells = row.split('|').filter(cell => cell.trim());
        if (index === 0) {
          const headerContent = cells.map(cell => `<th>${cell.trim()}</th>`).join('');
          return `<tr>${headerContent}</tr>`;
        }
        const rowContent = cells.map(cell => `<td>${cell.trim()}</td>`).join('');
        return `<tr>${rowContent}</tr>`;
      }).join('');
      return `<table>${tableRows}</table>`;
    });
    // Format LaTeX/math expressions
    content = content.replace(/\$(.*?)\$/g, (_, math) => `\\(${math}\\)`); // MathJax inline
    return content;
  };
  


  const fetchChatHistory = async () => {
    console.log('Fetching chat history...'); // Log the fetching process
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(API_ROUTES.fetchAiChatHistory, { token });
      setChatHistory(response.data);
    } catch (error) {
      console.error("Error fetching chat history:", error); // Add error logging
    } finally {
      setLoading(false);
    }
  };

  // Fetch chat history when component mounts
  useEffect(() => {
    fetchChatHistory();
  }, []);

  // Scroll to the bottom of the messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleCreateFlashcard = (content) => {
    navigate('/notes/create', { state: { editorContent: content } });
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="chat-history-page">
      <header className="chat-history-header sticky-header">
        <button className="back-button__chat_history__page__ai" onClick={handleBackClick}>
          <FaArrowLeft />
        </button>
        <h3>Chat History</h3>
      </header>
      <div className="chat-messages">
        {loading ? (
          <LoadingSpinner />
        ) : chatHistory.length === 0 ? (
          <div className="no-chat-history-message">
            <p>No chat history available. This is a new feature!</p>
            <p>Chat history starts from <strong>October 22, 2024</strong>.</p>
          </div>
        ) : (
          chatHistory.map((result, index) => (
            <div key={index} className={`chat-message ${result.role}`}>
              <div className="chat-bubble"  style={{maxWidth: '300px'}}>
                <span className="chat-role">{result.role === 'user' ? 'You' : 'AI'}:</span>
                <MathJaxContext>
                <div
                  className="chat-result-content"
                  dangerouslySetInnerHTML={{ __html: result.role === 'model' ? formatContent(result.parts.map(part => part.text).join('')) : result.parts.map(part => part.text).join('') }}
                />
                </MathJaxContext>
                {result.role === 'model' && (
                  <div className="create-flashcard-btn_ai__page__container">
                    <button
                      className="create-flashcard-btn_ai__page"
                      onClick={() => handleCreateFlashcard(result.parts[0].text)}
                    >
                      Add To Notes
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

};

export default ChatHistoryPage;
