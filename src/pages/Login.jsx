import { useState } from "react";
import { AuthContext } from "../contexts/authContextInstance";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
const [confirmPassword, setConfirmPassword] = useState("");


  const MotionDiv = motion.div;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    if (isRegister && password !== confirmPassword) {
      setError("As senhas não coincidem.");
      setLoading(false);
      return;
    }
  
    try {
      const url = isRegister
        ? "/api/auth/register"
        : "/api/auth/login";
  
      const response = await api.post(url, { email, password });
  
      if (!isRegister && response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      } else if (isRegister) {
        alert("Cadastro realizado com sucesso! Faça login.");
        toggleMode();
      }
    } catch (err) {
      setError(err.response?.data?.error || "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };
  

  const toggleMode = () => {
    setIsRegister((prev) => !prev);
    setError("");
    setConfirmPassword("");
  };

  return (
    <MotionDiv
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex items-center justify-center bg-background text-primary"
    >
      <div className="bg-card p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Entrar no WellnessPulse</h2>
        {error && <div className="bg-red-600 text-white p-2 mb-4 rounded text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-3 rounded bg-background border border-accent focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-3 rounded bg-background border border-accent focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {isRegister && (
            <input
              type="password"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="p-3 rounded bg-background border border-accent focus:outline-none focus:ring-2 focus:ring-primary"
            />
          )}
          <button
            type="button"
            onClick={toggleMode}
            className="text-sm text-blue-400 mt-4 hover:underline"
          >
            {isRegister ? "Já tem conta? Faça login" : "Não tem conta? Cadastre-se"}
          </button>

          <button
            type="submit"
            className="bg-button bg-gray-700 hover:bg-accent transition-all duration-300 transform hover:scale-105 active:scale-95 text-white font-semibold py-3 px-6 rounded-lg"
            disabled={loading}
          >
            {loading ? "Enviando..." : isRegister ? "Cadastrar" : "Entrar"}
          </button>
        </form>
      </div>
    </MotionDiv>
  );
}

export default Login;