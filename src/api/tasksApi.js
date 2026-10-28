const API_URL = '/api/tasks'

async function request(path = '', options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Ocurrió un error al comunicarse con el servidor.')
  }

  return data
}

export function fetchTasks() {
  return request()
}

export function fetchTask(id) {
  return request(`/${id}`)
}

export function createTask(payload) {
  return request('', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateTask(id, payload) {
  return request(`/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function patchTask(id, payload) {
  return request(`/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function removeTask(id) {
  return request(`/${id}`, {
    method: 'DELETE',
  })
}
