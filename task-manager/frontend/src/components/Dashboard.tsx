import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'https://task-manager-xfg7.onrender.com/'

interface Task {
  id: number
  title: string
  description: string
  priority: string
  status: string
  due_date: string | null
  created_at: string
}

interface DashboardProps {
  token: string
  onLogout: () => void
}

type Filter = 'all' | 'pending' | 'completed'

export default function Dashboard({ token, onLogout }: DashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editPriority, setEditPriority] = useState('')
  const [editDueDate, setEditDueDate] = useState('')
  const [loading, setLoading] = useState(true)

  const headers = { Authorization: `Bearer ${token}` }

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API}/tasks`, { headers })
      setTasks(res.data)
    } catch {
      onLogout()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTasks() }, [])

  const createTask = async () => {
    if (!title.trim()) return
    setError('')
    try {
      await axios.post(`${API}/tasks`, {
        title, description, priority,
        due_date: dueDate || null
      }, { headers })
      setTitle('')
      setDescription('')
      setPriority('medium')
      setDueDate('')
      fetchTasks()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create task')
    }
  }

  const deleteTask = async (id: number) => {
    try {
      await axios.delete(`${API}/tasks/${id}`, { headers })
      fetchTasks()
    } catch {
      setError('Failed to delete task')
    }
  }

  const toggleComplete = async (task: Task) => {
    try {
      await axios.patch(`${API}/tasks/${task.id}`, {
        status: task.status === 'completed' ? 'pending' : 'completed'
      }, { headers })
      fetchTasks()
    } catch {
      setError('Failed to update task')
    }
  }

  const startEdit = (task: Task) => {
    setEditingId(task.id)
    setEditTitle(task.title)
    setEditDescription(task.description || '')
    setEditPriority(task.priority)
    setEditDueDate(task.due_date ? task.due_date.split('T')[0] : '')
  }

  const saveEdit = async (id: number) => {
    try {
      await axios.patch(`${API}/tasks/${id}`, {
        title: editTitle,
        description: editDescription,
        priority: editPriority,
        due_date: editDueDate || null
      }, { headers })
      setEditingId(null)
      fetchTasks()
    } catch {
      setError('Failed to update task')
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    return task.status === filter
  })

  const pending = tasks.filter(t => t.status === 'pending').length
  const completed = tasks.filter(t => t.status === 'completed').length

  const priorityColor: Record<string, string> = {
    high: 'bg-red-50 text-red-600 border-red-100',
    medium: 'bg-amber-50 text-amber-600 border-amber-100',
    low: 'bg-green-50 text-green-600 border-green-100',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">T</span>
            </div>
            <span className="font-semibold text-gray-900">Taskr</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400">{pending} pending · {completed} done</span>
            <button
              onClick={onLogout}
              className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-sm text-gray-400 mt-0.5">Track and manage everything in one place</p>
        </div>

        {/* New task form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Add a task</p>
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2.5 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && createTask()}
            placeholder="What needs to be done?"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Add a description (optional)"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={priority}
              onChange={e => setPriority(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <button
              onClick={createTask}
              className="flex-1 bg-gray-900 text-white py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition"
            >
              Add task
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4">
          {(['all', 'pending', 'completed'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-4 py-1.5 rounded-full border transition font-medium ${
                filter === f
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Task list */}
        <div className="space-y-2">
          {loading && (
            <div className="text-center py-16">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            </div>
          )}

          {!loading && filteredTasks.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-gray-400 text-lg">✓</span>
              </div>
              <p className="text-sm font-medium text-gray-500">No {filter === 'all' ? '' : filter} tasks</p>
              <p className="text-xs text-gray-400 mt-1">{filter === 'all' ? 'Add a task above to get started' : ''}</p>
            </div>
          )}

          {filteredTasks.map(task => (
            <div
              key={task.id}
              className={`bg-white rounded-2xl border p-4 transition-all ${
                task.status === 'completed'
                  ? 'border-gray-100 opacity-50'
                  : 'border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200'
              }`}
            >
              {editingId === task.id ? (
                <div className="space-y-2">
                  <input
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    value={editDescription}
                    onChange={e => setEditDescription(e.target.value)}
                    placeholder="Description"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <select
                      value={editPriority}
                      onChange={e => setEditPriority(e.target.value)}
                      className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none bg-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    <input
                      type="date"
                      value={editDueDate}
                      onChange={e => setEditDueDate(e.target.value)}
                      className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                    />
                    <button
                      onClick={() => saveEdit(task.id)}
                      className="flex-1 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleComplete(task)}
                    className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                      task.status === 'completed'
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {task.status === 'completed' && (
                      <span className="text-white text-xs">✓</span>
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className={`text-sm font-medium ${
                        task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${priorityColor[task.priority]}`}>
                        {task.priority}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-xs text-gray-400 mb-1">{task.description}</p>
                    )}
                    {task.due_date && (
                      <p className="text-xs text-gray-400">
                        Due {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => startEdit(task)}
                      className="text-xs text-gray-400 hover:text-blue-500 transition px-2 py-1 rounded-lg hover:bg-blue-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-xs text-gray-400 hover:text-red-500 transition px-2 py-1 rounded-lg hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}