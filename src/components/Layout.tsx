import { Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/", label: "HOME" },
  { to: "/announcement", label: "UPDATES" },
  { to: "/tools", label: "TOOLS" },
  { to: "/winners", label: "WINNERS" },
  { to: "/archives", label: "ARCHIVES" },
];

export function Layout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="top-nav">
        <NavLink className="nav-brand" to="/" onClick={() => setIsOpen(false)}>
          CTF_DASHBOARD
        </NavLink>

        <button
          className="nav-toggle"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className={`nav-links ${isOpen ? "show" : ""}`}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? "active" : undefined)}
              onClick={() => setIsOpen(false)}
              end={item.to === "/"}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <main className="wrapper">
        <Outlet />
      </main>

      <footer className="footer">
        <span>Copyright (C) 2026 CSED, National Institute of Technology Calicut</span>
      </footer>
    </>
  );
}
