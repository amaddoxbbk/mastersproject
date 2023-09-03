import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Register } from "./Register";
import { MainPage } from "./MainPage";
import { EventProvider } from "./components/EventContext";

function App() {
  return (
    <EventProvider>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="*" element={<Navigate to="/register" />} />
        </Routes>
      </Router>
    </EventProvider>
  );
}

export default App;
