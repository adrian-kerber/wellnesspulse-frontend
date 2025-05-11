import { useContext } from "react";
import { AuthContext } from "../contexts/authContextInstance";
import { useNavigate } from "react-router-dom";
import UserMenu from "../components/UserMenu";


function Dashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background text-primary px-8 flex flex-col justify-between">
      <div className="flex flex-col items-center mt-20 space-y-6">
        <h1 className="text-3xl font-bold text-center">Bem-vindo ao WellnessPulse! </h1>
        <div className="absolute top-4 right-4 z-50">
  <UserMenu />
</div>


        <button
          onClick={() => navigate("/checklist")}
          className="bg-button bg-gray-700 hover:bg-accent text-white px-6 py-3 rounded-full font-semibold"
        >
          Ir para Checklist
        </button>
        <button
  onClick={() => navigate("/perfil")}
  className="bg-button bg-gray-700 hover:bg-accent text-white px-6 py-3 rounded-full font-semibold"
>
  Acessar Perfil
</button>

      </div>

      <div className="flex justify-center mb-10">
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-full text-white font-semibold"
        >
          Sair
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
