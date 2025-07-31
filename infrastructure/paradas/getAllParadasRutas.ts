import { ParadaRuta } from "@/core/entities/Parada";
import api from "../api/apiConfig";

export const getAllParadasRutas = async (): Promise<ParadaRuta[]> => {
  try {
    const response = await api.get<ParadaRuta[]>('/parada-ruta');
    return response.data;
  } catch (error) {
    console.error('Error al obtener rutas:', error);
    return []; // o puedes lanzar el error si prefieres manejarlo fuera
  }
};
