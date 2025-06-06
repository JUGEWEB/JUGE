import React, { useState } from "react";
import { auth, storage, db } from "./firebaseConfig";
import { updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import likedp from "./likedProfile/likedp.jpg";
import savetob from "./likedProfile/savetob.jpg";
import "./profile.css";

const Profile = ({ user, auth }) => {
  const navigate = useNavigate();
  const [profilePicUrl, setProfilePicUrl] = useState(user?.photoURL || "");

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file && user) {
      const storageRef = ref(storage, `profilePics/${user.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setProfilePicUrl(url);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      if (!user) throw new Error("User is not logged in");

      await updateProfile(user, {
        photoURL: profilePicUrl,
      });

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        photoURL: profilePicUrl,
      });

      message.success("Profile updated successfully!");
    } catch (error) {
      message.error("Error updating profile.");
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      sessionStorage.removeItem("hasRefreshed");
      message.success("You have logged out successfully!");
      navigate("/");
    } catch (error) {
      message.error("Error logging out.");
      console.error("Error logging out:", error);
    }
  };

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-info">
        <h2>Your Profile</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Username:</strong> {user.displayName || "N/A"}</p>

        <div>
          <label>Profile Picture:</label>
          <input type="file" accept="image/*" onChange={handleProfilePicChange} />
          {profilePicUrl && <img className="profile-pic" src={profilePicUrl} alt="Profile" />}
        </div>

        <button onClick={handleProfileUpdate}>Save Changes</button>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="profile-visuals">
        <div className="section">
          <div className="section-title">❤️ Your liked items</div>
          <img className="section-img" src={likedp} alt="liked items" />
        </div>

        <div className="section">
          <div className="section-title">🛒 Your basket</div>
          <img className="section-img" src={savetob} alt="saved items" />
        </div>
      </div>
    </div>
  );
};

export default Profile;
