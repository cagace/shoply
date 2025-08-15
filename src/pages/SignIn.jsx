import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function SignIn() {
  const { signin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    const { ok, error } = signin(form);
    if (ok) navigate("/");
    else setError(error || "Giriş başarısız.");
  };

  return (
    <section className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-semibold mb-6">Giriş Yap</h1>
      <form onSubmit={onSubmit} className="space-y-4 bg-white border rounded-2xl p-6">
        {error && <div className="text-sm text-red-600">{error}</div>}
        <input type="email" name="email" value={form.email} onChange={onChange} required placeholder="E‑posta" className="rounded-xl border px-3 py-2 w-full" />
        <input type="password" name="password" value={form.password} onChange={onChange} required placeholder="Şifre" className="rounded-xl border px-3 py-2 w-full" />
        <button className="px-4 py-2 rounded-xl bg-black text-white w-full">Giriş Yap</button>
        <p className="text-sm text-gray-600">Hesabın yok mu? <Link to="/signup" className="underline">Üye ol</Link></p>
      </form>
    </section>
  );
}