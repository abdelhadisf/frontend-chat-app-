import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col">
      {/* Navbar */}
      <header className="border-b border-white/10 backdrop-blur-md bg-white/5">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold tracking-wide">My Dashboard</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl p-10 max-w-md w-full">
          <h2 className="text-2xl font-semibold mb-2">Welcome, {user?.firstname ?? user?.email}</h2>
          <p className="text-gray-300 mb-6">
            You’re logged in securely with JWT authentication.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all">
              View Profile
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-lg transition-all">
              Settings
            </button>
          </div>
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-gray-500 border-t border-white/10">
        © {new Date().getFullYear()} Your App. All rights reserved.
      </footer>
    </div>
  );
}
