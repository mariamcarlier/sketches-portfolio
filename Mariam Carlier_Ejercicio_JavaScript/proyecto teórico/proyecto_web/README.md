# Sistema de Gestión de Proyectos — GA6 AA2_R6
## Análisis y Desarrollo de Software (ADSO) · SENA

Proyecto web que demuestra los conceptos del taller:
- Stored Procedures y Functions
- Data Integrity & Security (GRANT, REVOKE, Vistas)
- Transactions (COMMIT, ROLLBACK, SAVEPOINT)
- Performance Optimization (EXPLAIN, Índices)
- Window Functions (RANK, LAG, ROW_NUMBER)
- Recursive Queries (CTE Recursivas)
- Pivot / Unpivot Operations
- Common Table Expressions
- Dynamic SQL

---

## Estructura del proyecto

```
proyecto_web/
├── backend/
│   ├── app.py            ← API Flask (Python)
│   └── requirements.txt
└── frontend/
    ├── index.html        ← SPA principal
    ├── css/
    │   └── style.css
    └── js/
        ├── api.js        ← helpers HTTP
        ├── components.js ← componentes reutilizables
        ├── pages.js      ← vistas de cada sección
        └── app.js        ← router / navegación
```

---

## Requisitos

- Python 3.8+
- pip
- Navegador moderno (Chrome, Firefox, Edge)

---

## Cómo ejecutar

### 1. Instalar dependencias del backend

```bash
cd backend
pip install -r requirements.txt
```

### 2. Iniciar el servidor Flask

```bash
python app.py
```

El servidor queda disponible en: **http://localhost:5000**

### 3. Abrir el frontend

Abre directamente en tu navegador:
```
frontend/index.html
```

O con un servidor local (recomendado):
```bash
cd frontend
python -m http.server 8080
# Abrir: http://localhost:8080
```

---

## Endpoints de la API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/dashboard | Resumen ejecutivo |
| GET | /api/proyectos | Lista de proyectos |
| GET | /api/tareas | Tareas (filtros: id_proyecto, estado) |
| GET | /api/bugs | Bugs (filtros: severidad, estado, id_proyecto) |
| GET | /api/usuarios | Desarrolladores con estadísticas |
| GET | /api/sprints | Sprints con eficiencia |
| GET | /api/ranking/bugs | DENSE_RANK por bugs resueltos |
| GET | /api/pivot/tareas | PIVOT por prioridad y desarrollador |
| GET | /api/auditorias | Log de auditorías |
| POST | /api/bugs/crear | Insertar bug en transacción |
| POST | /api/bugs/cerrar | Cerrar bug (simula sp_cerrar_bug) |
| POST | /api/tareas/asignar | Asignar tarea (simula sp_asignar_tarea) |

---

## Conectar a MySQL real

El backend usa datos en memoria para demostración. Para conectar a MySQL:

```bash
pip install mysql-connector-python
```

En `app.py`, reemplazar los diccionarios de datos por consultas:

```python
import mysql.connector

conn = mysql.connector.connect(
    host='localhost',
    user='tu_usuario',
    password='tu_contraseña',
    database='SistemaGestion'
)
cursor = conn.cursor(dictionary=True)
cursor.execute("SELECT * FROM proyectos")
proyectos = cursor.fetchall()
```

---

## Archivo SQL

El archivo `soluciones_taller.sql` contiene todas las soluciones del taller
listas para ejecutar en MySQL Workbench sobre la base de datos `SistemaGestion`.
