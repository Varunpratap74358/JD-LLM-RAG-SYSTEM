import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h1 style={{ fontSize: '1.25rem', color: 'var(--primary)', margin: 0 }}>MiniRAG</h1>
            </div>
            <div className="nav-links">
                <NavLink
                    to="/"
                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                >
                    Query Agent
                </NavLink>
                <NavLink
                    to="/add"
                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                >
                    Add Content
                </NavLink>
            </div>
        </nav>
    );
};

export default Navbar;
