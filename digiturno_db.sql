-- ============================================================
-- DigiTurno — Script completo de base de datos
-- Motor: MariaDB 10.4+ / MySQL 8.0+
-- Actualizado: 2026-04-29
-- Cambios respecto a versión anterior:
--   · Validación RUV eliminada del sistema (CU-14 → responsabilidad del asesor)
--   · WhatsApp/SMS eliminado en todos los flujos
--   · Impresora térmica como único canal de entrega del turno (CU-03)
--   · Feedback rediseñado: kiosco físico en área de salida, cédula + estrellas (CU-19)
--   · Campo phone eliminado de users (ya no se captura en CU-02)
-- ============================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET NAMES utf8mb4;

-- ============================================================
-- LIMPIEZA (orden inverso a FK)
-- ============================================================

DROP TABLE IF EXISTS `display_events`;
DROP TABLE IF EXISTS `saturation_logs`;
DROP TABLE IF EXISTS `module_assignments`;
DROP TABLE IF EXISTS `feedbacks`;
DROP TABLE IF EXISTS `alert_thresholds`;
DROP TABLE IF EXISTS `pauses`;
DROP TABLE IF EXISTS `attendances`;
DROP TABLE IF EXISTS `turns`;
DROP TABLE IF EXISTS `advisor_details`;
DROP TABLE IF EXISTS `advisor_types`;
DROP TABLE IF EXISTS `sessions`;
DROP TABLE IF EXISTS `password_reset_tokens`;
DROP TABLE IF EXISTS `job_batches`;
DROP TABLE IF EXISTS `failed_jobs`;
DROP TABLE IF EXISTS `jobs`;
DROP TABLE IF EXISTS `cache_locks`;
DROP TABLE IF EXISTS `cache`;
DROP TABLE IF EXISTS `migrations`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `roles`;

-- ============================================================
-- TABLAS BASE (Laravel + autenticación)
-- ============================================================

CREATE TABLE `roles` (
  `id`         bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`       varchar(30) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_unique` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `roles` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'coordinator', NOW(), NOW()),
(2, 'advisor',     NOW(), NOW()),
(3, 'client',      NOW(), NOW());

-- ============================================================

CREATE TABLE `users` (
  `id`                        bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `role_id`                   bigint(20) UNSIGNED NOT NULL,
  `document_type`             varchar(20) NOT NULL,
  `document_number`           varchar(30) NOT NULL,
  `first_name`                varchar(100) DEFAULT NULL,
  `last_name`                 varchar(100) DEFAULT NULL,

  -- phone eliminado: el número de teléfono ya no se captura en el kiosco (CU-02)
  -- Razón: el único uso era envío por WhatsApp, canal eliminado del sistema

  `birth_date`                date DEFAULT NULL,
  `name`                      varchar(255) NOT NULL,
  `email`                     varchar(100) DEFAULT NULL,
  `email_verified_at`         timestamp NULL DEFAULT NULL,
  `password`                  varchar(255) DEFAULT NULL,
  `remember_token`            varchar(100) DEFAULT NULL,
  `two_factor_secret`         text DEFAULT NULL,
  `two_factor_recovery_codes` text DEFAULT NULL,
  `two_factor_confirmed_at`   timestamp NULL DEFAULT NULL,
  `created_at`                timestamp NULL DEFAULT NULL,
  `updated_at`                timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_document_number_unique` (`document_number`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_role_id_foreign` (`role_id`),
  CONSTRAINT `users_role_id_foreign`
    FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================

CREATE TABLE `migrations` (
  `id`        int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch`     int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================

CREATE TABLE `cache` (
  `key`        varchar(255) NOT NULL,
  `value`      mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cache_locks` (
  `key`        varchar(255) NOT NULL,
  `owner`      varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================

CREATE TABLE `jobs` (
  `id`           bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue`        varchar(255) NOT NULL,
  `payload`      longtext NOT NULL,
  `attempts`     tinyint(3) UNSIGNED NOT NULL,
  `reserved_at`  int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at`   int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `job_batches` (
  `id`             varchar(255) NOT NULL,
  `name`           varchar(255) NOT NULL,
  `total_jobs`     int(11) NOT NULL,
  `pending_jobs`   int(11) NOT NULL,
  `failed_jobs`    int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options`        mediumtext DEFAULT NULL,
  `cancelled_at`   int(11) DEFAULT NULL,
  `created_at`     int(11) NOT NULL,
  `finished_at`    int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `failed_jobs` (
  `id`         bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid`       varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue`      text NOT NULL,
  `payload`    longtext NOT NULL,
  `exception`  longtext NOT NULL,
  `failed_at`  timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================

CREATE TABLE `password_reset_tokens` (
  `email`      varchar(255) NOT NULL,
  `token`      varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sessions` (
  `id`            varchar(255) NOT NULL,
  `user_id`       bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address`    varchar(45) DEFAULT NULL,
  `user_agent`    text DEFAULT NULL,
  `payload`       longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLAS DE DOMINIO
-- ============================================================

CREATE TABLE `advisor_types` (
  `id`         bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`       varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `advisor_types_name_unique` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `advisor_types` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'victim_population', NOW(), NOW()),
(2, 'general_public',    NOW(), NOW());

-- ============================================================

CREATE TABLE `advisor_details` (
  `id`              bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`         bigint(20) UNSIGNED NOT NULL,
  `advisor_type_id` bigint(20) UNSIGNED NOT NULL,
  `module_number`   varchar(20) NOT NULL,

  -- Tipo del módulo físico asignado al asesor (CU-06, CU-12)
  -- general → módulo de atención general
  -- victim  → módulo exclusivo de víctimas
  `module_type`         enum('general','victim') NOT NULL DEFAULT 'general',

  -- Turno activo del día (CU-12)
  -- NULL = asesor sin turno asignado hoy
  `shift`               enum('morning','afternoon') DEFAULT NULL,

  `availability_status` enum('green','yellow','red') NOT NULL DEFAULT 'green',
  `created_at`          timestamp NULL DEFAULT NULL,
  `updated_at`          timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `advisor_details_user_id_unique` (`user_id`),
  KEY `advisor_details_advisor_type_id_foreign` (`advisor_type_id`),
  CONSTRAINT `advisor_details_user_id_foreign`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `advisor_details_advisor_type_id_foreign`
    FOREIGN KEY (`advisor_type_id`) REFERENCES `advisor_types` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================

CREATE TABLE `turns` (
  `id`        bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`   bigint(20) UNSIGNED NOT NULL,
  `turn_code` varchar(15) NOT NULL,

  -- Perfil del usuario que solicitó el turno
  `category`   enum('victim','general','special') NOT NULL,

  -- Fila de enrutamiento (CU-03, CU-06)
  -- general → usuarios General + Empresario (cualquier asesor puede atender)
  -- victim  → solo usuarios Víctima (nunca van a módulo general)
  `queue_type` enum('general','victim') NOT NULL,

  `status` enum('waiting','called','attending','completed','absent') NOT NULL DEFAULT 'waiting',

  -- Hora exacta de generación del turno para calcular TTE (CU-03, CU-07)
  -- Distinto de created_at: se registra al finalizar el flujo del kiosco
  `generated_at` datetime DEFAULT NULL,

  -- Impresión del comprobante en impresora térmica (CU-03)
  -- ticket_printed      → TRUE si el comprobante fue impreso exitosamente
  -- ticket_print_failed → TRUE si hubo fallo en la impresora (CU-03 FA-01)
  --   En fallo: el turno sigue activo; el comprobante solo se muestra en pantalla
  `ticket_printed`      tinyint(1) NOT NULL DEFAULT 0,
  `ticket_print_failed` tinyint(1) NOT NULL DEFAULT 0,

  -- ruv_validated / ruv_checked_at eliminados:
  --   La validación RUV ya no la realiza el sistema automáticamente.
  --   Es responsabilidad del asesor verificarla manualmente durante la atención (CU-14).
  -- whatsapp_sent / whatsapp_failed eliminados:
  --   Canal WhatsApp eliminado del sistema en todos los flujos.

  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `turns_turn_code_unique` (`turn_code`),
  KEY `turns_user_id_foreign` (`user_id`),
  KEY `turns_queue_type_status_index` (`queue_type`, `status`),
  CONSTRAINT `turns_user_id_foreign`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================

CREATE TABLE `attendances` (
  `id`      bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `turn_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,

  -- hora_inicio_atencion (CU-07) — TTE = started_at - turns.generated_at
  `started_at` datetime NOT NULL,

  -- hora_fin_atencion (CU-08)
  `ended_at` datetime DEFAULT NULL,

  -- Duración desnormalizada en segundos (CU-08, CU-11)
  -- Se calcula al finalizar: ended_at - started_at
  -- Persiste para cálculo eficiente de TMA sin recalcular en cada consulta
  `duration_seconds` int(10) UNSIGNED DEFAULT NULL,

  -- TRUE si el usuario no se presentó al módulo (CU-07 FA-01)
  `absent` tinyint(1) NOT NULL DEFAULT 0,

  -- feedback_sent eliminado:
  --   Ya no existe envío de encuesta por WhatsApp.
  --   El feedback lo registra el usuario en el kiosco físico de salida (CU-19).

  `observations` text DEFAULT NULL,
  `created_at`   timestamp NULL DEFAULT NULL,
  `updated_at`   timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `attendances_turn_id_foreign` (`turn_id`),
  KEY `attendances_user_id_foreign` (`user_id`),
  CONSTRAINT `attendances_turn_id_foreign`
    FOREIGN KEY (`turn_id`) REFERENCES `turns` (`id`) ON DELETE CASCADE,
  CONSTRAINT `attendances_user_id_foreign`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================

CREATE TABLE `pauses` (
  `id`      bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `reason`  varchar(100) NOT NULL,

  `started_at` datetime NOT NULL,
  `ended_at`   datetime DEFAULT NULL,

  -- Duración desnormalizada en segundos (CU-11, CU-17)
  `duration_seconds` int(10) UNSIGNED DEFAULT NULL,

  -- TRUE si se activó alerta al coordinador por pausa prolongada (CU-09 FA-01, CU-18)
  `alert_triggered` tinyint(1) NOT NULL DEFAULT 0,

  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pauses_user_id_foreign` (`user_id`),
  CONSTRAINT `pauses_user_id_foreign`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLAS NUEVAS / REDISEÑADAS
-- ============================================================

-- Calificaciones del kiosco físico de feedback en área de salida (CU-19)
-- El usuario ingresa su cédula → el sistema recupera el turno de la jornada
-- y le presenta la calificación con estrellas 1-5.
-- Una sola calificación por turno por jornada (bloqueado tras registro).
CREATE TABLE `feedbacks` (
  `id`            bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `attendance_id` bigint(20) UNSIGNED NOT NULL,
  `turn_id`       bigint(20) UNSIGNED NOT NULL,

  -- Asesor evaluado — permite agrupar calificaciones por asesor (CU-11)
  `advisor_id`    bigint(20) UNSIGNED NOT NULL,

  -- Cédula ingresada por el usuario en el kiosco (CU-19 paso 3)
  -- Se almacena para auditoría; debe coincidir con turns.user_id → users.document_number
  `document_number` varchar(30) NOT NULL,

  -- Fecha de jornada en que se registró la calificación (CU-19)
  -- Usado para el bloqueo por jornada: un turno solo puede calificarse una vez por día
  `session_date`  date NOT NULL,

  -- Calificación de 1 a 5 estrellas — NOT NULL: solo se inserta al confirmar (CU-19 paso 5c)
  `rating`        tinyint(1) UNSIGNED NOT NULL,

  -- Momento exacto en que el usuario confirmó la calificación en el kiosco
  `rated_at`      datetime NOT NULL,

  -- sent_at / responded_at / status / send_failed / comment eliminados:
  --   El feedback ya no es una encuesta enviada por WhatsApp.
  --   Es una interacción presencial inmediata en el kiosco físico.
  --   No hay ciclo pending/responded/no_response — el registro solo existe si fue completado.

  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),

  -- Garantiza una sola calificación por turno (CU-19 FA-02)
  UNIQUE KEY `feedbacks_turn_id_unique` (`turn_id`),

  KEY `feedbacks_attendance_id_foreign` (`attendance_id`),
  KEY `feedbacks_advisor_id_foreign` (`advisor_id`),
  KEY `feedbacks_session_date_index` (`session_date`),
  CONSTRAINT `feedbacks_attendance_id_foreign`
    FOREIGN KEY (`attendance_id`) REFERENCES `attendances` (`id`) ON DELETE CASCADE,
  CONSTRAINT `feedbacks_turn_id_foreign`
    FOREIGN KEY (`turn_id`) REFERENCES `turns` (`id`) ON DELETE CASCADE,
  CONSTRAINT `feedbacks_advisor_id_foreign`
    FOREIGN KEY (`advisor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================

-- Umbrales de alerta configurables por el coordinador (CU-18)
-- Claves esperadas:
--   saturation_yellow    → ratio mín para semáforo amarillo    (default: 5)
--   saturation_red       → ratio mín para semáforo rojo        (default: 10)
--   max_pause_minutes    → minutos máx de pausa antes de alertar
--   tee_courtesy_minutes → TEE en min antes de mensaje de cortesía
--   queue_trend_periods  → períodos consecutivos crecientes para alerta roja (default: 3)
CREATE TABLE `alert_thresholds` (
  `id`            bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `key`           varchar(60) NOT NULL,
  `value`         decimal(10,2) NOT NULL,
  `default_value` decimal(10,2) NOT NULL,
  `description`   varchar(200) DEFAULT NULL,

  -- Trazabilidad: quién modificó el umbral (CU-18)
  `updated_by`    bigint(20) UNSIGNED DEFAULT NULL,

  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `alert_thresholds_key_unique` (`key`),
  KEY `alert_thresholds_updated_by_foreign` (`updated_by`),
  CONSTRAINT `alert_thresholds_updated_by_foreign`
    FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `alert_thresholds`
  (`key`, `value`, `default_value`, `description`, `created_at`, `updated_at`)
VALUES
  ('saturation_yellow',    5.00,  5.00, 'Ratio mínimo (turnos_espera/asesores_activos) para semáforo amarillo', NOW(), NOW()),
  ('saturation_red',      10.00, 10.00, 'Ratio mínimo para semáforo rojo',                                      NOW(), NOW()),
  ('max_pause_minutes',   15.00, 15.00, 'Minutos máximos de pausa de un asesor antes de alertar al coordinador', NOW(), NOW()),
  ('tee_courtesy_minutes',30.00, 30.00, 'TEE en minutos a partir del cual se muestra mensaje de cortesía en el kiosco', NOW(), NOW()),
  ('queue_trend_periods',  3.00,  3.00, 'Períodos consecutivos con cola creciente para activar alerta de tendencia', NOW(), NOW());

-- ============================================================

-- Snapshots periódicos de saturación por fila — serie de tiempo (CU-15)
CREATE TABLE `saturation_logs` (
  `id`         bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue_type` enum('general','victim') NOT NULL,

  -- turnos_en_espera / asesores_activos en el momento del snapshot
  `saturation_ratio` decimal(6,2) NOT NULL,

  -- Snapshot absoluto — útil para reportes (CU-17)
  `waiting_count`   smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `active_advisors` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,

  -- Tasas de flujo en la última hora (para proyecciones CU-16)
  `arrival_rate`   decimal(6,2) DEFAULT NULL,
  `departure_rate` decimal(6,2) DEFAULT NULL,

  -- Semáforo resultante según umbrales de alert_thresholds (CU-15)
  `level` enum('green','yellow','red') NOT NULL,

  -- Sugerencia: "Se recomiendan N módulos adicionales" (CU-15 paso 3)
  -- NULL si level = green
  `suggestion` varchar(200) DEFAULT NULL,

  -- Timestamp central de la serie de tiempo — registro inmutable
  `logged_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `saturation_logs_queue_logged_index` (`queue_type`, `logged_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================

-- Asignación de asesores a módulos por turno y fecha (CU-12)
CREATE TABLE `module_assignments` (
  `id`            bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `module_number` varchar(20) NOT NULL,

  -- Perfil del módulo — controla qué tipo de asesor puede asignarse (CU-12 FA-03)
  `module_type` enum('general','victim') NOT NULL,

  `advisor_id` bigint(20) UNSIGNED NOT NULL,
  `shift`      enum('morning','afternoon') NOT NULL,

  -- Fecha de asignación — permite historial y proyección de demanda (CU-12, CU-16)
  `date` date NOT NULL,

  -- Coordinador que realizó la asignación (trazabilidad CU-12)
  `assigned_by` bigint(20) UNSIGNED NOT NULL,

  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  -- Un asesor no puede estar en dos módulos en el mismo turno del mismo día (CU-12 FA-01)
  UNIQUE KEY `unique_advisor_shift_date` (`advisor_id`, `shift`, `date`),
  -- Un módulo no puede tener dos asesores en el mismo turno del mismo día
  UNIQUE KEY `unique_module_shift_date` (`module_number`, `shift`, `date`),
  KEY `module_assignments_advisor_id_foreign` (`advisor_id`),
  KEY `module_assignments_assigned_by_foreign` (`assigned_by`),
  CONSTRAINT `module_assignments_advisor_id_foreign`
    FOREIGN KEY (`advisor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `module_assignments_assigned_by_foreign`
    FOREIGN KEY (`assigned_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================

-- Log de eventos emitidos a la pantalla general del área de espera (CU-04, CU-13)
-- Registros inmutables — solo INSERT, nunca UPDATE
CREATE TABLE `display_events` (
  `id`            bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `turn_id`       bigint(20) UNSIGNED NOT NULL,
  `advisor_id`    bigint(20) UNSIGNED NOT NULL,
  `module_number` varchar(20) NOT NULL,

  -- Tipo de evento (CU-04, CU-13)
  -- called    = primer llamado del turno
  -- recalled  = re-llamado sin cancelar turno (CU-13)
  -- attending = asesor marcó inicio de atención
  -- completed = turno cerrado
  `event_type` enum('called','recalled','attending','completed') NOT NULL,

  -- TRUE si la pantalla reportó pérdida de conexión en este evento (CU-04 FA-01)
  `screen_lost` tinyint(1) NOT NULL DEFAULT 0,

  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `display_events_turn_id_created_index` (`turn_id`, `created_at`),
  KEY `display_events_advisor_id_foreign` (`advisor_id`),
  CONSTRAINT `display_events_turn_id_foreign`
    FOREIGN KEY (`turn_id`) REFERENCES `turns` (`id`) ON DELETE CASCADE,
  CONSTRAINT `display_events_advisor_id_foreign`
    FOREIGN KEY (`advisor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- REGISTRO DE MIGRACIONES
-- ============================================================

INSERT INTO `migrations` (`migration`, `batch`) VALUES
('0001_01_01_000000_create_roles_table',                              1),
('0001_01_01_000001_create_advisor_types_table',                      1),
('0001_01_01_000002_create_cache_table',                              1),
('0001_01_01_000003_create_users_table',                              1),
('0001_01_01_000004_create_jobs_table',                               1),
('2025_01_01_000001_create_advisor_details_table',                    1),
('2025_01_01_000002_create_turns_table',                              1),
('2025_01_01_000003_create_attendances_table',                        1),
('2025_01_01_000004_create_pauses_table',                             1),
('2026_03_26_142309_add_module_number_to_advisor_details_table',      2),
('2026_04_20_000001_add_fields_to_turns_table',                       3),
('2026_04_20_000002_add_fields_to_attendances_table',                 3),
('2026_04_20_000003_add_fields_to_advisor_details_table',             3),
('2026_04_20_000004_add_fields_to_pauses_table',                      3),
('2026_04_20_000005_create_feedbacks_table',                          3),
('2026_04_20_000006_create_alert_thresholds_table',                   3),
('2026_04_20_000007_create_saturation_logs_table',                    3),
('2026_04_20_000008_create_module_assignments_table',                 3),
('2026_04_20_000009_create_display_events_table',                     3),
('2026_04_29_000001_remove_phone_from_users_table',                   4),
('2026_04_29_000002_remove_ruv_whatsapp_from_turns_add_ticket',       4),
('2026_04_29_000003_remove_feedback_sent_from_attendances_table',     4),
('2026_04_29_000004_redesign_feedbacks_table_kiosk_model',            4);

COMMIT;
