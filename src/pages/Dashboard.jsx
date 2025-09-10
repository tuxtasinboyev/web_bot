import React from "react";
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

const Dashboard = ({ users = [], houses = [], categories = [] }) => {
  // ==== Statistika ma’lumotlari ====
  const totalUsers = users.length;
  const totalHouses = houses.length;
  const totalCategories = categories.length;
  const totalAdmins = users.filter((u) => u.role === "ADMIN").length;

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
      name: "Adminlar",
      value: totalAdmins,
      icon: <AdminIcon size={28} />,
      color: "bg-orange-500",
    },
  ];

  // ==== Sana → oy nomi ====
  const getMonthName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("uz-UZ", { month: "short" }); // Yan, Fev, Mar ...
  };

  // ==== Demo createdAt qo‘shish (agar yo‘q bo‘lsa) ====
  const demoUsers = users.map((u, i) => ({
    ...u,
    createdAt: u.createdAt || `2025-${(i % 6) + 1}-01`, // Yan–Iyun demo sanalar
  }));
  const demoHouses = houses.map((h, i) => ({
    ...h,
    createdAt: h.createdAt || `2025-${(i % 6) + 1}-15`,
  }));

  // ==== Oylarga qarab foydalanuvchilar ====
  const usersByMonth = demoUsers.reduce((acc, u) => {
    const m = getMonthName(u.createdAt);
    acc[m] = (acc[m] || 0) + 1;
    return acc;
  }, {});

  // ==== Oylarga qarab uylar ====
  const housesByMonth = demoHouses.reduce((acc, h) => {
    const m = getMonthName(h.createdAt);
    acc[m] = (acc[m] || 0) + 1;
    return acc;
  }, {});

  // ==== Oylar tartibi ====
  const monthOrder = [
    "Yan",
    "Fev",
    "Mar",
    "Apr",
    "May",
    "Iyun",
    "Iyul",
    "Avg",
    "Sen",
    "Okt",
    "Noy",
    "Dek",
  ];

  const allMonths = monthOrder.filter(
    (m) => usersByMonth[m] || housesByMonth[m]
  );

  // ==== Grafik uchun data ====
  const chartData = allMonths.map((m) => ({
    oy: m,
    foydalanuvchilar: usersByMonth[m] || 0,
    uylar: housesByMonth[m] || 0,
  }));

  return (
    <div className="p-6 min-h-[400px]">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">📊 Statistikalar</h1>

      {/* Kartalar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        {chartData.length > 0 ? (
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
        ) : (
          <p className="text-gray-500 text-center py-10">
            Grafik uchun ma’lumot yo‘q
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
