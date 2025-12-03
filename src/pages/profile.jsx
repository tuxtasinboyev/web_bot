import { useState, useEffect } from "react";
import { Camera, Save } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";

export default function Profile({ profileData, setProfileData }) {
    const [isEditing, setIsEditing] = useState(false);

    // inputlar uchun local state
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        role: "OWNER",
        image: "",
    });

    // rasm uchun
    const [tempImage, setTempImage] = useState(null);
    const [tempImageFile, setTempImageFile] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success", // success, error, warning, info
    });

    const navigate = useNavigate();

    // profileData kelganda local state-ni to'ldirish
    useEffect(() => {
        if (profileData) {
            setFormData({
                name: profileData.name || "",
                phone: profileData.phone || "",
                role: profileData.role || "OWNER",
                image: profileData.imgUrl || profileData.image || "",
            });
        }
    }, [profileData]);

    // inputlarni o'zgartirish
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
    };

    // profil rasmini o'zgartirish
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setTempImage(URL.createObjectURL(file));
            setTempImageFile(file);
        }
    };

    // profilni saqlash
    const handleSaveProfile = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                // Agar token yo'q bo'lsa, faqat local state yangilang (telegram fallback)
                setProfileData((prev) => ({
                    ...prev,
                    name: formData.name,
                    phone: formData.phone,
                    role: formData.role,
                    imgUrl: tempImage || formData.image,
                    image: tempImage || formData.image, // qo‘shildi
                }));
                setIsEditing(false);
                setTempImage(null);
                setTempImageFile(null);
                setSnackbar({
                    open: true,
                    message: "Profil lokalda yangilandi (serverga token yo'q)",
                    severity: "success",
                });
                return;
            }

            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("phone", formData.phone);
            formDataToSend.append("role", formData.role);
            if (tempImageFile) formDataToSend.append("image", tempImageFile);

            const response = await axios.patch(
                "https://houzing.botify.uz/users/me",
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const updatedUser = response.data;

            // propsdagini ham yangilab qo‘yish
            setProfileData((prev) => ({
                ...prev,
                name: updatedUser.name || formData.name,
                phone: updatedUser.phone || formData.phone,
                role: updatedUser.role || formData.role,
                imgUrl: updatedUser.imgUrl || tempImage || formData.image,
                image: updatedUser.imgUrl || tempImage || formData.image, // qo‘shildi
            }));

            // local state-ni ham yangilash
            setFormData((p) => ({
                ...p,
                name: updatedUser.name || formData.name,
                phone: updatedUser.phone || formData.phone,
                role: updatedUser.role || formData.role,
                image: updatedUser.imgUrl || tempImage || formData.image,
            }));

            setIsEditing(false);
            setTempImage(null);
            setTempImageFile(null);
            setSnackbar({
                open: true,
                message: "Profil muvaffaqiyatli yangilandi!",
                severity: "success",
            });
        } catch (error) {
            console.error("Profile save error:", error);
            setSnackbar({
                open: true,
                message: "Profil saqlanmadi",
                severity: "error",
            });
        }
    };


    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Profil</h2>
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center mb-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                            {tempImage || formData.image ? (
                                <img
                                    src={tempImage || formData.image}
                                    alt="Profil rasmi"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <span className="text-2xl text-blue-500">{formData.name ? formData.name.charAt(0) : "?"}</span>
                            )}
                        </div>

                        <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
                            <Camera size={16} />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                disabled={!isEditing}
                            />
                        </label>
                    </div>

                    <div className="ml-6">
                        <h3 className="text-xl font-semibold">{formData.name}</h3>
                        <p className="text-sm text-gray-500">{formData.phone}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ism</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        >
                            <option value="OWNER">OWNER</option>
                            <option value="TENANT">TENANT</option>
                        </select>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setTempImage(null);
                                    setTempImageFile(null);
                                    // reset form to props
                                    setFormData({
                                        name: profileData.name || "",
                                        phone: profileData.phone || "",
                                        role: profileData.role || "OWNER",
                                        image: profileData.imgUrl || profileData.image || "",
                                    });
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Bekor qilish
                            </button>
                            <button
                                onClick={handleSaveProfile}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                            >
                                <Save size={18} className="mr-2" />
                                Saqlash
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Tahrirlash
                        </button>
                    )}
                </div>
            </div>
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
