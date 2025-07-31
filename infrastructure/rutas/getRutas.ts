import { Ruta } from '@/core/entities/Ruta';
import api from '../api/apiConfig';

export const getRutas = async (): Promise<Ruta[]> => {
  try {
    const response = await api.get<Ruta[]>('/rutas');
    return response.data;
  } catch (error) {
    console.error('Error al obtener rutas:', error);
    return []; // o puedes lanzar el error si prefieres manejarlo fuera
  }
};
