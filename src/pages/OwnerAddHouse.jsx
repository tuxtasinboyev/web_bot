// "use client"
import { useState, useEffect } from "react";
import { Save, Trash2, Upload } from "lucide-react";
import axios from "axios";
import { TextField } from "@mui/material";

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
    images: [],
  });

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await axios.get("https://houzing.botify.uz/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Kategoriyalarni yuklashda xatolik:", error);
        alert("Kategoriyalarni yuklashda xatolik yuz berdi");
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

  // Image upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setHouseData({ ...houseData, images: [...(houseData.images || []), ...files] });
  };

  const handleRemoveImage = (index) => {
    const updatedImages = (houseData.images || []).filter((_, i) => i !== index);
    setHouseData({ ...houseData, images: updatedImages });
  };

  // Save house
  const handleSave = async () => {
    const newErrors = {};
    const requiredFields = ["title","address","rooms","floor","allFloor","area","categoryId","description","price"];
    requiredFields.forEach((field) => {
      if (!houseData[field]?.toString().trim()) newErrors[field] = "Bu maydon to'ldirilishi shart";
    });
    if (!houseData.images || houseData.images.length < 3) newErrors.images = "Kamida 3 ta rasm yuklash kerak";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

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
        images: [],
      });
      setErrors({});
      alert("Uy muvaffaqiyatli qo'shildi!");
    } catch (error) {
      console.error("Uy qo'shishda xatolik:", error);
      const msg = error.response?.data?.message || "Uy qo'shishda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.";
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors[field] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`;

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto flex flex-col">
      <h2 className="text-3xl font-bold mb-6 text-blue-600">Yangi Uy qo'shish</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-auto">
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
            rows={4}
            placeholder="Uy haqida batafsil ma'lumot..."
          />
          {errors.description && <span className="text-red-500 text-sm mt-1">{errors.description}</span>}
        </div>
      </div>

      {/* Images */}
      <div className="mt-6">
        <label className="text-gray-700 font-medium mb-2 block">Rasmlar yuklash * (kamida 3 ta)</label>
        <label className="flex flex-col items-center px-6 py-4 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-100 transition">
          <Upload className="text-blue-600 mb-2" size={24} />
          <span className="text-blue-600 font-medium mb-1">Rasm tanlash</span>
          <span className="text-gray-500 text-sm">
            {houseData.images.length > 0 ? `${houseData.images.length} ta rasm tanlandi` : "Yoki rasmni shu yerga torting"}
          </span>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
        </label>
        {errors.images && <span className="text-red-500 text-sm mt-1">{errors.images}</span>}

        {houseData.images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {houseData.images.map((image, idx) => (
              <div key={idx} className="relative group rounded-lg overflow-hidden border">
                <img src={URL.createObjectURL(image)} alt={`Uy rasm ${idx}`} className="w-full h-32 object-cover rounded-lg" />
                <button onClick={() => handleRemoveImage(idx)} className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <Save size={20} className="mr-2" />
          {isLoading ? "Saqlanmoqda..." : "Saqlash"}
        </button>
      </div>
    </div>
  );
}
