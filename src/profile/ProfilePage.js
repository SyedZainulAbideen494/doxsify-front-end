import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProfilePage.css";
import { API_ROUTES } from "../app_modules/apiRoutes";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [medicalData, setMedicalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const nav = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("User not authenticated");
                return;
            }

            try {
                const res = await axios.post(API_ROUTES.getUserProfile, { token });
                setUserData(res.data.user);
                setMedicalData(res.data.medical);
            } catch (err) {
                console.error("❌ Failed to fetch profile:", err);
                alert("Error fetching profile.");
            }
            setLoading(false);
        };

        fetchProfile();
    }, []);

    if (loading) return <div className="loading__profile__page">Loading...</div>;

    return (
        <div className="container__profile__page">
            <header className="header__profile__page">
                <button onClick={() => nav("/")} className="back-btn__profile__page">←</button>
                <h1 className="header-title__profile__page">Your Profile</h1>
            </header>

            <div className="cards-wrapper__profile__page">
                <div className="card__profile__page user__profile__page">
                    <div className="card-header__profile__page">
                        <h2>🧍 Personal Details</h2>
                        <button onClick={() => nav("/user-flow-data")} className="card-edit-btn__profile__page">Edit</button>
                    </div>
                    <ul className="list__profile__page">
                        <li>👤 Name: {userData.name || "Not provided"}</li>
                        <li>⚧️ Gender: {userData.gender}</li>
                        <li>⚖️ Weight: {userData.weight} kg</li>
                        <li>📏 Height: {userData.height} m</li>
                        <li>🎂 DOB: {userData.dob}</li>
                    </ul>
                </div>

                <div className="card__profile__page medical__profile__page">
                    <div className="card-header__profile__page">
                        <h2>🩺 Medical Info</h2>
                        <button onClick={() => nav("/user-flow-data-medical")} className="card-edit-btn__profile__page">Edit</button>
                    </div>
                    <ul className="list__profile__page">
                        <li>🩺 Chronic Diseases: {medicalData?.chronic_diseases || "None"}</li>
                        <li>💊 Medications: {medicalData?.ongoing_medications || "None"}</li>
                        <li>🤧 Allergies: {medicalData?.allergies || "None"}</li>
                        <li>🚬 Smoking/Drinking: {medicalData?.smoking_drinking || "Not specified"}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
