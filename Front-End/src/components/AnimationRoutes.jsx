// src/components/AntimationRoutes.jsx
import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import RequireAuth from "./RequireAuth";
import NavigationHeader from "../components/NavBar";
import Home from "../pages/Home";
import CreateTickets from "../pages/CreateTickets";
import Ticket from "../pages/Ticket";
import Perfil from "../pages/Profile";
import Login from "../pages/Login";
import NotFound from "../components/404NotFound";

function AntimationRoutes() {
  const location = useLocation();
  const isLogin = location.pathname.startsWith("/login");

  return (
    <>
      {!isLogin && <NavigationHeader />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RequireAuth />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Perfil />} />
            <Route path="/tickets/:id" element={<Ticket />} />
            {/*
            <Route path="/create_tickets" element={<CreateTickets />} />
            */}
          </Route>
          {/* 404 route for general site */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default AntimationRoutes;
