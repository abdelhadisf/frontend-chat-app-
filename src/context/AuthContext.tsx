import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/axios";

type User = { id: string; email: string; firstname?: string };
type LoginDto = { email: string; password: string };
type RegisterDto = {
  firstname?: string;  // use firstname instead of name
  email: string;
  password: string;
};

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthCtx = createContext<AuthState | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // load user from cookie session
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/auth");
        setUser(res.data.user ?? null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function login(data: LoginDto) {
    const res = await api.post("/auth/login", data);
    const token = res.data.access_token;
  localStorage.setItem("token", token);
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const me = await api.get("/auth");
  setUser(me.data);
  }

  async function register(data: RegisterDto) {
    const res = await api.post("/auth/register", data);
    const token = res.data.access_token;
  localStorage.setItem("token", token);
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const me = await api.get("/auth");
  setUser(me.data);
  }

async function logout() {
  // optional: call backend if you want to track logouts
  localStorage.removeItem("token");
  delete api.defaults.headers.common["Authorization"];
  setUser(null);
    window.location.href = "/login";

}


  return (
    <AuthCtx.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
