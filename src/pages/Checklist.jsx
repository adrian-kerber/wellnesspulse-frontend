import { useEffect, useState } from "react";
import { AuthContext } from "../contexts/authContextInstance";
import { FaPlus, FaTrash, FaEdit, FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UserMenu from "../components/UserMenu";
import api from "../services/api"; // Certifique-se de que o caminho está correto


const daysOfWeek = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

function Checklist() {
  const [checklist, setChecklist] = useState({});
  const [toCreate, setToCreate] = useState([]);
  const [toUpdate, setToUpdate] = useState([]);
  const [toDelete, setToDelete] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");


  useEffect(() => {
    if (!token) return;
    api
      .get("/api/checklist", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const grouped = {};
        for (const item of res.data) {
          if (!grouped[item.day]) grouped[item.day] = [];
          grouped[item.day].push(item);
        }
        setChecklist(grouped);
      });
  }, [token]);

  const addItem = (day) => {
    const text = prompt("Adicionar item para " + day);
    if (!text) return;
    const newItem = { id: `temp-${Date.now()}`, day, text, done: false, isNew: true };
    setChecklist((prev) => ({
      ...prev,
      [day]: [...(prev[day] || []), newItem],
    }));
    setToCreate((prev) => [...prev, newItem]);
  };

  const toggleItem = (item) => {
    const updatedItem = { ...item, done: !item.done };
    setChecklist((prev) => {
      const updated = prev[item.day].map((i) => (i.id === item.id ? updatedItem : i));
      return { ...prev, [item.day]: updated };
    });
    if (!item.isNew && !toUpdate.find((i) => i.id === item.id)) {
      setToUpdate((prev) => [...prev, updatedItem]);
    }
  };

  const editItem = (item) => {
    const text = prompt("Editar item", item.text);
    if (!text || text === item.text) return;
    const updatedItem = { ...item, text };
    setChecklist((prev) => {
      const updated = prev[item.day].map((i) => (i.id === item.id ? updatedItem : i));
      return { ...prev, [item.day]: updated };
    });
    if (!item.isNew && !toUpdate.find((i) => i.id === item.id)) {
      setToUpdate((prev) => [...prev, updatedItem]);
    }
  };

  const deleteItem = (item) => {
    setChecklist((prev) => {
      const filtered = prev[item.day].filter((i) => i.id !== item.id);
      return { ...prev, [item.day]: filtered };
    });
    if (item.isNew) {
      setToCreate((prev) => prev.filter((i) => i.id !== item.id));
    } else {
      setToDelete((prev) => [...prev, item.id]);
      setToUpdate((prev) => prev.filter((i) => i.id !== item.id));
    }
  };

  const saveAllChanges = async () => {
    setLoading(true);
    try {
      await api.post("/api/checklist", {
        additions: toCreate,
        updates: toUpdate,
        deletions: toDelete,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Resetar estado auxiliar após salvar
      setToCreate([]);
      setToUpdate([]);
      setToDelete([]);

      // Recarrega os dados do backend
      const res = await api.get("/api/checklist", {
        headers: { Authorization: `Bearer ${token}` },
      });

      

      const grouped = {};
      for (const item of res.data) {
        if (!grouped[item.day]) grouped[item.day] = [];
        grouped[item.day].push(item);
      }
      setChecklist(grouped);

    } catch (error) {
      alert("Erro ao salvar alterações.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-primary p-8 pb-28">
      <button
  onClick={() => navigate("/dashboard")}
  className="text-sm text-blue-400 hover:underline mb-4 block"
>
  ← Voltar para o Dashboard
</button>
<div className="absolute top-4 right-4 z-50">
  <UserMenu />
</div>

      <h1 className="text-3xl font-bold mb-8 text-center">Checklist Semanal</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {daysOfWeek.map((day) => (
          <div key={day} className="bg-card p-4 rounded shadow">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">{day}</h2>
              <button
                onClick={() => addItem(day)}
                className="bg-button hover:bg-accent text-white px-2 py-1 rounded text-sm flex items-center gap-1"
              >
                <FaPlus /> Adicionar
              </button>
            </div>
            <ul className="space-y-2">
              {(checklist[day] || []).map((item) => (
                <li key={item.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleItem(item)}
                    className="form-checkbox h-4 w-4"
                  />
                  <span className={item.done ? "line-through text-gray-500 flex-1" : "flex-1"}>
                    {item.text}
                  </span>
                  <button onClick={() => editItem(item)} className="text-sm text-blue-400">
                    <FaEdit />
                  </button>
                  <button onClick={() => deleteItem(item)} className="text-sm text-red-500">
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-background p-4 shadow-inner flex justify-center">
        <button
          onClick={saveAllChanges}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded flex items-center gap-2"
        >
          <FaSave /> {loading ? "Salvando..." : "Salvar alterações"}
        </button>
      </div>
    </div>
  );
}

export default Checklist;
