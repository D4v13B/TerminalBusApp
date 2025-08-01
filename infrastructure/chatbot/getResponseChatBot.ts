import { BotResponse, Content } from '@/core/entities/DTOs/ChatBot/Content';
import api from '../api/apiConfig';

export const getResponseChatBot = async (data: {
  message: string;
  conversation: Content[];
}): Promise<BotResponse | null> => {
  try {
    const response = await api.post<BotResponse>('bot-api/respond', data);
    return response.data;
  } catch (error) {
    console.error('Error al contactar con el bot', error);
    return null; // o puedes lanzar el error si prefieres manejarlo fuera
  }
};
