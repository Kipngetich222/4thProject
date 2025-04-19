import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const Profile = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const [photo, setPhoto] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState("");
  const navigate = useNavigate();

  // Initialize username when component mounts
  useEffect(() => {
    if (currentUser?.username) {
      setUsername(currentUser.username);
      setTempUsername(currentUser.username);
    }
  }, [currentUser]);

  const handleUpload = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!photo) {
      setError("Please select a photo first");
      return;
    }

    setIsUploading(true);
    
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateUserProfile({ 
          photoURL: event.target.result,
          username: username // Include current username in update
        });
      };
      reader.onerror = () => {
        setError("Failed to read the file");
      };
      reader.readAsDataURL(photo);
    } catch (error) {
      setError(error.message);
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    updateUserProfile({ photoURL: null });
    setPhoto(null);
  };

  const handleUsernameUpdate = () => {
    if (tempUsername.trim() === "") {
      setError("Username cannot be empty");
      return;
    }
    updateUserProfile({ username: tempUsername });
    setUsername(tempUsername);
    setIsEditingUsername(false);
  };

  const emojis = ["👋", "😊", "🌟", "🎉", "❤️", "👍"];

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      {/* Back Arrow Button */}
      <button
  onClick={() => navigate(-1)}
  className="flex items-center gap-2 text-blue-600 hover:text-blue-900 cursor-pointer font-medium transition-colors"
>
  <FiArrowLeft className="w-5 h-5" />
  <span>Back</span>
</button>
      <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
      
      {/* Greeting Section */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        {username ? (
          <h3 className="text-lg font-semibold">
            Hi {username} {emojis[Math.floor(Math.random() * emojis.length)]}
          </h3>
        ) : (
          <h3 className="text-lg font-semibold">Please set your username</h3>
        )}
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Username Section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Username</h3>
        {isEditingUsername ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="Enter your username"
              maxLength="20"
            />
            <button
              onClick={handleUsernameUpdate}
              className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditingUsername(false)}
              className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-lg">{username || "No username set"}</span>
            <button
              onClick={() => setIsEditingUsername(true)}
              className="text-blue-500 hover:text-blue-700"
            >
              Edit
            </button>
          </div>
        )}
      </div>

      {/* Profile Picture Section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Profile Picture</h3>
        <form onSubmit={handleUpload}>
          <div className="mb-4">
            {currentUser?.photoURL ? (
              <div className="flex flex-col items-center mb-4">
                <img 
                  src={currentUser.photoURL} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover mb-2"
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="text-red-500 text-sm"
                >
                  Remove Photo
                </button>
              </div>
            ) : (
              <div className="flex flex-col">
                <input
                  type="file"
                  id="profile-upload"
                  onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                  className="mb-4"
                  accept="image/*"
                />
                <label 
                  htmlFor="profile-upload"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded cursor-pointer text-center"
                >
                  {photo ? photo.name : "Choose a file"}
                </label>
              </div>
            )}
          </div>
          {!currentUser?.photoURL && photo && (
            <button
              type="submit"
              disabled={isUploading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Upload Photo"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;