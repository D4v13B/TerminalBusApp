export interface Parada {
  id: number
  nombre: string
  lat: number
  long: number
}

export interface ParadaRuta{
  id: number,
  paradaId: number,
  anden: string,
  horaSalida: string
  nombreRuta: string,
  nombreParada: string,
  precio: number,
}