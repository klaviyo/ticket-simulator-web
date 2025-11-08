import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Mapping of ticket types to their JSON payload filenames
const TICKET_TYPE_TO_FILENAME: Record<string, string> = {
  billingpod: 'billingpodticketexample.json',
  devpod: 'devpodticketexample.json',
  dcpod: 'dcpodticketexample.json',
  marketingstrategypod: 'marketingstrategypodticketexample.json',
  cnx: 'cnxticketexample.json',
  k1: 'k1ticketexample.json',
  enterprise: 'enterpriseticketexample.json',
  professional: 'professionalticketexample.json',
  standard: 'standardticketexample.json',
  growth: 'growthticketexample.json',
  portfolio: 'portfolioticketexample.json',
  goldpartner: 'goldpartnerticketexample.json',
  silverpartner: 'silverpartnerticketexample.json',
  platinumpartner: 'platinumpartnerticketexample.json',
  elitepartner: 'elitepartnerticketexample.json',
}

interface TicketPayload {
  ticket: {
    subject: string
    comment: {
      body: string
    }
    priority?: string
    type?: string
    tags?: string[]
    custom_fields?: Array<{ id: number; value: any }>
  }
}

interface CreateTicketRequest {
  counts: Record<string, number>
}

// Load a ticket payload from the JSON file
function loadPayload(ticketType: string): TicketPayload | null {
  const filename = TICKET_TYPE_TO_FILENAME[ticketType]
  if (!filename) {
    return null
  }

  const payloadPath = path.join(process.cwd(), 'lib', 'payloads', filename)

  try {
    const fileContent = fs.readFileSync(payloadPath, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.error(`Error loading payload for ${ticketType}:`, error)
    return null
  }
}

interface CreatedTicket {
  id: number
  subject: string
  url: string
}

// Create a single ticket via Zendesk API
async function createTicket(
  payload: TicketPayload,
  apiKey: string,
  email: string,
  subdomain: string
): Promise<{ success: boolean; ticket?: CreatedTicket; error?: string }> {
  const url = `https://${subdomain}.zendesk.com/api/v2/tickets.json`

  // Create Basic Auth header
  const auth = Buffer.from(`${email}/token:${apiKey}`).toString('base64')

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        error: `HTTP ${response.status}: ${errorText}`,
      }
    }

    const data = await response.json()
    const ticket = data.ticket

    return {
      success: true,
      ticket: {
        id: ticket.id,
        subject: ticket.subject,
        url: `https://${subdomain}.zendesk.com/agent/tickets/${ticket.id}`,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get environment variables
    const apiKey = process.env.ZD_API_KEY
    const email = process.env.EMAIL_ADDRESS
    const subdomain = process.env.SUBDOMAIN || 'klaviyo'

    if (!apiKey || !email) {
      return NextResponse.json(
        { error: 'Missing API credentials in environment variables' },
        { status: 500 }
      )
    }

    // Parse request body
    const body: CreateTicketRequest = await request.json()
    const { counts } = body

    if (!counts || typeof counts !== 'object') {
      return NextResponse.json(
        { error: 'counts must be an object' },
        { status: 400 }
      )
    }

    // Track results
    let successCount = 0
    let failedCount = 0
    const errors: string[] = []
    const createdTickets: Record<string, CreatedTicket[]> = {}

    // Create tickets for each type with specified count
    for (const [ticketType, count] of Object.entries(counts)) {
      // Skip types with 0 count
      if (count === 0) continue

      // Validate count
      if (count < 0 || count > 100) {
        errors.push(`${ticketType}: count must be between 0 and 100`)
        failedCount += count
        continue
      }

      const payload = loadPayload(ticketType)

      if (!payload) {
        errors.push(`Invalid ticket type: ${ticketType}`)
        failedCount += count
        continue
      }

      // Initialize array for this ticket type
      createdTickets[ticketType] = []

      // Create 'count' tickets of this type
      for (let i = 0; i < count; i++) {
        const result = await createTicket(payload, apiKey, email, subdomain)

        if (result.success && result.ticket) {
          successCount++
          createdTickets[ticketType].push(result.ticket)
        } else {
          failedCount++
          errors.push(`${ticketType} #${i + 1}: ${result.error}`)
        }
      }
    }

    return NextResponse.json({
      success: successCount,
      failed: failedCount,
      errors,
      tickets: createdTickets,
    })
  } catch (error) {
    console.error('Error in create-tickets API:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
