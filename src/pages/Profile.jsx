import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import UserMenu from "../components/UserMenu";


function Profile() {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setEmail(res.data.email);
      })
      .catch((err) => {
        console.error(err);
        setError("Erro ao carregar informações do usuário.");
      });
  }, [token]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmNewPassword) {
      setError("As novas senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      await api.put(
        "/api/users/password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("Senha atualizada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao atualizar senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-primary p-8 max-w-md mx-auto">
      <button
  onClick={() => navigate("/dashboard")}
  className="text-sm text-blue-400 hover:underline mb-4 block"
>
  ← Voltar para o Dashboard
</button>

      <h1 className="text-2xl font-bold mb-6 text-center">Perfil do Usuário</h1>

      {error && <div className="bg-red-600 text-white p-2 mb-4 rounded">{error}</div>}
      {message && <div className="bg-green-600 text-white p-2 mb-4 rounded">{message}</div>}

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-1">Email</label>
        <input
          type="email"
          value={email}
          readOnly
          className="w-full bg-card text-primary p-3 rounded border border-accent"
        />
      </div>

      <form onSubmit={handlePasswordChange} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Senha atual</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full p-3 rounded bg-background border border-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Nova senha</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-3 rounded bg-background border border-accent"
          />
        </div>
        <div className="absolute top-4 right-4 z-50">
  <UserMenu />
</div>
        <div>
          <label className="block text-sm font-semibold mb-1">Confirmar nova senha</label>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
            className="w-full p-3 rounded bg-background border border-accent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-button bg-gray-700 hover:bg-accent text-white px-6 py-3 rounded-full font-semibold"
        >
          {loading ? "Salvando..." : "Salvar nova senha"}
        </button>
      </form>
    </div>
  );
}

export default Profile;