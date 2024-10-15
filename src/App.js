import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Addons from './Addons';
import Dashboard from './Dashboard';  // Dashboard component
import { BookingProvider } from './BookingContext';  // BookingProvider from context

function App() {
  return (
    <BookingProvider>
      <Router>
        <Routes>
          {/* Define your routes */}
          <Route path="/" element={<Addons />} />
          {/* Use one route for the Dashboard, and handle success/failure based on query params */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </BookingProvider>
  );
}

export default App;
