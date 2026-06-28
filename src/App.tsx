
import AppRouter from "@/routes/AppRouter";
import { FavoritosProvider } from "@/context/FavoritosContext";

export default function App() {
  return (
    <FavoritosProvider>
      <AppRouter />
    </FavoritosProvider>
  );
}