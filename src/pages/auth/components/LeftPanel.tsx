import logo from "../../../assets/logo.png";

export function LeftPanel() {
  return (
    <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-[#0066CC] via-[#0056B3] to-[#003D7A] flex-col items-center justify-center px-12 py-12 text-white">
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        <img
          src={logo}
          alt="Pedra da Galinha Choca"
          className="w-56 xl:w-64 opacity-90"
        />
        <div className="mt-6">
          <p className="text-lg tracking-[0.35em] uppercase text-blue-100">
            Conecta
          </p>
          <h1 className="text-5xl font-extrabold tracking-wide">UFC</h1>
        </div>
        <div className="mt-10">
          <h2 className="text-3xl font-bold leading-tight">
            Oportunidades acadêmicas
            <br />
            em um só lugar
          </h2>
          <p className="mt-4 text-blue-100 leading-relaxed">
            Encontre bolsas, monitorias, extensão, pesquisa e projetos
            acadêmicos de forma simples e organizada.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center max-w-lg mt-10">
          {["Bolsas", "Monitorias", "Extensão", "Pesquisa", "Desenvolvimento"].map(
            (tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium hover:bg-white/20 transition-all"
              >
                {tag}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
}