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
    image: "https://via.placeholder.com/150",
  });
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Telegram WebApp ma'lumotlarini olish
        const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
        if (tgUser) {
          setProfileData({
            name: tgUser.first_name || "",
            username: tgUser.username || "",
            image: tgUser.photo_url || "https://via.placeholder.com/150",
          });
        } else {
          // Backenddan profile ma'lumotlarini olish
          const res = await axios.get("https://houzing.botify.uz/users/me", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
          });

          // Backenddan user obyekti mavjudligini tekshirish
          const user = res.data
          if (!user) throw new Error("User data mavjud emas");

          setProfileData({
            name: user.name || "Test User",
            username: user.username || "testuser",
            image: user.imgUrl || "https://via.placeholder.com/150",
          });
        }
      } catch (err) {
        console.error("Profile olishda xato:", err);

        // 401 Unauthorized bo‘lsa, login sahifasiga yo‘naltirish
        if (err.response?.status === 404) {
          alert("Siz tizimga kirishingiz kerak!");
          navigate("/login");
        } else {
          // Boshqa xatolar uchun fallback
          setProfileData({
            name: "Test User",
            username: "testuser",
            image: "https://via.placeholder.com/150",
          });
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const tabs = [
    { id: "home", label: "Bosh sahifa", icon: <Home size={22} /> },
    { id: "my", label: "Mening uylarim", icon: <ClipboardList size={22} /> },
    { id: "profile", label: "Profil", icon: <User size={22} /> },
  ];

  const handleAddHouse = (newHouse) => {
    setHouses([...houses, newHouse]);
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
          <img src={profileData.image} className="w-10 h-10 rounded-full" />
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
