import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Register } from "./Register";
import { MainPage } from "./MainPage";
import { EventProvider } from "./components/EventContext";
import PlanBuilder from "./PlanBuilder";

function App() {
  return (
    <EventProvider>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/plan-builder" element={<PlanBuilder />} />
          <Route path="*" element={<Navigate to="/register" />} />
        </Routes>
      </Router>
    </EventProvider>
  );
}

export default App;
