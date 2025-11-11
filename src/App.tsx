import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProfileSettings from "./pages/ProfileSettings";
import AppLayout from "./layouts/AppLayout";
import Conversations from "./pages/Conversations";
import ChatRoom from "./pages/ChatRoom";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><AppLayout><Home /></AppLayout></ProtectedRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/settings" element={<ProtectedRoute><AppLayout><ProfileSettings /></AppLayout></ProtectedRoute>} />
      <Route
  path="/conversations"
  element={
    <ProtectedRoute>
      <AppLayout><Conversations /></AppLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/chat/:conversationId"
  element={
    <ProtectedRoute>
      <AppLayout><ChatRoom /></AppLayout>
    </ProtectedRoute>
  }
/>
    </Routes>
  );
}
