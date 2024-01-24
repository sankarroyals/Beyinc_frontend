import React from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="LandingPage-Container">
      <div className="Beyinc-logo">
        <img src="/logo.png" alt="logo" />
        <button className="sign-button" onClick={() => navigate("/login")}>
          Sign In / Signup
        </button>
      </div>
      <div className="home">
      <img src= '/business.png'/>
        <div>
          <h1>
            Welcome to India's Social <br /> Entrepreneurship Platform
          </h1>
        </div>
        <h3>Turning Dreams Into Reality</h3>
      </div>
      <div className="playstore">
        <img src="/google-play.png" />
        <img src="/app-store.png" />
      </div>
      <div className="poweredby">Powered by</div>
      <div className="poweredby-img">
        <img src="/rupay.webp" />
        <img src="/npci.webp" />
        <img src="/bharat.webp" />
      </div>
    </div>
  );
};

export default LandingPage;
