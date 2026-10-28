# TaskBoard

Gestor de tareas en React con listado, tablero Kanban y persistencia en un archivo JSON.

Proyecto de **JavaScript Avanzado · Semana 12**. Permite crear, editar, filtrar, eliminar y mover tareas entre estados. Cada cambio se guarda en `server/data/tasks.json`.

## Qué incluye

- **Hooks:** `useState`, `useEffect`, `useContext`, `useMemo`, `useCallback`, `useRef` y los hooks propios `useTasks` y `useTaskFilters`.
- **Router:** navegación entre inicio, listado, detalle/edición y Kanban.
- **Tailwind CSS:** layout a pantalla completa, sidebar, tarjetas y columnas del tablero.
- **Persistencia JSON:** API Express que lee y escribe `server/data/tasks.json`.

## Páginas

| Ruta | Descripción |
| --- | --- |
| `/` | Inicio: resumen de tareas y creación rápida |
| `/tareas` | Listado con búsqueda y filtros |
| `/tareas/nueva` | Formulario para crear una tarea |
| `/tareas/:id` | Editar o eliminar una tarea |
| `/kanban` | Tablero con columnas Pendiente, En progreso, En revisión y Completada |

En el Kanban se puede arrastrar una tarjeta a otra columna. El nuevo estado se guarda de inmediato en el JSON.

## Requisitos

- Node.js 18 o superior
- npm

## Cómo levantar el proyecto

En la carpeta del proyecto:

```bash
npm install
npm run dev
```

Eso inicia al mismo tiempo:

- el cliente Vite en [http://localhost:5173](http://localhost:5173)
- la API Express en [http://localhost:4001](http://localhost:4001)

Abre el navegador en **http://localhost:5173**.

### Scripts

| Comando | Uso |
| --- | --- |
| `npm run dev` | Levanta cliente y servidor juntos |
| `npm run client` | Solo la interfaz (Vite) |
| `npm run server` | Solo la API de persistencia |
| `npm run build` | Genera la versión de producción |
| `npm run preview` | Previsualiza el build |

## Persistencia

Los datos viven en:

```text
server/data/tasks.json
```

Puedes abrir ese archivo después de crear, mover o borrar una tarea para comprobar que el cambio quedó guardado.

### API

| Método | Ruta | Acción |
| --- | --- | --- |
| `GET` | `/api/tasks` | Listar tareas |
| `GET` | `/api/tasks/:id` | Obtener una tarea |
| `POST` | `/api/tasks` | Crear |
| `PUT` | `/api/tasks/:id` | Actualizar |
| `PATCH` | `/api/tasks/:id` | Actualizar parcial (por ejemplo el estado) |
| `DELETE` | `/api/tasks/:id` | Eliminar |

Vite reenvía las peticiones de `/api` hacia `http://localhost:4001`.

## Estructura

```text
SEMANA 12/
├── server/
│   ├── index.js              # API Express
│   └── data/tasks.json       # Persistencia
├── src/
│   ├── api/                  # Llamadas HTTP
│   ├── components/           # Layout, tarjetas y formulario
│   ├── context/              # Estado global de tareas
│   ├── hooks/                # Hooks personalizados
│   └── pages/                # Inicio, listado, editor y Kanban
├── package.json
└── vite.config.js
```
