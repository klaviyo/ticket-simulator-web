'use client'

import { useState } from 'react'

const TICKET_TYPES = [
  { id: 'billingpod', label: 'Billing Pod' },
  { id: 'devpod', label: 'Dev Pod' },
  { id: 'dcpod', label: 'DC Pod' },
  { id: 'marketingstrategypod', label: 'Marketing Strategy Pod' },
  { id: 'cnx', label: 'CNX' },
  { id: 'k1', label: 'K1' },
  { id: 'enterprise', label: 'Enterprise' },
  { id: 'professional', label: 'Professional' },
  { id: 'standard', label: 'Standard' },
  { id: 'growth', label: 'Growth' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'goldpartner', label: 'Gold Partner' },
  { id: 'silverpartner', label: 'Silver Partner' },
  { id: 'platinumpartner', label: 'Platinum Partner' },
  { id: 'elitepartner', label: 'Elite Partner' },
]

export default function EmailTab() {
  const [ticketCounts, setTicketCounts] = useState<Record<string, number | ''>>(
    Object.fromEntries(TICKET_TYPES.map(t => [t.id, '']))
  )
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<{
    success: number
    failed: number
    errors: string[]
    tickets: Record<string, Array<{ id: number; subject: string; url: string }>>
  } | null>(null)

  const updateCount = (typeId: string, value: string) => {
    if (value === '') {
      setTicketCounts(prev => ({ ...prev, [typeId]: '' }))
    } else {
      const numValue = parseInt(value)
      if (!isNaN(numValue)) {
        setTicketCounts(prev => ({
          ...prev,
          [typeId]: Math.max(0, Math.min(100, numValue))
        }))
      }
    }
  }

  const setAllCounts = (value: number) => {
    setTicketCounts(Object.fromEntries(TICKET_TYPES.map(t => [t.id, value])))
  }

  const clearAll = () => {
    setTicketCounts(Object.fromEntries(TICKET_TYPES.map(t => [t.id, ''])))
  }

  const totalTickets = Object.values(ticketCounts).reduce((sum, count) => sum + (typeof count === 'number' ? count : 0), 0)

  const getTicketTypeLabel = (typeId: string) => {
    return TICKET_TYPES.find(t => t.id === typeId)?.label || typeId
  }

  const handleGenerate = async () => {
    if (totalTickets === 0) {
      alert('Please enter at least one ticket to generate')
      return
    }

    if (totalTickets > 50) {
      alert('Maximum 50 tickets allowed per generation')
      return
    }

    setLoading(true)
    setResults(null)

    try {
      const countsForAPI = Object.fromEntries(
        Object.entries(ticketCounts).map(([key, value]) => [
          key,
          typeof value === 'number' ? value : 0
        ])
      )

      const response = await fetch('/api/create-tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          counts: countsForAPI,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create tickets')
      }

      setResults(data)
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Ticket Type Counts */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <label className="text-2xl font-bold text-white">
            Ticket Counts by Type
          </label>
          <div className="space-x-3 flex items-center">
            <button
              onClick={() => setAllCounts(1)}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              Set All to 1
            </button>
            <span className="text-white/20">|</span>
            <button
              onClick={() => setAllCounts(5)}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              Set All to 5
            </button>
            <span className="text-white/20">|</span>
            <button
              onClick={clearAll}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TICKET_TYPES.map(type => (
            <div
              key={type.id}
              className="flex items-center justify-between p-5 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/[0.05] hover:border-white/20 hover:shadow-[0_8px_16px_0_rgba(255,255,255,0.1)] transition-all duration-300"
            >
              <label className="text-sm font-medium text-white flex-1">
                {type.label}
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={ticketCounts[type.id]}
                onChange={e => updateCount(type.id, e.target.value)}
                className="w-20 px-3 py-2 bg-black/60 border border-white/20 rounded-xl focus:ring-2 focus:ring-white/40 focus:border-white/40 text-white text-center placeholder-white/30 transition-all shadow-inner"
              />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-white/50">
            Total tickets to generate: <span className={`font-bold text-2xl ${totalTickets > 50 ? 'text-white/40' : 'text-white'}`}>{totalTickets}</span>
            <span className="text-white/40"> / 50</span>
          </p>
          {totalTickets > 50 && (
            <div className="mt-4 p-4 bg-white/[0.05] border border-white/20 rounded-xl">
              <p className="text-white/80 text-sm flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Maximum 50 tickets allowed per generation
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading || totalTickets === 0 || totalTickets > 50}
        className="w-full bg-white hover:bg-white/90 disabled:bg-white/20 text-black font-bold py-5 px-6 rounded-2xl shadow-[0_8px_32px_0_rgba(255,255,255,0.3)] hover:shadow-[0_12px_40px_0_rgba(255,255,255,0.4)] transition-all duration-300 disabled:cursor-not-allowed disabled:text-white/40"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-lg">Generating Tickets...</span>
          </span>
        ) : <span className="text-lg">Generate Tickets</span>}
      </button>

      {/* Results */}
      {results && (
        <div className="mt-8 p-8 bg-white/[0.03] backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]">
          <h3 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Generation Complete
          </h3>
          <p className="text-white/70 mb-8 text-lg">
            Successfully created: <span className="font-bold text-white text-xl">{results.success}</span> tickets
          </p>

          {Object.keys(results.tickets).length > 0 && (
            <div className="space-y-5">
              {Object.entries(results.tickets).map(([typeId, tickets]) => (
                <div key={typeId} className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h4 className="font-bold text-white mb-4 text-lg">
                    {getTicketTypeLabel(typeId)} <span className="text-white/50 font-normal">({tickets.length} {tickets.length === 1 ? 'ticket' : 'tickets'})</span>
                  </h4>
                  <div className="space-y-3">
                    {tickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="flex flex-col gap-2 p-4 bg-white/[0.02] backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-200"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-sm text-white font-medium flex-1">
                            {ticket.subject}
                          </span>
                          <span className="text-xs text-white/60 font-mono whitespace-nowrap bg-white/10 px-3 py-1.5 rounded-lg">
                            #{ticket.id}
                          </span>
                        </div>
                        <a
                          href={ticket.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-white/70 hover:text-white hover:underline transition-colors flex items-center gap-1.5"
                        >
                          View in Zendesk
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {results.failed > 0 && (
            <div className="mt-6 p-5 bg-white/[0.03] backdrop-blur-sm border border-white/20 rounded-2xl">
              <p className="text-white font-bold mb-3 flex items-center gap-2 text-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Failed: {results.failed} tickets
              </p>
              {results.errors.length > 0 && (
                <ul className="text-sm text-white/60 list-disc list-inside space-y-1.5 ml-8">
                  {results.errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
