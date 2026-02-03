# NKDDA Website

## Overview
This is the official website for the Nipa-Kutubu District Development Authority (NKDDA), built with **Next.js 14**, **React 18**, **TypeScript**, and **Tailwind CSS**.

## Features
- ✅ Responsive design (mobile-first)
- ✅ Fast performance with Next.js
- ✅ TypeScript for type safety
- ✅ Clean component architecture
- ✅ Tailwind CSS for styling
- ✅ SEO optimized

## Project Structure
```
nkdda-website/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Homepage
│   │   └── globals.css   # Global styles
│   └── components/       # Reusable components
│       ├── Header.tsx
│       ├── Navigation.tsx
│       ├── Hero.tsx
│       ├── Card.tsx
│       └── Footer.tsx
├── public/              # Static assets (add logo/images here)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
└── next.config.js
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Navigate to project directory
cd nkdda-website

# Install dependencies
npm install

# Run development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
```bash
npm run build
npm start
```

## Customization

### Colors
Edit the Tailwind configuration in `tailwind.config.ts`:
- `--nkd-green`: `#0b3d2e`
- `--nkd-light-green`: `#145a32`
- `--nkd-gold`: `#c9a227`
- `--nkd-bg`: `#f4f8f6`

### Logo & Images
Place static assets in `public/images/` and reference them:
```tsx
<img src="/images/nkdda-logo.png" alt="NKDDA Logo" />
```

### Content Updates
Edit the content directly in `src/app/page.tsx` sections for:
- News items
- Leadership info
- Project details
- Contact information

## Deployment

### Docker (Optional)
Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Vercel (Recommended for Next.js)
1. Push code to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Deploy with one click

### Traditional Server
```bash
npm run build
npm start
```

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License
© 2026 Nipa-Kutubu District Development Authority (NKDDA)
