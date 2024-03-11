import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import SignInForm from "./pages/SignInForm";

import "./App.css";
import Home from "./pages/home";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignInForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
