import { useState } from "react";
import {
  Home,
  ClipboardList,
  User,
  PlusCircle,
} from "lucide-react";

export default function OwnerDashboard() {
  const [active, setActive] = useState("home");

  const tabs = [
    { id: "home", label: "Bosh sahifa", icon: <Home size={22} /> },
    { id: "my", label: "Mening uylarim", icon: <ClipboardList size={22} /> },
    { id: "profile", label: "Profil", icon: <User size={22} /> },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {active === "home" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">📌 Barcha uylar</h2>
            <div className="grid gap-4">
              {[1, 2, 3].map((id) => (
                <div
                  key={id}
                  className="p-4 bg-white rounded-xl shadow flex items-center gap-4"
                >
                  <img
                    src={`https://picsum.photos/seed/house${id}/100/80`}
                    alt="house"
                    className="rounded-lg w-24 h-20 object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">2 xonali kvartira</h3>
                    <p className="text-sm text-gray-500">Toshkent, Yunusobod</p>
                    <p className="text-blue-600 font-bold">3 000 000 so‘m / oy</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === "my" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">🏠 Mening uylarim</h2>
            <p className="text-gray-500">Hali e’lon qo‘shilmagan.</p>
          </div>
        )}

        {active === "profile" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">👤 Profil</h2>
            <div className="bg-white shadow rounded-xl p-4 space-y-2">
              <p>
                <span className="font-medium">Ism: </span> Ali Valiyev
              </p>
              <p>
                <span className="font-medium">Telefon: </span> +998901234567
              </p>
              <p>
                <span className="font-medium">Rol: </span> Uy beruvchi
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Add House Button */}
      {active === "my" && (
        <button className="fixed bottom-20 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition">
          <PlusCircle size={28} />
        </button>
      )}

      {/* Bottom Nav */}
      <div className="flex justify-around bg-white border-t py-2 shadow-lg rounded-t-2xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${
              active === tab.id
                ? "text-blue-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            {tab.icon}
            <span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
