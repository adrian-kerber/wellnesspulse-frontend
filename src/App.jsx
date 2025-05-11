import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./contexts/authContextInstance";
import { AuthProvider } from "./contexts/authContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Checklist from "./pages/Checklist";
import Profile from "./pages/Profile";



function PrivateRoute({ children }) {
  const { token, loading } = useContext(AuthContext);
  if (loading) return <div className="text-white p-4">Carregando...</div>;
  if (!token) return <Navigate to="/" />;
  return children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={

                <Dashboard />
            }
          />
          <Route
            path="/checklist"
            element={
                <Checklist />

            }
          />
          <Route path="/perfil" element={<Profile />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
