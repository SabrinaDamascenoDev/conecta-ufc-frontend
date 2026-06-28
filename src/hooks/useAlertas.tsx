import { useState, useEffect, useCallback, useRef } from "react";
import { getAlertas } from "@/services/vagasAlertasService"; // Ajuste o caminho se necessário
import { useFavoritos } from "@/context/FavoritosContext";
import {
  mapearOportunidade,
  type OportunidadesParams,
  type PaginationMeta,
  type VagaMapeada,
} from "./useOportunidades";

const DEFAULT_META: PaginationMeta = {
  total_elements: 0,
  total_pages: 1,
  current_page: 1,
  size: 10,
  has_next: false,
  has_previous: false,
};

export function useAlertas() {
  const { favoritosIds } = useFavoritos();

  const [params, setParamsState] = useState<OportunidadesParams>({
    page: 1,
    size: 10,
  });

  const [vagas, setVagas] = useState<VagaMapeada[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ref sempre atualizado — permite que o fetch leia os ids sem ser dependência
  const favoritosIdsRef = useRef(favoritosIds);
  useEffect(() => {
    favoritosIdsRef.current = favoritosIds;
  }, [favoritosIds]);

  // ─── Effect 1: fetch — Busca e mapeia usando a mesma função das vagas ──────
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const response = await getAlertas(params);
        const raw = response?.data || [];

        if (!cancelled) {
          const mapeadas = raw
            .map(mapearOportunidade)
            .filter((v): v is VagaMapeada => v !== null)
            .map((v) => ({ ...v, salvo: favoritosIdsRef.current.has(v.id) }));

          setVagas(mapeadas);
          setMeta(
            response?.meta ?? {
              ...DEFAULT_META,
              total_elements: mapeadas.length,
              current_page: params.page ?? 1,
              size: params.size ?? 10,
            }
          );
        }
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Erro ao carregar alertas");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [params]);

  // ─── Effect 2: sincroniza campo `salvo` sem re-fetchar ─────────────────────
  useEffect(() => {
    setVagas((prev) =>
      prev.map((v) => ({ ...v, salvo: favoritosIds.has(v.id) }))
    );
  }, [favoritosIds]);

  const goToPage = useCallback((page: number) => {
    setParamsState((prev) => ({ ...prev, page }));
  }, []);

  const setParams = useCallback(
    (partial: Partial<Omit<OportunidadesParams, "page">>) => {
      setParamsState((prev) => {
        const next = { ...prev, ...partial, page: 1 };
        if (
          next.busca === prev.busca &&
          next.tipo === prev.tipo &&
          next.origem === prev.origem &&
          next.remuneracao_min === prev.remuneracao_min &&
          next.remuneracao_max === prev.remuneracao_max
        )
          return prev;
        return next;
      });
    },
    []
  );

  return { vagas, setVagas, loading, error, meta, goToPage, setParams };
}