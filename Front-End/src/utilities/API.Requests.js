import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:3000";

// Utility function for axios requests
const makeRequest = async (method, url, data = {}, params = {}) => {
  try {
    const token = localStorage.getItem("token"); // Retrieve token from local storage

    const headers = {
      ...(token ? { Authorization: token } : {}),
      "Content-Type": "application/json",
    };

    const response = await axios({
      method,
      url,
      data: method !== "get" ? data : {},
      params: method === "get" ? params : {},
      headers,
      timeout: 10000,
    });

    return response.data;
  } catch (error) {
    console.error(`Error in ${method.toUpperCase()} ${url}:`, error);
    throw error;
  }
};

// POST: Login
export const login = async (email, password) => {
  const url = `${API_BASE_URL}/login`; // Update the URL to match your backend endpoint
  const data = { email, password };
  return makeRequest("post", url, data);
};

// GET: User By Id
export const getUserById = async (userId) => {
  const url = `${API_BASE_URL}/users/${userId}`;
  return makeRequest("get", url);
};

// GET: Get Departments
export const getDepartments = async () => {
  const url = `${API_BASE_URL}/departments`;
  return makeRequest("get", url);
};

// PUT: Update User
export const updateUser = async (data) => {
  const url = `${API_BASE_URL}/users/${data.id}`;
  return makeRequest("put", url, data);
};

// GET: Get Tickets
export const getTickets = async ({ page, limit }) => {
  const url = `${API_BASE_URL}/tickets?page=${page}&limit=${limit}`;
  return makeRequest("get", url);
};

// GET: Get Tickets
export const getTicket = async (id) => {
  const url = `${API_BASE_URL}/tickets/${id}`;
  return makeRequest("get", url);
};
