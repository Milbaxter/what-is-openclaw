export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    // Basic email validation
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' });
    }

    const emailLower = email.toLowerCase().trim();

    // TODO: Choose your email service provider and uncomment the relevant section below

    // ===== OPTION 1: ConvertKit (Recommended) =====
    // const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
    // const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID;
    // 
    // const response = await fetch(`https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     api_key: CONVERTKIT_API_KEY,
    //     email: emailLower
    //   })
    // });
    // 
    // if (!response.ok) {
    //   throw new Error('ConvertKit API error');
    // }

    // ===== OPTION 2: Resend (Modern, developer-friendly) =====
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // 
    // await resend.contacts.create({
    //   email: emailLower,
    //   audienceId: process.env.RESEND_AUDIENCE_ID
    // });

    // ===== OPTION 3: Mailchimp =====
    // const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
    // const MAILCHIMP_SERVER = process.env.MAILCHIMP_SERVER; // e.g., 'us1'
    // const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;
    // 
    // const response = await fetch(
    //   `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`,
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${MAILCHIMP_API_KEY}`
    //     },
    //     body: JSON.stringify({
    //       email_address: emailLower,
    //       status: 'subscribed'
    //     })
    //   }
    // );
    // 
    // if (!response.ok) {
    //   const error = await response.json();
    //   if (error.title === 'Member Exists') {
    //     return res.status(200).json({ success: true, message: 'Already subscribed' });
    //   }
    //   throw new Error('Mailchimp API error');
    // }

    // ===== FILE STORAGE: Save to emails.json =====
    // NOTE: Vercel serverless functions can't write to local files.
    // Using structured logging instead - emails can be exported from Vercel logs
    
    const timestamp = new Date().toISOString();
    const emailData = {
      email: emailLower,
      timestamp,
      source: 'askopenclaw.com',
      userAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
    };
    
    // Structured log for easy parsing/export from Vercel
    console.log('EMAIL_SUBSCRIPTION:', JSON.stringify(emailData));
    
    // Also log in human-readable format
    console.log(`📧 New subscriber: ${emailLower} at ${timestamp}`);
    
    return res.status(200).json({ 
      success: true,
      message: 'Subscribed successfully'
    });

  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ 
      error: 'Failed to subscribe. Please try again.' 
    });
  }
}
