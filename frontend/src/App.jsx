import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/home";
import Register from "./pages/Register";
import AdminAuth from "./pages/AdminAuth";
import AfterLoginHome from "./pages/AfterLoginHome";
import AdminDashboard from "./pages/AdminDashboard";
import UserJoin from "./pages/userJoin"; // make sure the import name is uppercase

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/userregister" element={<Register />} />
      <Route path="/AdminAuth" element={<AdminAuth />} />
      <Route path="/afterhomelogin" element={<AfterLoginHome />} />
      <Route path="/AdminDashboard" element={<AdminDashboard />} />
      <Route path="/userJoin" element={<UserJoin />} /> 
    </Routes>
  );
}

export default App;
