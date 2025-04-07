import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { API_ROUTES } from "../app_modules/apiRoutes";



const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #0d0d0d;
  color: white;
  height: 100vh;
  padding: 20px;
  position: relative;
  overflow: hidden;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  color: white;
  font-size: 22px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s ease;
  &:hover {
    opacity: 1;
  }
`;

const SubscriptionContainer = styled.div`
  text-align: center;
  width: 90%;
  max-width: 420px;
  padding: 30px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow: 0 0 30px rgba(122, 90, 248, 0.15);
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #fff;
  /* font-family: 'Playfair Display', serif; */
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: #bbb;
  margin-bottom: 24px;
`;

const Plans = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 25px;
`;

const PlanBox = styled.div`
  padding: 18px;
  border-radius: 16px;
  text-align: center;
  border: 2px solid ${(props) => (props.active ? "#7a5af8" : "rgba(255, 255, 255, 0.15)")};
  width: 165px;
  cursor: pointer;
  position: relative;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.06);
  box-shadow: ${(props) =>
    props.active
      ? "0 0 20px rgba(122, 90, 248, 0.5)"
      : "0 0 10px rgba(255, 255, 255, 0.05)"};
  transition: all 0.3s ease;

  &:hover {
    border-color: #7a5af8;
    background: rgba(122, 90, 248, 0.07);
    box-shadow: 0 0 25px rgba(122, 90, 248, 0.3);
  }
`;

const BestOfferTag = styled.div`
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #7a5af8, #a88bff);
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 5px 12px;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(122, 90, 248, 0.5);
`;

const SmallText = styled.p`
  font-size: 12px;
  color: #bbb;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #7a5af8, #a88bff);
  color: white;
  border: none;
  padding: 16px 42px;
  font-size: 17px;
  border-radius: 30px;
  cursor: pointer;
  width: 100%;
  max-width: 290px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(122, 90, 248, 0.4);

  &:hover {
    background: linear-gradient(135deg, #6a4be8, #977aff);
    box-shadow: 0 8px 25px rgba(122, 90, 248, 0.5);
  }

  &:disabled {
    background: #444;
    cursor: default;
    box-shadow: none;
  }
`;

const Footer = styled.p`
  margin-top: 18px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [isPremium, setIsPremium] = useState(null);
  // Handle Payment with Razorpay
  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to subscribe.");
        return;
      }

      // Set pricing based on selected plan
      const planAmount = selectedPlan === "monthly" ? 999 : 9999; // Razorpay accepts paise (₹39 → 3900, ₹99 → 9900)

      const { data } = await axios.post(API_ROUTES.getPremium, {
        amount: planAmount,
        currency: "INR",
        subscription_plan: "Doxsify AI",
        token,
        duration: selectedPlan,
      });

      const options = {
        key: "rzp_live_jPX6SxetQbApHC",
        amount: data.order.amount,
        currency: "INR",
        order_id: data.order.id,
        name: "Doxsify",
        description: `Subscription Payment (${selectedPlan})`,
        handler: async (response) => {
          const { data } = await axios.post(API_ROUTES.verifyPayment, {
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            signature: response.razorpay_signature,
            token,
            subscription_plan: "Doxsify",
            duration: selectedPlan,
          });
      
          if (data.success) {
            navigate("/payment-success");
          } else {
            alert("Payment verification failed!");
          }
        },
        theme: { color: "#000000" },
      
        method: {
          upi: true, // ✅ Enable UPI but force manual entry
          card: true,
          netbanking: true,
          wallet: true,
        },
      
        config: {
          display: {
            hide: ["upi_recommended"], // ✅ Hide "Recommended" UPI options (PhonePe, Google Pay, Paytm)
          },
        },
      
        prefill: {
          method: "upi", // ✅ Forces users to enter UPI ID manually
        },
      };
      
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
      
    } catch (error) {
      console.error("Error initiating payment", error);
    }
  };

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
  

  return (
    <Wrapper>
    {/* Close Button 
    <CloseButton onClick={() => navigate("/")}>✕</CloseButton>*/}
  
    {/* Subscription Section */}
    <SubscriptionContainer>
    <Title>Intelligent Healthcare. Instantly Accessible.</Title>
    <Subtitle>Upgrade to Doxsify Premium for AI-powered care and elite features.</Subtitle>
  
      {/* Plans */}
      <Plans>
      <PlanBox active={selectedPlan === "monthly"} onClick={() => setSelectedPlan("monthly")}>
  <BestOfferTag>POPULAR</BestOfferTag>
  <h4>MONTHLY</h4>
  <p>₹999 / month</p>
  <SmallText>Just ₹33/day</SmallText>
</PlanBox>

<PlanBox active={selectedPlan === "yearly"} onClick={() => setSelectedPlan("yearly")}>
  <BestOfferTag>BEST VALUE</BestOfferTag>
  <h4>YEARLY</h4>
  <p>₹9,999 / year</p>
  <SmallText>Just ₹27/day</SmallText>
</PlanBox>

      </Plans>
  
      {/* CTA Button */}
      {isPremium ? (
        <Button disabled>You have Premium! 🔥</Button>
      ) : (
        <Button onClick={handlePayment}>Unlock Doxsify</Button>
              )}
  
      {/* Secure Payment Notice */}
      <Footer>🔒 Secure Payment via Razorpay</Footer>
    </SubscriptionContainer>

  </Wrapper>
  );
};

export default SubscriptionPage;
