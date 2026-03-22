# Optimera Tilhengerutleie — Sharefox + Zebra TC27

**Prosjekttype:** Intern app for tilhengerutleie i Monter/Optimera butikker
**Eier:** Optimera / Saint-Gobain Distribution Norway
**Stack:** Next.js 16 + React 19 + TypeScript 5.9 + Tailwind v4 + Jest
**Deploy:** Standalone Node.js server (BFF for Sharefox API)
**Targets:** Zebra TC27 handterminal (SOTI kiosk) + Admin web dashboard

---

## 1. PROSJEKTSAMMENDRAG

System for tilhengerutleie ved Monter/Optimera-butikker med to grensesnitt:

1. **Terminal** (`/terminal`) — Handterminal-app for utebutikk-ansatte pa Zebra TC27
   - Skann tilhenger-strekkode → identifiser kunde → bekreft utleie → innlevering
   - Optimalisert for hanskebruk, utendors, 6" skjerm
   - Offline-forst med synkroniseringsko

2. **Admin** (`/admin`) — Dashboard per varehus
   - Flateoversikt, aktive utleier, kalender, kunder, rapporter
   - Standard responsiv web

**Integrasjoner:**
- Sharefox API (utleie-backend, bookinger, inventar)
- SOTI MobiControl (enhetsadministrasjon, kiosk-modus)
- Zebra DataWedge (strekkode-skanning via keystroke-injeksjon)
- Min Optimera Proff / Kundeklubb Privat (kundeidentifisering — fase 2)
- BankAxept depositum (fase 3)

---

## 2. ARKITEKTUR

### Route-struktur
```
/                    → Redirect til /terminal
/terminal            → Handterminal hjem
/terminal/scan       → Skann tilhenger-strekkode
/terminal/customer   → Identifiser kunde (proff/privat/gjest)
/terminal/rental     → Bekreft utleie
/terminal/rental/[id]→ Kvittering
/terminal/return     → Innlevering
/terminal/queue      → Synkroniseringsko (offline)
/admin               → Dashboard oversikt
/admin/fleet         → Flateoversikt
/admin/rentals       → Utleieliste
/admin/calendar      → Tilgjengelighetsoversikt
/admin/customers     → Kundesok
/admin/reports       → Rapporter
/api/sharefox/*      → BFF proxy mot Sharefox API
/api/auth/*          → Autentisering
/api/sync            → Offline-ko synkronisering
```

### BFF-monster (Backend-for-Frontend)
Terminal/admin snakker ALDRI direkte med Sharefox. Alle API-kall gar gjennom
Next.js API-routes som haandterer tokens og feilhandtering:

```
Terminal/Admin → /api/sharefox/* → SharefoxClient (server-side) → api.mysharefox.com
```

### Offline-strategi (Terminal)
1. Service Worker cacher app-shell
2. IndexedDB lagrer flate-data og aktive utleier
3. Ko-system for operasjoner nar offline
4. Synkroniserer automatisk nar tilkoblet
5. Visuell indikator: gronn/oransje/rod

---

## 3. SHAREFOX API

**Base URL:** `https://api.mysharefox.com/api-v2/`
**Docs:** `https://api.mysharefox.com/docs`
**Status:** Beta API

### Autentisering
```
Admin login: POST /admin/login
  Body: { email, password }
  Returns: Bearer token (long-lived)
  Headers required: Authorization, x-sharefox-admin-domain
```

### Endepunkter (brukt)
- Produkter: GET products
- Inventar: GET inventory by barcode
- Tilgjengelighet: GET availability for daterange
- Bookinger: POST/PUT bookings
- Ordrer: POST/GET/PUT orders

### Miljovariable
```
SHAREFOX_ADMIN_EMAIL=admin@example.com
SHAREFOX_ADMIN_PASSWORD=***
SHAREFOX_DOMAIN=monter-skien.mysharefox.com
SHAREFOX_BASE_URL=https://api.mysharefox.com/api-v2
DEFAULT_WAREHOUSE_CODE=MONTER-SKI
```

---

## 4. ZEBRA TC27 + SOTI

### TC27 Spesifikasjoner
- Skjerm: 6" FHD (1080x2160), 450 nit
- OS: Android 13+ / Chrome
- Skanner: SE4710 (1D/2D) via DataWedge
- NFC: HF 13.56 MHz
- Ruggedisering: IP65/IP68
- Touch: Hansker (GLOVE_AND_FINGER modus)

### DataWedge Integrasjon
DataWedge injiserer skannet strekkode som keystrokes i Chrome:
1. ScanInput-komponent har autofocus
2. DataWedge skriver tegn + ENTER
3. onKeyDown handler trigger onScan callback
4. Feltet nullstilles og re-fokuseres

**Ingen spesial-SDK trengs** — standard HTML input fungerer.

### SOTI Kiosk-profil
Se `soti/kiosk-profile.json` for komplett konfigurasjon:
- Single-app kiosk (Chrome)
- URL: https://tilhenger.optimera.no/terminal
- Skjult adresselinje og navigasjon
- DataWedge-profil for strekkode-dekoding

---

## 5. TERMINAL UI-REGLER

| Egenskap | Verdi |
|----------|-------|
| Min touch target | 56x56 px |
| Input hoyde | 56px (terminal-variant) |
| Knapp hoyde | 56px+ med full bredde |
| Skrift | 16px+ body, 20px+ scan input |
| Kontrast | WCAG AAA (7:1) |
| Orientering | Portrett, enkeltkolonne |
| Max bredde | 540px (centered) |
| Farger | Hoy kontrast for utendors |
| Seleksjon | Disabled (unntatt input) |

### Brand-farger
```
Primary red:  #E52629 (Optimera)
Primary dark: #C41E21
Dark bg:      #101920
Success:      #22C55E
Warning:      #F59E0B
Danger:       #EF4444
```

---

## 6. DATAMODELL

### Tilhenger (Trailer)
```typescript
type TrailerStatus = 'available' | 'rented' | 'reserved' | 'maintenance' | 'retired'
type TrailerType = 'open_750' | 'open_1300' | 'enclosed_750' | 'car_trailer' | 'flatbed'
```

### Kunde (Customer)
```typescript
type CustomerType = 'proff' | 'privat' | 'guest'
// Proff: Optimera-nummer pakrevd
// Privat: Kundeklubb-nummer (valgfritt)
// Guest: Kun navn + telefon
```

### Utleie (Rental)
```typescript
type RentalStatus = 'pending' | 'active' | 'overdue' | 'returned' | 'completed' | 'cancelled'
// State machine: pending → active → (overdue →) returned → completed
```

### Prising
```
open_750:     350 kr/dag, 500 kr/helg, 1200 kr/uke
open_1300:    500 kr/dag, 700 kr/helg, 1800 kr/uke
enclosed_750: 450 kr/dag, 650 kr/helg, 1500 kr/uke
car_trailer:  600 kr/dag, 900 kr/helg, 2500 kr/uke
flatbed:      400 kr/dag, 600 kr/helg, 1400 kr/uke
```

---

## 7. FASER

### Fase 1: MVP (Komplett) ✓
- [x] Prosjekt-scaffold (Next.js 16, React 19, TS, Tailwind v4)
- [x] Types og interfaces
- [x] Rental forretningslogikk (varighet, validering, prisberegning)
- [x] State machine for utleiestatus
- [x] UI-komponentbibliotek (Button, Input, Card, Badge, etc.)
- [x] Terminal-komponenter (ScanInput, TrailerCard, CustomerCard, etc.)
- [x] 6 terminal-skjermer (hjem, skann, kunde, bekreft, kvittering, innlevering)
- [x] Admin dashboard oversikt
- [x] Demo-flate (5 tilhengere)
- [x] SOTI kiosk-profil + DataWedge config
- [x] PWA manifest
- [x] 55 unit tester — alle bestar

### Fase 2: Integrasjon
- [ ] Sharefox API-klient (server-side)
- [ ] BFF API-routes
- [ ] Offline IndexedDB + Service Worker
- [ ] Live flate fra Sharefox
- [ ] Admin: fleet, rentals, calendar, customers, reports

### Fase 3: Kundeintegrasjon
- [ ] Min Optimera Proff API
- [ ] Kundeklubb Privat API
- [ ] Push-varsler
- [ ] PDF-kvittering

### Fase 4: Betaling + Produksjon
- [ ] BankAxept depositum
- [ ] Stripe via Sharefox
- [ ] SOTI fleet deployment

---

## 8. TESTING

```bash
npm test          # Kjor alle 55 tester
npm test:watch    # Watch-modus
npm run build     # Verifiser produksjons-build
npm run dev       # Start dev-server (Turbopack)
```

### Testdata
- Demo-flate: 5 tilhengere i MONTER-SKI (se src/lib/fleet/trailers.ts)
- Strekkoder: TH-SKI-001 til TH-SKI-005
- Test-priser: Se DEFAULT_PRICING i src/lib/rental/pricing.ts

---

## 9. VIKTIGE REGLER

1. Terminal snakker ALDRI direkte med Sharefox — alltid via BFF (/api/)
2. Sharefox admin-token lagres server-side, aldri i klient
3. Touch targets MINIMUM 56x56 px pa terminal
4. All tekst pa norsk i UI
5. Offline-forst: enhver operasjon ma kunne koes
6. ROUNDUP for alle mengdeberegninger (Math.ceil)
7. DataWedge: standard HTML input + keystroke injeksjon, ingen SDK
8. SOTI kiosk: Chrome, ikke SOTI Surf
9. Brand-farger: Optimera rod #E52629
