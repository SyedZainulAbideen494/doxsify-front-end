import React, { useState } from "react";
import { FaHeartbeat, FaMedkit, FaSmoking, FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import "./UserDetailsForm.css";
import { useNavigate } from "react-router-dom";
import { API_ROUTES } from "../app_modules/apiRoutes";

const MedicalDetailsForm = () => {
    const [step, setStep] = useState(1);
    const [chronicDiseases, setChronicDiseases] = useState([]);
    const [ongoingMedications, setOngoingMedications] = useState("");
    const [allergies, setAllergies] = useState("");
    const [smokingDrinking, setSmokingDrinking] = useState("");
    const [loading, setLoading] = useState(false);
    const nav = useNavigate()

    const handleDiseaseSelection = (disease) => {
        setChronicDiseases((prev) =>
            prev.includes(disease) ? prev.filter((d) => d !== disease) : [...prev, disease]
        );
    };

    const handleSubmit = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
    
        const payload = {
            token,
            chronicDiseases,
            ongoingMedications,
            allergies,
            smokingDrinking,
        };
    
        console.log("🚀 Sending payload:", payload);
    
        try {
            await axios.post(API_ROUTES.saveUserMedData, payload);
            nav('/');
        } catch (error) {
            console.error("❌ Error saving medical details:", error);
            alert("Failed to save details.");
        }
    
        setLoading(false);
    };
    
    
    
    return (
        <div className="user__Data__Flow__container">
            <div className="user__Data__Flow__form-card">
                {step === 1 && (
                    <div className="user__Data__Flow__step">
                        <h2>Any Chronic Diseases?</h2>
                        <div className="user__Data__Flow__gender-options">
                            {["Diabetes", "Hypertension", "Asthma", "None"].map((disease) => (
                                <button
                                    key={disease}
                                    className={`user__Data__Flow__gender-button ${chronicDiseases.includes(disease) ? "selected" : ""}`}
                                    onClick={() => handleDiseaseSelection(disease)}
                                >
                                    <FaHeartbeat /> {disease}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setStep(2)} className="user__Data__Flow__next-btn">Next →</button>
                    </div>
                )}

                {step === 2 && (
                    <div className="user__Data__Flow__step">
                        <h2>Any Ongoing Medications?</h2>
                        <div className="user__Data__Flow__input-group">
                            <FaMedkit className="user__Data__Flow__icon" />
                            <input
                                type="text"
                                placeholder="Enter medications (Optional)"
                                value={ongoingMedications}
                                onChange={(e) => setOngoingMedications(e.target.value)}
                            />
                        </div>
                        <button onClick={() => setStep(3)} className="user__Data__Flow__next-btn">Next →</button>
                    </div>
                )}

                {step === 3 && (
                    <div className="user__Data__Flow__step">
                        <h2>Any Allergies?</h2>
                        <div className="user__Data__Flow__input-group">
                            <FaHeartbeat className="user__Data__Flow__icon" />
                            <input
                                type="text"
                                placeholder="Medication, Food, Environmental, etc."
                                value={allergies}
                                onChange={(e) => setAllergies(e.target.value)}
                            />
                        </div>
                        <button onClick={() => setStep(4)} className="user__Data__Flow__next-btn">Next →</button>
                    </div>
                )}

                {step === 4 && (
                    <div className="user__Data__Flow__step">
                        <h2>Do you smoke or drink?</h2>
                        <div className="user__Data__Flow__gender-options">
                            {["Yes", "No"].map((option) => (
                                <button
                                    key={option}
                                    className={`user__Data__Flow__gender-button ${smokingDrinking === option ? "selected" : ""}`}
                                    onClick={() => setSmokingDrinking(option)}
                                >
                                    <FaSmoking /> {option}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setStep(5)} className="user__Data__Flow__next-btn">Next →</button>
                    </div>
                )}

                {step === 5 && (
                    <div className="user__Data__Flow__step">
                        <h2>All Set!</h2>
                        <p>Review your medical details before submission.</p>
                        <ul className="user__Data__Flow__review-list">
                            <li><FaHeartbeat /> Chronic Diseases: {chronicDiseases.length > 0 ? chronicDiseases.join(", ") : "None"}</li>
                            <li><FaMedkit /> Ongoing Medications: {ongoingMedications || "Not provided"}</li>
                            <li><FaCheckCircle /> Allergies: {allergies || "Not provided"}</li>
                            <li><FaSmoking /> Smoking/Drinking: {smokingDrinking || "Not specified"}</li>
                        </ul>
                        <button onClick={handleSubmit} disabled={loading} className="user__Data__Flow__confirm-btn">
                            {loading ? "Saving..." : "Confirm & Proceed"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MedicalDetailsForm;
