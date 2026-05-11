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
- **Historial de Atención Personal**: Los asesores cuentan con una pestaña dedicada para ver su propio historial operativo. Esta vista consulta la base de datos en tiempo real e incluye filtros por fecha, mostrando el total de turnos atendidos, tiempo promedio, calificaciones de feedback, y una tabla detallada con el estado final (Atendido/No Presentado) y la duración de cada sesión.
- **Asignación Inteligente por Rol**: El sistema filtra automáticamente la fila; por ejemplo, los asesores designados para Víctimas solo ven los turnos de dicha categoría, mientras que los asesores generales ven el resto.
- **Registro de Tiempos y Pausas Activas**: Las pausas son registradas a nivel de base de datos (`duration_seconds`), permitiendo futuras auditorías operativas para los coordinadores.

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

## 🔐 Credenciales de Acceso y Pruebas

Para acceder a los paneles administrativos (Asesor y Coordinador), debes iniciar sesión en [http://digiturno.test/login](http://digiturno.test/login).

Puedes utilizar los siguientes perfiles de prueba:

### 1. Asesor General

Ve todos los turnos **excepto** los de Víctima (General, Empresario, Prioritario).

- **Tipo de Documento**: CC
- **Número de Documento**: `1000000002`
- **Contraseña**: `password123`

### 2. Asesor de Víctimas

Ve **exclusivamente** los turnos de categoría Víctima.

- **Tipo de Documento**: CC
- **Número de Documento**: `2000000002`
- **Contraseña**: `password123`

## 🌐 Enlaces del Sistema (Entorno Local)

- **🏠 Inicio**: [http://digiturno.test/](http://digiturno.test/)
- **🔐 Login Administrativo**: [http://digiturno.test/login](http://digiturno.test/login)
- **📟 Kiosco de Turnos**: [http://digiturno.test/kiosco](http://digiturno.test/kiosco)
- **⭐ Kiosco de Feedback**: [http://digiturno.test/kiosco/feedback](http://digiturno.test/kiosco/feedback)
- **📺 Pantalla TV (Sala de Espera)**: [http://digiturno.test/pantalla](http://digiturno.test/pantalla)
- **🎧 Panel del Asesor**: [http://digiturno.test/asesor](http://digiturno.test/asesor) *(Requiere inicio de sesión)*
- **⚙️ Panel del Coordinador**: [http://digiturno.test/coordinador](http://digiturno.test/coordinador) *(Requiere inicio de sesión)*

## 📌 Notas de Implementación

- **Modo Oscuro**: El proyecto utiliza un sistema de colores constantes definidos en cada página para evitar alteraciones por extensiones o configuraciones de "Dark Mode".
- **Responsividad**: Optimizado para Kioscos táctiles, TVs de visualización y estaciones de trabajo de escritorio.
- **Año Institucional**: Actualizado a 2026 según requerimientos.
