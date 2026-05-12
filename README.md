> # 🚀 Digiturno Inteligente — APE SENA

Este proyecto es una solución integral para la gestión y automatización de turnos en la **Agencia Pública de Empleo (APE)** del SENA. Está diseñado con un enfoque institucional, garantizando una experiencia de usuario fluida, accesible y visualmente coherente con los estándares de la entidad.

## 🛠️ Tecnologías Utilizadas

El sistema está construido con un stack moderno de alto rendimiento:

- **Backend**: [Laravel 11](https://laravel.com/) (PHP) gestionado con [Laravel Herd](https://herd.laravel.com/).
- **Frontend**: [React 19](https://react.dev/) con [Inertia.js](https://inertiajs.com/) para una experiencia de SPA sin complicaciones de API.
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/) para un diseño modular y ultra rápido.
- **Tipografía**: Fuentes institucionales *Syne* y *Plus Jakarta Sans*.
- **Iconografía**: [Iconify](https://iconify.design/) y [Lucide React](https://lucide.dev/).
- **Gestión de Paquetes**: [pnpm](https://pnpm.io/).
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/) para un código robusto y tipado.

## 🆕 Arquitectura de Turnos (Modo Manual - Pull)

El sistema ha sido actualizado para funcionar mediante un modelo manual ("Pull Architecture").

- **Fila Inteligente con Lógica FIFO**: Los turnos generados en el Kiosco entran a una fila de espera categorizada y priorizada (Víctimas > Prioritarios > Empresarios/General). Dentro de cada grupo de prioridad, el sistema aplica la regla **FIFO (First-In, First-Out)**, garantizando que el ciudadano que llegó primero sea atendido primero, respetando estrictamente el orden de llegada de acuerdo a su categoría.
- **Control del Asesor**: Los asesores ven una lista de tarjetas de turnos en tiempo real y eligen manualmente cuál turno "Aceptar" y llamar a ventanilla, evitando que el sistema les asigne ciudadanos mientras están ocupados o ausentes.
- **Gestión de Pausas Inteligentes**: Sistema de recesos operativos que permite al asesor suspender la recepción de turnos. Incluye un cronómetro en tiempo real y registra la duración exacta en la base de datos (`duration_seconds`). El sistema cuenta con protección contra desfases de reloj (drift protection) mediante cálculos de valor absoluto y redondeo de precisión, evitando errores de desbordamiento numérico.
- **Historial de Operación Extendido**: Los asesores cuentan con una pestaña dedicada para ver su resumen diario. Esta vista consulta la base de datos en tiempo real e incluye:
  - **Métricas de Rendimiento**: Total de atendidos, tiempo promedio y calificación media.
  - **Consolidado de Descansos**: Contador de pausas realizadas y el tiempo total acumulado en recesos durante la jornada.
  - **Tablas de Detalle**: Desglose individual de cada turno atendido (con su duración y calificación) y de cada pausa realizada (con su motivo y tiempo exacto).
- **Bloqueo Operativo por Módulo**: Sistema de seguridad que impide la operación de asesores no asignados. Si el coordinador no le ha asignado un módulo al asesor en la Mesa de Trabajo, el sistema bloquea visualmente la fila de turnos, apaga las peticiones de red (polling) para ahorrar recursos del servidor, y protege las rutas backend con errores HTTP 403. El asesor solo podrá ver su "Historial" hasta que se le asigne un módulo.
- **Asignación Inteligente por Rol**: El sistema filtra automáticamente la fila; por ejemplo, los asesores designados para Víctimas solo ven los turnos de dicha categoría, mientras que los asesores generales ven el resto.

## ⚙️ Portal del Coordinador — Inteligencia Operativa

El Portal del Coordinador ha sido transformado de una interfaz estática a una herramienta de gestión dinámica y en tiempo real, conectada directamente a la infraestructura de datos de la APE.

### 1. Dashboard de Control y Monitoreo en Vivo

- **Polling Inteligente**: Sincronización automática cada 10 segundos para actualizar métricas críticas sin intervención del usuario.
- **KPIs en Tiempo Real**: Visualización dinámica de Turnos Totales, Tiempo Medio de Atención (TMO), Ventanillas Activas y Ciudadanos en Espera.
- **Motor de Alertas Operativas**: Sistema inteligente que dispara notificaciones visuales basadas en umbrales de base de datos:
  - **TEE Crítico**: Alerta cuando el tiempo de espera supera el límite permitido.
  - **Saturación de Sala**: Aviso automático cuando la relación ciudadanos/asesores es ineficiente.
  - **Pausas Prolongadas**: Identificación de asesores que exceden su tiempo de receso.
  - **Inactividad Total**: Notificación si hay cola pero no hay ventanillas atendiendo.
- **Leyenda de Alertas**: Guía visual persistente que explica el significado de cada icono y tipo de alerta para una interpretación rápida.
- **Resumen de Cola Dinámico**: Indicador de nivel de saturación (Baja, Media, Alta) calculado en tiempo real.
- **Estado de Ventanillas**: Monitoreo individual de cada asesor con cronómetros de atención y estados operativos actualizados al instante.

### 2. Gestión Operativa Avanzada (Mesa de Trabajo)

- **Asignación por Arrastre (Drag & Drop)**: Interfaz intuitiva para asignar asesores a módulos físicos de atención.
- **Control de Duplicidad Estricto**: Validación en tiempo real que excluye a asesores ya asignados de la lista de disponibles, evitando errores de doble turno.
- **Persistencia por Jornada**: Gestión independiente y persistente de esquemas de trabajo para los turnos de **Mañana** y **Tarde**. El sistema limpia correctamente las asignaciones al cambiar de turno para evitar fugas de datos.
- **Protección de Datos (Dirty State)**: Sistema que detecta cambios no guardados en la mesa. Si el usuario intenta cambiar de turno o navegar fuera con cambios pendientes, el sistema bloquea la acción y solicita confirmación.
- **Modales de Confirmación Personalizados**: Eliminación de alertas nativas del navegador (`confirm()`, `alert()`). Implementación de diálogos de confirmación estilizados con la estética APE para cambios de turno, eliminación de módulos y descarte de cambios.
- **Administración de Módulos Flexibles**: Capacidad de añadir o eliminar módulos físicos de forma dinámica.
- **Guardado de Esquema Vacío**: Soporte para limpiar la mesa completa y guardar ese estado (resetear el turno) sin errores de validación.

### 3. Administración de Personal (CRUD)

- **Control de Estado Activo/Inactivo**: Permite habilitar o deshabilitar asesores administrativamente. Solo los asesores marcados como "Activos" aparecen disponibles para asignación en mesa.
- **Eliminación Segura (Soft Deletes)**: Implementación de borrado lógico que permite retirar asesores de la vista operativa sin perder su historial de atenciones.

- **Análisis de TMO Dinámico**: Visualización del Tiempo Medio de Operación global y por asesor en tiempo real.
- **Proyección de Demanda con Guía de Lectura**: Gráfico comparativo con una nota explicativa integrada que ayuda al coordinador a interpretar la brecha entre la demanda real y la proyectada basada en el **Ratio de Tendencia**.
- **Cumplimiento de Meta**: Seguimiento porcentual basado en la **Meta Diaria** personalizada en la configuración.
- **Métricas por Asesor y Estados Operativos**: Tabla detallada que refleja el estado real del asesor (Activo, Pausa, Inactivo).

- **Consolidación Dinámica**: El panel de reportes consulta directamente la base de datos histórica (`Attendances` y `Turns`).
- **Filtrado por Rango de Fechas**: Capacidad de analizar métricas (Volumen, TMA, Ausentismo) en cualquier periodo de tiempo.
- **Tendencias Visuales con Análisis Contextual**: Gráficos de barras con guías de análisis integradas que explican cómo identificar días pico y cómo interpretar la tasa de ausentismo para ajustar la operación.

### 6. Configuración de Parámetros Globales

- **Control Dinámico de Umbrales**: Personalización de límites operativos con persistencia inmediata en la tabla `alert_thresholds`:
  - **TEE Máximo**: Límite de espera para ciudadanos.
  - **Saturación**: Umbral porcentual de congestión.
  - **Ratio de Tendencia**: Sensibilidad para proyecciones de demanda.
  - **Meta Diaria**: Objetivo de atención para la jornada.
  - **Límite de Pausas**: Tiempo permitido para recesos administrativos.
- **Ayuda Contextual**: Guías integradas en el panel que explican el impacto técnico de cada parámetro.
- **Restauración de Sistema**: Capacidad de revertir todos los parámetros a los valores institucionales por defecto con un solo clic.
- **Monitoreo de Infraestructura**: Visualización en tiempo real del estado de los nodos, versión del motor de reglas y última actualización de parámetros.

## 🪪 Validación de Documentos (Kiosco)

El Kiosco táctil incorpora un sistema de teclado dinámico y validación en tiempo real para adaptarse al tipo de documento seleccionado por el ciudadano, garantizando la integridad de los datos:

| Documento                              | Teclado       | Validaciones y Longitud                             |
| :------------------------------------- | :------------ | :-------------------------------------------------- |
| **Cédula de Ciudadanía (CC)**  | Numérico     | 5 a 10 dígitos. Solo números.                     |
| **Tarjeta de Identidad (TI)**    | Numérico     | 10 a 11 dígitos. Solo números.                    |
| **Cédula de Extranjería (CE)** | Numérico     | 6 a 8 dígitos. Solo números.                      |
| **Permiso Especial (PPT)**       | Numérico     | 6 a 8 dígitos. Solo números.                      |
| **Pasaporte (PA)**               | Alfanumérico | 6 a 16 caracteres. Letras (mayúsculas) y números. |

> *Nota:* El sistema elimina automáticamente puntos o caracteres no permitidos antes de enviar la petición al servidor.

## ⭐ Kiosco de Feedback (Calidad del Servicio)

Este módulo interactivo, ubicado a la salida de las instalaciones, permite recolectar la percepción del ciudadano sobre la atención recibida. No utiliza datos estáticos; todo el flujo está conectado en vivo a la base de datos operativa.

1. **Búsqueda Dinámica**: Al ingresar el número de documento, el backend consulta si existe un turno **atendido y finalizado hoy** para esa persona. Si no hay registros (o si el turno sigue en curso), bloquea la calificación, garantizando la veracidad de los datos.
2. **Validación Antifraude**: El sistema comprueba si esa atención en específico ya fue calificada previamente (Tabla `feedbacks`). Si es así, impide votar dos veces por el mismo turno.
3. **Reflejo Real del Asesor**: La pantalla de votación muestra dinámicamente el **Nombre del Asesor** que realmente lo atendió, el número de **Módulo** físico y la **Hora exacta** en que finalizó la atención.
4. **Impacto en Tiempo Real**: Las calificaciones de 1 a 5 estrellas se registran de inmediato, impactando directamente las métricas de "Calificación Promedio" que visualizan tanto el Asesor en su historial como el Coordinador en su Dashboard operativo.

### 1. Coordinador Administrativo

Control total del sistema y gestión operativa.

- **Tipo de Documento**: Cédula de Ciudadanía
- **Número de Documento**: `1000000001`
- **Contraseña**: `password`

### 2. Asesor General

Ve todos los turnos **excepto** los de Víctima (General, Empresario, Prioritario).

- **Tipo de Documento**: Cédula de Ciudadanía
- **Número de Documento**: `1000000002`
- **Contraseña**: `password`

### 3. Asesor de Población Víctima

Ve **exclusivamente** los turnos de categoría Víctima.

- **Tipo de Documento**: Cédula de Ciudadanía
- **Número de Documento**: `2000000002`
- **Contraseña**: `password`

## 🌐 Enlaces del Sistema (Entorno Local)

- **🏠 Inicio**: [http://digiturno.test/](http://digiturno.test/)
- **🔐 Login Administrativo**: [http://digiturno.test/login](http://digiturno.test/login)
- **📟 Kiosco de Turnos**: [http://digiturno.test/kiosco](http://digiturno.test/kiosco)
- **⭐ Kiosco de Feedback**: [http://digiturno.test/kiosco/feedback](http://digiturno.test/kiosco/feedback)
- **📺 Pantalla TV (Sala de Espera)**: [http://digiturno.test/pantalla](http://digiturno.test/pantalla)
- **🎧 Panel del Asesor**: [http://digiturno.test/asesor](http://digiturno.test/asesor) *(Requiere inicio de sesión)*
- **⚙️ Panel del Coordinador**: [http://digiturno.test/coordinador](http://digiturno.test/coordinador) *(Requiere inicio de sesión)*

- **Modo Oscuro**: El proyecto utiliza un sistema de colores constantes definidos en cada página para evitar alteraciones por extensiones o configuraciones de "Dark Mode".
- **Interfaz Simplificada**: El Header del coordinador ha sido optimizado eliminando elementos redundantes (buscador, notificaciones, perfil duplicado) para maximizar el área de trabajo operativa.
- **Navegación Persistente (Deep Linking)**: El sistema utiliza parámetros de URL (`?tab=...`) para garantizar que, tras una recarga o cambio de turno, el usuario permanezca exactamente en la pestaña donde estaba trabajando.
- **Responsividad**: Optimizado para Kioscos táctiles, TVs de visualización y estaciones de trabajo de escritorio.
- **Año Institucional**: Actualizado a 2026 según requerimientos.

## 🚀 Despliegue en Producción y Recomendaciones Finales

El sistema cuenta con un blindaje avanzado a nivel de base de datos y lógica de negocio. Para asegurar un despliegue exitoso en el entorno institucional final, se deben tener en cuenta los siguientes lineamientos:

1. **Borrado Lógico (Soft Deletes)**: El sistema nunca elimina físicamente a los asesores (`users`). Si un coordinador retira a un asesor, este pasa a un estado de papelera (Soft Delete). Esto garantiza que el inmenso historial de atenciones y métricas no colapse y se preserve intacto para auditorías futuras.
2. **Reinicio Diario de Turnos (Sin Unique Global)**: La columna `turn_code` de la tabla `turns` ha sido configurada sin restricciones de unicidad global. Esto permite que el Kiosco reinicie el conteo a `001` sin fallar por conflictos con códigos de días anteriores (ej. poder generar múltiples `G-001` en el tiempo, pero en días distintos).
3. **Optimización de Entorno**: Antes de abrir el servicio al público, asegúrate de ejecutar en la consola del servidor de producción:
   ```bash
   php artisan optimize:clear
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```
4. **Sincronización de Relojes (Timezone)**: El sistema está anclado a `America/Bogota`. Es imperativo que, si hay un cambio en el archivo `config/app.php`, se ejecute `php artisan config:clear` inmediatamente. Esto evita que los turnos se guarden con "fechas del futuro" en UTC, lo cual haría desaparecer temporalmente el historial de atenciones de los asesores.
5. **Prueba de Estrés Logística**: Se recomienda simular una sala de espera llena (varios asesores conectados y pantallas en vivo) lanzando al menos 20 turnos de prueba continuos, para asegurar que la latencia de la red institucional (SENA) soporta el Polling de llamadas en tiempo real.
6. **Monitoreo de Calidad en Vivo**: El Coordinador ahora visualiza el promedio de *Calificación* (estrellas) de sus asesores directamente en la tabla de rendimiento. Esto se calcula en tiempo real a partir de las votaciones hechas por la ciudadanía en el Kiosco de Feedback.
7. **Cierre de Sesión Seguro (Event Listener)**: Se implementó un rastreador en el ciclo de vida de la aplicación. Cuando un asesor hace clic en "Cerrar Sesión", el sistema automáticamente cambia su disponibilidad a rojo (Inactivo) y, si tenía el cronómetro de una pausa activa, la finaliza milimétricamente. Esto evita "asesores fantasma" activos en el panel del coordinador.
