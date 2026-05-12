import { useState, useEffect } from 'react'
import './App.css'

const STORAGE_KEY = 'task-board-tasks'

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function nextId(tasks) {
  return tasks.length === 0 ? 1 : Math.max(...tasks.map(t => t.id)) + 1
}

export default function App() {
  const [tasks, setTasks] = useState(loadTasks)
  const [input, setInput] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  function addTask() {
    const text = input.trim()
    if (!text) return
    setTasks(prev => [...prev, { id: nextId(prev), text, done: false }])
    setInput('')
  }

  function toggleTask(id) {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  function deleteTask(id) {
    setTasks(tasks.filter(t => t.id !== id))
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') addTask()
  }

  return (
    <div className="board">
      <h1>タスクボード</h1>

      <div className="input-row">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="新しいタスクを入力..."
        />
        <button onClick={addTask}>追加</button>
      </div>

      {tasks.length === 0 ? (
        <p className="empty">タスクがありません</p>
      ) : (
        <ul className="task-list">
          {tasks.map(task => (
            <li key={task.id} className={`task-item${task.done ? ' done' : ''}`}>
              <label className="task-label">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                />
                <span className="task-text">{task.text}</span>
              </label>
              <button
                className="delete-btn"
                onClick={() => deleteTask(task.id)}
                aria-label="削除"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
