-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-05-2026 a las 06:58:55
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `digiturno`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `advisor_details`
--

CREATE TABLE `advisor_details` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `advisor_type_id` bigint(20) UNSIGNED NOT NULL,
  `module_number` varchar(20) DEFAULT NULL,
  `module_type` enum('general','victim') NOT NULL DEFAULT 'general',
  `shift` enum('morning','afternoon') DEFAULT NULL,
  `availability_status` enum('green','yellow','red') NOT NULL DEFAULT 'green',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `advisor_details`
--

INSERT INTO `advisor_details` (`id`, `user_id`, `advisor_type_id`, `module_number`, `module_type`, `shift`, `availability_status`, `created_at`, `updated_at`) VALUES
(1, 2, 2, '1', 'general', NULL, 'green', '2026-05-11 09:19:58', '2026-05-12 04:32:06'),
(3, 6, 2, '1', 'general', NULL, 'red', '2026-05-11 21:04:57', '2026-05-11 21:24:32'),
(4, 7, 1, '2', 'general', NULL, 'red', '2026-05-11 21:05:43', '2026-05-12 02:44:21'),
(5, 9, 1, '2', 'general', NULL, 'red', '2026-05-12 03:04:20', '2026-05-12 09:07:39');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `advisor_types`
--

CREATE TABLE `advisor_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `advisor_types`
--

INSERT INTO `advisor_types` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'victim_population', '2026-05-11 09:19:57', '2026-05-11 09:19:57'),
(2, 'general_public', '2026-05-11 09:19:57', '2026-05-11 09:19:57');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alert_thresholds`
--

CREATE TABLE `alert_thresholds` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key` varchar(60) NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `default_value` decimal(10,2) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `alert_thresholds`
--

INSERT INTO `alert_thresholds` (`id`, `key`, `value`, `default_value`, `description`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 'saturation_yellow', 5.00, 5.00, 'Ratio mínimo (turnos_espera/asesores_activos) para semáforo amarillo', NULL, '2026-05-11 09:19:57', '2026-05-11 09:19:57'),
(2, 'saturation_red', 10.00, 10.00, 'Ratio mínimo para semáforo rojo', NULL, '2026-05-11 09:19:57', '2026-05-11 09:19:57'),
(3, 'max_pause_minutes', 15.00, 15.00, 'Minutos máximos de pausa de un asesor antes de alertar al coordinador', NULL, '2026-05-11 09:19:57', '2026-05-11 09:19:57'),
(4, 'tee_courtesy_minutes', 30.00, 30.00, 'TEE en minutos a partir del cual se muestra mensaje de cortesía en el kiosco', NULL, '2026-05-11 09:19:57', '2026-05-11 09:19:57'),
(5, 'queue_trend_periods', 3.00, 3.00, 'Períodos consecutivos con cola creciente para activar alerta de tendencia', NULL, '2026-05-11 09:19:57', '2026-05-11 09:19:57');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `attendances`
--

CREATE TABLE `attendances` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `turn_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `started_at` datetime NOT NULL,
  `ended_at` datetime DEFAULT NULL,
  `duration_seconds` int(10) UNSIGNED DEFAULT NULL,
  `absent` tinyint(1) NOT NULL DEFAULT 0,
  `observations` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `attendances`
--

INSERT INTO `attendances` (`id`, `turn_id`, `user_id`, `started_at`, `ended_at`, `duration_seconds`, `absent`, `observations`, `created_at`, `updated_at`) VALUES
(1, 1, 2, '2026-05-11 04:22:17', '2026-05-11 04:22:17', 0, 1, NULL, '2026-05-11 09:22:17', '2026-05-11 09:22:17'),
(2, 3, 2, '2026-05-11 23:14:02', '2026-05-11 23:14:13', 11, 0, NULL, '2026-05-12 04:14:02', '2026-05-12 04:14:13'),
(3, 4, 2, '2026-05-11 23:22:32', '2026-05-11 23:22:43', 11, 0, NULL, '2026-05-12 04:22:32', '2026-05-12 04:22:43'),
(4, 5, 2, '2026-05-11 23:32:00', '2026-05-11 23:32:06', 6, 0, NULL, '2026-05-12 04:32:00', '2026-05-12 04:32:06');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel-cache-03e26e0a51c3718dc78dc91a1e20b13a', 'i:1;', 1778559416),
('laravel-cache-03e26e0a51c3718dc78dc91a1e20b13a:timer', 'i:1778559416;', 1778559416),
('laravel-cache-1029384756|127.0.0.1', 'i:1;', 1778558177),
('laravel-cache-1029384756|127.0.0.1:timer', 'i:1778558177;', 1778558177),
('laravel-cache-14c9086a620017230ca0f528c32b75ed', 'i:1;', 1778558177),
('laravel-cache-14c9086a620017230ca0f528c32b75ed:timer', 'i:1778558177;', 1778558177),
('laravel-cache-1b8a76d6f0d6aa22f94200a667df7734', 'i:1;', 1778559778),
('laravel-cache-1b8a76d6f0d6aa22f94200a667df7734:timer', 'i:1778559778;', 1778559778),
('laravel-cache-2000000002|127.0.0.1', 'i:4;', 1778536738),
('laravel-cache-2000000002|127.0.0.1:timer', 'i:1778536738;', 1778536738),
('laravel-cache-85487ef2aaeeb1b3ccbf66dc457f4a7b', 'i:4;', 1778536738),
('laravel-cache-85487ef2aaeeb1b3ccbf66dc457f4a7b:timer', 'i:1778536738;', 1778536738);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `display_events`
--

CREATE TABLE `display_events` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `turn_id` bigint(20) UNSIGNED NOT NULL,
  `advisor_id` bigint(20) UNSIGNED NOT NULL,
  `module_number` varchar(20) NOT NULL,
  `event_type` enum('called','recalled','attending','completed') NOT NULL,
  `screen_lost` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `display_events`
--

INSERT INTO `display_events` (`id`, `turn_id`, `advisor_id`, `module_number`, `event_type`, `screen_lost`, `created_at`) VALUES
(1, 1, 2, '1', 'called', 0, '2026-05-11 04:21:51'),
(2, 1, 2, '1', 'recalled', 0, '2026-05-11 04:22:07'),
(3, 1, 2, '1', 'completed', 0, '2026-05-11 04:22:17'),
(4, 3, 2, '1', 'called', 0, '2026-05-12 04:13:53'),
(5, 3, 2, '1', 'attending', 0, '2026-05-12 04:14:02'),
(6, 3, 2, '1', 'completed', 0, '2026-05-12 04:14:13'),
(7, 4, 2, '1', 'called', 0, '2026-05-12 04:22:19'),
(8, 4, 2, '1', 'attending', 0, '2026-05-12 04:22:32'),
(9, 4, 2, '1', 'completed', 0, '2026-05-12 04:22:43'),
(10, 5, 2, '1', 'called', 0, '2026-05-12 04:31:52'),
(11, 5, 2, '1', 'attending', 0, '2026-05-12 04:32:00'),
(12, 5, 2, '1', 'completed', 0, '2026-05-12 04:32:06');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `feedbacks`
--

CREATE TABLE `feedbacks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `attendance_id` bigint(20) UNSIGNED NOT NULL,
  `turn_id` bigint(20) UNSIGNED NOT NULL,
  `advisor_id` bigint(20) UNSIGNED NOT NULL,
  `document_number` varchar(30) NOT NULL,
  `session_date` date NOT NULL,
  `rating` tinyint(3) UNSIGNED NOT NULL,
  `rated_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `feedbacks`
--

INSERT INTO `feedbacks` (`id`, `attendance_id`, `turn_id`, `advisor_id`, `document_number`, `session_date`, `rating`, `rated_at`, `created_at`, `updated_at`) VALUES
(1, 2, 3, 2, '5523669808', '2026-05-12', 4, '2026-05-12 04:15:33', '2026-05-12 09:15:33', '2026-05-12 09:15:33'),
(2, 4, 5, 2, '8552223336', '2026-05-11', 5, '2026-05-11 23:38:07', '2026-05-12 04:38:07', '2026-05-12 04:38:07');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` smallint(5) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_01_01_000001_create_domain_tables', 1),
(5, '2025_01_01_000002_create_support_tables', 1),
(6, '2025_08_14_170933_add_two_factor_columns_to_users_table', 1),
(7, '2026_05_07_153411_fix_advisor_details_table_v5', 1),
(8, '2026_05_11_151944_create_modules_table', 2),
(9, '2026_05_11_155408_add_soft_deletes_to_users_table', 3),
(10, '2026_05_11_155620_add_active_to_users_table', 4),
(11, '2026_05_11_160146_make_module_number_nullable_in_advisor_details', 5),
(12, '2026_05_12_041019_drop_unique_from_turn_code_in_turns_table', 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modules`
--

CREATE TABLE `modules` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `number` int(11) NOT NULL,
  `type` enum('general','victim') NOT NULL DEFAULT 'general',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `modules`
--

INSERT INTO `modules` (`id`, `number`, `type`, `is_active`, `created_at`, `updated_at`) VALUES
(3, 1, 'general', 1, '2026-05-11 21:24:27', '2026-05-11 21:24:27'),
(4, 2, 'general', 1, '2026-05-11 21:24:41', '2026-05-11 21:24:41'),
(5, 3, 'general', 1, '2026-05-11 21:28:03', '2026-05-11 21:28:03'),
(6, 4, 'general', 1, '2026-05-12 02:39:44', '2026-05-12 02:39:44');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `module_assignments`
--

CREATE TABLE `module_assignments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `module_number` varchar(20) NOT NULL,
  `module_type` enum('general','victim') NOT NULL,
  `advisor_id` bigint(20) UNSIGNED NOT NULL,
  `shift` enum('morning','afternoon') NOT NULL,
  `date` date NOT NULL,
  `assigned_by` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `module_assignments`
--

INSERT INTO `module_assignments` (`id`, `module_number`, `module_type`, `advisor_id`, `shift`, `date`, `assigned_by`, `created_at`, `updated_at`) VALUES
(21, '1', 'general', 2, 'morning', '2026-05-12', 10, '2026-05-12 09:07:39', '2026-05-12 09:07:39'),
(22, '2', 'victim', 9, 'morning', '2026-05-12', 10, '2026-05-12 09:07:39', '2026-05-12 09:07:39');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pauses`
--

CREATE TABLE `pauses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `reason` varchar(100) NOT NULL,
  `started_at` datetime NOT NULL,
  `ended_at` datetime DEFAULT NULL,
  `duration_seconds` int(10) UNSIGNED DEFAULT NULL,
  `alert_triggered` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `pauses`
--

INSERT INTO `pauses` (`id`, `user_id`, `reason`, `started_at`, `ended_at`, `duration_seconds`, `alert_triggered`, `created_at`, `updated_at`) VALUES
(1, 2, 'Descanso', '2026-05-11 22:08:35', '2026-05-11 22:14:48', 373, 0, '2026-05-12 03:08:35', '2026-05-12 03:14:48'),
(2, 2, 'Descanso', '2026-05-11 22:17:20', '2026-05-11 22:17:21', 1, 0, '2026-05-12 03:17:20', '2026-05-12 03:17:21'),
(3, 2, 'Descanso', '2026-05-11 22:21:28', '2026-05-11 22:21:32', 4, 0, '2026-05-12 03:21:28', '2026-05-12 03:21:32'),
(4, 2, 'Descanso', '2026-05-11 22:21:46', '2026-05-11 22:21:53', 7, 0, '2026-05-12 03:21:46', '2026-05-12 03:21:53'),
(5, 2, 'Descanso', '2026-05-11 23:14:33', '2026-05-11 23:14:39', 6, 0, '2026-05-12 04:14:33', '2026-05-12 04:14:39'),
(6, 2, 'Descanso', '2026-05-11 23:26:20', '2026-05-11 23:26:22', 2, 0, '2026-05-12 04:26:20', '2026-05-12 04:26:22'),
(7, 2, 'Descanso', '2026-05-11 23:31:15', '2026-05-11 23:31:18', 3, 0, '2026-05-12 04:31:15', '2026-05-12 04:31:18'),
(8, 2, 'Descanso', '2026-05-11 23:31:29', '2026-05-11 23:31:33', 4, 0, '2026-05-12 04:31:29', '2026-05-12 04:31:33');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(30) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'coordinator', '2026-05-11 09:19:57', '2026-05-11 09:19:57'),
(2, 'advisor', '2026-05-11 09:19:57', '2026-05-11 09:19:57'),
(3, 'client', '2026-05-11 09:19:57', '2026-05-11 09:19:57');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `saturation_logs`
--

CREATE TABLE `saturation_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue_type` enum('general','victim') NOT NULL,
  `saturation_ratio` decimal(6,2) NOT NULL,
  `waiting_count` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `active_advisors` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `arrival_rate` decimal(6,2) DEFAULT NULL,
  `departure_rate` decimal(6,2) DEFAULT NULL,
  `level` enum('green','yellow','red') NOT NULL,
  `suggestion` varchar(200) DEFAULT NULL,
  `logged_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('MNa9F01XoqLiq0zEZoAgSI9Wj4qxaviLnF6u3GMc', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiI2YUFraVdtamNpTkZDbGpZNktBdEl1d3BwTGRvTm1qbmN1bHpma1FVIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1778558083),
('TNF9hS6ZzvPgNNf1n9wbkx0ATH46xswpDHFd1m0X', 2, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJpWHY3dmpFMmZUaldzYm1aZzJzRXVWUlFmSkgyNlF3YnNtcDIxZ3dNIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119LCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cDpcL1wvZGlnaXR1cm5vLnRlc3RcL2FzZXNvclwvdHVybm9zLWVuLWVzcGVyYSIsInJvdXRlIjoiYXNlc29yLnR1cm5vc0VuRXNwZXJhIn0sImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjoyfQ==', 1778561936);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turns`
--

CREATE TABLE `turns` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `turn_code` varchar(15) NOT NULL,
  `category` enum('victim','general','special') NOT NULL,
  `queue_type` enum('general','victim') NOT NULL,
  `status` enum('waiting','called','attending','completed','absent') NOT NULL DEFAULT 'waiting',
  `generated_at` datetime DEFAULT NULL,
  `ticket_printed` tinyint(1) NOT NULL DEFAULT 0,
  `ticket_print_failed` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `turns`
--

INSERT INTO `turns` (`id`, `user_id`, `turn_code`, `category`, `queue_type`, `status`, `generated_at`, `ticket_printed`, `ticket_print_failed`, `created_at`, `updated_at`) VALUES
(1, 4, 'G-001', 'general', 'general', 'absent', '2026-05-11 04:21:45', 0, 0, '2026-05-11 09:21:45', '2026-05-11 09:22:17'),
(3, 13, 'G-001', 'general', 'general', 'completed', '2026-05-12 04:12:54', 0, 0, '2026-05-12 04:12:54', '2026-05-12 04:14:13'),
(4, 14, 'P-001', 'special', 'general', 'completed', '2026-05-11 23:22:13', 0, 0, '2026-05-12 04:22:13', '2026-05-12 04:22:43'),
(5, 15, 'E-001', 'general', 'general', 'completed', '2026-05-11 23:31:49', 0, 0, '2026-05-12 04:31:49', '2026-05-12 04:32:06');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `document_type` varchar(20) NOT NULL DEFAULT 'CC',
  `document_number` varchar(30) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `remember_token` varchar(100) DEFAULT NULL,
  `two_factor_secret` text DEFAULT NULL,
  `two_factor_recovery_codes` text DEFAULT NULL,
  `two_factor_confirmed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `role_id`, `document_type`, `document_number`, `first_name`, `last_name`, `birth_date`, `name`, `email`, `email_verified_at`, `password`, `active`, `remember_token`, `two_factor_secret`, `two_factor_recovery_codes`, `two_factor_confirmed_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(2, 2, 'CC', '1000000002', 'Asesor', 'Prueba', NULL, 'Asesor Prueba', 'asesor@ape.gov.co', NULL, '$2y$12$ze.0QEheo4rTkJmskBLPw.P2Q9JjGS1JgSWnPgoXTYd9FEyFfyUMy', 1, NULL, NULL, NULL, NULL, '2026-05-11 09:19:58', '2026-05-12 09:02:26', NULL),
(4, 3, 'CC', '5236987085', NULL, NULL, NULL, 'Ciudadano 5236987085', NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, '2026-05-11 09:21:45', '2026-05-11 09:21:45', NULL),
(6, 2, 'CC', '10304050', 'Mauricio', 'Puentes', NULL, 'Mauricio Puentes', NULL, NULL, '$2y$12$VdYCqdClLtNJcBqNUmeXk.Q9hUL2K1jDIU/ktnb7BESluFByMNBrC', 1, NULL, NULL, NULL, NULL, '2026-05-11 21:04:57', '2026-05-11 21:04:57', NULL),
(7, 2, 'CC', '10934786', 'Breyner', 'Peña', NULL, 'Breyner Peña', NULL, NULL, '$2y$12$9aFNqBJr.2fnrcgcXgMnTOh13dyxBSjFWoXkUrkLWnQppHwneKKdK', 1, NULL, NULL, NULL, NULL, '2026-05-11 21:05:43', '2026-05-11 21:05:43', NULL),
(9, 2, 'CC', '2000000002', 'Asesor', 'Víctimas', NULL, 'Asesor Víctimas', 'victimas@ape.gov.co', NULL, '$2y$12$o48nQm5X.A5acL8MgWeISOMfqOV6MHl.F/xao6VccPwF2vL35GXQO', 1, NULL, NULL, NULL, NULL, '2026-05-12 03:04:20', '2026-05-12 09:02:26', NULL),
(10, 1, 'CC', '1000000001', 'Admin', 'APE', NULL, 'Admin APE', 'admin@ape.gov.co', NULL, '$2y$12$3v0I7XGoWdnTTf6QRIWlG.LvXKcexznQeUL4EAGvFm8AazSkdvZde', 1, NULL, NULL, NULL, NULL, '2026-05-12 03:06:27', '2026-05-12 09:02:25', NULL),
(13, 3, 'CC', '5523669808', NULL, NULL, NULL, 'Ciudadano 5523669808', NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, '2026-05-12 09:12:54', '2026-05-12 09:12:54', NULL),
(14, 3, 'CC', '1235469870', NULL, NULL, NULL, 'Ciudadano 1235469870', NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, '2026-05-12 04:22:13', '2026-05-12 04:22:13', NULL),
(15, 3, 'CC', '8552223336', NULL, NULL, NULL, 'Ciudadano 8552223336', NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, '2026-05-12 04:31:49', '2026-05-12 04:31:49', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `advisor_details`
--
ALTER TABLE `advisor_details`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `advisor_details_user_id_unique` (`user_id`),
  ADD KEY `advisor_details_advisor_type_id_foreign` (`advisor_type_id`);

--
-- Indices de la tabla `advisor_types`
--
ALTER TABLE `advisor_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `advisor_types_name_unique` (`name`);

--
-- Indices de la tabla `alert_thresholds`
--
ALTER TABLE `alert_thresholds`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `alert_thresholds_key_unique` (`key`),
  ADD KEY `alert_thresholds_updated_by_foreign` (`updated_by`);

--
-- Indices de la tabla `attendances`
--
ALTER TABLE `attendances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `attendances_turn_id_foreign` (`turn_id`),
  ADD KEY `attendances_user_id_foreign` (`user_id`);

--
-- Indices de la tabla `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indices de la tabla `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indices de la tabla `display_events`
--
ALTER TABLE `display_events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `display_events_advisor_id_foreign` (`advisor_id`),
  ADD KEY `display_events_turn_id_created_index` (`turn_id`,`created_at`);

--
-- Indices de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indices de la tabla `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `feedbacks_turn_id_unique` (`turn_id`),
  ADD KEY `feedbacks_attendance_id_foreign` (`attendance_id`),
  ADD KEY `feedbacks_advisor_id_foreign` (`advisor_id`),
  ADD KEY `feedbacks_session_date_index` (`session_date`);

--
-- Indices de la tabla `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indices de la tabla `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `modules`
--
ALTER TABLE `modules`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `modules_number_unique` (`number`);

--
-- Indices de la tabla `module_assignments`
--
ALTER TABLE `module_assignments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_advisor_shift_date` (`advisor_id`,`shift`,`date`),
  ADD UNIQUE KEY `unique_module_shift_date` (`module_number`,`shift`,`date`),
  ADD KEY `module_assignments_assigned_by_foreign` (`assigned_by`);

--
-- Indices de la tabla `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indices de la tabla `pauses`
--
ALTER TABLE `pauses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pauses_user_id_foreign` (`user_id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_unique` (`name`);

--
-- Indices de la tabla `saturation_logs`
--
ALTER TABLE `saturation_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `saturation_logs_queue_logged_index` (`queue_type`,`logged_at`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indices de la tabla `turns`
--
ALTER TABLE `turns`
  ADD PRIMARY KEY (`id`),
  ADD KEY `turns_user_id_foreign` (`user_id`),
  ADD KEY `turns_queue_type_status_index` (`queue_type`,`status`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_document_number_unique` (`document_number`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_role_id_foreign` (`role_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `advisor_details`
--
ALTER TABLE `advisor_details`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `advisor_types`
--
ALTER TABLE `advisor_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `alert_thresholds`
--
ALTER TABLE `alert_thresholds`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `attendances`
--
ALTER TABLE `attendances`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `display_events`
--
ALTER TABLE `display_events`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `modules`
--
ALTER TABLE `modules`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `module_assignments`
--
ALTER TABLE `module_assignments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `pauses`
--
ALTER TABLE `pauses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `saturation_logs`
--
ALTER TABLE `saturation_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `turns`
--
ALTER TABLE `turns`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `advisor_details`
--
ALTER TABLE `advisor_details`
  ADD CONSTRAINT `advisor_details_advisor_type_id_foreign` FOREIGN KEY (`advisor_type_id`) REFERENCES `advisor_types` (`id`),
  ADD CONSTRAINT `advisor_details_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `alert_thresholds`
--
ALTER TABLE `alert_thresholds`
  ADD CONSTRAINT `alert_thresholds_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `attendances`
--
ALTER TABLE `attendances`
  ADD CONSTRAINT `attendances_turn_id_foreign` FOREIGN KEY (`turn_id`) REFERENCES `turns` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendances_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `display_events`
--
ALTER TABLE `display_events`
  ADD CONSTRAINT `display_events_advisor_id_foreign` FOREIGN KEY (`advisor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `display_events_turn_id_foreign` FOREIGN KEY (`turn_id`) REFERENCES `turns` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD CONSTRAINT `feedbacks_advisor_id_foreign` FOREIGN KEY (`advisor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `feedbacks_attendance_id_foreign` FOREIGN KEY (`attendance_id`) REFERENCES `attendances` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `feedbacks_turn_id_foreign` FOREIGN KEY (`turn_id`) REFERENCES `turns` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `module_assignments`
--
ALTER TABLE `module_assignments`
  ADD CONSTRAINT `module_assignments_advisor_id_foreign` FOREIGN KEY (`advisor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `module_assignments_assigned_by_foreign` FOREIGN KEY (`assigned_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pauses`
--
ALTER TABLE `pauses`
  ADD CONSTRAINT `pauses_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `turns`
--
ALTER TABLE `turns`
  ADD CONSTRAINT `turns_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
