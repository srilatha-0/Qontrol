import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/home";
import Register from "./pages/Register";
import AdminAuth from "./pages/AdminAuth";
import AfterLoginHome from "./pages/AfterLoginHome";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/userregister" element={<Register />} />
      <Route path="/AdminAuth" element={<AdminAuth />} />
      <Route path="/afterhomelogin" element={<AfterLoginHome />} />
      <Route path="/AdminDashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
