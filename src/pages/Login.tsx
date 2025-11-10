import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!form.email || !form.password) return setErr("Email and password required");
    setLoading(true);
    try {
      await login(form);
      nav("/");
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="w-full max-w-md p-8 rounded-3xl shadow-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
        <h1 className="text-3xl font-bold text-center mb-6">Welcome Back</h1>

        {err && (
          <div className="bg-red-500/20 border border-red-400 text-red-200 text-sm rounded-lg px-4 py-2 mb-4 text-center">
            {err}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1 text-gray-300">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-gray-800/70 border border-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 outline-none placeholder-gray-400"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-gray-800/70 border border-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 outline-none placeholder-gray-400"
              placeholder="••••••••"
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
          <p className="text-center text-sm mt-4">
              <Link to="/forgot-password" className="text-blue-400 hover:underline">
               Forgot password?
              </Link>
          </p>

        </form>

        <p className="text-center text-sm mt-6 text-gray-300">
          No account?{" "}
          <Link
            to="/register"
            className="text-blue-400 hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
