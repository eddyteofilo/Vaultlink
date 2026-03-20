

## Plan: Landing Page Carousel, Thank You Page, Payment Gate, and Autocomplete on Secret Type

### Overview
Three main changes: (1) enhance Landing Page with an animated carousel showing how VaultLink works, (2) create a Thank You page post-purchase that redirects to dashboard, (3) gate the dashboard behind payment, and (4) add autocomplete suggestions to the Secret Type field.

---

### 1. Landing Page Carousel Section

Replace the static "Como funciona" grid with an animated carousel using the existing `embla-carousel-react` (already in the project via the `Carousel` UI component).

**File: `src/pages/LandingPage.tsx`**
- Import `Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext` from `@/components/ui/carousel`
- Add `embla-carousel-autoplay` plugin for auto-advance
- Create 4-5 carousel slides with mock screenshots/illustrations showing: creating a project, adding credentials, copying passwords, organizing by project
- Each slide: glass-card with icon, title, description, and a visual mockup
- Add dot indicators for current slide
- Wrap in Framer Motion for entrance animation

### 2. Thank You Page (`/obrigado`)

**New file: `src/pages/ThankYouPage.tsx`**
- Animated success screen with check icon, confetti-style animation
- Message: "Pagamento confirmado! Seu VaultLink Pro está ativo."
- Button "Acessar o Painel" linking to `/dashboard`
- Auto-redirect after 5 seconds (optional)

**File: `src/App.tsx`**
- Add route `/obrigado` pointing to `ThankYouPage`

### 3. Payment Gate on Dashboard

Since Stripe integration is not yet wired, implement a lightweight gate:

**File: `src/components/layout/ProtectedRoute.tsx`**
- After auth check, query `subscriptions` table for the current user
- If no active subscription, redirect to `/` (landing page) or show a paywall modal
- Allow access to `/obrigado` and `/settings` without subscription

> Note: Full Stripe checkout integration would be a separate step (enabling Stripe connector). For now, the gate checks the `subscriptions` table so it works once Stripe webhook populates it.

### 4. Autocomplete on Secret Type Field

**File: `src/components/secrets/SecretModal.tsx`**
- Replace plain `<Input>` for type with a custom combo approach:
  - Show a datalist or dropdown with common suggestions: `API Key`, `Token`, `Hash`, `OAuth`, `SSH Key`, `Bearer Token`, `Secret Key`, `Webhook`
  - User can still type freely (not restricted to list)
- Implementation: Use HTML `<datalist>` element with the `<Input>` for native autocomplete, keeping it simple and accessible

---

### Technical Details

| Task | Files Modified | Complexity |
|------|---------------|------------|
| Carousel on Landing | `LandingPage.tsx`, add `embla-carousel-autoplay` dep | Medium |
| Thank You page | New `ThankYouPage.tsx`, `App.tsx` | Low |
| Payment gate | `ProtectedRoute.tsx` | Medium |
| Autocomplete on Type | `SecretModal.tsx` | Low |

### Install dependency
- `embla-carousel-autoplay` for carousel auto-play

