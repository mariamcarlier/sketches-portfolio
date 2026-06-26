"""
Sistema de Gestión de Proyectos de Software
Backend Flask — GA6 AA2_R6
Simula la base de datos del taller con datos en memoria.
Para conectar a MySQL real: descomentar las secciones de mysql-connector-python.
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, date, timedelta
import json

app = Flask(__name__)
CORS(app)

# ─────────────────────────────────────────────────────────────
# BASE DE DATOS EN MEMORIA (simula SistemaGestion)
# ─────────────────────────────────────────────────────────────

roles = [
    {"id_rol": 1, "nombre_rol": "Tech Lead"},
    {"id_rol": 2, "nombre_rol": "Senior Developer"},
    {"id_rol": 3, "nombre_rol": "Junior Developer"},
    {"id_rol": 4, "nombre_rol": "QA Engineer"},
    {"id_rol": 5, "nombre_rol": "Scrum Master"},
]

usuarios = [
    {"id_usuario": 1, "nombre": "Carlos Martínez",  "email": "carlos@dev.com",  "id_rol": 1, "activo": True},
    {"id_usuario": 2, "nombre": "María López",      "email": "maria@dev.com",   "id_rol": 2, "activo": True},
    {"id_usuario": 3, "nombre": "Juan Pérez",       "email": "juan@dev.com",    "id_rol": 3, "activo": True},
    {"id_usuario": 4, "nombre": "Ana García",       "email": "ana@dev.com",     "id_rol": 4, "activo": True},
    {"id_usuario": 5, "nombre": "Luis Rodríguez",   "email": "luis@dev.com",    "id_rol": 5, "activo": True},
    {"id_usuario": 6, "nombre": "Sofía Torres",     "email": "sofia@dev.com",   "id_rol": 2, "activo": False},
]

proyectos = [
    {"id_proyecto": 1, "nombre": "Portal Web Clientes",   "estado": "activo",    "fecha_inicio": "2024-01-15"},
    {"id_proyecto": 2, "nombre": "App Móvil Ventas",      "estado": "activo",    "fecha_inicio": "2024-03-01"},
    {"id_proyecto": 3, "nombre": "API Facturación",       "estado": "activo",    "fecha_inicio": "2024-02-10"},
    {"id_proyecto": 4, "nombre": "Dashboard Analytics",   "estado": "pausado",   "fecha_inicio": "2024-04-01"},
    {"id_proyecto": 5, "nombre": "Migración DB Legado",   "estado": "activo",    "fecha_inicio": "2024-05-20"},
]

sprints = [
    {"id_sprint": 1,  "id_proyecto": 1, "numero_sprint": 1, "velocidad_estimada": 40, "velocidad_real": 35, "fecha_inicio": "2024-01-15", "fecha_fin": "2024-01-29"},
    {"id_sprint": 2,  "id_proyecto": 1, "numero_sprint": 2, "velocidad_estimada": 40, "velocidad_real": 42, "fecha_inicio": "2024-01-29", "fecha_fin": "2024-02-12"},
    {"id_sprint": 3,  "id_proyecto": 1, "numero_sprint": 3, "velocidad_estimada": 45, "velocidad_real": 38, "fecha_inicio": "2024-02-12", "fecha_fin": "2024-02-26"},
    {"id_sprint": 4,  "id_proyecto": 2, "numero_sprint": 1, "velocidad_estimada": 30, "velocidad_real": 28, "fecha_inicio": "2024-03-01", "fecha_fin": "2024-03-15"},
    {"id_sprint": 5,  "id_proyecto": 2, "numero_sprint": 2, "velocidad_estimada": 35, "velocidad_real": 36, "fecha_inicio": "2024-03-15", "fecha_fin": "2024-03-29"},
    {"id_sprint": 6,  "id_proyecto": 3, "numero_sprint": 1, "velocidad_estimada": 50, "velocidad_real": 45, "fecha_inicio": "2024-02-10", "fecha_fin": "2024-02-24"},
    {"id_sprint": 7,  "id_proyecto": 3, "numero_sprint": 2, "velocidad_estimada": 50, "velocidad_real": 52, "fecha_inicio": "2024-02-24", "fecha_fin": "2024-03-09"},
]

tareas = [
    {"id_tarea": 1,  "titulo": "Diseño pantalla login",       "estado": "completada",  "prioridad": "alta",    "story_points": 5,  "id_proyecto": 1, "id_asignado": 2, "fecha_creacion": "2024-01-15", "fecha_completada": "2024-01-18"},
    {"id_tarea": 2,  "titulo": "API autenticación JWT",        "estado": "completada",  "prioridad": "critica", "story_points": 8,  "id_proyecto": 1, "id_asignado": 1, "fecha_creacion": "2024-01-16", "fecha_completada": "2024-01-22"},
    {"id_tarea": 3,  "titulo": "Módulo de productos",          "estado": "en_progreso", "prioridad": "alta",    "story_points": 13, "id_proyecto": 1, "id_asignado": 3, "fecha_creacion": "2024-01-29", "fecha_completada": None},
    {"id_tarea": 4,  "titulo": "Tests unitarios auth",         "estado": "en_progreso", "prioridad": "media",   "story_points": 5,  "id_proyecto": 1, "id_asignado": 4, "fecha_creacion": "2024-01-30", "fecha_completada": None},
    {"id_tarea": 5,  "titulo": "Pantalla catálogo móvil",      "estado": "completada",  "prioridad": "alta",    "story_points": 8,  "id_proyecto": 2, "id_asignado": 2, "fecha_creacion": "2024-03-01", "fecha_completada": "2024-03-10"},
    {"id_tarea": 6,  "titulo": "Carrito de compras",           "estado": "backlog",     "prioridad": "alta",    "story_points": 13, "id_proyecto": 2, "id_asignado": 3, "fecha_creacion": "2024-03-15", "fecha_completada": None},
    {"id_tarea": 7,  "titulo": "Endpoint factura PDF",         "estado": "completada",  "prioridad": "critica", "story_points": 8,  "id_proyecto": 3, "id_asignado": 1, "fecha_creacion": "2024-02-10", "fecha_completada": "2024-02-18"},
    {"id_tarea": 8,  "titulo": "Integración DIAN",             "estado": "en_progreso", "prioridad": "critica", "story_points": 21, "id_proyecto": 3, "id_asignado": 2, "fecha_creacion": "2024-02-24", "fecha_completada": None},
    {"id_tarea": 9,  "titulo": "Configurar métricas Grafana",  "estado": "backlog",     "prioridad": "baja",    "story_points": 3,  "id_proyecto": 4, "id_asignado": 3, "fecha_creacion": "2024-04-01", "fecha_completada": None},
    {"id_tarea": 10, "titulo": "Migración tabla usuarios",     "estado": "completada",  "prioridad": "critica", "story_points": 13, "id_proyecto": 5, "id_asignado": 1, "fecha_creacion": "2024-05-20", "fecha_completada": "2024-05-28"},
]

bugs = [
    {"id_bug": 1, "titulo": "Login falla con Safari",          "severidad": "alta",    "estado": "resuelto",   "id_proyecto": 1, "id_reportado_por": 4, "id_asignado": 2, "fecha_reporte": "2024-01-20", "fecha_resolucion": "2024-01-21"},
    {"id_bug": 2, "titulo": "Token JWT expira antes de tiempo","severidad": "critica", "estado": "cerrado",    "id_proyecto": 1, "id_reportado_por": 4, "id_asignado": 1, "fecha_reporte": "2024-01-23", "fecha_resolucion": "2024-01-24"},
    {"id_bug": 3, "titulo": "Imágenes no cargan en Android",   "severidad": "media",   "estado": "abierto",    "id_proyecto": 2, "id_reportado_por": 4, "id_asignado": 3, "fecha_reporte": "2024-03-12", "fecha_resolucion": None},
    {"id_bug": 4, "titulo": "Error al generar PDF con tildes", "severidad": "alta",    "estado": "abierto",    "id_proyecto": 3, "id_reportado_por": 4, "id_asignado": 2, "fecha_reporte": "2024-02-20", "fecha_resolucion": None},
    {"id_bug": 5, "titulo": "Redondeo incorrecto en totales",  "severidad": "critica", "estado": "en_revision","id_proyecto": 3, "id_reportado_por": 5, "id_asignado": 1, "fecha_reporte": "2024-03-01", "fecha_resolucion": None},
    {"id_bug": 6, "titulo": "Lentitud en dashboard principal", "severidad": "media",   "estado": "abierto",    "id_proyecto": 4, "id_reportado_por": 4, "id_asignado": 3, "fecha_reporte": "2024-04-05", "fecha_resolucion": None},
    {"id_bug": 7, "titulo": "FK constraint en migración",      "severidad": "alta",    "estado": "resuelto",   "id_proyecto": 5, "id_reportado_por": 1, "id_asignado": 1, "fecha_reporte": "2024-05-22", "fecha_resolucion": "2024-05-23"},
]

auditorias = [
    {"id_auditoria": 1, "tabla_afectada": "tareas", "id_registro": 2, "accion": "ASIGNAR",  "id_usuario": 1, "detalle": "Anterior: sin asignar -> Nuevo: usuario 1", "fecha": "2024-01-16 09:00:00"},
    {"id_auditoria": 2, "tabla_afectada": "bugs",   "id_registro": 1, "accion": "RESOLVER", "id_usuario": 2, "detalle": "Bug resuelto: Login falla con Safari",         "fecha": "2024-01-21 14:30:00"},
    {"id_auditoria": 3, "tabla_afectada": "bugs",   "id_registro": 2, "accion": "RESOLVER", "id_usuario": 1, "detalle": "Bug resuelto: Token JWT expira antes de tiempo","fecha": "2024-01-24 11:00:00"},
]

# ─────────────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────────────

def get_rol(id_rol):
    return next((r for r in roles if r["id_rol"] == id_rol), {"nombre_rol": "Desconocido"})

def get_usuario(id_usuario):
    return next((u for u in usuarios if u["id_usuario"] == id_usuario), None)

def get_proyecto(id_proyecto):
    return next((p for p in proyectos if p["id_proyecto"] == id_proyecto), None)

# ─────────────────────────────────────────────────────────────
# ENDPOINTS
# ─────────────────────────────────────────────────────────────

@app.route('/api/dashboard', methods=['GET'])
def dashboard():
    """Resumen ejecutivo del sistema."""
    total_proyectos   = len(proyectos)
    proyectos_activos = sum(1 for p in proyectos if p["estado"] == "activo")
    total_tareas      = len(tareas)
    tareas_completadas= sum(1 for t in tareas if t["estado"] == "completada")
    bugs_abiertos     = sum(1 for b in bugs if b["estado"] in ("abierto", "en_revision"))
    bugs_criticos     = sum(1 for b in bugs if b["severidad"] == "critica" and b["estado"] not in ("resuelto","cerrado"))
    total_usuarios    = sum(1 for u in usuarios if u["activo"])

    # Eficiencia promedio de sprints
    eficiencias = []
    for s in sprints:
        if s["velocidad_estimada"] > 0:
            eficiencias.append(round(s["velocidad_real"] / s["velocidad_estimada"] * 100, 1))
    eficiencia_prom = round(sum(eficiencias) / len(eficiencias), 1) if eficiencias else 0

    return jsonify({
        "total_proyectos":    total_proyectos,
        "proyectos_activos":  proyectos_activos,
        "total_tareas":       total_tareas,
        "tareas_completadas": tareas_completadas,
        "pct_avance":         round(tareas_completadas / total_tareas * 100, 1) if total_tareas else 0,
        "bugs_abiertos":      bugs_abiertos,
        "bugs_criticos":      bugs_criticos,
        "total_usuarios":     total_usuarios,
        "eficiencia_promedio":eficiencia_prom,
    })

@app.route('/api/proyectos', methods=['GET'])
def get_proyectos():
    """Lista de proyectos con estadísticas."""
    result = []
    for p in proyectos:
        t_proy = [t for t in tareas if t["id_proyecto"] == p["id_proyecto"]]
        b_proy = [b for b in bugs  if b["id_proyecto"] == p["id_proyecto"]]
        s_proy = [s for s in sprints if s["id_proyecto"] == p["id_proyecto"]]
        completadas = sum(1 for t in t_proy if t["estado"] == "completada")
        result.append({
            **p,
            "total_tareas":       len(t_proy),
            "tareas_completadas": completadas,
            "pct_avance":         round(completadas / len(t_proy) * 100, 1) if t_proy else 0,
            "bugs_abiertos":      sum(1 for b in b_proy if b["estado"] in ("abierto","en_revision")),
            "bugs_criticos":      sum(1 for b in b_proy if b["severidad"] == "critica" and b["estado"] not in ("resuelto","cerrado")),
            "total_sprints":      len(s_proy),
        })
    return jsonify(result)

@app.route('/api/tareas', methods=['GET'])
def get_tareas():
    """Tareas con información del asignado y proyecto."""
    id_proyecto = request.args.get('id_proyecto', type=int)
    estado_f    = request.args.get('estado')
    result = []
    for t in tareas:
        if id_proyecto and t["id_proyecto"] != id_proyecto:
            continue
        if estado_f and t["estado"] != estado_f:
            continue
        u = get_usuario(t.get("id_asignado"))
        p = get_proyecto(t["id_proyecto"])
        result.append({
            **t,
            "asignado_a": u["nombre"] if u else "Sin asignar",
            "proyecto":   p["nombre"] if p else "—",
        })
    return jsonify(result)

@app.route('/api/bugs', methods=['GET'])
def get_bugs():
    """Bugs con filtros opcionales — simula sp_buscar_bugs."""
    severidad   = request.args.get('severidad')
    estado_f    = request.args.get('estado')
    id_proyecto = request.args.get('id_proyecto', type=int)
    result = []
    for b in bugs:
        if severidad   and b["severidad"]   != severidad:   continue
        if estado_f    and b["estado"]      != estado_f:     continue
        if id_proyecto and b["id_proyecto"] != id_proyecto:  continue
        p  = get_proyecto(b["id_proyecto"])
        ua = get_usuario(b.get("id_asignado"))
        ur = get_usuario(b.get("id_reportado_por"))
        result.append({
            **b,
            "proyecto":       p["nombre"]  if p  else "—",
            "asignado_a":     ua["nombre"] if ua else "Sin asignar",
            "reportado_por":  ur["nombre"] if ur else "—",
        })
    return jsonify(result)

@app.route('/api/usuarios', methods=['GET'])
def get_usuarios():
    """Desarrolladores con estadísticas — simula reporte Tech Lead."""
    result = []
    for u in usuarios:
        if not u["activo"]:
            continue
        rol = get_rol(u["id_rol"])
        t_completadas = [t for t in tareas if t["id_asignado"] == u["id_usuario"] and t["estado"] == "completada"]
        t_pendientes  = [t for t in tareas if t["id_asignado"] == u["id_usuario"] and t["estado"] != "completada"]
        b_pendientes  = [b for b in bugs  if b["id_asignado"]  == u["id_usuario"] and b["estado"] in ("abierto","en_revision")]
        puntos = sum(t["story_points"] for t in t_completadas)
        n_bugs = len(b_pendientes)
        estado_carga = "Sobrecargado" if n_bugs > 2 else ("Normal" if n_bugs >= 1 else "Disponible")
        result.append({
            **u,
            "rol":               rol["nombre_rol"],
            "puntos_entregados": puntos,
            "tareas_completadas":len(t_completadas),
            "tareas_pendientes": len(t_pendientes),
            "bugs_pendientes":   n_bugs,
            "estado_carga":      estado_carga,
        })
    result.sort(key=lambda x: x["puntos_entregados"], reverse=True)
    return jsonify(result)

@app.route('/api/sprints', methods=['GET'])
def get_sprints():
    """Sprints con eficiencia — simula CTE resumen_sprints."""
    id_proyecto = request.args.get('id_proyecto', type=int)
    result = []
    for s in sprints:
        if id_proyecto and s["id_proyecto"] != id_proyecto:
            continue
        p   = get_proyecto(s["id_proyecto"])
        eff = round(s["velocidad_real"] / s["velocidad_estimada"] * 100, 1) if s["velocidad_estimada"] else 0
        result.append({
            **s,
            "proyecto":  p["nombre"] if p else "—",
            "eficiencia": eff,
            "alerta":    eff < 85,
        })
    return jsonify(result)

@app.route('/api/ranking/bugs', methods=['GET'])
def ranking_bugs():
    """DENSE_RANK de proyectos por bugs resueltos."""
    conteos = []
    for p in proyectos:
        resueltos = sum(1 for b in bugs
                        if b["id_proyecto"] == p["id_proyecto"]
                        and b["estado"] in ("resuelto", "cerrado"))
        conteos.append({"proyecto": p["nombre"], "bugs_resueltos": resueltos, "id_proyecto": p["id_proyecto"]})
    conteos.sort(key=lambda x: x["bugs_resueltos"], reverse=True)
    # Asignar DENSE_RANK
    rank = 1
    prev = None
    for i, item in enumerate(conteos):
        if prev is not None and item["bugs_resueltos"] < prev:
            rank = i + 1
        item["ranking"] = rank
        prev = item["bugs_resueltos"]
    return jsonify(conteos)

@app.route('/api/pivot/tareas', methods=['GET'])
def pivot_tareas():
    """PIVOT: tareas pendientes por desarrollador y prioridad."""
    result = []
    for u in usuarios:
        if not u["activo"]:
            continue
        pendientes = [t for t in tareas if t["id_asignado"] == u["id_usuario"] and t["estado"] != "completada"]
        row = {
            "desarrollador": u["nombre"],
            "rol": get_rol(u["id_rol"])["nombre_rol"],
            "baja":    sum(1 for t in pendientes if t["prioridad"] == "baja"),
            "media":   sum(1 for t in pendientes if t["prioridad"] == "media"),
            "alta":    sum(1 for t in pendientes if t["prioridad"] == "alta"),
            "critica": sum(1 for t in pendientes if t["prioridad"] == "critica"),
            "total":   len(pendientes),
        }
        result.append(row)
    result.sort(key=lambda x: x["critica"], reverse=True)
    return jsonify(result)

@app.route('/api/auditorias', methods=['GET'])
def get_auditorias():
    result = []
    for a in auditorias:
        u = get_usuario(a["id_usuario"])
        result.append({**a, "usuario": u["nombre"] if u else "—"})
    result.sort(key=lambda x: x["fecha"], reverse=True)
    return jsonify(result)

# ── Mutaciones ────────────────────────────────────────────────

@app.route('/api/bugs/cerrar', methods=['POST'])
def cerrar_bug():
    """Simula sp_cerrar_bug."""
    data = request.get_json()
    id_bug       = data.get("id_bug")
    id_resolutor = data.get("id_resolutor")
    bug = next((b for b in bugs if b["id_bug"] == id_bug), None)
    if not bug:
        return jsonify({"error": "Bug no encontrado"}), 404
    bug["estado"]           = "resuelto"
    bug["fecha_resolucion"] = datetime.now().strftime("%Y-%m-%d")
    bug["id_asignado"]      = id_resolutor
    auditoria = {
        "id_auditoria":   max(a["id_auditoria"] for a in auditorias) + 1,
        "tabla_afectada": "bugs",
        "id_registro":    id_bug,
        "accion":         "RESOLVER",
        "id_usuario":     id_resolutor,
        "detalle":        f"Bug resuelto: {bug['titulo']}",
        "fecha":          datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }
    auditorias.append(auditoria)
    return jsonify({"ok": True, "bug": bug, "auditoria": auditoria})

@app.route('/api/tareas/asignar', methods=['POST'])
def asignar_tarea():
    """Simula sp_asignar_tarea."""
    data       = request.get_json()
    id_tarea   = data.get("id_tarea")
    id_usuario = data.get("id_usuario")
    id_auditor = data.get("id_auditor", 1)
    tarea = next((t for t in tareas if t["id_tarea"] == id_tarea), None)
    if not tarea:
        return jsonify({"error": "Tarea no encontrada"}), 404
    anterior = tarea.get("id_asignado")
    tarea["id_asignado"] = id_usuario
    tarea["estado"]      = "en_progreso"
    auditoria = {
        "id_auditoria":   max(a["id_auditoria"] for a in auditorias) + 1,
        "tabla_afectada": "tareas",
        "id_registro":    id_tarea,
        "accion":         "ASIGNAR",
        "id_usuario":     id_auditor,
        "detalle":        f"Anterior: {anterior} -> Nuevo: {id_usuario}",
        "fecha":          datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }
    auditorias.append(auditoria)
    return jsonify({"ok": True, "tarea": tarea, "auditoria": auditoria})

@app.route('/api/bugs/crear', methods=['POST'])
def crear_bug():
    """Simula INSERT en transacción con auditoría."""
    data = request.get_json()
    nuevo_id = max(b["id_bug"] for b in bugs) + 1
    bug = {
        "id_bug":          nuevo_id,
        "titulo":          data.get("titulo", "Nuevo bug"),
        "severidad":       data.get("severidad", "media"),
        "estado":          "abierto",
        "id_proyecto":     data.get("id_proyecto", 1),
        "id_reportado_por":data.get("id_reportado_por", 1),
        "id_asignado":     data.get("id_asignado"),
        "fecha_reporte":   date.today().isoformat(),
        "fecha_resolucion":None,
    }
    bugs.append(bug)
    auditoria = {
        "id_auditoria":   max(a["id_auditoria"] for a in auditorias) + 1,
        "tabla_afectada": "bugs",
        "id_registro":    nuevo_id,
        "accion":         "INSERTAR",
        "id_usuario":     data.get("id_reportado_por", 1),
        "detalle":        f"Bug creado vía transacción: {bug['titulo']}",
        "fecha":          datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }
    auditorias.append(auditoria)
    return jsonify({"ok": True, "bug": bug, "auditoria": auditoria})

if __name__ == '__main__':
    print("🚀 Servidor iniciado en http://localhost:5000")
    print("   Endpoints disponibles:")
    print("   GET  /api/dashboard")
    print("   GET  /api/proyectos")
    print("   GET  /api/tareas?id_proyecto=N&estado=X")
    print("   GET  /api/bugs?severidad=X&estado=Y&id_proyecto=N")
    print("   GET  /api/usuarios")
    print("   GET  /api/sprints?id_proyecto=N")
    print("   GET  /api/ranking/bugs")
    print("   GET  /api/pivot/tareas")
    print("   GET  /api/auditorias")
    print("   POST /api/bugs/crear")
    print("   POST /api/bugs/cerrar")
    print("   POST /api/tareas/asignar")
    app.run(debug=True, port=5000)
