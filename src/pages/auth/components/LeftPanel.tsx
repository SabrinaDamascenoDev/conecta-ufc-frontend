
import logo from "../../../assets/logo.png";

export function LeftPanel() {
  return (
    <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#0066CC] to-[#00488C] flex-col items-center justify-between p-50 text-white">
      <div className="flex flex-col items-center gap-6">
        <img src={logo} alt="Pedra da galinha choca" className="w-70 opacity-80" />
        <div className="text-center">
          <p className="text-2xl font-light tracking-[0.3em] uppercase">Conecta</p>
          <p className="text-4xl font-bold tracking-wider">UFC</p>
        </div>
        <div className="text-center mt-6">
          <h2 className="text-2xl font-bold mb-3">
            Oportunidades acadêmicas<br />em um só lugar
          </h2>
          <p className="text-blue-100 text-sm">
            Bolsas, monitorias, extensão e pesquisa<br />da UFC centralizadas para você
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {["Bolsas", "Mentorias", "Extensão", "Pesquisa", "Desenvolvimento"].map((tag) => (
          <span key={tag} className="border border-white/50 text-white text-xs px-3 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}