import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ai.css';
import MathLoader from './mathLoader';
import { FaMicrophone, FaPaperPlane, FaArrowRight, FaArrowLeft, FaCog, FaMap,FaUser, FaComments, FaRegCommentDots, FaTrash, FaPaperclip, FaRobot, FaAtom  } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import Loader from './mathLoader';
import AiLoaderSpeaking from './AiLoaderSpeaking';
import Modal from 'react-modal';
import { FaBook, FaPen, FaQuestionCircle, FaTimes } from 'react-icons/fa';
import { FaComment, FaGear, FaInfo } from 'react-icons/fa6';
import { API_ROUTES } from '../app_modules/apiRoutes';
import AuthCheck from '../app_modules/AuthCheck';
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



const AI = () => {
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
  const [isPremium, setIsPremium] = useState(null);

const toggleChatModal = () => {
  setChatModalOpen(!isChatModalOpen);
};

  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setIsPremium(false);
      return;
    }
  
    axios.get(API_ROUTES.checkSubscription, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      const { active } = response.data;
      setIsPremium(active);
    })
    .catch(err => {
      console.error("Subscription check failed:", err);
      setIsPremium(false);
    });
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim() && !image) return;
  

    // ✅ Block non-premium users
    if (!isPremium) {
      setTimeout(() => {
        window.location.href = "/plans";
      });
      setLoading(false);
      return;
    }
  
    if (!conversationStarted) setConversationStarted(true);
  
    const newHistory = [...chatHistory, { role: "user", parts: [{ text: message || " " }] }];
    setChatHistory(newHistory);
    setLoading(true);
  
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User not authenticated.");
      setChatHistory([...newHistory, {
        role: "model",
        parts: [{ text: "Authentication error. Please log in again." }]
      }]);
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
        formData.append("token", localStorage.getItem('token'));  
  
        const response = await axios.post(API_ROUTES.aiImgChat, formData, {
          headers: { 
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          },
        });
  
        formattedResultText = formatContent(response.data.result);
        followUpMessage = message || "Here's what I found in the image.";
        setImage(null);
      } else {
        if (!message.trim()) throw new Error("Message cannot be empty.");
  
        const response = await axios.post(API_ROUTES.aiChat, {
          message,
          chatHistory: newHistory,
          token
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        formattedResultText = formatContent(response.data.response);
        followUpMessage = "";
      }
  
      setChatHistory([...newHistory, {
        role: "model",
        parts: [{ text: formattedResultText }]
      }]);
      setMessage(followUpMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      setChatHistory([...newHistory, {
        role: "model",
        parts: [{ text: "Something went wrong. Please try again later." }]
      }]);
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


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
  
    axios.get(API_ROUTES.checkProfileCompletion, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      const { redirect } = res.data;
      if (redirect) window.location.href = redirect;
    })
    .catch(err => console.error("Profile check failed:", err));
  }, []);
  


  const defaultPage = (
    <div className="container__default__ai__PageWrapper">
      <div className="default__ai__card glassy-card">
        <div className="sparkle-avatar">
          <img src={`${API_ROUTES.displayImg}/doxsify.png`}  alt="Doxsify AI" />
          <div className="glow-ring" />
        </div>
        <h2 className="default__title">Hey, I’m Doxsify AI</h2>
        <p className="default__subtitle">Your personal doctor-grade assistant. Ask me anything medical, upload images, or speak.</p>
        <div className="suggestions">
  <button onClick={() => setMessage("What are the symptoms of vitamin D deficiency?")} className="suggestion-btn">
    <span className="emoji">💊</span> Symptoms of Vitamin D Deficiency
  </button>
  <button onClick={() => setMessage("Suggest treatment for a migraine")} className="suggestion-btn">
    <span className="emoji">🧠</span> Migraine Treatment Options
  </button>
  <button onClick={() => setMessage("Is this mole concerning?")} className="suggestion-btn">
    <span className="emoji">📷</span> Analyze My Skin Mole
  </button>
</div>
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
    setChatModalOpen(false)
  };

// Inside the component
useEffect(() => {
  // Trigger MathJax formatting after chat history is updated
  if (window.MathJax) {
    window.MathJax.typeset();
  }
}, [chatHistory]); // Run whenever the chat history is updated


const SparkleIcon = ({ size = 18, color = "#a259ff" }) => (
  <svg
    height={size}
    width={size}
    viewBox="0 0 24 24"
    style={{
      fill: color,
      filter: "drop-shadow(0 0 6px #a259ff)",
      transition: "transform 0.3s ease",
      cursor: "pointer"
    }}
    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
  >
    <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z" />
  </svg>
);

const openProfile = () => {
  navigate('/profile')
}


  return (
<div className="doxsify__ai__container">
<header className="doxsify__ai__header glass-header">
  <div className="doxsify__avatar__glass" onClick={openProfile}>
  <SparkleIcon />
  </div>

  <h1 className="doxsify__title">
    Doxsify <span className="sparkle-wrapper"></span>
  </h1>

  <div className="header-right__Clear__msg__msg__his__Modal">
    <button className="doxsify__settings__Clear__msg__msg__his__Modal" onClick={toggleChatModal}>
      <FaGear />
    </button>

    {isChatModalOpen && (
      <div className="inline-settings__Clear__msg__msg__his__Modal">
       {/* <div className="settings-option__Clear__msg__msg__his__Modal" onClick={() => console.log("Chat History")}>
          <FaInfo /> <span>Chat History</span>
        </div> */}
        <div className="settings-option__Clear__msg__msg__his__Modal" onClick={handleClearHistory}>
          <FaTrash /> <span>Clear Chat</span>
        </div>
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
          <div
            key={index}
            className={`message__wrapper ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
           <div
  className="message-bubble"
  dangerouslySetInnerHTML={{
    __html: msg.parts.map((part) =>
      part.text.replace(/html/gi, '') // removes "HTML", "Html", "html", etc.
    ).join('')
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
<button
  className={`send-btn mic-btn ${listening ? "listening" : ""}`}
  onClick={listening ? stopListening : startListening}
>
  <FaMicrophone />
</button>

    )}
  </div>
</div>

  );
};

// Main Component with Voice Command
const AIMain = () => {
  return (
    <AuthCheck>
      <AI />
      </AuthCheck>
  );
};

export default AIMain;