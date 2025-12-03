import React, { useState, useEffect } from 'react';
import {
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Alert, Snackbar } from '@mui/material';

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [newUser, setNewUser] = useState({
    name: '',
    phone: '',
    password: '',
    role: 'TENANT',
    imgUrl: '',
    file: null
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // success, error, warning, info
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  // Foydalanuvchilarni olish
  const fetchUsers = async () => {
    try {
      const res = await axios.get('https://houzing.botify.uz/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.users);
      setFilteredUsers(res.data.users);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
      setLoading(false);
      setSnackbar({
        open: true,
        message: "Foydalanuvchilar muvaffaqiyatli yuklandi",
        severity: "success",
      });
    } catch (error) {
      console.error('Foydalanuvchilarni yuklashda xatolik:', error);
      setLoading(false);
      setSnackbar({
        open: true,
        message: "Foydalanuvchilarni yuklashda xatolik yuz berdi",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    if (!token) navigate('/login');
    else fetchUsers();
  }, [token, navigate]);

  // Qidiruv
  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, users]);

  const usersPerPage = 5;
  const totalFilteredPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleSearch = (e) => setSearchTerm(e.target.value);

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'OWNER': return 'bg-blue-100 text-blue-800';
      case 'TENANT': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Foydalanuvchini tahrirlash
  const handleEditUser = (user) => {
    setSelectedUser({ ...user, file: null, password: '' });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      let res;

      if (selectedUser.file) {
        const formData = new FormData();
        formData.append('imgUrl', selectedUser.file);
        Object.keys(selectedUser).forEach((key) => {
          if (key !== "imgUrl" && key !== "file" && selectedUser[key] !== undefined && selectedUser[key] !== null) {
            formData.append(key, selectedUser[key]);
          }
        });

        res = await axios.put(
          `https://houzing.botify.uz/users/${parseInt(selectedUser.id)}`,
          formData,
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
        );
        
      } else {
        const userData = {
          name: selectedUser.name,
          phone: selectedUser.phone,
          role: selectedUser.role
        };
        if (selectedUser.password?.trim()) userData.password = selectedUser.password;

        res = await axios.put(
          `https://houzing.botify.uz/users/${parseInt(selectedUser.id)}`,
          userData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      
      }

      // Yangilangan ma'lumotlarni olish
      await fetchUsers();
      setShowEditModal(false);
      setSelectedUser(null);
      setSnackbar({
        open: true,
        message: "Foydalanuvchi muvaffaqiyatli yangilandi",
        severity: "success",
      });
    } catch (error) {
      console.error(error.response?.data || error.message);
      setSnackbar({
        open: true,
        message: "Foydalanuvchini yangilashda xatolik yuz berdi: " + (error.response?.data?.message || error.message),
        severity: "error",
      });
    }
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`https://houzing.botify.uz/users/${parseInt(selectedUser.id)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // To'g'ridan-to'g'ri state yangilash o'rniga, foydalanuvchilarni qayta yuklash
      await fetchUsers();
      setShowDeleteModal(false);
      setSelectedUser(null);
      setSnackbar({
        open: true,
        message: "Foydalanuvchi muvaffaqiyatli o'chirildi",
        severity: "success",
      });
    } catch (error) {
      console.error('Foydalanuvchini o\'chirishda xatolik:', error);
      setSnackbar({
        open: true,
        message: "Foydalanuvchini o'chirishda xatolik yuz berdi: " + (error.response?.data?.message || error.message),
        severity: "error",
      });
    }
  };

  // TO'G'IRLANGAN: Yangi foydalanuvchi ma'lumotlarini o'zgartirish
  const handleNewUserChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === 'file') {
      const file = files?.[0];
      if (file) {
        setNewUser(prev => ({
          ...prev,
          file: file,
          imgUrl: URL.createObjectURL(file)
        }));
      }
    } else {
      setNewUser(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // TO'G'IRLANGAN: Yangi foydalanuvchi qo'shish
  const handleAddUser = async () => {
    // Validatsiya
    if (!newUser.name.trim() || !newUser.phone.trim() || !newUser.password.trim()) {
      alert('Ism, telefon raqami va parol majburiy maydonlar!');
      return;
    }

    try {
      const formData = new FormData();

      // Asosiy ma'lumotlarni qo'shish
      formData.append('name', newUser.name.trim());
      formData.append('phone', newUser.phone.trim());
      formData.append('password', newUser.password);
      formData.append('role', newUser.role);

      // Agar fayl tanlangan bo'lsa, uni qo'shish
      if (newUser.file) {
        formData.append('imgUrl', newUser.file);
      }

      const response = await axios.post('https://houzing.botify.uz/users', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // MUAMMO HAL QILINDI: Response ichidan yangi user ma'lumotlarini olish va ro'yxatga qo'shish
      const newUserData = response.data.data || response.data;

      // Eski ro'yxatga yangi userni qo'shish (oxirgi elementga emas, boshiga qo'shish)
      setUsers(prevUsers => [newUserData, ...prevUsers]);
      setFilteredUsers(prevUsers => [newUserData, ...prevUsers]);
      setTotal(prevTotal => prevTotal + 1);

      // Formani tozalash
      setNewUser({
        name: '',
        phone: '',
        password: '',
        role: 'TENANT',
        imgUrl: '',
        file: null
      });

      setShowAddModal(false);
      setSnackbar({
        open: true,
        message: "Foydalanuvchi muvaffaqiyatli qo'shildi!",
        severity: "success",
      });

    } catch (error) {
      console.error('Foydalanuvchi qo\'shishda xatolik:', error);
      const errorMessage = error.response?.data?.message || error.message;
      setSnackbar({
        open: true,
        message: "Foydalanuvchi qo'shishda xatolik yuz berdi: " + errorMessage,
        severity: "error",
      });
    }
  };

  // TO'G'IRLANGAN: Modal yopish funksiyasi
  const closeAddModal = () => {
    setShowAddModal(false);
    // Formani tozalash
    setNewUser({
      name: '',
      phone: '',
      password: '',
      role: 'TENANT',
      imgUrl: '',
      file: null
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Foydalanuvchilar Boshqaruvi</h2>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Foydalanuvchi nomi yoki telefon raqami..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center">
            <PlusIcon className="h-5 w-5 mr-1" />
            Yangi foydalanuvchi
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800">{users.length}</h3>
          <p className="text-gray-600">Jami foydalanuvchilar</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800">{users.filter(u => u.role === 'ADMIN').length}</h3>
          <p className="text-gray-600">Administratorlar</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800">{users.filter(u => u.role === 'TENANT').length}</h3>
          <p className="text-gray-600">Ijarachilar</p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Foydalanuvchi
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telefon
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qo'shilgan sana
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harakatlar
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.length > 0 ? (
                currentUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.imgUrl ? (
                            <img className="h-10 w-10 rounded-full" src={user.imgUrl} alt={user.name} />
                          ) : (
                            <UserCircleIcon className="h-10 w-10 text-gray-400" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('uz-UZ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => handleEditUser(user)}
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    Hech qanday foydalanuvchi topilmadi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Sahifalash */}
        {totalFilteredPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Ko'rsatilmoqda <span className="font-medium">{indexOfFirstUser + 1}</span> dan{' '}
                  <span className="font-medium">
                    {indexOfLastUser > filteredUsers.length ? filteredUsers.length : indexOfLastUser}
                  </span> gacha{' '}
                  jami <span className="font-medium">{filteredUsers.length}</span> ta natija
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Oldingi</span>
                    &larr;
                  </button>

                  {Array.from({ length: totalFilteredPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalFilteredPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Keyingi</span>
                    &rarr;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tahrirlash modali */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Foydalanuvchini tahrirlash</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ism</label>
              <input
                type="text"
                value={selectedUser.name}
                onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon raqami</label>
              <input
                type="text"
                value={selectedUser.phone}
                onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Parol (o'zgarishsiz qoldirish uchun bo'sh qoldiring)</label>
              <input
                type="password"
                value={selectedUser.password || ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
                placeholder="Yangi parol (ixtiyoriy)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <select
                value={selectedUser.role}
                onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="TENANT">Ijarachi</option>
                <option value="OWNER">Egasi</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profil rasmi (ixtiyoriy)
              </label>

              <div className="flex items-center space-x-4">
                {selectedUser.imgUrl ? (
                  <img
                    src={selectedUser.imgUrl}
                    alt="Preview"
                    className="w-14 h-14 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                    Yo'q
                  </div>
                )}

                <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 transition">
                  Rasmdan tanlash
                  <input
                    type="file"
                    name="imgUrl"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedUser(prev => ({
                          ...prev,
                          file, // serverga yuborish uchun
                          imgUrl: URL.createObjectURL(file) // preview
                        }));
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                }}
              >
                Bekor qilish
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={handleSaveEdit}
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* O'chirishni tasdiqlash modali */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">O'chirishni tasdiqlash</h3>
            <p className="text-gray-600 mb-6">
              <span className="font-semibold">{selectedUser.name}</span> ismli foydalanuvchini o'chirishni istaysizmi?
              Bu amalni ortga qaytarib bo'lmaydi.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUser(null);
                }}
              >
                Bekor qilish
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={confirmDelete}
              >
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TO'G'IRLANGAN: Yangi foydalanuvchi qo'shish modali */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Yangi foydalanuvchi qo'shish</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ism <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={handleNewUserChange}
                  placeholder="To'liq ism"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon raqami <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={newUser.phone}
                  onChange={handleNewUserChange}
                  placeholder="+998901234567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parol <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleNewUserChange}
                  placeholder="Parol"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleNewUserChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="TENANT">Ijarachi</option>
                  <option value="OWNER">Egasi</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profil rasmi (ixtiyoriy)
              </label>

              <div className="flex items-center space-x-4">
                {newUser.imgUrl ? (
                  <img
                    src={newUser.imgUrl}
                    alt="Preview"
                    className="w-14 h-14 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                    Yo'q
                  </div>
                )}

                <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 transition">
                  Rasmdan tanlash
                  <input
                    type="file"
                    name="imgUrl"
                    onChange={handleNewUserChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={closeAddModal}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Bekor qilish
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center disabled:opacity-50"
                onClick={handleAddUser}
                disabled={!newUser.name.trim() || !newUser.phone.trim() || !newUser.password.trim()}
              >
                <PlusIcon className="h-5 w-5 mr-1" />
                Qo'shish
              </button>
            </div>
          </div>
        </div>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UsersTab;