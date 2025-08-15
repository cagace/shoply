import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function SignUp() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.password) return;
    signup(form);
    navigate("/");
  };

  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-semibold mb-6">Üye Ol</h1>
      <form onSubmit={onSubmit} className="space-y-4 bg-white border rounded-2xl p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <input name="firstName" value={form.firstName} onChange={onChange} required placeholder="Ad" className="rounded-xl border px-3 py-2" />
          <input name="lastName" value={form.lastName} onChange={onChange} required placeholder="Soyad" className="rounded-xl border px-3 py-2" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <input type="email" name="email" value={form.email} onChange={onChange} required placeholder="E‑posta" className="rounded-xl border px-3 py-2" />
          <input type="password" name="password" value={form.password} onChange={onChange} required placeholder="Şifre" className="rounded-xl border px-3 py-2" />
        </div>
        <input name="phone" value={form.phone} onChange={onChange} placeholder="Telefon" className="rounded-xl border px-3 py-2 w-full" />
        <input name="address" value={form.address} onChange={onChange} placeholder="Adres" className="rounded-xl border px-3 py-2 w-full" />
        <div className="grid sm:grid-cols-2 gap-4">
          <input name="city" value={form.city} onChange={onChange} placeholder="Şehir" className="rounded-xl border px-3 py-2" />
          <input name="postalCode" value={form.postalCode} onChange={onChange} placeholder="Posta Kodu" className="rounded-xl border px-3 py-2" />
        </div>
        <button className="px-4 py-2 rounded-xl bg-black text-white w-full">Üye Ol</button>
        <p className="text-sm text-gray-600">Hesabın var mı? <Link to="/signin" className="underline">Giriş yap</Link></p>
      </form>
    </section>
  );
}