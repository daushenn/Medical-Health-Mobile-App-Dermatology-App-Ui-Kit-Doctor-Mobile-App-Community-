import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

export type Method = 'card' | 'apple' | 'paypal' | 'google';

// Only non-sensitive card details are kept. The full number and CVV are never stored.
export type Card = { holder: string; last4: string; expiry: string };

type Ctx = {
  method: Method;
  card: Card | null;
  setMethod: (m: Method) => void;
  saveCard: (c: Card) => void;
  label: string;
};

const PaymentContext = createContext<Ctx | null>(null);

const NAMES: Record<Method, string> = { card: 'Card', apple: 'Apple Pay', paypal: 'PayPal', google: 'Google Pay' };

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [method, setMethod] = useState<Method>('card');
  const [card, setCard] = useState<Card | null>(null);

  const saveCard = useCallback((c: Card) => {
    setCard(c);
    setMethod('card');
  }, []);

  const label = method === 'card' && card ? `Card •••• ${card.last4}` : NAMES[method];
  const value = useMemo(() => ({ method, card, setMethod, saveCard, label }), [method, card, saveCard, label]);
  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
}

export function usePayment() {
  const ctx = useContext(PaymentContext);
  if (!ctx) throw new Error('usePayment must be used inside PaymentProvider');
  return ctx;
}
