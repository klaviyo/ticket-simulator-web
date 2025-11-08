'use client'

import { useState, useEffect } from 'react'
import EmailTab from './components/EmailTab'
import MessagingTab from './components/MessagingTab'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [activeTab, setActiveTab] = useState<'email' | 'messaging'>('email')

  // Check if already authenticated on mount
  useEffect(() => {
    const authenticated = localStorage.getItem('ts_authenticated')
    if (authenticated === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const correctPassword = process.env.NEXT_PUBLIC_ACCESS_PASSWORD

    if (passwordInput === correctPassword) {
      setIsAuthenticated(true)
      localStorage.setItem('ts_authenticated', 'true')
      setPasswordError(false)
    } else {
      setPasswordError(true)
      setPasswordInput('')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('ts_authenticated')
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white/[0.05] backdrop-blur-3xl rounded-3xl shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] border border-white/10 p-10">
          <h1 className="text-4xl font-bold mb-3 text-white text-center">
            Zendesk Ticket Simulator
          </h1>
          <p className="text-white/60 mb-8 text-center">
            Enter password to access
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 bg-black/60 border border-white/20 rounded-xl focus:ring-2 focus:ring-white/40 focus:border-white/40 text-white text-center placeholder-white/30 transition-all shadow-inner"
                autoFocus
              />
              {passwordError && (
                <p className="text-white/70 text-sm mt-3 text-center">
                  Incorrect password. Please try again.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-white hover:bg-white/90 text-black font-bold py-4 px-6 rounded-2xl shadow-[0_8px_32px_0_rgba(255,255,255,0.3)] hover:shadow-[0_12px_40px_0_rgba(255,255,255,0.4)] transition-all duration-300"
            >
              Access
            </button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-3xl rounded-3xl shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] border border-white/10 p-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold mb-3 text-white tracking-tight">
              Zendesk Simulator
            </h1>
            <p className="text-white/60 text-lg">
              Simulate email tickets and messaging interactions
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-white/50 hover:text-white transition-colors px-4 py-2 border border-white/20 rounded-xl hover:border-white/40"
          >
            Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-8 border-b border-white/10">
          <button
            onClick={() => setActiveTab('email')}
            className={`px-6 py-3 font-semibold transition-all duration-200 ${
              activeTab === 'email'
                ? 'text-white border-b-2 border-white'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            Email
          </button>
          <button
            onClick={() => setActiveTab('messaging')}
            className={`px-6 py-3 font-semibold transition-all duration-200 ${
              activeTab === 'messaging'
                ? 'text-white border-b-2 border-white'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            Messaging
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'email' && <EmailTab />}
          {activeTab === 'messaging' && <MessagingTab />}
        </div>
      </div>
    </main>
  )
}
