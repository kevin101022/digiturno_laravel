export type KioscoCategoria = 'victim' | 'priority' | 'business' | 'general';

export type TipoDocumento = 'CC' | 'CE' | 'TI';

export interface KioscoState {
    categoria: KioscoCategoria | null;
    tipoDocumento: TipoDocumento;
    numeroDocumento: string;
}

export interface TurnoGenerado {
    turn_code: string;
    categoria: KioscoCategoria;
    queue_type: 'general' | 'victim';
}

export interface GenerarTurnoPayload {
    categoria: KioscoCategoria;
    tipo_documento: TipoDocumento;
    numero_documento: string;
}

export const CATEGORIA_LABELS: Record<KioscoCategoria, string> = {
    victim: 'Víctima',
    priority: 'Prioritario',
    business: 'Empresario',
    general: 'General',
};

export const TIPO_DOCUMENTO_LABELS: Record<TipoDocumento, string> = {
    CC: 'Cédula de Ciudadanía',
    CE: 'Cédula de Extranjería',
    TI: 'Tarjeta de Identidad',
};
