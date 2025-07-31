import api from '../api/apiConfig';

export const getAllParadas = async (paradaRutaId: number, userId: string): Promise<void> => {
  try {
    const response = await api.post('/boletos');
  } catch (error) {
    console.error('Error al obtener rutas:', error);
  }
};
