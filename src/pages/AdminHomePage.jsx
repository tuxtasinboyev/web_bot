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
  Trash2,
  Calendar,
  Search,
  Filter
} from "lucide-react";
import { SiTelegram } from "react-icons/si";
import axios from "axios";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Snackbar,
  Alert
} from "@mui/material";

export default function AdminHomePage() {
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [houses, setHouses] = useState([]);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState("");
  const [selectedOwner, setSelectedOwner] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [houseToDelete, setHouseToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [showExpired, setShowExpired] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");

  // O'zbekiston viloyatlari va ularning muqobil nomlari
  const regions = [
    { value: "Toshkent shahri", aliases: ["toshkent sh", "toshkent shahri", "tashkent city"] },
    { value: "Toshkent viloyati", aliases: ["toshkent v", "toshkent viloyati", "tashkent region"] },
    { value: "Andijon", aliases: ["andijan", "andijon"] },
    { value: "Buxoro", aliases: ["bukhara", "buxoro"] },
    { value: "Farg'ona", aliases: ["fergana", "fargona", "fargʻona"] },
    { value: "Jizzax", aliases: ["jizzakh", "jizzax"] },
    { value: "Xorazm", aliases: ["khorezm", "xorazm"] },
    { value: "Namangan", aliases: ["namangan"] },
    { value: "Navoiy", aliases: ["navoi", "navoiy"] },
    { value: "Qashqadaryo", aliases: ["kashkadarya", "qashqadaryo"] },
    { value: "Qoraqalpog'iston", aliases: ["karakalpakstan", "qoraqalpogiston", "qoraqalpogʻiston"] },
    { value: "Samarqand", aliases: ["samarkand", "samarqand"] },
    { value: "Sirdaryo", aliases: ["sirdarya", "sirdaryo"] },
    { value: "Surxondaryo", aliases: ["surkhandarya", "surxondaryo"] }
  ];

  useEffect(() => {
    fetchHouses();
  }, []);

  const fetchHouses = () => {
    axios.get("https://houzing.botify.uz/houses")
      .then(res => {
        setHouses(res.data.data);
      })
      .catch(err => console.error(err));
  };

  // Format end date
  const formatEndDate = (dateString) => {
    if (!dateString) return "Muddatsiz";

    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Check if expired
  const isExpired = (endDate) => {
    if (!endDate) return false;
    return new Date(endDate) < new Date();
  };

  // Viloyat nomini tekshirish uchun yaxshilangan funksiya
  const normalizeString = (str) => str.toLowerCase().replace(/[^\w\s]/gi, '').trim();

  const checkRegionMatch = (address, regionObj) => {
    if (!address) return false;

    const addressNormalized = normalizeString(address);
    const regionNormalized = normalizeString(regionObj.value);

    if (addressNormalized.includes(regionNormalized)) return true;

    for (const alias of regionObj.aliases) {
      if (addressNormalized.includes(normalizeString(alias))) return true;
    }

    return false;
  };


  // Filter houses based on search, region and expired status
  const filteredHouses = houses.filter(house => {
    // Expired filter
    if (showExpired && !isExpired(house.endDate)) return false;
    if (!showExpired && isExpired(house.endDate)) return false;

    // Search filter
    if (searchQuery && !house.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Region filter
    if (selectedRegion) {
      const selectedRegionObj = regions.find(r => r.value === selectedRegion);

      if (selectedRegionObj && house.address) {
        // Yangi tekshirish funksiyasidan foydalanish
        if (!checkRegionMatch(house.address, selectedRegionObj)) {
          return false;
        }
      } else if (!house.address) {
        return false;
      }
    }

    return true;
  });

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

  // Delete house function
  const handleDeleteHouse = (house, e) => {
    if (e) e.stopPropagation();
    setHouseToDelete(house);
    setDeleteDialogOpen(true);
  };

  // Confirm delete house
  const confirmDeleteHouse = () => {
    if (!houseToDelete) return;

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setSnackbar({ open: true, message: "Avtorizatsiya tokeni topilmadi", severity: "error" });
      return;
    }

    axios.delete(`https://houzing.botify.uz/houses/admin/delete/house/${houseToDelete.id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(response => {
        setSnackbar({ open: true, message: "Uy muvaffaqiyatli o'chirildi", severity: "success" });
        fetchHouses();
      })
      .catch(error => {
        console.error("Uyni o'chirishda xatolik:", error);
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Uyni o'chirishda xatolik yuz berdi",
          severity: "error"
        });
      })
      .finally(() => {
        setDeleteDialogOpen(false);
        setHouseToDelete(null);
      });
  };

  // Open phone modal
  const openPhoneModal = (phoneNumber, ownerName, e) => {
    if (e) e.stopPropagation();
    setSelectedPhone(phoneNumber);
    setSelectedOwner(ownerName);
    setIsPhoneModalOpen(true);
  };

  // Close phone modal
  const closePhoneModal = () => {
    setIsPhoneModalOpen(false);
    setSelectedPhone("");
    setSelectedOwner("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admin - Barcha Uylar</h1>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          {/* Search input */}
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Uy nomi bo'yicha qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Region filter */}
          <div className="relative flex-1 md:flex-initial">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-md w-full appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Barcha viloyatlar</option>
              {regions.map(region => (
                <option key={region.value} value={region.value}>{region.value}</option>
              ))}
            </select>
          </div>

          {/* Expired filter */}
          <button
            onClick={() => setShowExpired(!showExpired)}
            className={`px-4 py-2 rounded-md flex items-center justify-center ${showExpired
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            <Calendar size={18} className="mr-2" />
            <span className="hidden sm:inline">
              {showExpired ? "Muddati o'tgan" : "Barcha uylar"}
            </span>
          </button>
        </div>
      </div>

      {/* Results info */}
      <div className="mb-4 text-sm text-gray-600">
        {filteredHouses.length} ta uy topildi
        {(searchQuery || selectedRegion) && (
          <span>
            {" "}(<button
              onClick={() => { setSearchQuery(""); setSelectedRegion(""); }}
              className="text-blue-500 hover:underline"
            >
              Filtrlarni tozalash
            </button>)
          </span>
        )}
      </div>

      {/* Uylar ro'yxati */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredHouses.length > 0 ? (
          filteredHouses.map((house) => {
            const expired = isExpired(house.endDate);

            return (
              <div
                key={house.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative ${expired ? 'opacity-80 border-l-4 border-red-500' : ''
                  }`}
                onClick={() => openModal(house)}
              >
                {/* Uchirish tugmasi */}
                <button
                  className="absolute top-2 left-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 z-10"
                  onClick={(e) => handleDeleteHouse(house, e)}
                  title="Uyni o'chirish"
                >
                  <Trash2 size={16} />
                </button>

                {/* Amal qilish muddati */}
                <div className={`absolute top-2 right-2 text-xs font-medium px-2.5 py-0.5 rounded z-10 ${expired
                  ? 'bg-red-500 text-white'
                  : 'bg-blue-500 text-white'
                  }`}>
                  {house.endDate ? formatEndDate(house.endDate) : "Muddatsiz"}
                  {expired && ' (Muddati tugagan)'}
                </div>

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
          })
        ) : (
          <div className="col-span-full text-center py-10 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">Hech qanday uy topilmadi</p>
            {(searchQuery || selectedRegion || showExpired) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedRegion("");
                  setShowExpired(false);
                }}
                className="mt-2 text-blue-500 hover:underline"
              >
                Barcha filtrlarni tozalash
              </button>
            )}
          </div>
        )}
      </div>

      {/* Uyni uchirish uchun tasdiqlash dialogi */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Uyni o'chirish
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            "{houseToDelete?.title}" nomli uyni haqiqatan ham o'chirmoqchimisiz?
            Bu amalni qaytarib bo'lmaydi.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Bekor qilish
          </Button>
          <Button onClick={confirmDeleteHouse} color="error" autoFocus>
            O'chirish
          </Button>
        </DialogActions>
      </Dialog>

      {/* Xabar ko'rsatish uchun Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Telefon raqami modal oynasi */}
      {isPhoneModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
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
                <button
                  className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
                  onClick={(e) => handleDeleteHouse(selectedHouse, e)}
                >
                  <Trash2 size={18} className="mr-2" />
                  Uyni o'chirish
                </button>
              </div>

              {/* Amal qilish muddati ma'lumoti */}
              <div className="mb-4 p-3 bg-gray-100 rounded-md flex items-center">
                <Calendar size={18} className="mr-2 text-gray-600" />
                <span className="font-medium mr-2">Amal qilish muddati:</span>
                <span className={isExpired(selectedHouse.endDate) ? 'text-red-600 font-semibold' : 'text-gray-700'}>
                  {selectedHouse.endDate ? formatEndDate(selectedHouse.endDate) : "Muddatsiz"}
                  {isExpired(selectedHouse.endDate) && ' (Muddati tugagan)'}
                </span>
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