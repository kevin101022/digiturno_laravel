# 🚀 Digiturno Inteligente — APE SENA

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

## 📂 Estructura de Diseños y Assets

Los diseños originales y la guía de estilos institucional se encuentran organizados en la siguiente carpeta raíz:

- `stitch_gesti_n_inteligente_turnos_ape/`: Contiene los archivos HTML/CSS de referencia y las definiciones de colores institucionales que garantizan la "inmunidad al modo oscuro" (el diseño permanece fiel a los colores SENA sin importar la configuración del navegador).

La implementación real en código se encuentra en:
- `resources/js/pages/`: Vistas principales (Login, Kiosco, Dashboard).
- `resources/js/components/`: Componentes reutilizables (Teclados táctiles, selectores personalizados, layouts).

## 🌐 Enlaces de Prueba (Entorno Local)

Puedes acceder a los diferentes módulos del sistema a través de los siguientes enlaces locales (requiere Laravel Herd activo). 

> [!NOTE]
> Dado que la lógica de autenticación y base de datos aún no se ha integrado, los paneles del Asesor y Coordinador son accesibles directamente para pruebas de diseño y flujo.

- **🏠 Inicio**: [http://digiturno.test/](http://digiturno.test/)
- **🔐 Login Administrativo**: [http://digiturno.test/login](http://digiturno.test/login)
- **📟 Kiosco de Turnos**: [http://digiturno.test/kiosco](http://digiturno.test/kiosco)
- **⭐ Kiosco de Feedback**: [http://digiturno.test/kiosco/feedback](http://digiturno.test/kiosco/feedback)
- **🎧 Panel del Asesor (Acceso Directo)**: [http://digiturno.test/asesor](http://digiturno.test/asesor)
- **⚙️ Gestión Operativa (Acceso Directo)**: [http://digiturno.test/coordinador](http://digiturno.test/coordinador)

## 📌 Notas de Implementación

- **Modo Oscuro**: El proyecto utiliza un sistema de colores constantes (`C.primary`, `C.secondary`, etc.) definidos en cada página para evitar alteraciones por extensiones o configuraciones de "Dark Mode".
- **Responsividad**: Optimizado para Kioscos táctiles, TVs de visualización y estaciones de trabajo de escritorio.
- **Año Institucional**: Actualizado a 2026 según requerimiento.
