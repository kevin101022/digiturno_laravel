import { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
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
        turnos_en_espera: number;
    };
    alertas?: Array<{
        tipo: 'error' | 'warning';
        titulo: string;
        mensaje: string;
    }>;
    modulos: Array<{
        nombre: string;
        iniciales: string;
        modulo: string;
        estado: 'atendiendo' | 'disponible' | 'pausa' | 'desconectado';
        turno: string | null;
        tiempo: string | null;
    }>;
    asesores_disponibles: Array<{
        id: number;
        iniciales: string;
        nombre: string;
        especialidad: string;
        activo: boolean;
        estado: string;
    }>;
    asesores_registrados: Array<{
        id: number;
        nombre: string;
        tipo_doc: string;
        numero_doc: string;
        especialidades: string[];
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
            calificacion: string;
            estado: 'activo' | 'pausa';
        }>;
    };
    reportes: {
        kpis: {
            volumen_total: number;
            tiempo_promedio: number;
            tasa_ausentismo: number;
        };
        chart_diario: Array<{ label: string; value: number }>;
        chart_semanal: Array<{ label: string; value: number }>;
        filtros: {
            fecha_inicio: string;
            fecha_fin: string;
        };
    };
    cola: {
        general: number;
        victimas: number;
        total: number;
        nivel: 'Baja' | 'Media' | 'Alta';
    };
    config: {
        tee_maximo: number;
        saturacion_sala: number;
        ratio_tendencia: number;
        duracion_pausas: number;
        system_state: {
            ultima_actualizacion: string;
            nodos_activos: string;
            version: string;
        };
    };
    mesas: Array<{
        id: number;
        numero: number;
        tipo: string;
        asesorAsignado: any;
    }>;
    shift_actual: 'morning' | 'afternoon';
    coordinador: {
        nombre: string;
        rol: string;
        avatar: string;
    };
}

// ─── Página Principal ─────────────────────────────────────────────────────────
export default function CoordinadorIndex(props: Props) {
    // Leemos el tab de la URL para que persista en recargas/navegaciones
    const urlParams = new URLSearchParams(window.location.search);
    const initialTab = (urlParams.get('tab') as any) || 'dashboard';
    
    const [activeTab, setActiveTab] = useState<CoordinadorTab>(initialTab);
    const [data, setData] = useState(props);

    // Si cambian las props desde el servidor, actualizamos data
    useEffect(() => {
        setData(props);
    }, [props]);

    const handleTabChange = (t: CoordinadorTab) => {
        setActiveTab(t);
        // Actualizamos la URL sin recargar para que si hay un router.get después, sepa dónde estamos
        const url = new URL(window.location.href);
        url.searchParams.set('tab', t);
        window.history.replaceState({}, '', url);
    };

    // Polling cada 10 segundos — refresca KPIs, módulos y cola
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: ['kpis', 'modulos', 'asesores_disponibles', 'asesores_registrados', 'cola', 'rendimiento', 'reportes', 'alertas'],
            });
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <CoordinadorLayout
            title="Portal del Coordinador — APE Turnos"
            activeTab={activeTab}
            onTabChange={handleTabChange}
            coordinador={props.coordinador}
        >
            {activeTab === 'dashboard' && (
                <PantallaDashboard
                    kpis={props.kpis}
                    alertas={props.alertas ?? []}
                    modulos={props.modulos}
                    cola={props.cola}
                />
            )}

            {activeTab === 'gestion' && (
                <PantallaGestion
                    asesores_disponibles={props.asesores_disponibles}
                    asesores_registrados={props.asesores_registrados}
                    initialMesas={props.mesas}
                    shiftActual={props.shift_actual}
                />
            )}

            {activeTab === 'rendimiento' && (
                <PantallaRendimiento
                    rendimiento={props.rendimiento}
                />
            )}

            {activeTab === 'reportes' && (
                <PantallaReportes 
                    reportes={props.reportes}
                />
            )}

            {activeTab === 'configuracion' && (
                <PantallaConfiguracion
                    initialConfig={props.config}
                />
            )}
        </CoordinadorLayout>
    );
}
