import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import WhoFor from '@/components/WhoFor';
import Solutions from '@/components/Solutions';
import Problem from '@/components/Problem';
import HowItWorks from '@/components/HowItWorks';
import FAQ from '@/components/FAQ';
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
      ? 'منصة واحدة. أربعة أطراف. نظام بيئي متكامل. أول منصة سعودية تجمع المطور والسكان ومزود الخدمة.'
      : 'One Platform. Four Stakeholders. One Ecosystem. Saudi-first. Resident-centric. AI-powered.',
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
      <WhoFor />
      <Solutions />
      <Problem />
      <HowItWorks />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}
