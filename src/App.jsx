import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";
import OwnerDashboard from "./pages/OwnerDashboard";
import UserDashboard from "./pages/userDashboard";
import AdminDashboard from "./pages/adminDashboard";

function App() {
  const [user, setUser] = useState(null);
  const urlPath = user ? user.role.toLowerCase() : 'login';

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={!user ? <Navigate to="/login" /> : <Navigate to={`/${urlPath}`} />}
        />
        <Route path="/login" element={!user ? <Login onSuccess={setUser} /> : <Navigate to={`/${urlPath}`} />} />
        <Route path="/register" element={!user ? <Register onSuccess={(r) => setUser({ role: r })} /> : <Navigate to={`/${urlPath}`} />} />
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/tenant" element={<UserDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<div className="flex items-center justify-center h-screen"><h1 className="text-xl font-bold text-red-600">❌ 404 - Sahifa topilmadi</h1></div>} />
      </Routes>
    </div>
  );
}

export default App;
