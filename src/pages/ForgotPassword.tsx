import { useState } from "react";
import { api } from "../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    if (!email) return setMessage("Please enter your email.");
    setLoading(true);
    try {
      const res = await api.post("/auth/request-reset-password", { email });
      setMessage(res.data.message);
    } catch (e: any) {
      setMessage(e?.response?.data?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="w-full max-w-md p-8 rounded-3xl shadow-2xl bg-white/10 backdrop-blur-md border border-white/20">
        <h1 className="text-3xl font-bold text-center mb-6">Reset Password</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1 text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-800/70 border border-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 outline-none placeholder-gray-400"
              placeholder="you@example.com"
            />
          </div>
          <button
            disabled={loading}
            className="w-full py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-sm text-blue-300">{message}</p>
        )}
      </div>
    </div>
  );
}
