import { useState, useEffect } from "react";
import { Bookmark, Bell, Menu, X, Newspaper } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import logo from "../../assets/logo.png";
import { getUsuario, type Usuario } from "@/services/usuarioService";
import { getAlertas } from "@/services/vagasAlertasServiice"; // Ajuste o import se o nome do arquivo for diferente

type NavItem = "vagas" | "salvos" | "alertas" | "perfil";

const navItems = [
  { id: "vagas" as NavItem, label: "Vagas", icon: Newspaper },
  { id: "salvos" as NavItem, label: "Salvos", icon: Bookmark },
  { id: "alertas" as NavItem, label: "Alertas", icon: Bell },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [alertasCount, setAlertasCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const activeItem = (location.pathname.replace("/", "") || "vagas") as NavItem;

  function handleNavigate(item: NavItem) {
    navigate(`/${item}`);
    setOpen(false);
  }
  useEffect(() => {
    getUsuario()
      .then(setUsuario)
      .catch(() => {});

    getAlertas({ size: 1 })
      .then((res) => {
        if (res?.meta?.total_elements) {
          setAlertasCount(res.meta.total_elements);
        }
      })
      .catch(() => {});
  }, []);
  const nomeExibido =
    usuario?.preferred_username ?? usuario?.email ?? "Usuário";
  const iniciais = getInitials(nomeExibido);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          fixed top-5 left-4 z-50
          lg:hidden
          w-10 h-10 rounded-2xl
          bg-gradient-to-br from-[#0066CC] to-[#00488C]
          flex items-center justify-center
          text-white shadow-md
          transition-opacity
        "
        aria-label="Abrir menu"
      >
        <Menu size={20} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-4 left-4 w-[240px] h-[calc(100vh-32px)] rounded-[40px]",
          "bg-gradient-to-br from-[#0066CC] to-[#00488C]",
          "flex flex-col text-white select-none shadow-lg",
          "transition-transform duration-300 ease-in-out z-50",
          "lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-[110%] lg:translate-x-0",
        )}
      >
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          aria-label="Fechar menu"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center pt-10 pb-8 px-4">
          <div className="mb-3">
            <img
              src={logo}
              alt="Pedra da galinha choca"
              className="w-40 opacity-80"
            />
          </div>
          <span className="text-lg font-light tracking-widest uppercase text-white/90">
            Conecta
          </span>
          <span className="text-2xl font-extrabold tracking-wider text-white">
            UFC
          </span>
        </div>

        <div className="mx-6 h-px bg-white/20 mb-4" />

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleNavigate(id)}
              className={cn(
                "flex items-center gap-3 px-7 py-3 border-l-4 border-transparent text-sm font-medium transition-all duration-150 text-left w-full",
                activeItem === id
                  ? "bg-white/20 text-white border-l-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon size={18} strokeWidth={activeItem === id ? 2.2 : 1.8} />
              <span>{label}</span>
              {id === "alertas" && alertasCount > 0 && (
                <span className="ml-auto bg-[#e8f0fe] text-[#1a4fa0] text-xs font-bold rounded-full min-w-[20px] px-1.5 h-5 flex items-center justify-center">
                  {alertasCount > 99 ? "99+" : alertasCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="px-3 pb-6">
          <div className="mx-0 h-px bg-white/20 mb-4" />
          <button
            className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg hover:bg-white/10 transition-colors w-full"
            onClick={() => navigate("/perfil")}
          >
            <div className="w-8 h-8 rounded-full bg-[#5b8de8] flex items-center justify-center text-xs font-bold text-white shrink-0">
              {iniciais || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {nomeExibido}
              </p>
              <p className="text-xs text-white/60 truncate">
                Sistemas de Informação
              </p>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}
