import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const nav = useNavigate();

  const initial = user?.firstname?.[0]?.toUpperCase() ?? "?";

  // close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Sidebar */}
      <aside className="w-64 hidden md:flex flex-col items-center py-8 border-r border-white/10 bg-white/5 backdrop-blur-lg">
        <div className="text-2xl font-bold mb-10">
          <span className="text-blue-500">Your</span>App
        </div>

        <nav className="flex flex-col gap-4 w-full px-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `py-2 px-4 rounded-lg transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-blue-500/10 hover:text-white"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `py-2 px-4 rounded-lg transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-blue-500/10 hover:text-white"
              }`
            }
          >
            Settings
          </NavLink>
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="flex justify-end items-center p-4 border-b border-white/10 bg-white/5 backdrop-blur-md relative">
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-lg font-semibold hover:bg-blue-700 focus:outline-none"
            >
              {initial}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2 z-50">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    nav("/settings");
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                >
                  Settings
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
