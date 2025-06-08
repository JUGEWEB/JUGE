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
import { sendEmailVerification } from "firebase/auth";
import {  sendPasswordResetEmail } from "firebase/auth";



const AuthForm = ({ auth, user }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const {isMobile, isDesktop, isSmallMobile, isTablet, isVerySmall} = useScreenSize()
  const [emailSent, setEmailSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
const [resetEmailSent, setResetEmailSent] = useState(false);



 
  useEffect(() => {
    const hasRefreshed = sessionStorage.getItem("hasRefreshed");
    if (!hasRefreshed) {
      sessionStorage.setItem("hasRefreshed", "true");
      window.location.reload();
    }
  }, []);
  
  useEffect(() => {
    if (user) {
      navigate("/"); // Redirect to homepage if user is logged in
    }
  }, [user, navigate]);

  const handleAuth = async (e) => {
  e.preventDefault();
  try {
    if (isSignUp) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);
       setEmailSent(true); // ✅ Show the message
      
      message.success("Sign-up successful! Please verify your email before logging in.");
    } else {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        message.warning("Please verify your email before logging in.");
        return;
      }

      message.success("Login successful!");
      navigate("/");
    }
  } catch (error) {
  console.error("Auth error:", error.message);

  let friendlyMessage = "Something went wrong. Please try again.";

  if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
    friendlyMessage = "Incorrect email or password.";
  } else if (error.code === "auth/user-not-found") {
    friendlyMessage = "No account found with this email.";
  } else if (error.code === "auth/email-already-in-use") {
    friendlyMessage = "This email is already registered.";
  } else if (error.code === "auth/weak-password") {
    friendlyMessage = "Password should be at least 6 characters.";
  }

  message.error(friendlyMessage);
}

};


  const handleGoogleSignIn = async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (!user.emailVerified) {
      message.warning("Please verify your email before continuing.");
      return;
    }

    message.success("Google sign-in successful!");
    navigate("/");
  } catch (error) {
    console.error("Error during Google sign-in:", error.message);
    message.error(error.message);
  }
};

const handlePasswordReset = async () => {
  if (!email) {
    message.warning("Please enter your email to reset password.");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    setResetEmailSent(true);
    message.success("Password reset email sent!");
  } catch (error) {
    console.error("Password reset error:", error.message);
    if (error.code === "auth/user-not-found") {
  message.error("No user found with this email.");
} else {
  message.error("Failed to send reset email. Please try again.");
}

    message.error("Failed to send reset email. Please try again.");
  }
};



  return (
    <div className="auth-form">

      {isSignUp &&  (
  <p style={{ color: "#222", marginTop: "10px" }}>
    A confirmation link will be sent to your email. Please verify before logging in.
  </p>
)}

{resetEmailSent && (
  <p style={{ color: "#28a745", marginTop: "8px" }}>
    A password reset link has been sent to <strong>{email}</strong>.
  </p>
)}


      <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
      <form onSubmit={handleAuth}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
       <div style={{ position: "relative" }}>
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />
  <span
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: "absolute",
      right: 10,
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      fontSize: "12px",
      color: "#007bff",
    }}
  >
    {showPassword ? "Hide" : "Show"}
  </span>
</div>

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

      {!isSignUp && (
  <p style={{ marginTop: "10px" }}>
    <button
      style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer", padding: 0 }}
      onClick={handlePasswordReset}
    >
      Forgot your password?
    </button>
  </p>
)}


      {/* Google Sign-In Button */}
      <button className="google-sign-in" onClick={handleGoogleSignIn}>
        Sign in with Google
      </button>
    </div>
  );
};

export default AuthForm;
