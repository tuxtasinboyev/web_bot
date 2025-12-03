// "use client"
import { useState, useEffect } from "react";
import { Save, Trash2, Upload, Calendar } from "lucide-react";
import axios from "axios";
import { TextField, Slider, Box, Typography, Snackbar, Alert } from "@mui/material";

export default function AddHouse({ onAddHouse }) {
  const [houseData, setHouseData] = useState({
    title: "",
    address: "",
    rooms: "",
    floor: "",
    allFloor: "",
    area: "",
    categoryId: "",
    description: "",
    price: "",
    durationDays: 10, // Default value
    images: [],
  });

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // success, error, warning, info
  });


  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await axios.get("https://houzing.botify.uz/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Kategoriyalarni yuklashda xatolik:", error);
        setSnackbar({
          open: true,
          message: "Kategoriyalarni yuklashda xatolik yuz berdi",
          severity: "error",
        });
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHouseData({ ...houseData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: !value.trim() ? "Bu maydon to'ldirilishi shart" : null }));
  };

  // Duration change
  const handleDurationChange = (event, newValue) => {
    setHouseData({ ...houseData, durationDays: newValue });
  };

  // Image upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setHouseData({ ...houseData, images: [...(houseData.images || []), ...files] });
  };

  const handleRemoveImage = (index) => {
    const updatedImages = (houseData.images || []).filter((_, i) => i !== index);
    setHouseData({ ...houseData, images: updatedImages });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ["title","address","rooms","floor","allFloor","area","categoryId","description","price"];
    requiredFields.forEach((field) => {
      if (!houseData[field]?.toString().trim()) newErrors[field] = "Bu maydon to'ldirilishi shart";
    });
    if (!houseData.images || houseData.images.length < 3) newErrors.images = "Kamida 3 ta rasm yuklash kerak";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Show duration modal
  const handleShowDurationModal = () => {
    if (validateForm()) {
      setShowDurationModal(true);
    }
  };

  // Save house
  const handleSave = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.keys(houseData).forEach((key) => {
        if (key === "images") {
          houseData.images.forEach((img) => formData.append("images", img));
        } else {
          formData.append(key, houseData[key]);
        }
      });

      const response = await axios.post("https://houzing.botify.uz/houses", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (onAddHouse) onAddHouse(response.data);

      setHouseData({
        title: "",
        address: "",
        rooms: "",
        floor: "",
        allFloor: "",
        area: "",
        categoryId: "",
        description: "",
        price: "",
        durationDays: 10,
        images: [],
      });
      setErrors({});
      setShowDurationModal(false);
      alert("Uy muvaffaqiyatli qo'shildi!");
    } catch (error) {
      console.error("Uy qo'shishda xatolik:", error);
      const msg = error.response?.data?.message || "Uy qo'shishda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.";
      setSnackbar({
        open: true,
        message: msg,
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors[field] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`;

  return (
    <div className="bg-white p-4 md:p-8 rounded-xl shadow-lg max-w-4xl mx-auto flex flex-col h-full relative">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-blue-600">Yangi Uy qo'shish</h2>

      <div className="flex-1 overflow-y-auto pb-24 md:pb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Title */}
          <div className="flex flex-col">
            <TextField
              className={inputClass("title")}
              label="Nomi"
              type="text"
              name="title"
              value={houseData.title}
              onChange={handleInputChange}
              placeholder="Masalan: Qora Qush uy"
              size="small"
            />
            {errors.title && <span className="text-red-500 text-sm mt-1">{errors.title}</span>}
          </div>

          {/* Address */}
          <div className="flex flex-col">
            <TextField
              className={inputClass("address")}
              label="Manzil"
              type="text"
              name="address"
              value={houseData.address}
              onChange={handleInputChange}
              placeholder="Masalan: Toshkent shahar, Mirzo Ulug'bek"
              size="small"
            />
            {errors.address && <span className="text-red-500 text-sm mt-1">{errors.address}</span>}
          </div>

          {/* Rooms */}
          <div className="flex flex-col">
            <TextField
              className={inputClass("rooms")}
              label="Xonalar soni"
              type="number"
              name="rooms"
              value={houseData.rooms}
              onChange={handleInputChange}
              placeholder="Masalan: 3"
              size="small"
            />
            {errors.rooms && <span className="text-red-500 text-sm mt-1">{errors.rooms}</span>}
          </div>

          {/* Floor */}
          <div className="flex flex-col">
            <TextField
              className={inputClass("floor")}
              label="Qavat"
              type="number"
              name="floor"
              value={houseData.floor}
              onChange={handleInputChange}
              placeholder="Masalan: 2"
              size="small"
            />
            {errors.floor && <span className="text-red-500 text-sm mt-1">{errors.floor}</span>}
          </div>

          {/* All Floor */}
          <div className="flex flex-col">
            <TextField
              className={inputClass("allFloor")}
              label="Umumiy qavatlar"
              type="number"
              name="allFloor"
              value={houseData.allFloor}
              onChange={handleInputChange}
              placeholder="Masalan: 5"
              size="small"
            />
            {errors.allFloor && <span className="text-red-500 text-sm mt-1">{errors.allFloor}</span>}
          </div>

          {/* Area */}
          <div className="flex flex-col">
            <TextField
              className={inputClass("area")}
              label="Maydon (m²)"
              type="number"
              step="0.1"
              name="area"
              value={houseData.area}
              onChange={handleInputChange}
              placeholder="Masalan: 120.5"
              size="small"
            />
            {errors.area && <span className="text-red-500 text-sm mt-1">{errors.area}</span>}
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <TextField
              select
              className={inputClass("categoryId")}
              label="Kategoriya"
              name="categoryId"
              value={houseData.categoryId}
              onChange={handleInputChange}
              SelectProps={{ native: true }}
              disabled={categoriesLoading}
              size="small"
            >
              <option value="">{categoriesLoading ? "Kategoriyalar yuklanmoqda..." : "Kategoriya tanlang"}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </TextField>
            {errors.categoryId && <span className="text-red-500 text-sm mt-1">{errors.categoryId}</span>}
          </div>

          {/* Price */}
          <div className="flex flex-col md:col-span-2">
            <TextField
              className={inputClass("price")}
              label="Narxi (so'm)"
              type="number"
              name="price"
              value={houseData.price}
              onChange={handleInputChange}
              placeholder="Masalan: 500000000"
              size="small"
            />
            {errors.price && <span className="text-red-500 text-sm mt-1">{errors.price}</span>}
          </div>

          {/* Description */}
          <div className="flex flex-col md:col-span-2">
            <TextField
              className={inputClass("description")}
              label="Tavsif"
              name="description"
              value={houseData.description}
              onChange={handleInputChange}
              multiline
              rows={3}
              placeholder="Uy haqida batafsil ma'lumot..."
              size="small"
            />
            {errors.description && <span className="text-red-500 text-sm mt-1">{errors.description}</span>}
          </div>
        </div>

        {/* Images */}
        <div className="mt-4 md:mt-6">
          <label className="text-gray-700 font-medium mb-2 block">Rasmlar yuklash * (kamida 3 ta)</label>
          <label className="flex flex-col items-center px-4 py-3 md:px-6 md:py-4 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-100 transition">
            <Upload className="text-blue-600 mb-1 md:mb-2" size={20} />
            <span className="text-blue-600 font-medium text-sm md:text-base mb-1">Rasm tanlash</span>
            <span className="text-gray-500 text-xs md:text-sm text-center">
              {houseData.images.length > 0 ? `${houseData.images.length} ta rasm tanlandi` : "Yoki rasmni shu yerga torting"}
            </span>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
          {errors.images && <span className="text-red-500 text-sm mt-1">{errors.images}</span>}

          {houseData.images.length > 0 && (
            <div className="mt-3 md:mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
              {houseData.images.map((image, idx) => (
                <div key={idx} className="relative group rounded-lg overflow-hidden border">
                  <img src={URL.createObjectURL(image)} alt={`Uy rasm ${idx}`} className="w-full h-24 md:h-32 object-cover rounded-lg" />
                  <button onClick={() => handleRemoveImage(idx)} className="absolute top-1 right-1 md:top-2 md:right-2 bg-red-600 text-white rounded-full p-1 opacity-70 md:opacity-0 group-hover:opacity-100 transition">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Save button - Web botda ko'rinishi uchun z-index qo'shildi */}
      <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 md:static md:p-0 md:border-t-0 md:mt-6 md:flex md:justify-end z-10">
        <button
          onClick={handleShowDurationModal}
          disabled={isLoading}
          className="px-5 py-2.5 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center w-full md:w-auto shadow-md"
        >
          <Save size={18} className="mr-2" />
          {isLoading ? "Saqlanmoqda..." : "Saqlash"}
        </button>
      </div>

      {/* Duration Modal */}
      {showDurationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-center mb-4">
              <Calendar className="text-blue-600 mr-2" size={24} />
              <h3 className="text-xl font-bold text-gray-800">E'lon muddatini tanlang</h3>
            </div>
            
            <div className="mb-6">
              <Box sx={{ width: '100%', px: 2 }}>
                <Typography id="duration-slider" gutterBottom className="text-gray-700">
                  E'lon amal qilish muddati: <span className="font-bold text-blue-600">{houseData.durationDays} kun</span>
                </Typography>
                <Slider
                  value={houseData.durationDays}
                  onChange={handleDurationChange}
                  aria-labelledby="duration-slider"
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={5}
                  max={20}
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>5 kun</span>
                  <span>20 kun</span>
                </div>
              </Box>
            </div>

            <div className="text-sm text-gray-600 mb-6 p-3 bg-blue-50 rounded-lg">
              <p className="font-medium mb-1">E'lon muddati haqida:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>E'lon tanlangan muddat davomida faol bo'ladi</li>
                <li>Muddat tugagach, e'lon avtomatik ravishda yopiladi</li>
                <li>Keyinchalik muddatni uzaytirish imkoniyati mavjud</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDurationModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Ortga
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
              >
                <Save size={18} className="mr-2" />
                {isLoading ? "Saqlanmoqda..." : "Tasdiqlash va saqlash"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar> 
    </div>
  );
}