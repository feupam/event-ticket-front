import { useState } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { ReservationResponse } from '@/services/reservationService';

interface UseReservationProcessProps {
  eventId: string;
  ticketKind: string;
}

export interface ReservationData extends ReservationResponse {
  id?: string;
}

export function useReservationProcess({ eventId, ticketKind }: UseReservationProcessProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reservationData, setReservationData] = useState<ReservationData | null>(null);
  const [isWaitingList, setIsWaitingList] = useState(false);
  const [reservationStatus, setReservationStatus] = useState<'available' | 'reserved' | 'waiting' | 'cancelled' | 'expired' | 'pago' | null>(null);
  const { toast } = useToast();

  // Verifica se há vagas disponíveis para o evento
  const checkSpotAvailability = async () => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage(null);
    
    try {
      const response = await api.events.checkSpot(eventId, ticketKind);
      console.log('Resposta da verificação de disponibilidade:', response);
      
      // Verifica se a resposta é um booleano
      if (typeof response === 'boolean') {
        return response;
      }
      
      // Se for um objeto, verifica a propriedade isAvailable
      if (response && typeof response === 'object') {
        setIsWaitingList(!!response.waitingList);
        return !!response.isAvailable;
      }
      
      // Se não for nenhum dos dois, retorna falso
      return false;
    } catch (error: any) {
      console.error('Erro ao verificar disponibilidade:', error);
      setIsError(true);
      setErrorMessage('Não foi possível verificar a disponibilidade de vagas');
      toast({
        title: 'Erro',
        description: 'Não foi possível verificar a disponibilidade de vagas',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Tenta reservar uma vaga no evento
  const reserveSpot = async () => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage(null);
    
    try {
      const response = await api.events.reserveSpot(eventId, {
        ticket_kind: ticketKind,
        userType: 'client'
      });
      
      setReservationData(response);
      
      // Salva o momento da reserva para countdown de 10 minutos
      localStorage.setItem('reservationTimestamp', new Date().toISOString());
      localStorage.setItem('reservationData', JSON.stringify(response));
      
      toast({
        title: 'Reserva realizada',
        description: 'Sua vaga foi reservada com sucesso!',
      });
      
      return response;
    } catch (error: any) {
      console.error('Erro ao reservar vaga:', error);
      
      // Verifica se o erro é 409 (usuário já tem reserva)
      if (error.response?.status === 409) {
        try {
          // Busca as reservas existentes do usuário
          await fetchUserReservations();
          return reservationData;
        } catch (subError) {
          setIsError(true);
          setErrorMessage('Não foi possível recuperar sua reserva existente');
          toast({
            title: 'Erro',
            description: 'Não foi possível recuperar sua reserva existente',
            variant: 'destructive',
          });
          return null;
        }
      } else {
        setIsError(true);
        setErrorMessage('Não foi possível reservar sua vaga');
        toast({
          title: 'Erro',
          description: 'Não foi possível reservar sua vaga',
          variant: 'destructive',
        });
        return null;
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Busca as reservas existentes do usuário
  const fetchUserReservations = async () => {
    setIsLoading(true);
    setIsError(false);
    
    try {
      const reservations = await api.users.getReservations();
      
      if (reservations && reservations.length > 0) {
        // Filtra para pegar a reserva do evento atual
        const currentEventReservation = reservations.find(
          (res: any) => res.eventId === eventId
        );
        
        if (currentEventReservation) {
          setReservationData(currentEventReservation);
          localStorage.setItem('reservationData', JSON.stringify(currentEventReservation));
          return currentEventReservation;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
      setIsError(true);
      setErrorMessage('Não foi possível buscar suas reservas');
      toast({
        title: 'Erro',
        description: 'Não foi possível buscar suas reservas',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Inicia o processo de compra do ingresso
  const purchaseTicket = async (eventId: string) => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage(null);
    
    try {
      console.log(`Verificando status da reserva para o evento: ${eventId}`);
      
      // Chama a API apenas com o eventId
      const response = await api.tickets.purchase(eventId);
      
      console.log('Resposta da API de verificação de status:', response);
      
      // Extrai o status para definir o estado do hook
      const status = typeof response === 'string' ? response : response?.status;
      if (status) {
        setReservationStatus(status as any);
      }
      
      toast({
        title: 'Status verificado',
        description: 'Verificamos o status da sua reserva',
      });
      
      // Retorna o resultado para quem chamou a função poder tomar ações apropriadas
      return response;
    } catch (error) {
      console.error('Erro ao verificar status da reserva:', error);
      setIsError(true);
      setErrorMessage('Não foi possível verificar o status da sua reserva');
      toast({
        title: 'Erro',
        description: 'Não foi possível verificar o status da sua reserva',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Verifica o status da reserva e obtém o tempo restante usando a rota /retry
  const tryPurchase = async (eventId: string) => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage(null);
    
    try {
      console.log(`Verificando status da reserva com /retry para o evento: ${eventId}`);
      
      // Chama a API de retry para obter o tempo restante preciso
      const response = await api.tickets.retryPurchase(eventId);
      
      console.log('Resposta da API de retry:', response);
      
      // Se temos um status e tempo restante, atualiza o status
      if (response && response.status) {
        setReservationStatus(response.status as any);
        
        // Se a reserva ainda estiver válida e tiver tempo restante, atualiza o timestamp
        if (response.status === 'reserved' && response.remainingMinutes) {
          // Calcula o timestamp com base no tempo restante
          const now = new Date();
          const expiresAt = new Date(now.getTime() + (response.remainingMinutes * 60 * 1000));
          const adjustedTimestamp = new Date(expiresAt.getTime() - (10 * 60 * 1000)); // Ajusta para 10 minutos
          
          localStorage.setItem('reservationTimestamp', adjustedTimestamp.toISOString());
          
          toast({
            title: 'Reserva válida',
            description: `Você tem ${response.remainingMinutes} minutos para concluir a compra`,
          });
        }
      }
      
      // Retorna o resultado para quem chamou a função
      return response;
    } catch (error) {
      console.error('Erro ao verificar status da reserva com retry:', error);
      setIsError(true);
      setErrorMessage('Não foi possível verificar o tempo restante da sua reserva');
      toast({
        title: 'Erro',
        description: 'Não foi possível verificar o tempo restante da sua reserva',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Retorna o tempo restante para completar a compra (10 minutos)
  const getRemainingTime = (): number | null => {
    const reservationTime = localStorage.getItem('reservationTimestamp');
    if (!reservationTime) return null;
    
    const reservedAt = new Date(reservationTime).getTime();
    const now = new Date().getTime();
    const timePassed = now - reservedAt;
    const timeLimit = 10 * 60 * 1000; // 10 minutos em milissegundos
    const remaining = timeLimit - timePassed;
    
    return remaining > 0 ? remaining : 0;
  };

  // Verifica o status da reserva para determinar as próximas ações
  const checkReservationStatus = async () => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage(null);
    
    try {
      console.log(`Verificando status da reserva para evento: ${eventId}`);
      
      // Chama a API apenas com o eventId
      const response = await api.tickets.purchase(eventId);
      
      console.log('Resposta do status da reserva:', response);
      
      // NOVO: trata caso de waiting-list
      if (response && typeof response === 'object' && response.status === 'waiting-list') {
        toast({
          title: 'Lista de Espera',
          description: response.message || 'Todos os ingressos foram pagos. Você foi adicionado à lista de interessados.',
          variant: 'default',
        });
        // Redireciona para a fila de espera
        window.location.href = `/fila?event=${eventId}`;
        return 'waiting-list';
      }
      
      if (response) {
        // A API pode retornar o status diretamente como string ou em um campo status
        const status = typeof response === 'string' ? response : response.status;
        
        // Define o estado baseado no status retornado
        if (status) {
          setReservationStatus(status as any);
          return status;
        }
      }
      
      return null;
    } catch (error: any) {
      console.error('Erro ao verificar status da reserva:', error);
      
      // Se a reserva estiver cancelada
      if (error.response?.status === 400 && error.response?.data?.message?.includes('cancelled')) {
        setReservationStatus('cancelled');
        return 'cancelled';
      }
      
      setIsError(true);
      setErrorMessage('Não foi possível verificar o status da sua reserva');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isError,
    errorMessage,
    reservationData,
    isWaitingList,
    reservationStatus,
    checkSpotAvailability,
    reserveSpot,
    fetchUserReservations,
    purchaseTicket,
    getRemainingTime,
    checkReservationStatus,
    tryPurchase
  };
} 