import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:3000";

// Utility function for axios requests
const makeRequest = async (method, url, data = {}, params = {}) => {
  try {
    const token = localStorage.getItem("token");

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

// USERS
// POST: Login
export const login = async (email, password) => {
  const url = `${API_BASE_URL}/login`;
  const data = { email, password };
  return makeRequest("post", url, data);
};

// GET: UserById
export const getUserById = async (userId) => {
  const url = `${API_BASE_URL}/users/${userId}`;
  return makeRequest("get", url);
};

// PUT: Update User
export const updateUser = async (data) => {
  const url = `${API_BASE_URL}/users/${data.id}`;
  return makeRequest("put", url, data);
};

// DEPARTMENTS
// GET: Get Departments
export const getDepartments = async () => {
  const url = `${API_BASE_URL}/departments`;
  return makeRequest("get", url);
};

// STATES
// GET: Get States
export const getStates = async () => {
  const url = `${API_BASE_URL}/states`;
  return makeRequest("get", url);
};

// TICKETS
// GET: Get Tickets
export const getTickets = async ({ page, limit, search, id_state }) => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (search) {
    params.append("search", search);
  }
  if (id_state && id_state.length > 0) {
    params.append("id_state", id_state.join(","));
  }

  const url = `${API_BASE_URL}/tickets?${params.toString()}`;
  return makeRequest("get", url);
};

// GET: Get Tickets
export const getTicket = async (id) => {
  const url = `${API_BASE_URL}/tickets/${id}`;
  return makeRequest("get", url);
};

// POST: Create Ticket
export const createTicket = async (data) => {
  const url = `${API_BASE_URL}/tickets`;
  return makeRequest("post", url, data);
};
