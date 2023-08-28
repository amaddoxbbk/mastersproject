import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Register } from './Register';
import { MainPage } from './MainPage';
import React from 'react';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="*" element={<Navigate to="/register" />} />
      </Routes>
    </Router>
  );
}

export default App;
