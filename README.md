# Bessich Distributors — B2B Wholesale Beverage & Distribution Platform

A high-performance B2B wholesale beverage procurement and distribution portal designed for licensed Kenyan hospitality venues, hotels, lounges, bars, supermarkets, and corporate establishments.

This platform features **Real-Time Catalog Synchronization with The Bar Kenya** ([Cyden General Enterprises - Rupa Mall, Eldoret / Outlet #44](https://ke.thebar.com/outlets/Cyden-General-Enterprises-Rupa-Mall/44)), delivering live SKU pricing, exact authentic bottle photography, dynamic inventory mirroring, high-speed matrix ordering, B2B credit facilities, and instant multi-channel dispatch.

---

## 📖 Table of Contents
1. [System Architecture](#-system-architecture)
2. [How the Live Outlet Synchronization Works](#-how-the-live-outlet-synchronization-works)
3. [Cryptographic Protocol & Security](#-cryptographic-protocol--security)
4. [High-Performance Image Proxy & Asset Delivery](#-high-performance-image-proxy--asset-delivery)
5. [Key Modules & Platform Features](#-key-modules--platform-features)
6. [Wholesale Business & Pricing Logic](#-wholesale-business--pricing-logic)
7. [Project Directory Structure](#-project-directory-structure)
8. [Backend API Reference](#-backend-api-reference)
9. [Development & Deployment Guide](#-development--deployment-guide)

---

## 🏗️ System Architecture

The application is architected as a full-stack **TypeScript** solution combining an **Express.js API & Proxy server** with a **Vite + React 18 frontend** styled using **Tailwind CSS**:

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │        Source: The Bar Kenya (ke.thebar.com / Agiza Business API)      │
 │        Outlet: Cyden General Enterprises - Rupa Mall (Outlet #44)      │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
                 Signed HMAC-SHA512 & AES-256-CBC Decrypted Stream
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │                 Express Backend Server (server.ts / Node.js)           │
 │  • Outlet 44 Sync Engine: HMAC-SHA512 request signing & AES decryption │
 │  • Real-Time Image Proxy: bypasses CORS & iframe referer restrictions  │
 │  • In-Memory 60-Second Cache + Fast Recovery Fallback                  │
 │  • Unified Product Normalization, ABV%, and Case Configuration         │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │ JSON API (/api/catalog/sync)
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │            React 18 Frontend (Vite + TypeScript + Tailwind)            │
 │  • Automatic Silent Polling (every 3 mins) & On-Mount Sync             │
 │  • Fast Matrix Bulk Order Pad with real-time tier calculation          │
 │  • B2B Accounts, Credit Limit Tracker & Commercial Invoicing           │
 │  • WhatsApp & PDF Order Dispatch Engine                                │
 └────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 How the Live Outlet Synchronization Works

The catalog is sourced directly from **The Bar Kenya's** official outlet at **Cyden General Enterprises - Rupa Mall, Eldoret** (`Outlet ID: 44`).

### Sync Workflow:

1. **Scheduled or On-Demand Request:**  
   When the user opens the app, when background polling triggers (every 3 minutes), or when the user clicks **"Live Sync"**, the client calls `GET /api/catalog/sync` on our Express server.

2. **Cryptographic Outlet Handshake:**  
   The backend generates a high-entropy millisecond timestamp and random nonce, builds an HMAC-SHA512 signature using the verified Agiza signing key, and issues a secure `GET` request to:
   ```
   https://ke-thebar-business.agiza.io/api/v1/outlets/44/products
   ```

3. **Encrypted Payload Decryption:**  
   The endpoint returns a security payload containing an AES-256-CBC ciphertext. The backend decrypts this block using the outlet encryption key and IV, yielding the raw JSON product array (over 220+ live Diageo/EABL SKUs).

4. **Product Normalization & B2B Enrichment:**  
   Each outlet record is transformed into a standardized wholesale product model:
   - **SKU & Identifiers:** Formatted with standard Kenyan distributor codes (`CYD-44-xxx`).
   - **Category Categorization:** Automatically maps items to Spirits (Whiskey, Gin, Vodka, Rum, Brandy/Cognac, Tequila, Liqueurs), Beer & Cider, and Wine/Champagne.
   - **Exact Bottle Photography:** Retains the high-resolution bottle photography hosted on Agiza's AWS S3 bucket (`s3.eu-west-1.amazonaws.com`).
   - **Case Packing:** Calculates standard case pack configurations (12 btls/case for spirits; 24 btls/crate for beers & ciders; 6 btls/case for wines & champagnes).
   - **Commercial Wholesale Pricing:** Parses the outlet's retail price (RRP) and generates commercial wholesale bottle prices, case prices, and volume discount tiers.
   - **KRA Stamp Verification:** Flags genuine direct-importer inventory carrying Kenya Revenue Authority (KRA) digital excise tax stamps.

5. **Multi-Level Reliability:**
   - **In-Memory Cache:** 60-second TTL prevents rate limiting while serving instantaneous responses.
   - **Local Storage:** The browser preserves the latest synchronized catalog in `localStorage`. If offline, the client continues operating smoothly without interrupting orders.
   - **Static Baseline Fallback:** Pre-compiled baseline of the outlet's catalog (`src/data/products.ts`) guarantees immediate rendering even before the first network response returns.

---

## 🔐 Cryptographic Protocol & Security

To communicate securely with the live business API without browser cross-origin or authentication failures, the backend handles all cryptographic signing and decryption:

| Parameter | Value / Protocol |
|---|---|
| **API Target** | `https://ke-thebar-business.agiza.io/api/v1/outlets/44/products` |
| **Request Signing** | HMAC-SHA512 |
| **Signature Payload** | `${timestamp}&${nonce}` |
| **Decryption Cipher** | `AES-256-CBC` |
| **Key Size** | 256 bits (32 bytes) |
| **Initialization Vector (IV)** | 16 bytes |

All secret keys remain safely on the server side in `server.ts` and are never exposed to browser clients.

---

## 🖼️ High-Performance Image Proxy & Asset Delivery

External images hosted on `ke-thebar-business.agiza.io` and AWS S3 enforce strict referer checks and CORS policies that can block images inside iframes, previews, or secure enterprise intranets.

To solve this:
1. **Integrated Image Proxy (`/api/image-proxy?url=...`):**  
   The Express server intercepts image requests, fetches the binary image upstream, and streams it to the client with:
   - `Access-Control-Allow-Origin: *`
   - `Cache-Control: public, max-age=86400, stale-while-revalidate=604800`
2. **In-Memory Buffer Cache:**  
   Frequently requested bottle shots are cached in server RAM, eliminating duplicate upstream network calls and providing instant visual loading.
3. **Client-Side Image Helper (`src/utils/imageHelper.ts`):**  
   Automatically routes remote outlet URLs through the image proxy and attaches a fallback image if an image fails to load.

---

## 🚀 Key Modules & Platform Features

### 1. 📋 Live Wholesale Catalog (`src/components/CatalogSection.tsx`)
- Browse all 228+ synchronized outlet SKUs with instant real-time search.
- Multi-faceted filtering:
  - **By Category:** All, Whiskey, Gin, Vodka, Wine, Champagne, Beer/Cider, Rum, Brandy, Liqueurs.
  - **By Origin:** Scotland, Ireland, France, Kenya, South Africa, Sweden, Mexico, USA, etc.
  - **By KRA Digital Stamp:** Filter for authenticated excise-stamped goods.
  - **Sorting:** Featured Velocity, Wholesale Case Price (Low to High / High to Low), ABV%.
- Product cards highlight both the **Commercial Wholesale Bottle Price** and the **Full Case Wholesale Price**, along with ABV%, bottle volume, case pack size, and the verified KRA stamp badge.

### 2. ⚡ Matrix Order Pad (`src/components/MatrixOrderPad.tsx`)
- Engineered specifically for bar managers, F&B directors, and procurement teams.
- Order multiple cases across dozens of brands in seconds without bouncing between product pages.
- Dynamic calculation of cases, total bottles equivalent, volume tier discounts, and instant "Add All to Cart".

### 3. 🏢 B2B Commercial Portal (`src/components/B2BPortalSection.tsx`)
- **Account Profiles:** Test with simulated real-world commercial accounts:
  - *The Diamond Hotel Nairobi* (Tier 1 Premier: KES 2,500,000 Credit Limit, 30-Day Payment Terms).
  - *Safari Lounge & Grill Westlands* (Tier 2 Standard: KES 850,000 Credit Limit, 14-Day Payment Terms).
  - *Serena Retail Liquor Mart* (Tier 3 Retailer: COD / Advance Payment).
- **Credit Limit Monitor:** Real-time visual progress bar tracking current balance, available credit limit, and due dates.
- **Invoice & Order History:** Review past consignments with downloadable and printable commercial tax invoices.
- **Credit Upgrade Application:** Interactive form for venues to request higher credit ceilings with KRA PIN and business registration.

### 4. 📄 Wholesale Price List (`src/components/PriceListSection.tsx`)
- Clean, professional wholesale price sheet with SKU codes, bottle prices, case prices, and bulk discount brackets.
- One-click PDF export and quick-order buttons.

### 5. 🚚 Depot & Distribution Hub Network (`src/components/DepotsSection.tsx`)
- Select your fulfilling distribution depot:
  - **Eldoret North Rift Hub** (Rupa Mall / Highway Depot)
  - **Nairobi Central Hub** (Industrial Area)
  - **Westlands Express Depot**
  - **Nakuru Rift Valley Depot**
  - **Kisumu Western Hub**
  - **Mombasa Coastal Regional Hub**
- Shows cut-off times, dispatch ETAs (same-day vs. next-day delivery), and direct dispatch hotline numbers.

### 6. 🛒 Checkout & Multi-Channel Dispatch (`src/components/CheckoutModal.tsx`)
- **Flexible B2B Settlement Options:**
  - **M-Pesa Corporate Paybill & Till:** Simulated instant STK push with Paybill 522522 / Till 889922.
  - **B2B Trade Credit:** Drawn against the active verified commercial credit limit.
  - **Bank Wire / RTGS / EFT:** Pro-forma bank settlement reference.
- **Direct WhatsApp Dispatch:** Converts the order into a structured, itemized WhatsApp message sent directly to the sales dispatch hotline.

### 7. 🛡️ Regulatory Compliance
- **Age Gate Modal (`src/components/AgeGateModal.tsx`):** Kenyan Legal Drinking Age (18+) verification adhering to the Alcoholic Drinks Control Act.
- **KRA Digital Excise Tax Stamps:** Direct importer verification badges on all stock.

---

## 💼 Wholesale Business & Pricing Logic

1. **Volume Tier Discounts:**
   - **1 – 4 cases:** Base wholesale trade price.
   - **5 – 14 cases:** 3% volume tier discount.
   - **15 – 29 cases:** 6% volume tier discount.
   - **30+ cases:** 10% master wholesale distributor discount.

2. **Standardized Case Packaging:**
   - Spirits (Whiskey, Gin, Vodka, Tequila, Rum, Brandy, Liqueurs): **12 bottles per case**.
   - Beers & Ciders: **24 bottles or cans per crate/case**.
   - Wines & Champagnes: **6 bottles per case**.

3. **Tax & Delivery Calculations:**
   - Standard 16% Value Added Tax (VAT) breakdown on all itemized invoices.
   - Free delivery on wholesale orders of **KES 30,000 or more** (or KES 1,500 flat logistics fee for smaller consignments).

---

## 📁 Project Directory Structure

```
├── server.ts                       # Express backend: Outlet 44 sync, image proxy, Vite middleware
├── package.json                    # Project metadata & npm dependencies
├── vite.config.ts                  # Vite build configuration with Tailwind CSS plugin
├── tsconfig.json                   # TypeScript configuration
├── metadata.json                   # App capabilities & configuration
│
└── src/
    ├── App.tsx                     # Main layout, router state, and live sync coordinator
    ├── main.tsx                    # React client entry point
    ├── index.css                   # Tailwind CSS imports & global design tokens
    ├── types.ts                    # TypeScript types for Products, Orders, B2B Profiles, Cart
    │
    ├── services/
    │   └── catalogSync.ts          # Client sync manager, local storage cache, and status helpers
    │
    ├── data/
    │   ├── products.ts             # 228+ accurate outlet baseline products with authentic images
    │   └── depots.ts               # Kenyan distribution depot locations, hours, and contacts
    │
    ├── utils/
    │   ├── formatters.ts           # Kenyan Shillings (KES) currency, VAT, and price calculators
    │   └── imageHelper.ts          # Automatic proxying & fallback image handler
    │
    └── components/
        ├── Header.tsx              # Navigation bar, live sync badge, depot & account switcher
        ├── Hero.tsx                # Hero banner highlighting wholesale features & stats
        ├── HomeSection.tsx         # Featured categories, popular brands, and depot highlights
        ├── CatalogSection.tsx      # Main catalog with live search, filters, and sync status
        ├── MatrixOrderPad.tsx      # High-speed bulk multi-SKU ordering pad
        ├── B2BPortalSection.tsx    # Commercial accounts, credit manager, order history, invoices
        ├── PriceListSection.tsx    # Exportable wholesale price list with PDF download
        ├── DepotsSection.tsx       # Distribution network and fulfillment schedules
        ├── AboutSection.tsx        # Company background, licensing, and compliance
        ├── ContactSection.tsx      # Sales directory and customer care contacts
        ├── ProductCard.tsx         # Responsive product display card with authentic imagery
        ├── ProductDetailModal.tsx  # Modal with tasting notes, ABV, and case volume calculator
        ├── Pagination.tsx          # Reusable responsive pagination (First/Prev/Next/Last, page jumpers, items per page)
        ├── CartDrawer.tsx          # Side drawer for cart items, case counts, and subtotal
        ├── CheckoutModal.tsx       # M-Pesa, Trade Credit, Bank Wire, and WhatsApp checkout
        ├── CreditApplicationModal.tsx # Form to apply for commercial credit limit extensions
        ├── InvoiceViewerModal.tsx  # Commercial B2B invoice with print/download support
        ├── AgeGateModal.tsx        # Kenyan 18+ legal drinking age gate
        ├── ThemeToggle.tsx         # Dark / Light mode toggle
        └── Footer.tsx              # Corporate footer with compliance and licensing details
```

---

## 📡 Backend API Reference

### 1. Synchronize Catalog with Outlet 44
- **Method & Route:** `GET /api/catalog/sync`
- **Query Parameters:**
  - `force=true` *(optional)*: Bypasses the server cache and performs an immediate live query to the Agiza API.
- **Example Response:**
```json
{
  "success": true,
  "cached": false,
  "timestamp": "2026-09-21T07:45:00.000Z",
  "outletId": 44,
  "outletName": "Cyden General Enterprises - Rupa Mall",
  "source": "https://ke.thebar.com/outlets/Cyden-General-Enterprises-Rupa-Mall/44",
  "count": 228,
  "products": [
    {
      "id": "cyd-44-1234",
      "sku": "CYD-44-JW-BLACK-1L",
      "name": "Johnnie Walker Black Label 1L",
      "brand": "Johnnie Walker",
      "category": "whiskey",
      "origin": "Scotland, UK",
      "originFlag": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
      "abv": 40,
      "volumeMl": 1000,
      "casePack": 12,
      "bottlePriceKes": 4150,
      "casePriceKes": 49800,
      "retailerRrpKes": 4500,
      "outletId": 44,
      "outletName": "Cyden General Enterprises - Rupa Mall",
      "inStock": true,
      "stockCases": 65,
      "kraStampVerified": true,
      "image": "https://s3.eu-west-1.amazonaws.com/ke-thebar-business.agiza.io/products/...",
      "featured": true
    }
  ]
}
```

### 2. Check Catalog Sync Status
- **Method & Route:** `GET /api/catalog/status`
- **Example Response:**
```json
{
  "success": true,
  "hasCache": true,
  "lastSyncedAt": "2026-09-21T07:45:00.000Z",
  "outletId": 44,
  "outletName": "Cyden General Enterprises - Rupa Mall",
  "itemCount": 228,
  "sourceUrl": "https://ke.thebar.com/outlets/Cyden-General-Enterprises-Rupa-Mall/44"
}
```

### 3. Secure Image Proxy
- **Method & Route:** `GET /api/image-proxy?url=<ENCODED_IMAGE_URL>`
- **Description:** Streams external product photography from AWS S3 / Agiza with permissive CORS headers and long-lived client caching.

### 4. Health Check
- **Method & Route:** `GET /api/health`
- **Example Response:**
```json
{
  "status": "ok",
  "service": "Bessich Distributors & The Bar Outlet Sync Engine",
  "outletId": 44,
  "outletName": "Cyden General Enterprises - Rupa Mall"
}
```

---

## 💻 Development & Deployment Guide

### Prerequisites
- **Node.js >= 20.0.0** (required by dependencies)
- **npm**, **yarn**, or **bun** (a `bun.lock` is included for Bun users)
- No `.env` file is required — all cryptographic keys and API endpoints are pre-configured in `server.ts`. The `.env.example` is for optional Gemini AI Studio integration only and is **not** needed to run the app locally.

### 1. Install Dependencies
```bash
# Using npm
npm install

# Using yarn
yarn install

# Using bun
bun install
```

### 2. Run Development Server
```bash
npm run dev
```
Starts the full-stack server on `http://localhost:3000` with Express backend API routes and live Vite HMR middleware.

### 3. Validate Types & Code Quality
```bash
npm run lint
```

### 4. Build for Production
```bash
npm run build
```
Compiles the Vite React frontend into `dist/` and bundles `server.ts` into a high-performance CommonJS file at `dist/server.cjs`.

### 5. Launch Production Server
```bash
npm start
```
Runs `node dist/server.cjs` serving both the API and static production assets.

### Available Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `tsx server.ts` | Start dev server with Vite HMR on port 3000 |
| `build` | `vite build && esbuild server.ts ...` | Build frontend + bundle backend for production |
| `start` | `node dist/server.cjs` | Run the production server |
| `preview` | `vite preview` | Preview the production build via Vite |
| `lint` | `tsc --noEmit` | Type-check the project without emitting files |
| `clean` | `rm -rf dist server.js` | Remove build artifacts |
