import React, { useState, useEffect } from "react";
import { Trash2, Edit3, PlusCircle, Check, X, Search } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editCategory, setEditCategory] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal holati
  const [showModal, setShowModal] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate()
  // Demo ma'lumotlarni yuklash
  useEffect(() => {
    axios.get('https://houzing.botify.uz/categories')
      .then(res => {
        setCategories(res.data);
      })
      .catch(err => console.error(err));
    // setCategories([
    //   { id: 1, name: "Kvartira", createdAt: "2023-01-10" },
    //   { id: 2, name: "Xususiy uy", createdAt: "2023-01-15" },
    //   { id: 3, name: "Ofis", createdAt: "2023-02-01" },
    //   { id: 4, name: "Hostel", createdAt: "2023-02-02" },
    //   { id: 5, name: "Vila", createdAt: "2023-02-03" },
    //   { id: 6, name: "Dacha", createdAt: "2023-02-04" },
    // ]);
  }, []);

  // ➕ Yangi kategoriya qo‘shish

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login')
        return
      }
      const response = await axios.post(
        "https://houzing.botify.uz/categories",
        { name: newCategory.trim() },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const newCatFromServer = response.data;

      setCategories((prev) => [...prev, newCatFromServer]);
      setNewCategory("");
      setShowModal(false);
      setCurrentPage(Math.ceil((categories.length + 1) / itemsPerPage));

    } catch (error) {
      console.error(error);
      alert("Category qo'shilmadi");
    }
  };



  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login')
        return
      }
      await axios.delete(`https://houzing.botify.uz/categories/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      setCategories((prev) => prev.filter((cat) => cat.id !== id));

    } catch (error) {
      console.error(error);
      alert("Category o'chirilmadi");
    }
  };
  // ✏️ Tahrirlashni boshlash
  const handleEditStart = (cat) => {
    setEditCategory(cat.id);
    setEditValue(cat.name);
  };

  // 💾 Saqlash
  const handleEditSave = async (id) => {
    if (!editValue.trim()) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login')
        return
      }
      const response = await axios.put(
        `https://houzing.botify.uz/categories/${id}`,
        { name: editValue.trim() },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const updatedCategory = response.data;

      // Frontend state-ni yangilaymiz
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? updatedCategory : cat))
      );

      setEditCategory(null);
      setEditValue("");

    } catch (error) {
      console.error(error);
      alert("Category tahrirlanmadi");
    }
  };

  // Qidiruv
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredCategories.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  return (
    <div className="p-6 bg-gray-50 rounded-xl shadow">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">
        📂 Kategoriyalar boshqaruvi
      </h2>

      {/* Add new category button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <PlusCircle size={18} />
          Yangi kategoriya qo‘shish
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 mb-4">
        <Search className="text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Kategoriya qidirish..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Category list */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700">
              <th className="p-3">#</th>
              <th className="p-3">Kategoriya nomi</th>
              <th className="p-3">Yaratilgan sana</th>
              <th className="p-3 text-center">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((cat, index) => (
              <tr key={cat.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{indexOfFirst + index + 1}</td>
                <td className="p-3">
                  {editCategory === cat.id ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    cat.name
                  )}
                </td>
                <td className="p-3 text-gray-500">{cat.createdAt}</td>
                <td className="p-3 flex items-center justify-center gap-2">
                  {editCategory === cat.id ? (
                    <>
                      <button
                        onClick={() => handleEditSave(cat.id)}
                        className="text-green-600 hover:bg-green-100 p-2 rounded-lg"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => setEditCategory(null)}
                        className="text-gray-500 hover:bg-gray-100 p-2 rounded-lg"
                      >
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditStart(cat)}
                        className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="text-red-600 hover:bg-red-100 p-2 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {filteredCategories.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  Kategoriyalar topilmadi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            ⬅️
          </button>
          <span className="text-sm text-gray-600">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            ➡️
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-blue-600">
              Yangi kategoriya qo‘shish
            </h3>
            <input
              type="text"
              placeholder="Kategoriya nomi"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Qo‘shish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
