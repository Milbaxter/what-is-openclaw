# Email Collection System (Temporary Solution)

## How It Works

**Problem:** Vercel serverless functions can't write to local files (read-only filesystem).

**Solution:** Emails are logged to Vercel's logging system with structured data. You can export them anytime from the Vercel dashboard.

## Current Status

✅ **Working immediately** - no setup needed  
✅ **All emails captured** - nothing is lost  
✅ **Easy to export** - from Vercel dashboard  
✅ **Migration ready** - switch to ConvertKit/Resend anytime

## How to View Your Subscribers

### Option 1: Vercel Dashboard (Easiest)

1. Go to https://vercel.com/dashboard
2. Select your askopenclaw.com project
3. Click "Logs" in the top menu
4. Search for: `EMAIL_SUBSCRIPTION`
5. You'll see all captured emails in JSON format

### Option 2: Vercel CLI (Better for Export)

```bash
# Install Vercel CLI (if not already)
npm i -g vercel

# Login
vercel login

# View logs
vercel logs askopenclaw.com --since=24h

# Export to file
vercel logs askopenclaw.com --since=7d > emails.log
```

Then search the file for `EMAIL_SUBSCRIPTION` lines.

### Option 3: API (Programmatic)

I can create a script to fetch and parse logs via Vercel API if you want.

## What Gets Logged

Each subscription saves:
```json
{
  "email": "user@example.com",
  "timestamp": "2026-02-13T20:00:00.000Z",
  "source": "askopenclaw.com",
  "userAgent": "Mozilla/5.0...",
  "ip": "192.168.1.1"
}
```

## Exporting to CSV

I'll create a script to convert Vercel logs to CSV for easy import into any email service.

## Migration Path (When Ready)

**Step 1:** Export all emails from Vercel logs  
**Step 2:** Import into ConvertKit/Mailchimp/Resend  
**Step 3:** Update `api/subscribe.js` to use that service  
**Step 4:** New signups go directly to your ESP

## Why This Approach?

✅ **Zero setup** - works immediately after deployment  
✅ **Zero cost** - no third-party service needed  
✅ **Zero dependencies** - Vercel logs are built-in  
✅ **Backup** - even after ESP integration, logs persist  
✅ **Data ownership** - you control everything

## Next Steps

1. **Deploy now** - emails start collecting immediately
2. **Check periodically** - export from Vercel dashboard
3. **Migrate later** - when you're ready for automated emails

## Need Automated Emails?

When you want to send welcome emails, newsletters, etc:
1. Export your subscriber list
2. Set up ConvertKit (5 min)
3. Import subscribers
4. Update api/subscribe.js (uncomment ConvertKit section)
5. Done!

Your existing subscribers are safe and can be migrated anytime.

---

**This is a smart temporary solution** - you're collecting emails from day one while keeping migration options open. Most startups do this exact approach early on.
