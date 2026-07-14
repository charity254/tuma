---
name: Tuma
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#504534'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#827562'
  outline-variant: '#d5c4ae'
  surface-tint: '#7d5700'
  primary: '#7d5700'
  on-primary: '#ffffff'
  primary-container: '#e8a820'
  on-primary-container: '#5d4000'
  inverse-primary: '#febb35'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfde'
  on-secondary-container: '#636262'
  tertiary: '#645e4c'
  on-tertiary: '#ffffff'
  tertiary-container: '#bbb39e'
  on-tertiary-container: '#4b4535'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdeaa'
  primary-fixed-dim: '#febb35'
  on-primary-fixed: '#271900'
  on-primary-fixed-variant: '#5f4100'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#ebe2cb'
  tertiary-fixed-dim: '#cfc6b0'
  on-tertiary-fixed: '#1f1b0e'
  on-tertiary-fixed-variant: '#4c4636'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '700'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  container-margin: 20px
  gutter: 16px
---

## Brand & Style
The design system for this errand-running platform is built on the pillars of efficiency, reliability, and modern utility. It targets busy urban professionals and service providers who require immediate clarity and frictionless navigation. 

The aesthetic is **Clean Minimalism** with a focus on high scannability. By utilizing a "White-Label" philosophy for backgrounds and containers, we allow the mustard yellow accents to guide the user's eye toward primary actions and status indicators. The emotional response is one of organized calm—transforming a chaotic to-do list into a series of manageable, secure tasks. The interface avoids unnecessary decorative flourishes, favoring structural integrity and generous whitespace to reduce cognitive load.

## Colors
This design system utilizes a high-contrast palette to ensure legibility in various lighting conditions, specifically for on-the-go mobile use.

- **Primary Accent (Mustard Yellow):** Reserved for primary call-to-action buttons, active states, and critical progress indicators.
- **Deep Base (Ink Black):** Used for primary typography and iconography to ensure maximum grounding and authority.
- **Background (Clean White):** The core canvas, providing a sense of openness and cleanliness.
- **Muted Accents (Light Mustard Tint):** Applied to secondary containers, chip backgrounds, and subtle highlights to provide depth without introducing new hues.

## Typography
The system uses **Hanken Grotesk** for its contemporary, sharp geometric qualities that remain highly legible at small sizes. 

Headlines are set with heavy weights (ExtraBold/Bold) to provide a clear information hierarchy and a sense of "secure" authority. Body text scales from 16px to 18px to ensure readability for users moving between tasks. Label styles use increased letter spacing and semi-bold weights to differentiate metadata from actionable content. Avoid using Italics; use weight variance to create emphasis instead.

## Layout & Spacing
This design system follows a **Mobile-First Fluid Grid** model. The standard layout uses a 20px safe-margin on the left and right edges of the screen to prevent content from crowding the device bezel.

Spacing follows a 4px baseline shift, but primarily relies on `16px (md)` and `24px (lg)` increments to define clear boundaries between unrelated sections. In data-heavy lists, use `12px (sm)` to maintain density without sacrificing touch-target size. Elements should span the full width of the container margins to maximize the interaction area on mobile devices.

## Elevation & Depth
Depth is communicated through **Tonal Layering** and **Low-Contrast Outlines** rather than traditional shadows. This maintains the minimalist aesthetic while providing necessary structure.

- **Level 0 (Background):** Clean White (#FFFFFF).
- **Level 1 (Cards/Containers):** Defined by a 1px solid border (#E5E7EB) or a Light Mustard Tint (#FDF3DC) fill.
- **Level 2 (Active/Selected):** 2px Mustard Yellow (#E8A820) border. No shadows are used for card selection; depth is achieved purely through color and stroke weight.
- **Overlays:** For modals or sheets, use a 40% opacity Ink Black backdrop with a blur effect to maintain focus on the foreground without losing context.

## Shapes
The shape language is **Soft (0.25rem - 0.75rem)**. This provides a modern, approachable feel that isn't as "bubbly" as fully rounded systems, preserving the professional tone required for service-based apps.

- **Buttons & Inputs:** 0.25rem (4px) for a precise, "tool-like" appearance.
- **Cards & Content Blocks:** 0.5rem (8px) to soften the layout and distinguish from global navigation.
- **Selection Indicators:** Use pill-shapes (rounded-full) only for small status tags or carousels.

## Components
- **Buttons:** Primary buttons are full-width, utilizing the Ink Black background with White text or Mustard Yellow with Ink Black text. They have no border-radius exceeding 4px.
- **Cards:** Used for errand listings and service selection. They feature a subtle `#E5E7EB` border. Selected states switch the border to 2px `#E8A820` or apply the `#FDF3DC` background tint.
- **Input Fields:** Minimalist design with no background fill. They feature a light grey bottom border which transitions to a 2px Mustard Yellow border on focus. Labels sit above the field in `label-sm` style.
- **Chips:** Small, rectangular tags with `rounded-sm` corners. Use `#FDF3DC` for background with Ink Black text for secondary information (e.g., "Express Delivery").
- **Carousel Indicators:** Small dots located at the bottom of hero sections. The active state is a Mustard Yellow dot; inactive states are light grey.
- **Lists:** Clean rows separated by 1px horizontal lines. No "arrows" or chevrons are necessary if the row has a clear vertical tap area.