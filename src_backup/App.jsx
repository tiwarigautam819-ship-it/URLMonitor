import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [url, setUrl] = useState('')
  const [interval, setIntervalValue] = useState(15)
  const [running, setRunning] = useState(false)
  const [lastCheck, setLastCheck] = useState(null)
  const [status, setStatus] = useState('Not started')

  useEffect(() => {
    if (!running || !url.trim()) return

    const checkUrl = async () => {
      setStatus('Checking...')

      try {
        await fetch(url.trim(), {
          method: 'GET',
          mode: 'no-cors',
          cache: 'no-store'
        })

        setStatus('Website checked')
      } catch {
        setStatus('Check failed')
      }

      setLastCheck(new Date().toLocaleString())
    }

    checkUrl()

    const timer = setInterval(
      checkUrl,
      interval * 60 * 1000
    )

    return () => clearInterval(timer)
  }, [running, url, interval])

  const startMonitoring = () => {
    const cleanUrl = url.trim()

    if (!cleanUrl) {
      setStatus('Please enter a URL')
      return
    }

    setUrl(cleanUrl)
    setRunning(true)
    setStatus('Monitoring started')
  }

  const stopMonitoring = () => {
    setRunning(false)
    setStatus('Monitoring stopped')
  }

  return (
    <div className="app">

      <header className="topbar">
        <div className="logo">U</div>

        <div>
          <h1>URL Monitor</h1>
          <p>Website & API Monitor</p>
        </div>
      </header>

      <main className="card">

        <div className="welcome">
          <h2>Monitor your URL</h2>
          <p>
            Check your website automatically at your selected interval.
          </p>
        </div>

        <label>Website / API URL</label>

        <div className="urlBox">
          <span>🔗</span>

          <input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            autoComplete="off"
            spellCheck="false"
          />
        </div>

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
          <button onClick={startMonitoring}>
            ▶ Start Monitoring
          </button>
        ) : (
          <button className="stop" onClick={stopMonitoring}>
            ■ Stop Monitoring
          </button>
        )}

        <div className="statusCard">
          <div className="statusDot"></div>

          <div>
            <small>Status</small>
            <strong>{status}</strong>
          </div>
        </div>

        {lastCheck && (
          <div className="lastCheck">
            Last check: {lastCheck}
          </div>
        )}

      </main>

      <footer>
        © Gautam Tiwari from Nexora ❤️‍🩹
      </footer>

    </div>
  )
}

export default App
