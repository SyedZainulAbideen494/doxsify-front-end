import { Fragment, useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  Params,
  useNavigate,
} from "react-router-dom";
import "./index.css";
import "./App.css";
import axios from "axios";
import Login from "./auth/login";
import SignUp from "./auth/signup";
import Dashboard from "./dashboard/Dashboard";
import AIMain from "./AI/ai";
import UserDetailsForm from "./take data/UserDetailsForm";
import MedicalDetailsForm from "./take data/UserDetailsFormMed";
import SubscriptionPage from "./subscription/SubscriptionPage";
import PaymentSuccess from "./subscription/PaymentSuccess";
import ProfilePage from "./profile/ProfilePage";
import LoadingPage from "./auth/LoadingPage";
import ForgotPassword from "./auth/forgot-password";
import ResetPassword from "./auth/ResetPassword";
import DownloadPage from "./documents/DownloadPage";


const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};

const PUBLIC_VAPID_KEY = "BLDWVHPzXRA9ZOFhSyCet2trdRuvErMUBKuUPNzDsffj-b3-yvd7z58UEhpQAu-MA3DREuu4LwQhspUKBD1yngs";

const router = createBrowserRouter([
  { path: '/login', element: <Login/>},
  {path: '/sign-up', element: <SignUp/>},
  {path: '/user-flow-data', element: <UserDetailsForm/>},
  {path: '/user-flow-data-medical', element: <MedicalDetailsForm/>},
  {path: '/plans', element: <SubscriptionPage/>},
  {path: '*', element: <AIMain/>},
  {path: "/payment-success", element: <PaymentSuccess/>},
  {path: '/profile', element: <ProfilePage/>},
  {path: '/loading', element: <LoadingPage/>},
  {path: '/forgot-password', element: <ForgotPassword/>},
  {path: '/reset-password/:token', element: <ResetPassword/>},
  {path: '/download', element: <DownloadPage/>}
]);


function App() {


  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;