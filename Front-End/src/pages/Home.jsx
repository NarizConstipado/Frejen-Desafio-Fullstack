import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { getTickets } from "../utilities/API.Requests.js";
import TicketCard from "../components/TicketCard.jsx";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

const ITEMS_PER_PAGE = 7;

function Home() {
  const navigate = useNavigate();

  // Tickets Lazy Loading
  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [hasMoreTickets, setHasMoreTickets] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const observerRef = useRef(null);
  const loadMoreRef = useRef(null); // <-- Add this

  const fetchTickets = async () => {
    console.log("Fetching tickets - Page:", page);
    if (loading) return;
    setLoading(true);

    try {
      const response = await getTickets({ page: page, limit: ITEMS_PER_PAGE });
      console.log("Fetched response:", response);
      if (response && response.length > 0) {
        setTickets((prevTickets) => {
          const ticketMap = new Map(
            prevTickets.map((ticket) => [ticket.id, ticket])
          );
          response.forEach((newTicket) => {
            if (!ticketMap.has(newTicket.id)) {
              ticketMap.set(newTicket.id, newTicket);
            }
          });
          return Array.from(ticketMap.values());
        });
        if (response.length === ITEMS_PER_PAGE) {
          setPage((prevPage) => prevPage + 1);
        } else {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !loading && !loadingMore && hasMore) {
          console.log("Intersecting - fetching next page");
          setLoadingMore(true);
          fetchTickets(); // call it directly
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      }
    );

    const currentTarget = loadMoreRef.current;
    if (currentTarget) observer.observe(currentTarget);

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [hasMore, loading, loadingMore]);

  const handleClick = (id) => {
    navigate(`/tickets/${id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      <div className="tickets-container">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onClick={() => handleClick(ticket.id)}
          />
        ))}
        {hasMore && (
          <div
            ref={loadMoreRef}
            style={{ height: "50px", backgroundColor: "transparent" }}
          ></div>
        )}
        {loading && <div>Fetching...</div>}
        {!hasMore && tickets.length > 0 && (
          <div style={{ paddingBottom: "20px" }}>No more tickets to load.</div>
        )}
      </div>
    </motion.div>
  );
}

export default Home;
