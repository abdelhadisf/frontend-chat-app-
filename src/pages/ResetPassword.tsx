import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../api/axios";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const nav = useNavigate();

  const [form, setForm] = useState({ password: "", confirm: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    async function verify() {
      if (!token) return setMessage("Invalid reset link.");
      try {
        const res = await api.get(`/auth/verify-reset-password-token?token=${token}`);
        if (!res.data.error) setVerified(true);
      } catch {
        setMessage("This reset link is invalid or expired.");
      }
    }
    verify();
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 6)
      return setMessage("Password must be at least 6 characters.");
    if (form.password !== form.confirm)
      return setMessage("Passwords do not match.");
    setLoading(true);
    try {
      const res = await api.post("/auth/reset-password", {
        token,
        password: form.password,
      });
      setMessage(res.data.message);
      setTimeout(() => nav("/login"), 2500);
    } catch (e: any) {
      setMessage(e?.response?.data?.message ?? "Reset failed.");
    } finally {
      setLoading(false);
    }
  }

  if (!verified)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>{message || "Verifying reset link..."}</p>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="w-full max-w-md p-8 rounded-3xl shadow-2xl bg-white/10 backdrop-blur-md border border-white/20">
        <h1 className="text-3xl font-bold text-center mb-6">Choose a new password</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1 text-gray-300">New Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-gray-800/70 border border-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 outline-none placeholder-gray-400"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Confirm Password</label>
            <input
              type="password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg bg-gray-800/70 border ${
                form.confirm && form.confirm !== form.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-700 focus:border-blue-400 focus:ring-blue-400"
              } focus:ring-2 outline-none placeholder-gray-400`}
              placeholder="••••••••"
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-sm text-blue-300">{message}</p>
        )}
      </div>
    </div>
  );
}
