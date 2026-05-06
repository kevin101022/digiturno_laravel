---
name: SENA APE Management
colors:
  surface: '#fcf8ff'
  surface-dim: '#dbd8e4'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2fd'
  surface-container: '#efecf8'
  surface-container-high: '#eae7f2'
  surface-container-highest: '#e4e1ec'
  on-surface: '#1b1b23'
  on-surface-variant: '#464554'
  inverse-surface: '#303038'
  inverse-on-surface: '#f2effa'
  outline: '#767685'
  outline-variant: '#c7c5d6'
  surface-tint: '#4a4dce'
  primary: '#050066'
  on-primary: '#ffffff'
  primary-container: '#10069f'
  on-primary-container: '#858aff'
  inverse-primary: '#c0c1ff'
  secondary: '#7d5700'
  on-secondary: '#ffffff'
  secondary-container: '#fdb300'
  on-secondary-container: '#694900'
  tertiary: '#3c0100'
  on-tertiary: '#ffffff'
  tertiary-container: '#630300'
  on-tertiary-container: '#f16c58'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#05006c'
  on-primary-fixed-variant: '#3032b5'
  secondary-fixed: '#ffdeab'
  secondary-fixed-dim: '#ffba30'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5f4100'
  tertiary-fixed: '#ffdad4'
  tertiary-fixed-dim: '#ffb4a7'
  on-tertiary-fixed: '#400100'
  on-tertiary-fixed-variant: '#871f13'
  background: '#fcf8ff'
  on-background: '#1b1b23'
  surface-variant: '#e4e1ec'
typography:
  display-queue:
    fontFamily: Syne
    fontSize: 120px
    fontWeight: '700'
    lineHeight: 110%
  h1-kiosk:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 120%
  h2-dashboard:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 140%
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 160%
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 150%
  label-bold:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 100%
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  kiosk-padding: 40px
  tv-margin: 64px
  dashboard-gutter: 16px
  touch-target-min: 56px
---

## Brand & Style
The design system for APE Turnos is anchored in the institutional authority of SENA, translated into a high-performance utility framework. The brand personality is efficient, accessible, and transparent, aimed at reducing the cognitive load of citizens navigating employment services.

The design style follows a **Modern Corporate** approach with a heavy emphasis on high-contrast accessibility. It utilizes generous negative space to prevent visual clutter on public screens while maintaining a clinical precision for administrative dashboards. The aesthetic is defined by sharp clarity, professional-grade typography, and a "function-first" hierarchy where information priority is dictated by the viewer's distance from the screen (Kiosk vs. TV vs. Desktop).

## Colors
The palette leverages the SENA identity to establish immediate institutional recognition. 
- **Primary Blue (#10069F)** serves as the foundational color for navigation, primary actions, and brand reinforcement.
- **Secondary Yellow (#FFB500)** is used strategically for high-attention elements like active queue numbers and primary call-to-actions on Kiosks.
- **Accent Orange (#FF671F)** is reserved for urgent status indicators and specific highlights that require immediate eye tracking.

The system uses a **Light Mode** default to ensure maximum legibility under the varied lighting conditions of public foyers. Neutrals are kept cool and clean to prevent the blue and yellow from feeling overwhelming.

## Typography
This design system employs a dual-font strategy to balance utility and visibility. 
- **Plus Jakarta Sans** handles all interface copy, offering a soft but professional geometry that remains legible at small sizes in data-dense coordinator dashboards.
- **Syne** is used exclusively for "Display Numbers" (Queue IDs). Its ultra-modern, high-contrast structure ensures that queue identifiers are unmistakable from a distance on TV screens.

For public-facing displays, type scales are aggressively oversized. For advisor dashboards, the scale tightens to accommodate complex data tables and status monitors.

## Layout & Spacing
The system utilizes a **Fluid Grid** model with three distinct profiles:
1. **Kiosk Layout:** Optimized for touch. Uses a 4-column grid with massive 40px margins. Elements are centered vertically to accommodate various user heights.
2. **TV Display:** Uses a fixed-aspect ratio safety zone. A 2-column or 3-column layout is used for "Called" vs "Waiting" lists. Spacing is extra-generous (64px+) to prevent "visual bleed" when viewed from 5+ meters away.
3. **Dashboard:** A 12-column grid focused on information density. Gutters are narrowed to 16px to maximize horizontal space for data tables.

All interactive elements adhere to a minimum 56px touch target for accessibility.

## Elevation & Depth
To maintain a modern and professional feel, this design system avoids heavy shadows. Instead, it uses **Tonal Layers** and **Low-Contrast Outlines**.

- **Level 0 (Background):** Primary neutral background (#F8F9FA).
- **Level 1 (Cards):** Pure white surfaces with a subtle 1px border (#E0E0E0).
- **Level 2 (Active/Floating):** Used for "Current Turn" callouts on TVs. These utilize a soft, ambient shadow (15% opacity Primary Blue) to create a "lifted" effect, drawing immediate attention.
- **Interactive States:** Buttons use a solid fill; when pressed, they shift to a deeper tonal variation rather than a shadow change, maintaining the flat, modern aesthetic.

## Shapes
The shape language is **Rounded (Level 2)**. 
- Standard components (Buttons, Inputs) use a 0.5rem (8px) radius.
- Large containers (Kiosk Cards, TV Announcements) use a 1.5rem (24px) radius to soften the high-contrast visuals and make the interface feel more approachable to the public.
- Status indicators (Chips) are fully pill-shaped to distinguish them from actionable buttons.

## Components
- **Kiosk Buttons:** Large-format, full-width blocks with Primary Blue backgrounds and H1-Kiosk typography. Icons must be 32px minimum.
- **TV Turn Cards:** High-visibility cards. The "Ticket Number" uses Syne Bold in Secondary Yellow, contrasted against a Primary Blue card background for maximum "pop."
- **Data Tables (Dashboard):** Low-profile rows with subtle hover states. Column headers use "Label-bold" in uppercase.
- **Status Chips:** Small, pill-shaped markers using 10% opacity versions of the semantic colors (Success/Error) with 100% opacity text for high legibility.
- **Queue Progress Bar:** A thick 12px tracked line using Accent Orange to show the movement of the current queue.
- **Touch Inputs:** Text fields on Kiosks feature 64px heights and persistent placeholder text to guide users through the registration process.