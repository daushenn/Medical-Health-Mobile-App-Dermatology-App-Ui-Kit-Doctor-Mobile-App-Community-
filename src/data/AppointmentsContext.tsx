import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import { addDays, startOfDay, toISO } from '../utils/dates';

export type Status = 'upcoming' | 'complete' | 'cancelled';

export type Patient = {
  who: 'self' | 'other';
  name: string;
  age: string;
  gender: string;
  problem: string;
};

export type Appointment = {
  id: string;
  doctorId: string;
  date: string; // YYYY-MM-DD
  time: string; // "9:30 AM - 10:00 AM"
  status: Status;
  patient: Patient;
  cancelReason?: string;
};

type NewAppointment = Omit<Appointment, 'id' | 'status' | 'cancelReason'>;

type Ctx = {
  appointments: Appointment[];
  add: (a: NewAppointment) => void;
  cancel: (id: string, reason: string) => void;
  complete: (id: string) => void;
};

const AppointmentsContext = createContext<Ctx | null>(null);

// Demo data so the screen is not empty. Return [] to start with no appointments.
const seed = (): Appointment[] => {
  const today = startOfDay(new Date());
  const patient: Patient = {
    who: 'self', name: 'John Doe', age: '30', gender: 'Male',
    problem: 'Itchy rash on the arm that appears in the evenings.',
  };
  return [
    { id: 's1', doctorId: '1', date: toISO(addDays(today, 3)), time: '9:30 AM - 10:00 AM', status: 'upcoming', patient },
    { id: 's2', doctorId: '2', date: toISO(addDays(today, 5)), time: '2:30 PM - 3:00 PM', status: 'upcoming', patient },
    { id: 's3', doctorId: '3', date: toISO(addDays(today, -7)), time: '10:00 AM - 10:30 AM', status: 'complete', patient },
    {
      id: 's4', doctorId: '4', date: toISO(addDays(today, -3)), time: '1:00 PM - 1:30 PM',
      status: 'cancelled', patient, cancelReason: 'Rescheduling',
    },
  ];
};

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(seed);

  const add = useCallback((a: NewAppointment) => {
    setAppointments((prev) => [{ ...a, id: String(Date.now()), status: 'upcoming' }, ...prev]);
  }, []);

  const cancel = useCallback((id: string, reason: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'cancelled', cancelReason: reason } : a)),
    );
  }, []);

  const complete = useCallback((id: string) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'complete' } : a)));
  }, []);

  const value = useMemo(() => ({ appointments, add, cancel, complete }), [appointments, add, cancel, complete]);

  return <AppointmentsContext.Provider value={value}>{children}</AppointmentsContext.Provider>;
}

export function useAppointments() {
  const ctx = useContext(AppointmentsContext);
  if (!ctx) throw new Error('useAppointments must be used inside AppointmentsProvider');
  return ctx;
}