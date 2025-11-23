## External Demo Website (Project Docs)

### What this app does

- Example site used to simulate real websites that submit leads to the backend.
- Includes a lightweight embed script `leads-embed.js` that captures form submissions and posts them to the backend `POST /leads/collect` endpoint.

### System requirements

- Node.js 18+
- pnpm 8+

### Setup

```bash
pnpm install
```

### Run

```bash
pnpm run dev
```

### Using the embed script

Add the script to your site and initialize:

```html
<script src="/leads-embed.js"></script>
<script>
  LeadTracker.init({
    endpoint: 'http://localhost:3000/api/leads/collect',
    websiteId: 'WEBSITE_ID',
    secretKey: 'SECRET_KEY',
    // optional
    formName: 'contact',
    trackAllForms: true, // or set formSelector: 'form[data-lead-form]'
    debug: true
  })
</script>
```

The script collects all form fields, adds basic page metadata, and sends the payload to the backend.

---
