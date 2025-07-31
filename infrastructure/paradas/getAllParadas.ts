import { Parada } from "@/core/entities/Parada";
import api from "../api/apiConfig";

export const getAllParadas = async (): Promise<Parada[]> => {
  try {
    const response = await api.get<Parada[]>('/paradas');
    return response.data;
  } catch (error) {
    console.error('Error al obtener rutas:', error);
    return []; // o puedes lanzar el error si prefieres manejarlo fuera
  }
};
