import { useState } from "react";
import { User, Phone, Briefcase, Lock, Image } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Register({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    role: "",
    imgUrl: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (form.name.trim().length < 2)
      newErrors.name = "Ism kamida 2 harf bo‘lishi kerak";
    if (!/^\+998\d{9}$/.test(form.phone))
      newErrors.phone = "Telefon +998 bilan boshlanishi kerak";
    if (form.password.length < 6)
      newErrors.password = "Parol kamida 6 ta belgidan iborat bo‘lishi kerak";
    if (!["OWNER", "TENANT"].includes(form.role))
      newErrors.role = "Iltimos rolni tanlang";
    if (form.imgUrl && !/^https?:\/\/.+\..+/.test(form.imgUrl))
      newErrors.imgUrl = "To‘g‘ri URL kiriting";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/users/register", {
        name: form.name,
        phone: form.phone,
        password: form.password,
        role: form.role,
      });

      console.log("✅ Backenddan kelgan javob:", res.data);
      localStorage.setItem("accessToken", res.data.accessToken);
      alert("Ro‘yxatdan muvaffaqiyatli o‘tdingiz!");
      if (onSuccess) onSuccess(form);
      setForm({
        name: "",
        phone: "",
        password: "",
        role: "",
        imgUrl: "",
      });
    } catch (err) {
      console.error("❌ Xatolik:", err.response?.data || err.message);
      alert(
        "Xatolik: " +
        (err.response?.data?.message || err.message || "Server xatosi")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-3xl p-8 w-full max-w-md space-y-5"
      >
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">
          📋 Ro‘yxatdan o‘tish
        </h1>

        {/* Name */}
        <div className="flex items-center gap-3 border rounded-xl p-3 focus-within:ring-2 focus-within:ring-blue-400 transition">
          <User size={24} className="text-gray-400" />
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ismingiz"
            className="w-full outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

        {/* Phone */}
        <div className="flex items-center gap-3 border rounded-xl p-3 focus-within:ring-2 focus-within:ring-blue-400 transition">
          <Phone size={24} className="text-gray-400" />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+998901234567"
            className="w-full outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

        {/* Password */}
        <div className="flex items-center gap-3 border rounded-xl p-3 focus-within:ring-2 focus-within:ring-blue-400 transition">
          <Lock size={24} className="text-gray-400" />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Parolingiz"
            className="w-full outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}

        {/* Role */}
        <div className="flex items-center gap-3 border rounded-xl p-3 focus-within:ring-2 focus-within:ring-blue-400 transition">
          <Briefcase size={24} className="text-gray-400" />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full outline-none text-gray-700"
          >
            <option value="">— Rolni tanlang —</option>
            <option value="OWNER">Uy beruvchi</option>
            <option value="TENANT">Uy qidiruvchi</option>
          </select>
        </div>
        {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "⏳ Yuborilmoqda..." : "✅ Ro‘yxatdan o‘tish"}
        </button>

        {/* Login link */}
        <p className="text-center text-gray-500 text-sm mt-3">
          Allaqachon ro‘yxatdan o‘tganmisiz?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Kirish
          </Link>
        </p>
      </form>
    </div>
  );
}
