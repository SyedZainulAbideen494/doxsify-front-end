import React, { useState, useEffect } from "react";
import styled from "styled-components";
import LoaderMagicComponent from "./MagicLoaderComponenet";

const LoaderMagic = () => {
  const [text, setText] = useState("We’re working our magic");
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <StyledWrapper>
      <LoaderContainer>
        <LoaderMagicComponent />
        <LoadingText>{text + dots}</LoadingText>
      </LoaderContainer>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: #121212; /* Dark theme background */
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoadingText = styled.p`
  color: #ffffff;
  font-size: 18px;
  margin-top: 10px;
  font-weight: 500;
  font-family: "Poppins", sans-serif;
  letter-spacing: 1px;
`;

export default LoaderMagic;
