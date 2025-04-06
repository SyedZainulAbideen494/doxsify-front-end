import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './mathPage.css';
import MathLoader from './mathLoader';
import { FaMicrophone, FaPaperPlane, FaArrowRight, FaArrowLeft, FaCog, FaMap,FaUser, FaComments, FaRegCommentDots, FaTrash, FaPaperclip  } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import Loader from './mathLoader';
import AiLoaderSpeaking from './AiLoaderSpeaking';
import Modal from 'react-modal';
import { FaBook, FaPen, FaQuestionCircle, FaTimes } from 'react-icons/fa';
import { FaComment, FaGear, FaInfo } from 'react-icons/fa6';
// Voice recognition setup (Web Speech API)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;



const formatContent = (content) => {
  // Format code blocks
  content = content.replace(/```(.*?)```/gs, "<pre><code>$1</code></pre>");
  
  // Format large headers
  content = content.replace(/## (.*?)(?=\n|\r\n)/g, "<h2 class='large-text'>$1</h2>");
  
  // Format bold text (replace "**text**" with "<strong>text</strong>")
  content = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  
  // Format italic text (replace "*text*" with "<em>text</em>")
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

  // Format LaTeX/math expressions (inline math syntax: $math$ -> MathJax syntax)
  content = content.replace(/\$(.*?)\$/g, (_, math) => `\\(${math}\\)`);

  // Ensure all remaining asterisks are removed
  content = content.replace(/\*/g, "");

  return content;
};



const MathSolver = () => {
  const [loading, setLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'user', parts: [{ text: 'Hello' }] },
    { role: 'model', parts: [{ text: 'Great to meet you. What would you like to know?' }] }
  ]);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [listening, setListening] = useState(false); // State for voice recognition
  const [successMessage, setSuccessMessage] = useState('');
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [error, setError] = useState(null);
const [image, setImage] = useState(null); // Only one image state
const [result, setResult] = useState(null);
const [imageprev, setImageprev] = useState(null); // Only one image state
const [activeToggle, setActiveToggle] = useState("");
const [isChatModalOpen, setChatModalOpen] = useState(false);

const toggleChatModal = () => {
  setChatModalOpen(!isChatModalOpen);
};

  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!message.trim() && !image) return; // Ensure message, image, or PDF is provided
  
    if (!conversationStarted) setConversationStarted(true);
  
    const newHistory = [...chatHistory, { role: "user", parts: [{ text: message || " " }] }];
    setChatHistory(newHistory);
    setLoading(true);

    const token = localStorage.getItem("token"); // Retrieve token
    if (!token) {
        console.error("User not authenticated.");
        setChatHistory([...newHistory, { role: "model", parts: [{ text: "Authentication error. Please log in again." }] }]);
        setLoading(false);
        return;
    }

    try {
        let formattedResultText = "";
        let followUpMessage = message;

        if (image) {
            const formData = new FormData();
            formData.append("image", image);
            formData.append("prompt", message || "Analyze this image and provide details.");  

            const response = await axios.post('http://localhost:5000/api/process-images', formData, {
                headers: { 
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}` // Send token
                },
            });

            formattedResultText = formatContent(response.data.result);
            followUpMessage = message || "Here's what I found in the image.";
            setImage(null);
        } else {
            if (!message.trim()) throw new Error("Message cannot be empty.");

            const response = await axios.post('http://localhost:5000/api/chat/ai', {
                message,
                chatHistory: newHistory,
            }, {
                headers: { Authorization: `Bearer ${token}` } // Send token
            });

            formattedResultText = formatContent(response.data.response);
            followUpMessage = "";
        }

        setChatHistory([...newHistory, { role: "model", parts: [{ text: formattedResultText }] }]);
        setMessage(followUpMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        setChatHistory([...newHistory, { role: "model", parts: [{ text: "Something went wrong. Please try again later." }] }]);
    } finally {
        setLoading(false);
    }
};

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
        setImage(file);
        setImageprev(URL.createObjectURL(file)); // Set the image preview
      } else {
        setError("Please upload a valid image file.");
      }
    };
    
 
  const startListening = () => {
    if (recognition) {
      recognition.start();
      setListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setListening(false);
    }
  };

  useEffect(() => {
    if (recognition) {
      recognition.onresult = (event) => {
        const voiceMessage = event.results[0][0].transcript;
        setMessage(voiceMessage);
        handleSendMessage(); // Automatically send the voice command as a message
      };

      recognition.onend = () => setListening(false);
    }
  }, []);



  const defaultPage = (
    <div className="container__default__ai__PageWrapper">
      {/* Gradient Greeting */}
      <div className="greeting-message">
        <h1>
          <span className="gradient-text">
            Hello,
          </span>
          <br />
          <span className="gradient-text">
           User
          </span>
          <br />
        </h1>
      </div>
    </div>
  );
  
  const handleKeyDown = (e) => {
    if (loading) return; // Prevent action if loading is true
  
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  useEffect(() => {

    const handleLogin = () => {

      // Get the current chat history from localStorage
      const storedChatHistory = JSON.parse(localStorage.getItem('new_ai_chat_history')) || [];
    
      // Check if the history contains the model role with nested objects in 'parts'
      const containsComplexParts = storedChatHistory.some(item =>
        item.role === 'model' && item.parts.some(part => typeof part.text === 'object')
      );
    
      // If complex parts (objects) are found in the 'model' role, clear the history
      if (containsComplexParts) {
        localStorage.removeItem('new_ai_chat_history'); // Clear the history
        console.log("Complex model parts found. History cleared.");
      } else {
        console.log("No complex model parts found. History not cleared.");
      }
    
      // Optional: Check if the flag is set (it shouldn't be)
      console.log("new_ai_chat_history_cleared:", localStorage.getItem('new_ai_chat_history_cleared')); // Should be null or undefined
    };
    
    // Call the function to test
    handleLogin();
    
  
    const storedChatHistory = JSON.parse(localStorage.getItem('new_ai_chat_history')) || [];
    if (storedChatHistory.length > 0) {
      setChatHistory(storedChatHistory);
      setConversationStarted(true);
    } else {
      setChatHistory([
        { role: 'user', parts: [{ text: 'Hello' }] },
        { role: 'model', parts: [{ text: 'Great to meet you. What would you like to know?' }] }
      ]);
    }
  }, []);
  
  // Sync updated chat history with the new key in localStorage
  useEffect(() => {
    if (conversationStarted) {
      localStorage.setItem('new_ai_chat_history', JSON.stringify(chatHistory));
    }
  }, [chatHistory, conversationStarted]);

  
  const handleClearHistory = () => {
    localStorage.removeItem('new_ai_chat_history');
    setChatHistory([
      { role: 'user', parts: [{ text: 'Hello' }] },
      { role: 'model', parts: [{ text: 'Great to meet you. What would you like to know?' }] }
    ]);
    setConversationStarted(false);
  };

// Inside the component
useEffect(() => {
  // Trigger MathJax formatting after chat history is updated
  if (window.MathJax) {
    window.MathJax.typeset();
  }
}, [chatHistory]); // Run whenever the chat history is updated



const SparkleIcon = ({ size = 18, color = "#b197fc" }) => (
  <svg
    height={size}
    width={size}
    viewBox="0 0 24 24"
    className="sparkle-icon"
    style={{ fill: color }}
  >
    <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z" />
  </svg>
);


  return (
<div className="doxsify__ai__container">
  <header className="doxsify__ai__header glass-header">
    <img src="http://localhost:5000/defPic.png" className="doxsify__avatar" alt="User" />
    <h1 className="doxsify__title">Doxsify <span className="sparkle-wrapper"><SparkleIcon /></span></h1>
    
    <div className="header-right">
      <button className="doxsify__settings" onClick={toggleChatModal}>
        <FaGear />
      </button>
      {isChatModalOpen && (
        <div className="doxsify__chat__modal">
          <button onClick={() => console.log("Chat History")} className="modal-btn">
            <FaInfo /> Chat History
          </button>
          <button onClick={handleClearHistory} className="modal-btn">
            <FaTrash /> Clear Chat
          </button>
        </div>
      )}
    </div>
  </header>

  <div className="doxsify__chat__area">
    <div className="doxsify__messages">
      {!conversationStarted ? (
        defaultPage
      ) : (
        chatHistory.slice(2).map((msg, index) => (
          <div key={index} className={`message__wrapper ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}>
            <div
              className="message-bubble"
              dangerouslySetInnerHTML={{
                __html: msg.parts.map((part) => part.text).join('')
              }}
            />
          </div>
        ))
      )}
      {loading && (
        <div className="message__wrapper ai-message">
          <div className="message-bubble"><Loader/></div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  </div>

  <div className="doxsify__input__bar glass">
    <input
      className="doxsify__input"
      type="text"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Type your message..."
    />
    <label className="upload-btn">
      <FaPaperclip />
      <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
    </label>
    {image && <img src={imageprev} alt="preview" className="preview-img" />}
    {message.trim() || image ? (
      <button className="send-btn gradient-btn" onClick={handleSendMessage} disabled={loading}>
        <FaArrowRight />
      </button>
    ) : (
      <button className="send-btn mic-btn" onClick={listening ? stopListening : startListening}>
        <FaMicrophone />
      </button>
    )}
  </div>
</div>

  );
};


// Main Component with Voice Command
const MathPage = () => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook



  return (
    <div className="math-page">
     
      <MathSolver />

    </div>
  );
};

// Styles
const dropdownButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "10px 18px",
  borderRadius: "8px",
  fontWeight: "600",
  fontSize: "14px",
  color: "rgb(112, 215, 255)",
  background: "transparent",
  border: "2px solid rgba(112, 215, 255, 0.6)",
  cursor: "pointer",
  transition: "all 0.3s ease-in-out",
};

const dropdownMenuStyle = {
  position: "absolute",
  top: "100%",
  left: "50%",
  transform: "translateX(-50%)",
  background: "#222",
  borderRadius: "8px",
  padding: "10px 0",
  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
  zIndex: 10,
  minWidth: "220px",
};

const dropdownItemStyle = {
  display: "flex",
  alignItems: "center",
  padding: "10px",
  color: "white",
  background: "transparent",
  border: "none",
  textAlign: "left",
  cursor: "pointer",
  fontSize: "14px",
  transition: "background 0.2s",
  width: "100%",
  textDecoration: 'none'
};

const dropdownDescStyle = {
  fontSize: "12px",
  margin: "2px 0 0",
  color: "rgba(255, 255, 255, 0.7)",
};

// Sparkle Icons with Different Colors
const getSparkleIcon = (mode) => {
  let color;
  switch (mode) {
    case "Edusify E1":
      color = "rgb(112, 215, 255)"; // Cyan
      break;
    case "Edusify T1":
      color = "rgb(191, 90, 242)"; // Purple
      break;
    case "Edusify V1":
      color = "rgb(255, 215, 0)"; // Gold
      break;
    default:
      color = "rgb(112, 215, 255)";
  }

  return (
    <svg
      height="18"
      width="18"
      fill={color}
      viewBox="0 0 24 24"
      style={{ marginRight: "8px" }}
    >
      <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
    </svg>
  );
};

export default MathPage;