// "use client"

import { useState, useEffect } from "react"
import { Save, Trash2, Upload } from "lucide-react"
import axios from "axios"
import { TextField } from "@mui/material"


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
  })

  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true)

        const response = await axios.get("http://16.171.142.96:3000/categories")

        setCategories(response.data)

      } catch (error) {
        console.error("Kategoriyalarni yuklashda xatolik:", error)
        alert("Kategoriyalarni yuklashda xatolik yuz berdi")
      } finally {
        setCategoriesLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setHouseData({ ...houseData, [name]: value })

    if (!value.trim()) {
      setErrors((prev) => ({ ...prev, [name]: "Bu maydon to'ldirilishi shart" }))
    } else {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setHouseData({ ...houseData, images: [...(houseData.images || []), ...files] })
  }

  const handleRemoveImage = (index) => {
    const updatedImages = (houseData.images || []).filter((_, i) => i !== index)
    setHouseData({ ...houseData, images: updatedImages })
  }

  const handleSave = async () => {
    const newErrors = {}

    if (!houseData.title.trim()) newErrors.title = "Nomi kiritilishi shart"
    if (!houseData.address.trim()) newErrors.address = "Manzil kiritilishi shart"
    if (!houseData.rooms.trim()) newErrors.rooms = "Xonalar soni kiritilishi shart"
    if (!houseData.floor.trim()) newErrors.floor = "Qavat kiritilishi shart"
    if (!houseData.allFloor.trim()) newErrors.allFloor = "Umumiy qavatlar soni kiritilishi shart"
    if (!houseData.area.trim()) newErrors.area = "Maydon kiritilishi shart"
    if (!houseData.categoryId.trim()) newErrors.categoryId = "Kategoriya tanlanishi shart"
    if (!houseData.description.trim()) newErrors.description = "Tavsif kiritilishi shart"
    if (!houseData.price.trim()) newErrors.price = "Narx kiritilishi shart"

    if (!houseData.images || houseData.images.length < 3) {
      newErrors.images = "Kamida 3 ta rasm yuklash kerak"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) return

    setIsLoading(true)

    try {
      const formData = new FormData()

      formData.append("title", houseData.title)
      formData.append("address", houseData.address)
      formData.append("rooms", houseData.rooms.toString())
      formData.append("floor", houseData.floor.toString())
      formData.append("allFloor", houseData.allFloor.toString())
      formData.append("area", houseData.area.toString())
      formData.append("categoryId", houseData.categoryId)
      formData.append("description", houseData.description)
      formData.append("price", +houseData.price)

      if (houseData.images && houseData.images.length > 0) {
        houseData.images.forEach((image, index) => {
          formData.append("images", image)
        })
      }

      const response = await axios.post("http://16.171.142.96:3000/houses", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("Uy muvaffaqiyatli qo'shildi:", response.data)

      if (onAddHouse) {
        onAddHouse(response.data)
      }

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
      })
      setErrors({})

      alert("Uy muvaffaqiyatli qo'shildi!")
    } catch (error) {
      console.error("Uy qo'shishda xatolik:", error)
      if (error.response && error.response.data && error.response.data.message) {
        const errorMessages = Array.isArray(error.response.data.message)
          ? error.response.data.message.join("\n")
          : error.response.data.message
        alert(`Xatolik: ${errorMessages}`)
      } else {
        alert("Uy qo'shishda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass = (field) =>
    `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors[field] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
    }`

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-blue-600">Yangi Uy qo'shish</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <TextField className={`${inputClass("title")}`}
            label="Nomi"
            type="text"
            name="title"
            value={houseData.title}
            onChange={handleInputChange}
            placeholder="Masalan: Qora Qush uy"
          >
          </TextField>
          {errors.title && <span className="text-red-500 text-sm mt-1">{errors.title}</span>}
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-2">Manzil *</label>
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
          <label className="text-gray-700 font-medium mb-2">Xonalar soni *</label>
          <input
            type="number"
            name="rooms"
            value={houseData.rooms}
            onChange={handleInputChange}
            placeholder="Masalan: 3"
            className={inputClass("rooms")}
          />
          {errors.rooms && <span className="text-red-500 text-sm mt-1">{errors.rooms}</span>}
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-2">Qavat *</label>
          <input
            type="number"
            name="floor"
            value={houseData.floor}
            onChange={handleInputChange}
            placeholder="Masalan: 2"
            className={inputClass("floor")}
          />
          {errors.floor && <span className="text-red-500 text-sm mt-1">{errors.floor}</span>}
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-2">Umumiy qavatlar *</label>
          <input
            type="number"
            name="allFloor"
            value={houseData.allFloor}
            onChange={handleInputChange}
            placeholder="Masalan: 5"
            className={inputClass("allFloor")}
          />
          {errors.allFloor && <span className="text-red-500 text-sm mt-1">{errors.allFloor}</span>}
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-2">Maydon (m²) *</label>
          <input
            type="number"
            step="0.1"
            name="area"
            value={houseData.area}
            onChange={handleInputChange}
            placeholder="Masalan: 120.5"
            className={inputClass("area")}
          />
          {errors.area && <span className="text-red-500 text-sm mt-1">{errors.area}</span>}
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-2">Kategoriya *</label>
          <select
            name="categoryId"
            value={houseData.categoryId}
            onChange={handleInputChange}
            className={inputClass("categoryId")}
            disabled={categoriesLoading}
          >
            <option value="">{categoriesLoading ? "Kategoriyalar yuklanmoqda..." : "Kategoriya tanlang"}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <span className="text-red-500 text-sm mt-1">{errors.categoryId}</span>}
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className="text-gray-700 font-medium mb-2">Narxi (so'm) *</label>
          <input
            type="number"
            name="price"
            value={houseData.price}
            onChange={handleInputChange}
            placeholder="Masalan: 500000000"
            className={inputClass("price")}
          />
          {errors.price && <span className="text-red-500 text-sm mt-1">{errors.price}</span>}
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className="text-gray-700 font-medium mb-2">Tavsif *</label>
          <textarea
            name="description"
            value={houseData.description}
            onChange={handleInputChange}
            placeholder="Uy haqida batafsil ma'lumot..."
            rows={4}
            className={inputClass("description")}
          />
          {errors.description && <span className="text-red-500 text-sm mt-1">{errors.description}</span>}
        </div>
      </div>

      <div className="mt-6">
        <label className="text-gray-700 font-medium mb-2 block">Rasmlar yuklash * (kamida 3 ta)</label>

        <label className="flex flex-col items-center px-6 py-4 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-100 transition">
          <Upload className="text-blue-600 mb-2" size={24} />
          <span className="text-blue-600 font-medium mb-1">Rasm tanlash</span>
          <span className="text-gray-500 text-sm">
            {houseData.images && houseData.images.length > 0
              ? `${houseData.images.length} ta rasm tanlandi`
              : "Yoki rasmni shu yerga torting"}
          </span>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
        </label>

        {errors.images && <span className="text-red-500 text-sm mt-1">{errors.images}</span>}

        {houseData.images && houseData.images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {houseData.images.map((image, idx) => (
              <div key={idx} className="relative group rounded-lg overflow-hidden border">
                <img
                  src={URL.createObjectURL(image) || "/placeholder.svg"}
                  alt={`Uy rasm ${idx}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
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
        disabled={isLoading}
        className="mt-8 w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
      >
        <Save size={20} className="mr-2" />
        {isLoading ? "Saqlanmoqda..." : "Saqlash"}
      </button>
    </div>
  )
}
