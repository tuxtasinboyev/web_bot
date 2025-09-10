import { useState } from "react";
import {
    Phone,
    MessageCircle,
    MapPin,
    Bed,
    X,
    ChevronLeft,
    ChevronRight,
    Heart,
    Share,
    Maximize,
    Edit,
    Trash2,
    Plus,
    Save,
    Camera,
    Upload,
} from "lucide-react";

export default function MyHouses() {
    const [selectedHouse, setSelectedHouse] = useState(null);
    const [editingHouse, setEditingHouse] = useState(null);
    const [deletingHouse, setDeletingHouse] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isAddingHouse, setIsAddingHouse] = useState(false);
    const [newImages, setNewImages] = useState([]);
    const [newHouse, setNewHouse] = useState({
        title: "",
        description: "",
        address: "",
        price: "",
        rooms: "",
        area: "",
        floor: "",
        totalFloors: "",
        category: "",
        amenities: [],
        images: [],
    });

    // Faqat sizning uylaringiz
    const [myHouses, setMyHouses] = useState([
        {
            id: 1,
            title: "Yunusobodda yangi kvartira",
            description: "Yunusobod tumanidagi yangi qurilgan binoda 4 xonali kvartira. Binoda lift, video kuzatuv tizimi mavjud. Yaqinida maktab, bog'cha va supermarketlar joylashgan.",
            address: "Toshkent, Yunusobod tumani, Farobiy ko'chasi 25",
            price: 250000,
            rooms: 4,
            area: 120,
            floor: 5,
            totalFloors: 9,
            images: [
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            ],
            category: "Kvartira",
            amenities: ["Lift", "Video kuzatuv", "Konditsioner", "Mebellar", "Internet"],
            owner: {
                name: "Aliyev Sanjar",
                phone: "+998901234567",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
                joinedDate: "2023-yil, Yanvar"
            },

        },
        {
            id: 2,
            title: "Chilonzorda oilaviy uy",
            description: "Chilonzor tumanidagi hovli va bog'liq oilaviy uy. Hovlida mevali daraxtlar, gulzor va avtomobil uchun joy mavjud. Uy yangi ta'mirlangan.",
            address: "Toshkent, Chilonzor tumani, Bog'i Shamol ko'chasi 42",
            price: 350000,
            rooms: 6,
            area: 200,
            images: [
                "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            ],
            category: "Hovli",
            amenities: ["Hovli", "Garaj", "Bog'", "Hammom", "Oshxona jihozlari"],
            owner: {
                name: "Aliyev Sanjar",
                phone: "+998901234567",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
                joinedDate: "2023-yil, Yanvar"
            },
        }
    ]);

    const openModal = (house) => {
        setSelectedHouse(house);
        setActiveImageIndex(0);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedHouse(null);
        document.body.style.overflow = 'auto';
    };

    const openEditModal = (house) => {
        setEditingHouse({ ...house });
        setIsEditModalOpen(true);
        document.body.style.overflow = 'hidden';
    };


    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingHouse(null);
        setNewImages([]);
        document.body.style.overflow = 'auto';
    };

    const openDeleteModal = (house) => {
        setDeletingHouse(house);
        setIsDeleteModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingHouse(null);
        document.body.style.overflow = 'auto';
    };

    const openImageModal = () => {
        setIsImageModalOpen(true);
    };

    const closeImageModal = () => {
        setIsImageModalOpen(false);
    };

    const nextImage = () => {
        const currentHouse = isAddingHouse ? newHouse : selectedHouse;
        if (currentHouse && currentHouse.images.length > 0) {
            setActiveImageIndex((prevIndex) =>
                prevIndex === currentHouse.images.length - 1 ? 0 : prevIndex + 1
            );
        }
    };

    const prevImage = () => {
        const currentHouse = isAddingHouse ? newHouse : selectedHouse;
        if (currentHouse && currentHouse.images.length > 0) {
            setActiveImageIndex((prevIndex) =>
                prevIndex === 0 ? currentHouse.images.length - 1 : prevIndex - 1
            );
        }
    };


    const handleEditHouse = (e) => {
        const { name, value } = e.target;
        setEditingHouse({
            ...editingHouse,
            [name]: value
        });
    };

    const handleSaveEdit = () => {
        // Bu yerda uyni yangilash logikasi bo'ladi
        const updatedHouses = myHouses.map(house =>
            house.id === editingHouse.id ? editingHouse : house
        );
        setMyHouses(updatedHouses);
        closeEditModal();
        closeModal();
    };

    const handleDeleteHouse = () => {
        // Bu yerda uyni o'chirish logikasi bo'ladi
        const updatedHouses = myHouses.filter(house => house.id !== deletingHouse.id);
        setMyHouses(updatedHouses);
        closeDeleteModal();
        closeModal();
    };

    const handleAddHouse = () => {
        setIsAddingHouse(true);
        // Bu yerda yangi uy qo'shish logikasi bo'ladi
    };
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImageUrls = files.map(file => URL.createObjectURL(file));

        setNewImages(prev => [...prev, ...newImageUrls]);
        setNewHouse(prev => ({
            ...prev,
            images: [...prev.images, ...newImageUrls]
        }));
    };


    const removeImage = (index, isNew = false) => {
        if (isNew) {
            const updatedImages = [...newImages];
            updatedImages.splice(index, 1);
            setNewImages(updatedImages);

            const updatedNewHouseImages = [...newHouse.images];
            updatedNewHouseImages.splice(index, 1);
            setNewHouse({ ...newHouse, images: updatedNewHouseImages });
        } else {
            const updatedHouse = { ...editingHouse };
            updatedHouse.images.splice(index, 1);
            setEditingHouse(updatedHouse);
        }
    };

    const openAddHouseModal = () => {
        setIsAddingHouse(true);
        setNewHouse({
            title: "",
            description: "",
            address: "",
            price: "",
            rooms: "",
            area: "",
            floor: "",
            totalFloors: "",
            category: "",
            amenities: [],
            images: [],
        });
        document.body.style.overflow = "hidden";
    };

    const closeAddHouseModal = () => {
        setIsAddingHouse(false);
        setNewHouse({
            title: "",
            description: "",
            address: "",
            price:"",
            rooms:"",
            area: "",
            floor: "",
            totalFloors: "",
            category: "",
            amenities: [],
            images: [],
        });
        document.body.style.overflow = "auto";
    };

    const handleAddHouseSave = () => {
        // Malumotlar to'liq bo'lishini tekshirish
        if (
            !newHouse.title ||
            !newHouse.price ||
            !newHouse.rooms ||
            !newHouse.area ||
            !newHouse.address ||
            !newHouse.category
        ) {
            alert("Iltimos, barcha maydonlarni to'ldiring!");
            return;
        }

        const newHouseEntry = {
            ...newHouse,
            id: Date.now(),
        };
        setMyHouses([newHouseEntry, ...myHouses]);
        closeAddHouseModal();
    };

    const handleNewHouseChange = (e) => {
        const { name, value } = e.target;
        setNewHouse({ ...newHouse, [name]: value });
    };


    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Mening Uylarim</h1>
                <button
                    onClick={openAddHouseModal}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                >
                    <Plus size={20} className="mr-2" />
                    Yangi Uy Qo'shish
                </button>
            </div>

            {myHouses.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Plus size={40} className="text-gray-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Hali hech qanday uy qo'shmagansiz</h2>
                    <p className="text-gray-500 mb-4">Birinchi uyingizni qo'shish uchun quyidagi tugmadan foydalaning</p>
                    <button
                        onClick={handleAddHouse}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center mx-auto"
                    >
                        <Plus size={20} className="mr-2" />
                        Yangi Uy Qo'shish
                    </button>
                </div>
            ) : (
                <>
                    {/* Uylar ro'yxati */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myHouses.map((house) => (
                            <div
                                key={house.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => openModal(house)}
                            >
                                {/* Uy rasmi */}
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={house.images[0]}
                                        alt={house.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-medium px-2.5 py-0.5 rounded">
                                        {house.category}
                                    </div>
                                </div>

                                {/* Uy ma'lumotlari */}
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-lg text-gray-800">{house.title}</h3>
                                        <div className="text-lg font-bold text-blue-600">
                                            ${house.price.toLocaleString()}
                                        </div>
                                    </div>

                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{house.description}</p>

                                    <div className="flex items-center text-sm text-gray-500 mb-3">
                                        <MapPin size={14} className="mr-1" />
                                        <span className="truncate">{house.address}</span>
                                    </div>

                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="flex items-center">
                                                <Bed size={14} className="mr-1 text-gray-500" />
                                                <span className="text-sm">{house.rooms} xona</span>
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-500">{house.area} m²</span>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Asosiy modal oynasi */}
                    {isModalOpen && selectedHouse && (
                        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-4 border-b">
                                    <h2 className="text-xl font-bold">{selectedHouse.title}</h2>
                                    <button
                                        onClick={closeModal}
                                        className="p-1 rounded-full hover:bg-gray-200"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Rasmlar karuseli */}
                                <div className="relative">
                                    <div className="h-80 overflow-hidden">
                                        <img
                                            src={selectedHouse.images[activeImageIndex]}
                                            alt={selectedHouse.title}
                                            className="w-full h-full object-cover cursor-pointer"
                                            onClick={openImageModal}
                                        />
                                        <button
                                            className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                                            onClick={openImageModal}
                                        >
                                            <Maximize size={18} />
                                        </button>
                                    </div>

                                    {selectedHouse.images.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                                            >
                                                <ChevronLeft size={24} />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                                            >
                                                <ChevronRight size={24} />
                                            </button>
                                        </>
                                    )}

                                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                                        {selectedHouse.images.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setActiveImageIndex(index)}
                                                className={`w-2 h-2 rounded-full ${index === activeImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-800">{selectedHouse.title}</h3>
                                            <p className="text-blue-600 text-xl font-semibold">${selectedHouse.price.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="flex items-center">
                                            <Bed size={18} className="mr-2 text-gray-500" />
                                            <span>{selectedHouse.rooms} xona</span>
                                        </div>
                                        <div className="flex items-center">
                                            <MapPin size={18} className="mr-2 text-gray-500" />
                                            <span>{selectedHouse.area} m²</span>
                                        </div>
                                        {selectedHouse.floor && (
                                            <div className="flex items-center">
                                                <span className="mr-2 text-gray-500">📍</span>
                                                <span>{selectedHouse.floor}/{selectedHouse.totalFloors} qavat</span>
                                            </div>
                                        )}
                                        <div className="flex items-center">
                                            <span className="mr-2 text-gray-500">🏠</span>
                                            <span>{selectedHouse.category}</span>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <h4 className="font-semibold mb-2">Tavsif</h4>
                                        <p className="text-gray-700">{selectedHouse.description}</p>
                                    </div>

                                    <div className="mb-6">
                                        <h4 className="font-semibold mb-2">Qulayliklar</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedHouse.amenities.map((amenity, index) => (
                                                <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                    {amenity}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <h4 className="font-semibold mb-2">Manzil</h4>
                                        <p className="text-gray-700 mb-2">{selectedHouse.address}</p>

                                        {/* Google Maps iframe */}
                                        <div className="mt-4 h-64 rounded-lg overflow-hidden">
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                frameBorder="0"
                                                style={{ border: 0 }}
                                                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${selectedHouse.address},&zoom=15`}
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    </div>

                                    {/* Tahrirlash va o'chirish tugmalari */}
                                    <div className="flex justify-between border-t pt-4">
                                        <button
                                            onClick={() => openEditModal(selectedHouse)}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                                        >
                                            <Edit size={18} className="mr-2" />
                                            Tahrirlash
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(selectedHouse)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
                                        >
                                            <Trash2 size={18} className="mr-2" />
                                            O'chirish
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tahrirlash modal oynasi */}
                    {isEditModalOpen && editingHouse && (
                        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-4 border-b">
                                    <h2 className="text-xl font-bold">Uyni Tahrirlash</h2>
                                    <button
                                        onClick={closeEditModal}
                                        className="p-1 rounded-full hover:bg-gray-200"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Uy nomi
                                            </label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={editingHouse.title}
                                                onChange={handleEditHouse}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Narxi ($)
                                            </label>
                                            <input
                                                type="number"
                                                name="price"
                                                value={editingHouse.price}
                                                onChange={handleEditHouse}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Xonalar soni
                                            </label>
                                            <input
                                                type="number"
                                                name="rooms"
                                                value={editingHouse.rooms}
                                                onChange={handleEditHouse}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Maydoni (m²)
                                            </label>
                                            <input
                                                type="number"
                                                name="area"
                                                value={editingHouse.area}
                                                onChange={handleEditHouse}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Manzil
                                            </label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={editingHouse.address}
                                                onChange={handleEditHouse}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tavsif
                                        </label>
                                        <textarea
                                            name="description"
                                            value={editingHouse.description}
                                            onChange={handleEditHouse}
                                            rows="4"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Rasmlar
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                            {/* Mavjud rasmlar */}
                                            {editingHouse.images.map((image, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        src={image}
                                                        alt={`Rasm ${index + 1}`}
                                                        className="w-full h-24 object-cover rounded-md"
                                                    />
                                                    <button
                                                        onClick={() => removeImage(index, false)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}

                                            {/* Yangi rasmlar */}
                                            {newImages.map((image, index) => (
                                                <div key={`new-${index}`} className="relative">
                                                    <img
                                                        src={image}
                                                        alt={`Yangi rasm ${index + 1}`}
                                                        className="w-full h-24 object-cover rounded-md"
                                                    />
                                                    <button
                                                        onClick={() => removeImage(index, true)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}

                                            {/* Rasm yuklash tugmasi */}
                                            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-24 cursor-pointer hover:border-blue-500">
                                                <Upload size={24} className="text-gray-400 mb-1" />
                                                <span className="text-sm text-gray-500">Rasm qo'shish</span>
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-3 border-t pt-4">
                                        <button
                                            onClick={closeEditModal}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                        >
                                            Bekor qilish
                                        </button>
                                        <button
                                            onClick={handleSaveEdit}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                                        >
                                            <Save size={18} className="mr-2" />
                                            Saqlash
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* O'chirish tasdiqlash modal oynasi */}
                    {isDeleteModalOpen && deletingHouse && (
                        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg max-w-md w-full p-6">
                                <h2 className="text-xl font-bold mb-4">Uyni o'chirish</h2>
                                <p className="text-gray-700 mb-6">
                                    "{deletingHouse.title}" uyini rostdan ham o'chirmoqchimisiz?
                                    Bu amalni qaytarib bo'lmaydi.
                                </p>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={closeDeleteModal}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Bekor qilish
                                    </button>
                                    <button
                                        onClick={handleDeleteHouse}
                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                    >
                                        O'chirish
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Rasm modal oynasi */}
                    {isImageModalOpen && (selectedHouse || isAddingHouse) && (
                        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
                            <div className="relative max-w-4xl w-full max-h-[90vh]">
                                <button
                                    onClick={closeImageModal}
                                    className="absolute top-4 right-4 p-2 bg-white rounded-full z-10 hover:bg-gray-200"
                                >
                                    <X size={24} />
                                </button>

                                {/** CurrentHouse aniqlash **/}
                                {(() => {
                                    const currentHouse = isAddingHouse ? newHouse : selectedHouse;
                                    return (
                                        <div className="h-full overflow-hidden">
                                            <img
                                                src={currentHouse.images[activeImageIndex]}
                                                alt={currentHouse.title}
                                                className="w-full h-full object-contain max-h-[80vh]"
                                            />

                                            {currentHouse.images.length > 1 && (
                                                <>
                                                    <button
                                                        onClick={prevImage}
                                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                                                    >
                                                        <ChevronLeft size={24} />
                                                    </button>
                                                    <button
                                                        onClick={nextImage}
                                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                                                    >
                                                        <ChevronRight size={24} />
                                                    </button>

                                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
                                                        {currentHouse.images.map((_, index) => (
                                                            <button
                                                                key={index}
                                                                onClick={() => setActiveImageIndex(index)}
                                                                className={`w-2 h-2 rounded-full ${index === activeImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    )}

                </>
            )}
            {isAddingHouse && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-auto">
                    <div className="bg-white rounded-lg max-w-4xl w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Yangi Uy Qo'shish</h2>
                            <button onClick={closeAddHouseModal} className="p-1 rounded-full hover:bg-gray-200">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <input
                                type="text"
                                name="title"
                                value={newHouse.title}
                                onChange={handleNewHouseChange}
                                placeholder="Uy nomi"
                                className="w-full px-4 py-2 border rounded-md"
                            />
                            <input
                                type="number"
                                name="price"
                                value={newHouse.price}
                                onChange={handleNewHouseChange}
                                placeholder="Narxi ($)"
                                className="w-full px-4 py-2 border rounded-md"
                            />
                            <input
                                type="number"
                                name="rooms"
                                value={newHouse.rooms}
                                onChange={handleNewHouseChange}
                                placeholder="Xonalar soni"
                                className="w-full px-4 py-2 border rounded-md"
                            />
                            <input
                                type="number"
                                name="area"
                                value={newHouse.area}
                                onChange={handleNewHouseChange}
                                placeholder="Maydoni (m²)"
                                className="w-full px-4 py-2 border rounded-md"
                            />
                            <input
                                type="text"
                                name="address"
                                value={newHouse.address}
                                onChange={handleNewHouseChange}
                                placeholder="Manzil"
                                className="w-full px-4 py-2 border rounded-md"
                            />
                            <input
                                type="text"
                                name="category"
                                value={newHouse.category}
                                onChange={handleNewHouseChange}
                                placeholder="Kategoriya"
                                className="w-full px-4 py-2 border rounded-md"
                            />
                        </div>

                        <textarea
                            name="description"
                            value={newHouse.description}
                            onChange={handleNewHouseChange}
                            placeholder="Tavsif"
                            rows={4}
                            className="w-full px-4 py-2 border rounded-md mb-4"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <input
                                type="number"
                                name="floor"
                                value={newHouse.floor}
                                onChange={handleNewHouseChange}
                                placeholder="Qavat (masalan: 5)"
                                className="w-full px-4 py-2 border rounded-md"
                            />
                            <input
                                type="number"
                                name="totalFloors"
                                value={newHouse.totalFloors}
                                onChange={handleNewHouseChange}
                                placeholder="Umumiy qavatlar (masalan: 9)"
                                className="w-full px-4 py-2 border rounded-md"
                            />
                        </div>


                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            {newHouse.images.map((img, idx) => (
                                <div key={idx} className="relative">
                                    <img src={img} alt="" className="w-full h-24 object-cover rounded-md" />
                                    <button
                                        onClick={() => removeImage(idx, true)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}

                            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-24 cursor-pointer hover:border-blue-500">
                                <Upload size={24} className="text-gray-400 mb-1" />
                                <span className="text-sm text-gray-500">Rasm qo'shish</span>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, true)}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={closeAddHouseModal}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Bekor qilish
                            </button>
                            <button
                                onClick={handleAddHouseSave}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                            >
                                <Save size={18} className="mr-2" />
                                Saqlash
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}