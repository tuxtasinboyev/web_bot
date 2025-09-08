import { useState } from "react";
import Register from "./pages/Register";
import OwnerDashboard from "./pages/OwnerDashboard";

function App() {
  const [role, setRole] = useState(null);

  // Agar hali role tanlanmagan bo‘lsa → Register ochiladi
  if (!role) {
    return <Register onSuccess={(r) => setRole(r)} />;
  }

  // Uy beruvchi bo‘lsa
  if (role === "owner") {
    return <OwnerDashboard />;
  }

  // Uy qidiruvchi bo‘lsa (hozircha mock)
  if (role === "tenant") {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-xl font-bold text-blue-600">
          🔍 Tenant Dashboard (tez orada qo‘shamiz)
        </h1>
      </div>
    );
  }
}

export default App;
