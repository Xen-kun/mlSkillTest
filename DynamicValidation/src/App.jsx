import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DynamicForm from "./Pages/Form";
import WelcomePage from "./Pages/WelcomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DynamicForm />} />
        <Route path="/welcome" element={<WelcomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
