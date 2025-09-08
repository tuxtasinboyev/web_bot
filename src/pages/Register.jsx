import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    role: "OWNER",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:3000/users", form);

      setSuccess(true);

      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.sendData("registered");
        window.Telegram.WebApp.close();
      }
    } catch (err) {
      alert("❌ Xatolik: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex h-screen items-center justify-center bg-green-100">
        <h1 className="text-xl font-bold text-green-700">
          ✅ Ro‘yxatdan o‘tdingiz!
        </h1>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-lg w-80 space-y-4"
    >
      <h1 className="text-lg font-bold text-center">Ro‘yxatdan o‘tish</h1>

      <input
        type="text"
        placeholder="Ism"
        className="w-full border p-2 rounded"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />

      <input
        type="tel"
        placeholder="Telefon raqam"
        className="w-full border p-2 rounded"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        required
      />

      <select
        className="w-full border p-2 rounded"
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        <option value="OWNER">Ijara beruvchi</option>
        <option value="TENANT">Ijara oluvchi</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded disabled:bg-gray-400"
      >
        {loading ? "⏳ Saqlanmoqda..." : "Yuborish"}
      </button>
    </form>
  );
}
