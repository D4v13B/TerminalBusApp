import { User } from "@/types";
import { ParadaRuta } from "../Boleto";

export interface BoletoResponse {
  id: number;
  fechaUso: Date;
  valido: boolean;
  tokenBoleto: string;
  paradaRuta: ParadaRuta;
  user: User;
}
