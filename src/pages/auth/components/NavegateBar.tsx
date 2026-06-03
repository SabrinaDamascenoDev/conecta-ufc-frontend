import { useNavigate, useLocation } from "react-router-dom";

export function NavagateBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isLogin = location.pathname === "/login";
  const isCadastro = location.pathname === "/cadastro";

  return (
    <div className="flex gap-6 mb-8 border-b border-gray-200">
      <button
        onClick={() => navigate("/login")}
        className={`pb-3 text-sm transition-colors ${
          isLogin
            ? "font-semibold text-ufc border-b-2 border-ufc"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        Entrar
      </button>

      <button
        onClick={() => navigate("/cadastro")}
        className={`pb-3 text-sm transition-colors ${
          isCadastro
            ? "font-semibold text-ufc border-b-2 border-ufc"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        Criar Conta
      </button>
    </div>
  );
}