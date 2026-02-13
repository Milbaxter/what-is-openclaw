# Email Export Scripts

## Quick Start

### Export all emails to CSV:

```bash
# Method 1: Using Vercel CLI
vercel logs askopenclaw.com --since=30d | node scripts/export-emails.js > emails.csv

# Method 2: From saved log file
vercel logs askopenclaw.com --since=30d > logs.txt
node scripts/export-emails.js < logs.txt > emails.csv
```

### Import to your email service:

**ConvertKit:**
1. Go to Subscribers → Import
2. Upload `emails.csv`
3. Map "Email" column
4. Done!

**Mailchimp:**
1. Audience → Manage Audience → Import contacts
2. Upload `emails.csv`
3. Map columns
4. Done!

**Resend:**
1. Audiences → Select audience → Import
2. Upload `emails.csv`
3. Done!

## What You Get

The CSV contains:
- **Email** - subscriber email address
- **Timestamp** - when they subscribed
- **Source** - always "askopenclaw.com"
- **IP** - subscriber's IP (for analytics)
- **User Agent** - browser/device info

## Example Output

```csv
Email,Timestamp,Source,IP,User Agent
user@example.com,2026-02-13T20:00:00.000Z,askopenclaw.com,192.168.1.1,Mozilla/5.0...
another@example.com,2026-02-13T21:00:00.000Z,askopenclaw.com,192.168.1.2,Mozilla/5.0...
```

## Automation (Optional)

You can set up a cron job to export weekly:

```bash
#!/bin/bash
# weekly-export.sh

cd /path/to/project
vercel logs askopenclaw.com --since=7d | \
  node scripts/export-emails.js > emails-$(date +%Y-%m-%d).csv
```

## Troubleshooting

**"No emails found"**
- Check that you're looking at the right project
- Try increasing time range: `--since=90d`
- Verify emails were actually captured (check Vercel dashboard)

**"Permission denied"**
- Make sure you're logged in: `vercel login`
- Verify you have access to the project

**Malformed CSV**
- The script automatically handles commas, quotes, and newlines in data
- If issues persist, check the raw log format

## Next Steps

After exporting:
1. Import to your chosen email service
2. Set up welcome email (optional)
3. Update `api/subscribe.js` to send directly to that service
4. Keep this export as backup
