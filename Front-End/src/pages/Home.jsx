import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { getTickets, getStates } from "../utilities/API.Requests.js";
import TicketCard from "../components/TicketCard.jsx";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

const ITEMS_PER_PAGE = 7;

function Home() {
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");
  const [selectedStates, setSelectedStates] = useState([]);

  const [tickets, setTickets] = useState([]);
  const [states, setStates] = useState([]);
  // Tickets Lazy Loading variables
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef(null);

  const getInfo = async () => {
    if (loading) {
      return;
    }
    setLoading(true);

    try {
      const statesResponse = await getStates();
      setStates(statesResponse);
      const ticketsResponse = await getTickets({
        page: page,
        limit: ITEMS_PER_PAGE,
      });
      if (ticketsResponse && ticketsResponse.length > 0) {
        setTickets((prevTickets) => {
          const ticketMap = new Map(
            prevTickets.map((ticket) => [ticket.id, ticket])
          );
          ticketsResponse.forEach((newTicket) => {
            if (!ticketMap.has(newTicket.id)) {
              ticketMap.set(newTicket.id, newTicket);
            }
          });
          return Array.from(ticketMap.values());
        });
        if (ticketsResponse.length === ITEMS_PER_PAGE) {
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
          setLoadingMore(true);
          getInfo();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      }
    );

    const currentTarget = loadMoreRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, loadingMore]);

  const handleClick = (id) => {
    navigate(`/tickets/${id}`);
  };

  const handleSearch = async () => {
    setLoading(true);
    setPage(1);
    setHasMore(true);

    try {
      const ticketsResponse = await getTickets({
        page: 1,
        limit: ITEMS_PER_PAGE,
        search: searchInput.trim(),
        id_state: selectedStates,
      });

      setTickets(ticketsResponse || []);
      if (ticketsResponse.length === ITEMS_PER_PAGE) {
        setPage(2);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Search error:", err);
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
      <div id="search-container">
        <div id="search-bar">
          <input
            id="search-text"
            type="text"
            placeholder="Search..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button onClick={() => handleSearch()}>Search</button>
        </div>

        <div id="search-states">
          {states.map((state) => (
            <label key={state.id}>
              <input
                type="checkbox"
                value={state.id}
                checked={selectedStates.includes(state.id)}
                onChange={(e) => {
                  const checked = e.target.checked;
                  const value = parseInt(e.target.value);
                  setSelectedStates((prev) =>
                    checked
                      ? [...prev, value]
                      : prev.filter((id) => id !== value)
                  );
                }}
              />
              {state.title}
            </label>
          ))}
        </div>
      </div>
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
