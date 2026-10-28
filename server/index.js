import cors from 'cors'
import express from 'express'
import { existsSync } from 'fs'
import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_DIR = path.join(__dirname, 'data')
const DATA_FILE = path.join(DATA_DIR, 'tasks.json')
const PORT = Number(process.env.PORT) || 4001

const app = express()
app.use(cors())
app.use(express.json())

let writeQueue = Promise.resolve()

function withLock(operation) {
  const run = writeQueue.then(operation, operation)
  writeQueue = run.catch(() => {})
  return run
}

async function ensureDataFile() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true })
  }

  if (!existsSync(DATA_FILE)) {
    await writeFile(DATA_FILE, '[]', 'utf-8')
  }
}

async function readTasks() {
  await ensureDataFile()
  const raw = await readFile(DATA_FILE, 'utf-8')

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function saveTasks(tasks) {
  await ensureDataFile()
  await writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf-8')
}

function isValidStatus(status) {
  return ['pendiente', 'en_progreso', 'revision', 'completada'].includes(status)
}

function isValidPriority(priority) {
  return ['baja', 'media', 'alta'].includes(priority)
}

function normalizeTask(payload, current = {}) {
  const title = String(payload.title ?? current.title ?? '').trim()
  const description = String(payload.description ?? current.description ?? '').trim()
  const status = payload.status ?? current.status ?? 'pendiente'
  const priority = payload.priority ?? current.priority ?? 'media'
  const dueDate = String(payload.dueDate ?? current.dueDate ?? '').trim()

  if (!title) {
    return { error: 'El título es obligatorio.' }
  }

  if (!isValidStatus(status)) {
    return { error: 'El estado no es válido.' }
  }

  if (!isValidPriority(priority)) {
    return { error: 'La prioridad no es válida.' }
  }

  return {
    task: {
      ...current,
      title,
      description,
      status,
      priority,
      dueDate,
      updatedAt: new Date().toISOString(),
    },
  }
}

app.get('/api/tasks', async (_req, res) => {
  try {
    const tasks = await readTasks()
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: 'No se pudieron leer las tareas.', error: error.message })
  }
})

app.get('/api/tasks/:id', async (req, res) => {
  try {
    const tasks = await readTasks()
    const task = tasks.find((item) => item.id === req.params.id)

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada.' })
    }

    res.json(task)
  } catch (error) {
    res.status(500).json({ message: 'No se pudo obtener la tarea.', error: error.message })
  }
})

app.post('/api/tasks', async (req, res) => {
  try {
    const result = await withLock(async () => {
      const normalized = normalizeTask(req.body)

      if (normalized.error) {
        return { status: 400, body: { message: normalized.error } }
      }

      const tasks = await readTasks()
      const now = new Date().toISOString()
      const task = {
        id: crypto.randomUUID(),
        createdAt: now,
        ...normalized.task,
        updatedAt: now,
      }

      tasks.unshift(task)
      await saveTasks(tasks)
      return { status: 201, body: task }
    })

    res.status(result.status).json(result.body)
  } catch (error) {
    res.status(500).json({ message: 'No se pudo crear la tarea.', error: error.message })
  }
})

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const result = await withLock(async () => {
      const tasks = await readTasks()
      const index = tasks.findIndex((item) => item.id === req.params.id)

      if (index === -1) {
        return { status: 404, body: { message: 'Tarea no encontrada.' } }
      }

      const normalized = normalizeTask(req.body, tasks[index])

      if (normalized.error) {
        return { status: 400, body: { message: normalized.error } }
      }

      tasks[index] = { ...tasks[index], ...normalized.task }
      await saveTasks(tasks)
      return { status: 200, body: tasks[index] }
    })

    res.status(result.status).json(result.body)
  } catch (error) {
    res.status(500).json({ message: 'No se pudo actualizar la tarea.', error: error.message })
  }
})

app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const result = await withLock(async () => {
      const tasks = await readTasks()
      const index = tasks.findIndex((item) => item.id === req.params.id)

      if (index === -1) {
        return { status: 404, body: { message: 'Tarea no encontrada.' } }
      }

      const normalized = normalizeTask({ ...tasks[index], ...req.body }, tasks[index])

      if (normalized.error) {
        return { status: 400, body: { message: normalized.error } }
      }

      tasks[index] = { ...tasks[index], ...normalized.task }
      await saveTasks(tasks)
      return { status: 200, body: tasks[index] }
    })

    res.status(result.status).json(result.body)
  } catch (error) {
    res.status(500).json({ message: 'No se pudo actualizar la tarea.', error: error.message })
  }
})

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const result = await withLock(async () => {
      const tasks = await readTasks()
      const index = tasks.findIndex((item) => item.id === req.params.id)

      if (index === -1) {
        return { status: 404, body: { message: 'Tarea no encontrada.' } }
      }

      const [removed] = tasks.splice(index, 1)
      await saveTasks(tasks)
      return { status: 200, body: removed }
    })

    res.status(result.status).json(result.body)
  } catch (error) {
    res.status(500).json({ message: 'No se pudo eliminar la tarea.', error: error.message })
  }
})

const server = app.listen(PORT, () => {
  console.log(`API de tareas escuchando en http://localhost:${PORT}`)
  console.log(`Persistencia JSON: ${DATA_FILE}`)
})

server.on('error', (error) => {
  console.error('No se pudo iniciar la API:', error.message)
  process.exit(1)
})
