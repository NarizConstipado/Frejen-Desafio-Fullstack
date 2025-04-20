import React from "react";
import "../styles/ticket_card.css";
import { formatDate } from "../utilities/utilities";

const TicketCard = ({ ticket, onClick }) => {
  return (
    <div className="card" onClick={onClick}>
      <div className="ticket-body">
        <h3 className="card-title">{ticket.title}</h3>
        <div>
          <p className="card-text">Dep: {ticket.department.title}</p>
          <p className="card-text">Status: {ticket.state.title}</p>
        </div>
        <div>
          <p className="card-detail">
            Updated at: {formatDate(ticket.updatedAt)}
          </p>
          <p className="card-detail">
            Created at: {formatDate(ticket.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
