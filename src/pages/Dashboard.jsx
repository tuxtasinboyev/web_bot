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
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";

const Dashboard = () => {
  // ==== BACKEND ma’lumotlar ====
  const [statsData, setStatsData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week'); // 'week', 'month', 'year'

  useEffect(() => {
    axios
      .get("https://houzing.botify.uz/categories/statistika")
      .then((res) => {
        setStatsData(res.data);
        setLoading(false);
        
        // Dinamik grafik ma'lumotlarini yaratish
        generateDynamicChartData(timeRange);
      })
      .catch((err) => {
        console.error("Statistika olishda xatolik:", err);
        setLoading(false);
        // Agar API dan ma'lumot olinmasa, demo ma'lumotlar yaratish
        generateDemoChartData(timeRange);
      });
  }, [timeRange]);

  // Dinamik grafik ma'lumotlarini yaratish
  const generateDynamicChartData = (range) => {
    const now = new Date();
    let data = [];
    let days = 7; // Haftalik uchun
    
    if (range === 'month') {
      days = 30;
    } else if (range === 'year') {
      days = 12;
    }
    
    // Tasodifiy o'zgaruvchan ma'lumotlar yaratish
    let lastUsers = statsData?.totalUsers || 50;
    let lastHouses = statsData?.totalHouses || 20;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Har 2 kunda ma'lumotlarni o'zgartirish
      const changeFactor = i % 2 === 0 ? 1.1 : 0.95;
      
      lastUsers = Math.round(lastUsers * changeFactor + Math.random() * 5);
      lastHouses = Math.round(lastHouses * changeFactor + Math.random() * 3);
      
      let label;
      if (range === 'year') {
        label = date.toLocaleDateString('default', { month: 'short' });
      } else {
        label = date.toLocaleDateString('default', { day: 'numeric', month: 'short' });
      }
      
      data.push({
        sana: label,
        foydalanuvchilar: lastUsers,
        uylar: lastHouses,
        kategoriyalar: Math.round(lastHouses * 0.7 + Math.random() * 5),
      });
    }
    
    setChartData(data);
  };

  // Demo ma'lumotlar yaratish (agar API ishlamasa)
  const generateDemoChartData = (range) => {
    let data = [];
    let days = 7;
    
    if (range === 'month') {
      days = 30;
    } else if (range === 'year') {
      days = 12;
    }
    
    let lastUsers = 50;
    let lastHouses = 20;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Har 2 kunda ma'lumotlarni o'zgartirish
      const changeFactor = i % 2 === 0 ? 1.1 : 0.95;
      
      lastUsers = Math.round(lastUsers * changeFactor + Math.random() * 5);
      lastHouses = Math.round(lastHouses * changeFactor + Math.random() * 3);
      
      let label;
      if (range === 'year') {
        label = date.toLocaleDateString('default', { month: 'short' });
      } else {
        label = date.toLocaleDateString('default', { day: 'numeric', month: 'short' });
      }
      
      data.push({
        sana: label,
        foydalanuvchilar: lastUsers,
        uylar: lastHouses,
        kategoriyalar: Math.round(lastHouses * 0.7 + Math.random() * 5),
      });
    }
    
    setChartData(data);
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-gray-600 mt-3">Yuklanmoqda...</p>
      </div>
    );
  }

  // Backenddan kelgan statistika
  const totalUsers = statsData?.totalUsers || 124;
  const totalHouses = statsData?.totalHouses || 57;
  const totalCategories = statsData?.totalCategories || 8;
  const totalOwners = statsData?.totalOwners || 43;
  const totalTenants = statsData?.totalTenants || 81;
  const totalAdmin = statsData?.adminCount || 3;

  // ==== Kartalar uchun massiv ====
  const stats = [
    {
      id: 1,
      name: "Jami foydalanuvchilar",
      value: totalUsers,
      icon: <UsersIcon size={28} />,
      color: "bg-blue-500",
      change: "+12%",
      trend: "up",
    },
    {
      id: 2,
      name: "Jami uylar",
      value: totalHouses,
      icon: <HomeIcon size={28} />,
      color: "bg-green-500",
      change: "+5%",
      trend: "up",
    },
    {
      id: 3,
      name: "Jami kategoriyalar",
      value: totalCategories,
      icon: <CategoryIcon size={28} />,
      color: "bg-purple-500",
      change: "+0%",
      trend: "stable",
    },
    {
      id: 4,
      name: "Jami egalar",
      value: totalOwners,
      icon: <UsersIcon size={28} />,
      color: "bg-orange-500",
      change: "+8%",
      trend: "up",
    },
    {
      id: 5,
      name: "Jami ijarachilar",
      value: totalTenants,
      icon: <UsersIcon size={28} />,
      color: "bg-pink-500",
      change: "+15%",
      trend: "up",
    },
    {
      id: 6,
      name: "Adminlar",
      value: totalAdmin,
      icon: <AdminIcon size={28} />,
      color: "bg-red-500",
      change: "+0%",
      trend: "stable",
    },
  ];

  return (
    <div className="p-6 min-h-[400px]">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">📊 Statistikalar</h1>

      {/* Kartalar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white rounded-xl shadow p-4 flex flex-col justify-between hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full text-white ${stat.color}`}
              >
                {stat.icon}
              </div>
              <span className={`text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-600' : 
                stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-gray-500 text-sm">{stat.name}</p>
              <p className="text-xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Grafik va filtrlarr */}
      <div className="bg-white rounded-xl shadow p-6 w-full mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">
            Faollik statistikasi
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                timeRange === 'week' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              1 Hafta
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                timeRange === 'month' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              1 Oy
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                timeRange === 'year' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              1 Yil
            </button>
          </div>
        </div>
        
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorHouses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="sana" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: 'none'
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="foydalanuvchilar"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorUsers)"
                activeDot={{ r: 6 }}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="uylar"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorHouses)"
                activeDot={{ r: 6 }}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Qo'shimcha bar chart */}
      <div className="bg-white rounded-xl shadow p-6 w-full">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          Turlarning taqqoslash
        </h2>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData.slice(-7)} // Faqat oxirgi 7 kun
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="sana" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: 'none'
                }}
              />
              <Legend />
              <Bar 
                dataKey="foydalanuvchilar" 
                fill="#3b82f6" 
                name="Foydalanuvchilar" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="uylar" 
                fill="#10b981" 
                name="Uylar" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;