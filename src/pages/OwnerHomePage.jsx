import { useState } from "react";
import {
    Home,
    ClipboardList,
    User,
    PlusCircle,
    Phone,
    MessageCircle,
    MapPin,
    Bed,
    Bath,
    Star,
    X,
    ChevronLeft,
    ChevronRight,
    Heart,
    Share,
    Maximize,
} from "lucide-react";
import { SiTelegram } from "react-icons/si";

export default function HomePage() {
    const [selectedHouse, setSelectedHouse] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    // Uylar ma'lumotlari
    const houses = [
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
                "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
            ],
            category: "Kvartira",
            amenities: ["Lift", "Video kuzatuv", "Konditsioner", "Mebellar", "Internet"],
            owner: {
                name: "Aliyev Sanjar",
                phone: "+998901234567",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
                joinedDate: "2023-yil, Yanvar",
                telegram: "https://t.me/sanjaraliyev"
            },
            location: {
                lat: 41.346176,
                lng: 69.286384
            }
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
                "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
            ],
            category: "Hovli",
            amenities: ["Hovli", "Garaj", "Bog'", "Hammom", "Oshxona jihozlari"],
            owner: {
                name: "Nodira Xasanova",
                phone: "+998902345678",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
                joinedDate: "2022-yil, Mart",
                telegram: "https://t.me/sanjaraliyev"
            },
            location: {
                lat: 41.289151,
                lng: 69.226143
            }
        },
        {
            id: 3,
            title: "Yakkasaroyda ijara uy",
            description: "Yakkasaroy tumanidagi markaziy joylashgan ijara uyi. Transport va infratuzilma juda qulay. Metro bekati yaqinida joylashgan.",
            address: "Toshkent, Yakkasaroy tumani, Amir Temur ko'chasi 78",
            price: 180000,
            rooms: 3,
            area: 85,
            floor: 3,
            totalFloors: 5,
            images: [
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
            ],
            category: "Kvartira",
            amenities: ["Markaziy joylashuv", "Metro yaqinida", "Supermarket", "Park yaqinida"],
            owner: {
                name: "Javohir Ismoilov",
                phone: "+998903456789",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
                joinedDate: "2023-yil, May",
                telegram: "https://t.me/sanjaraliyev"
            },
            location: {
                lat: 41.307862,
                lng: 69.279147
            }
        },
        {
            id: 4,
            title: "Mirzo Ulug'bek tumanidagi uy",
            description: "Tinch va osoyishta joyda joylashgan qulay uy. Havosi sof, atrofi yashil. Oilaviy turar joy uchun ajoyib variant.",
            address: "Toshkent, Mirzo Ulug'bek tumani, Navoiy ko'chasi 15",
            price: 280000,
            rooms: 5,
            area: 180,
            images: [
                "https://images.unsplash.com/photo-1586448900407-7397af48d116?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                "https://images.unsplash.com/photo-1600566753050-0d5e8b0c201c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
            ],
            category: "Hovli",
            amenities: ["Katta hovli", "Yashil zona", "Avtomobil yo'li", "Qulay transport"],
            owner: {
                name: "Dilnoza Yusupova",
                phone: "+998904567890",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
                joinedDate: "2022-yil, Avgust",
                telegram: "https://t.me/sanjaraliyev"
            },
            location: {
                lat: 41.338028,
                lng: 69.251636
            }
        }
    ];

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

    const openImageModal = () => {
        setIsImageModalOpen(true);
    };

    const closeImageModal = () => {
        setIsImageModalOpen(false);
    };

    const nextImage = () => {
        if (selectedHouse) {
            setActiveImageIndex((prevIndex) =>
                prevIndex === selectedHouse.images.length - 1 ? 0 : prevIndex + 1
            );
        }
    };

    const prevImage = () => {
        if (selectedHouse) {
            setActiveImageIndex((prevIndex) =>
                prevIndex === 0 ? selectedHouse.images.length - 1 : prevIndex - 1
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Barcha Uylar</h1>

            {/* Uylar ro'yxati */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {houses.map((house) => (
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

                            {/* Egasi ma'lumotlari */}
                            <div className="pt-3 border-t border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                                            <img
                                                src={house.owner.image}
                                                alt={house.owner.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{house.owner.name}</p>
                                        </div>
                                    </div>

                                    <div className="flex space-x-1">
                                        <a
                                            href={`tel:${house.owner.phone}`}
                                            className="p-1 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                                            title="Qo'ng'iroq qilish"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Phone size={14} />
                                        </a>
                                        <a
                                            href={house.owner.telegram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                                            title="Telegram"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <SiTelegram size={18} className="mr-2" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal oynasi */}
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
                                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${selectedHouse.location.lat},${selectedHouse.location.lng}&zoom=15`}
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>

                            {/* Egasi ma'lumotlari */}
                            <div className="border-t pt-4">
                                <h4 className="font-semibold mb-3">Egasi</h4>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                                            <img
                                                src={selectedHouse.owner.image}
                                                alt={selectedHouse.owner.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{selectedHouse.owner.name}</p>
                                            <p className="text-sm text-gray-500">A'zo: {selectedHouse.owner.joinedDate}</p>
                                        </div>
                                    </div>

                                    <div className="flex space-x-2">
                                        <a
                                            href={`tel:${selectedHouse.owner.phone}`}
                                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
                                        >
                                            <Phone size={18} className="mr-2" />
                                            {selectedHouse.owner.phone}
                                        </a>

                                        <a
                                            href={selectedHouse.owner.telegram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                                        >
                                            <SiTelegram size={18} className="mr-2" />
                                        </a>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Rasm modal oynasi */}
            {isImageModalOpen && selectedHouse && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
                    <div className="relative max-w-4xl w-full max-h-[90vh]">
                        <button
                            onClick={closeImageModal}
                            className="absolute top-4 right-4 p-2 bg-white rounded-full z-10 hover:bg-gray-200"
                        >
                            <X size={24} />
                        </button>

                        <div className="h-full overflow-hidden">
                            <img
                                src={selectedHouse.images[activeImageIndex]}
                                alt={selectedHouse.title}
                                className="w-full h-full object-contain max-h-[80vh]"
                            />
                        </div>

                        {selectedHouse.images.length > 1 && (
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
                                    {selectedHouse.images.map((_, index) => (
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
                </div>
            )}
        </div>
    );
}