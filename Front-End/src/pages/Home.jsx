import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getTickets } from "../utilities/API.Requests.js";
import TicketCard from "../components/TicketCard.jsx";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

// Missing pagination and filters, by text and state

function Home() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (loading) return;
      setLoading(true);

      try {
        let response = await getTickets();
        setTickets(response);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleClick = (id) => {
    navigate(`/tickets/${id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      <div className="ticket-container">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onClick={() => handleClick(ticket.id)}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default Home;
