import React, { useRef, useEffect, useState } from 'react';
import './DownloadPage.css';
import { API_ROUTES } from '../app_modules/apiRoutes';
import { Link } from 'react-router-dom';

const DownloadPage = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const downloadRef = useRef(null); // Reference for the download link

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isInstagram = /Instagram/.test(userAgent);
    const isFacebook = /FBAN|FBAV/.test(userAgent);

    setCurrentUrl(window.location.href);

    if (isInstagram || isFacebook) {
      setIsInAppBrowser(true);

      // Automatically trigger file download before redirecting
      setTimeout(() => {
        const downloadLink = document.createElement("a");
        downloadLink.href = window.location.href;
        downloadLink.setAttribute("download", "Edusify.html"); // Set actual filename
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }, 500);

      // Redirect user to the default browser after a delay
      setTimeout(() => {
        window.location.replace(window.location.href);
      }, 1500);
    }
  }, []);

  useEffect(() => {
    const checkInAppBrowser = () => {
      const ua = navigator.userAgent || navigator.vendor || window.opera;
      if (ua.includes("Instagram") || ua.includes("FBAN") || ua.includes("FBAV")) {
        setIsInAppBrowser(true);
      }
    };

    checkInAppBrowser();

    const beforeInstallPromptHandler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallPromptHandler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      // Log download request to the server
      const response = await fetch(API_ROUTES.apiLogDownload, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          outcome: choiceResult.outcome,
          appTitle: "Doxisfy",
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        console.log('Download request logged successfully');
      } else {
        console.error('Failed to log download request');
      }

      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
    }
  };

  if (isInAppBrowser) {
    return (
      <section className="download-page__Download__Page">
        <div className="download-page__content__Download__Page">
          <h1 className="download-page__title__Download__Page">Start Your Journey with Doxsify</h1>
          <p className="download-page__description__Download__Page">
            You're currently using an in-app browser. For the best experience, please open this link in your default browser.
          </p>
          <div className="download-page__options__Download__Page">
            <button onClick={() => navigator.clipboard.writeText(currentUrl)} className="download-page__btn__Download__Page">
              Copy Link
            </button>
            <a href='#' download>
            <p>After copying, open it in your default browser.</p>
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="download-page__Download__Page">
      <div className="download-page__content__Download__Page">
        <h1 className="download-page__title__Download__Page">Start Your Journey with Doxsify</h1>
        <p className="download-page__description__Download__Page">
          Choose how you want to experience Doxsify — download the Android app or use it directly on the web. It's all in your hands.
        </p>
        <div className="download-page__options__Download__Page">
          <button onClick={handleInstallClick} className="download-page__btn__Download__Page download-page__android-btn__Download__Page">
            <i className="fa fa-download download-page__btn-icon__Download__Page"></i>
            Download for Android
          </button>
          <Link to='/'>
          <button className="download-page__btn__Download__Page download-page__web-btn__Download__Page">
            <i className="fa fa-laptop download-page__btn-icon__Download__Page"></i>
            Use on Web
          </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DownloadPage;
