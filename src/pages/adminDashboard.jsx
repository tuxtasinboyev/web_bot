import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import UsersTab from './usersTabs';
import HomePage from './OwnerHomePage';
import Profile from './profile';
import Category from './Category';
import Dashboard from './Dashboard';

import {
  User as UserIcon,
  Home as HomeIcon,
  BarChart as ChartIcon,
  LogOut as LogoutIcon,
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [houses, setHouses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [profile, setProfile] = useState({});
  const navigate = useNavigate();

  // Backend'dan barcha ma'lumotlarni olish
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [usersRes, housesRes, categoriesRes, profileRes] = await Promise.all([
          axios.get('https://houzing.botify.uz/users', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('https://houzing.botify.uz/houses', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('https://houzing.botify.uz/categories', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('https://houzing.botify.uz/users/me', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setUsers(usersRes.data.users);
        setHouses(housesRes.data.data);
        setCategories(categoriesRes.data);
        setProfile(profileRes.data);
      } catch (error) {
        console.error('Fetch error:', error);
        navigate('/login');
      }
    };

    fetchData();

    // Telegram WebApp setup
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, [navigate]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("accessToken");

    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.close();
    } else {
      navigate("/login");
    }
  };

  // Kontent render
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <div className="min-h-[350px]"><Dashboard users={users} houses={houses} categories={categories} /></div>;
      case 'users': return <UsersTab users={users} setUsers={setUsers} />;
      case 'houses': return <div className="p-4"><HomePage /></div>;
      case 'categories': return <div className="p-4"><Category /></div>;
      case 'profile': return <div className="p-4"><Profile profileData={profile} setProfileData={setProfile} /></div>;
      default: return <Dashboard users={users} houses={houses} categories={categories} />;
    }
  };

  // Footer menu
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon size={20} /> },
    { id: 'users', label: 'Foydalanuvchilar', icon: <UserIcon size={20} /> },
    { id: 'houses', label: 'Uylar', icon: <HomeIcon size={20} /> },
    { id: 'categories', label: 'Kategoriya', icon: <ChartIcon size={20} /> },
    { id: 'profile', label: 'Profil', icon: <UserIcon size={20} /> },
    { id: 'logout', label: 'Chiqish', icon: <LogoutIcon size={20} />, logout: true },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
        <div className="flex items-center gap-2">
          {profile.imgUrl ? (
            <img src={profile.imgUrl} alt="profile" className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <UserIcon size={16} className="text-gray-500" />
            </div>
          )}
          <span className="text-sm font-medium">{profile.name}</span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-16">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-t fixed bottom-0 w-full z-10">
        <div className="grid grid-cols-6 gap-1">
          {menuItems.map(tab => (
            <button
              key={tab.id}
              onClick={() => tab.logout ? handleLogout() : setActiveTab(tab.id)}
              className={`flex flex-col items-center py-2 text-xs ${activeTab === tab.id ? "text-blue-600 bg-blue-50" : tab.logout ? "text-red-600" : "text-gray-600"
                }`}
            >
              {tab.icon}
              <span className="mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
