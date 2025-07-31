import { Boleto } from '@/core/entities/Boleto';
import api from '../api/apiConfig';

export const getBoletosByUser = async (userId: string): Promise<Boleto[]> => {
  try {
    const response = await api.get<Boleto[]>(`/boletos/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener rutas:', error);
    return []; // o puedes lanzar el error si prefieres manejarlo fuera
  }
};
