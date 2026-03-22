// ============================================================================
// ROADMAP DATA — Optimera Tilhengerutleie
// Pattern: Terrassekalkulator roadmap-data.ts (separated data from UI)
// ============================================================================

export type PhaseStatus = 'completed' | 'in-progress' | 'planned' | 'future';

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: PhaseStatus;
  details?: string[];
}

export interface RoadmapPhase {
  id: string;
  name: string;
  status: PhaseStatus;
  version: string;
  summary: string;
  items: RoadmapItem[];
}

// ============================================================================
// PHASES
// ============================================================================

export const ROADMAP_PHASES: RoadmapPhase[] = [
  // ──────────────────────────────────────────────────────────────────────────
  // v1.0 — MVP Terminal
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'v1.0',
    name: 'Fase 1 — MVP Terminal',
    status: 'completed',
    version: 'v1.0',
    summary: 'Butikkterminal med skanning, utlevering, retur, offline-kø og Sharefox mock-integrasjon.',
    items: [
      {
        id: 'v1.0-terminal-scan',
        title: 'Butikkterminal med strekkodeskanning',
        description: 'Skann tilhenger-strekkode via DataWedge keystroke injection på Zebra TC27.',
        status: 'completed',
        details: ['DataWedge-integrasjon (ingen SDK)', '56px touch targets', 'TrailerCard-visning etter skann'],
      },
      {
        id: 'v1.0-rental-flow',
        title: 'Utlevering og retur med sjekkliste',
        description: 'Komplett utleveringsflyt: skann → kunde → bekreft → sjekkliste → kvittering.',
        status: 'completed',
        details: ['23-punkts inspeksjonssjekkliste (Statens vegvesen)', 'Kundeidentifikasjon (proff/privat/gjest)', 'Førerkortklasse-validering (B/B96/BE)'],
      },
      {
        id: 'v1.0-offline',
        title: 'Offline-kø med IndexedDB',
        description: 'Dexie IndexedDB for flåte-cache, utleie-cache og synkroniseringskø.',
        status: 'completed',
        details: ['Eksponensiell backoff (maks 3 forsøk)', 'Visuell status: grønn/oransje/rød', 'Kø-side med manuell synk'],
      },
      {
        id: 'v1.0-sharefox',
        title: 'Sharefox API-integrasjon (mock)',
        description: 'BFF-mønster: terminal snakker aldri direkte med Sharefox. Mock-klient for demo.',
        status: 'completed',
        details: ['7 API-routes (fleet, inventory, rentals, returns, customers, sync, ping)', 'Mock-klient med 5 demo-tilhengere', 'Server-side token-håndtering'],
      },
      {
        id: 'v1.0-admin-basic',
        title: 'Grunnleggende admin-dashboard',
        description: 'Admin-oversikt med flåtestatus og navigasjon.',
        status: 'completed',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // v1.1 — Admin & Flåtestyring
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'v1.1',
    name: 'Fase 2 — Admin & Flåtestyring',
    status: 'completed',
    version: 'v1.1',
    summary: 'Komplett admin-dashboard med 11 sider, auth, flåteoversikt, service-varsler og rapporter.',
    items: [
      {
        id: 'v1.1-fleet',
        title: 'Komplett flåteoversikt med filter',
        description: 'Filtrerbar liste over alle tilhengere med status, type og lagersted.',
        status: 'completed',
      },
      {
        id: 'v1.1-trailer-detail',
        title: 'Tilhengerdetalj med vognkortdata',
        description: 'Detaljside per tilhenger med faner: oversikt, vognkort, service, EU-kontroll.',
        status: 'completed',
      },
      {
        id: 'v1.1-service-warnings',
        title: 'Service- og EU-kontroll varsler',
        description: 'Automatiske varsler for kommende service og EU-kontroll med fargekoding.',
        status: 'completed',
      },
      {
        id: 'v1.1-workshop',
        title: 'Verkstedforespørsler',
        description: 'Opprett, send og spor verkstedforespørsler med status-flyt.',
        status: 'completed',
      },
      {
        id: 'v1.1-rentals',
        title: 'Utleieliste med ekspandering',
        description: 'Alle utleier med filter og ekspanderbare detaljer.',
        status: 'completed',
      },
      {
        id: 'v1.1-calendar',
        title: 'Kalender med ukesvisning',
        description: 'Ukentlig grid per tilhenger med fargekodede booking-blokker.',
        status: 'completed',
      },
      {
        id: 'v1.1-customers',
        title: 'Kundesøk og historikk',
        description: 'Søk kunder og se utleiehistorikk per kunde.',
        status: 'completed',
      },
      {
        id: 'v1.1-reports',
        title: 'Rapporter og KPI-er',
        description: 'StatCards + SVG-charts for inntekt, utnyttelse og service-KPI.',
        status: 'completed',
      },
      {
        id: 'v1.1-auth',
        title: 'Innlogging og brukerroller',
        description: 'Session-basert auth med LoginGate, admin/teknisk/user roller.',
        status: 'completed',
        details: ['HTTP-only cookies', '7-dagers sessjon', 'Landing page med rollebasert redirect'],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // v1.2 — Feedback & Roadmap
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'v1.2',
    name: 'Fase 3 — Feedback & Roadmap',
    status: 'in-progress',
    version: 'v1.2',
    summary: 'Tilbakemeldingssystem og roadmap-oversikt for teamet under testing.',
    items: [
      {
        id: 'v1.2-roadmap-data',
        title: 'Roadmap-datafil',
        description: 'Separert roadmap-data fra UI-komponent, følger Terrassekalkulator-mønster.',
        status: 'in-progress',
      },
      {
        id: 'v1.2-feedback-widget',
        title: 'Feedback-widget',
        description: 'Flytende knapp på alle sider for å rapportere bugs, ønsker og forbedringer.',
        status: 'in-progress',
        details: ['Kategori: bug/feature/improvement', 'Prioritet: low/medium/high/critical', 'Lagres i Dexie IndexedDB'],
      },
      {
        id: 'v1.2-feedback-admin',
        title: 'Admin tilbakemeldingsside',
        description: 'Liste over alle tilbakemeldinger med filter og statusendring.',
        status: 'in-progress',
      },
      {
        id: 'v1.2-roadmap-page',
        title: 'Oppgradert roadmap-side',
        description: 'Roadmap med progress bars, detaljer og kobling til tilbakemeldinger.',
        status: 'in-progress',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // v1.3 — Verksted-integrasjon & Skadeflyt
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'v1.3',
    name: 'Fase 4 — Verksted & Skadeflyt',
    status: 'planned',
    version: 'v1.3',
    summary: 'Automatisk skade→verksted-flyt, vanlige feil i HT, kundebelastning og multi-verksted.',
    items: [
      {
        id: 'v1.3-auto-workshop',
        title: 'Automatisk verkstedforespørsel ved skade',
        description: 'Major damage ved retur → auto-opprett WorkshopRequest draft + sett tilhenger til vedlikehold.',
        status: 'planned',
        details: ['Tilstandsmaskin: draft → sent → acknowledged → in_progress → completed', 'Trailer status → maintenance automatisk', 'Admin-varsling med badge i sidebar'],
      },
      {
        id: 'v1.3-quick-faults',
        title: 'Hurtig feilregistrering på terminal',
        description: 'Store touch-knapper med vanlige tilhengerfeil, fargekodede etter alvorlighet.',
        status: 'planned',
        details: ['18 vanlige feil: koblingshode, bremsevaier, lys, dekk, gulv, skjerm, lager, etc.', 'Fargekoding: grå=kosmetisk, oransje=funksjonell, rød=sikkerhetskritisk', 'Kostnadsestimat per feil'],
      },
      {
        id: 'v1.3-damage-charges',
        title: 'Kundeskade-belastning',
        description: 'Norsk modell: depositum (500-1000 kr) + egenandel (maks 2500 kr).',
        status: 'planned',
        details: ['Per-post belastningsvalg i admin', 'Automatisk beregning vs egenandelstak', 'Skaderapport-visning'],
      },
      {
        id: 'v1.3-multi-workshop',
        title: 'Flere verksted per butikk',
        description: 'Konfigurerbare verkstedpartnere med kapasiteter og SLA.',
        status: 'planned',
        details: ['Primær + backup verksted', 'Kapasiteter: bremser, elektro, karosseri, EU-kontroll', 'Responstid SLA'],
      },
      {
        id: 'v1.3-inspection-history',
        title: 'Inspeksjonshistorikk på tilhengerdetalj',
        description: 'Ny tab med alle inspeksjoner koblet til utleier og skadehistorikk.',
        status: 'planned',
      },
      {
        id: 'v1.3-workshop-detail',
        title: 'Verksted detaljside',
        description: 'Full skaderapport, feilliste, kostnadssporing og statustidslinje.',
        status: 'planned',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // v1.4 — Avansert verksted & varsler
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'v1.4',
    name: 'Fase 5 — Varsler & Avansert',
    status: 'future',
    version: 'v1.4',
    summary: 'SMS/e-post varsler, servicekalender, flåtteoverføring, skade-foto og PDF.',
    items: [
      {
        id: 'v1.4-notifications',
        title: 'SMS og e-postvarsler',
        description: 'Automatiske varsler: skade→admin, forespørsel→verksted, rapport→kunde.',
        status: 'future',
        details: ['Link Mobility / Puzzel for SMS', 'Nodemailer + SMTP for e-post', 'Konfigurerbart per butikk'],
      },
      {
        id: 'v1.4-service-calendar',
        title: 'Servicekalender',
        description: 'Måned/uke-visning for EU-kontroll og planlagt service.',
        status: 'future',
      },
      {
        id: 'v1.4-fleet-transfer',
        title: 'Flåtteoverføring',
        description: 'Flytt tilhenger mellom butikker med audit-log.',
        status: 'future',
      },
      {
        id: 'v1.4-damage-photos',
        title: 'Skade-foto på terminal',
        description: 'Kamera-integrasjon på Zebra TC27 for fotodokumentasjon ved skade.',
        status: 'future',
        details: ['navigator.mediaDevices.getUserMedia', 'Lagring i Dexie som base64/blob', 'Thumbnail-preview grid'],
      },
      {
        id: 'v1.4-pdf-reports',
        title: 'PDF skaderapport',
        description: 'Generer PDF med bilder og kostnader for kunde og arkiv.',
        status: 'future',
      },
      {
        id: 'v1.4-workshop-response',
        title: 'Verksted-responsflyt',
        description: 'Verksted bekrefter, oppdaterer fremdrift og fullfører med tidslinje.',
        status: 'future',
      },
    ],
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getPhaseProgress(phase: RoadmapPhase): number {
  if (phase.items.length === 0) return 0;
  const completed = phase.items.filter((item) => item.status === 'completed').length;
  return Math.round((completed / phase.items.length) * 100);
}

export function getPhaseColor(status: PhaseStatus): 'red' | 'green' | 'orange' | 'blue' {
  switch (status) {
    case 'completed':
      return 'green';
    case 'in-progress':
      return 'blue';
    case 'planned':
      return 'orange';
    case 'future':
      return 'red';
    default:
      return 'red';
  }
}

export function getStatusBadgeColor(status: PhaseStatus): string {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800';
    case 'planned':
      return 'bg-amber-100 text-amber-800';
    case 'future':
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
}

export function getStatusLabel(status: PhaseStatus): string {
  switch (status) {
    case 'completed':
      return 'Fullført';
    case 'in-progress':
      return 'Pågår';
    case 'planned':
      return 'Planlagt';
    case 'future':
      return 'Fremtidig';
    default:
      return status;
  }
}

export function getItemStatusIcon(status: PhaseStatus): string {
  switch (status) {
    case 'completed':
      return '✓';
    case 'in-progress':
      return '◐';
    case 'planned':
      return '○';
    case 'future':
      return '◌';
    default:
      return '○';
  }
}
