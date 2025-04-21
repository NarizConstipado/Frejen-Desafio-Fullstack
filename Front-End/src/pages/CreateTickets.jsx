import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  createTicket,
  getStates,
  getDepartments,
} from "../utilities/API.Requests.js";
import "../styles/createTicket.css";

function CreateTicket() {
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    id_state: "",
    id_department: "",
    observacoes: "",
  });

  const [states, setStates] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getTicketDependencies = async () => {
    setLoading(true);
    try {
      const statesResponse = await getStates();
      setStates(statesResponse);
      const departmentsResponse = await getDepartments();
      setDepartments(departmentsResponse);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load ticket dependencies.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    setLoading(true);

    if (!newTicket.title || !newTicket.description || !newTicket.id_state) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (newTicket.observacoes == "") {
      newTicket.observacoes = null;
    }

    try {
      const response = await createTicket(newTicket);

      if (response && response.msg) {
        setSuccess(response.msg);
      } else if (response && response.msg) {
        setError(response.msg);
      } else {
        setError("Ticket creation failed due to an unexpected error.");
      }
    } catch (err) {
      setError(err.message || "Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTicketDependencies();
  }, []);

  return (
    <motion.div
      id="ticketRoot"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      <h1>Create Ticket</h1>
      <form id="create-form" onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={newTicket.title}
            onChange={(e) =>
              setNewTicket({ ...newTicket, title: e.target.value })
            }
          />
        </label>
        <label>
          Description:
          <textarea
            value={newTicket.description}
            onChange={(e) =>
              setNewTicket({ ...newTicket, description: e.target.value })
            }
          ></textarea>
        </label>
        <label>
          Observations:
          <textarea
            value={newTicket.observacoes}
            onChange={(e) =>
              setNewTicket({ ...newTicket, observacoes: e.target.value })
            }
          ></textarea>
        </label>
        <div>
          <label>
            Department:
            <select
              value={newTicket.id_department}
              onChange={(e) =>
                setNewTicket({ ...newTicket, id_department: e.target.value })
              }
            >
              <option value="">Selecione um departamento</option>
              {departments.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            State:
            <select
              value={newTicket.id_state}
              onChange={(e) =>
                setNewTicket({ ...newTicket, id_state: e.target.value })
              }
            >
              <option value="">Selecione um estado</option>
              {states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        {success && <p style={{ color: "green" }}>{success}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {loading && <p>Loading...</p>}
        <button type="submit" disabled={loading}>
          Create Ticket
        </button>
      </form>
    </motion.div>
  );
}

export default CreateTicket;
