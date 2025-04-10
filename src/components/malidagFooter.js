import React from "react";
import "./malidagFooter.css";
import { useLocation } from "react-router-dom";

function MalidagFooter() {

  const location = useLocation(); // Use the useLocation hook to get the current path


  return (
    <footer className="malidag-footer">
      <div className="footer-container">
        {/* Partnerships Section */}
        <div className="footer-section">
          <h3>Our Partnerships</h3>
          <ul>
            <li><a href="https://vault.com" target="_blank" rel="noopener noreferrer">Vault</a></li>
            <li><a href="https://binege.com" target="_blank" rel="noopener noreferrer">Binege</a></li>
          </ul>
        </div>

        {/* Services Section */}
        <div className="footer-section">
          <h3>Services</h3>
          <ul>
            <li><a href="/mws">Malidag Web Service (MWS)</a></li>
            <li><a href="/learn-more">Learn More</a></li>
          </ul>
        </div>

        {/* Contact Us Section */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p><a href="mailto:support@malidag.com">support@malidag.com</a></p>
          <p><a href="mailto:info@malidag.com">info@malidag.com</a></p>
          <p> <a href="mailto:partnerships@malidag.com">partnerships@malidag.com</a></p>
          <p>Phone: <a href="tel:+123456789">+1 234 567 89</a></p>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/about-us">About Us</a></li>
            <li><a href="/terms-and-conditions">Terms and Conditions</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <img src="/icons/facebook-icon.svg" alt="Facebook" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <img src="/icons/twitter-icon.svg" alt="Twitter" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <img src="/icons/linkedin-icon.svg" alt="LinkedIn" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <img src="/icons/instagram-icon.svg" alt="Instagram" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Malidag. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default MalidagFooter;
