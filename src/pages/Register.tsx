import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [form, setForm] = useState({
    firstname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");

    if (!form.firstname.trim()) return setErr("Firstname is required");
    if (!form.email.trim()) return setErr("Email is required");
    if (!form.password) return setErr("Password is required");
    if (form.password.length < 6)
      return setErr("Password must be at least 6 characters");
    if (form.password !== form.confirmPassword)
      return setErr("Passwords do not match");

    setLoading(true);
    try {
      await register({
        firstname: form.firstname,
        email: form.email,
        password: form.password,
      });
      nav("/");
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="w-full max-w-md p-8 rounded-3xl shadow-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
        <h1 className="text-3xl font-bold text-center mb-6">Create Account</h1>

        {err && (
          <div className="bg-red-500/20 border border-red-400 text-red-200 text-sm rounded-lg px-4 py-2 mb-4 text-center">
            {err}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1 text-gray-300">First name</label>
            <input
              type="text"
              value={form.firstname}
              onChange={(e) =>
                setForm({ ...form, firstname: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-gray-800/70 border border-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 outline-none placeholder-gray-400"
              placeholder="John"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-gray-800/70 border border-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 outline-none placeholder-gray-400"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-gray-800/70 border border-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 outline-none placeholder-gray-400"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Confirm Password</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              className={`w-full px-3 py-2 rounded-lg bg-gray-800/70 border ${
                form.confirmPassword && form.confirmPassword !== form.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-700 focus:border-blue-400 focus:ring-blue-400"
              } focus:ring-2 outline-none placeholder-gray-400`}
              placeholder="••••••••"
            />
            {form.confirmPassword &&
              form.confirmPassword !== form.password && (
                <p className="text-xs text-red-400 mt-1">
                  Passwords don’t match
                </p>
              )}
          </div>

          <button
            disabled={loading}
            className="w-full py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-400 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
