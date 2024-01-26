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
      <div
        className="Beyinc-logo"
        style={{ display: email == undefined ? "flex" : "none" }}
      >
        <img src="/logo.png" alt="logo" />
        <button className="sign-button" onClick={() => navigate("/login")}>
          Sign In / Signup
        </button>
      </div>
      <div className="home">
        <img src="/business.png" />
        <div>
          <h1>
            Welcome to  Social <br /> Entrepreneurship Platform
          </h1>
        </div>
        <h3>Turning Dreams Into Reality</h3>
      </div>
      {/* <div className="playstore">
        <img src="/google-play.png" />
        <img src="/app-store.png" />
      </div> */}
      <div className="poweredby">Powered by</div>
      <div className="poweredby-img">
        <img src="/rupay.webp" />
        <img src="/npci.webp" />
        <img src="/bharat.webp" />
      </div>
      {/* section-2 */}
      <div className="section-2">
        <div>
          <h1>Welcome to BeyInc, </h1>
          <span> Beyond Incubation</span>
          <p>At BeyInc, we go beyond the traditional norms of incubation.</p>
        </div>

        <div className="container">
          <div className="content">
            <h2>
              Your Gateway to Turning <br />
              Dreams into Reality!
            </h2>
            <p>
              We are not just a company, we are your trusted partner in
              transforming your entrepreneurial dreams into successful ventures.
            </p>
          </div>
          <img
            src="/mobilescreen.webp"
            alt="Mobile Screen Image"
            className="right-image"
          />
        </div>

        <div className="box-container">
          <div className="box">
            <h2>Lorem ipsum</h2>
            <img src="/timer.webp" />
          </div>

          <div className="box">
            <h2>Lorem ipsum</h2>
            <img src="/flag.webp" />
          </div>
        </div>

        <div className="container-2">
          <div className="content-2">
            <h2>Not hitched yet? </h2>
            <br />
            <span> Not a problem!</span>

            <p>
              We are not just a company, we are your trusted partner in
              transforming your entrepreneurial dreams into successful ventures.
            </p>
          </div>
          <div>
            <div className="rating">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <div className="text-rating">
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua."
                <br />
                <span>Shiva, Mentor </span>
              </div>
            </div>
            <img className="dummy" src="/dummy.jpg" />
          </div>
        </div>
      </div>

      <div className="working-container">
        <div className="header-container">
          <h2>How </h2>
          <span> it works</span>
          <br />
        </div>
        <div className="working-box">
          <img src="/create-wallet-white.webp" />
          <h3>Loreum Ipsum</h3>
        </div>
        <div className="working-box">
          <img src="/invite-white.webp" />
          <h3>Loreum Ipsum</h3>
        </div>
        <div className="working-box">
          <img src="/cards-white.webp" />
          <h3>Loreum Ipsum</h3>
        </div>
        <div className="working-box">
          <img src="/pool-white.webp" />
          <h3>Loreum Ipsum</h3>
        </div>
      </div>

      <div className="black-container">
        <h1>Loreum Ipsum</h1>
        <img src="card-gif.gif" />
      </div>

      <div className="random-containers">
        <div className="random-box1">
        <h3>Loreum ipsum</h3>
          <img src="/track-mange.webp" />
        </div>
        <div className="random-box2">
        <h3>Loreum ipsum</h3>
          <img src="/together.webp" />
        </div>
        <div className="random-box3">
        <h3>Loreum ipsum</h3>
          <img src="/bank.webp" />
        </div>
        <div className="random-box4">
        <h3>Loreum ipsum</h3>
          <img src="/limit.webp" />
        </div>
      </div>

      <footer className="footer">
        <div className="Beyinc-logo">
          <img src="/logo.png" alt="logo" />
          {/* <div className="footer-playstore">
            <img src="/playstore-light.svg" />
            <img src="/appstore-light.svg" />
          </div> */}
        </div>

        <div className="footer-content">
          <nav>
            <h2>Quick Links</h2>
            <ul>
              <li>
                <a href="#about">
                  <i class="fas fa-info-circle"></i> About
                </a>
              </li>
              <li>
                <a href="#contact">
                  <i class="fas fa-envelope"></i> Contact
                </a>
              </li>
              <li>
                <a href="#services">
                  <i class="fas fa-cogs"></i> Services
                </a>
              </li>
              <li>
                <a href="#collaborators">
                  <i class="fas fa-users"></i> Our Collaborators
                </a>
              </li>
            </ul>
          </nav>

          <nav>
            <h2>Say Hello</h2>
            <ul>
              <li>
                <i className="fas fa-map-marker-alt"></i> Chennai
              </li>
              <li>
                <i className="fas fa-envelope"></i> info@beyinc.net
              </li>

              <div className="icons">
                <i className="fab fa-linkedin"></i>
                <i className="fab fa-facebook"></i>
                <i className="fab fa-twitter"></i>
                <i className="fab fa-instagram"></i>
              </div>
            </ul>
          </nav>

          <nav>
            <h2>Legal Information</h2>
            <ul>
              <li>
                <i class="fas fa-shield-alt"></i> Privacy Policy
              </li>
              <li>
                <i class="fas fa-file-contract"></i> Terms of Service
              </li>
              <li>
                <i class="fas fa-cookie-bite"></i> Cookie Policy
              </li>
            </ul>
          </nav>
        </div>

        <p className="copyright">
          Copyright &copy; 2024 BeyInc. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
