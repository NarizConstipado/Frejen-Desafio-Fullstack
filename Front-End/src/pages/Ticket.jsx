import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getTicket } from "../utilities/API.Requests.js";
import { formatDate } from "../utilities/utilities";

import "../styles/ticket.css";

function Ticket() {
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState({});

  const getTicketData = async () => {
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

  useEffect(() => {
    getTicketData();
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
          <div id="ticketBody">
            <div>
              <p>Description:</p>
              <p>{ticket?.description}</p>
            </div>
            <div>
              <p>State: {ticket?.state?.title}</p>
              <p>Department: {ticket?.department?.title}</p>
            </div>
            <p>
              Created at: {formatDate(ticket?.createdAt)} by:{" "}
              {ticket?.createdBy?.name}
            </p>
            <p>
              Updated at: {formatDate(ticket?.updatedAt)} by:{" "}
              {ticket?.updatedBy?.name}
            </p>
            {ticket.observacoes && (
              <div>
                <p>Observations:</p>
                <p>{ticket?.observacoes}</p>
              </div>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}

export default Ticket;
