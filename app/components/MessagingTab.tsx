'use client'

import { useState } from 'react'
import customerTypesData from '../../lib/ada-customer-types.json'

interface CustomerType {
  name: string
  metaFields: Record<string, string>
}

interface Session {
  id: string
  customerKey: string
  customerName: string
}

const customerTypes = customerTypesData as Record<string, CustomerType>

export default function MessagingTab() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [selectedType, setSelectedType] = useState<string>('')
  const [showAddSession, setShowAddSession] = useState(false)

  const addSession = () => {
    if (!selectedType) {
      alert('Please select a customer type first')
      return
    }

    const newSession: Session = {
      id: `session-${Date.now()}`,
      customerKey: selectedType,
      customerName: customerTypes[selectedType].name
    }

    setSessions([...sessions, newSession])
    setSelectedType('')
    setShowAddSession(false)
  }

  const removeSession = (sessionId: string) => {
    setSessions(sessions.filter(s => s.id !== sessionId))
  }

  const openSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId)
    if (!session) return

    const customerType = customerTypes[session.customerKey]
    if (!customerType) return

    // Create HTML content for new window with Ada widget
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>${customerType.name} - Ada Chat</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      background: #000;
      color: #fff;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .info {
      padding: 20px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      margin-bottom: 20px;
    }
    h1 { margin: 0 0 10px 0; font-size: 24px; }
    .meta { opacity: 0.7; font-size: 14px; }
  </style>
</head>
<body>
  <div class="info">
    <h1>${customerType.name}</h1>
    <div class="meta">
      Service Plan: ${customerType.metaFields.service_plan || 'N/A'}<br>
      Email: ${customerType.metaFields.email || 'N/A'}
    </div>
  </div>
  <script>
    window.adaSettings = ${JSON.stringify({ metaFields: customerType.metaFields })};

    // Auto-open the chat widget once it loads
    window.addEventListener('load', function() {
      // Wait for Ada embed to be available
      const checkAdaEmbed = setInterval(function() {
        if (window.adaEmbed && typeof window.adaEmbed.toggle === 'function') {
          clearInterval(checkAdaEmbed);
          // Small delay to ensure widget is fully initialized
          setTimeout(function() {
            window.adaEmbed.toggle();
          }, 500);
        }
      }, 100);

      // Timeout after 10 seconds if Ada doesn't load
      setTimeout(function() {
        clearInterval(checkAdaEmbed);
      }, 10000);
    });
  <\/script>
  <script
    id="__ada"
    data-handle="demo-klaviyo-ai-agent"
    data-domain="ada"
    src="https://static.ada.support/embed2.js"
  ><\/script>
</body>
</html>`

    // Use blob URL approach for security
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const newWindow = window.open(url, '_blank', 'width=500,height=700')

    // Clean up the URL after window loads
    if (newWindow) {
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Active Sessions
            </h2>
            <p className="text-white/60 text-sm mt-1">
              Manage multiple customer messaging sessions
            </p>
          </div>
          <button
            onClick={() => setShowAddSession(!showAddSession)}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl border border-white/20 transition-all"
          >
            + Add Session
          </button>
        </div>

        {/* Add Session Panel */}
        {showAddSession && (
          <div className="mb-6 p-6 bg-white/[0.03] backdrop-blur-xl border border-white/20 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Select Customer Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {Object.entries(customerTypes).map(([key, type]) => (
                <label
                  key={key}
                  className={`flex items-center p-4 bg-white/[0.03] border rounded-xl cursor-pointer transition-all ${
                    selectedType === key
                      ? 'border-white/40 bg-white/[0.08]'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <input
                    type="radio"
                    name="newSessionType"
                    value={key}
                    checked={selectedType === key}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-4 h-4 mr-3 accent-white"
                  />
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">{type.name}</div>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={addSession}
                disabled={!selectedType}
                className="flex-1 bg-white hover:bg-white/90 disabled:bg-white/20 text-black font-bold py-3 rounded-xl transition-all disabled:cursor-not-allowed disabled:text-white/40"
              >
                Add Session
              </button>
              <button
                onClick={() => {
                  setShowAddSession(false)
                  setSelectedType('')
                }}
                className="px-6 bg-white/10 hover:bg-white/20 text-white font-medium py-3 rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Session Cards */}
        {sessions.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-2xl">
            <p className="text-white/50 text-lg">No active sessions</p>
            <p className="text-white/30 text-sm mt-2">Click "Add Session" to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="p-5 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl transition-all hover:border-white/20"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-white font-bold">{session.customerName}</h3>
                  </div>
                  <button
                    onClick={() => removeSession(session.id)}
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                <button
                  onClick={() => openSession(session.id)}
                  className="w-full bg-white hover:bg-white/90 text-black font-medium py-2.5 rounded-lg transition-all text-sm"
                >
                  Open
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
