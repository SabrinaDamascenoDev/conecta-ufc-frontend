import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getFavoritos, favoritarVaga, desfavoritarVaga } from "@/services/vagasFavoritasService";

interface FavoritosContextValue {
  favoritosIds: Set<number>;
  toggleFavorito: (id: number) => Promise<void>;
  isFavorito: (id: number) => boolean;
}

const FavoritosContext = createContext<FavoritosContextValue | null>(null);

const STORAGE_KEY = "favoritos_ids";

function loadFromStorage(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as number[]);
  } catch {
    return new Set();
  }
}

function saveToStorage(ids: Set<number>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

export function FavoritosProvider({ children }: { children: React.ReactNode }) {
  const [favoritosIds, setFavoritosIds] = useState<Set<number>>(loadFromStorage);

  useEffect(() => {
    getFavoritos()
      .then((lista) => {
        const ids = new Set(lista.map((o: { id: number }) => o.id));
        setFavoritosIds(ids);
        saveToStorage(ids);
      })
      .catch(() => {});
  }, []);

  const toggleFavorito = useCallback(async (id: number) => {
    const eraFavorito = favoritosIds.has(id);

    setFavoritosIds((prev) => {
      const next = new Set(prev);
      if (eraFavorito) next.delete(id);
      else next.add(id);
      saveToStorage(next);
      return next;
    });

    try {
      if (eraFavorito) {
        await desfavoritarVaga({ oportunidade_id: id });
      } else {
        await favoritarVaga({ oportunidade_id: id });
      }
    } catch {
      setFavoritosIds((prev) => {
        const next = new Set(prev);
        if (eraFavorito) next.add(id);
        else next.delete(id);
        saveToStorage(next);
        return next;
      });
    }
  }, [favoritosIds]);

  const isFavorito = useCallback((id: number) => favoritosIds.has(id), [favoritosIds]);

  return (
    <FavoritosContext.Provider value={{ favoritosIds, toggleFavorito, isFavorito }}>
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritos() {
  const ctx = useContext(FavoritosContext);
  if (!ctx) throw new Error("useFavoritos deve ser usado dentro de FavoritosProvider");
  return ctx;
}