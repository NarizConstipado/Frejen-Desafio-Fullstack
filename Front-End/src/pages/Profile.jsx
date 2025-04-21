import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  getUserById,
  getDepartments,
  updateUser,
} from "../utilities/API.Requests.js";
import { currentUser } from "../utilities/auth";
import "../styles/profile.css";

function Perfil() {
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    id_department: "",
    password: "",
  });
  const token = localStorage.getItem("token");
  // Display required for user name not being updated as the user is writing
  const [displayName, setDisplayName] = useState("");
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const getInfo = async () => {
    if (loading) {
      return;
    }
    setLoading(true);

    try {
      const loggedUser = await currentUser(token);
      let user = await getUserById(loggedUser.id);
      let departments = await getDepartments();
      setDepartments(departments);
      setUserData({
        id: user.id,
        name: user.name || "",
        id_department: user.department.id || "",
      });

      setDisplayName(user.name);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      let newUser = {};
      if (userData.password != "") {
        newUser.password = userData.password;
      }
      newUser.name = userData.name;
      newUser.id_department = userData.id_department;

      const response = await updateUser(userData);

      if (response && response.success) {
        setSuccess(response.msg);
      } else if (response && !response.success) {
        setError(response.msg || "Update failed.");
      } else {
        setError("Login failed due to an unexpected error.");
      }
    } catch (err) {
      setError(err.message || "Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      id="componentsContainer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      {!loading ? <h1>Welcome, {displayName}</h1> : <h1>Loading...</h1>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form id="profile-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={userData.name || ""}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="id_department">Department:</label>
          <select
            id="id_department"
            name="id_department"
            value={userData.id_department || ""}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              Select a department
            </option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Leave blank to keep current password"
            value={userData.password || ""}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </motion.div>
  );
}

export default Perfil;
