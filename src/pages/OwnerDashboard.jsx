import { useState, useEffect } from "react";
import { Home, ClipboardList, User, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HomePage from "./OwnerHomePage";
import MyHouses from "./MyHouses";
import Profile from "./profile";
import AddHouse from "./OwnerAddHouse";
import axios from "axios";

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState("home");
  const [profileData, setProfileData] = useState({
    name: "",
    username: "",
    phone: "",
    role: "OWNER",
    image: "https://via.placeholder.com/150",
  });
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        // Telegram WebApp user (may be undefined)
        const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;

        // Backend user (may fail if no token)
        let userFromBackend = null;
        if (token) {
          try {
            const res = await axios.get("https://houzing.botify.uz/users/me", {
              headers: { Authorization: `Bearer ${token}` },
            });
            userFromBackend = res.data;
          } catch (err) {
            // agar 401 yoki boshqasi bo'lsa, backendga kira olmadik
            console.warn("Backend /users/me not available or unauthorized:", err?.response?.status);
          }
        }

        // Birlashtirish: backend ustun, telegram fallback
        const merged = {
          name: userFromBackend?.name || tgUser?.first_name || "Foydalanuvchi",
          username: userFromBackend?.username || tgUser?.username || "",
          phone: userFromBackend?.phone || "",
          role: userFromBackend?.role || "OWNER",
          image: (userFromBackend?.imgUrl || userFromBackend?.image) || tgUser?.photo_url || "https://via.placeholder.com/150",
        };

        setProfileData(merged);
      } catch (err) {
        console.error("Profile olishda xato:", err);
        // Agar token yo'q yoki xatolik bo'lsa, fallback to telegram or defaults
        const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
        setProfileData({
          name: tgUser?.first_name || "Foydalanuvchi",
          username: tgUser?.username || "",
          phone: "",
          role: "OWNER",
          image: tgUser?.photo_url || "https://via.placeholder.com/150",
        });

        // agar 401 yoki boshqa sabab bilan loginga qaytarmoqchi bo'lsangiz:
        // navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate]);

  const tabs = [
    { id: "home", label: "Bosh sahifa", icon: <Home size={22} /> },
    { id: "my", label: "Mening uylarim", icon: <ClipboardList size={22} /> },
    { id: "profile", label: "Profil", icon: <User size={22} /> },
    // add button handled separately
  ];

  const handleAddHouse = (newHouse) => {
    setHouses((prev) => [...prev, newHouse]);
    setActive("my");
  };

  const renderContent = () => {
    switch (active) {
      case "home":
        return <HomePage />;
      case "my":
        return <MyHouses houses={houses} setHouses={setHouses} />;
      case "profile":
        return <Profile profileData={profileData} setProfileData={setProfileData} />;
      case "add":
        return <AddHouse onAddHouse={handleAddHouse} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">IJARA.uz</h1>
        <div className="flex items-center space-x-2">
          <img src={profileData.image} alt="profile" className="w-10 h-10 rounded-full object-cover" />
          <span className="text-sm font-medium">{profileData.name}</span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-4">{renderContent()}</main>

      {/* Footer navigation */}
      <footer className="bg-white shadow-t fixed bottom-0 w-full">
        <div className="grid grid-cols-4 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex flex-col items-center py-3 ${active === tab.id ? "text-blue-600" : "text-gray-600"}`}
            >
              {tab.icon}
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          ))}

          <button
            onClick={() => setActive("add")}
            className={`flex flex-col items-center py-3 ${active === "add" ? "text-blue-600" : "text-gray-600"}`}
          >
            <PlusCircle size={22} />
            <span className="text-xs mt-1">Uy qo'shish</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
