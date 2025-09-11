import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users as UsersIcon,
  Home as HomeIcon,
  BarChart3 as CategoryIcon,
  Shield as AdminIcon,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const Dashboard = () => {
  // ==== BACKEND ma’lumotlar ====
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/categories/statistika")
      .then((res) => {
        setStatsData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Statistika olishda xatolik:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Yuklanmoqda...</p>
      </div>
    );
  }

  if (!statsData) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Statistika olinmadi</p>
      </div>
    );
  }

  // Backenddan kelgan statistika
  const totalUsers = statsData.totalUsers || 0;
  const totalHouses = statsData.totalHouses || 0;
  const totalCategories = statsData.totalCategories || 0;
  const totalOwners = statsData.totalOwners || 0;
  const totalTenants = statsData.totalTenants || 0;
  const totalAdmin=statsData.adminCount

  // ==== Kartalar uchun massiv ====
  const stats = [
    {
      id: 1,
      name: "Jami foydalanuvchilar",
      value: totalUsers,
      icon: <UsersIcon size={28} />,
      color: "bg-blue-500",
    },
    {
      id: 2,
      name: "Jami uylar",
      value: totalHouses,
      icon: <HomeIcon size={28} />,
      color: "bg-green-500",
    },
    {
      id: 3,
      name: "Jami kategoriyalar",
      value: totalCategories,
      icon: <CategoryIcon size={28} />,
      color: "bg-purple-500",
    },
    {
      id: 4,
      name: "Jami egalar",
      value: totalAdmin,
      icon: <AdminIcon size={28} />,
      color: "bg-orange-500",
    },
    {
      id: 5,
      name: "Jami ijarachilar",
      value: totalTenants,
      icon: <UsersIcon size={28} />,
      color: "bg-pink-500",
    },
  ];

  // ==== Grafik uchun demo data (backenddan vaqt kelmasa) ====
  const chartData = [
    { oy: "Yan", foydalanuvchilar: 2, uylar: 1 },
    { oy: "Fev", foydalanuvchilar: 1, uylar: 0 },
    { oy: "Mar", foydalanuvchilar: 3, uylar: 0 },
    { oy: "Apr", foydalanuvchilar: 0, uylar: 0 },
  ];

  return (
    <div className="p-6 min-h-[400px]">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">📊 Statistikalar</h1>

      {/* Kartalar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white rounded-xl shadow p-6 flex items-center gap-4 hover:shadow-lg transition-shadow"
          >
            <div
              className={`w-16 h-16 flex items-center justify-center rounded-full text-white ${stat.color}`}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Grafik */}
      <div className="mt-10 bg-white rounded-xl shadow p-8 w-full">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          Oylik faoliyat grafigi
        </h2>
        <div className="w-full h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="oy" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="foydalanuvchilar"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="uylar"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
