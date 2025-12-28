import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/home";
import Register from "./pages/Register";
import AdminAuth from "./pages/AdminAuth";
import AfterLoginHome from "./pages/AfterLoginHome";
import AdminDashboard from "./pages/AdminDashboard";
import UserJoin from "./pages/userJoin"; 
import QueuePos from "./pages/QueuePos";
import ViewQueue from "./pages/ViewQueue";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/userregister" element={<Register />} />
      <Route path="/adminauth" element={<AdminAuth />} />
      <Route path="/afterhomelogin" element={<AfterLoginHome />} />
      <Route path="/admindashboard" element={<AdminDashboard />} />
      <Route path="/userjoin" element={<UserJoin />} />
      <Route path="/queuepos" element={<QueuePos />} />
      <Route path="/viewqueue" element={<ViewQueue />} />

    </Routes>
  );
}

export default App;
