import { useState, useEffect, useCallback } from 'react'
import { TaskDataSource } from './TaskDataSource'
import type { Task } from './models/Task'

const ds = new TaskDataSource()

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchTasks = useCallback(async () => {
    try {
      setError(null)
      const data = await ds.GET()
      setTasks(data)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e)
      setError(`Failed to fetch tasks: ${message}`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchTasks()
  }, [fetchTasks])

  const addTask = async () => {
    const text = newTask.trim()
    if (!text) return
    try {
      setError(null)
      await ds.POST(text)
      setNewTask('')
      await fetchTasks()
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e)
      setError(`Failed to add task: ${message}`)
    }
  }

  const toggleTask = async (task: Task) => {
    try {
      setError(null)
      await ds.PUT(task._id, { completed: task.completed ? 0 : 1 })
      await fetchTasks()
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e)
      setError(`Failed to update task: ${message}`)
    }
  }

  const deleteTask = async (id: number) => {
    try {
      setError(null)
      await ds.DELETE(id)
      await fetchTasks()
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e)
      setError(`Failed to delete task: ${message}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      void addTask()
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>msnodesqlv8 + Vite Todo App</h1>

      {error && (
        <div style={{ padding: 12, marginBottom: 16, background: '#fee', border: '1px solid #c00', borderRadius: 4, color: '#c00' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task..."
          style={{ flex: 1, padding: 8, fontSize: 16, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <button
          onClick={() => void addTask()}
          style={{ padding: '8px 16px', fontSize: 16, borderRadius: 4, border: 'none', background: '#0078d4', color: 'white', cursor: 'pointer' }}
        >
          Add
        </button>
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p style={{ color: '#666' }}>No tasks yet. Add one above!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map((task) => (
            <li
              key={task._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '8px 0',
                borderBottom: '1px solid #eee',
              }}
            >
              <input
                type="checkbox"
                checked={task.completed === 1}
                onChange={() => void toggleTask(task)}
                style={{ width: 20, height: 20, cursor: 'pointer' }}
              />
              <span
                style={{
                  flex: 1,
                  fontSize: 16,
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? '#999' : '#333',
                }}
              >
                {task.task}
              </span>
              <button
                onClick={() => void deleteTask(task._id)}
                style={{
                  padding: '4px 10px',
                  fontSize: 14,
                  borderRadius: 4,
                  border: '1px solid #ccc',
                  background: 'white',
                  cursor: 'pointer',
                  color: '#c00',
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
