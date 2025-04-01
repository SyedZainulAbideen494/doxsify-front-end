import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './mathPage.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import MathLoader from './mathLoader';
import { FaMicrophone, FaPaperPlane, FaArrowRight, FaArrowLeft, FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import FeedbackForm from '../help/FeedbackForm';
import { TypeAnimation } from 'react-type-animation';
import AIPageTutorial from './AIPageTutorial';
import Loader from './mathLoader';
import AiLoaderSpeaking from './AiLoaderSpeaking';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import Modal from 'react-modal';
import { FaBook, FaPen, FaQuestionCircle, FaTimes } from 'react-icons/fa';
// Voice recognition setup (Web Speech API)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

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


const MathSolver = ({ handleVoiceCommand }) => {
  const [loading, setLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'user', parts: [{ text: 'Hello' }] },
    { role: 'model', parts: [{ text: 'Great to meet you. What would you like to know?' }] }
  ]);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [listening, setListening] = useState(false); // State for voice recognition
  const [tutorialComplete, setTutorialComplete] = useState(false); // State to control tutorial visibility
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isMagicModalOpen, setIsMagicModalOpen] = useState(false);
  const [isFlashcardModalOpen, setIsFlashcardModalOpen] = useState(false);
  const [flashcardData, setFlashcardData] = useState({ name: '', subject: '' });
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [QuizData, setQuizData] = useState({ name: '', subject: '' });
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false);
const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
const [magicModalContent, setMagicModalContent] = useState('');
const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found');
          setLoadingUser(false);
          return;
        }

        const { data } = await axios.post(API_ROUTES.fetchUserProfile, { token });
        setProfile(data);
      } catch (err) {
        setError('Error fetching profile data');
        console.error(err);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchProfileData();
  }, []);
  
  const toggleSettingsModal = () => {
    setIsSettingsModalOpen(!isSettingsModalOpen);
  };

  useEffect(() => {
      // Check local storage for tutorial completion status
      const completed = localStorage.getItem('AIPageTutorialComplete');
      if (completed) {
          setTutorialComplete(true); // Set tutorialComplete to true if found
      }
  }, []);

  const handleTutorialComplete = () => {
      setTutorialComplete(true); // Hide tutorial when complete
      localStorage.setItem('AIPageTutorialComplete', 'true'); // Store completion status in local storage
  };

  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);



  const handleSendMessage = async () => {
    if (!message.trim()) return;
    if (!conversationStarted) setConversationStarted(true);
  
    const newHistory = [...chatHistory, { role: 'user', parts: [{ text: message }] }];
    setChatHistory(newHistory);
    setLoading(true);
  
    const token = localStorage.getItem('token'); // Assuming you're storing the token in localStorage
    const formData = new FormData();
    formData.append('message', message);
    formData.append('chatHistory', JSON.stringify(newHistory)); // Serialize chatHistory to JSON
    formData.append('token', token);
  
    if (pdfFile) {
      formData.append('pdf', pdfFile); // Attach the PDF file if present
    }
  
    try {
      const response = await axios.post(API_ROUTES.aiGemini, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Explicitly set Content-Type
        },
      });
  
      const formattedResponse = formatContent(response.data.response);
      setChatHistory([...newHistory, { role: 'model', parts: [{ text: formattedResponse }] }]);
      setMessage('');
      setPdfFile(null)
    } catch (error) {
      setChatHistory([
        ...newHistory,
        {
          role: 'model',
          parts: [
            {
              text: 'Oops! Something went wrong. Please try again later. The issue isn’t with Edusify; it appears to be an error on Google Gemini. Try rephrasing your question.',
            },
          ],
        },
      ]);
      console.error('Error sending message:', error);
      setPdfFile(null)
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setPdfFile(e.target.files[0]);
    }
  };
  
  const handleCreateNotes = (content) => {
    // Only pass serializable content, not the event object
    navigate('/notes/create', { state: { editorContent: content } });
  };
  
  const handleMagicButtonClick = (content) => {
    setMagicModalContent(content); // Store content of the clicked chat message
    setIsMagicModalOpen(true); // Open the Magic Modal
  };
  

// Handle Generate Flashcards
const handleGenerateFlashcards = (content) => {
  setIsMagicModalOpen(false);
  setIsFlashcardModalOpen(true);
  setFlashcardData({ ...flashcardData, content }); // Pass content to flashcard modal
};

// Handle Generate Quiz
const handleGenerateQuiz = (content) => {
  setIsMagicModalOpen(false);
  setIsQuizModalOpen(true);
  setQuizData({ ...QuizData, content }); // Pass content to quiz modal
};

const handleSubmitFlashcards = async (selectedContent) => {
  const token = localStorage.getItem('token');
  const headings = selectedContent; // Use the selected content directly
  
  setIsGeneratingFlashcards(true);
  
  try {
    const response = await fetch(API_ROUTES.generateFlashcardsFromNotes, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        headings,
        subject: flashcardData.subject,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error generating flashcards:', errorData.error);
      return;
    }

    const data = await response.json();
    console.log('Flashcards generated:', data);

    navigate(`/flashcard/set/${data.flashcardSetId}`);
    setFlashcardData({ name: '', subject: '' });
  } catch (error) {
    console.error('Unexpected error:', error);
  } finally {
    setIsGeneratingFlashcards(false);
  }
};

 
const handleSubmitQuiz = async (selectedContent) => {
  const token = localStorage.getItem('token');
  const notes = selectedContent; // Use the selected content directly
  
  setIsGeneratingQuiz(true);
  
  try {
    const response = await fetch(API_ROUTES.generateQuizFromNotes, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        notes,
        subject: QuizData.subject,
        token,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error generating quiz:', errorData.error);
      return;
    }

    const data = await response.json();
    console.log('Quiz generated:', data);

    navigate(`/quiz/${data.quizId}`);
    setQuizData({ subject: '' });
  } catch (error) {
    console.error('Unexpected error:', error);
  } finally {
    setIsGeneratingQuiz(false);
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token'); // Retrieve token from local storage

    try {
      const response = await axios.post(API_ROUTES.feedbackEduisfy, { feedback, token }); // Send token with feedback
      setSuccessMessage('Feedback submitted successfully!'); // Set success message
      setFeedback(''); // Clear the feedback after submission
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSuccessMessage('Error submitting feedback, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clickChatHistory = () => {
    navigate('/ai/chat/history')
  }

  const defaultPage = (
    <div className="container__default__ai__PageWrapper">
      {/* Gradient Greeting */}
      <div className="greeting-message">
        <h1>
          <span className="gradient-text">
            {profile ? `Hello,` : 'Hello,'}
          </span>
          <br />
          <span className="gradient-text">
            {profile
              ? `${profile.unique_id.length > 16 
                  ? profile.unique_id.slice(0, 16) + '...' 
                  : profile.unique_id}`
              : 'User'}
          </span>
          <br />
        </h1>
      </div>
    </div>
  );
  
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Avoid submitting on Shift + Enter for multiline input
      e.preventDefault(); // Prevent form submission (default behavior)
      handleSendMessage(); // Trigger the message send when pressing Enter
    }
  };
  
  useEffect(() => {
    // Clear old chat history key upon login
    const handleLogin = () => {
      // Remove old keys
      localStorage.removeItem('chatHistory');
      localStorage.removeItem('ai_chat_history');
    
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
    
  
    const completed = localStorage.getItem('AIPageTutorialComplete');
    if (completed) {
      setTutorialComplete(true);
    }
  
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


  return (
    <div className="mathsolver-container">
           {!tutorialComplete && <AIPageTutorial onComplete={handleTutorialComplete} />}


           <div className="math-page-header">
  <button className="back-btn" onClick={() => navigate('/')}>
    <FaArrowLeft />
  </button>

  <div className="powered-by-gemini">
    Powered by,<span className="gemini-logo">Gemini</span>
  </div>

  <button className={`settings-btn ${isSettingsModalOpen ? 'active' : ''}`} onClick={toggleSettingsModal}>
    <FaCog />
  </button>




  {isSettingsModalOpen && (
    <div className="settings-modal">
      <button className="modal-btn" onClick={handleClearHistory}>
        Clear Messages
      </button>
      <button className="modal-btn" onClick={clickChatHistory}>
        Chat History
      </button>
    </div>
  )}
</div>

      <div className="chat-ui">
      {showFeedbackModal && (
        <div className="feedback-modal">
          <div className="feedback-modal-content">
            <h2>Report a Problem</h2>
            <form onSubmit={handleSubmit}>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Describe the issue"
                required
              />
               <div class="feedback-modal-buttons">


              <button type="submit" disabled={loadingFeedback}>
                {loadingFeedback ? 'Submitting...' : 'Submit'}
              </button>
              <button onClick={() => setShowFeedbackModal(false)} type='button'>Close</button>
              {successMessage && <p>{successMessage}</p>}
              </div>
            </form>
            
          </div>
        </div>
      )}
        <div className="chat-messages" style={{marginBottom: '60px'}}>
          {!conversationStarted ? (
            defaultPage
          ) : (
            chatHistory.slice(2).map((result, index) => (
              <div key={index} className={`chat-message ${result.role}`}>
                <div className="chat-bubble">
                  <span className="chat-role">{result.role === 'user' ? 'You' : 'AI'}:</span>
                  <MathJaxContext>
                    <div
                      className="chat-result-content"
                      dangerouslySetInnerHTML={{ __html: result.parts.map((part) => part.text).join('') }}
                    />
                  </MathJaxContext>
                  {result.role === 'model' && (
                   <div className="create-flashcard-btn_ai__page__container">

    <button type="button" className="magic__btn__page__ai" onClick={() => handleMagicButtonClick(result.parts.map((part) => part.text).join(''))}>
      <span className="magic__btn__page__ai__fold"></span>

      <div className="magic__btn__page__ai__points_wrapper">
        <i className="magic__btn__page__ai__point"></i>
        <i className="magic__btn__page__ai__point"></i>
        <i className="magic__btn__page__ai__point"></i>
        <i className="magic__btn__page__ai__point"></i>
        <i className="magic__btn__page__ai__point"></i>
        <i className="magic__btn__page__ai__point"></i>
        <i className="magic__btn__page__ai__point"></i>
        <i className="magic__btn__page__ai__point"></i>
        <i className="magic__btn__page__ai__point"></i>
        <i className="magic__btn__page__ai__point"></i>
      </div>

      <span className="magic__btn__page__ai__inner">
        <svg
          className="magic__btn__page__ai__icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
        >
          <polyline
            points="13.18 1.37 13.18 9.64 21.45 9.64 10.82 22.63 10.82 14.36 2.55 14.36 13.18 1.37"
          ></polyline>
        </svg>
        Magic
      </span>
    </button>
                 </div>
                  )}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="chat-message loader-bubble">
              <div className="chat-bubble">
                <Loader/>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat input */}
        <div className="messageBox__ai__loader__light">
      <div className="input-group__ai__loader__light">
        <input
          id="messageInput__ai__loader__light"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type here.."
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
          required
        />
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="pdf-upload"
        />
        <label htmlFor="pdf-upload" className="pdf-upload-label" style={{fontSize: '12px'}}>
          Attach PDF (beta testing)
        </label>
      </div>

      {message.trim() ? (
        <button
          className="chat-send-btn__ai__loader__light"
          onClick={handleSendMessage}
          disabled={loading}
        >
          {loading ? (
            <div style={{ width: "24px", height: "24px" }}>
              {/* Display the loader */}
              <AiLoaderSpeaking />
            </div>
          ) : (
            <svg viewBox="0 0 664 663" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
                fill="none"
              ></path>
              <path
                d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
                stroke="#333333"
                strokeWidth="33.67"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          )}
        </button>
      ) : (
        <button
          className="chat-send-btn__ai__loader__light"
          onClick={listening ? stopListening : startListening}
        >
          <FaMicrophone style={{ color: "white" }} />
        </button>
      )}
    </div>

      </div>
      <Modal
  isOpen={isMagicModalOpen}
  onRequestClose={() => setIsMagicModalOpen(false)}
  className="magic__ai__magic__modal__ai__page"
>
  <button onClick={() => setIsMagicModalOpen(false)} className="close-btn__magic__modal__ai__page">
    <FaTimes />
  </button>
  
  <h2 className="modal-title__magic__modal__ai__page">What do you want to do?</h2>
  <div className="modal-actions__magic__modal__ai__page">
  <button className="magic__btn__page__ai__modal" onClick={() => handleGenerateFlashcards(magicModalContent)}>
  <span>  <FaPen /> Generate Flashcards</span>
    </button>

    <button className="magic__btn__page__ai__modal" onClick={() => handleGenerateQuiz(magicModalContent)}>
  <span><FaQuestionCircle /> Generate Quiz</span>
    </button>
    <button className="magic__btn__page__ai__modal" onClick={() => handleCreateNotes(magicModalContent)}>
  <span><FaBook /> Create Notes</span>
    </button>
  </div>
</Modal>


{/* Flashcard Modal */}
<Modal
  isOpen={isFlashcardModalOpen}
  onRequestClose={() => setIsFlashcardModalOpen(false)}
  className="flashcard__modal__ai__magic__page"
>
  <button onClick={() => setIsFlashcardModalOpen(false)} className="close-btn__magic__modal__ai__page">
    <FaTimes />
  </button>
  <h2 className="modal-title__magic__modal__ai__page">Generate Flashcards</h2>
  <div className="flashcard-modal-content__magic__modal__ai__page">
    <input
      type="text"
      placeholder="Title"
      value={flashcardData.subject}
      onChange={(e) => setFlashcardData({ ...flashcardData, subject: e.target.value })}
      className="modal-input__magic__modal__ai__page"
    />
    {/* Removed the textarea, using selected content instead */}
<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
    <button
  className="flashcard__set__page__modal-generate btn__set__page__buttons"
  onClick={() => handleSubmitFlashcards(magicModalContent)} 
  disabled={isGeneratingFlashcards}
>
  <div className={`sparkle__set__page__buttons ${isGeneratingFlashcards ? 'animating' : ''}`}>
    <svg
      height="24"
      width="24"
      fill="#FFFFFF"
      viewBox="0 0 24 24"
      data-name="Layer 1"
      id="Layer_1"
      className="sparkle__set__page__buttons"
    >
      <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
    </svg>
    <span className="text__set__page__buttons">
      {isGeneratingFlashcards ? 'Generating...' : 'Generate'}
    </span>
  </div>
</button>
</div>
  </div>
</Modal>


<Modal
  isOpen={isQuizModalOpen}
  onRequestClose={() => setIsQuizModalOpen(false)}
  className="quiz__modal__ai__magic__page"
>
  <button onClick={() => setIsQuizModalOpen(false)} className="close-btn__magic__modal__ai__page">
    <FaTimes />
  </button>
  <h2 className="modal-title__magic__modal__ai__page">Generate Quiz</h2>
  <form onSubmit={(e) => { e.preventDefault(); handleSubmitQuiz(magicModalContent); }} className="quiz-form__magic__modal__ai__page">
    <label className="modal-label__magic__modal__ai__page">
      Quiz title:
      <input
        type="text"
        value={QuizData.subject}
        onChange={(e) => setQuizData({ ...QuizData, subject: e.target.value })}
        required
        className="modal-input__magic__modal__ai__page"
      />
    </label>

     {/* Removed the textarea, using selected content instead */}
<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
    <button
  className="flashcard__set__page__modal-generate btn__set__page__buttons"
   type="submit"
  disabled={isGeneratingQuiz}
>
  <div className={`sparkle__set__page__buttons ${isGeneratingQuiz ? 'animating' : ''}`}>
    <svg
      height="24"
      width="24"
      fill="#FFFFFF"
      viewBox="0 0 24 24"
      data-name="Layer 1"
      id="Layer_1"
      className="sparkle__set__page__buttons"
    >
      <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
    </svg>
    <span className="text__set__page__buttons">
      {isGeneratingQuiz ? 'Generating...' : 'Generate'}
    </span>
  </div>
</button>
</div>
  </form>
</Modal>


    </div>
  );
};


// Main Component with Voice Command
const MathPage = () => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

      // Toggle feedback form visibility
      const toggleFeedbackForm = () => {
          setShowFeedbackForm(prev => !prev);
      };


  const handleCalculate = async () => {
    try {
      const response = await axios.post(API_ROUTES.solveMath, { query });
      console.log('API Response:', response.data);
    } catch (error) {
      console.error('Calculation Error:', error);
    }
  };

  const handleVoiceCommand = () => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        setQuery(command);
        handleCalculate();
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.start();
    } else {
      alert('Speech Recognition not supported');
    }
  };


  return (
    <div className="math-page">
     
      {}<MathSolver query={query} setQuery={setQuery} handleCalculate={handleCalculate} handleVoiceCommand={handleVoiceCommand} />

    </div>
  );
};

export default MathPage;