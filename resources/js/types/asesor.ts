export type EstadoAsesor = 
    | 'disponible' 
    | 'atendiendo' 
    | 'validando_ruv' 
    | 'pausa'
    | 'dashboard'
    | 'ventanillas'
    | 'historial';

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

export interface TurnoFila {
    id: number;
    turn_code: string;
    category: string;
    created_at: string;
}

export interface AsesorStats {
    atendidos_hoy: number;
    tiempo_promedio: string;
    en_espera: number;
}
