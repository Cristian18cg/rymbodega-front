import Usuarios from "./usuarios";
import Header from "./header";
import "../../styles/styles.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const sistemas = () => {
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route path="/usuarios" element={<Usuarios />} />
        </Routes>
      </Router>
    </div>
  );
};

export default sistemas;
