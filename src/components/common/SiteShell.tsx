import BackToTop from '@/components/common/BackToTop';
import Footer from '@/components/common/Footer';
import Navbar from '@/components/common/Navbar';
import React from 'react';

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <BackToTop />
    </>
  );
}
