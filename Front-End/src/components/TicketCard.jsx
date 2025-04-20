import React from "react";
import "../styles/ticket_card.css";

const TicketCard = ({ ticket, onClick }) => {
  function formatDate(isoDateString) {
    const date = new Date(isoDateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}, ${day}/${month}`;
  }

  return (
    <div className="card" onClick={onClick}>
      <div className="ticket-body">
        <h3 className="card-title">{ticket.title}</h3>
        <div>
          <p className="card-text">{ticket.department.title}</p>
          <p className="card-text">Status: {ticket.state.title}</p>
        </div>
        <div>
          <p className="card-detail">
            Created at: {formatDate(ticket.createdAt)}
          </p>
          <p className="card-detail">
            Updated at: {formatDate(ticket.updatedAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
