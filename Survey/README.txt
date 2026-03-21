
Option 3 - Self-hosted survey with suggestion field

Steps

1 - Create a Google Sheet
- Create a Google Sheet in your Google Drive.
- Add a tab named 'Responses' (exact case). Leave it blank.

2 - Create the backend (Google Apps Script)
- Go to https://script.google.com and create a new project.
- Replace all default code with the contents of 'apps_script.js' from this zip.
- File - Save.
- Click Deploy - New deployment - Web app.
  - Execute as: Me
  - Who has access: Anyone with the link
- Click Deploy and copy the Web app URL.

3 - Edit survey.html
- Open survey.html in a text editor.
- Find the line: const SCRIPT_ENDPOINT = "PASTE_YOUR_WEB_APP_URL_HERE";
- Replace it with the Web app URL from step 2 (keep it in quotes). Save.

4 - Host the HTML on your domain
- Fast path: Netlify Drop - drag and drop survey.html to get a live link.
- Custom subdomain: create survey.yourdomain.com via your DNS provider, then point it to your host (Netlify/Vercel/Cloudflare Pages). Upload survey.html there.

5 - Test it
- Open https://survey.yourdomain.com/survey.html?machine_id=SW-101
- Select up to 5 items, optionally add a suggestion, click Submit.
- Check your 'Responses' sheet for a new row.

6 - QR codes
- Make per-machine links like:
  - https://survey.yourdomain.com/survey.html?machine_id=SW-101
  - https://survey.yourdomain.com/survey.html?machine_id=SW-102
- Use any QR generator and paste each URL. Print as 1 in x 1 in stickers near the payment bezel.

Notes
- The form enforces a max of 5 selections.
- The suggestion field is optional and limited to 240 characters on both frontend and backend.
- A light local-storage cooldown prevents repeat submissions from the same device for 24 hours per machine.
- To change items, edit the ITEMS array in survey.html.

Troubleshooting
- If you see 'Missing machine id' on submit, make sure the URL has ?machine_id=SW-XXX.
- If submissions fail with CORS errors, set ALLOW_ORIGIN in apps_script.js to your exact domain and redeploy the Web app.
- If rows do not appear, confirm that the Web app is deployed as 'Anyone with the link' and that the sheet has a 'Responses' tab.
