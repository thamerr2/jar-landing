# Landing Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the JAR landing page from a navy/gold scheme to white + medium green, add an About section with a vibrant image, and add a Contact form section.

**Architecture:** Modify CSS variables to cascade the color change across all existing components; add two new components (`About`, `Contact`) following the existing pattern of one component per folder under `components/`; update translations to add new keys.

**Tech Stack:** Next.js 14+, React, TypeScript, Tailwind CSS v4, framer-motion, next-intl, next/image

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `app/globals.css` | Modify | Color variables — cascades to all components |
| `messages/ar.json` | Modify | Add `about.*`, update `hero.*`, update `nav.*` |
| `messages/en.json` | Modify | Same keys as ar.json |
| `components/Hero/index.tsx` | Modify | Updated headline, subheadline, CTA labels |
| `components/Navbar/index.tsx` | Modify | New nav links + login/register buttons |
| `public/about-image.jpg` | Create | Vibrant luxury residential image (downloaded from Unsplash) |
| `components/About/index.tsx` | Create | Two-column: text right, image left |
| `components/Contact/index.tsx` | Create | Centered contact form with success state |
| `app/[locale]/page.tsx` | Modify | Add About + Contact to page composition |

---

## Task 1: Update Color System

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Replace color variables**

Open `app/globals.css`. Replace the 5 color lines inside `@theme inline { ... }`:

```css
@theme inline {
  --color-primary:       #1B7A4E;
  --color-accent:        #2D9E6B;
  --color-accent-light:  #48BB8A;
  --color-bg:            #FFFFFF;
  --color-bg-secondary:  #F2F9F5;
  --color-text-muted:    #4B5563;

  --font-sans: var(--font-ibm-arabic), system-ui, sans-serif;
}
```

- [ ] **Step 2: Update hero gradient keyframe** (hero uses `bg-primary` overlay — the `hero-gradient` class is no longer used but keep it updated for consistency)

Replace `.hero-gradient` block:

```css
.hero-gradient {
  background: linear-gradient(
    135deg,
    #1B7A4E 0%,
    #155E3A 30%,
    #1B7A4E 55%,
    #0F4A2E 80%,
    #2D9E6B 100%
  );
  background-size: 300% 300%;
  animation: gradient-shift 12s ease infinite;
}
```

- [ ] **Step 3: Commit**

```bash
git add jar-landing/app/globals.css
git commit -m "design: update color system to medium green (#1B7A4E)"
```

---

## Task 2: Update Arabic Translations

**Files:**
- Modify: `messages/ar.json`

- [ ] **Step 1: Update `nav` section**

Replace the entire `"nav"` object:

```json
"nav": {
  "home": "الرئيسية",
  "about_label": "عن جار",
  "services": "الخدمات",
  "login": "تسجيل الدخول",
  "register": "إنشاء حساب",
  "cta": "تواصل معنا"
},
```

- [ ] **Step 2: Update `hero` section**

Replace the entire `"hero"` object:

```json
"hero": {
  "headline": "ندير مجتمعاتك بذكاء... لنرتقي بتجربة المقيمين",
  "subheadline": "جار تربط المطور العقاري والساكن ومزود الخدمة في منظومة رقمية واحدة.",
  "cta_primary": "ابدأ الآن",
  "cta_secondary": "احجز عرض توضيحي"
},
```

- [ ] **Step 3: Add `about` section** (insert after the `"hero"` object)

```json
"about": {
  "badge": "من نحن",
  "title": "منصة سعودية تربط كل أطراف المجتمع السكني",
  "body": "جار تجمع المطور العقاري والساكن ومزود الخدمة في منظومة رقمية واحدة — لإدارة أذكى وتجربة أفضل لكل طرف.",
  "point1": "إدارة شاملة للوحدات والسكان",
  "point2": "متابعة الصيانة والخدمات لحظياً",
  "point3": "تقارير وبيانات في متناول يدك"
},
```

- [ ] **Step 4: Commit**

```bash
git add jar-landing/messages/ar.json
git commit -m "i18n: add about section + update nav and hero keys (AR)"
```

---

## Task 3: Update English Translations

**Files:**
- Modify: `messages/en.json`

- [ ] **Step 1: Update `nav` section**

Replace the entire `"nav"` object:

```json
"nav": {
  "home": "Home",
  "about_label": "About JAR",
  "services": "Services",
  "login": "Sign In",
  "register": "Get Started",
  "cta": "Contact Us"
},
```

- [ ] **Step 2: Update `hero` section**

Replace the entire `"hero"` object:

```json
"hero": {
  "headline": "Smarter community management. Better resident experience.",
  "subheadline": "JAR connects developers, residents, and service providers in one unified platform.",
  "cta_primary": "Get Started",
  "cta_secondary": "Book a Demo"
},
```

- [ ] **Step 3: Add `about` section** (insert after `"hero"`)

```json
"about": {
  "badge": "About Us",
  "title": "A Saudi platform connecting every stakeholder in residential communities",
  "body": "JAR brings developers, residents, and service providers together in one digital system — for smarter management and a better experience for everyone.",
  "point1": "Full unit and resident management",
  "point2": "Real-time maintenance and service tracking",
  "point3": "Live reports and data at your fingertips"
},
```

- [ ] **Step 4: Commit**

```bash
git add jar-landing/messages/en.json
git commit -m "i18n: add about section + update nav and hero keys (EN)"
```

---

## Task 4: Update Hero Component

**Files:**
- Modify: `components/Hero/index.tsx`

No structural changes — only the translation keys change, so the component just needs the CTA `href` values confirmed.

- [ ] **Step 1: Verify CTA hrefs point to correct anchors**

Confirm line ~74 has `href="#contact"` for primary CTA and `href="#contact"` for secondary:

```tsx
<a
  href="#contact"
  className="px-8 py-3.5 rounded-full bg-accent text-white font-semibold hover:bg-accent-light transition-colors shadow-lg shadow-accent/25"
>
  {t('cta_primary')}
</a>
<a
  href="#contact"
  className="px-8 py-3.5 rounded-full border border-white/40 text-white font-semibold hover:bg-white/10 transition-colors backdrop-blur-sm"
>
  {t('cta_secondary')}
</a>
```

If `cta_secondary` points to `#solutions`, change it to `#contact`.

- [ ] **Step 2: Commit** (only if a change was made)

```bash
git add jar-landing/components/Hero/index.tsx
git commit -m "fix: point hero secondary CTA to #contact"
```

---

## Task 5: Update Navbar

**Files:**
- Modify: `components/Navbar/index.tsx`

- [ ] **Step 1: Replace navLinks array and add login/register buttons**

Replace the full file content with:

```tsx
'use client';
import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/navigation';
import Image from 'next/image';

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const switchLocale = () => {
    router.replace(pathname, { locale: locale === 'ar' ? 'en' : 'ar' });
  };

  const navLinks = [
    { key: 'home' as const, href: '#' },
    { key: 'about_label' as const, href: '#about' },
    { key: 'services' as const, href: '#solutions' },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href={`/${locale}`}>
          <Image
            src="/logo.svg"
            alt="JAR"
            width={72}
            height={36}
            className={scrolled ? '' : 'brightness-0 invert'}
          />
        </a>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ key, href }) => (
            <a
              key={key}
              href={href}
              className={`text-sm font-medium transition-colors ${
                scrolled ? 'text-primary hover:text-accent' : 'text-white/80 hover:text-white'
              }`}
            >
              {t(key)}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={switchLocale}
            className={`text-sm font-medium px-3 py-1 rounded-full border transition-colors ${
              scrolled
                ? 'border-primary/20 text-primary hover:border-accent hover:text-accent'
                : 'border-white/30 text-white hover:border-white'
            }`}
            aria-label="Switch language"
          >
            {locale === 'ar' ? 'EN' : 'AR'}
          </button>

          <a
            href="#contact"
            className={`hidden md:inline-flex items-center px-5 py-2 rounded-full border text-sm font-semibold transition-colors ${
              scrolled
                ? 'border-primary/20 text-primary hover:border-accent hover:text-accent'
                : 'border-white/40 text-white hover:bg-white/10'
            }`}
          >
            {t('login')}
          </a>

          <a
            href="#contact"
            className="hidden md:inline-flex items-center px-5 py-2 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent-light transition-colors"
          >
            {t('register')}
          </a>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add jar-landing/components/Navbar/index.tsx
git commit -m "feat: update navbar — new nav links + login/register buttons"
```

---

## Task 6: Fetch About Image

**Files:**
- Create: `public/about-image.jpg`

- [ ] **Step 1: Download a high-quality luxury residential interior image**

Use `curl` to download from Unsplash (vibrant modern lobby or amenity area, warm-lit, premium feel):

```bash
curl -L "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1400&q=85&fm=jpg&fit=crop" \
  -o jar-landing/public/about-image.jpg
```

If that URL fails, use this alternative (modern luxury apartment interior):
```bash
curl -L "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1400&q=85&fm=jpg&fit=crop" \
  -o jar-landing/public/about-image.jpg
```

- [ ] **Step 2: Verify the file exists and is not 0 bytes**

```bash
ls -lh jar-landing/public/about-image.jpg
```

Expected: file size between 200KB–600KB

- [ ] **Step 3: Commit**

```bash
git add jar-landing/public/about-image.jpg
git commit -m "assets: add about section hero image"
```

---

## Task 7: Create About Component

**Files:**
- Create: `components/About/index.tsx`

- [ ] **Step 1: Create the component file**

Create `jar-landing/components/About/index.tsx` with this content:

```tsx
'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function About() {
  const t = useTranslations('about');

  return (
    <section id="about" className="py-24 bg-bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Image — appears on left in RTL layout */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-2 lg:order-1"
          >
            <div className="relative h-[480px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/about-image.jpg"
                alt="JAR residential community"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Subtle green tint overlay for brand cohesion */}
              <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
            </div>
          </motion.div>

          {/* Text — appears on right in RTL layout */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="order-1 lg:order-2"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              {t('badge')}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 leading-snug">
              {t('title')}
            </h2>
            <p className="text-text-muted text-lg leading-relaxed mb-8">
              {t('body')}
            </p>
            <ul className="space-y-4">
              {(['point1', 'point2', 'point3'] as const).map((key) => (
                <li key={key} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center mt-0.5 shrink-0">
                    <svg
                      className="w-3.5 h-3.5 text-accent"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-primary font-medium">{t(key)}</span>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add jar-landing/components/About/index.tsx
git commit -m "feat: add About section — two-column layout with vibrant image"
```

---

## Task 8: Create Contact Component

**Files:**
- Create: `components/Contact/index.tsx`

- [ ] **Step 1: Create the component file**

Create `jar-landing/components/Contact/index.tsx` with this content:

```tsx
'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function Contact() {
  const t = useTranslations('contact');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-2xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">{t('title')}</h2>
          <p className="text-text-muted">{t('subtitle')}</p>
        </motion.div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-16 px-8 rounded-2xl bg-bg-secondary"
          >
            <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-primary mb-3">{t('success_title')}</h3>
            <p className="text-text-muted">{t('success_message')}</p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">{t('name')}</label>
                <input
                  type="text"
                  required
                  placeholder={t('placeholder_name')}
                  className="w-full px-4 py-3 rounded-xl border border-primary/15 text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">{t('email')}</label>
                <input
                  type="email"
                  required
                  placeholder={t('placeholder_email')}
                  className="w-full px-4 py-3 rounded-xl border border-primary/15 text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">{t('phone')}</label>
                <input
                  type="tel"
                  placeholder={t('placeholder_phone')}
                  className="w-full px-4 py-3 rounded-xl border border-primary/15 text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">{t('company')}</label>
                <input
                  type="text"
                  placeholder={t('placeholder_company')}
                  className="w-full px-4 py-3 rounded-xl border border-primary/15 text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">{t('message')}</label>
              <textarea
                rows={4}
                placeholder={t('placeholder_message')}
                className="w-full px-4 py-3 rounded-xl border border-primary/15 text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-accent text-white font-semibold text-base hover:bg-accent-light transition-colors shadow-md shadow-accent/20"
            >
              {t('submit')}
            </button>
          </motion.form>
        )}

      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add jar-landing/components/Contact/index.tsx
git commit -m "feat: add Contact section with form + success state"
```

---

## Task 9: Update Page Composition

**Files:**
- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1: Add About and Contact to the page**

Replace the `Home` function (keep `generateMetadata` unchanged):

```tsx
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Solutions from '@/components/Solutions';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === 'ar';

  return {
    title: isAr
      ? 'JAR — نظام التشغيل الذكي للمجتمعات السكنية'
      : 'JAR — Intelligent OS for Residential Communities',
    description: isAr
      ? 'إدارة. خدمة. ذكاء. كل شيء في منصة واحدة. أول منصة سعودية تجمع المطور والسكان ومزود الخدمة.'
      : 'Manage. Serve. Predict. Everything in one platform. Saudi-first. Resident-centric. AI-powered.',
    openGraph: {
      title: isAr ? 'JAR — نظام التشغيل الذكي' : 'JAR — Intelligent OS',
      description: isAr
        ? 'منصة إدارة المجتمعات السكنية الذكية'
        : 'Smart Residential Community Management',
      url: 'https://jarsaudi.com',
      siteName: 'JAR',
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'JAR',
      description: isAr
        ? 'نظام التشغيل الذكي للمجتمعات السكنية'
        : 'Intelligent OS for Residential Communities',
    },
    alternates: {
      canonical: `https://jarsaudi.com/${locale}`,
      languages: {
        ar: 'https://jarsaudi.com/ar',
        en: 'https://jarsaudi.com/en',
      },
    },
  };
}

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

- [ ] **Step 2: Commit**

```bash
git add jar-landing/app/[locale]/page.tsx
git commit -m "feat: wire About + Contact into page composition"
```

---

## Task 10: Visual Verification

- [ ] **Step 1: Start dev server**

```bash
cd jar-landing && npm run dev
```

Expected: server starts on `http://localhost:3000`

- [ ] **Step 2: Open Arabic locale and verify**

Navigate to `http://localhost:3000/ar` and check:
- Navbar is green with "الرئيسية / عن جار / الخدمات" + two right-side buttons
- Hero overlay is green (not navy)
- Hero text reads "ندير مجتمعاتك بذكاء..."
- About section appears: text on right, image on left, green badge
- Solutions bento grid has green large cards (not navy)
- Contact form renders correctly
- Footer is green

- [ ] **Step 3: Check English locale**

Navigate to `http://localhost:3000/en` and verify same sections in English.

- [ ] **Step 4: Test contact form success state**

Fill the form and submit — verify the success message appears and form disappears.

- [ ] **Step 5: Final commit if any fixes were needed**

```bash
git add -p
git commit -m "fix: visual verification corrections"
```
