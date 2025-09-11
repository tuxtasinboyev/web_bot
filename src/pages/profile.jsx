import { useState } from "react";
import { Camera, Save } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Profile({ profileData, setProfileData }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempImage, setTempImage] = useState(null);
    const [tempImageFile, setTempImageFile] = useState(null); // asl File object

    const navigate = useNavigate();

    // Inputlarni o'zgartirish
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData({
            ...profileData,
            [name]: value,
        });
    };

    // Profil rasmni o'zgartirish
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setTempImage(URL.createObjectURL(file)); // frontendda vaqtincha ko‘rsatish
            setTempImageFile(file); // backend-ga yuborish uchun asl File
        }
    };

    // Profilni saqlash
    const handleSaveProfile = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                navigate('/login');
                return;
            }

            const formData = new FormData();

            if (profileData.name) formData.append("name", profileData.name);
            if (profileData.phone) formData.append("phone", profileData.phone);
            if (profileData.password) formData.append("password", profileData.password);
            if (profileData.role) formData.append("role", profileData.role);
            if (tempImageFile) formData.append("image", tempImageFile);

            const response = await axios.patch(
                "http://localhost:3000/users/me",
                formData,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const updatedUser = response.data;

            setProfileData({
                ...profileData,
                name: updatedUser.name || profileData.name,
                phone: updatedUser.phone || profileData.phone,
                role: updatedUser.role || profileData.role,
                image: updatedUser.imgUrl || profileData.image
            });

            setIsEditing(false);
            setTempImage(null);
            setTempImageFile(null);

            alert("Profil muvaffaqiyatli yangilandi!");
        } catch (error) {
            console.error(error);
            alert("Profil saqlanmadi");
        }
    };



    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Profil</h2>
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center mb-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                            {tempImage || profileData.image ? (
                                <img
                                    src={tempImage || profileData.image}
                                    alt="Profil rasmi"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <span className="text-2xl text-blue-500">
                                    {profileData.name ? profileData.name.charAt(0) : 'nimagap'}
                                </span>
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
                        <h3 className="text-xl font-semibold">{profileData.name}</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ism</label>
                        <input
                            type="text"
                            name="name"
                            value={profileData.name || ""} // default bo‘sh string
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
                            value={profileData.phone || ""} // default bo‘sh string
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            name="role"
                            value={profileData.role || "admin"} // default admin
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
                                onClick={() => setIsEditing(false)}
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
        </div>
    );
}
