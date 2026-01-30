import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import QueryPage from './pages/QueryPage';
import AddContentPage from './pages/AddContentPage';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<QueryPage />} />
          <Route path="/add" element={<AddContentPage />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
