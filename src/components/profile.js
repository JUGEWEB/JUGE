import React, { useState } from "react";
import { auth, storage, db } from "./firebaseConfig"; // Firebase storage & Firestore
import { updateProfile } from "firebase/auth"; // Firebase update profile
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // For uploading files to Firebase storage
import { doc, updateDoc } from "firebase/firestore"; // Firestore database to store profile info
import { useNavigate } from "react-router-dom"; // For navigation
import { message } from "antd"; // Import Ant Design's message component
import AddToBasket from "./saveToBasket"
import LikedItems from "./likedItem";
import likedp from "./likedProfile/likedp.jpg"
import savetob from "./likedProfile/savetob.jpg"
import "./profile.css";

const Profile = ({ user, auth }) => {
  const navigate = useNavigate();

  // Ensure safe access to user properties
  const [username, setUsername] = useState(user?.displayName || "");
  const [profilePicUrl, setProfilePicUrl] = useState(user?.photoURL || "");

  // Update username and photo in Firebase
  const handleProfileUpdate = async () => {
    try {
      if (!user) throw new Error("User is not logged in");

      await updateProfile(user, {
        displayName: username,
        photoURL: profilePicUrl,
      });

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        displayName: username,
        photoURL: profilePicUrl,
      });

      message.success("Profile updated successfully!"); // Show success message
    } catch (error) {
      message.error("Error updating profile."); // Show error message
      console.error("Error updating profile:", error);
    }
  };

  // Handle profile picture change
  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file && user) {
      const storageRef = ref(storage, `profilePics/${user.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setProfilePicUrl(url);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      message.success("You have logged out successfully!"); // Show logout success message
      navigate("/");
    } catch (error) {
      message.error("Error logging out."); // Show error message
      console.error("Error logging out:", error);
    }
  };

  // Check if user is null
  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
    <div className="profile-container">
      <h2>Your Profile</h2>
      <div>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Profile Picture:</label>
        <input type="file" accept="image/*" onChange={handleProfilePicChange} />
        {profilePicUrl && <img src={profilePicUrl} alt="Profile" />}
      </div>
      <button onClick={handleProfileUpdate}>Save Changes</button>
      <button
        style={{
          marginTop: "10px",
          backgroundColor: "red",
          color: "white",
          padding: "10px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
    <div>
    <div style={{padding: "20px"}}>
      <div style={{color: "black", fontSize: "20px", fontWeight: "bold", padding: "10px"}}> ❤️ Your liked items</div>
        <img style={{width: "420px", maxHeight: "200px", objectFit: "cover" }} src={likedp} alt="liked Images"/>
    </div>
    <div style={{padding: "20px"}}>
    <div style={{color: "black", fontSize: "20px", fontWeight: "bold", padding: "10px"}}> 🛒 Your basket</div>
    <img style={{width: "420px", maxHeight: "200px", objectFit: "cover" }} src={savetob} alt="liked Images"/>
    </div>
    </div>
    </div>
  );
};

export default Profile;
