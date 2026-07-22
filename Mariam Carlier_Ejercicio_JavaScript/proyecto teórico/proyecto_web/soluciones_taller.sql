-- ============================================================
--  SOLUCIONES COMPLETAS - TALLER GA6 AA2_R6
--  Integridad y Seguridad de los Datos
--  Programa: Análisis y Desarrollo de Software – ADSO
-- ============================================================

-- ============================================================
-- PRIMERA PARTE
-- ============================================================

-- ============================================================
-- 1. STORED PROCEDURES Y FUNCTIONS
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- Ejercicio Práctico 1: fn_dias_tarea
-- ─────────────────────────────────────────────────────────────
-- Crea una función que calcule cuántos días tardó en
-- completarse una tarea. Retorna -1 si no está completada.
-- ─────────────────────────────────────────────────────────────

DELIMITER $$

DROP FUNCTION IF EXISTS fn_dias_tarea$$
CREATE FUNCTION fn_dias_tarea(p_id_tarea INT)
RETURNS INT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_fecha_creacion   DATE;
    DECLARE v_fecha_completada DATE;

    SELECT fecha_creacion, fecha_completada
      INTO v_fecha_creacion, v_fecha_completada
      FROM tareas
     WHERE id_tarea = p_id_tarea;

    -- Si la tarea no está completada, retornar -1
    IF v_fecha_completada IS NULL THEN
        RETURN -1;
    END IF;

    RETURN DATEDIFF(v_fecha_completada, v_fecha_creacion);
END$$

DELIMITER ;

-- Uso de la función: listar tareas completadas del proyecto 1
SELECT  t.titulo,
        t.estado,
        fn_dias_tarea(t.id_tarea) AS dias_para_completar
FROM    tareas t
WHERE   t.id_proyecto = 1
  AND   t.fecha_completada IS NOT NULL
ORDER BY fn_dias_tarea(t.id_tarea) ASC;   -- del más rápido al más lento


-- ─────────────────────────────────────────────────────────────
-- Ejercicio Práctico 2: sp_cerrar_bug
-- ─────────────────────────────────────────────────────────────
-- SP que resuelve un bug y deja trazabilidad en auditorias.
-- ─────────────────────────────────────────────────────────────

DELIMITER $$

DROP PROCEDURE IF EXISTS sp_cerrar_bug$$
CREATE PROCEDURE sp_cerrar_bug(
    IN p_id_bug      INT,
    IN p_id_resolutor INT
)
BEGIN
    DECLARE v_titulo_bug VARCHAR(200);

    -- a) Guardar título para el log
    SELECT titulo INTO v_titulo_bug
      FROM bugs
     WHERE id_bug = p_id_bug;

    -- b) Cambiar estado a "resuelto" y registrar fecha + resolutor
    UPDATE bugs
       SET estado            = 'resuelto',
           fecha_resolucion  = NOW(),
           id_asignado       = p_id_resolutor
     WHERE id_bug = p_id_bug;

    -- c) Insertar registro en auditorias
    INSERT INTO auditorias (tabla_afectada, id_registro, accion, id_usuario, detalle)
    VALUES ('bugs', p_id_bug, 'RESOLVER', p_id_resolutor,
            CONCAT('Bug resuelto: ', IFNULL(v_titulo_bug, 'sin título')));
END$$

DELIMITER ;

-- Prueba:
CALL sp_cerrar_bug(4, 2);

-- Verificación:
SELECT id_bug, titulo, estado, fecha_resolucion, id_asignado
  FROM bugs
 WHERE id_bug = 4;

SELECT * FROM auditorias ORDER BY fecha DESC LIMIT 3;


-- ============================================================
-- 2. DATA INTEGRITY & SECURITY
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- Ejercicio Práctico 3: Usuario svc_qa con permisos mínimos
-- ─────────────────────────────────────────────────────────────

-- Crear usuario
CREATE USER IF NOT EXISTS 'svc_qa'@'localhost'
    IDENTIFIED BY 'QA2024!Test';

-- Permiso de lectura en todas las tablas
GRANT SELECT ON SistemaGestion.* TO 'svc_qa'@'localhost';

-- Insertar y actualizar bugs
GRANT INSERT, UPDATE ON SistemaGestion.bugs TO 'svc_qa'@'localhost';

-- Solo insertar comentarios (no editar ni borrar)
GRANT INSERT ON SistemaGestion.comentarios TO 'svc_qa'@'localhost';

FLUSH PRIVILEGES;

-- Verificar:
SHOW GRANTS FOR 'svc_qa'@'localhost';

/*
 ¿Por qué NO le damos DELETE sobre bugs?
 El rol de QA reporta y actualiza bugs, pero no debe poder eliminarlos.
 Eliminar un bug borraría la evidencia histórica de un defecto, lo cual
 rompe la trazabilidad y el cumplimiento (auditoría). Solo el administrador
 o un rol con privilegio explícito puede borrar registros.
*/


-- ─────────────────────────────────────────────────────────────
-- Ejercicio Práctico (2.2 REVOKE): Revocar permiso erróneo
-- ─────────────────────────────────────────────────────────────

-- Simular el error: alguien dio UPDATE sobre tareas a svc_qa
GRANT UPDATE ON SistemaGestion.tareas TO 'svc_qa'@'localhost';
FLUSH PRIVILEGES;

-- Verificar que el permiso existe
SHOW GRANTS FOR 'svc_qa'@'localhost';

-- Revocar el permiso erróneo
REVOKE UPDATE ON SistemaGestion.tareas FROM 'svc_qa'@'localhost';
FLUSH PRIVILEGES;

-- Verificar que ya no aparece
SHOW GRANTS FOR 'svc_qa'@'localhost';


-- ─────────────────────────────────────────────────────────────
-- Ejercicio Práctico (2.3 Vistas): v_tareas_publico
-- ─────────────────────────────────────────────────────────────

CREATE OR REPLACE VIEW v_tareas_publico AS
SELECT  id_tarea,
        titulo,
        prioridad,
        estado,
        story_points,
        id_proyecto
FROM    tareas;
-- Columnas excluidas: descripcion, id_sprint, id_asignado,
--                     fecha_creacion, fecha_completada

-- Consulta sobre la vista: tareas críticas en progreso del proyecto 2
SELECT *
  FROM v_tareas_publico
 WHERE id_proyecto = 2
   AND prioridad   = 'critica'
   AND estado      = 'en_progreso'
 ORDER BY prioridad DESC;


-- ============================================================
-- 3. TRANSACTIONS
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- Ejercicio Práctico (3.1 COMMIT): Insertar bug + auditoría
-- ─────────────────────────────────────────────────────────────

START TRANSACTION;

    -- Insertar nuevo bug en proyecto 2
    INSERT INTO bugs (titulo, descripcion, severidad, estado,
                      id_proyecto, id_reportado_por, id_asignado, fecha_reporte)
    VALUES ('Error en módulo de pagos', 'Falla al procesar tarjetas Visa',
            'alta', 'abierto', 2, 5, 3, NOW());

    -- Registrar auditoría usando el ID recién generado
    INSERT INTO auditorias (tabla_afectada, id_registro, accion, id_usuario, detalle)
    VALUES ('bugs', LAST_INSERT_ID(), 'INSERTAR', 5,
            'Bug creado vía transacción - severidad alta, proyecto 2');

COMMIT;

-- Verificación
SELECT * FROM bugs       ORDER BY id_bug       DESC LIMIT 1;
SELECT * FROM auditorias ORDER BY fecha         DESC LIMIT 1;


-- ─────────────────────────────────────────────────────────────
-- Ejercicio Práctico (3.2 ROLLBACK): Deshacer cambio masivo
-- ─────────────────────────────────────────────────────────────

START TRANSACTION;

    -- UPDATE peligroso (sin WHERE específico en id)
    UPDATE bugs SET severidad = 'baja' WHERE id_proyecto = 5;

    -- Ver cuántos registros se afectaron ANTES del commit
    SELECT COUNT(*) AS registros_afectados
      FROM bugs
     WHERE id_proyecto = 5 AND severidad = 'baja';

    -- Decidimos que NO era lo que queríamos: hacemos ROLLBACK
    ROLLBACK;

-- Verificar que los bugs del proyecto 5 recuperaron su severidad original
SELECT id_bug, titulo, severidad
  FROM bugs
 WHERE id_proyecto = 5;

/*
 ¿Por qué el ROLLBACK fue útil aquí?
 El UPDATE afectó TODOS los bugs del proyecto 5, cambiando severidades
 importantes (crítica, alta) a "baja" sin intención. Como usamos
 START TRANSACTION antes, pudimos revertir el error con ROLLBACK,
 dejando la base de datos intacta. Sin transacciones, el daño
 hubiera sido permanente.
*/


-- ─────────────────────────────────────────────────────────────
-- Ejercicio Práctico (3.3 SAVEPOINT): Punto de guardado parcial
-- ─────────────────────────────────────────────────────────────

START TRANSACTION;

    -- Paso 1 (seguro): pausar el proyecto 5
    UPDATE proyectos
       SET estado = 'pausado'
     WHERE id_proyecto = 5;

    SAVEPOINT sp_proyecto_pausado;

    -- Paso 2 (riesgoso): intentar insertar sprint con datos inválidos
    -- Simulamos el fallo revirtiendo al savepoint manualmente:
    -- INSERT INTO sprints (id_proyecto, numero_sprint, ...) VALUES (5, NULL, ...);
    ROLLBACK TO SAVEPOINT sp_proyecto_pausado;

    -- Verificar: proyecto pausado, sprint no insertado
    SELECT id_proyecto, nombre, estado FROM proyectos WHERE id_proyecto = 5;

COMMIT;

-- Confirmar resultado final
SELECT id_proyecto, nombre, estado FROM proyectos WHERE id_proyecto = 5;
SELECT id_sprint FROM sprints WHERE id_proyecto = 5 ORDER BY id_sprint DESC LIMIT 3;


-- ============================================================
-- 4. PERFORMANCE OPTIMIZATION
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- Ejercicio Práctico (4.1 EXPLAIN): Analizar e indexar
-- ─────────────────────────────────────────────────────────────

-- ANTES de índices: ver plan de ejecución
EXPLAIN
SELECT * FROM tareas
 WHERE id_asignado = 2
   AND estado = 'completada';

-- Crear índices para optimizar la consulta
CREATE INDEX idx_tareas_asignado ON tareas(id_asignado);
CREATE INDEX idx_tareas_estado   ON tareas(estado);

-- DESPUÉS de índices: comparar el plan
EXPLAIN
SELECT * FROM tareas
 WHERE id_asignado = 2
   AND estado = 'completada';

/*
 Diferencia observada:
 ANTES: type = ALL (full table scan), key = NULL, rows = N total
 DESPUÉS: type = ref, key = idx_tareas_asignado (o idx compuesto),
          rows = número reducido. MySQL ya no recorre toda la tabla.

 Índice compuesto más eficiente para esta query exacta:
*/
CREATE INDEX idx_tareas_asignado_estado ON tareas(id_asignado, estado);


-- ============================================================
-- SEGUNDA PARTE
-- ============================================================

-- ============================================================
-- 5. WINDOW FUNCTIONS
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- Ejercicio 5.1 DENSE_RANK: Ranking de proyectos por bugs resueltos
-- ─────────────────────────────────────────────────────────────

SELECT  p.nombre                                     AS proyecto,
        COUNT(b.id_bug)                              AS bugs_resueltos,
        DENSE_RANK() OVER (
            ORDER BY COUNT(b.id_bug) DESC
        )                                            AS ranking
FROM    proyectos p
LEFT JOIN bugs b
       ON p.id_proyecto = b.id_proyecto
      AND b.estado IN ('resuelto', 'cerrado')
GROUP BY p.id_proyecto, p.nombre
ORDER BY bugs_resueltos DESC;


-- ─────────────────────────────────────────────────────────────
-- Ejercicio 5.2 LEAD: Fechas de inicio de sprints consecutivos
-- ─────────────────────────────────────────────────────────────

SELECT  p.nombre                                     AS proyecto,
        s.numero_sprint,
        s.fecha_inicio,
        LEAD(s.fecha_inicio) OVER (
            PARTITION BY s.id_proyecto
            ORDER BY     s.numero_sprint
        )                                            AS fecha_inicio_siguiente,
        DATEDIFF(
            LEAD(s.fecha_inicio) OVER (
                PARTITION BY s.id_proyecto
                ORDER BY     s.numero_sprint
            ),
            s.fecha_inicio
        )                                            AS dias_entre_sprints
FROM    sprints s
JOIN    proyectos p ON s.id_proyecto = p.id_proyecto
ORDER BY p.nombre, s.numero_sprint;


-- ─────────────────────────────────────────────────────────────
-- Ejercicio 5.3 ROW_NUMBER: 2 bugs más recientes por proyecto
-- ─────────────────────────────────────────────────────────────

SELECT *
FROM (
    SELECT  p.nombre                     AS proyecto,
            b.titulo,
            b.severidad,
            b.fecha_reporte,
            ROW_NUMBER() OVER (
                PARTITION BY b.id_proyecto
                ORDER BY     b.fecha_reporte DESC
            )                            AS rn
    FROM    bugs b
    JOIN    proyectos p ON b.id_proyecto = p.id_proyecto
) ranked
WHERE rn <= 2
ORDER BY proyecto, rn;


-- ============================================================
-- 6. RECURSIVE QUERIES (CTE RECURSIVAS)
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- Ejercicio 6.1 CTE Recursiva: Serie Fibonacci (8 números)
-- ─────────────────────────────────────────────────────────────

WITH RECURSIVE fibonacci AS (
    -- Caso base: posición 1 → valor 0
    SELECT 1 AS posicion, 0 AS actual, 1 AS siguiente

    UNION ALL

    -- Caso recursivo: avanzar un paso
    SELECT posicion + 1,
           siguiente,
           actual + siguiente
      FROM fibonacci
     WHERE posicion < 8
)
SELECT posicion, actual AS valor_fibonacci
  FROM fibonacci;
-- Resultado: 0, 1, 1, 2, 3, 5, 8, 13


-- ─────────────────────────────────────────────────────────────
-- Ejercicio 6.1 (parte 2): Calendario de sprints para
-- "Portal Web Clientes" desde 01-oct-2024, 4 sprints de 2 semanas
-- ─────────────────────────────────────────────────────────────

WITH RECURSIVE calendario_sprints AS (
    -- Caso base: sprint 1
    SELECT 1                          AS numero_sprint,
           DATE('2024-10-01')         AS fecha_inicio

    UNION ALL

    -- Caso recursivo: cada sprint suma 14 días
    SELECT numero_sprint + 1,
           DATE_ADD(fecha_inicio, INTERVAL 14 DAY)
      FROM calendario_sprints
     WHERE numero_sprint < 4
)
SELECT  numero_sprint,
        fecha_inicio,
        DATE_ADD(fecha_inicio, INTERVAL 13 DAY)      AS fecha_fin,
        CONCAT('Sprint ', numero_sprint, ': ',
               DATE_FORMAT(fecha_inicio, '%d/%m/%Y'),
               ' - ',
               DATE_FORMAT(DATE_ADD(fecha_inicio, INTERVAL 13 DAY), '%d/%m/%Y')
        )                                            AS descripcion
FROM    calendario_sprints;


-- ============================================================
-- 7. PIVOT / UNPIVOT OPERATIONS
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- Ejercicio 7.1 PIVOT: Tareas pendientes por desarrollador y prioridad
-- ─────────────────────────────────────────────────────────────

SELECT  u.nombre                                              AS desarrollador,
        SUM(CASE WHEN t.prioridad = 'baja'    THEN 1 ELSE 0 END) AS baja,
        SUM(CASE WHEN t.prioridad = 'media'   THEN 1 ELSE 0 END) AS media,
        SUM(CASE WHEN t.prioridad = 'alta'    THEN 1 ELSE 0 END) AS alta,
        SUM(CASE WHEN t.prioridad = 'critica' THEN 1 ELSE 0 END) AS critica,
        COUNT(t.id_tarea)                                     AS total_pendientes
FROM    usuarios u
LEFT JOIN tareas t
       ON u.id_usuario = t.id_asignado
      AND t.estado <> 'completada'
WHERE   u.activo = TRUE
GROUP BY u.id_usuario, u.nombre
ORDER BY critica DESC;


-- ============================================================
-- 8. COMMON TABLE EXPRESSIONS (CTE)
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- Ejercicio 8.1 CTE Simple: Sprints con eficiencia < 85%
-- ─────────────────────────────────────────────────────────────

WITH resumen_sprints AS (
    SELECT  id_sprint,
            id_proyecto,
            numero_sprint,
            velocidad_estimada,
            velocidad_real,
            ROUND(
                (velocidad_real / NULLIF(velocidad_estimada, 0)) * 100, 2
            ) AS eficiencia
    FROM    sprints
)
SELECT  p.nombre              AS proyecto,
        rs.numero_sprint,
        rs.velocidad_estimada,
        rs.velocidad_real,
        rs.eficiencia
FROM    resumen_sprints rs
JOIN    proyectos p ON rs.id_proyecto = p.id_proyecto
WHERE   rs.eficiencia < 85
ORDER BY rs.eficiencia ASC;


-- ─────────────────────────────────────────────────────────────
-- Ejercicio 8.2 CTEs Múltiples: Reporte semanal del Tech Lead
-- ─────────────────────────────────────────────────────────────

WITH
top_developers AS (
    SELECT  t.id_asignado,
            SUM(t.story_points)  AS puntos_entregados,
            COUNT(t.id_tarea)    AS tareas_completadas
    FROM    tareas t
    WHERE   t.estado = 'completada'
    GROUP BY t.id_asignado
),
bugs_pendientes AS (
    SELECT  b.id_asignado,
            COUNT(b.id_bug)      AS bugs_pendientes
    FROM    bugs b
    WHERE   b.estado IN ('abierto', 'en_revision')
    GROUP BY b.id_asignado
)
SELECT  u.nombre                                    AS desarrollador,
        r.nombre_rol                                AS rol,
        COALESCE(td.puntos_entregados, 0)           AS puntos_entregados,
        COALESCE(td.tareas_completadas, 0)          AS tareas_completadas,
        COALESCE(bp.bugs_pendientes, 0)             AS bugs_pendientes,
        CASE
            WHEN COALESCE(bp.bugs_pendientes, 0) > 2 THEN 'Sobrecargado'
            WHEN COALESCE(bp.bugs_pendientes, 0) BETWEEN 1 AND 2 THEN 'Normal'
            ELSE 'Disponible'
        END                                         AS estado_carga
FROM    usuarios u
JOIN    roles r    ON u.id_rol = r.id_rol
LEFT JOIN top_developers td ON u.id_usuario = td.id_asignado
LEFT JOIN bugs_pendientes bp ON u.id_usuario = bp.id_asignado
ORDER BY puntos_entregados DESC;


-- ============================================================
-- 9. DYNAMIC SQL
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- Ejercicio 9.1 Dynamic SQL: sp_buscar_bugs con filtros opcionales
-- ─────────────────────────────────────────────────────────────

DELIMITER $$

DROP PROCEDURE IF EXISTS sp_buscar_bugs$$
CREATE PROCEDURE sp_buscar_bugs(
    IN p_severidad   VARCHAR(20),   -- NULL omite este filtro
    IN p_estado      VARCHAR(20),   -- NULL omite este filtro
    IN p_id_proyecto INT            -- NULL omite este filtro
)
BEGIN
    SET @sql =
        'SELECT b.id_bug,
                b.titulo,
                b.severidad,
                b.estado,
                p.nombre AS proyecto,
                u.nombre AS asignado_a
         FROM   bugs b
         LEFT JOIN proyectos p ON b.id_proyecto = p.id_proyecto
         LEFT JOIN usuarios  u ON b.id_asignado  = u.id_usuario
         WHERE  1=1';

    IF p_severidad IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND b.severidad = ''', p_severidad, '''');
    END IF;

    IF p_estado IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND b.estado = ''', p_estado, '''');
    END IF;

    IF p_id_proyecto IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND b.id_proyecto = ', p_id_proyecto);
    END IF;

    SET @sql = CONCAT(@sql, ' ORDER BY b.fecha_reporte DESC');

    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

DELIMITER ;

-- Pruebas:
CALL sp_buscar_bugs('critica', NULL, NULL);      -- solo por severidad
CALL sp_buscar_bugs(NULL, 'abierto', NULL);      -- solo por estado
CALL sp_buscar_bugs(NULL, NULL, 1);              -- solo por proyecto
CALL sp_buscar_bugs('alta', 'abierto', NULL);    -- combinación: severidad + estado
CALL sp_buscar_bugs(NULL, NULL, NULL);           -- sin filtros: todos los bugs

-- ============================================================
-- FIN DEL TALLER - SOLUCIONES COMPLETAS
-- ============================================================
