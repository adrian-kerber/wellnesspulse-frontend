import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function UserMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="text-white bg-button hover:bg-accent px-3 py-2 rounded"
      >
        ⚙️
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-card rounded shadow z-50">
          <ul className="divide-y divide-accent text-sm text-white bg-slate-800 ">
          <li>
                <button
                    onClick={() => {
                    navigate("/dashboard");
                    setOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-accent bg-slate-800 text-white hover:bg-slate-500"
                >
                    🏠 Dashboard
                </button>
            </li>
            <li>
              <button
                onClick={() => {
                  navigate("/checklist");
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-accent bg-slate-800 text-white hover:bg-slate-500"
              >
                ✅ Checklist
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  navigate("/perfil");
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-accent bg-slate-800 text-white hover:bg-slate-500"
              >
                👤 Meu Perfil
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 bg-slate-800 hover:bg-red-600 text-red-300"
              >
                🚪 Sair
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
