import type { Task } from './models/Task'

const baseUrl = '/api/task'

export class TaskDataSource {
  async GET(): Promise<Task[]> {
    const resp = await fetch(baseUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    const json = await resp.json()
    return json.data
  }

  async POST(task: string): Promise<Task> {
    const resp = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task }),
    })
    const json = await resp.json()
    return json.data
  }

  async PUT(id: number, update: Partial<Pick<Task, 'completed' | 'task'>>): Promise<Task> {
    const resp = await fetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    })
    const json = await resp.json()
    return json.data
  }

  async DELETE(id: number): Promise<void> {
    await fetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
