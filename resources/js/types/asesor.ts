export type EstadoAsesor = 
    | 'disponible' 
    | 'atendiendo' 
    | 'validando_ruv' 
    | 'pausa'
    | 'dashboard'
    | 'ventanillas'
    | 'metricas'
    | 'configuracion';

export interface Ciudadano {
    id: string;
    nombre: string;
    documento: string;
    tipo_documento: string;
    categoria: 'victim' | 'priority' | 'business' | 'general';
}

export interface TurnoActual {
    id: string;
    codigo: string;
    ciudadano: Ciudadano;
    hora_llamado: string;
}

export interface AsesorStats {
    atendidos_hoy: number;
    tiempo_promedio: string;
    en_espera: number;
}
