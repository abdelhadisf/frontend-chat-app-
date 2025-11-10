import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user,  } = useAuth();


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col">
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl p-10 max-w-md w-full">
          <h2 className="text-2xl font-semibold mb-2">Welcome, {user?.firstname ?? user?.email}</h2>
          <p className="text-gray-300 mb-6">
            You’re logged in securely with JWT authentication.
          </p>
        
        </div>
      </main>
      

      <footer className="text-center py-4 text-xs text-gray-500 border-t border-white/10">
        © {new Date().getFullYear()} Your App. All rights reserved.
      </footer>
    </div>
  );
}
