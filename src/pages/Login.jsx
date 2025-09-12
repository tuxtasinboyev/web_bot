import { useState } from "react";
import { Phone, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login({ onSuccess }) {
  
  const navigate = useNavigate();
  const [form, setForm] = useState({
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!/^\+998\d{9}$/.test(form.phone))
      newErrors.phone = "Telefon +998 bilan boshlanishi kerak";
    if (form.password.length < 6)
      newErrors.password = "Parol kamida 6 ta belgidan iborat bo‘lishi kerak";
    return newErrors; console.error(err);
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

      const res = await axios.post("https://houzing.botify.uz/users/login", {
        phone: form.phone,
        password: form.password,
      });

      const { accessToken, user } = res.data;
      console.log("✅ Serverdan:", res.data);

      localStorage.setItem("accessToken", accessToken);

      if (onSuccess) onSuccess(res.data.safeUSer);

      // navigate("/admin");

    } catch (err) {
      if (err.response?.status === 400 || err.response?.status === 401) {
        navigate('/register')
        return
      }
      if (err.response?.status === 404) {
        alert('parol yoki email xato')
        return
      }

      alert(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login xatosi"
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
          🔑 Tizimga kirish
        </h1>

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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "⏳ Kutyapmiz..." : "✅ Kirish"}
        </button>

        {/* Register link */}
        <p className="text-center text-gray-500 text-sm mt-3">
          Ro‘yxatdan o‘tmaganmisiz?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Ro‘yxatdan o‘tish
          </Link>
        </p>
      </form>
    </div>
  );
}
