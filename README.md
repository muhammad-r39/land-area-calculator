# Bangladesh Land Area Calculator

A small frontend app for Bangladesh land area conversion.

## What it does

- Calculator mode is the default.
- Info mode explains the measurement profiles.
- Results are grouped by measurement system:
  - Standard/common 33-decimal Bigha
  - Regional 30-decimal Bigha
  - 40-decimal Kani
  - 120-decimal Kani
  - 8-hat-nol Kani using 17,280 sq ft
- Uses square feet as the internal base unit.
- Built as a static Vite + React + TypeScript app.

## Why there are multiple answers

Bangladesh land measurement varies by region. For example, some areas use:

- 1 Bigha = 33 Decimal
- 1 Bigha = 30 Decimal

The app intentionally shows grouped results instead of pretending there is only one universal local answer.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## GitHub Pages

This repo includes `.github/workflows/deploy.yml`.

After pushing to GitHub:

1. Go to repository **Settings**
2. Open **Pages**
3. Set source to **GitHub Actions**
4. Push to `main`

The Vite base path is now set for the main site root:

```ts
base: "/"
```

## Data status

The first source set is based on the Ministry of Land PDF copy titled:

`বাংলাদেশ ভূমি পরিমাপের আদর্শ এককসমূহ`

More verified government or official sources can be added later in `src/data/measurementProfiles.ts`.
