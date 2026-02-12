# JC Tree Service — Call/Text First (Static + Formspree)

## Run locally (Windows 11)
**Python**
```powershell
cd <folder-with-index.html>
python -m http.server 5173
```
Open: http://localhost:5173

**Node**
```powershell
cd <folder-with-index.html>
npx serve .
```

## Formspree setup (so JC gets an email lead)
1) Create a Formspree form and copy the endpoint:
`https://formspree.io/f/XXXXXXX`

2) Edit `main.js`:
```js
const FORM_ENDPOINT = "https://formspree.io/f/XXXXXXX";
```

## Conversion logic (call/text wins)
- Sticky header: tap-to-call
- Mobile floating buttons: Call + Text
- Form: emails lead to JC via Formspree, **then shows a one-tap Text JC button** with the same details prefilled.

## Assets
Put these in `/assets/`:
- `hero.jpg` (recommended 1800×1200)
- `og.jpg`
