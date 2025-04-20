// src/pages/Login.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { login } from "../utilities/API.Requests"; // Ensure this is pointing to your API request function
import { useNavigate } from "react-router-dom";

import "../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await login(email, password);

      if (response && response.accessToken) {
        localStorage.setItem("token", response.accessToken);
        navigate("/");
      } else if (response && response.message) {
        setError(response.message); // Use the message from the backend error
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form id="login-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            placeholder="example123!;"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </motion.div>
  );
};

export default Login;
