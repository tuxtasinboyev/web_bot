import React, { useState, useEffect } from 'react';
import {
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { file } from 'zod';

const UsersTab = () => {
  // State for users data
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    phone: '',
    password: '',
    role: 'TENANT',
    imgUrl: file
  });

  const [showAddModal, setShowAddModal] = useState(false);


  // Mock data - real loyihada API dan keladi
  useEffect(() => {
    // API chaqiruvini simulatsiya qilish
    setTimeout(() => {
      const mockUsers = [
        { id: 1, name: 'John Doe', phone: '+998901234567', role: 'ADMIN', createdAt: '2023-01-15', imgUrl: '' },
        { id: 2, name: 'Jane Smith', phone: '+998907654321', role: 'OWNER', createdAt: '2023-02-20', imgUrl: '' },
        { id: 3, name: 'Robert Johnson', phone: '+998935791234', role: 'TENANT', createdAt: '2023-03-10', imgUrl: '' },
        { id: 4, name: 'Sarah Williams', phone: '+998941236547', role: 'OWNER', createdAt: '2023-04-05', imgUrl: '' },
        { id: 5, name: 'Michael Brown', phone: '+998501238974', role: 'TENANT', createdAt: '2023-05-12', imgUrl: '' },
        { id: 6, name: 'Emily Davis', phone: '+998331234567', role: 'OWNER', createdAt: '2023-06-18', imgUrl: '' },
        { id: 7, name: 'David Wilson', phone: '+998971235689', role: 'TENANT', createdAt: '2023-07-22', imgUrl: '' },
        { id: 8, name: 'Lisa Miller', phone: '+998901239876', role: 'ADMIN', createdAt: '2023-08-30', imgUrl: '' },
        { id: 9, name: 'James Taylor', phone: '+998941238765', role: 'TENANT', createdAt: '2023-09-05', imgUrl: '' },
        { id: 10, name: 'Susan Anderson', phone: '+998331239876', role: 'OWNER', createdAt: '2023-10-15', imgUrl: '' }
      ];
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  // Foydalanuvchilarni qidirish bo'yicha filtrlash
  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, users]);

  // Sahifalash parametrlari
  const usersPerPage = 5;
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Joriy foydalanuvchilarni olish
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Sahifani o'zgartirish
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Qidiruvni boshqarish
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Foydalanuvchini tahrirlash
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  // Tahrirlangan foydalanuvchini saqlash
  const handleSaveEdit = () => {
    // Real loyihada bu yerda API chaqiruvi bo'ladi
    const updatedUsers = users.map(user =>
      user.id === selectedUser.id ? selectedUser : user
    );
    setUsers(updatedUsers);
    setShowEditModal(false);
    setSelectedUser(null);
  };

  // Foydalanuvchini o'chirish
  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  // O'chirishni tasdiqlash
  const confirmDelete = () => {
    // Real loyihada bu yerda API chaqiruvi bo'ladi
    const updatedUsers = users.filter(user => user.id !== selectedUser.id);
    setUsers(updatedUsers);
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  // Yangi foydalanuvchi ma'lumotlarini o'zgartirish
  const handleNewUserChange = (e) => {
    const { name, files, type, value } = e.target;
    if (type === 'file' && files[0]) {
      // Faylni preview qilish uchun URL
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setNewUser((prev) => ({ ...prev, [name]: imageUrl, file: file }));
    } else {
      setNewUser((prev) => ({ ...prev, [name]: value }));
    }
  };


  // Yangi foydalanuvchi qo'shish
  const handleAddUser = () => {
    // Real loyihada bu yerda API chaqiruvi bo'ladi
    const userToAdd = {
      ...newUser,
      id: users.length + 1,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers([...users, userToAdd]);
    setNewUser({
      name: '',
      phone: '',
      password: '',
      role: 'TENANT',
      imgUrl: ''
    });
  };

  // Rol uchun ranglar
  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'OWNER': return 'bg-blue-100 text-blue-800';
      case 'TENANT': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Yuklash holatini ko'rsatish
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
                      {user.createdAt}
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
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    Hech qanday foydalanuvchi topilmadi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Sahifalash */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
                  <span className="font-medium">
                    {indexOfLastUser > filteredUsers.length ? filteredUsers.length : indexOfLastUser}
                  </span>{' '}
                  of <span className="font-medium">{filteredUsers.length}</span> results
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

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
                    disabled={currentPage === totalPages}
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

      {/* Yangi foydalanuvchi qo'shish formasi */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Yangi foydalanuvchi qo'shish</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ism</label>
            <input
              type="text"
              name="name"
              value={newUser.name}
              onChange={handleNewUserChange}
              placeholder="To'liq ism"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon raqami</label>
            <input
              type="text"
              name="phone"
              value={newUser.phone}
              onChange={handleNewUserChange}
              placeholder="+998901234567"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parol</label>
            <input
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleNewUserChange}
              placeholder="Parol"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            {/* Preview */}
            {newUser.imgUrl ? (
              <img
                src={newUser.imgUrl}
                alt="Preview"
                className="w-14 h-14 rounded-full object-cover border"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                Yo‘q
              </div>
            )}

            {/* Button-style upload */}
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

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center disabled:opacity-50"
          onClick={handleAddUser}
          disabled={!newUser.name || !newUser.phone || !newUser.password}
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          Foydalanuvchi qo'shish
        </button>
      </div>

      {/* Tahrirlash modali */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
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
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                onClick={() => setShowEditModal(false)}
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">O'chirishni tasdiqlash</h3>
            <p className="text-gray-600 mb-6">
              <span className="font-semibold">{selectedUser.name}</span> ismli foydalanuvchini o'chirishni istaysizmi?
              Bu amalni ortga qaytarib bo'lmaydi.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                onClick={() => setShowDeleteModal(false)}
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
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Yangi foydalanuvchi qo‘shish</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ism</label>
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={handleNewUserChange}
                  placeholder="To'liq ism"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon raqami</label>
                <input
                  type="text"
                  name="phone"
                  value={newUser.phone}
                  onChange={handleNewUserChange}
                  placeholder="+998901234567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parol</label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleNewUserChange}
                  placeholder="Parol"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    Yo‘q
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
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Bekor qilish
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center disabled:opacity-50"
                onClick={() => {
                  handleAddUser();
                  setShowAddModal(false);
                }}
                disabled={!newUser.name || !newUser.phone || !newUser.password}
              >
                <PlusIcon className="h-5 w-5 mr-1" />
                Qo‘shish
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UsersTab;