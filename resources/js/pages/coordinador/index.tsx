import { useState } from 'react';
import CoordinadorLayout, { type CoordinadorTab } from '@/layouts/coordinador-layout';
import PantallaDashboard    from '@/components/coordinador/PantallaDashboard';
import PantallaGestion      from '@/components/coordinador/PantallaGestion';
import PantallaRendimiento  from '@/components/coordinador/PantallaRendimiento';
import PantallaReportes     from '@/components/coordinador/PantallaReportes';
import PantallaConfiguracion from '@/components/coordinador/PantallaConfiguracion';

// ─── Props que vienen del Controller ─────────────────────────────────────────
interface Props {
    kpis: {
        turnos_totales_hoy: number;
        tiempo_promedio_espera: number;
        ventanillas_activas: number;
        ventanillas_total: number;
    };
    alertas: Array<{
        tipo: 'error' | 'warning';
        titulo: string;
        mensaje: string;
    }>;
    modulos: Array<{
        nombre: string;
        asesor: string;
        iniciales: string;
        estado: 'atendiendo' | 'disponible' | 'pausa';
        turno: string | null;
        tiempo: string | null;
    }>;
    asesores_disponibles: Array<{
        iniciales: string;
        nombre: string;
        especialidad: string;
        activo: boolean;
    }>;
    rendimiento: {
        tmo_global: string;
        turnos_atendidos: number;
        meta_diaria_pct: number;
        tmo_tendencia: string;
        asesores: Array<{
            iniciales: string;
            nombre: string;
            modulo: string;
            turnos: number;
            tmo: string;
            pausas: string;
            estado: 'activo' | 'pausa';
        }>;
    };
    coordinador: {
        nombre: string;
        rol: string;
        avatar: string;
    };
}

// ─── Página Principal ─────────────────────────────────────────────────────────
export default function CoordinadorIndex(props: Props) {
    const [activeTab, setActiveTab] = useState<CoordinadorTab>('dashboard');

    return (
        <CoordinadorLayout
            title="Portal del Coordinador — APE Turnos"
            activeTab={activeTab}
            onTabChange={setActiveTab}
            coordinador={props.coordinador}
        >
            {activeTab === 'dashboard' && (
                <PantallaDashboard
                    kpis={props.kpis}
                    alertas={props.alertas}
                    modulos={props.modulos}
                />
            )}

            {activeTab === 'gestion' && (
                <PantallaGestion
                    asesores_disponibles={props.asesores_disponibles}
                />
            )}

            {activeTab === 'rendimiento' && (
                <PantallaRendimiento
                    rendimiento={props.rendimiento}
                />
            )}

            {activeTab === 'reportes' && (
                <PantallaReportes />
            )}

            {activeTab === 'configuracion' && (
                <PantallaConfiguracion />
            )}
        </CoordinadorLayout>
    );
}
