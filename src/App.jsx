import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [url, setUrl] = useState('')
  const [interval, setIntervalValue] = useState(15)
  const [running, setRunning] = useState(false)
  const [lastCheck, setLastCheck] = useState(null)
  const [status, setStatus] = useState('Not started')

  useEffect(() => {
    if (!running || !url) return

    const checkUrl = async () => {
      setStatus('Checking...')

      try {
        const response = await fetch(url, {
          method: 'GET',
          mode: 'no-cors',
          cache: 'no-store'
        })

        setStatus('Check completed')
      } catch (error) {
        setStatus('Check failed')
      }

      setLastCheck(new Date().toLocaleString())
    }

    checkUrl()

    const timer = setInterval(checkUrl, interval * 60 * 1000)

    return () => clearInterval(timer)
  }, [running, url, interval])

  const startMonitoring = () => {
    if (!url.trim()) {
      setStatus('Please enter a URL')
      return
    }

    setRunning(true)
    setStatus('Monitoring started')
  }

  const stopMonitoring = () => {
    setRunning(false)
    setStatus('Monitoring stopped')
  }

  return (
    <div className="app">
      <div className="card">
        <h1>URL Monitor</h1>
        <p className="subtitle">Website & API monitoring</p>

        <label>Website / API URL</label>
        <input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <label>Check interval</label>
        <select
          value={interval}
          onChange={(e) => setIntervalValue(Number(e.target.value))}
          disabled={running}
        >
          <option value="10">Every 10 minutes</option>
          <option value="15">Every 15 minutes</option>
          <option value="30">Every 30 minutes</option>
          <option value="60">Every 60 minutes</option>
        </select>

        {!running ? (
          <button onClick={startMonitoring}>Start Monitoring</button>
        ) : (
          <button className="stop" onClick={stopMonitoring}>
            Stop Monitoring
          </button>
        )}

        <div className="status">
          <strong>Status:</strong> {status}
        </div>

        {lastCheck && (
          <div className="last">
            Last check: {lastCheck}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
