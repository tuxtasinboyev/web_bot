import { useState } from "react";
import { Save, Trash2 } from "lucide-react";

export default function AddHouse({ onAddHouse }) {
  const [houseData, setHouseData] = useState({
    title: "",
    address: "",
    bedrooms: "",
    bathrooms: "",
    price: "",
    images: [],
  });

  const [errors, setErrors] = useState({}); // Validatsiya uchun

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHouseData({ ...houseData, [name]: value });

    // Real-time validatsiya
    if (!value.trim()) {
      setErrors((prev) => ({ ...prev, [name]: "Bu maydon to‘ldirilishi shart" }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setHouseData({ ...houseData, images: [...houseData.images, ...newImages] });
  };

  const handleRemoveImage = (index) => {
    const updatedImages = houseData.images.filter((_, i) => i !== index);
    setHouseData({ ...houseData, images: updatedImages });
  };

  const handleSave = () => {
    const newErrors = {};
    if (!houseData.title.trim()) newErrors.title = true;
    if (!houseData.address.trim()) newErrors.address = true;
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return; // Agar xatolik bo‘lsa, save qilinmaydi

    onAddHouse(houseData);
    setHouseData({
      title: "",
      address: "",
      bedrooms: "",
      bathrooms: "",
      price: "",
      images: [],
    });
    setErrors({});
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
      errors[field]
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-blue-500"
    }`;

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-blue-600">Yangi Uy qo'shish</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-2">Nomi</label>
          <input
            type="text"
            name="title"
            value={houseData.title}
            onChange={handleInputChange}
            placeholder="Masalan: Qora Qush uy"
            className={inputClass("title")}
          />
          {errors.title && <span className="text-red-500 text-sm mt-1">{errors.title}</span>}
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-2">Manzil</label>
          <input
            type="text"
            name="address"
            value={houseData.address}
            onChange={handleInputChange}
            placeholder="Masalan: Toshkent shahar, Mirzo Ulug'bek"
            className={inputClass("address")}
          />
          {errors.address && <span className="text-red-500 text-sm mt-1">{errors.address}</span>}
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-2">Yotoq xonalar</label>
          <input
            type="number"
            name="bedrooms"
            value={houseData.bedrooms}
            onChange={handleInputChange}
            placeholder="Masalan: 3"
            className={inputClass("bedrooms")}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-2">Hammomlar</label>
          <input
            type="number"
            name="bathrooms"
            value={houseData.bathrooms}
            onChange={handleInputChange}
            placeholder="Masalan: 2"
            className={inputClass("bathrooms")}
          />
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className="text-gray-700 font-medium mb-2">Narxi (so'm)</label>
          <input
            type="number"
            name="price"
            value={houseData.price}
            onChange={handleInputChange}
            placeholder="Masalan: 500000000"
            className={inputClass("price")}
          />
        </div>
      </div>

      {/* Rasm yuklash */}
      <div className="mt-6">
        <label className="text-gray-700 font-medium mb-2 block">Rasmlar yuklash</label>

        <label className="flex flex-col items-center px-6 py-4 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-100 transition">
          <span className="text-blue-600 font-medium mb-1">Rasm tanlash</span>
          <span className="text-gray-500 text-sm">{houseData.images.length > 0 ? `${houseData.images.length} ta rasm tanlandi` : "Yoki rasmni shu yerga torting"}</span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>

        {houseData.images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {houseData.images.map((img, idx) => (
              <div key={idx} className="relative group rounded-lg overflow-hidden border">
                <img src={img} alt={`Uy rasm ${idx}`} className="w-full h-32 object-cover rounded-lg" />
                <button
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleSave}
        className="mt-8 w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
      >
        <Save size={20} className="mr-2" /> Saqlash
      </button>
    </div>
  );
}
