import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/home";
import Register from "./pages/Register";
import AdminAuth from "./pages/AdminAuth"

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/userregister" element={<Register />} />
      <Route path="/AdminAuth" element={<AdminAuth/>}/>
    </Routes>
  );
}

export default App;
