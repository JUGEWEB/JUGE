import React, { useState, useEffect } from "react";
import useScreenSize from "./useIsMobile";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  getRedirectResult,
} from "firebase/auth";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const AuthForm = ({ auth, user }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const {isMobile, isDesktop, isSmallMobile, isTablet, isVerySmall} = useScreenSize()

  // Handle the redirect result after the sign-in process
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth); // Handles redirect result after Google sign-in
        if (result) {
          const user = result.user; // User data returned from Google
          console.log("User signed in:", user);
          message.success("Login successful!");
          navigate("/"); // Redirect after successful login
        }
      } catch (error) {
        console.error("Error during redirect result:", error.message); // Log the error to console for debugging
        message.error("Login failed!"); // Show error message if any
      }
    };

    handleRedirectResult();
  }, [auth, navigate]);

  useEffect(() => {
    if (user) {
      navigate("/"); // Redirect to homepage if user is logged in
    }
  }, [user, navigate]);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        message.success("Sign-up successful!");
        navigate("/"); // Redirect after successful sign-up
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        message.success("Login successful!");
        navigate("/"); // Redirect after successful login
      }
    } catch (error) {
      console.error("Error during authentication:", error.message); // Log error for debugging
      message.error(error.message); // Show the error message using Ant Design
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
  
    try {
      // Use the popup flow for both mobile and desktop
      const result = await signInWithPopup(auth, provider);
  
      // If the sign-in is successful, you can retrieve the user and token from the result
      const user = result.user;
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;  // Google Access Token
  
      console.log("User signed in:", user);
      console.log("Google Access Token:", token);
  
      // Handle successful sign-in (e.g., store user info, navigate, etc.)
      message.success("Login successful!");
      navigate("/");  // Redirect after successful login
    } catch (error) {
      console.error("Error during Google sign-in:", error.message);
      message.error(error.message);  // Show error message if any
    }
  };
  

  return (
    <div className="auth-form">
      <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
      <form onSubmit={handleAuth}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="auth-submit">
          {isSignUp ? "Sign Up" : "Login"}
        </button>
      </form>
      <p>
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          className="switch-button"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? "Login" : "Sign Up"}
        </button>
      </p>

      {/* Google Sign-In Button */}
      <button className="google-sign-in" onClick={handleGoogleSignIn}>
        Sign in with Google
      </button>
    </div>
  );
};

export default AuthForm;
