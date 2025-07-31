import { BoletoResponse } from '@/core/entities/DTOs/BoletoSaveResponse';
import api from '../api/apiConfig';

export const saveBoleto = async (
  paradaRutaId: number,
  userId: string
): Promise<BoletoResponse | null> => {
  try {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 1);

    const fechaFormateada = fecha.toISOString().slice(0, 19);

    const response = await api.post<BoletoResponse>('/boletos', {
      paradaRutaId,
      userId,
      fechaUso: fechaFormateada,
    });

    return response.data
  } catch (error) {
    console.error('Error al obtener rutas:', error);
    return null
  }
};
