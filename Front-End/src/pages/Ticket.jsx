import { useState, useEffect } from "react";
import { BrowserRouter, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getTicket } from "../utilities/API.Requests.js";

import "../styles/ticket.css";

function Ticket() {
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (loading) return;
      setLoading(true);

      try {
        let response = await getTicket(id);
        setTicket(response);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <motion.div
      id="ticketRoot"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <h2>{ticket?.title}</h2>
          <p>{ticket?.description}</p>
          <p>{ticket?.observacao}</p>
          <p>{ticket?.department?.title}</p>
          <p>{ticket?.state?.title}</p>
          <p>{ticket?.createdAt}</p>
          <p>{ticket?.updatedAt}</p>
          <p>{ticket?.createdBy?.name}</p>
          <p>{ticket?.updatedBy?.name}</p>
        </>
      )}
    </motion.div>
  );
}

export default Ticket;
