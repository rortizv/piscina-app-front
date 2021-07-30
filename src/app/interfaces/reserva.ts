export interface Reserva {
    id_reserva: number;
    fecha_reserva: string | Date;
    turno: string;
    torre_apto: string;
}