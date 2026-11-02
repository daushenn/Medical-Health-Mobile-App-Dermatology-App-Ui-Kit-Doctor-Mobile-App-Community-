import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

export type Profile = { name: string; phone: string; email: string; dob: string };

type Ctx = { profile: Profile; update: (p: Partial<Profile>) => void };

const ProfileContext = createContext<Ctx | null>(null);

const initial: Profile = { name: 'John Doe', phone: '+123 567 89000', email: 'johndoe@example.com', dob: '' };

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(initial);
  const update = useCallback((p: Partial<Profile>) => setProfile((prev) => ({ ...prev, ...p })), []);
  const value = useMemo(() => ({ profile, update }), [profile, update]);
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used inside ProfileProvider');
  return ctx;
}
