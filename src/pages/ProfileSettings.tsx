import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { changePassword } from "../api/user";

export default function ProfileSettings() {
  const { user, updateProfileFirstname, refreshMe } = useAuth();

  // firstname
  const [firstname, setFirstname] = useState(user?.firstname ?? "");
  const [nameMsg, setNameMsg] = useState("");
  const [nameLoading, setNameLoading] = useState(false);

  // password
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    setFirstname(user?.firstname ?? "");
  }, [user]);

  async function saveName(e: React.FormEvent) {
    e.preventDefault();
    setNameMsg("");
    if (!firstname.trim()) return setNameMsg("Firstname is required.");
    setNameLoading(true);
    try {
      await updateProfileFirstname(firstname.trim());
      setNameMsg("Saved.");
    } catch (e: any) {
      setNameMsg(e?.response?.data?.message ?? "Failed to save.");
    } finally {
      setNameLoading(false);
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg("");
    if (!pw.current || !pw.next || !pw.confirm) return setPwMsg("All fields required.");
    if (pw.next.length < 6) return setPwMsg("New password must be at least 6 chars.");
    if (pw.next !== pw.confirm) return setPwMsg("Passwords do not match.");
    setPwLoading(true);
    try {
      const r = await changePassword({ currentPassword: pw.current, newPassword: pw.next });
      setPwMsg(r.message || "Updated.");
      setPw({ current: "", next: "", confirm: "" });
      await refreshMe();
    } catch (e: any) {
      setPwMsg(e?.response?.data?.message ?? "Failed to change password.");
    } finally {
      setPwLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Nav */}
      

      <main className="max-w-5xl mx-auto px-6 py-10 grid gap-8 md:grid-cols-2">
        {/* Card: Profile */}
        <section className="bg-white/10 border border-white/10 backdrop-blur rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-semibold mb-4">Profile</h2>
          <form onSubmit={saveName} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-gray-300">Firstname</label>
              <input
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-800/70 border border-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 outline-none placeholder-gray-400"
                placeholder="John"
              />
            </div>
            <button
              disabled={nameLoading}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              {nameLoading ? "Saving..." : "Save changes"}
            </button>
            {nameMsg && <p className="text-sm text-blue-300 mt-2">{nameMsg}</p>}
          </form>
        </section>

        {/* Card: Password */}
        <section className="bg-white/10 border border-white/10 backdrop-blur rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-semibold mb-4">Change password</h2>
          <form onSubmit={savePassword} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-gray-300">Current password</label>
              <input
                type="password"
                value={pw.current}
                onChange={(e) => setPw({ ...pw, current: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gray-800/70 border border-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 outline-none placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-300">New password</label>
              <input
                type="password"
                value={pw.next}
                onChange={(e) => setPw({ ...pw, next: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gray-800/70 border border-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 outline-none placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-300">Confirm new password</label>
              <input
                type="password"
                value={pw.confirm}
                onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg bg-gray-800/70 border ${
                  pw.confirm && pw.confirm !== pw.next
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-700 focus:border-blue-400 focus:ring-blue-400"
                } focus:ring-2 outline-none placeholder-gray-400`}
                placeholder="••••••••"
              />
              {pw.confirm && pw.confirm !== pw.next && (
                <p className="text-xs text-red-400 mt-1">Passwords don’t match</p>
              )}
            </div>
            <button
              disabled={pwLoading}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-colors"
            >
              {pwLoading ? "Updating..." : "Update password"}
            </button>
            {pwMsg && <p className="text-sm text-blue-300 mt-2">{pwMsg}</p>}
          </form>
        </section>
      </main>
    </div>
  );
}
