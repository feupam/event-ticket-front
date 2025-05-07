import { api } from './api';

interface EventStatusResponse {
  currentDate: string;
  isOpen: boolean;
}

export const eventService = {
  async getEventStatus(eventId: string): Promise<EventStatusResponse> {
    const response = await api.get<EventStatusResponse>(`/events/${eventId}/event-status`);
    return response.data;
  }
}; 