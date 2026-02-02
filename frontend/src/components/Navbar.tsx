import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
    const { isAdmin, logout } = useAuth();

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
                {isAdmin && (
                    <NavLink
                        to="/add"
                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                    >
                        Add Content
                    </NavLink>
                )}
                {isAdmin ? (
                    <button
                        onClick={logout}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem' }}
                    >
                        Logout
                    </button>
                ) : (
                    <NavLink
                        to="/login"
                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                    >
                        Admin
                    </NavLink>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
