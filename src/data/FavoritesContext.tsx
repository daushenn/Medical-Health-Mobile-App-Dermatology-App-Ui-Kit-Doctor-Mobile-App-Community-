import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

type Ctx = {
  doctorIds: string[];
  serviceNames: string[];
  toggleDoctor: (id: string) => void;
  toggleService: (name: string) => void;
};

const FavoritesContext = createContext<Ctx | null>(null);

const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  // Demo data so the Favorite screen is not empty. Use [] to start with none.
  const [doctorIds, setDoctorIds] = useState<string[]>(['1', '3']);
  const [serviceNames, setServiceNames] = useState<string[]>(['Dermato-Endocrinology']);

  const toggleDoctor = useCallback((id: string) => setDoctorIds((l) => toggle(l, id)), []);
  const toggleService = useCallback((name: string) => setServiceNames((l) => toggle(l, name)), []);

  const value = useMemo(
    () => ({ doctorIds, serviceNames, toggleDoctor, toggleService }),
    [doctorIds, serviceNames, toggleDoctor, toggleService],
  );
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used inside FavoritesProvider');
  return ctx;
}
