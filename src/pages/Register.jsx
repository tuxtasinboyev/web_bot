import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Phone, Briefcase } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Ism kamida 2 harf bo‘lishi kerak"),
  phone: z.string().regex(/^\+998\d{9}$/, "Telefon raqam +998 bilan boshlanishi kerak"),
  role: z.enum(["owner", "tenant"], {
    errorMap: () => ({ message: "Iltimos rolni tanlang" }),
  }),
});

export default function Register({ onSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    console.log("📤 Yuborilayotgan ma'lumot:", data);

    try {
      const res = await fetch("https://web-bot-backend.onrender.com/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Server xatosi");
      const result = await res.json();
      console.log("✅ Serverdan:", result);

      // muvaffaqiyatli ro‘yxatdan o‘tgan bo‘lsa
      onSuccess(data.role);
    } catch (err) {
      alert("Xatolik: " + err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-2xl p-6 w-80 space-y-4"
      >
        <h1 className="text-xl font-bold text-center text-blue-600">
          📋 Ro‘yxatdan o‘tish
        </h1>

        {/* Name */}
        <div className="flex items-center gap-2 border rounded-lg p-2">
          <User size={20} className="text-gray-400" />
          <input
            {...register("name")}
            placeholder="Ismingiz"
            className="w-full outline-none"
          />
        </div>
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

        {/* Phone */}
        <div className="flex items-center gap-2 border rounded-lg p-2">
          <Phone size={20} className="text-gray-400" />
          <input
            {...register("phone")}
            placeholder="+998901234567"
            className="w-full outline-none"
          />
        </div>
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}

        {/* Role */}
        <div className="flex items-center gap-2 border rounded-lg p-2">
          <Briefcase size={20} className="text-gray-400" />
          <select {...register("role")} className="w-full outline-none">
            <option value="">— Rolni tanlang —</option>
            <option value="owner">Uy beruvchi</option>
            <option value="tenant">Uy qidiruvchi</option>
          </select>
        </div>
        {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          ✅ Ro‘yxatdan o‘tish
        </button>
      </form>
    </div>
  );
}
