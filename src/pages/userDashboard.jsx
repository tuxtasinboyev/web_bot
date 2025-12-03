import axios from "axios";
import { Home, User } from "lucide-react";
import { useEffect, useState } from "react";
import HomePage from "./OwnerHomePage";
import Profile from "./profile";
import { Alert, Snackbar } from "@mui/material";

export default function UserDashboard() {
    const [active, setActive] = useState("home");
    const [profileData, setProfileData] = useState({
        name: "Foydalanuvchi",
        username: "unknown",
        image: "https://via.placeholder.com/150",
    });
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success", // success, error, warning, info
    });

    useEffect(() => {
        const fetchProfileFromBackend = async () => {
            try {
                const response = await axios.get("https://houzing.botify.uz/users/me", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });

                if (response.data) {
                    setProfileData({
                        name: response.data.name || "Foydalanuvchi",
                        username: response.data.username || "unknown",
                        image: response.data.image || "https://via.placeholder.com/150",
                    });
                    setSnackbar({
                        open: true,
                        message: "Profil muvaffaqiyatli yuklandi",
                        severity: "success",
                    });
                }
            } catch (error) {
                console.error("Backenddan profilni olishda xatolik:", error);
                setSnackbar({
                    open: true,
                    message: "Profilni yuklashda xatolik yuz berdi",
                    severity: "error",
                });
            } finally {
                setLoadingProfile(false);
            }
        };

        // Agar Telegram WebApp ma’lumotlari mavjud bo‘lsa, ularni ustuvor qilish
        if (typeof window !== "undefined" && window.Telegram?.WebApp?.initDataUnsafe?.user) {
            const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
            setProfileData({
                name: tgUser.first_name || "Foydalanuvchi",
                username: tgUser.username || "unknown",
                image: tgUser.photo_url || "https://via.placeholder.com/150",
            });
            setLoadingProfile(false);
            setSnackbar({
                open: true,
                message: "Profil muvaffaqiyatli yuklandi",
                severity: "success",
            });
        } else {
            fetchProfileFromBackend();
        }
    }, []);

    const tabs = [
        { id: "home", icon: <Home size={22} /> },
        { id: "profile", icon: <User size={22} /> },
    ];

    const renderContent = () => {
        switch (active) {
            case "home":
                return <HomePage />;
            case "profile":
                return (
                    <Profile
                        profileData={profileData}
                        setProfileData={setProfileData}
                        loadingProfile={loadingProfile}
                    />
                );
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
                    {loadingProfile ? (
                        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                    ) : (
                        <img
                            src={profileData.image}
                            alt={profileData.name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    )}
                    <span className="text-sm font-medium">
                        {loadingProfile ? "Yuklanmoqda..." : profileData.name}
                    </span>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto p-4">{renderContent()}</main>

            {/* Footer navigation */}
            <footer className="bg-white shadow-t fixed bottom-0 w-full">
                <div className="grid grid-cols-2 gap-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActive(tab.id)}
                            className={`flex flex-col items-center py-3 w-full ${active === tab.id ? "text-blue-600" : "text-gray-600"
                                }`}
                        >
                            {tab.icon}
                        </button>
                    ))}
                </div>
            </footer>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
}
