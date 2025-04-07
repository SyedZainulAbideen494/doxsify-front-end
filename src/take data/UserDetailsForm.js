import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaTransgender, FaWeight, FaRuler, FaCalendarAlt } from "react-icons/fa";
import "./UserDetailsForm.css";
import { API_ROUTES } from "../app_modules/apiRoutes";

const UserDetailsForm = () => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState("");
    const [gender, setGender] = useState("");

    const [weightInput, setWeightInput] = useState("");
    const [weightUnit, setWeightUnit] = useState("kg");
    const [weight, setWeight] = useState("");

    const [heightInput, setHeightInput] = useState("");
    const [heightUnit, setHeightUnit] = useState("m");
    const [height, setHeight] = useState("");

    const [dobMonth, setDobMonth] = useState("");
    const [dobDay, setDobDay] = useState("");
    const [dobYear, setDobYear] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const convertAndSetWH = () => {
        let weightInKg = parseFloat(weightInput);
        let heightInMeters = parseFloat(heightInput);

        if (weightUnit === "lbs") weightInKg *= 0.453592;

        switch (heightUnit) {
            case "cm":
                heightInMeters /= 100;
                break;
            case "in":
                heightInMeters *= 0.0254;
                break;
            case "ft":
                heightInMeters *= 0.3048;
                break;
            default:
                break;
        }

        setWeight(weightInKg.toFixed(2));
        setHeight(heightInMeters.toFixed(2));
        setStep(4);
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("User not authenticated.");
            return;
        }

        setLoading(true);
        try {
            await axios.post(API_ROUTES.saveUserData, {
                token, name, gender, weight, height, dobMonth, dobDay, dobYear
            });
            navigate("/user-flow-data-medical");
        } catch (error) {
            console.error("Error saving details:", error);
            alert("Failed to save details.");
        }
        setLoading(false);
    };

    return (
        <div className="user__Data__Flow__container">
            <div className="user__Data__Flow__form-card">
            {step === 1 && (
    <div className="user__Data__Flow__step">
        <h2>What should we call you?</h2>
        <div className="user__Data__Flow__input-group">
            <FaUser className="user__Data__Flow__icon" />
            <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
        </div>
        <button
            onClick={() => setStep(2)}
            className="user__Data__Flow__next-btn"
            disabled={!name.trim()}
        >
            Next →
        </button>
    </div>
)}


{step === 2 && (
    <div className="user__Data__Flow__step">
        <h2>Your gender?</h2>
        <div className="user__Data__Flow__gender-options">
            {["Male", "Female", "Other", "Prefer not to say"].map((g) => (
                <button key={g} className={`user__Data__Flow__gender-button ${gender === g ? "selected" : ""}`} onClick={() => setGender(g)}>
                    <FaTransgender /> {g}
                </button>
            ))}
        </div>
        <button
            onClick={() => setStep(3)}
            className="user__Data__Flow__next-btn"
            disabled={!gender}
        >
            Next →
        </button>
    </div>
)}


{step === 3 && (
    <div className="user__Data__Flow__step">
        <h2>Enter your weight & height</h2>
        <div className="user__Data__Flow__input-group">
            <FaWeight className="user__Data__Flow__icon" />
            <input type="number" placeholder={`Weight (${weightUnit})`} value={weightInput} onChange={(e) => setWeightInput(e.target.value)} required />
            <select value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)}>
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
            </select>
        </div>
        <div className="user__Data__Flow__input-group">
            <FaRuler className="user__Data__Flow__icon" />
            <input type="number" placeholder={`Height (${heightUnit})`} value={heightInput} onChange={(e) => setHeightInput(e.target.value)} required />
            <select value={heightUnit} onChange={(e) => setHeightUnit(e.target.value)}>
                <option value="m">m</option>
                <option value="cm">cm</option>
                <option value="in">in</option>
                <option value="ft">ft</option>
            </select>
        </div>
        <button
            onClick={convertAndSetWH}
            className="user__Data__Flow__next-btn"
            disabled={!weightInput || !heightInput}
        >
            Next →
        </button>
    </div>
)}

{step === 4 && (
    <div className="user__Data__Flow__step">
        <h2>Enter your Date of Birth</h2>
        <div className="user__Data__Flow__dob-group">
            <input
                type="date"
                value={dobYear && dobMonth && dobDay ? `${dobYear}-${dobMonth.padStart(2, '0')}-${dobDay.padStart(2, '0')}` : ""}
                onChange={(e) => {
                    const [year, month, day] = e.target.value.split("-");
                    setDobYear(year);
                    setDobMonth(month);
                    setDobDay(day);
                }}
                required
            />
        </div>
        <button
            onClick={() => setStep(5)}
            className="user__Data__Flow__next-btn"
            disabled={!dobYear || !dobMonth || !dobDay}
        >
            Next →
        </button>
    </div>
)}


                {step === 5 && (
                    <div className="user__Data__Flow__step">
                        <h2>All Set!</h2>
                        <p>Review your details before submission.</p>
                        <ul className="user__Data__Flow__review-list">
                            <li><FaUser /> Name: {name || "Not provided"}</li>
                            <li>⚧️ Gender: {gender}</li>
                            <li>⚖️ Weight: {weight} kg</li>
                            <li>📏 Height: {height} m</li>
                            <li>📅 DOB: {dobMonth}/{dobDay}/{dobYear}</li>
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

export default UserDetailsForm;
