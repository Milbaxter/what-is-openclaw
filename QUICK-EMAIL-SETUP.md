# Quick Email Setup — Follow Along

## ConvertKit Setup (5 minutes)

### 1. Create Account
→ Go to: https://convertkit.com/pricing (Free plan)
→ Sign up with your email
→ Skip the onboarding wizard (click "I'll do this later")

### 2. Create a Form
→ Click "Grow" in sidebar
→ Click "Landing Pages & Forms"
→ Click "Create New" → "Form"
→ Choose any template (doesn't matter, we're using API only)
→ Name it: "askopenclaw.com newsletter"
→ Click "Save"

### 3. Get Your Form ID
→ You'll see the form editor
→ Look at the URL: `https://app.convertkit.com/forms/designers/XXXXXXX/edit`
→ That number (XXXXXXX) is your **Form ID**
→ Copy it somewhere

### 4. Get Your API Key
→ Click your profile picture (top right)
→ Click "Settings"
→ Click "Advanced" in left sidebar
→ Scroll down to "API Secret"
→ Click "Show" then copy the key
→ It looks like: `secret_ABC123XYZ...`

### 5. Add to Vercel

I'll help you add these to Vercel next!

---

## Alternative: Resend (For Developers)

If you prefer Resend instead:

### 1. Create Account
→ Go to: https://resend.com/signup
→ Sign up (free tier: 3,000 emails/month)

### 2. Get API Key
→ Dashboard → API Keys
→ Click "Create API Key"
→ Name it: "askopenclaw.com"
→ Copy the key (starts with `re_`)

### 3. Create Audience
→ Click "Audiences"
→ Click "Create Audience"
→ Name it: "askopenclaw Newsletter"
→ Copy the Audience ID

### 4. Install Package
We'll need to run:
```bash
cd /home/moltbot/clawd/what-is-openclaw
npm install resend
```

Then add credentials to Vercel.

---

## Which One?

**ConvertKit:** Better for creating email sequences, automations, newsletters
**Resend:** Better for transactional emails, developer experience, modern API

For capturing newsletter signups → **ConvertKit is easier**

Let me know which you want to use and I'll help you add the credentials to Vercel!
