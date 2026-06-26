# JAR Landing Page Redesign Spec
**Date:** 2026-06-16  
**Branch:** feature/newjar-platform  
**Scope:** Full visual redesign of `jar-landing` — color system, 3 new/updated content sections, Contact form

---

## Goal

Transform the existing landing page from a navy/gold scheme into a premium white + deep-green SaaS site that looks like a real launched startup, not an AI-generated design. No floating devices, no fake dashboards, no gimmicks.

---

## Color System

Replace all CSS variables in `app/globals.css`:

| Variable | Old | New |
|---|---|---|
| `--color-primary` | `#1B2A4A` | `#1B7A4E` |
| `--color-accent` | `#B8924A` | `#2D9E6B` |
| `--color-accent-light` | `#D4AF6E` | `#48BB8A` |
| `--color-bg` | `#FFFFFF` | `#FFFFFF` |
| `--color-bg-secondary` | `#ECEEF3` | `#F2F9F5` |
| `--color-text-muted` | `#4B5563` | `#4B5563` |

---

## Page Structure

```
Navbar
Hero
عن جار        (About — new component)
وايش تقدم     (Solutions — existing, updated colors only)
تواصل معنا    (Contact — new component)
Footer
```

---

## Section Specs

### Navbar (`components/Navbar/index.tsx`)
**Changes:**
- Update nav link labels via translations: الرئيسية | عن جار | الخدمات
- Add two right-side buttons: "تسجيل الدخول" (outlined) + "إنشاء حساب" (filled green)
- Colors auto-update via CSS variable change

**Translation keys to add:** `nav.home`, `nav.login`, `nav.register`

---

### Hero (`components/Hero/index.tsx`)
**Changes (minimal — colors auto-update):**
- Update `--color-primary` overlay becomes green automatically
- Update headline: `"ندير مجتمعاتك بذكاء... لنرتقي بتجربة المقيمين"`
- Update subheadline: shorter, more direct
- CTA primary: `"ابدأ الآن"` → links to `#contact`
- CTA secondary: `"احجز عرض توضيحي"` → links to `#contact`

---

### عن جار — About Section (`components/About/index.tsx`) **NEW**
**Layout:** Two-column, RTL — text right, image left  
**Background:** `#F5FAF7`

**Text column (right):**
- Small label badge: "من نحن"
- H2: "منصة سعودية تربط كل أطراف المجتمع السكني"
- Body paragraph: 2–3 sentences explaining JAR connects developers, residents, and service providers in one system
- 3 bullet points with checkmark icons:
  - إدارة شاملة للوحدات والسكان
  - متابعة الصيانة والخدمات لحظياً
  - تقارير وبيانات في متناول يدك

**Image column (left):**
- Fetch a high-quality Unsplash photo: vibrant luxury residential interior or community amenity (rooftop, lobby, pool area) — NOT a plain building exterior
- Use `next/image` with `object-cover`, rounded corners `rounded-2xl`, subtle shadow
- Minimum dimensions: 600×700px display, `sizes="(max-width: 768px) 100vw, 50vw"`

**Image sourcing:** Use Unsplash API or direct URL for a professional interior/amenity shot. Must feel premium, warm-lit, and modern Saudi residential.

---

### وايش تقدم — Solutions (`components/Solutions/index.tsx`)
**Changes:** CSS variable update handles color automatically. No structural changes needed.  
Verify bento grid renders correctly with new green primary.

---

### تواصل معنا — Contact Section (`components/Contact/index.tsx`) **NEW**
**Background:** White  
**Layout:** Centered, max-width 640px

**Content:**
- H2: from `contact.title` translation
- Subtitle: from `contact.subtitle`
- Form fields (use existing translation keys):
  - الاسم الكامل (text input)
  - البريد الإلكتروني (email input)
  - رقم الجوال (tel input)
  - اسم الشركة أو المجمع (text input)
  - رسالتك (textarea, 4 rows)
- Submit button: "إرسال الرسالة" — green filled, full width on mobile
- Success state: show `contact.success_title` + `contact.success_message`, hide form

**Form behavior:**
- Client-side only (no backend) — `onSubmit` sets `sent = true`, shows success message
- No validation beyond HTML `required` attributes (boundary input, not internal logic)

**Styling:**
- Inputs: border `border-primary/15`, rounded-xl, focus ring green
- Submit: `bg-accent text-white hover:bg-accent-light`

---

### Footer (`components/Footer/index.tsx`)
**Changes:** CSS variable update handles color automatically. No structural changes.

---

## Translation Updates

### `messages/ar.json`
```json
"nav": {
  "home": "الرئيسية",
  "about_label": "عن جار",
  "services": "الخدمات",
  "login": "تسجيل الدخول",
  "register": "إنشاء حساب"
}
```

Add `about` section keys:
```json
"about": {
  "badge": "من نحن",
  "title": "منصة سعودية تربط كل أطراف المجتمع السكني",
  "body": "جار تجمع المطور العقاري والساكن ومزود الخدمة في منظومة رقمية واحدة — لإدارة أذكى وتجربة أفضل لكل طرف.",
  "point1": "إدارة شاملة للوحدات والسكان",
  "point2": "متابعة الصيانة والخدمات لحظياً",
  "point3": "تقارير وبيانات في متناول يدك"
}
```

Same keys added to `messages/en.json`.

---

## `app/[locale]/page.tsx` Update

```tsx
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Solutions from '@/components/Solutions';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Solutions />
      <Contact />
      <Footer />
    </main>
  );
}
```

---

## File Checklist

| File | Action |
|---|---|
| `app/globals.css` | Update 3 color variables |
| `components/Navbar/index.tsx` | Add login/register buttons, update nav links |
| `components/Hero/index.tsx` | Update headline, subheadline, CTA labels |
| `components/About/index.tsx` | Create new component |
| `components/Solutions/index.tsx` | No changes (colors auto-update) |
| `components/Contact/index.tsx` | Create new component |
| `components/Footer/index.tsx` | No changes |
| `app/[locale]/page.tsx` | Add About + Contact imports |
| `messages/ar.json` | Add nav + about keys, update hero keys |
| `messages/en.json` | Same |
| `public/about-image.jpg` | Fetch from Unsplash |

---

## What Is NOT in Scope

- Backend/API for the contact form
- Stats bar, "لمن نعمل؟", "لماذا جار؟" sections (removed per user decision)
- Mobile app section
- Pricing section
- Separate contact page (future)
