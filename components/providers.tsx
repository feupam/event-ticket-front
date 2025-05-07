'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { EventsProvider } from '@/contexts/EventsContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { PropsWithChildren, createContext, useState, useContext, useEffect } from 'react';
import { api } from '@/lib/api';

// Interface para as opções de parcelamento da API
interface ApiInstallmentOption {
  installmentNumber: number;
  valueInCents: number;
  valueWithInterest: string;
}

// Interface para as opções de parcelamento usadas pelos componentes
interface InstallmentOption {
  number: number;
  valueInCents: number;
  formattedValue: string;
}

// Interface para o contexto de parcelamento
interface InstallmentsContextType {
  installmentOptions: InstallmentOption[];
  isLoading: boolean;
  fetchInstallments: (eventId: string) => Promise<void>;
  eventId: string | null;
}

// Criar o contexto
const InstallmentsContext = createContext<InstallmentsContextType>({
  installmentOptions: [],
  isLoading: false,
  fetchInstallments: async () => {},
  eventId: null
});

// Hook para usar o contexto
export function useInstallments() {
  return useContext(InstallmentsContext);
}

// Provider do contexto
export function InstallmentsProvider({ children }: PropsWithChildren) {
  const [installmentOptions, setInstallmentOptions] = useState<InstallmentOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [eventId, setEventId] = useState<string | null>(null);

  const fetchInstallments = async (newEventId: string) => {
    // Se já buscou para este evento, não busca novamente
    if (eventId === newEventId && installmentOptions.length > 0) {
      return;
    }

    setIsLoading(true);
    try {
      const apiOptions = await api.events.getInstallments(newEventId);
      
      if (apiOptions && apiOptions.length > 0) {
        // Convertendo do formato da API para o formato usado pelo componente
        const mappedOptions: InstallmentOption[] = apiOptions.map((option: ApiInstallmentOption) => ({
          number: option.installmentNumber,
          valueInCents: option.valueInCents,
          formattedValue: `${option.installmentNumber}x de ${option.valueWithInterest}`
        }));
        setInstallmentOptions(mappedOptions);
      } else {
        // Se não houver opções da API, cria lista vazia
        setInstallmentOptions([]);
      }
      
      // Guarda o ID do evento para evitar buscas repetidas
      setEventId(newEventId);
    } catch (error) {
      console.error('Erro ao buscar opções de parcelamento:', error);
      setInstallmentOptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <InstallmentsContext.Provider value={{ installmentOptions, isLoading, fetchInstallments, eventId }}>
      {children}
    </InstallmentsContext.Provider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <EventsProvider>
          <InstallmentsProvider>
            {children}
            <Toaster />
          </InstallmentsProvider>
        </EventsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
} 