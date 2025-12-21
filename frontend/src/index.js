import React from "react";
import ReactDOM from "react-dom/client"; // Note: '/client'
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
// // src/App.js
// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import HomePage from "./pages/home";
// import Register from "./pages/Register";

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<HomePage />} />
//       <Route path="/register" element={<Register />} />
//     </Routes>
//   );
// }

// export default App;

