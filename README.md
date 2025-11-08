# Zendesk Ticket Simulator - Web Interface

A web-based tool for generating simulation tickets in Zendesk sandbox environments. Built with Next.js and TypeScript, designed for easy deployment on Vercel.

## Features

- **Web Interface**: Easy-to-use UI for selecting ticket types and quantities
- **Multiple Ticket Types**: Supports 15 different ticket types (billing pod, enterprise, k1, etc.)
- **Batch Creation**: Generate multiple tickets at once
- **Team Access**: Deploy once, share with your team
- **Secure**: API credentials stored securely in Vercel environment variables

## Local Development

### Prerequisites

- Node.js 18+ installed
- Zendesk API credentials (API key and email address)

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Add your Zendesk credentials to `.env`:**
   ```
   ZD_API_KEY=your_sandbox_api_key
   EMAIL_ADDRESS=your_email@example.com
   SUBDOMAIN=klaviyo
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

### Step 1: Push to GitHub

1. Initialize git repository (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a new repository on GitHub and push:
   ```bash
   git remote add origin https://github.com/your-username/ticket-simulator-web.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub

2. **Click "Add New Project"**

3. **Import your GitHub repository**

4. **Configure Project:**
   - Framework Preset: Next.js (should auto-detect)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. **Add Environment Variables:**
   Click on "Environment Variables" and add:
   - `ZD_API_KEY`: Your Zendesk sandbox API key
   - `EMAIL_ADDRESS`: Your Zendesk email address
   - `SUBDOMAIN`: Your Zendesk subdomain (e.g., "klaviyo")

6. **Click "Deploy"**

7. **Access your app:**
   - Vercel will provide a URL like: `https://ticket-simulator-web-xyz.vercel.app`
   - Share this URL with your team

### Step 3: Team Access

Once deployed, anyone with the URL can use the tool. The API credentials are stored securely on Vercel and never exposed to the browser.

**Optional: Add Authentication**

If you want to restrict access, you can:
- Add Vercel's built-in password protection
- Implement authentication using NextAuth.js
- Use Vercel's IP allowlist feature

## Project Structure

```
ticket-simulator-web/
├── app/
│   ├── api/
│   │   └── create-tickets/
│   │       └── route.ts          # API endpoint for ticket creation
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main UI page
├── lib/
│   └── payloads/                 # Ticket JSON payloads
│       ├── billingpodticketexample.json
│       ├── enterpriseticketexample.json
│       └── ... (15 total)
├── .env.example                  # Environment variables template
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
└── README.md                     # This file
```

## Available Ticket Types

- **Support Pods**: billingpod, devpod, dcpod, marketingstrategypod
- **Tiers**: k1, cnx, enterprise, professional, standard, growth, portfolio
- **Partners**: goldpartner, silverpartner, platinumpartner, elitepartner

## API Endpoint

### POST `/api/create-tickets`

Create tickets in Zendesk.

**Request Body:**
```json
{
  "types": ["billingpod", "enterprise", "k1"],
  "count": 5
}
```

**Response:**
```json
{
  "success": 14,
  "failed": 1,
  "errors": [
    "enterprise #3: HTTP 422: Invalid custom field"
  ]
}
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `ZD_API_KEY` | Zendesk API key | `abc123...` |
| `EMAIL_ADDRESS` | Zendesk user email | `user@example.com` |
| `SUBDOMAIN` | Zendesk subdomain | `klaviyo` |

## Troubleshooting

### "Missing API credentials" error
- Ensure environment variables are set correctly in Vercel
- Check that variable names match exactly: `ZD_API_KEY`, `EMAIL_ADDRESS`, `SUBDOMAIN`
- Redeploy after adding environment variables

### Tickets not created
- Verify API credentials are valid
- Check that you're using sandbox API key (not production)
- Ensure your Zendesk user has permissions to create tickets

### Local development not working
- Make sure `.env` file exists and has correct values
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (should be 18+)

## Security Notes

- **Never commit `.env` file** - it's included in `.gitignore`
- **Use sandbox credentials** - not production API keys
- **Limit API key permissions** - create a dedicated API key with minimal required permissions
- **Consider adding authentication** - if deploying for team use

## Related Projects

This is the web version of the Python CLI tool located at:
- `/Users/pierre.sjogreen/Desktop/Code/zendesk/ticket-simulator/`
- `/Users/pierre.sjogreen/Desktop/Code/support-systems/tools/ticket-simulator/`

## License

Internal tool for Zendesk ticket simulation.
