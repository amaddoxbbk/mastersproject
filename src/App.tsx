import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Register } from "./Register";
import { MainPage } from "./MainPage";
import React from "react";
import FetchData from "./FetchData";

function App() {
  return (
    <>
      <div>
        <h1>Welcome to My App!</h1>
        <FetchData />
      </div>

      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="*" element={<Navigate to="/register" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
