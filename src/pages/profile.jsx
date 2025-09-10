import { useState } from "react";
import { Camera, Save } from "lucide-react";

export default function Profile({ profileData, setProfileData }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempImage, setTempImage] = useState(null);


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
            const imageUrl = URL.createObjectURL(file);
            setTempImage(imageUrl); // vaqtincha rasm
        }
    };


    // Profilni saqlash
    const handleSaveProfile = () => {
        setIsEditing(false);
        setProfileData((prev) => ({
            ...prev,
            image: tempImage || prev.image
        }));
        console.log("Profil saqlandi:", { ...profileData, image: tempImage || profileData.image });

        // Agar serverga yuborish kerak bo'lsa, shu yerda fetch/axios ishlatish mumkin
    };


    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Profil</h2>

            <div className="bg-white p-6 rounded-lg shadow">
                {/* Profil rasmi va ism */}
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
                                    {profileData.name.charAt(0)}
                                </span>
                            )}
                        </div>


                        {/* Rasm yuklash */}
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
                        {/* Email endi ko‘rinmaydi */}
                    </div>
                </div>

                {/* Inputlar */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ism
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={profileData.name}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Telefon
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        />
                    </div>

                    {/* Yangi qo'shilgan role input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                        </label>
                        <select
                            name="role"
                            value={profileData.role}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        >
                            <option value="admin">OWNER</option>
                            <option value="moderator">TENANT</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bio
                        </label>
                        <textarea
                            name="bio"
                            value={profileData.bio}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        />
                    </div>
                </div>

                {/* Tahrirlash / Saqlash tugmalari */}
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
