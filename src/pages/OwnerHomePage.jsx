import { useEffect, useState } from "react";
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
  Calendar
} from "lucide-react";
import { SiTelegram } from "react-icons/si";
import axios from "axios";

export default function HomePage() {
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [houses, setHouses] = useState([]);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState("");
  const [selectedOwner, setSelectedOwner] = useState("");

  useEffect(() => {
    axios.get("https://houzing.botify.uz/houses")
      .then(res => {
        setHouses(res.data.data);
      })
      .catch(err => console.error(err));
  }, []);

  // Amal qilish muddatini formatlash funksiyasi
  const formatEndDate = (dateString) => {
    if (!dateString) return "Muddat ko'rsatilmagan";
    
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Qolgan kunlarni hisoblash funksiyasi
  const getDaysRemaining = (dateString) => {
    if (!dateString) return null;
    
    const now = new Date();
    const endDate = new Date(dateString);
    const diffTime = endDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

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

  // Telefon modalini ochish funksiyasi
  const openPhoneModal = (phoneNumber, ownerName, e) => {
    if (e) e.stopPropagation(); // Bu event bubbling ni to'xtatadi
    setSelectedPhone(phoneNumber);
    setSelectedOwner(ownerName);
    setIsPhoneModalOpen(true);
  };

  // Telefon modalini yopish funksiyasi
  const closePhoneModal = () => {
    setIsPhoneModalOpen(false);
    setSelectedPhone("");
    setSelectedOwner("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Barcha Uylar</h1>

      {/* Uylar ro'yxati */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {houses.map((house) => {
          const daysRemaining = getDaysRemaining(house.endDate);
          
          return (
            <div
              key={house.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => openModal(house)}
            >
              {/* Uy rasmi */}
              <div className="h-48 overflow-hidden relative">
                <img
                  src={house.images && house.images[0] ? house.images[0] : "/placeholder-house.jpg"}
                  alt={house.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-medium px-2.5 py-0.5 rounded">
                  {house.Category?.name || "Noma'lum"}
                </div>
                
                {/* Amal qilish muddati */}
                {house.endDate && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {daysRemaining > 0 ? `${daysRemaining} kun qoldi` : 'Muddati tugagan'}
                  </div>
                )}
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

                {/* Amal qilish muddati (pastki qismda) */}
                {house.endDate && (
                  <div className="mb-3 text-sm text-gray-500 flex items-center">
                    <Calendar size={12} className="mr-1" />
                    <span>Amal qilish muddati: {formatEndDate(house.endDate)}</span>
                  </div>
                )}

                {/* Egasi ma'lumotlari */}
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex items-center justify-center">
                        {house.owner?.image ? (
                          <img
                            src={house.owner.image}
                            alt={house.owner.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={16} className="text-gray-600" />
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-800">{house.owner?.name || "Noma'lum"}</p>
                      </div>
                    </div>

                    <div className="flex space-x-1">
                      <button
                        className="p-1 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                        title="Qo'ng'iroq qilish"
                        onClick={(e) => openPhoneModal(house.owner?.phone || "", house.owner?.name || "", e)}
                      >
                        <Phone size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Telefon raqami modal oynasi - Z-indexni oshirish va joylashuvni markazga olish */}
      {isPhoneModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-180 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Telefon raqami</h3>
              <button
                onClick={closePhoneModal}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <X size={24} />
              </button>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone size={24} className="text-blue-600" />
              </div>

              <h4 className="font-medium text-gray-800 mb-1">{selectedOwner}</h4>
              <p className="text-xl font-bold text-blue-600 mb-6">{selectedPhone || "Telefon raqami mavjud emas"}</p>

              {selectedPhone && (
                <div className="flex justify-center space-x-3">
                  <a
                    href={`tel:${selectedPhone}`}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Phone size={18} className="mr-2" />
                    Qo'ng'iroq qilish
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
                  src={selectedHouse.images && selectedHouse.images[activeImageIndex]
                    ? selectedHouse.images[activeImageIndex]
                    : "/placeholder-house.jpg"}
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
                
                {/* Amal qilish muddati (rasm ustida) */}
                {selectedHouse.endDate && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {getDaysRemaining(selectedHouse.endDate) > 0 
                      ? `${getDaysRemaining(selectedHouse.endDate)} kun qoldi` 
                      : 'Muddati tugagan'}
                  </div>
                )}
              </div>

              {selectedHouse.images && selectedHouse.images.length > 1 && (
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

              {selectedHouse.images && selectedHouse.images.length > 1 && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {selectedHouse.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${index === activeImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{selectedHouse.title}</h3>
                  <p className="text-blue-600 text-xl font-semibold">${selectedHouse.price.toLocaleString()}</p>
                </div>
              </div>

              {/* Amal qilish muddati ma'lumotlari */}
              {selectedHouse.endDate && (
                <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                  <div className="flex items-center">
                    <Calendar size={18} className="mr-2 text-gray-600" />
                    <div>
                      <p className="font-medium">Amal qilish muddati</p>
                      <p className="text-gray-700">{formatEndDate(selectedHouse.endDate)}</p>
                      <p className={`text-sm ${getDaysRemaining(selectedHouse.endDate) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {getDaysRemaining(selectedHouse.endDate) > 0 
                          ? `${getDaysRemaining(selectedHouse.endDate)} kun qoldi` 
                          : 'E\'lon muddati tugagan'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

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
                    <span>{selectedHouse.floor}/{selectedHouse.allFloor || selectedHouse.totalFloors} qavat</span>
                  </div>
                )}
                <div className="flex items-center">
                  <span className="mr-2 text-gray-500">🏠</span>
                  <span>{selectedHouse.Category?.name || "Noma'lum"}</span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-2">Tavsif</h4>
                <p className="text-gray-700">{selectedHouse.description}</p>
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

              {/* Egasi ma'lumotlari */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Egasi</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden mr-3 flex items-center justify-center">
                      <User size={24} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{selectedHouse.owner?.name || "Noma'lum"}</p>
                      <p className="text-sm text-gray-500">{selectedHouse.owner?.role || "Foydalanuvchi"}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => openPhoneModal(selectedHouse.owner?.phone || "", selectedHouse.owner?.name || "", e)}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
                    >
                      <Phone size={18} className="mr-2" />
                      {selectedPhone}
                    </button>
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
                src={selectedHouse.images && selectedHouse.images[activeImageIndex]
                  ? selectedHouse.images[activeImageIndex]
                  : "/placeholder-house.jpg"}
                alt={selectedHouse.title}
                className="w-full h-full object-contain max-h-[80vh]"
              />
            </div>

            {selectedHouse.images && selectedHouse.images.length > 1 && (
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
                      className={`w-2 h-2 rounded-full ${index === activeImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'}`}
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