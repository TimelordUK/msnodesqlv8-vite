import { Router, Request, Response } from 'express'
import { getConnection } from '../db.js'

const router = Router()

// GET /api/task - fetch all tasks
router.get('/', async (_req: Request, res: Response) => {
  try {
    const con = await getConnection()
    try {
      const results = await con.promises.query('SELECT _id, completed, task FROM Task ORDER BY _id')
      res.json({ data: results.first })
    } finally {
      await con.promises.close()
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e)
    res.status(500).json({ error: message })
  }
})

// POST /api/task - create a new task
router.post('/', async (req: Request, res: Response) => {
  try {
    const { task } = req.body as { task: string }
    if (!task) {
      res.status(400).json({ error: 'task is required' })
      return
    }
    const con = await getConnection()
    try {
      await con.promises.beginTransaction()
      await con.promises.query(
        'INSERT INTO Task (completed, task) VALUES (0, ?)',
        [task]
      )
      const idResult = await con.promises.query('SELECT SCOPE_IDENTITY() AS _id')
      await con.promises.commit()
      const id = idResult.first?.[0]?._id
      res.json({ data: { _id: id, completed: 0, task } })
    } catch (e) {
      await con.promises.rollback()
      throw e
    } finally {
      await con.promises.close()
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e)
    res.status(500).json({ error: message })
  }
})

// PUT /api/task/:id - update a task
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id!, 10)
    const { completed, task } = req.body as { completed?: number; task?: string }
    const con = await getConnection()
    try {
      if (completed !== undefined) {
        await con.promises.query(
          'UPDATE Task SET completed = ? WHERE _id = ?',
          [completed, id]
        )
      }
      if (task !== undefined) {
        await con.promises.query(
          'UPDATE Task SET task = ? WHERE _id = ?',
          [task, id]
        )
      }
      res.json({ data: { _id: id, completed, task } })
    } finally {
      await con.promises.close()
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e)
    res.status(500).json({ error: message })
  }
})

// DELETE /api/task/:id - delete a task
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id!, 10)
    const con = await getConnection()
    try {
      await con.promises.query('DELETE FROM Task WHERE _id = ?', [id])
      res.json({ data: { _id: id } })
    } finally {
      await con.promises.close()
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e)
    res.status(500).json({ error: message })
  }
})

export default router
