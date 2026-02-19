# Design Brief: Marktplatz

## 1. App Analysis

### What This App Does
Marktplatz ist eine Kleinanzeigen-App für den Verkauf von Artikeln. Nutzer können Produkte mit Foto, Hersteller, Modell, Farbe und Größe einstellen. Es ist ein einfacher, persönlicher Marktplatz für Second-Hand-Artikel oder Neuware.

### Who Uses This
Private Verkäufer, die ihre Artikel übersichtlich präsentieren und verwalten möchten. Menschen, die Mode, Elektronik oder andere Konsumgüter verkaufen wollen – vom Vintage-Liebhaber bis zum Gelegenheitsverkäufer.

### The ONE Thing Users Care About Most
**Wie viele Artikel habe ich aktuell eingestellt?** - Der Nutzer möchte sofort sehen, wie aktiv sein Marktplatz-Angebot ist und seine Artikel auf einen Blick überblicken können.

### Primary Actions (IMPORTANT!)
1. **Artikel einstellen** → Primary Action Button (neuen Artikel zum Verkauf hinzufügen)
2. Artikel bearbeiten (Preis anpassen, Details ändern)
3. Artikel löschen (wenn verkauft oder nicht mehr verfügbar)

---

## 2. What Makes This Design Distinctive

### Visual Identity
Ein warmer, einladender Marktplatz mit cremefarbenem Hintergrund und einem satten Terrakotta-Orange als Akzentfarbe. Die Farbwahl erinnert an einen sonnigen Flohmarkt im Freien – persönlich, nahbar und lebendig. Die großzügigen Produktkarten mit prominenten Fotos machen das Stöbern zum Vergnügen.

### Layout Strategy
- **Hero-Element:** Eine große Zahl zeigt die Anzahl der eingestellten Artikel – prominent, aber nicht überladen
- **Asymmetrisches Layout auf Desktop:** Links die Artikel-Galerie (Hauptfokus), rechts ein schmaler Statistik-Bereich
- **Visuelle Hierarchie durch Größenvariation:** Hero-KPI ist deutlich größer, Artikelkarten haben einheitliche Größe für Scanbarkeit
- **Breathing Room:** Großzügiger Whitespace zwischen Sektionen verhindert visuelles Chaos

### Unique Element
Die Produktkarten haben einen subtilen, warmen Schatten und eine leichte Hover-Animation, die sie "aufsteigen" lässt – wie Artikel, die auf einem Tisch präsentiert werden. Bei fehlenden Fotos erscheint ein dezenter Platzhalter mit einem weichen Farbverlauf im Terrakotta-Ton.

---

## 3. Theme & Colors

### Font
- **Family:** Plus Jakarta Sans
- **URL:** `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap`
- **Why this font:** Modern, professionell und gut lesbar. Die weiche Geometrie passt zum einladenden Marktplatz-Charakter ohne zu verspielt zu wirken.

### Color Palette
All colors as complete hsl() functions:

| Purpose | Color | CSS Variable |
|---------|-------|--------------|
| Page background | `hsl(35 30% 97%)` | `--background` |
| Main text | `hsl(25 20% 15%)` | `--foreground` |
| Card background | `hsl(0 0% 100%)` | `--card` |
| Card text | `hsl(25 20% 15%)` | `--card-foreground` |
| Borders | `hsl(35 20% 88%)` | `--border` |
| Primary action | `hsl(20 85% 52%)` | `--primary` |
| Text on primary | `hsl(0 0% 100%)` | `--primary-foreground` |
| Accent highlight | `hsl(25 90% 55%)` | `--accent` |
| Muted background | `hsl(35 20% 94%)` | `--muted` |
| Muted text | `hsl(25 10% 45%)` | `--muted-foreground` |
| Success/positive | `hsl(145 60% 40%)` | (component use) |
| Error/negative | `hsl(0 65% 50%)` | `--destructive` |

### Why These Colors
Die warme, cremefarbene Basis erzeugt eine einladende Atmosphäre wie auf einem Wochenmarkt. Das Terrakotta-Orange ist lebendig aber nicht schrill – es fühlt sich handgemacht und persönlich an, nicht wie eine sterile E-Commerce-Plattform. Diese Farbwahl hebt sich bewusst von kalten Blautönen ab.

### Background Treatment
Der Hintergrund ist ein sehr dezentes Cremeweiß (`hsl(35 30% 97%)`) – wärmer als reines Weiß, ohne aufdringlich zu sein. Keine Muster oder Verläufe, damit die Produktfotos im Fokus stehen.

---

## 4. Mobile Layout (Phone)

### Layout Approach
Mobile zeigt einen klaren vertikalen Fluss: Hero-Statistik oben, dann eine scrollbare Galerie von Artikelkarten. Jede Karte ist großzügig dimensioniert für Touch-Interaktion. Der "Artikel einstellen"-Button ist als FAB (Floating Action Button) fixiert unten rechts positioniert.

### What Users See (Top to Bottom)

**Header:**
- Titel "Mein Marktplatz" linksbündig, 20px semi-bold
- Kein Hamburger-Menü nötig (Single-Page-Dashboard)

**Hero Section (The FIRST thing users see):**
- Große Zahl "12" (Anzahl Artikel) zentriert, 64px bold
- Darunter: "Artikel eingestellt" als Label, 14px muted
- Nimmt ca. 25% des Viewport-Höhe ein
- Hintergrund leicht abgesetzt mit `--muted` Farbe, abgerundete Ecken (16px)
- Warum Hero: Gibt sofortigen Überblick über Aktivität des Marktplatzes

**Section 2: Artikel-Galerie**
- Überschrift "Meine Artikel" mit Anzahl-Badge
- Vertikal scrollende Liste von Artikelkarten
- Jede Karte: Foto links (80x80px, abgerundet), Details rechts (Hersteller, Modell, Größe/Farbe)
- Swipe-Geste für Edit/Delete auf jeder Karte

**Bottom Navigation / Action:**
- FAB (Floating Action Button) mit "+" Symbol unten rechts
- Terrakotta-Orange, 56px Durchmesser mit Schatten
- Position: 16px vom rechten und unteren Rand

### Mobile-Specific Adaptations
- Artikelkarten als horizontales Layout (Foto links, Info rechts)
- Keine Tabellen, nur Karten
- Edit/Delete als Swipe-Aktionen (wie iOS Mail)
- Bei leerem Zustand: Einladende Illustration und "Ersten Artikel einstellen"-Button

### Touch Targets
- Alle Buttons mindestens 44px
- Artikelkarten tap-area umfasst gesamte Karte für Detail-Dialog
- FAB prominent und leicht erreichbar

### Interactive Elements
- Tap auf Artikelkarte → Detail-Dialog mit allen Feldern + Edit/Delete-Buttons
- Swipe links auf Karte → Delete-Button erscheint
- Swipe rechts auf Karte → Edit-Button erscheint

---

## 5. Desktop Layout

### Overall Structure
Zwei-Spalten-Layout mit asymmetrischer Verteilung:
- Linke Spalte (ca. 70%): Artikel-Galerie als responsive Grid
- Rechte Spalte (ca. 30%): Kompakte Statistiken und Quick-Info

Auge geht zuerst zur Hero-Statistik (oben links prominent), dann zur Artikel-Galerie, dann zum Statistik-Sidebar.

### Section Layout

**Top Area:**
- Header mit "Mein Marktplatz" Titel und "Artikel einstellen"-Button rechts
- Button ist volle Primärfarbe mit Plus-Icon

**Hauptbereich (Links, 70%):**
- Hero-KPI-Card oben: Große Zahl der Artikel, subtiler Farbverlauf-Hintergrund
- Darunter: Artikelgalerie als 2-3 Spalten Grid (responsive)
- Jede Artikelkarte: Foto oben (16:9 Ratio), Details darunter
- Hover: Karte hebt sich mit Schatten, Edit/Delete-Icons erscheinen

**Sidebar (Rechts, 30%):**
- Kompakte Statistiken: Hersteller-Verteilung, Farben-Übersicht
- Sticky beim Scrollen (optional, wenn genug Inhalt)

### What Appears on Hover
- Artikelkarten: Leichter Schatten-Aufstieg, Edit-Icon (Stift) und Delete-Icon (Mülleimer) erscheinen oben rechts
- Buttons: Dezente Farbvertiefung

### Clickable/Interactive Areas
- Artikelkarte → Öffnet Detail-Dialog mit allen Infos
- Edit-Icon → Öffnet Edit-Dialog (gleicher Dialog wie Create, vorausgefüllt)
- Delete-Icon → Öffnet Lösch-Bestätigung

---

## 6. Components

### Hero KPI
- **Title:** Eingestellte Artikel
- **Data source:** artikel_einstellen (zähle alle Records)
- **Calculation:** COUNT aller Records
- **Display:** Große Zahl (48-64px) mit Label darunter, in einer Card mit dezenter Muted-Background
- **Context shown:** Keine Vergleichswerte nötig bei einfacher App
- **Why this is the hero:** Sofortiger Überblick wie aktiv der Marktplatz ist – die wichtigste Info für Verkäufer

### Secondary KPIs
Keine separaten KPIs nötig bei dieser einfachen App-Struktur. Die Artikelliste selbst ist die Hauptinformation.

### Chart (if applicable)
Kein Chart nötig – die visuelle Darstellung sind die Artikelkarten selbst mit ihren Fotos.

### Lists/Tables

**Artikel-Galerie**
- Purpose: Übersicht aller eingestellten Artikel
- Source: artikel_einstellen
- Fields shown: foto, hersteller, modell, farbe, groesse
- Mobile style: Horizontale Cards (Foto links, Info rechts)
- Desktop style: Grid-Cards (Foto oben, Info darunter)
- Sort: Neueste zuerst (nach createdat)
- Limit: Alle anzeigen (kein Limit)

### Primary Action Button (REQUIRED!)

- **Label:** "Artikel einstellen"
- **Action:** add_record
- **Target app:** artikel_einstellen
- **What data:** Formular mit: Foto (optional), Hersteller, Modell, Farbe, Größe
- **Mobile position:** fab (Floating Action Button unten rechts)
- **Desktop position:** header (Button rechts im Header)
- **Why this action:** Das Hauptziel der App ist, neue Artikel zum Verkauf einzustellen

### CRUD Operations Per App (REQUIRED!)

**Artikel einstellen CRUD Operations**

- **Create (Erstellen):**
  - **Trigger:** FAB "+" auf Mobile, "Artikel einstellen"-Button im Header auf Desktop
  - **Form fields:**
    - Foto (file upload, optional)
    - Hersteller (text input, optional)
    - Modell (text input, optional)
    - Farbe (text input, optional)
    - Größe (text input, optional)
  - **Form style:** Dialog/Modal auf allen Geräten
  - **Required fields:** Keine (alle optional lt. Metadata)
  - **Default values:** Keine

- **Read (Anzeigen):**
  - **List view:** Card-Galerie mit Foto, Hersteller, Modell als Hauptinfo
  - **Detail view:** Click auf Card → Detail-Dialog mit allen Feldern
  - **Fields shown in list:** foto (als Bild), hersteller, modell, farbe + groesse kombiniert
  - **Fields shown in detail:** Alle Felder groß dargestellt
  - **Sort:** Neueste zuerst (createdat DESC)
  - **Filter/Search:** Nicht implementiert (einfache App)

- **Update (Bearbeiten):**
  - **Trigger:** Edit-Icon (Stift) auf Hover (Desktop), Swipe rechts (Mobile), oder Button im Detail-Dialog
  - **Edit style:** Gleicher Dialog wie Create, aber vorausgefüllt mit aktuellen Werten
  - **Editable fields:** Alle Felder (foto, hersteller, modell, farbe, groesse)

- **Delete (Löschen):**
  - **Trigger:** Delete-Icon (Mülleimer) auf Hover (Desktop), Swipe links (Mobile), oder Button im Detail-Dialog
  - **Confirmation:** AlertDialog mit Warnung
  - **Confirmation text:** "Möchtest du diesen Artikel wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden."

---

## 7. Visual Details

### Border Radius
rounded (8px) für Cards und Buttons, pill (24px) für Badges und Tags

### Shadows
subtle – Karten haben leichten `shadow-sm` standardmäßig, auf Hover `shadow-md` mit Transition

### Spacing
normal – 16px zwischen Cards, 24px zwischen Sektionen

### Animations
- **Page load:** Fade-in mit stagger für Artikelkarten (je 50ms Verzögerung)
- **Hover effects:** Karten: `transform: translateY(-2px)` mit Schatten-Verstärkung (200ms ease)
- **Tap feedback:** Scale down 0.98 kurz beim Tap (100ms)

---

## 8. CSS Variables (Copy Exactly!)

```css
:root {
  --background: hsl(35 30% 97%);
  --foreground: hsl(25 20% 15%);
  --card: hsl(0 0% 100%);
  --card-foreground: hsl(25 20% 15%);
  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(25 20% 15%);
  --primary: hsl(20 85% 52%);
  --primary-foreground: hsl(0 0% 100%);
  --secondary: hsl(35 20% 94%);
  --secondary-foreground: hsl(25 20% 15%);
  --muted: hsl(35 20% 94%);
  --muted-foreground: hsl(25 10% 45%);
  --accent: hsl(25 90% 55%);
  --accent-foreground: hsl(0 0% 100%);
  --destructive: hsl(0 65% 50%);
  --border: hsl(35 20% 88%);
  --input: hsl(35 20% 88%);
  --ring: hsl(20 85% 52%);
  --radius: 0.5rem;
  --chart-1: hsl(20 85% 52%);
  --chart-2: hsl(145 60% 40%);
  --chart-3: hsl(35 80% 55%);
  --chart-4: hsl(200 70% 50%);
  --chart-5: hsl(280 60% 55%);
}
```

---

## 9. Implementation Checklist

The implementer should verify:
- [ ] Font loaded from URL above (Plus Jakarta Sans)
- [ ] All CSS variables copied exactly from Section 8
- [ ] Mobile layout matches Section 4 (FAB, card list, swipe gestures)
- [ ] Desktop layout matches Section 5 (grid gallery, hover states)
- [ ] Hero element is prominent as described (große Artikelzahl)
- [ ] Colors create the mood described in Section 2 (warmer Marktplatz)
- [ ] CRUD patterns are consistent (Dialog for Create/Edit, AlertDialog for Delete)
- [ ] Delete confirmations are in place
- [ ] Empty state implemented (einladende Nachricht + CTA)
- [ ] Loading state with Skeletons
- [ ] Error state with retry option
- [ ] Toast messages for CRUD feedback
