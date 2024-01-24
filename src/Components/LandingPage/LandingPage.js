import React from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";




const LandingPage = () => {
  const navigate = useNavigate();
  const { email, role, userName, image, verification } = useSelector(
    (store) => store.auth.loginDetails
  );

  return (
    <div className="LandingPage-Container">
      {/* section -1 */}
      <div className="Beyinc-logo"  style={{ display: email == undefined ? "flex" : "none" }}>
        <img src="/logo.png" alt="logo" />
        <button className="sign-button" onClick={() => navigate("/login")}>
          Sign In / Signup
        </button>
      </div>
      <div className="home">
        <img src="/business.png" />
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
      {/* section-2 */}
      <div className="section-2">
        <div>
          <h1>Pool together, </h1>
          <span> spend together</span>
          <p>
            Use your joint wallet to pool your money, and your joint Coupl cards
            to spend on all that you do together
          </p>
        </div>

        <div className="container">
          <div className="content">
            <h2>
              Say goodbye to <br />
              splitting transactions!
            </h2>
            <p>
              No more splitting every transaction! With the Coupl joint wallet,
              you and your partner can easily manage your shared expenses
              together from one account.
            </p>
          </div>
          <img
            src="/mobilescreen.webp"
            alt="Mobile Screen Image"
            className="right-image"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
