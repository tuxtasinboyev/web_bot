import { useState, useEffect } from "react";
import { Home, User } from "lucide-react";
import HomePage from "./OwnerHomePage";
import Profile from "./profile";

export default function UserDashboard() {
    const [active, setActive] = useState("home");
    const [profileData, setProfileData] = useState({
        name: "",
        username: "",
        image: "",
    });

    useEffect(() => {
        if (typeof window !== "undefined" && window.Telegram?.WebApp?.initDataUnsafe?.user) {
            const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
            setProfileData({
                name: tgUser.first_name || "",
                username: tgUser.username || "",
                image: tgUser.photo_url || "https://via.placeholder.com/150",
            });
        } else {
            setProfileData({
                name: "Foydalanuvchi",
                username: "unknown",
                image: "https://via.placeholder.com/150",
            });
        }
    }, []);


    const tabs = [
        { id: "home", label: "Bosh sahifa", icon: <Home size={22} /> },
        { id: "profile", label: "Profil", icon: <User size={22} /> },
    ];

    const renderContent = () => {
        switch (active) {
            case "home":
                return <HomePage />;
            case "profile":
                return <Profile profileData={profileData} setProfileData={setProfileData} />;
            default:
                return <HomePage />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Telegram Web Appda o'zining headeri bor, shuning uchun oddiy title */}
            <header className="bg-white shadow p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-blue-600">IJARA.uz</h1>
                <div className="flex items-center space-x-2">
                    <img src={profileData.image} className="w-10 h-10 rounded-full" />
                    <span className="text-sm font-medium">{profileData.name}</span>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4">
                {renderContent()}
            </main>

            {/* Footer navigation */}
            <footer className="bg-white shadow-t fixed bottom-0 w-full">
                <div className="grid grid-cols-2 gap-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActive(tab.id)}
                            className={`flex flex-col items-center py-3 w-full ${active === tab.id ? "text-blue-600" : "text-gray-600"}`}
                        >
                            {tab.icon}
                            <span className="text-xs mt-1">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </footer>
        </div>
    );
}
