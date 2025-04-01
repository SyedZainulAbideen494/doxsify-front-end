import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TermsAndConditions.css'; // Import the CSS file

const TermsAndConditions = () => {
  const navigate = useNavigate();

  // Function to handle going back to the previous page
  const goBack = () => {
    navigate(-1); // This will navigate back to the previous page
  };

  
  return (
    <div className="container__term__conditions">
           <button className="back-btn__term__conditions" onClick={goBack}>
        &larr; Back
      </button>
      <h1 className="title__term__conditions">Welcome to Edusify!</h1>
      <p className="paragraph__term__conditions">
        Thank you for choosing <strong>Edusify: Your Ultimate Study Companion.</strong> We are delighted to have you as part of our community of learners who are striving to enhance their study experience. By using Edusify, you are taking a significant step towards achieving your academic goals, and we are here to support you every step of the way. We understand that the path to success can be challenging, but with Edusify, we aim to make it a little easier, more organized, and enjoyable. Your decision to join us is highly appreciated, and we are committed to delivering the best possible experience.
      </p>

      <h2 className="section-title__term__conditions">About Edusify</h2>
      <p className="paragraph__term__conditions">
        <strong>Edusify</strong> is an all-in-one study app designed to enhance your learning experience. Whether you're a student striving for academic excellence or a lifelong learner looking to stay organized, Edusify offers a suite of powerful tools to streamline your study routine. With its sleek, user-friendly interface and aesthetic design, Edusify makes studying not only efficient but enjoyable. The app is perfect for students who appreciate structure, collaboration, and visual appeal in their study sessions.
      </p>

      <h2 className="section-title__term__conditions">Key Features</h2>
      <ul className="list__term__conditions">
        <li><strong>Task Management:</strong> Organize your assignments, projects, and deadlines with a visually appealing task management system.</li>
        <li><strong>Collaborative Study Groups:</strong> Form and join study groups with friends or classmates, sharing notes and resources in real-time.</li>
        <li><strong>Aesthetic Notes & Flashcards:</strong> Create beautifully organized notes and flashcards for quick reviews.</li>
        <li><strong>Pomodoro Timer:</strong> Boost your productivity with the built-in Pomodoro timer, customizing intervals to fit your routine.</li>
        <li><strong>Music Player:</strong> Enjoy your favorite study playlists directly within the app.</li>
        <li><strong>Calendar & Reminders:</strong> Stay organized with a built-in calendar that tracks all your study sessions, deadlines, and events.</li>
        <li><strong>Social Feed:</strong> Share your achievements, study progress, and motivational quotes with the Edusify community.</li>
        <li><strong>Math & Science Helper:</strong> Get instant help with math problems and science concepts.</li>
        <li><strong>Quizzes & Flashcards:</strong> Test your knowledge with customizable quizzes and flashcards.</li>
        <li><strong>Customizable Themes:</strong> Personalize the app with dark mode and custom themes to match your study aesthetic.</li>
      </ul>

      <h2 className="section-title__term__conditions">Advantages of Edusify</h2>
      <ul className="list__term__conditions">
        <li><strong>Holistic Study Solution:</strong> Edusify combines task management, note-taking, collaboration, and study tools into a single app, keeping your study routine streamlined.</li>
        <li><strong>Enhanced Productivity:</strong> The Pomodoro timer, task management system, and reminders help you maintain focus and stay organized, improving your productivity.</li>
        <li><strong>Visual Appeal:</strong> With aesthetic design options for notes, tasks, and the app interface, Edusify appeals to students who value organization and visual presentation.</li>
        <li><strong>Collaboration Made Easy:</strong> Study groups and social feeds foster collaboration, making it easy to share knowledge, resources, and motivation with others.</li>
        <li><strong>Customizable Study Experience:</strong> Personalize the app’s themes, layouts, and notifications to create a study environment that suits your preferences.</li>
        <li><strong>On-the-Go Learning:</strong> Access all your study materials, notes, and tasks from anywhere, ensuring you can stay on top of your studies no matter where you are.</li>
        <li><strong>Free and Premium Options:</strong> Edusify offers a free version with essential features, while premium users gain access to advanced tools, additional customization options, and priority support.</li>
      </ul>

      <h2 className="section-title__term__conditions">Who is Edusify For?</h2>
      <ul className="list__term__conditions">
        <li><strong>Students of All Levels:</strong> From high school to university, Edusify caters to students of all academic levels, providing tools that make studying more efficient and enjoyable.</li>
        <li><strong>Lifelong Learners:</strong> Not just for students, Edusify is perfect for anyone looking to organize their learning routine, whether you're studying for a certification, learning a new language, or pursuing a personal passion.</li>
        <li><strong>Aesthetic Enthusiasts:</strong> If you love creating an organized, visually appealing study space, Edusify’s customizable themes and design options are perfect for you.</li>
      </ul>

      <h2 className="section-title__term__conditions">Data Collection and Privacy</h2>
      <p className="paragraph__term__conditions">
        We take your privacy very seriously and are committed to protecting your personal information. To provide you with the best possible experience on Edusify, we collect the following data:
      </p>
      <ul className="list__term__conditions">
        <li>Email address</li>
        <li>Password</li>
        <li>Phone number</li>
        <li>Location</li>
        <li>Name</li>
      </ul>

      <h3 className="subsection-title__term__conditions">Data Usage</h3>
      <p className="paragraph__term__conditions">
        We only use your data to provide the best user experience possible. Your data will never be sold or shared with third parties without your explicit consent. It is used solely to improve your interaction with the Edusify app, such as providing personalized content, reminders, and service updates.
      </p>

      <h3 className="subsection-title__term__conditions">Data Security</h3>
      <p className="paragraph__term__conditions">
        Your security is our priority. We employ industry-standard encryption and secure storage practices to safeguard your information. In the event of any breach or issue, we will notify affected users immediately and take appropriate action to remedy the situation.
      </p>

      <h3 className="subsection-title__term__conditions">Your Rights</h3>
      <p className="paragraph__term__conditions">
        You have the right to request access to the personal data we collect, to correct or delete your information, or to withdraw consent at any time. Please contact our support team for any concerns or requests related to your personal data.
      </p>

      <h2 className="section-title__term__conditions">Content and Conduct</h2>
      <ul className="list__term__conditions">
        <li>Sharing inappropriate, offensive, or illegal content</li>
        <li>Harassing, bullying, or threatening other users</li>
        <li>Engaging in any activities that could harm the reputation or integrity of Edusify</li>
        <li>Attempting to hack, exploit, or otherwise compromise the security of the app</li>
        <li>Using the app for any unauthorized or illegal purposes</li>
      </ul>

      <h2 className="section-title__term__conditions">Additional Terms</h2>
      <p className="paragraph__term__conditions">
        By using Edusify, you agree to comply with all applicable laws and regulations. We reserve the right to update these terms at any time without prior notice. Any changes to the terms will be communicated to users via the app or email. Your continued use of the app constitutes acceptance of any updated terms.
      </p>

      <h2 className="section-title__term__conditions">Contact Us</h2>
      <p className="paragraph__term__conditions">
        If you have any questions or concerns about these terms or Edusify's services, please feel free to contact us at <a href="mailto:support@edusify.com">edusyfy@gmail.com</a>.
      </p>
    </div>
  );
};

export default TermsAndConditions;
