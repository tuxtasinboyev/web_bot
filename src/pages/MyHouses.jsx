"use client"

import { useState, useEffect } from "react"
import { MapPin, Bed, X, ChevronLeft, ChevronRight, Maximize, Edit, Trash2, Plus, Save, Upload } from "lucide-react"
import { TextField } from "@mui/material"
import axios from "axios"

export default function MyHouses() {
  const [selectedHouse, setSelectedHouse] = useState(null)
  const [editingHouse, setEditingHouse] = useState(null)
  const [deletingHouse, setDeletingHouse] = useState(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [isAddingHouse, setIsAddingHouse] = useState(false)
  const [newImages, setNewImages] = useState([])
  const [newHouse, setNewHouse] = useState({
    title: "",
    description: "",
    address: "",
    price: "",
    rooms: "",
    area: "",
    floor: "",
    allFloor: "",
    categoryId: "",
    images: [],
  })

  const [categories, setCategories] = useState([])
  const [myHouses, setMyHouses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_BASE_URL = "https://houzing.botify.uz"

  const getAuthToken = () => {
    return localStorage.getItem("accessToken")
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`)
      if (!response.ok) throw new Error("Failed to fetch categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      setError("Kategoriyalarni yuklashda xatolik yuz berdi")
    }
  }

  const fetchMyHouses = async () => {
    try {
      setLoading(true)
      const token = getAuthToken()
      if (!token) {
        throw new Error("Access token not found")
      }

      const response = await fetch(`${API_BASE_URL}/houses/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) throw new Error("Failed to fetch houses")
      const data = await response.json()
      setMyHouses(data)
    } catch (error) {
      console.error("Error fetching houses:", error)
      setError("Uylarni yuklashda xatolik yuz berdi")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchMyHouses()
  }, [])

  const openModal = (house) => {
    setSelectedHouse(house)
    setActiveImageIndex(0)
    setIsModalOpen(true)
    document.body.style.overflow = "hidden"
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedHouse(null)
    document.body.style.overflow = "auto"
  }

  const openEditModal = (house) => {
    setEditingHouse({
      ...house,
      categoryId: house.category?.id || house.categoryId || "",
    })
    setIsEditModalOpen(true)
    document.body.style.overflow = "hidden"
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setEditingHouse(null)
    setNewImages([])
    document.body.style.overflow = "auto"
  }

  const openDeleteModal = (house) => {
    setDeletingHouse(house)
    setIsDeleteModalOpen(true)
    document.body.style.overflow = "hidden"
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setDeletingHouse(null)
    document.body.style.overflow = "auto"
  }

  const openImageModal = () => {
    setIsImageModalOpen(true)
  }

  const closeImageModal = () => {
    setIsImageModalOpen(false)
  }

  const nextImage = () => {
    const currentHouse = isAddingHouse ? newHouse : selectedHouse
    if (currentHouse && currentHouse.images.length > 0) {
      setActiveImageIndex((prevIndex) => (prevIndex === currentHouse.images.length - 1 ? 0 : prevIndex + 1))
    }
  }

  const prevImage = () => {
    const currentHouse = isAddingHouse ? newHouse : selectedHouse
    if (currentHouse && currentHouse.images.length > 0) {
      setActiveImageIndex((prevIndex) => (prevIndex === 0 ? currentHouse.images.length - 1 : prevIndex - 1))
    }
  }

  const handleEditHouse = (e) => {
    const { name, value } = e.target
    const numberFields = ["price", "rooms", "area", "floor", "allFloor", "categoryId"]

    setEditingHouse({
      ...editingHouse,
      [name]: numberFields.includes(name) && value !== "" ? Number(value) : value,
    })
  }



  const handleSaveEdit = async () => {
    try {
      const token = getAuthToken()
      if (!token) {
        alert("Access token topilmadi")
        return
      }

      const formData = new FormData()

      // Add only changed fields to FormData
      if (editingHouse.title) formData.append("title", editingHouse.title)
      if (editingHouse.price) formData.append("price", editingHouse.price.toString())
      if (editingHouse.rooms) formData.append("rooms", editingHouse.rooms.toString())
      if (editingHouse.area) formData.append("area", editingHouse.area.toString())
      if (editingHouse.floor) formData.append("floor", editingHouse.floor.toString())
      if (editingHouse.allFloor) formData.append("allFloor", editingHouse.allFloor.toString())
      if (editingHouse.address) formData.append("address", editingHouse.address)
      if (editingHouse.description) formData.append("description", editingHouse.description)
      if (editingHouse.categoryId) formData.append("categoryId", editingHouse.categoryId.toString())

      // Add new images if any
      newImages.forEach((image, index) => {
        if (image instanceof File) {
          formData.append("images", image)
        }
      })

      const response = await fetch(`${API_BASE_URL}/houses/${editingHouse.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to update house")

      // Refresh houses list
      await fetchMyHouses()
      closeEditModal()
      closeModal()
      alert("Uy muvaffaqiyatli yangilandi!")
    } catch (error) {
      console.error("Error updating house:", error)
      alert("Uyni yangilashda xatolik yuz berdi")
    }
  }

  const handleDeleteHouse = async () => {
    try {
      const token = getAuthToken()
      if (!token) {
        alert("Access token topilmadi")
        return
      }

      const response = await fetch(`${API_BASE_URL}/houses/${deletingHouse.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) throw new Error("Failed to delete house")

      // Refresh houses list
      await fetchMyHouses()
      closeDeleteModal()
      closeModal()
      alert("Uy muvaffaqiyatli o'chirildi!")
    } catch (error) {
      console.error("Error deleting house:", error)
      alert("Uyni o'chirishda xatolik yuz berdi")
    }
  }

  const handleImageUpload = (e, isNewHouse = false) => {
    const files = Array.from(e.target.files)

    if (isNewHouse) {
      setNewImages((prev) => [...prev, ...files])
      setNewHouse((prev) => ({
        ...prev,
        images: [...prev.images, ...files.map((file) => URL.createObjectURL(file))],
      }))
    } else {
      setNewImages((prev) => [...prev, ...files])
      setEditingHouse((prev) => ({
        ...prev,
        images: [...prev.images, ...files.map((file) => URL.createObjectURL(file))],
      }))
    }
  }

  const removeImage = (index, isNew = false) => {
    if (isNew) {
      const updatedImages = [...newImages]
      updatedImages.splice(index, 1)
      setNewImages(updatedImages)

      const updatedNewHouseImages = [...newHouse.images]
      updatedNewHouseImages.splice(index, 1)
      setNewHouse({ ...newHouse, images: updatedNewHouseImages })
    } else {
      const updatedHouse = { ...editingHouse }
      updatedHouse.images.splice(index, 1)
      setEditingHouse(updatedHouse)
    }
  }

  const openAddHouseModal = () => {
    setIsAddingHouse(true)
    setNewHouse({
      title: "",
      description: "",
      address: "",
      price: "",
      rooms: "",
      area: "",
      floor: "",
      allFloor: "",
      categoryId: "",
      images: [],
    })
    setNewImages([])
    document.body.style.overflow = "hidden"
  }

  const closeAddHouseModal = () => {
    setIsAddingHouse(false)
    setNewHouse({
      title: "",
      description: "",
      address: "",
      price: "",
      rooms: "",
      area: "",
      floor: "",
      allFloor: "",
      categoryId: "",
      images: [],
    })
    setNewImages([])
    document.body.style.overflow = "auto"
  }


  const handleAddHouseSave = async () => {
    // 1️⃣ Majburiy maydonlarni tekshiramiz
    if (
      !newHouse.title ||
      !newHouse.price ||
      !newHouse.rooms ||
      !newHouse.area ||
      !newHouse.address ||
      !newHouse.categoryId ||
      !newHouse.description
    ) {
      alert("Iltimos, barcha majburiy maydonlarni to‘ldiring!");
      return;
    }

    // 2️⃣ Rasm sonini tekshiramiz
    if (newImages.length < 3) {
      alert("Kamida 3 ta rasm yuklash kerak!");
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        alert("Access token topilmadi");
        return;
      }

      // 3️⃣ FormData tayyorlaymiz
      const formData = new FormData();
      formData.append("title", newHouse.title);
      formData.append("price", Number(newHouse.price).toString());
      formData.append("rooms", Number(newHouse.rooms).toString());
      formData.append("area", Number(newHouse.area).toString());
      formData.append("address", newHouse.address);
      formData.append("categoryId", Number(newHouse.categoryId).toString());
      formData.append("description", newHouse.description);

      if (newHouse.floor)
        formData.append("floor", Number(newHouse.floor).toString());
      if (newHouse.allFloor)
        formData.append("allFloor", Number(newHouse.allFloor).toString());

      // 4️⃣ Rasmlarni qo‘shamiz
      newImages.forEach((image) => formData.append("images", image));

      // 5️⃣ Axios orqali so‘rov yuboramiz
      const response = await axios.post(`${API_BASE_URL}/houses`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Server javobi:", response.data);

      // 6️⃣ Uyni qo‘shgandan keyin ro‘yxatni yangilaymiz
      await fetchMyHouses();
      closeAddHouseModal();
      alert("Uy muvaffaqiyatli qo‘shildi!");
    } catch (error) {
      alert("Uy qo‘shishda xatolik yuz berdi");
    }
  };


  const handleNewHouseChange = (e) => {
    const { name, value } = e.target
    const numberFields = ["price", "rooms", "area", "floor", "allFloor", "categoryId"]

    setNewHouse({
      ...newHouse,
      [name]: numberFields.includes(name) && value !== "" ? Number(value) : value,
    })
  }



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Uylar yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null)
              fetchMyHouses()
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Qayta urinish
          </button>
        </div>
      </div>
    )
  }

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
            onClick={openAddHouseModal}
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
                    src={
                      house.images && house.images.length > 0
                        ? house.images[0]
                        : "/placeholder.svg?height=200&width=300"
                    }
                    alt={house.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-medium px-2.5 py-0.5 rounded">
                    {house.category?.name || "Kategoriya"}
                  </div>
                </div>

                {/* Uy ma'lumotlari */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-800">{house.title}</h3>
                    <div className="text-lg font-bold text-blue-600">${house.price?.toLocaleString()}</div>
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
                  <button onClick={closeModal} className="p-1 rounded-full hover:bg-gray-200">
                    <X size={24} />
                  </button>
                </div>

                {/* Rasmlar karuseli */}
                <div className="relative">
                  <div className="h-80 overflow-hidden">
                    <img
                      src={
                        selectedHouse.images && selectedHouse.images.length > 0
                          ? selectedHouse.images[activeImageIndex]
                          : "/placeholder.svg?height=320&width=600"
                      }
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
                          className={`w-2 h-2 rounded-full ${index === activeImageIndex ? "bg-white" : "bg-white bg-opacity-50"
                            }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{selectedHouse.title}</h3>
                      <p className="text-blue-600 text-xl font-semibold">${selectedHouse.price?.toLocaleString()}</p>
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
                        <span>
                          {selectedHouse.floor}/{selectedHouse.allFloor} qavat
                        </span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <span className="mr-2 text-gray-500">🏠</span>
                      <span>{selectedHouse.category?.name || "Kategoriya"}</span>
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
                  <button onClick={closeEditModal} className="p-1 rounded-full hover:bg-gray-200">
                    <X size={24} />
                  </button>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Uy nomi</label>
                      <input
                        type="text"
                        name="title"
                        value={editingHouse.title}
                        onChange={handleEditHouse}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Narxi ($)</label>
                      <input
                        type="number"
                        name="price"
                        value={editingHouse.price}
                        onChange={handleEditHouse}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Xonalar soni</label>
                      <input
                        type="number"
                        name="rooms"
                        value={editingHouse.rooms}
                        onChange={handleEditHouse}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Maydoni (m²)</label>
                      <input
                        type="number"
                        step="0.01"
                        name="area"
                        value={editingHouse.area}
                        onChange={handleEditHouse}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Qavat</label>
                      <input
                        type="number"
                        name="floor"
                        value={editingHouse.floor}
                        onChange={handleEditHouse}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Umumiy qavatlar</label>
                      <input
                        type="number"
                        name="allFloor"
                        value={editingHouse.allFloor}
                        onChange={handleEditHouse}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Manzil</label>
                      <input
                        type="text"
                        name="address"
                        value={editingHouse.address}
                        onChange={handleEditHouse}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kategoriya</label>
                      <select
                        name="categoryId"
                        value={editingHouse.categoryId}
                        onChange={handleEditHouse}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Kategoriyani tanlang</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tavsif</label>
                    <textarea
                      name="description"
                      value={editingHouse.description}
                      onChange={handleEditHouse}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rasmlar</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {/* Mavjud rasmlar */}
                      {editingHouse.images &&
                        editingHouse.images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image || "/placeholder.svg"}
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

                      {/* Rasm yuklash tugmasi */}
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-24 cursor-pointer hover:border-blue-500">
                        <Upload size={24} className="text-gray-400 mb-1" />
                        <span className="text-sm text-gray-500">Rasm qo'shish</span>
                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
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
                  "{deletingHouse.title}" uyini rostdan ham o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.
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

                {(() => {
                  const currentHouse = isAddingHouse ? newHouse : selectedHouse
                  return (
                    <div className="h-full overflow-hidden">
                      <img
                        src={
                          currentHouse.images && currentHouse.images.length > 0
                            ? currentHouse.images[activeImageIndex]
                            : "/placeholder.svg?height=600&width=800"
                        }
                        alt={currentHouse.title}
                        className="w-full h-full object-contain max-h-[80vh]"
                      />

                      {currentHouse.images && currentHouse.images.length > 1 && (
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
                                className={`w-2 h-2 rounded-full ${index === activeImageIndex ? "bg-white" : "bg-white bg-opacity-50"
                                  }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )
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
        <TextField
          type="text"
          name="title"
          label="Nomi *"
          value={newHouse.title}
          onChange={handleNewHouseChange}
          fullWidth
          required
        />
        <TextField
          type="number"
          name="price"
          label="Narxi ($) *"
          value={newHouse.price}
          onChange={handleNewHouseChange}
          fullWidth
          required
        />
        <TextField
          type="number"
          name="rooms"
          label="Xonalar soni *"
          value={newHouse.rooms}
          onChange={handleNewHouseChange}
          fullWidth
          required
        />
        <TextField
          type="number"
          name="area"
          label="Maydoni (m²) *"
          value={newHouse.area}
          onChange={handleNewHouseChange}
          fullWidth
          required
        />
        <TextField
          type="text"
          name="address"
          label="Manzil *"
          value={newHouse.address}
          onChange={handleNewHouseChange}
          fullWidth
          required
        />
        <select
          name="categoryId"
          value={newHouse.categoryId}
          onChange={handleNewHouseChange}
          className="w-full px-4 py-2 border rounded-md"
          required
        >
          <option value="">Kategoriyani tanlang *</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <TextField
          type="number"
          name="floor"
          label="Qavat (ixtiyoriy)"
          value={newHouse.floor}
          onChange={handleNewHouseChange}
          fullWidth
        />
        <TextField
          type="number"
          name="allFloor"
          label="Umumiy qavatlar (ixtiyoriy)"
          value={newHouse.allFloor}
          onChange={handleNewHouseChange}
          fullWidth
        />
      </div>

      <TextField
        name="description"
        label="Tavsif *"
        value={newHouse.description}
        onChange={handleNewHouseChange}
        fullWidth
        multiline
        rows={4}
        required
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rasmlar (kamida 3 ta) *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {newHouse.images.map((img, idx) => (
            <div key={idx} className="relative">
              <img
                src={img || "/placeholder.svg"}
                alt=""
                className="w-full h-24 object-cover rounded-md"
              />
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
        <p className="text-sm text-gray-500">
          Yuklangan rasmlar: {newImages.length}/3 (minimum)
        </p>
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
  )
}
