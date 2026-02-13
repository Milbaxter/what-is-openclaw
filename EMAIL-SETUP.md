# Email Capture Setup Guide

Email capture has been added to askopenclaw.com. Here's how to complete the setup:

## What Was Added

1. **Frontend (public/index.html)**
   - Email capture section between bottom CTA and footer
   - Clean, responsive form design
   - Success/error message handling
   - Analytics tracking (if GA is configured)

2. **Backend (api/subscribe.js)**
   - Vercel serverless function endpoint
   - Email validation
   - Ready to connect to email service provider

## How to Complete Setup

### Step 1: Choose Your Email Service Provider

Three recommended options are pre-configured in `api/subscribe.js`:

#### Option A: ConvertKit (Recommended for creators)
- **Why:** Free up to 1,000 subscribers, easy automation builder
- **Cost:** Free tier available
- **Setup:**
  1. Create ConvertKit account: https://convertkit.com
  2. Create a new form
  3. Get your API key from Settings → Advanced
  4. Get your Form ID from the form settings
  5. Add environment variables to Vercel:
     ```
     CONVERTKIT_API_KEY=your_api_key
     CONVERTKIT_FORM_ID=your_form_id
     ```
  6. Uncomment ConvertKit section in `api/subscribe.js`

#### Option B: Resend (Recommended for developers)
- **Why:** Modern API, beautiful emails, affordable
- **Cost:** Free tier: 3,000 emails/month
- **Setup:**
  1. Create Resend account: https://resend.com
  2. Get API key from dashboard
  3. Create an audience
  4. Add environment variables to Vercel:
     ```
     RESEND_API_KEY=your_api_key
     RESEND_AUDIENCE_ID=your_audience_id
     ```
  5. Install dependency: `npm install resend`
  6. Uncomment Resend section in `api/subscribe.js`

#### Option C: Mailchimp (Most popular)
- **Why:** Everyone knows it, lots of templates
- **Cost:** Free up to 500 contacts
- **Setup:**
  1. Create Mailchimp account: https://mailchimp.com
  2. Create an audience/list
  3. Get API key from Account → Extras → API keys
  4. Get server prefix from URL (e.g., "us1" from us1.admin.mailchimp.com)
  5. Get List ID from Audience → Settings → Audience name and defaults
  6. Add environment variables to Vercel:
     ```
     MAILCHIMP_API_KEY=your_api_key
     MAILCHIMP_SERVER=us1
     MAILCHIMP_LIST_ID=your_list_id
     ```
  7. Uncomment Mailchimp section in `api/subscribe.js`

### Step 2: Add Environment Variables to Vercel

1. Go to your Vercel dashboard
2. Select the askopenclaw.com project
3. Go to Settings → Environment Variables
4. Add the variables for your chosen provider
5. Redeploy the site

### Step 3: Test the Integration

1. Visit askopenclaw.com
2. Scroll to the email capture form
3. Enter your email and click Subscribe
4. Check your email service provider to confirm the email was captured

## Current Status

**Frontend:** ✅ Complete and deployed  
**Backend:** 🟡 Endpoint ready, needs ESP configuration  
**Testing:** ⚠️ Currently logs to console only (safe for testing)

## Next Steps

1. Choose email provider (ConvertKit recommended)
2. Create account and get credentials
3. Add environment variables to Vercel
4. Uncomment relevant section in `api/subscribe.js`
5. Test the integration
6. (Optional) Set up welcome email in your ESP
7. (Optional) Create email nurture sequence

## Future Enhancements

Once email capture is working, consider:

- **Welcome email:** Thank subscribers and set expectations
- **Lead magnet:** Offer "OpenClaw Deployment Checklist" PDF
- **Segmentation:** Tag subscribers by interest (deployment, security, etc.)
- **Nurture sequence:** Send valuable content over time
- **Re-engagement:** Email when knowledge base is updated

## Design Notes

The email capture form matches the site's existing design:
- Uses same color palette (primary orange)
- Responsive (stacks vertically on mobile)
- Accessible (proper ARIA labels, keyboard navigation)
- Subtle gradient background to differentiate from other sections

## Analytics

If Google Analytics is configured, email signups are tracked as:
- Event: `email_capture`
- Category: `engagement`
- Label: `newsletter_signup`

## Troubleshooting

**Form not submitting:**
- Check browser console for errors
- Verify API endpoint is accessible at `/api/subscribe`
- Check Vercel function logs

**Emails not appearing in ESP:**
- Verify environment variables are set correctly
- Check ESP API key permissions
- Review Vercel function logs for errors
- Test API endpoint directly with curl

**Double subscriptions:**
- Most ESPs handle this automatically (no duplicates)
- ConvertKit and Mailchimp will update existing subscribers

## Questions?

Email: maximilian.rehn@gmail.com
